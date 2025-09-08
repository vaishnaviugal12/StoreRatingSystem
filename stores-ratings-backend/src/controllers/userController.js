import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";

// --- List all stores with optional search ---
export const listStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        name: { contains: name || "" },
        address: { contains: address || "" },
      },
      include: {
        ratings: true,
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    const storesWithUserRating = stores.map((store) => {
      const avgRating =
        store.ratings.reduce((acc, r) => acc + r.score, 0) / (store.ratings.length || 1);

      const userRating = store.ratings.find((r) => r.userId === req.user.id)?.score || null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        owner: store.owner,
        avgRating,
        userRating,
      };
    });

    res.json(storesWithUserRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Submit or Update Rating ---
export const submitRating = async (req, res) => {
  try {
    const { storeId, score } = req.body;

    if (!storeId || !score || score < 1 || score > 5)
      return res.status(400).json({ error: "Invalid store or score" });

    const existingRating = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } },
    });

    if (existingRating) {
      // Update existing rating
      const updated = await prisma.rating.update({
        where: { userId_storeId: { userId: req.user.id, storeId } },
        data: { score },
      });
      return res.json({ message: "Rating updated", rating: updated });
    } else {
      // Create new rating
      const newRating = await prisma.rating.create({
        data: { userId: req.user.id, storeId, score },
      });
      return res.json({ message: "Rating submitted", rating: newRating });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Update password ---
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validOld = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!validOld) return res.status(400).json({ error: "Old password incorrect" });

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(newPassword))
      return res.status(400).json({ error: "Password does not meet requirements" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash: hashed } });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

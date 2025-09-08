import { prisma } from "../prisma.js";

// --- Store Owner Dashboard ---
export const getDashboard = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      where: { ownerId: req.user.id },
      include: {
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      },
    });

    const dashboard = stores.map((store) => {
      const avgRating =
        store.ratings.reduce((acc, r) => acc + r.score, 0) / (store.ratings.length || 1);

      const userRatings = store.ratings.map((r) => ({
        userId: r.userId,
        score: r.score,
        ratedAt: r.createdAt,
        user: r.user, // includes name and email
      }));

      return {
        storeId: store.id,
        storeName: store.name,
        address: store.address,
        avgRating,
        userRatings,
      };
    });

    res.json({ dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// --- Update Password for Store Owner ---
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const bcrypt = await import("bcrypt");
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

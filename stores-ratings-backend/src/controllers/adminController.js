import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";

// --- Dashboard ---
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Add User (Normal User / Admin) ---
export const addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !address || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, address, passwordHash, role },
    });

    res.status(201).json({ message: "User added successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- List Users (with optional filters) ---
export const listUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    const users = await prisma.user.findMany({
      where: {
        name: { contains: name || "" },
        email: { contains: email || "" },
        address: { contains: address || "" },
        role: role || undefined,
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Add Store ---
// --- Add Store ---
export const addStore = async (req, res) => {
  try {
    const { name, address, ownerId } = req.body;
    if (!name || !address)
      return res.status(400).json({ error: "Name and address required" });

    const store = await prisma.store.create({
      data: { name, address, ownerId: ownerId || null },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: true,
      },
    });

    // Calculate avg rating for new store
    const avgRating =
      store.ratings.reduce((acc, r) => acc + r.score, 0) /
      (store.ratings.length || 1);

    res
      .status(201)
      .json({ message: "Store added successfully", store: { ...store, avgRating } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// --- List Stores (with optional filters) ---
export const listStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        name: { contains: name || "" },
        address: { contains: address || "" },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: true,
      },
    });

    // Calculate average rating
    const storesWithAvg = stores.map((store) => {
      const avgRating =
        store.ratings.reduce((acc, r) => acc + r.score, 0) / (store.ratings.length || 1);
      return { ...store, avgRating };
    });

    res.json(storesWithAvg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

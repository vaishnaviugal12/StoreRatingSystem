import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Signup for normal users
export const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // Basic validations
    if (!name || !email || !address || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Password rules: 8-16 chars, at least 1 uppercase & 1 special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password does not meet requirements" });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        passwordHash: hashedPassword,
        role: "USER", // normal user
      },
    });

    res.status(201).json({ message: "User created successfully", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Login for all users (Admin / User / Owner)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import redisClient from "./redis.js";  // your redis config file
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";

const app = express();
app.use(cors({
     origin: "http://localhost:5173",
     credentials :true
}));
dotenv.config();

app.use(express.json());

const prisma = new PrismaClient();

// Example route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});
// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);

const startServer = async () => {
  try {
    // Connect Prisma (PostgreSQL)
    await prisma.$connect();
    console.log("PostgreSQL connected ✅");

    // Connect Redis
    await redisClient.connect();
    console.log("Redis connected ✅");

    // Start Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (err) {
    console.error("Error starting server:", err.message);
    process.exit(1);
  }
};

startServer();






















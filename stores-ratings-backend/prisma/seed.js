import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- Seed Admin ---
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@system.com" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@system.com",
      address: "Head Office",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  // --- Seed Normal Users ---
  const userPasswordHash = await bcrypt.hash("User@123", 10);
  const users = [
    { name: "Alice Example", email: "alice@example.com", address: "City A", role: "USER" },
    { name: "Bob Example", email: "bob@example.com", address: "City B", role: "USER" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: userPasswordHash },
    });
  }

  // --- Seed Store Owners ---
  const ownerPasswordHash = await bcrypt.hash("Owner@123", 10);
  const owners = [
    { name: "John Owner", email: "john@store.com", address: "City X", role: "OWNER" },
    { name: "Jane Owner", email: "jane@store.com", address: "City Y", role: "OWNER" },
  ];

  for (const o of owners) {
    await prisma.user.upsert({
      where: { email: o.email },
      update: {},
      create: { ...o, passwordHash: ownerPasswordHash },
    });
  }

  // --- Seed Stores ---
  const stores = [
    { name: "Pizza Paradise", address: "Street 1, City A", ownerEmail: "john@store.com" },
    { name: "Burger Hub", address: "Street 2, City B", ownerEmail: "jane@store.com" },
  ];

  for (const s of stores) {
    const owner = await prisma.user.findUnique({ where: { email: s.ownerEmail } });
    await prisma.store.upsert({
      where: { name: s.name }, // works now because name is unique
      update: {},
      create: { name: s.name, address: s.address, ownerId: owner.id },
    });
  }

  // --- Seed Ratings ---
  const allUsers = await prisma.user.findMany({ where: { role: "USER" } });
  const allStores = await prisma.store.findMany();

  for (const user of allUsers) {
    for (const store of allStores) {
      await prisma.rating.upsert({
        where: { userId_storeId: { userId: user.id, storeId: store.id } },
        update: {},
        create: { userId: user.id, storeId: store.id, score: Math.floor(Math.random() * 5) + 1 },
      });
    }
  }

  console.log(" Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

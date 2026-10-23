import "dotenv/config";
import readline from "node:readline";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not configured in your .env file.",
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("");
  console.log("==========================================");
  console.log("   Lifeline Achham - Super Admin Setup");
  console.log("==========================================");
  console.log("");

  const name = (await question("Full name: ")).trim();

  const email = (await question("Email address: "))
    .trim()
    .toLowerCase();

  const password = await question("Password: ");

  console.log("");

  if (!name) {
    throw new Error("Full name is required.");
  }

  if (!email) {
    throw new Error("Email address is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  if (password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters.",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error(
      `A user with the email "${email}" already exists.`,
    );
  }

  console.log("Creating secure password hash...");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  console.log("");
  console.log("==========================================");
  console.log("       Super Admin Created Successfully");
  console.log("==========================================");
  console.log("");
  console.log(`Name:      ${user.name}`);
  console.log(`Email:     ${user.email}`);
  console.log(`Role:      ${user.role}`);
  console.log(`Active:    ${user.isActive}`);
  console.log(`User ID:   ${user.id}`);
  console.log(
    `Created:   ${user.createdAt.toLocaleString()}`,
  );
  console.log("");
  console.log("Login:");
  console.log("http://localhost:3000/login");
  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error("==========================================");
    console.error("              SETUP FAILED");
    console.error("==========================================");
    console.error("");
    console.error(error.message);
    console.error("");
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });

/**
 * Seed a demo user account for Apple App Review testing.
 * Run with: npx ts-node scripts/seed-demo.ts
 *
 * Demo credentials:
 *   Email: demo@localdiscover.com
 *   Password: DemoPass123!
 *   Role: BUSINESS
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@localdiscover.com";
  const password = "DemoPass123!";

  // Check if demo user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Demo user already exists (id: ${existing.id}). Skipping.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 14);

  const user = await prisma.user.create({
    data: {
      name: "Demo Business Owner",
      email,
      password: hashed,
      role: "BUSINESS",
    },
  });

  console.log(`Demo user created:`);
  console.log(`  ID:    ${user.id}`);
  console.log(`  Email: ${email}`);
  console.log(`  Pass:  ${password}`);
  console.log(`  Role:  ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

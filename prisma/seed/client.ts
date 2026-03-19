import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };

/** Helper to log seed progress */
export function logSection(name: string) {
  console.log(`\n  ▸ Seeding ${name}...`);
}

export function logCount(name: string, count: number) {
  console.log(`    ${count} ${name}`);
}

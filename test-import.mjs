import { prisma } from "./apps/api/src/lib/prisma.js";
console.log("Prisma imported:", typeof prisma);
console.log("Prisma.user:", typeof prisma.user);
if (prisma.user) {
  const count = await prisma.user.count();
  console.log("User count:", count);
}
await prisma.$disconnect();

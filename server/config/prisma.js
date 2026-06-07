const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

let prisma = globalForPrisma.prisma;

if (!prisma) {
  prisma = new PrismaClient();
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;

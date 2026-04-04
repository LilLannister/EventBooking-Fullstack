import { PrismaClient } from "@prisma/client";
// Imports PrismaClient from Prisma package
// PrismaClient is used to send queries to the database

const globalForPrisma = globalThis;
// Stores the global object in a variable
// We use this to keep one Prisma instance globally in development mode


const prisma = globalForPrisma.prisma || new PrismaClient();
// If a Prisma instance already exists on the global object, use it. Otherwise, create a new PrismaClient instance
// This prevents creating too many Prisma connections during development

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
// In development mode, save the Prisma instance on the global object. This is useful because Next.js may reload files many times while developing
// Without this, a new PrismaClient could be created on every reload

export default prisma;
// Exports the Prisma instance
// Other files can import this and use the same database connection




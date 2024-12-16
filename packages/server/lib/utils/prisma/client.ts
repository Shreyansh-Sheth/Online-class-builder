import p from "@tutor/db";

const { PrismaClient } = p;

const prismaClient = new PrismaClient();

export { prismaClient };

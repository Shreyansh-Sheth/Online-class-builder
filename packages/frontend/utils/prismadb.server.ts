import p from "@tutor/db";
const { PrismaClient } = p;
declare global {
  var prisma: any;
}
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;

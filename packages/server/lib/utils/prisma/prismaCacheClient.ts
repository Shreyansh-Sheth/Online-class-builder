import P from "@tutor/db";

const { PrismaClient, Prisma, prisma } = P;
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

const cachePrismaClient = new PrismaClient();

const property = Prisma.dmmf.datamodel.models.map((e) => ({
  model: e.name,
  cacheTime: 200,
}));
if (!REDIS_URL) {
  throw new Error("No Redis URL provided");
}
const redis = new Redis(REDIS_URL);

const cacheMiddleware = createPrismaRedisCache({
  models: property,
  storage: {
    type: "redis",
    options: {
      client: redis,
    },
  },
  //   cacheTime: 300,
  onHit: (key) => {
    // console.log("hit", key);
    // console.log("hit");
  },
  onMiss: (key) => {
    // console.log("miss", key);
    // console.log("miss");
  },
  onError: (key) => {
    // console.log("error");
    // console.log("error", key);
  },
});

// cachePrismaClient.$use(cacheMiddleware);
export { cachePrismaClient };

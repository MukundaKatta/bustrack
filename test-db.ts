import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$connect();
  console.log("Connected to Neon successfully!");
}

main()
  .catch((e) => {
    console.error("Connection failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

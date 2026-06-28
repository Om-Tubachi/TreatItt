import dotenv from "dotenv";
dotenv.config();
import {PrismaPg} from "@prisma/adapter-pg";
import pkg from '@prisma/client';
const {PrismaClient} = pkg;

const connectionString = `${process.env.POOL_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };
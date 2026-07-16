import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from "../db/prisma.js";

class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(data, isOAuth) {

        if (isOAuth) {
            return this.prisma.users.create({
                data: { ...data }
            });
        }
        const hashed = await bcrypt.hash(data.password, 10);
        return this.prisma.users.create({
            data: { ...data, password: hashed }
        });
    }

    async getUserById(userId) {
        return this.prisma.users.findUnique({
            where: { id: userId },
            omit: { password: true, refresh_token: true }
        });
    }

    async isPasswordCorrect(userId, password) {
        const user = await this.prisma.users.findUnique({ where: { id: userId } });
        return bcrypt.compare(password, user.password);
    }

    generateAccessToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
    }

    generateRefreshToken(user) {
        return jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );
    }

    async updatePassword(userId, newPassword) {
        const user = await prisma.users.findUnique({ where: { id: userId } });

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) return; // equivalent of isModified check

        const hashed = await bcrypt.hash(newPassword, 10);
        return prisma.users.update({
            where: { id: userId },
            data: { password: hashed }
        });
    }

    // §1.5 — username search, entirely new. Deliberately omits any `collectors`
    // relation per the master doc's out-of-scope rule.
    async searchByUsername(query, limit = 20) {
        if (!query || !query.trim()) return [];
        return this.prisma.users.findMany({
            where: { username: { contains: query.trim(), mode: 'insensitive' } },
            take: limit,
            select: {
                id: true, username: true, first_name: true, last_name: true,
                company_name: true, designation: true,
                recyclers: { select: { id: true } },
                manufacturing_processes: { select: { id: true }, take: 1 },
                frp_requirements: { select: { id: true }, take: 1 },
            }
        });
    }
}

export const userService = new UserService(prisma);
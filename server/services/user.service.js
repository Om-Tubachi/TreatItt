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
                data: { ...data, password: hashed }
            });
        }
        const hashed = await bcrypt.hash(data.password, 10);
        return this.prisma.users.create({
            data: { ...data, password: hashed }
        });
    }

    async isPasswordCorrect(userId, password) {
        const user = await this.prisma.users.findUnique({ where: { id: userId } });
        return bcrypt.compare(password, user.password);
    }

    generateAccessToken(user) {
        return jwt.sign(
            { _id: user.id, email: user.email, username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
    }

    generateRefreshToken(user) {
        return jwt.sign(
            { _id: user.id },
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
}

export const userService = new UserService(prisma);
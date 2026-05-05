import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

export const createShop = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        const userId = req.userId;

        if (!name) {
            return sendResponse(res, 400, false, null, "Shop name is required.");
        }

        if (!userId) {
            return sendResponse(res, 401, false, null, "Unauthorized action.");
        }

        // Ensure user exists in our DB to satisfy the foreign key constraint
        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            user = await prisma.user.create({
                data: { id: userId, email: `${userId}@auth-placeholder.com` }
            });
        }

        const newShop = await prisma.shop.create({
            data: {
                name,
                ownerId: userId,
            }
        });

        return sendResponse(res, 201, true, newShop, "Shop created successfully.");
    } catch (error: any) {
        console.error("Error creating shop:", error);
        return sendResponse(res, 500, false, null, "Internal server error while creating shop.");
    }
};
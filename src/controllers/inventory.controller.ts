import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendResponse } from '../utils/response';

const prisma = new PrismaClient();

export const addStock = async (req: Request, res: Response) => {
    try {
        const { shopId, medicineId, quantity, price, batchNumber, expiryDate } = req.body;

        if (!shopId || !medicineId || quantity === undefined || price === undefined) {
            return sendResponse(res, 400, false, null, "shopId, medicineId, quantity, and price are required.");
        }

        const inventory = await prisma.inventory.upsert({
            where: {
                shopId_medicineId: {
                    shopId,
                    medicineId,
                }
            },
            update: {
                quantity: {
                    increment: quantity
                },
                price: price,
                batchNumber: batchNumber !== undefined ? batchNumber : undefined,
                expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            },
            create: {
                shopId,
                medicineId,
                quantity,
                price,
                batchNumber,
                expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            }
        });

        return sendResponse(res, 200, true, inventory, "Stock added/updated successfully.");
    } catch (error: any) {
        console.error("Error adding stock:", error);
        return sendResponse(res, 500, false, null, "Internal server error while adding stock.");
    }
};

export const getShopInventory = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.shopId;

        if (!shopId) {
            return sendResponse(res, 400, false, null, "shopId is required.");
        }

        const inventory = await prisma.inventory.findMany({
            where: { shopId: String(shopId) },
            include: {
                medicine: true
            }
        });

        return sendResponse(res, 200, true, inventory, "Shop inventory retrieved successfully.");
    } catch (error: any) {
        console.error("Error retrieving shop inventory:", error);
        return sendResponse(res, 500, false, null, "Internal server error while retrieving shop inventory.");
    }
};
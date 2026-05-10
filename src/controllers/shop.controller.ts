import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendResponse } from '../utils/response';

const prisma = new PrismaClient();

export const createShop = async (req: Request, res: Response) => {
    try {
        const { name, ownerId } = req.body;

        if (!name || !ownerId) {
            return sendResponse(res, 400, false, null, "Name and ownerId are required.");
        }

        const newShop = await prisma.shop.create({
            data: {
                name,
                ownerId,
            }
        });

        return sendResponse(res, 201, true, newShop, "Shop created successfully.");
    } catch (error: any) {
        console.error("Error creating shop:", error);
        return sendResponse(res, 500, false, null, "Internal server error while creating shop.");
    }
};

export const getShops = async (req: Request, res: Response) => {
    try {
        const shops = await prisma.shop.findMany();
        return sendResponse(res, 200, true, shops, "Shops retrieved successfully.");
    } catch (error: any) {
        console.error("Error getting shops:", error);
        return sendResponse(res, 500, false, null, "Internal server error while retrieving shops.");
    }
};

export const getShopAnalytics = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.shopId;

        if (!shopId) {
            return sendResponse(res, 400, false, null, "shopId is required.");
        }

        const aggregations = await prisma.sale.aggregate({
            _sum: {
                total: true
            },
            where: {
                shopId: String(shopId)
            }
        });

        const totalRevenue = aggregations._sum.total || 0;

        return sendResponse(res, 200, true, { totalRevenue }, "Shop analytics retrieved successfully.");
    } catch (error: any) {
        console.error("Error getting shop analytics:", error);
        return sendResponse(res, 500, false, null, "Internal server error while retrieving analytics.");
    }
};

export const getLowStockAlerts = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.shopId;

        if (!shopId) {
            return sendResponse(res, 400, false, null, "shopId is required.");
        }

        const lowStockInventory = await prisma.inventory.findMany({
            where: {
                shopId: String(shopId),
                quantity: {
                    lt: 10
                }
            },
            include: {
                medicine: true
            }
        });

        const medicines = lowStockInventory.map((item: any) => item.medicine);

        return sendResponse(res, 200, true, medicines, "Low stock alerts retrieved successfully.");
    } catch (error: any) {
        console.error("Error getting low stock alerts:", error);
        return sendResponse(res, 500, false, null, "Internal server error while retrieving low stock alerts.");
    }
};
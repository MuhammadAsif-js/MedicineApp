import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendResponse } from '../utils/response';

const prisma = new PrismaClient();

export const checkout = async (req: Request, res: Response) => {
    try {
        const { shopId, items } = req.body;

        if (!shopId || !items || !Array.isArray(items) || items.length === 0) {
            return sendResponse(res, 400, false, null, "shopId and a non-empty items array are required.");
        }

        let saleResult;

        try {
            saleResult = await prisma.$transaction(async (tx) => {
                let total = 0;
                const saleItemsData = [];

                for (const item of items) {
                    const { medicineId, quantity } = item;

                    if (!medicineId || !quantity || quantity <= 0) {
                        throw new Error("Invalid item format.");
                    }

                    const inventoryRecord = await tx.inventory.findUnique({
                        where: {
                            shopId_medicineId: {
                                shopId,
                                medicineId
                            }
                        }
                    });

                    if (!inventoryRecord || inventoryRecord.quantity < quantity) {
                        throw new Error(`Not enough inventory for medicineId: ${medicineId}`);
                    }

                    total += inventoryRecord.price * quantity;

                    saleItemsData.push({
                        medicineId,
                        quantity,
                        price: inventoryRecord.price
                    });

                    await tx.inventory.update({
                        where: {
                            shopId_medicineId: {
                                shopId,
                                medicineId
                            }
                        },
                        data: {
                            quantity: {
                                decrement: quantity
                            }
                        }
                    });
                }

                const sale = await tx.sale.create({
                    data: {
                        shopId,
                        total,
                        items: {
                            create: saleItemsData
                        }
                    },
                    include: {
                        items: true
                    }
                });

                return sale;
            });
        } catch (transactionError: any) {
            return sendResponse(res, 400, false, null, transactionError.message);
        }

        return sendResponse(res, 201, true, saleResult, "Checkout completed successfully.");
    } catch (error: any) {
        console.error("Error during checkout:", error);
        return sendResponse(res, 500, false, null, "Internal server error during checkout.");
    }
};
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendResponse } from '../utils/response';

const prisma = new PrismaClient();

export const addMedicine = async (req: Request, res: Response) => {
  try {
    const { name, genericName, manufacturer, strength, category } = req.body;
    const newMedicine = await prisma.medicine.create({
      data: { name, genericName, manufacturer, strength, category }
    });
    return sendResponse(res, 201, newMedicine, "Medicine added successfully.");
  } catch (error) {
    return sendResponse(res, 500, null, "Failed to add medicine.");
  }
};

export const getMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await prisma.medicine.findMany();
    return sendResponse(res, 200, medicines, "Medicines retrieved successfully.");
  } catch (error) {
    return sendResponse(res, 500, null, "Failed to fetch medicines.");
  }
};
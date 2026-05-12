import { Response } from 'express';

export const sendResponse = <T>(
    res: Response, 
    statusCode: number, 
    success: boolean, 
    data: T | null = null,
    message: string = ""
) => {
    return res.status(statusCode).json({
        success,
        data,
        message,
    });
};
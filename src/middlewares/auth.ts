import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendResponse } from '../utils/response';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthRequest extends Request {
    userId?: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return sendResponse(res, 401, false, null, "Access denied. No token provided.");
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return sendResponse(res, 401, false, null, "Invalid or expired token.");
        }

        req.userId = user.id;
        next();
    } catch (error) {
        return sendResponse(res, 500, false, null, "Authentication error.");
    }
};
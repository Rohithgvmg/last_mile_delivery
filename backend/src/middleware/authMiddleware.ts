import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
    userId: number;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthPayload;
}

const JWT_SECRET = process.env.JWT_SECRET;


if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    const token = authHeader.split(" ")[1];
    if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as AuthPayload;

        req.user = decoded;

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}

// this verifies the token from the request
// and if suceeds, attaches req.user.userId and 
//req.user.role


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SECURITY REQUIREMENT STRICT ENFORCEMENT
if (!process.env.BCRYPT_SALT) {
    throw new Error("CRITICAL SECURITY ERROR: BCRYPT_SALT environment variable is not defined. Halting execution to prevent insecure fallbacks.");
}
if (!process.env.JWT_SECRET) {
    throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not defined.");
}

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT, 10);
if (isNaN(SALT_ROUNDS)) {
    throw new Error("CRITICAL SECURITY ERROR: BCRYPT_SALT must be a valid integer strictly defining the salt rounds (e.g., 10).");
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const signToken = (payload: { username: string; userId: string }): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (e) {
        return null;
    }
};

// import { betterAuth } from "better-auth/*";
import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log("middleware checker...", role);
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification required. Please verify your email!",
      });
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };
    if (role.length && !role.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden You don'n have permission to access this resources",
      });
    }
    next();
    console.log(session);
  };
};

export default auth;

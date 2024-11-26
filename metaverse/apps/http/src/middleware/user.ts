import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const token = header?.split(" ")[1];
  if (!token) {
    res.status(403).json({
      message: "Token Missing Unauthorized",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      role: "Admin" | "User";
      userId: string;
    };
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (e) {
    res.status(401).json({
      message: "Unauthenticated",
    });
    return;
  }
};

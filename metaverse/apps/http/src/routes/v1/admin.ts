import { signinSchema, signupSchema } from "@repo/zod/types";
import { Router } from "express";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const parsedData = signupSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  const existingUser = await client.user.findUnique({
    where: {
      username: parsedData.data.username,
    },
  });
  if (existingUser) {
    res.status(400).json({
      message: "User already exists",
    });
    return;
  }
  try {
    const createdUser = await client.user.create({
      data: {
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: parsedData.data.password,
        role: "Admin",
      },
    });
    res.status(200).json({
      userId: createdUser.id,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }
    if (parsedData.data.password !== user.password) {
      res.status(401).json({
        message: "Invalid Credentials",
      });
      return;
    }
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET
    );
    res.status(200).json({
      token,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

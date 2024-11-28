import {
  createAvatarSchema,
  createElementSchema,
  createMapSchema,
  signinSchema,
  signupSchema,
  updateElementSchema,
} from "@repo/zod/types";
import { Router } from "express";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { adminMiddleware } from "../../middleware/admin";

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

adminRouter.post("/avatar", adminMiddleware, async (req, res) => {
  const parsedData = createAvatarSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  try {
    const createAvatarResponse = await client.avatar.create({
      data: {
        imageUrl: parsedData.data.imageUrl,
        name: parsedData.data.name,
      },
    });
    res.status(200).json({
      avatarId: createAvatarResponse.id,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

adminRouter.post("/element", adminMiddleware, async (req, res) => {
  const parsedData = createElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  try {
    const createElement = await client.element.create({
      data: {
        imageUrl: parsedData.data.imageUrl,
        width: parsedData.data.width,
        height: parsedData.data.height,
        static: parsedData.data.static,
      },
    });
    res.status(200).json({
      id: createElement.id,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

adminRouter.put("/element/:elementId", adminMiddleware, async (req, res) => {
  const elementId = req.params.elementId;
  const parsedData = updateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  try {
    const updateElement = await client.element.update({
      where: {
        id: elementId,
      },
      data: {
        imageUrl: parsedData.data.imageUrl,
      },
    });
    res.status(200).json({
      message: "Element Updated Successfully",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

adminRouter.post("/map", adminMiddleware, async (req, res) => {
  const parsedData = createMapSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  try {
    const createdMap = await client.map.create({
      data: {
        name: parsedData.data.name,
        thumbnail: parsedData.data.thumbnail,
        width: parsedData.data.width,
        height: parsedData.data.height,
        elements: {
          create: parsedData.data.defaultElements.map((e) => {
            return {
              elementId: e.elementId,
              x: e.x,
              y: e.y,
            };
          }),
        },
      },
    });
    res.status(200).json({
      id: createdMap.id,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

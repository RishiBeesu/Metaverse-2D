import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import client from "@repo/db/client";
import { spaceRouter } from "./space";

export const rootRouter = Router();

rootRouter.get("/avatars", async (req, res) => {
  try {
    const avatars = await client.avatar.findMany();
    res.status(200).json({
      avatars: avatars.map((avatar) => {
        return {
          id: avatar.id,
          imageUrl: avatar.imageUrl,
          name: avatar.name,
        };
      }),
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

rootRouter.get("/elements", async (req, res) => {
  try {
    const elements = await client.element.findMany({});
    res.status(200).json({
      elements: elements.map((e) => {
        return {
          id: e.id,
          height: e.height,
          width: e.width,
          imageUrl: e.imageUrl,
          static: e.static,
        };
      }),
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

rootRouter.use("/user", userRouter);
rootRouter.use("/admin", adminRouter);
rootRouter.use("/space", spaceRouter);

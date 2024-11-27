import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import client from "@repo/db/client";

export const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/admin", adminRouter);

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

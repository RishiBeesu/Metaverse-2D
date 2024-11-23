import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";

export const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/admin", adminRouter);

import { Router } from "express";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
import {
  addElementToSpaceSchema,
  createSpaceSchema,
  deleteElementOfSpaceSchema,
} from "@repo/zod/types";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  const parsedData = createSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  try {
    const createdSpace = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: parsedData.data.width,
        height: parsedData.data.height,
        mapId: parsedData.data.mapId,
        creatorId: req.userId!,
      },
    });
    res.status(200).json({
      spaceId: createdSpace.id,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
  const spaceId = req.params.spaceId;
  const existingSpace = await client.space.findUnique({
    where: {
      id: spaceId,
    },
  });
  if (!existingSpace) {
    res.status(400).json({
      message: "No space exists with given spaceId",
    });
    return;
  }
  if (existingSpace.creatorId !== req.userId) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }
  try {
    const deletedSpace = await client.space.delete({
      where: {
        id: spaceId,
      },
    });
    res.status(200).json({
      message: "Space deleted!",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

spaceRouter.get("/all", userMiddleware, async (req, res) => {
  try {
    const allSpaces = await client.space.findMany({
      where: {
        creatorId: req.userId,
      },
    });
    res.status(200).json({
      spaces: allSpaces,
    });
  } catch (e) {
    res.status(500).json("Internal Error");
  }
});

spaceRouter.get("/:spaceId", userMiddleware, async (req, res) => {
  const spaceId = req.params.spaceId;
  try {
    const reqSpace = await client.space.findUnique({
      where: {
        id: spaceId,
      },
      include: {
        elements: {
          include: {
            element: true,
          },
        },
      },
    });
    if (!reqSpace) {
      res.status(400).json({
        message: "No space exists with given spaceId",
      });
      return;
    }
    res.status(200).json(reqSpace);
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

spaceRouter.post("/element", userMiddleware, async (req, res) => {
  const parsedData = addElementToSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  try {
    const addedElementToSpace = client.spaceElements.create({
      data: {
        spaceId: parsedData.data.spaceId,
        elementId: parsedData.data.elementId,
        x: parsedData.data.x,
        y: parsedData.data.y,
      },
    });
    res.status(200).json({
      message: "Element added",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

spaceRouter.delete("/element", userMiddleware, async (req, res) => {
  const parsedData = deleteElementOfSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid Inputs",
    });
    return;
  }
  try {
    const deleteElementOfSpace = await client.spaceElements.delete({
      where: {
        id: parsedData.data.id,
      },
    });
    res.status(200).json({
      message: "Element deleted",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

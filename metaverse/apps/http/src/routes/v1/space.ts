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
  if (!parsedData.data.mapId) {
    try {
      const createdSpace = await client.space.create({
        data: {
          name: parsedData.data.name,
          width: parsedData.data.width,
          height: parsedData.data.height,
          creatorId: req.userId!,
        },
      });
      res.status(200).json({
        spaceId: createdSpace.id,
      });
      return;
    } catch (e) {
      res.status(500).json({
        message: "Internal Error",
      });
      return;
    }
  }
  let givenMap;
  try {
    givenMap = await client.map.findUnique({
      where: {
        id: parsedData.data.mapId,
      },
      select: {
        elements: true,
        width: true,
        height: true,
      },
    });
    if (!givenMap) {
      res.status(400).json({
        message: "Map not found",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
    return;
  }
  try {
    let createdSpace = await client.$transaction(async () => {
      const justSpace = await client.space.create({
        data: {
          name: parsedData.data.name,
          width: parsedData.data.width,
          height: parsedData.data.height,
          creatorId: req.userId!,
        },
      });

      await client.spaceElements.createMany({
        data: givenMap.elements.map((e) => {
          return {
            spaceId: justSpace.id,
            elementId: e.elementId,
            x: e.x,
            y: e.y,
          };
        }),
      });

      return justSpace;
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
      spaces: allSpaces.map((s) => {
        return {
          id: s.id,
          name: s.name,
          thumbnail: s.thumbnail,
          width: s.width,
          height: s.height,
        };
      }),
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
    res.status(200).json({
      width: reqSpace.width,
      height: reqSpace.height,
      elements: reqSpace.elements.map((e) => {
        return {
          id: e.id,
          element: {
            id: e.element.id,
            imageUrl: e.element.imageUrl,
            width: e.element.width,
            height: e.element.height,
            static: e.element.static,
          },
          x: e.x,
          y: e.y,
        };
      }),
    });
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
  let givenSpace;
  let givenElement;
  try {
    givenSpace = await client.space.findUnique({
      where: {
        id: parsedData.data.spaceId,
      },
    });
    if (!givenSpace) {
      res.status(400).json({
        message: "Space with spaceId doesn't exist",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
  try {
    givenElement = client.element.findUnique({
      where: {
        id: parsedData.data.elementId,
      },
    });
    if (!givenElement) {
      res.status(400).json({
        message: "Space with spaceId doesn't exist",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
  if (
    parsedData.data.x < 0 ||
    parsedData.data.y < 0 ||
    parsedData.data.x > givenSpace?.width! ||
    parsedData.data.y > givenSpace?.height!
  ) {
    res.status(400).json({ message: "Point is outside of the boundary" });
    return;
  }
  try {
    const addedElementToSpace = await client.spaceElements.create({
      data: {
        spaceId: parsedData.data.spaceId,
        elementId: parsedData.data.elementId,
        x: parsedData.data.x,
        y: parsedData.data.y,
      },
    });
    console.log(addedElementToSpace);
    res.status(200).json({
      message: "Element added",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

spaceRouter.delete("/element/:elementId", userMiddleware, async (req, res) => {
  const elementId = req.params.elementId;
  let givenSpaceElement;
  try {
    givenSpaceElement = await client.spaceElements.findUnique({
      where: {
        id: elementId,
      },
      include: {
        space: true,
      },
    });
    if (!givenSpaceElement) {
      res.status(400).json({
        message: "No spaceElement with given id",
      });
      return;
    }
    if (givenSpaceElement.space.creatorId !== req.userId) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
  try {
    const deleteElementOfSpace = await client.spaceElements.delete({
      where: {
        id: elementId,
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

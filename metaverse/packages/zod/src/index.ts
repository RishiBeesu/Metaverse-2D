import zod from "zod";

export const signupSchema = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

export const signinSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});

export const createAvatarSchema = zod.object({
  imageUrl: zod.string(),
  name: zod.string(),
});

export const updateUserAvatarSchema = zod.object({
  avatarId: zod.string(),
});

export const createElementSchema = zod.object({
  imageUrl: zod.string(),
  width: zod.number(),
  height: zod.number(),
  static: zod.boolean(),
});

export const updateElementSchema = zod.object({
  imageUrl: zod.string(),
});

export const createMapSchema = zod.object({
  name: zod.string(),
  thumbnail: zod.string().optional(),
  width: zod.number(),
  height: zod.number(),
  defaultElements: zod.array(
    zod.object({
      elementId: zod.string(),
      x: zod.number(),
      y: zod.number(),
    })
  ),
});

export type SignupSchema = zod.infer<typeof signupSchema>;
export type SigninSchema = zod.infer<typeof signinSchema>;
export type CreateAvatarSchema = zod.infer<typeof createAvatarSchema>;
export type UpdateUserAvatarSchema = zod.infer<typeof updateUserAvatarSchema>;
export type CreateElementSchema = zod.infer<typeof createElementSchema>;
export type UpdateElementSchema = zod.infer<typeof updateElementSchema>;
export type CreateMapSchema = zod.infer<typeof createMapSchema>;

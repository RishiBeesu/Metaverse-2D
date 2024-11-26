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

export type SignupSchema = zod.infer<typeof signupSchema>;
export type SigninSchema = zod.infer<typeof signinSchema>;
export type CreateAvatarSchema = zod.infer<typeof createAvatarSchema>;
export type UpdateUserAvatarSchema = zod.infer<typeof updateUserAvatarSchema>;

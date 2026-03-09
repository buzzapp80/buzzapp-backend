import * as yup from "yup";

export const updateProfileSchema = yup.object({
  body: yup.object({
    avatar_url: yup.string().url("Invalid avatar URL").optional(),
    bio: yup.string().max(500, "Bio cannot exceed 500 characters").optional(),
    wallet_address: yup.string().optional(),
    anonymity_enabled: yup.boolean().optional(),
    // Validating a Map/Object for preferences
    preferences: yup.object().optional(),
  }),
});

export type UpdateProfileBody = yup.InferType<
  typeof updateProfileSchema
>["body"];

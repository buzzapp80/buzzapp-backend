import * as yup from "yup";

export const socialAuthSchema = yup.object({
  body: yup.object({
    idToken: yup.string().required(),
  }),
});

export type SocialAuthBody = yup.InferType<typeof socialAuthSchema>["body"];

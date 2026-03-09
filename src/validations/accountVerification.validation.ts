import * as yup from "yup";

export const accountVerificationSchema = yup.object({
  body: yup.object({
    code: yup.string().length(6, "Code must be 6 digits long").required(),
  }),
});

export type AccountVerificationBody = yup.InferType<
  typeof accountVerificationSchema
>["body"];

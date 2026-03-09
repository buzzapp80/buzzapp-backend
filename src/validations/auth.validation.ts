import * as yup from "yup";

const emailOrPhoneRegex =
  /^(?:\d{10,15}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const loginSchema = yup.object({
  body: yup.object({
    email_or_phone: yup
      .string()
      .required("Email or phone is required")
      .matches(emailOrPhoneRegex, "Must be a valid email or phone number"),
    password: yup.string().required("Password is required"),
  }),
});

export const registerUserSchema = yup.object({
  body: yup.object({
    email_or_phone: yup
      .string()
      .required("Email or phone number is required")
      .matches(emailOrPhoneRegex, "Must be a valid email or phone number"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-zA-Z]/, "Password must contain letters")
      .matches(/[0-9]/, "Password must contain numbers"),

    handle: yup
      .string()
      .required("Handle (username) is required")
      .min(3)
      .max(30)
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Handle can only contain letters, numbers, and underscores",
      ),

    role: yup
      .string()
      .oneOf(["user", "hunter", "moderator", "admin"], "Invalid role")
      .default("user"),

    anonymity_enabled: yup.boolean().default(false),
  }),
});

export type LoginBody = yup.InferType<typeof loginSchema>["body"];
export type RegisterUserBody = yup.InferType<typeof registerUserSchema>["body"];

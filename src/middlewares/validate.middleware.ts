import type { Request, Response, NextFunction } from "express";
import type { AnyObjectSchema } from "yup";

export const validate =
  (schema: AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        {
          abortEarly: false,
          stripUnknown: true,
        },
      );

      next();
    } catch (error) {
      next(error);
    }
  };

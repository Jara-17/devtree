import { NextFunction, Request, Response } from "express";
import { HttpStatus, sendErrors } from "../utils/handleResponse.utils";
import { validationResult } from "express-validator";

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendErrors(
      res,
      errors.array().map((error) => error.msg),
      HttpStatus.BAD_REQUEST
    );
  }

  next();
};

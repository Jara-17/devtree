import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  handleAndSendError,
  HttpStatus,
  sendError,
} from "../utils/handleResponse.utils";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return sendError(res, "No Autorizado", HttpStatus.UNAUTHORIZED);
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    return sendError(res, "No Autorizado", HttpStatus.UNAUTHORIZED);
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof result === "object" && result.id) {
      const user = await User.findById(result.id).select("-password");

      if (!user) {
        return sendError(
          res,
          "No se encontro el usuario",
          HttpStatus.NOT_FOUND
        );
      }

      req.user = user;

      next();
    }
  } catch (error) {
    handleAndSendError(res, error, "Token no Válido");
  }
};

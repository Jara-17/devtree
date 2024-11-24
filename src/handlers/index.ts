import { Request, Response } from "express";
import slug from "slug";
import User from "../models/User";
import {
  handleAndSendError,
  HttpStatus,
  sendError,
  sendErrors,
  sendSuccess,
} from "../utils/handleResponse.utils";
import { hashPassword } from "../utils/auth.utils";
import { validationResult } from "express-validator";

export const createAccount = async (req: Request, res: Response) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendErrors(
      res,
      errors.array().map((error) => error.msg),
      HttpStatus.BAD_REQUEST
    );
  }

  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return sendError(
        res,
        "Un usuario con ese email ya esta registrado",
        HttpStatus.CONFLICT
      );
    }

    const handle = slug(req.body.handle, "");
    const handleExist = await User.findOne({ handle });

    if (handleExist) {
      return sendError(
        res,
        "Nombre de usuario no disponible",
        HttpStatus.CONFLICT
      );
    }

    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = handle;

    await user.save();
    sendSuccess(res, "Usuario Registrado Correctamente");
  } catch (error) {
    handleAndSendError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("Desde Login");
};

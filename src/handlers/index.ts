import { Request, Response } from "express";
import slug from "slug";
import User from "../models/User";

import {
  handleAndSendError,
  HttpStatus,
  sendError,
  sendSuccess,
} from "../utils/handleResponse.utils";
import { checkPassword, hashPassword } from "../utils/auth.utils";
import { generateJWT } from "../utils/jwt.utils";

export const createAccount = async (req: Request, res: Response) => {
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
    sendSuccess(res, "Usuario Registrado Correctamente", HttpStatus.CREATED);
  } catch (error) {
    handleAndSendError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    //? Comprobar que el usuario este registrado
    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, "El Usuario No Existe", HttpStatus.NOT_FOUND);
    }

    //? Comprobar que la contraseña sea correcta
    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      return sendError(res, "Password Incorrecto", HttpStatus.UNAUTHORIZED);
    }

    const token = generateJWT({ id: user.id });

    sendSuccess(res, `Bienvenido/a ${user.handle}!`, HttpStatus.OK, token);
  } catch (error) {
    handleAndSendError(res, error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  sendSuccess(res, "Usuario Obtenido Correctamente", HttpStatus.OK, req.user);
};

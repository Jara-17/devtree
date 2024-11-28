import { Request, Response } from "express";
import slug from "slug";
import formidable from "formidable";
import { v4 as uuid } from "uuid";
import User from "../models/User";

import {
  handleAndSendError,
  HttpStatus,
  sendError,
  sendSuccess,
} from "../utils/handleResponse.utils";
import { checkPassword, hashPassword } from "../utils/auth.utils";
import { generateJWT } from "../utils/jwt.utils";
import cloudinary from "../config/claudinary.config";

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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body;
    const handle = slug(req.body.handle, "");
    const handleExist = await User.findOne({ handle });

    if (handleExist && handleExist.email !== req.user.email) {
      return sendError(
        res,
        "Nombre de usuario no disponible",
        HttpStatus.CONFLICT
      );
    }

    req.user.description = description;
    req.user.handle = handle;
    req.user.links = links;

    await req.user.save();
    sendSuccess(res, "Perfil Actualizado Correctamente");
  } catch (error) {
    handleAndSendError(res, error, "Hubo un Error");
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({
    multiples: false,
  });

  try {
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        {
          public_id: uuid(),
        },
        async function (error, result) {
          if (error) {
            handleAndSendError(res, error, "Hubo un error al subir la imagen");
          }

          if (result) {
            req.user.image = result.secure_url;
            await req.user.save();
            sendSuccess(res, "Imagen Subida Correctamente", HttpStatus.OK, {
              image: result.secure_url,
            });
          }
        }
      );
    });
  } catch (error) {
    handleAndSendError(res, error, "Hubo un Error");
  }
};

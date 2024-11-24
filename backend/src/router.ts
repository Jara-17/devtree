import { Router } from "express";
import { createAccount, login } from "./handlers";
import { body } from "express-validator";
import { handleInputErrors } from "./middlewares/validation.middleware";

const router = Router();

/**
 ** Autenticación
 * */
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El Handle no pude estar vacio"),
  body("name").notEmpty().withMessage("El Nombre no pude estar vacio"),
  body("lastname").notEmpty().withMessage("El Apellido no pude estar vacio"),
  body("email").isEmail().withMessage("El Email no es válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El Password es muy corto, mínimo 8 caracteres"),
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("El Email no es válido"),
  body("password").notEmpty().withMessage("El Password es obligatorio"),
  handleInputErrors,
  login
);

export default router;

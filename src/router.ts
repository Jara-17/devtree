import { Router } from "express";
import { createAccount, login } from "./handlers";
import { body } from "express-validator";

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
  createAccount
);

router.post("/auth/login", login);

export default router;

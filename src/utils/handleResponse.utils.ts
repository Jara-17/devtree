import { bold } from "colors";
import { Response } from "express";

/**
 * Enumeración de códigos de estado HTTP
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Envía una respuesta de éxito usando el objeto `Response` de Express.
 * @param res Objeto `Response` de Express
 * @param message Mensaje de éxito
 * @param status Código de estado HTTP (por defecto 200)
 * @param data Datos opcionales para incluir en la respuesta
 */
export const sendSuccess = (
  res: Response,
  message: string,
  status: HttpStatus = HttpStatus.OK,
  data?: unknown
): void => {
  res.status(status).json({
    message,
    data,
  });
};

/**
 * Envía una respuesta de error usando el objeto `Response` de Express.
 * @param res Objeto `Response` de Express
 * @param message Mensaje de error
 * @param status Código de estado HTTP (por defecto 500)
 * @param error Detalles opcionales del error
 */
export const sendError = (
  res: Response,
  message: string,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
): void => {
  const error = new Error(message);
  res.status(status).json({
    error: error.message,
  });
};

/**
 * Envía una respuesta de error con múltiples mensajes usando el objeto `Response` de Express.
 * @param res Objeto `Response` de Express
 * @param errors Array de mensajes de error
 * @param status Código de estado HTTP (por defecto 400)
 */
export const sendErrors = (
  res: Response,
  errors: string[],
  status: HttpStatus = HttpStatus.BAD_REQUEST
): void => {
  res.status(status).json({
    errors,
  });
};

/**
 * Maneja errores genéricos y envía una respuesta con el objeto `Response` de Express.
 * @param res Objeto `Response` de Express
 * @param error Error capturado
 * @param message Mensaje personalizado opcional para el cliente
 * @param status Código de estado HTTP (opcional, por defecto 500)
 */
export const handleAndSendError = (
  res: Response,
  error: Error,
  message?: string,
  status: number = HttpStatus.INTERNAL_SERVER_ERROR
): void => {
  console.error(bold.bgRed.white(`[ERROR] ${error}`));
  res.status(status).json({
    error: message || error.message,
  });
};

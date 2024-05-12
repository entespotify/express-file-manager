import { NextFunction, Request, Response } from "express";
import { authenticationHandler } from "../services/authentication.service.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    authenticationHandler(req, res, next);
}

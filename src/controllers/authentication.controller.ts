import express, { Request, Response, NextFunction } from 'express';
import { login, callback, refresh } from '../services/authentication.service.js';

const authenticationRoutes = express.Router()

authenticationRoutes.post("/login", (req: Request, res: Response) => { login(req, res) });

authenticationRoutes.post("/callback", (req: Request, res: Response) => { callback(req, res) });

authenticationRoutes.post("/refresh", (req: Request, res: Response) => { refresh(req, res) });

export default authenticationRoutes;

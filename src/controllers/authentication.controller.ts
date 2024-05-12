import express from 'express';
import { loginHandler, signupHandler } from '../services/authentication.service.js';

const authenticationRoutes = express.Router()

authenticationRoutes.post("/login", loginHandler);

authenticationRoutes.post("/signup", signupHandler);

export default authenticationRoutes;

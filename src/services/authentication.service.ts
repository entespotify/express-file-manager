import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { addNewUser, getUserByCredentials } from "./user.js";
import {
    AUTH_SECRET_KEY,
    JWT_EXPIRATION
} from "../utils/constants.js";


interface TypedRequestBody<T> extends Express.Request {
    body: T
}

/**
 * Api login handler. Accepts credentials from request body and authenticates the user.
 * Sends back user details and authentication token if authenticated else responds with
 * 401.
 * @param req Express request
 * @param res Express response
 */
export async function loginHandler(req: TypedRequestBody<{ email: string, password: string }>, res: Response) {
    try {
        let { email, password } = req.body;

        if (email && password) {
            let user = await getUserByCredentials(email, password);
            let token: String;

            if (user) {
                token = jwt.sign(
                    { userId: user.id, email: user.email },
                    AUTH_SECRET_KEY,
                    { expiresIn: JWT_EXPIRATION }
                );

                res.status(200).json({
                    success: true,
                    data: {
                        userId: user.id,
                        email: user.email,
                        token: token,
                    },
                });
            } else {
                const error = Error("Incorrect credentials please try again!");
                res.status(401).json(error);
            }
        }
        else {
            const error = Error("Invalid credentials!");
            res.status(401).json(error);
        }
    } catch (err) {
        console.log(err);
        const error = new Error("Error! Something went wrong.");
        res.status(500).json(error);
    }
}

/**
 * Handles signup for new users.
 * @param req Express request
 * @param res Express response
 */
export async function signupHandler(req: Request, res: Response) {
    try {
        let { name, email, password } = req.body;
        if (name && email && password) {
            let user = await addNewUser(name, email, password);
            res.status(201).json(user);
        }
        else {
            res.status(500).json({ error: "Invalid details." })
        }
    } catch (error) {
        console.log("Error occurred while adding user: ", error);
        res.status(500).send("Internal server error.");
    }
}

/**
 * Handles authentication requests for authentication middleware.
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
        let { headers } = req;
        let authHeader = headers.authorization;
        //Handling api requests.
        if (authHeader) {
            let token = authHeader.split(' ')[1];

            jwt.verify(token, AUTH_SECRET_KEY, (err: Error, user: any) => {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        message: "Authentication failed!"
                    });
                }

                req.user = user;
                next();
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Unauthorized, Please login."
            });
        }
    }
    catch (error) {
        console.log("Error occurred while authenticating:", error);
        res.status(500).json({
            error: "Internal server error."
        })
    }
}


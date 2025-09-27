import { NextFunction, Request, Response } from "express";
import { getAuthorizationUrl, exchangeCodeForTokens, refreshThisToken } from "../utils/oidc.js";
import { verifyAccessToken } from "../utils/jwtVerify.js";
import { AUTH_SCOPES_DEFAULT } from "../utils/constants.js";

/**
 * Middleware to handle authentication for protected routes.
 * Verifies the access token provided in the Authorization header.
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, Please login.",
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing in the Authorization header.",
            });
        }

        verifyAccessToken(token)
            .then(() => next())
            .catch((error: Error) => {
                console.error("Token verification failed:", error.message);
                return res.status(403).json({
                    success: false,
                    message: "Token verification failed!",
                });
            });
    } catch (error) {
        console.error("Error occurred while authenticating:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}

/**
 * Handles login requests by generating an authorization URL.
 * @param req Express request
 * @param res Express response
 */
export async function login(req: Request, res: Response) {
    try {
        const { redirectUri, scope = AUTH_SCOPES_DEFAULT } = req.body;

        if (!redirectUri) {
            return res.status(400).json({
                success: false,
                message: "Redirect URI is required.",
            });
        }

        const { url, state } = await getAuthorizationUrl(scope, redirectUri);
        res.json({ authUrl: url.href, state });
    } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({
            success: false,
            message: "Login failed due to an internal error.",
        });
    }
}

/**
 * Handles the callback from the authorization server.
 * Exchanges the authorization code for tokens.
 * @param req Express request
 * @param res Express response
 */
export async function callback(req: Request, res: Response) {
    const { redirectUri } = req.body;

    if (!redirectUri) {
        return res.status(400).json({
            success: false,
            message: "Code, redirectUri, and state are required.",
        });
    }

    try {
        const tokens = await exchangeCodeForTokens(redirectUri);
        res.json(tokens);
    } catch (error) {
        console.error("Token exchange failed:", error);
        res.status(400).json({
            success: false,
            message: "Token exchange failed. Please check your request.",
        });
    }
}

/**
 * Handles token refresh requests.
 * Exchanges a refresh token for new tokens.
 * @param req Express request
 * @param res Express response
 */
export async function refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: "Refresh token is required.",
        });
    }

    try {
        const tokens = await refreshThisToken(refreshToken);
        res.json(tokens);
    } catch (error) {
        console.error("Refresh token exchange failed:", error);
        res.status(401).json({
            success: false,
            message: "Refresh token exchange failed. Please login again.",
        });
    }
}



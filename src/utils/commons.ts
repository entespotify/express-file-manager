import dotenv from 'dotenv';
import { FS_ROOT_PATH_DEFAULT } from "./constants.js";

dotenv.config();

/**
 * Gets the root path for file operations.
 * @returns The root path for files.
 */
export function getFilesRootPath(): string {
    return process.env.BASE_DIR || FS_ROOT_PATH_DEFAULT;
}

/**
 * Gets the root path for web operations.
 * @returns The root path for web files.
 */
export function getWebRootPath(): string {
    return process.env.WEB_DIR || FS_ROOT_PATH_DEFAULT;
}

/**
 * Gets the authentication server address from environment variables.
 * @returns The authentication server address.
 * @throws Error if the environment variable is not set.
 */
export function getAuthServerAddress(): string {
    if (!process.env.AUTH_SERVER_ADDRESS) {
        console.error("Authentication server address is not set in environment variables.");
        throw new Error("AUTH_SERVER_ADDRESS is not defined.");
    }
    return process.env.AUTH_SERVER_ADDRESS;
}

/**
 * Gets the authentication client ID from environment variables.
 * @returns The authentication client ID.
 * @throws Error if the environment variable is not set.
 */
export function getAuthClientId(): string {
    if (!process.env.AUTH_CLIENT_ID) {
        console.error("Authentication client ID is not set in environment variables.");
        throw new Error("AUTH_CLIENT_ID is not defined.");
    }
    return process.env.AUTH_CLIENT_ID;
}

/**
 * Gets the authentication client secret from environment variables.
 * @returns The authentication client secret.
 * @throws Error if the environment variable is not set.
 */
export function getAuthClientSecret(): string {
    if (!process.env.AUTH_CLIENT_SECRET) {
        console.error("Authentication client secret is not set in environment variables.");
        throw new Error("AUTH_CLIENT_SECRET is not defined.");
    }
    return process.env.AUTH_CLIENT_SECRET;
}


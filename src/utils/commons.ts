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

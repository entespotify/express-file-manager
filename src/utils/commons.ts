import { FS_ROOT_PATH_DEFAULT } from "./constants.js";

export function validateEmail(email: string) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Gets the root path for files
 * @returns root path for files
 */
export function getFilesRootPath() {
    return (process.env.BASE_DIR ? process.env.BASE_DIR : FS_ROOT_PATH_DEFAULT);
}

/**
 * Gets the root path for web
 * @returns root path for web
 */
export function getWebRootPath() {
    return (process.env.WEB_DIR ? process.env.WEB_DIR : FS_ROOT_PATH_DEFAULT);
}

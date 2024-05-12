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

export function getRootPath() {
    return (process.env.BASE_DIR ? process.env.BASE_DIR : FS_ROOT_PATH_DEFAULT);
}
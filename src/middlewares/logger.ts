import { format } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { DATE_FORMAT } from "../utils/constants.js";

const logger = function (req: Request, res: Response, next: NextFunction) {
    let formattedDateTime = format(new Date(), DATE_FORMAT);
    console.log('\x1b[33m%s\x1b[0m', formattedDateTime, req.method, req.originalUrl);
    next();
}

export default logger;
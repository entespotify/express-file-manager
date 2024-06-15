import express from 'express';
import multer from 'multer';
import { copyItems, createDirectory, createDirectoryInPath, deleteItems, getFilesFrom, moveItems } from '../services/file.service.js';
import { getWebRootPath } from '../utils/commons.js';

const webRoutes = express.Router();

const destination = (req, file, cb) => {
    let path = req.query.path;
    cb(null, createDirectoryInPath(path, getWebRootPath()));
}

const filename = (req, file, cb) => {
    cb(null, file.originalname);
}

const upload = multer({
    storage: multer.diskStorage({
        destination: destination,
        filename: filename
    })
});

webRoutes.get("/files", (req, res) => {
    let path: string = req.query.path?.toString();
    let files = getFilesFrom(path, getWebRootPath());
    res.json({
        path: path,
        files: files
    })
    .status(200);
});

webRoutes.post("/create/directory", (req, res) => {
    try {
        let dirname = req.body.dirname;
        let path = req.body.path;
        if(dirname) {
            createDirectory(dirname, path, getWebRootPath());
        }
        else {
            throw Error("No dir name");
        }
        res.json({
            message: "created folder"
        }).status(201);
    } catch (error: Error | any) {
        console.log("Error occurred", error.message);
        res.json({
            error: error.message
        }).status(400);
    }
});

webRoutes.post("/upload/file", upload.single('file'), (req, res) => {
    try {
        res.json({
            message: "Uploaded"
        }).status(201);
    } catch (error) {
        console.log("Exception occurred while uploading file", error);
        res.json({
            error: "Error occurred, check server logs"
        }). status(400);
    }
});

webRoutes.post("/copy", (req, res) => {
    try {
        let src = req.body.src;
        let dest = req.body.dest;
        if(src && dest) {
            copyItems(src, dest, getWebRootPath());
            res.json({
                message: "Copied successfully!"
            }).status(200);
        }
        else {
            throw Error("IO error: src or dest is invalid.")
        }
    } catch (error: Error|any) {
        console.log("Exception in copying file:", error.message);
        res.json({
            error: "Copy failed: " + error.message
        }).status(400);
    }
});

webRoutes.post("/move", (req, res) => {
    try {
        let src = req.body.src;
        let dest = req.body.dest;
        if(src && dest) {
            moveItems(src, dest, getWebRootPath());
            res.json({
                message: "Moved successfully!"
            }).status(200);
        }
        else {
            throw Error("IO error: src or dest is invalid.")
        }
    } catch (error: Error|any) {
        console.log("Exception in moving file:", error.message);
        res.json({
            error: "Move failed: " + error.message
        }).status(400);
    }
});

webRoutes.post("/delete", (req, res) => {
    try {
        let path = req.body.path;
        if(path) {
            deleteItems(path, getWebRootPath());
            res.json({
                message: "Deleted successfully",
                path: path
            }).status(200);
        }
    } catch (error) {
        console.log("Exception in deleting file:", error.message);
        res.json({
            error: "Delete failed: " + error.message
        }).status(400);
    }
});

export default webRoutes;
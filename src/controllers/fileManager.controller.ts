import express from 'express';
import multer from 'multer';
import { copyItems, createDirectory, getFiles } from '../services/fileManager.service.js';
import { getRootPath } from '../utils/commons.js';

const fileManagerRoutes = express.Router();

fileManagerRoutes.get("/files", (req, res) => {
    let files = getFiles();
    res.json({
        message: "hey from files",
        files: files
    })
    .status(200);
});

fileManagerRoutes.post("/create/directory", (req, res) => {
    try {
        let dirname = req.body.dirname;
        if(dirname) {
            createDirectory(dirname);
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

fileManagerRoutes.post("/upload/file", (req, res) => {
    try {
        let dest = req.body.dest;
        let storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, getRootPath());
            },
            filename: function(req, file, cb) {
                cb(null, file.originalname);
            }
        });
        let upload = multer({storage: storage}).single("file");
        upload(req, res, function(err: any) {
            if(err) {
                return res.json({
                    error: err
                }).status(400);
            }
            res.json({
                message: "Upload successfull"
            }).status(201);
        })
    } catch (error) {
        console.log("Exception occurred while uploading file", error);
    }
});

fileManagerRoutes.post("/copy", (req, res) => {
    try {
        let src = req.body.src;
        let dest = req.body.dest;
        if(src && dest) {
            copyItems(src, dest);
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

export default fileManagerRoutes;
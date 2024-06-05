import fs from "fs";
import path from 'path';
import { getRootPath } from "../utils/commons.js";

export function getFilesFrom(path: string) {
    let allItems = [];
    try {
        let items = fs.readdirSync(getRootPath() + "/" + path);
        items.map(item => {
            let det = fs.statSync(getRootPath() + "/" + path + "/" + item);
            let type = det.isDirectory() ? "folder" : (det.isFile() ? "file" : "unknown");
            let thisItem = {
                id: item,
                name: item,
                type: type,
                size: det.size,
                createdAt: det.birthtime
            }
            allItems.push(thisItem);
        })
    } catch (error) {
        console.log("Error occurred while getting files:", error.message);
    }
    return allItems;
}

export function createDirectory(dirname: string, path: string) {
    try {
        if(dirname && path) {
            fs.mkdirSync(getRootPath() + path + "/" + dirname);
        } else throw Error("Invalid inputs");
    } catch (error) {
        console.log("Exception caught while making directory:", error.message);
    }
}

export function createDirectoryInPath(dirPath: string) {
    let resultPath = getRootPath();
    try {
        let joinedPath = path.join(resultPath , dirPath);
        if(dirPath && !fs.existsSync(joinedPath)) {
            fs.mkdirSync(joinedPath, {recursive: true});
        }
        resultPath = joinedPath;
    } catch (error) {
        console.log("Exception caught while making directory for path:", error.message);
    }
    return resultPath;
}

export function copyItems(src: string, dest: string) {
    try {
        let srcPath = path.join(getRootPath(), src);
        let destPath = path.join(getRootPath(), dest);
        // fs.cpSync(src, dest);
        fs.copyFileSync(srcPath, destPath);
    } catch (error) {
        console.log("Exception caught while copying item:", error);
    }
}

export function moveItems(src: string, dest: string) {
    try {
        let srcPath = path.join(getRootPath(), src);
        let destPath = path.join(getRootPath(), dest);
        fs.renameSync(srcPath, destPath);
    } catch (error) {
        console.log("Exception caught while moving item:", error);
    }
}

export function deleteItems(path: string) {
    try {
        if (fs.existsSync(getRootPath() + "/" + path)) {
            if (fs.statSync(getRootPath() + "/" + path).isFile()) {
                fs.rmSync(getRootPath() + "/" + path);
            } else {
                fs.rmdirSync(getRootPath() + "/" + path, {recursive: true});
            }
        } else {
            console.log("File doesn't exist");
        }
    } catch (error) {
        console.log("Exception caught while deleting item:", error);
    }
}

import fs from "fs";
import { FS_ROOT_PATH } from "../utils/constants.js";

export function getFiles() {
    let allItems = [];
    let items = fs.readdirSync(FS_ROOT_PATH);
    items.map( item => {
        let det = fs.statSync(FS_ROOT_PATH + "/" + item);
        let type = det.isDirectory() ? "folder" : (det.isFile() ? "file" : "unknown");
        let thisItem = {
            name: item,
            type: type,
            size: det.size,
            createdAt: det.birthtime
        }
        allItems.push(thisItem);
    })
    return allItems;
}

export function createDirectory(dirname: string) {
    fs.mkdirSync(FS_ROOT_PATH + "/" + dirname);
}

export function copyItems(src: string, dest: string) {
    try {
        // fs.cpSync(src, dest);
        fs.copyFileSync(src, dest);
    } catch (error) {
        console.log("Exception caught while copying item:", error);
    }
}

export function moveItems(src: string, dest: string) {
    try {
        fs.renameSync(src, dest);
    } catch (error) {
        console.log("Exception caught while moving item:", error);
    }
}

export function deleteItems(path: string) {
    try {
        fs.rmSync(path);
    } catch (error) {
        console.log("Exception caught while deleting item:", error);
    }
}

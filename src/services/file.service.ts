import fs from "fs";
import path from 'path';

export function getFilesFrom(thisPath: string, volume: string) {
    let allItems = [];
    try {
        let filesPath = path.join(volume, thisPath);
        let items = fs.readdirSync(filesPath);
        items.map(item => {
            let itemPath = path.join(volume, thisPath, item);
            let det = fs.statSync(itemPath);
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

export function createDirectory(dirname: string, dirPath: string, volume: string) {
    try {
        if(dirname && dirPath) {
            let dirCreationPath = path.join(volume, dirPath, dirname)
            fs.mkdirSync(dirCreationPath);
        } else throw Error("Invalid inputs");
    } catch (error) {
        console.log("Exception caught while making directory:", error.message);
    }
}

export function createDirectoryInPath(dirPath: string, volume: string) {
    let resultPath = volume;
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

export function copyItems(src: string, dest: string, volume: string) {
    try {
        let srcPath = path.join(volume, src);
        let destPath = path.join(volume, dest);
        // fs.cpSync(src, dest);
        fs.copyFileSync(srcPath, destPath);
    } catch (error) {
        console.log("Exception caught while copying item:", error);
    }
}

export function moveItems(src: string, dest: string, volume: string) {
    try {
        let srcPath = path.join(volume, src);
        let destPath = path.join(volume, dest);
        fs.renameSync(srcPath, destPath);
    } catch (error) {
        console.log("Exception caught while moving item:", error);
    }
}

export function deleteItems(deletionPath: string, volume: string) {
    try {
        let fullDeletionPath = path.join(volume, deletionPath);
        if (fs.existsSync(fullDeletionPath)) {
            if (fs.statSync(fullDeletionPath).isFile()) {
                fs.rmSync(fullDeletionPath);
            } else {
                fs.rmdirSync(fullDeletionPath, {recursive: true});
            }
        } else {
            console.log("File doesn't exist");
        }
    } catch (error) {
        console.log("Exception caught while deleting item:", error);
    }
}

var fs = require("fs");
var path = require("path");
var dsSavePath = "C:/Users/chris/Documents/NBGI/DARK SOULS REMASTERED/29422016";
var cpPath = "C:/Users/chris/dark-souls-remastered-saves/";
var backupInterval = 5 * 60 * 1000;
function main() {
    var files = fs
        .readdirSync(dsSavePath)
        .filter(function (file) { return file.endsWith(".sl2"); });
    if (!files) {
        console.error("No save file found.");
        return;
    }
    try {
        fs.mkdirSync(cpPath);
    }
    catch (err) {
        if (err.code !== "EEXIST") {
            console.error(err);
        }
    }
    var copyDirPath = getCopyDirPath();
    files.forEach(function (file) {
        fs.copyFileSync(path.join(dsSavePath, file), path.join(copyDirPath, file));
    });
    console.log("[".concat(new Date().toString(), "]\nSuccessfully saved to ").concat(copyDirPath, ".\n"));
}
function getCopyDirPath() {
    var files = fs.readdirSync(cpPath);
    var nextCopyDirName = 0;
    files.forEach(function (file) {
        if (Number(file) >= nextCopyDirName) {
            nextCopyDirName = Number(file) + 1;
        }
    });
    var dirPath = path.join(cpPath, nextCopyDirName.toString().padStart(5, "0"));
    fs.mkdirSync(dirPath);
    return dirPath;
}
console.log("Started...");
main();
setInterval(function () {
    main();
}, backupInterval);

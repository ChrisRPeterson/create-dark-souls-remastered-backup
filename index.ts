const fs = require("fs");
const path = require("path");

const dsSavePath =
  "C:/Users/chris/Documents/NBGI/DARK SOULS REMASTERED/29422016";
const cpPath = "C:/Users/chris/dark-souls-remastered-saves/";
const backupInterval = 5 * 60 * 1000;

function main() {
  const files = fs
    .readdirSync(dsSavePath)
    .filter((file) => file.endsWith(".sl2"));

  if (!files) {
    console.error("No save file found.");
    return;
  }

  try {
    fs.mkdirSync(cpPath);
  } catch (err) {
    if (err.code !== "EEXIST") {
      console.error(err);
      return;
    }
  }

  const copyDirPath = getCopyDirPath();

  files.forEach((file) => {
    fs.copyFileSync(path.join(dsSavePath, file), path.join(copyDirPath, file));
  });

  console.log(
    `[${new Date().toString()}]\nSuccessfully saved to ${copyDirPath}.\n`
  );
}

// Determines the next directory name by incrementing the
// previously highest numbered directery by one.
// i.e. 00001 exists, then this will return
// the filepath for a 00002 directory.
function getCopyDirPath() {
  const files = fs.readdirSync(cpPath);

  let nextCopyDirName = 0;

  files.forEach((file) => {
    if (Number(file) === NaN) return;
    if (Number(file) >= nextCopyDirName) {
      nextCopyDirName = Number(file) + 1;
    }
  });

  const dirPath = path.join(
    cpPath,
    nextCopyDirName.toString().padStart(5, "0")
  );

  fs.mkdirSync(dirPath);

  return dirPath;
}

console.log("Started...");
main();

setInterval(() => {
  main();
}, backupInterval);

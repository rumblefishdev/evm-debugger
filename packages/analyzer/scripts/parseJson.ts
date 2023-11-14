import { readFileSync, writeFileSync } from "fs";

const downloadsFolderPath = __dirname + "/../../../../../../Downloads";

console.log("downloadsFolderPath", downloadsFolderPath);

const jsonFile = readFileSync(`${downloadsFolderPath}/0x2cde5583641e733ffc8220033160565bd3235fac06cc2d5ff35f0c87b3c06406.json`, "utf8");
const json = JSON.parse(jsonFile.slice(0,18916531));

writeFileSync(`${downloadsFolderPath}/0x2cde5583641e733ffc8220033160565bd3235fac06cc2d5ff35f0c87b3c06406-parsed.json`, JSON.stringify(json, null, 2), "utf8");
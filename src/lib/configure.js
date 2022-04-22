const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();
const service = {
    sourceConfigFile,
    writeToConfigFile,
};
module.exports = service;

const configPath = path.join(homedir, ".plexconf");
function sourceConfigFile() {
    try {
        const rawConfig = fs.readFileSync(configPath);
        return JSON.parse(rawConfig);
    } catch (err) {
        return null;
    }
}

function writeToConfigFile(opts) {
    const rawConfig = JSON.stringify(opts);
    fs.writeFileSync(configPath, rawConfig);
}

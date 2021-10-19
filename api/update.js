//TODO import update API correctly into app.js
//TODO?? enclose update.js in module.exports to avoid readline witchcraft

const fs = require("fs");
const https = require("https");
const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });

/**
 * ask the user a question and return their response
 * @param {string} query what to prompt the user for
 * @returns 
 */
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const url = "https://raw.githubusercontent.com/mia-cx/csdosc/";
const branch = process.argv[2];

/**
 * updates all files from github
 * @param {string} branch defaults to "master"
 */
async function update(branch) {

    let local = await getCurrentVersion();
    console.log("current csdosc version: " + local.version + ", on branch " + local.branch);
    
    branch = branch ? branch : local.branch;

    let upstream = {
        version: await getLatestVersion(branch),
        branch: branch
    }
    console.log("upstream csdosc version: " + upstream.version + ", on branch " + upstream.branch);

    if (local.branch !== upstream.branch) {
        console.log("local and upstream branch do not match!");

        try {
            const r = await prompt("proceed with update? (y/n) ");
            console.log(r);
        } catch (err) {
            console.error(err.message);
        }

    } else {
        process.exit();
    }

    rl.close();
}

/**
 * gets current version from package.json
 * @returns {string||boolean} current version
 */
async function getCurrentVersion() {
    try {
        // console.debug(file);
        let file = "../package.json";
        // console.debug(json);
        let json = require(file);
        // console.debug(json.version);
        return await Promise.resolve({
            version: json.version,
            branch: json.branch
        });
    } catch (err) {
        console.error(err);
    }
    return false;
}

/**
 * get latest version from github
 * @param {string} branch defaults to "master"
 * @returns {string} latest version for specified branch
 */
function getLatestVersion(branch) {
    if (!branch) return;
    return new Promise((resolve, reject) => {
        https.get(url + branch + "/package.json", res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                data = JSON.parse(data);
                resolve(data.version);
            });
        }).on('error', err => {
            console.log(err.message);
            reject(err.message);
        });
    });
}

module.exports = {
    update: update,
    getVersion: getCurrentVersion,
    getLatest: getLatestVersion
}
import * as readline from "readline";
import { readJson, getJson, prompt } from "./utils.mjs";

// import * as md5 from './md5.js';

const rl = readline.createInterface({
    input: process.stdin,
});

const url = "https://raw.githubusercontent.com/mia-cx/csdosc/";

/**
 * checks whether an update is available
 * @param {string} branch - defaults to "master"
 */
async function checkUpdate(branch) {
    // get local version & branch
    let local = await getLocalVersion()
        .then((result) => {
            console.debug(
                "local csdosc version: " + result.version + ", on branch " + result.branch
            );
            return result;
        })
        .catch((error) => {
            throw {
                message: "could not get local version from 'package.json', ending update request.",
                error,
            };
        });

    branch = branch ? branch : local.branch;

    // get upstream version at specified branch
    let upstream = await getUpstreamVersion(branch)
        .then((result) => {
            console.debug(
                "upstream csdosc version: " + result.version + ", on branch " + result.branch
            );
            return result;
        })
        .catch((error) => {
            throw {
                message: "could not get upstream version, ending update request.",
                error,
            };
        });

    // version/branch mismatches
    if (local.branch !== upstream.branch) {
        console.warn("local and upstream branch do not match! ");
        if (await !proceed()) return;
    } else if (local.version !== upstream.version) {
        console.warn("different version available from upstream on branch " + branch);
        if (await !proceed()) return;
    } else {
        console.log("no updates available on branch " + branch);
        return;
    }

    // TODO update

    return;
}

/**
 * returns local version & branch from package.json
 * @returns {Object} object with local version & branch.
 */
async function getLocalVersion() {
    let { version, branch } = await readJson("./package.json");
    return { version, branch };
}

/**
 * get latest version from github
 * @param {string} b - defaults to "master"
 * @returns {Object} object with latest version & branch.
 */
async function getUpstreamVersion(b) {
    if (!b) reject(new Error("no branch speficied"));

    let { version, branch } = await getJson(url + b + "/package.json");
    return { version, branch };
}

/**
 * asks the user whether to proceed with update
 * @returns {Promise<boolean>} - whether or not to proceed
 */
async function proceed() {
    return new Promise(async (resolve, reject) => {
        await prompt(rl, "proceed with update? (y/n) ").then((response) => {
            switch (response) {
                case "y":
                    console.debug("proceeding with update...");
                    resolve(true);
                case "n":
                    console.debug("cancelling update...");
                    resolve(false);
                default:
                    reject("unknown input: '" + response + "'");
            }
        });
    }).catch(error => {
        console.error(error);
        proceed();
    });
}

export { checkUpdate as default, getLocalVersion, getUpstreamVersion };

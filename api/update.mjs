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
  let local = await getLocalVersion().then(
    (result) => {
      console.debug(
        "local csdosc version: " +
          result.version +
          ", on branch " +
          result.branch
      );
      return result;
    },
    (error) => {
      console.error(error.stack);
      return false;
    }
  );

  // if getLocalVersion fails
  if (!local) {
    console.error(
      "could not get local version from 'package.json', ending update request."
    );
    return;
  }

  branch = branch ? branch : local.branch;

  // get upstream version at specified branch
  let upstream = await getUpstreamVersion(branch).then(
    (result) => {
      console.debug(
        "upstream csdosc version: " +
          result.version +
          ", on branch " +
          result.branch
      );
      return result;
    },
    (error) => {
      console.error(error.stack);
      return false;
    }
  );

  // if getUpstreamVersion fails
  if (!upstream) {
    console.error(
      "could not get local version from 'package.json', ending update request."
    );
    return;
  }

  // version/branch mismatches
  if (local.branch !== upstream.branch) {
    console.warn("local and upstream branch do not match! ");

    if (!proceed()) return;
  } else if (local.version !== upstream.version) {
    console.warn(
      "different version available from upstream on branch " + branch
    );

    if (!proceed()) return;
  } else {
    console.log("no updates available on branch " + branch);
    return;
  }

  // TODO update

  return;
}

/**
 * returns local version & branch from package.json
 * @returns {Promise} Promise object, resolves to object with local version & branch.
 */
async function getLocalVersion() {
  return new Promise(async (resolve, reject) => {
    try {
      let config = await readJson("./package.json");
      resolve({
        version: config.version,
        branch: config.branch,
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * get latest version from github
 * @param {string} branch - defaults to "master"
 * @returns {string} - latest version for specified branch
 */
async function getUpstreamVersion(branch) {
  return new Promise(async (resolve, reject) => {
    if (!branch) reject(new Error("no branch speficied"));

    try {
      let config = await getJson(url + branch + "/package.json");
      resolve({
        version: config.version,
        branch: config.branch,
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * asks the user whether to proceed with update
 * @returns {boolean} - whether or not to proceed
 */
async function proceed() {
  let confirm = true;
  let attempts = 0;
  try {
    while (confirm && attempts < 3) {
      const response = await prompt(rl, "proceed with update? (y/n) ");

      switch (response) {
        case "y":
          console.debug("proceeding with update...");
          return true;
        case "n":
          console.log("cancelling update...");
          return false;
        default:
          console.log("unknown input: '" + response + "'");
          attempts++;
          break;
      }
    }
    console.log("too many wrong inputs, cancelling update...")
    return false;
  } catch (err) {
    console.error(err.message);
    return false;
  }
}

export { checkUpdate as default, getLocalVersion, getUpstreamVersion };

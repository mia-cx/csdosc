const fs = require("fs");
const https = require("https");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
async function checkUpdate(branch) {
  console.log(branch);

  let local = await getCurrentVersion();
  console.log(
    "current csdosc version: " + local.version + ", on branch " + local.branch
  );

  branch = branch ? branch : local.branch;

  let upstream = {
    version: await getLatestVersion(branch),
    branch: branch,
  };
  console.log(
    "upstream csdosc version: " +
      upstream.version +
      ", on branch " +
      upstream.branch
  );

  if (local.branch !== upstream.branch) {
    console.log("local and upstream branch do not match!");

    if (!proceed()) return;
  } else if (local.version !== upstream.version) {
    console.log(
      "different version available from upstream on branch " + branch
    );

    if (!proceed()) return;
  } else {
    console.log("no updates available on branch " + branch);
    return;
  }

  // update
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
      branch: json.branch,
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
    https
      .get(url + branch + "/package.json", (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          data = JSON.parse(data);
          resolve(data.version);
        });
      })
      .on("error", (err) => {
        console.log(err.message);
        reject(err.message);
      });
  });
}

/**
 * asks the user whether to proceed with update
 * @returns {boolean} whether or not to proceed
 */
async function proceed() {
  try {
    while ((proceed = true)) {
      const r = await prompt("proceed with update? (y/n) ");

      switch (r) {
        case "y":
          console.debug("proceeding with update");
          break;
        case "n":
          proceed = false;
          console.log("cancelling update");
        default:
          console.log("unknown input: '" + r + "'");
      }
    }
  } catch (err) {
    console.error(err.message);
    proceed = false;
  }

  return proceed;
}

module.exports = {
  checkUpdate: checkUpdate,
  getVersion: getCurrentVersion,
  getLatest: getLatestVersion,
};

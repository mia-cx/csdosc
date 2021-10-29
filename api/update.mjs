import * as readline from 'readline';
import { readJson, getJson } from './utils.mjs';
// import * as md5 from './md5.js';

// import { JSDOM } from 'jsdom';
// const { window } = new JSDOM("");
// import jq from 'jquery';
// const $ = jq(window);

const rl = readline.createInterface({ input: process.stdin, /* output: process.stdout */ });

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
 * @param {string} branch - defaults to "master"
 */
async function checkUpdate(branch) {

  // get local version and assign to {local}
  let local = await getLocalVersion().then(result => {
    console.debug("local csdosc version: " + result.version + ", on branch " + result.branch);
    return result;
  }, error => {
    console.error(error.stack);
    return;
  });

  // end if {local} undefined
  if (!local) {
    console.error("could not get local version from 'package.json', ending update request.");
    return;
  }
  
  branch = branch ? branch : local.branch;

  // let upstream = {
  //   version: await getLatestVersion(branch),
  //   branch: branch,
  // };
  // console.debug("upstream csdosc version: " + upstream.version + ", on branch " + upstream.branch);

  // if (local.branch !== upstream.branch) {
  //   process.stdout.write("local and upstream branch do not match! ");

  //   if (!proceed()) return;
  // } else if (local.version !== upstream.version) {
  //   process.stdout.write(
  //     "different version available from upstream on branch " + branch
  //   );

  //   if (!proceed()) return;
  // } else {
  //   console.log("no updates available on branch " + branch);
  //   return;
  // }

  // return;

  // // TODO update
}

/**
 * returns local version & branch from package.json
 * @returns {Promise} Promise object, resolves to object with local version & branch.
 */
async function getLocalVersion() {
  return new Promise(async (resolve, reject) => {
    try {
      let config = await getJson("./package.json");
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
  return new Promise((resolve, reject) => {
    if (!branch) reject(new Error("no branch speficied"));


    
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
 * @returns {boolean} - whether or not to proceed
 */
async function proceed() {
  let confirm = true;
  try {
    while (confirm) {
      const r = await prompt("proceed with update? (y/n) ");

      switch (r) {
        case "y":
          console.debug("proceeding with update...");
          break;
        case "n":
          confirm = false;
          console.log("cancelling update...");
          break;
        default:
          console.log("unknown input: '" + r + "'");
          break;
      }
    }
  } catch (err) {
    console.error(err.message);
    confirm = false;
  }

  return confirm;
}

export {
  checkUpdate as default,
  getLocalVersion,
  getUpstreamVersion,
};

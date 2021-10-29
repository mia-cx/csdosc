import * as fsp from "fs/promises";
import * as fs from "fs";
import fetch from "node-fetch";
import crypto from "crypto";

/**
 * gets an object from a local json file asynchronously
 * @param {string} path where to find the json file
 * @returns {Promise<Object>} promised object parsed from JSON
 */
export async function readJson(path) {
    let file = fsp.readFile(path);
    return JSON.parse(await file);
}

/**
 * gets an object from a local json file synchronously
 * @param {string} path where to find the json file
 * @returns {Object} object parsed from JSON
 */
export function readJsonSync(path) {
    return JSON.parse(fs.readFileSync(path));
}

/**
 * gets an object from a json file at a specified url
 * @param {string} url where to get the json file from
 * @returns {Object} object parsed from JSON
 */
export async function getJson(url) {
    let response = await fetch(url);
    return await response.json();
}

/**
 * * ask the user a question and return their response
 * @param {Interface} rl which interface to use
 * @param {string} query what to prompt the user for
 * @returns {Promise<string>} the user's response
 */
export function prompt(rl, query) {
    return new Promise((resolve) => {
        rl.output = process.stdout;
        rl.question(query, resolve);
        rl.output = undefined;
    });
}

// export function

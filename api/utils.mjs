import * as fsp from 'fs/promises';
import * as fs from 'fs';
import fetch from 'node-fetch';

export async function readJson(path) {
    return new Promise(async (resolve, reject) => {
        try {
            let file = fsp.readFile(path);
            resolve(JSON.parse(await file));
        } catch (e) {
            reject(e);
        }
    });
}

export function readJsonSync(path) {
    return JSON.parse(fs.readFileSync(path));
}


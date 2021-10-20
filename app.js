const express = require("express");
const rl = require("readline").createInterface({ input: process.stdin, /* output: process.stdout */ }); // can't use stdout cause of double characters :(

const update = require("./api/update");

const app = express();

const PORT = process.argv[2] ? process.argv[2] : 8001;

process.on("SIGINT", () => {
  console.debug("received SIGINT, closing server.");
  stop("SIGINT");
});

rl.on("line", (input) => {
  switch (true) {
    case input.startsWith("kill"):
    case input.startsWith("stop"):
    case input.startsWith("quit"):
    case input.startsWith("q"):
      stop("stop command");
      break;
    case input.startsWith("update"):
      update.checkUpdate(input.split(" ")[1]);
  }
});

rl.on("SIGINT", () => {
  process.emit("SIGINT");
});


/**
 * closes the server and exits the process (semi-gracefully)
 * @param {string} reason provided reason for the close/exit
 */
function stop(reason) {
  console.log("stopping server!");
  if (reason) console.log("reason: " + reason);
  process.exit(0);
}
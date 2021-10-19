const express = require("express");
const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });

const app = express();

const PORT = process.argv[2] ? process.argv[2] : 8001;



process.on("SIGINT", () => {
  console.debug("received SIGINT, closing server.");
  stop("SIGINT");
});

rl.on("line", (input) => {
  switch (input) {
    case "kill":
    case "stop":
    case "quit":
    case "q":
      stop("stop command");
      break;
    case "update":
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
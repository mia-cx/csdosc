const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const osc = require("node-osc");
const readline = require("readline");
const fs = require("fs");
const http = require("http");
const https = require("https");
const _ = require("lodash");

let sendSocket = [];
let oscServer = [];
let oscClient = [];
let clients = {};

/*--------------osc-----------------/
 *-----------functions--------------/
 */ //-------------------------------/

//check if a server is already running on the desired port, if so: kill it first
function serverExist(port, id, callback) {
    let found = 0;
    for (let i in oscServer) {
        if (oscServer[i] && oscServer[i].port == port) {
            found = 1;
            oscServer[i].close();
            oscServer[i] = null;
            callback();
        }
    }
    if (!found) {
        callback();
    }
}

/*--------user-interaction----------/
 *----------exit-program------------/
 */ //-------------------------------/

//handle cli arguments
process.argv.slice(2).forEach((val, index) => {
    if (val === "update") {
        requestUpdate().then(killOsc()).then(process.exit());
    } else {
        console.log("invalid arguments");
    }
});

//handle ctrl+c
process.on("SIGINT", function () {
    killOsc();
    process.exit(0);
});

//get user input from the terminal
const rl = readline.createInterface({
    input: process.stdin
});

//check the code that is given by the user.
rl.on("line", (input) => {
    //quit the program when one of these words is used.
    switch (input) {
        case "quit":
        case "q":
        case "stop":
        case "hou op":
            killOsc();
            process.exit(0);
            break;
        case "update":
            requestUpdate();
            break;
    }
});

async function requestUpdate() {
    console.log("updating");
    await downloadFile(
        "https://raw.githubusercontent.com/mia-cx/csdosc/master/.updateState.txt",
        "./.updateState.txt"
    )
        .then(getUpdateState)
        .then(
            downloadFile(
                "https://raw.githubusercontent.com/mia-cx/csdosc/master/.filesToUpdate.txt",
                "./.filesToUpdate.txt"
            )
        )
        .then(startUpdate)
        .then(doUpdate)
        .then(updateSucces)
        .catch((error) => {
            console.log(error);
        });
    console.log("update finished");
}

// close any of the available OSC instances, client and servers.
function killOsc() {
    oscServer.forEach((s) => {
        if (s) s.close();
    });
    oscClient.forEach((s) => {
        if (s) s.close();
    });
}

/*-----------http-server------------/
 *----------------------------------/
 */ //-------------------------------/

//start the server listening on port 8001
server.listen(8001, function () {
    console.log(
        "Your server has started! You can find it at http://127.0.0.1:8001 \nClose this server with CTRL+C or the 'quit' command"
    );
});

//zorg dat de server alle paths kan bereiken.
app.use(express.static(path.join(__dirname, "/")));

//genereer errormessage als de pagina niet bestaat
app.use(function (req, res, next) {
    let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    res.status(400).send(
        "The page <b>" +
            fullUrl +
            "</b> doesn't exist. Did you enter the right url?"
    );
});

/*----------web-socket--------------/
 *----------------------------------/
 */ //-------------------------------/

io.on("connection", function (socket) {
    clients[socket.id] = socket;

    //initialize socket, make a connection with the webpage
    socket.on("oscLib", function (data) {
        sendSocket[data] = clients[data];
        let returnMessage = setTimeout(function () {
            sendSocket[data].emit("connected", data);
        }, 100);

        //what to do on disconnecting
        sendSocket[data].on("disconnect", function () {
            if (data && oscServer[data]) {
                oscServer[data].close();
                oscServer[data] = null;
            }
        });
    });

    //on receiving start message for server
    socket.on("startServer", function (data) {
        serverExist(data.port, data.id, function () {
            oscServer[data.id] = new osc.Server(data.port, "0.0.0.0");

            sendSocket[data.id].emit("serverRunning", { port: data.port });

            oscServer[data.id].on("message", function ([...msg], rinfo) {
                let address = msg.shift();
                let message = msg;
                let sendData = { add: address, msg: message };
                sendSocket[data.id].emit("getMessage", sendData);
            });
        });
    });

    //on receiving kill message for server
    socket.on("killServer", function () {
        oscServer.close();
    });

    //on receiving start message for client
    socket.on("startClient", function (data) {
        oscClient[data.id] = new osc.Client(data.ip, data.port);
        sendSocket[data.id].emit("clientRunning", {
            ip: data.ip,
            port: data.port,
            active: 1
        });
    });

    //on receiving kill message for client
    socket.on("killClient", function () {
        oscClient.close();
    });

    //on receiving message to send
    socket.on("sendMessage", function (data) {
        if (oscClient[data.id]) {
            oscClient[data.id].send(data.address, data.message, function () {});
        }
    });
});

//all the functions for updating this code.
async function downloadFile(url, filePath) {
    const proto = !url.charAt(4).localeCompare("s") ? https : http;

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        let fileInfo = null;

        const request = proto.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(`Failed to get '${url}' (${response.statusCode})`);
                return;
            }

            fileInfo = {
                mime: response.headers["content-type"],
                size: parseInt(response.headers["content-length"], 10)
            };

            response.pipe(file);
        });

        // The destination stream is ended by the time it's called
        file.on("finish", () => resolve(fileInfo));

        request.on("error", (err) => {
            fs.unlink(filePath, () => reject(err));
        });

        file.on("error", (err) => {
            fs.unlink(filePath, () => reject(err));
        });

        request.end();
    });
}

async function getUpdateState() {
    return new Promise((resolve, reject) => {
        fs.readFile("./.lastUpdate.txt", "utf8", (err, lastDay) => {
            if (err) reject("something went wrong during updating...");
            let lastUpdate = new Date(lastDay);
            fs.readFile("./.updateState.txt", "utf8", (err, data) => {
                if (err) {
                    reject(`can't read update file`);
                } else {
                    newestUpdate = new Date(data.replace(/(\r\n|\n|\r)/gm, ""));
                    if (lastUpdate < newestUpdate) {
                        resolve();
                    } else {
                        reject("There's no update available at this moment.");
                    }
                }
            });
        });
    });
}

async function startUpdate() {
    return new Promise((resolve, reject) => {
        fs.readFile("./.filesToUpdate.txt", "utf8", (err, data) => {
            if (err) {
                reject(`no files found to update`);
            } else {
                let updateList = data.split("\n");
                resolve(updateList);
            }
        });
    });
}

async function doUpdate(list) {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i] !== "") {
                await downloadFile(
                    "https://raw.githubusercontent.com/mia-cx/csdosc/master/" +
                        list[i],
                    list[i]
                ).catch((error) => {
                    reject(error);
                });
            }
        }
        resolve(
            "The update was successful! The server will now be closed, restart it with 'npm start'."
        );
    });
}

async function updateSucces(result) {
    let today = formatDate();
    fs.writeFile("./.lastUpdate.txt", today, "utf8", (error) => {
        if (error) console.log(error);
        console.log(result);
        killOsc();
        process.exit(0);
    });
}

function formatDate() {
    var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

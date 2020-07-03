const express = require('express')
const app = express();
const httpServer = require('http').createServer();
require('dotenv').config();

const port = process.env.PORT || 3000;
const wsPort = process.env.WEBSOCKET_PORT || 3001;
const tickInterval = 1000/process.env.TICKS_PER_SEC || 1000/30;
let tickSender = undefined;

app.listen(port, () => {
    console.log(`\nListening on port ${port}.`)
});
app.use(express.static('public'));


// WEBSOCKET
const clients = new Map();

httpServer.listen(wsPort, () => {
    console.log(`Listening on port ${wsPort}.`);
});

const websocketServer = require("websocket").server;
const wsServer = new websocketServer({
    "httpServer": httpServer
});
wsServer.on("request", request => {
    console.log('New client connected!')
    // On Connection
    const connection = request.accept(null, request.origin);
    // create new player
    connection.playerId = generatePlayerId();
    clients.set(connection.playerId, {
        connection: connection,
        x: 0,
        y: 0,
    });
    connection.send(connection.playerId);
    console.log('ID sent')

    // On Disconnection
    connection.on("close", () => {
        console.log("Client disconnected!");
        // remove player
        clients.delete(connection.playerId);
        if (clients.size <= 0 && tickSender) {
            clearInterval(tickSender);
            tickSender = false;
            console.log('Stopped sending ticks.');
        }
    });

    // On Message from client
    connection.on("message", (message) => {
        const result = JSON.parse(message.utf8Data);
        // update saved player
        const player = clients.get(connection.playerId);
        player.x = result.x;
        player.y = result.y;
        
    });
    
    // Start timer if at least 1 client is connected and is not already running.
    if (clients.size > 0 && !tickSender) {
        startTicks();
    }    

});
function startTicks() {
    tickSender = setInterval(() => {
        const payload = [];
        // add each player to payload
        clients.forEach((client, id) => {
            payload.push({
                id: id,
                x: client.x,
                y: client.y
            });
        });
        // send payload to each player
        clients.forEach((client, id) => {
            client.connection.send(JSON.stringify(payload))
        });
    }, tickInterval);
    console.log('Sending ticks every '+tickInterval+'ms...')
}

/**
 * Create ID for players
 */
const generatePlayerId = () => {
    // TODO: make this a guid
    return Math.floor(Math.random() * 9999999);
}


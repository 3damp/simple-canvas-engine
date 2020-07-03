const express = require('express')
const app = express();
const httpServer = require('http').createServer();
require('dotenv').config();

const port = process.env.PORT || 3000;
const wsPort = process.env.WEBSOCKET_PORT || 3001;

// ticksPerSec: How often the server will send an update to all clients.
const ticksPerSec = process.env.TICKS_PER_SEC || 60;

let tickSender = undefined;

app.listen(port, () => {
    console.log(`\nListening on port ${port}.`)
});
app.use(express.static('public'));


// clientConnections:  Links every client connection to a player ID.
const clientConnections = new Map();
// clientPositions:  Object to store all clients received data to be sent every tick.
const clientPositions = {};

httpServer.listen(wsPort, () => {
    console.log(`Listening on port ${wsPort}.`);
});

const websocketServer = require("websocket").server;
const wsServer = new websocketServer({
    "httpServer": httpServer
});

wsServer.on("request", request => {

    /* ON NEW CONNECTION: */
    console.log('New client connected!')
    const connection = request.accept(null, request.origin);
    // create new player
    const clientId = generateClientId();
    clientConnections.set(clientId, {
        connection: connection,
    });
    // send ID back to client
    connection.send(clientId);
    console.log('ID sent')


    /* ON CLIENT DISCONNECTS */
    connection.on("close", () => {
        console.log("Client disconnected!");
        // remove player data
        clientConnections.delete(clientId);
        delete clientPositions[clientId];

        // Stop tick timer
        if (clientConnections.size <= 0 && tickSender) {
            clearInterval(tickSender);
            tickSender = false;
            console.log('Stopped sending ticks.');
        }
    });

    /* ON MESSAGE FROM CLIENT */
    connection.on("message", (message) => {
        const result = JSON.parse(message.utf8Data);
        // update saved clientPositions
        clientPositions[clientId] = {
            x: result.x,
            y: result.y,
        };        
    });
    
    // Start timer if at least 1 client is connected and is not already running.
    if (clientConnections.size > 0 && !tickSender) {
        startTicks();
    }    

});
/**
 * Starts heartbeat to send updates to all clients.
 */
function startTicks() {
    tickSender = setInterval(() => {
        // Send all clients positions to all clients.
        clientConnections.forEach((client, id) => {
            client.connection.send(JSON.stringify(clientPositions))
        });

    }, 1000/ticksPerSec);

    console.log('Sending ticks every '+(1000/ticksPerSec).toFixed(2)+'ms...')
}

/**
 * Create ID for players
 */
const generateClientId = () => {
    // TODO: make this a guid
    return Math.floor(Math.random() * 9999999);
}


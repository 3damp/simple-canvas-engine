const express = require('express')
const app = express();
const httpServer = require('http').createServer();
require('dotenv').config();

const port = process.env.PORT || 3000;
const wsPort = process.env.WEBSOCKET_PORT || 3001;

app.listen(port, () => {
    console.log(`\nListening on port ${port}.`)
});
app.use(express.static('public'));


// WEBSOCKET
const clients = new Map();

httpServer.listen(2000, () => {
    console.log(`Listening on port ${wsPort}.`);
});

const websocketServer = require("websocket").server;
const wsServer = new websocketServer({
    "httpServer": httpServer
});
wsServer.on("request", request => {
    console.log('REQUEST')
    // On Connection
    const connection = request.accept(null, request.origin);
    connection.playerId = generatePlayerId();
    clients.set(connection.playerId, {
        connection: connection,
        x: 0,
        y: 0,
    });

    connection.on("open", () => console.log("Connection oppened!"));
    connection.on("close", () => console.log("Connection closed!"));
    connection.on("message", (message) => {
        const result = JSON.parse(message.utf8Data);

        const player = clients.get(connection.playerId);
        player.x = result.x;
        player.y = result.y;
        
        
    });
        
    setInterval(() => {
        const payload = {}
        clients.forEach((client, id) => {
            // console.log(id + ' : ' + client.connection);
            payload[id] = {
                x: client.x,
                y: client.y
            }
        });
        clients.forEach((client, id) => {
            client.connection.send(JSON.stringify(payload))
        });
    }, 1000);

    

});



const generatePlayerId = () => {
    return Math.floor(Math.random() * 9999999);
}


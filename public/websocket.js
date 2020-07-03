
let ws = undefined;

function initWebsocket() {
    if ("WebSocket" in window) {
        ws = new WebSocket("ws://localhost:2000/websocket");
         
        ws.onopen = function () { 
            console.log("WebSocket connected.");
        };
         
        ws.onmessage = function (evt) { 
            console.log("Message received.");
            // var received_msg = evt.data;
            // ws.send("Message to send");
        };
         
        ws.onclose = function() { 
            console.log("Connection closed."); 
        };
     }
}

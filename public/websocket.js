
let ws = undefined;
/**
 * Initialises communication with server.
 * ws.onopen, ws.onmessage, ws.onclose listeners can be overriden
 */
function initWebsocket() {
    if ("WebSocket" in window) {
        const port = 3001;
        const hostname = window.location.hostname;
        const ENDPOINT = `ws://${hostname}:${port}/websocket`
        
        ws = new WebSocket(ENDPOINT);
        
        ws.onopen = function () { 
            // console.log("WebSocket connected.");
        };
         
        ws.onmessage = function (evt) { 
            // console.log("Message received.");
            // var received_msg = evt.data;
            // ws.send("Message to send");
        };
         
        ws.onclose = function() { 
            // console.log("Connection closed."); 
        };
     }
}

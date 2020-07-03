initWebsocket();
startGame();

// Background
game.components.push(new function(){
    this.color = '#aaaaaa'
    this.render = function(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, game.viewport.width, game.viewport.height);
    }
});
// Player
game.components.push(new Player());

// setInterval(() => {
//     console.log('-tick-')
//     const payload = {
//         type: 'cosa1'
//     };
//     ws.send(JSON.stringify(payload));
// }, 1000);







ws.onmessage = function (evt) { 
    const result = JSON.parse(evt.data);
    console.log(result);
    // var received_msg = evt.data;
};
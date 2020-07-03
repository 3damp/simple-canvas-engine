myGame();

function myGame() {
    initWebsocket();
    startGame();

    let myId = undefined;

    // Background
    game.components.push(new function(){
        this.color = '#aaaaaa'
        this.render = function(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, game.viewport.width, game.viewport.height);
        }
    });
    // Other Players
    const otherPlayers = new Array();
    game.components.push(otherPlayers);
    // Player
    game.components.push(new Player());
    
    ws.onmessage = function (evt) { 
        let result;
        try {
            result = JSON.parse(evt.data);
        } catch (error) {
            result = evt.data;
        }
        if (Array.isArray(result)){
            // console.log('> tick')
            result.forEach((obj, index) => {
                const samePlayerInComponents = otherPlayers[index];
                if (myId != obj.id) {
                    if (samePlayerInComponents && samePlayerInComponents.id == obj.id) {
                        samePlayerInComponents.x = obj.x;
                        samePlayerInComponents.y = obj.y;
                        // console.log(' - player updated')
                    } else {
                        otherPlayers[index] = new Guest(obj.id, obj.x, obj.y);
                        // console.log(' - player added')
                    }
                }
            });
            while (otherPlayers.length > result.length) {
                otherPlayers.pop();
            }
        } else if (typeof result === 'string' || typeof result === 'number') {
            myId = result;
        }
    };
}


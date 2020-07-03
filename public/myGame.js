myGame();

// main function
function myGame() {
    initWebsocket();
    startGame();

    let myId = undefined;

    /* -- COMPONENTS INIT -- */
    // Add Background
    game.components.push(new function(){
        this.color = '#000000'
        this.render = function(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, game.viewport.width, game.viewport.height);
        }
    });
    // Add Map for other Players
    const guests = new Map();
    game.components.push(guests);
    // Add Player
    game.components.push(new Player());
    /* -- END COMPONENTS INIT -- */


    // On message from Server
    ws.onmessage = function (evt) { 
        let result;
        try {
            result = JSON.parse(evt.data);
        } catch (error) {
            result = evt.data;
        }
        if (typeof result === 'object'){
            updateGuests(result);

        } else if (typeof result === 'string' || typeof result === 'number') {
            myId = result;
        }
    };

    /**
     * Updates current guests map with received data.
     * @param {*} newPositionList Received object with all new positions and IDs.
     */
    function updateGuests(newPositionList) {
        // update & add guests
        for (const id in newPositionList) {
            if (newPositionList.hasOwnProperty(id) && myId != id) {
                const pos = newPositionList[id];
                const playerToUpdate = guests.get(id);
                if (playerToUpdate) {
                    playerToUpdate.x = pos.x;
                    playerToUpdate.y = pos.y;
                } else {
                    guests.set(id, new Guest(id, pos.x, pos.y));
                }
            }
        }
        // Remove offline guests
        guests.forEach((guest, id) => {
            if (!newPositionList.hasOwnProperty(id)) {
                guests.delete(id);
            }
        });
    };
}


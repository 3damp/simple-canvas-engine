///--------------------------------------
///  Example Game components file
///  
///  Author: Armand M.
///--------------------------------------


/**
 * Player with keyboard control and sending data to server.
 * @param x optional
 * @param y optional
 */
class Player extends Component{
    constructor(x, y) {
        super(x, y);
        this.vel = 0.05;
        this.size = new Vec2(1,1);
        this.color = '#ddff00';
    }

    // Update
    update = function () {
        if (isKeyDown.up) this.position.y -= this.vel
        if (isKeyDown.down) this.position.y += this.vel
        if (isKeyDown.left) this.position.x -= this.vel
        if (isKeyDown.right) this.position.x += this.vel

        const payload = {
            x: this.position.x,
            y: this.position.y,
            // more might be added
        };
        ws.send(JSON.stringify(payload));
    };
}

/**
 * Other players being rendered on screen.
 * @param id
 * @param x
 * @param y
 */
class Guest extends Component{
    constructor(id, x, y) {
        super(x, y);
        this.id = id;
        this.size = new Vec2(1,1);
        this.color = '#AAAAAA';
    }
}

class Background extends Component{
    constructor() {
        super(0, 0);
        this.size = new Vec2(game.width, game.height);
        this.color = 'black'
    }
}

/**
 * Player with keyboard control and sending data to server.
 * @param x optional
 * @param y optional
 */
class Player {
    constructor(x, y) {
        this.x = x || 50;
        this.y = y || 50;
        this.vel = 5;
        this.width = 50;
        this.height = 50;
        this.color = '#ddff00';
    }

    // Update
    update = function () {
        if (isKeyDown.up) this.y -= this.vel
        if (isKeyDown.down) this.y += this.vel
        if (isKeyDown.left) this.x -= this.vel
        if (isKeyDown.right) this.x += this.vel

        const payload = {
            x: this.x,
            y: this.y,
        };
        ws.send(JSON.stringify(payload));
    };
    // Render
    render = function(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

/**
 * Other players being rendered on screen.
 * No control, just rendered.
 * @param id
 * @param x
 * @param y
 */
class Guest {
    constructor(id, x, y) {
        this.id = id;
        this.x = x || 0;
        this.y = y || 0;
        this.width = 50;
        this.height = 50;
        this.color = '#AAAAAA';
    }

    // Render
    render = function(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}
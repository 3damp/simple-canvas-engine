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


class Guest {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = 50;
        this.height = 50;
        this.color = '#ddff00';
    }

    // Update
    update = function () {
    };
    // Render
    render = function(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}
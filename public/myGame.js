
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





function Player() {
    this.x = 50;
    this.y = 50;
    this.vel = 5;
    this.width = 50;
    this.height = 50;
    this.color = '#ddff00';

    // Update
    this.update = function () {
        if (isKeyDown.up) this.y -= this.vel
        if (isKeyDown.down) this.y += this.vel
        if (isKeyDown.left) this.x -= this.vel
        if (isKeyDown.right) this.x += this.vel
    };
    // Render
    this.render = function(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

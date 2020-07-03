

const game = {
    viewport: document.getElementById('canvas'),
    components: [],
    targetFps: 60,

    start : function() {
        this.context = this.viewport.getContext("2d");
        this.camera = new Component(this.viewport.width/2, this.viewport.height/2);
        this.frameNo = 0;
        this.interval = setInterval(mainLoop, 1000/this.targetFps);
    },

    clear : function() {
        this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);
    },
}

function startGame() {
    game.start();
}


function mainLoop() {
    update();
    render();
    
    function update() {
        updateAll(game.components);
    }

    function render() {
        game.clear();
        renderAll(game.components);    
    }

    function updateAll(componentList) {
        componentList.forEach((component, index) => {
            if(component.update) {
                component.update();
            } else if (component instanceof Map || Array.isArray(component)){
                updateAll(component);
            }
        });
    }

    function renderAll(componentList) {
        componentList.forEach((component, index) => {
            if(component.render) {
                component.render(game.context);
            } else if (component instanceof Map || Array.isArray(component)){
                renderAll(component);
            }
        });
    }
}

isKeyDown = {
    up: false,
    down: false,
    left: false,
    right: false,
}
document.onkeydown = function (ev) {
    if (ev.keyCode === 39) { isKeyDown.right = true; }
    if (ev.keyCode === 37) { isKeyDown.left = true; }
    if (ev.keyCode === 38) { isKeyDown.up = true; }
    if (ev.keyCode === 40) { isKeyDown.down = true; }
};

document.onkeyup = function (ev) {
    if (ev.keyCode === 39) { isKeyDown.right = false; }
    if (ev.keyCode === 37) { isKeyDown.left = false; }
    if (ev.keyCode === 38) { isKeyDown.up = false; }
    if (ev.keyCode === 40) { isKeyDown.down = false; }
};

class Component {
    width = 10;
    height = 10;
    position = {};
    positionOnViewport = {};

    constructor(x, y) {
        this.position.x = x || 0;
        this.position.y = y || 0;
        this.position.scale = 1;
    }

    updatePositionOnViewport = function() {
        this.positionOnViewport.x = this.position.x + game.camera.x;
        this.positionOnViewport.y = this.position.y + game.camera.y;
        this.positionOnViewport.scale = this.position.scale * game.camera.scale;
    };
    // Update
    update = function () {};
    // Render
    render = function(ctx) {};
}



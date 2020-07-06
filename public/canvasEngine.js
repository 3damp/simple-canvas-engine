///--------------------------------------
///  Simple Canvas Engine
///  
///  Author: Armand M.
///--------------------------------------


// TODO: Use RequestAnimationFrame
// TODO: Implement Cameras
// TODO: Set shape to Component
// TODO: Collisions
// TODO: WASD optional keys



/** Main Game properties: */
const game = {
    targetFps: 60,
    viewport: document.getElementById('canvas'),
    components: [], // add all components to include in the mainloop here.
    width: 10, // in game units
    height: 10, // in game units

    start : function() {
        this.context = this.viewport.getContext("2d");
        this.camera = new Camera(this.viewport.width/2, this.viewport.height/2);
        this.frameNo = 0;
        this.interval = setInterval(mainLoop, 1000/this.targetFps);
        this.pixelRatio = this.viewport.width / this.width;
    },

    /**
     * Clears the screen. Used every frame before rendering all components.
     */
    clear : function() {
        this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);
    },
}

/**
 * Starting function
 */
function startGame() {
    game.start();
}

/**
 * Loop that runs every frame
 */
function mainLoop() {
    // Update
    updateAll(game.components);
    // Render
    game.clear();
    renderAll(game.components);    

    /**
     * Runs the Update method from all components in the game.
     * @param {Array | Map} componentList 
     */
    function updateAll(componentList) {
        componentList.forEach((component, index) => {
            if(component.update) {
                component.update();
            } else if (component instanceof Map || Array.isArray(component)){
                updateAll(component);
            }
        });
    }

    /**
     * Runs the Render method from all components in the game.
     * @param {Array | Map} componentList 
     */
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


//** KEYBOARD CONTROLLER */
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




/** CLASSES */

/**
 * Main Component class
 */
class Component {
    scale = 1;
    size = undefined;

    constructor(x, y) {
        this.position = new Vec2(x || 0, y || 0);
        this.position.scale = 1;
    }
    // Update
    update = function () {};
    // Render
    render = function() {
        const ctx = game.context;
        ctx.fillStyle = this.color;
        const vpPos = this.position.toVPPos();
        const vpSize = this.size.toVP();
        ctx.fillRect(vpPos.x - vpSize.x/2, vpPos.y - vpSize.y/2, vpSize.x, vpSize.y);
    };
}

/**
 * Simple Vector with conversion from Game units to pixels.
 */
class Vec2 {
    constructor(x,y){
        this.x = x || 0;
        this.y = y || 0;
    }
    /**
     * Returns a vector converted to Viewport coords.
     */
    toVP() {
        return new Vec2(this.x * game.pixelRatio, this.y * game.pixelRatio);
    }
    toVPPos() {
        return new Vec2((this.x + game.width/2) * game.pixelRatio, (this.y + game.height/2) * game.pixelRatio);
    }
}

/**
 * Default camera
 */
class Camera {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.scale = 1;
    }
    update = function() {}
}


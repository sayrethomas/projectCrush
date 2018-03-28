
// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 450;

document.body.appendChild(canvas);

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    reset();
    lastTime = Date.now();
    main();
}

resources.load([
    'img/charHair2.png',
    'img/hyberbolic.png',
    'img/hourglass.png',
    'img/chamber.png',
    'img/clouds.png',
    'img/testShot.png'
]);
resources.onReady(init);

// Game state
var player = new GamePiece("player",
    new Sprite('img/charHair2.png', [0, 0], [40, 40], 7, [0, 1]),
    [],
    [canvas.width/2 -130, canvas.height/2-40]
);

var otherBody = new GamePiece("player",
    new Sprite('img/charHair2.png', [0, 0], [40, 40], 7, [0, 1]),
    [],
    [canvas.width/2 +110, canvas.height/2-40]
);

var bodies = [];
bodies[0] = player;
bodies[1] = otherBody;




otherBody.hitBy;

var platforms = [];
var passThroughPlatforms = [];
var clouds = [];
var attacks = [];

var plat1 = new GamePiece("platform",
    new Sprite('img/hyberbolic.png', [0, 0], [400, 151], 2, [0,1,2]),
    [canvas.width/2-200,canvas.height-150,400,150],
    [canvas.width/2-200, canvas.height-151]
);

var plat2 = new GamePiece("platform",
    new Sprite('img/hourglass.png', [0, 0], [80, 60], 5, [0,1,2,3,4,5,6,7,8,9,10]),
    [230,240,60,1],
    [220, 240],
);


var plat3 = new GamePiece("platform",
    new Sprite('img/hourglass.png', [0, 0], [80, 60], 5, [5,6,7,8,9,10,0,1,2,3,4]),
    [510,240,60,1],
    [500,240]
);

var plat4 = new GamePiece("platform",
    new Sprite('img/chamber.png', [0, 0], [130, 188], 5, [0,1,2,3,4,5]),
    [350,170,100,1],
    [335, 112]
);


platforms[0] = plat1;
passThroughPlatforms[0] = plat2;
passThroughPlatforms[1] = plat3;
passThroughPlatforms[2] = plat4;

var gameTime = 0;
var isGameOver;
var gravity = .1; 


// Update game objects
 function update(dt) {
    gameTime += dt;

    handleInput.inputs(dt);
    collisions.checkCollisions(dt);
    updateEntities(dt);
    
    if(Math.random() < 0.005) {
        clouds.push({
            pos: [-60, Math.random()*canvas.height-100],
            sprite: new Sprite('img/clouds.png', [0, 0], [51, 26], 2, [0,1,2])
        });
    }

};

function updateEntities(dt) {
    // Update player bodies
    for (var i =0;i<bodies.length;i++){
        bodies[i].sprite.update(dt);
        bodies[i].pos[0] += bodies[i].velocity[0];
        bodies[i].pos[1] += bodies[i].velocity[1];
        bodies[i].rect = [bodies[i].pos[0],bodies[i].pos[1],bodies[i].sprite.size[0],bodies[i].sprite.size[1]];
        bodies[i].bodyHitProcess(dt);
    }
    plat1.sprite.update(dt);
    plat2.sprite.update(dt);
    plat3.sprite.update(dt);
    plat4.sprite.update(dt);
    //Update Clouds
    for(var i=0; i<clouds.length; i++) {
        clouds[i].pos[0] += 100*dt;
        clouds[i].sprite.update(dt);

        // Remove if offscreen
        if(clouds[i].pos[0] > canvas.width) {
            clouds.splice(i, 1);
            i--;
        }
    }
    
    
    //Update Attacks
    for (i=0;i<attacks.length;i++){
        attacks[i].atkUpdate();
        attacks[i].pos[0] += attacks[i].velocity[0];
        attacks[i].pos[1] += attacks[i].velocity[1];
        attacks[i].rect = [attacks[i].pos[0],attacks[i].pos[1],attacks[i].sprite.size[0],attacks[i].sprite.size[1]];
        if (attacks[i].atkTime <= 0){
            attacks.splice(i,1);
        }
    }
    
    
    
}

var background = new Image();
background.src = 'img/background.svg';

// Draw everything
function render() {
    ctx.drawImage(background, 0, 0);
    renderEntities(clouds);
    renderEntities(platforms);
    renderEntities(passThroughPlatforms);
    renderEntities(attacks);
    
    if(!isGameOver){
        renderEntities(bodies);
    }
    
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}
// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}
 //Reset game to original state
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    
    clouds = [];
    player.pos = [canvas.width/2 -160, canvas.height/2-40];
    otherBody.pos = [canvas.width/2 +110, canvas.height/2-40];
    otherBody.weight = 100;
};


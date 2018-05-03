
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
    
    //document.getElementById('begin-game-overlay').style.display = 'none';
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    //if(dt == 0){beforeGame = true;}
    if(beforeGame){
        menu();
        update(dt);
        render();
    }
    else{
        stats();
        update(dt);
        render();
       
    }
    lastTime = now;
    requestAnimFrame(main);
};

function menu() {
            document.getElementById('begin-game-overlay').style.display = 'block';
            document.getElementById('begin-game').style.display = 'block';
            document.getElementById('set-player1').addEventListener('click', function() { 
                $('.player').html("Player 1");
                $('.str2').html("Str: " +player.strength);
                $('.spd2').html("Spd: " +player.speed);
                $('.wgt2').html("Wgt: " +player.weight);
                menu2.construct(player);
                player1 = true;
                player2 = false;
                speccer(player, spec1);
            });
            document.getElementById('set-player2').addEventListener('click', function() { 
                $('.player').html("Player 2");
                $('.str2').html("Str: " +otherBody.strength);
                $('.spd2').html("Spd: " +otherBody.speed);
                $('.wgt2').html("Wgt: " +otherBody.weight);
                menu2.construct(otherBody);
                player2 = true;
                player1 = false;
                speccer(otherBody, spec2);
            });
            document.getElementById('start-game').addEventListener('click', function() {
               closeMenu(); 
            });
}
function stats() {
    if(!isGameOver){
    //document.getElementById('game-stats').style.display = 'block';
    //document.getElementById('countdown').style.display = 'block';
    document.getElementById('play-percentage').innerHTML = (((2050-otherBody.weight)/2000)*100)+"%";
    }
    else
        document.getElementById('game-stats').style.display = 'none';
}
function closeMenu(){
        document.getElementById('begin-game').style.display = 'none';
        document.getElementById('begin-game-overlay').style.display = 'none';
        beforeGame = false;
}

function init() {
    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    //reset();
    lastTime = Date.now();
    main();
}

resources.load([
    'img/charHair2.png',
    'img/charHair.png',
    'img/hyberbolic.png',
    'img/hourglass.png',
    'img/chamber.png',
    'img/clouds.png',
    'img/testShot.png',
    'img/specToken.png'
]);
resources.onReady(init);

// Game state
var player = new GamePiece("player",
    new Sprite('img/charHair2.png', [0, 0], [40, 40], 3, [0, 1]),
    [],
    [canvas.width/2 -130, canvas.height/2-40]
);


var otherBody = new GamePiece("player",
    new Sprite('img/charHair.png', [0, 0], [40, 40], 3, [0, 1]),
    [],
    [canvas.width/2 +110, canvas.height/2-40]
);

var bodies = [];
bodies[0] = player;
bodies[1] = otherBody;

var sFrames = [];

sFrames["playRWalk"] = [6,7];
sFrames["playLWalk"] = [4,5];
sFrames["playRJump"] = [8];
sFrames["playLJump"] = [9];
sFrames["playRStand"] = [0,1];
sFrames["playLStand"] = [2,3];
sFrames["playLPunch"] = [10,11];
sFrames["playRPunch"] = [12,13];
sFrames["strToken"] = [0,1,2];
sFrames["spdToken"] = [3,4,5];
sFrames["wgtToken"] = [6,7,8];
sFrames["strwgtToken"] = [9,10,11];
sFrames["spdwgtToken"] = [12,13,14];
sFrames["strspdToken"] = [15,16,17];
sFrames["strspdwgtToken"] = [18,19,20];


otherBody.hitBy;

var spec = [];
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

var spec1 = new GamePiece("spec",
    new Sprite('img/specToken.png', [0, 0], [100, 150], 6, [0,1,2]),
    [],
    [5, 315]
);
var spec2 = new GamePiece("spec",
    new Sprite('img/specToken.png', [0, 0], [100, 150], 6, [0,1,2]),
    [],
    [700, 315]
);
function speccer(play, spec){
    if(play.strength > play.weight && play.strength > play.speed){
        spec.setFrames("strToken");
    }
    else if(play.weight > play.speed && play.weight > play.strength){
        spec.setFrames("wgtToken");
    }
    else if(play.speed > play.weight && play.speed > play.strength){
        spec.setFrames("spdToken");
    }
    else if (play.speed === play.weight && play.weight === play.strength) {
        spec.setFrames("strspdwgtToken");
    }
    else if(play.strength === play.speed){
        spec.setFrames("strspdToken");
    }
    else if(play.strength === play.weight){
        spec.setFrames("strwgtToken");
    }
    else if(play.speed === play.weight){
        spec.setFrames("spdwgtToken");
    }
    
    else{
        spec.setFrames("strspdwgtToken");
    }
    
 

}

spec[0] = spec1;
spec[1] = spec2;
platforms[0] = plat1;
passThroughPlatforms[0] = plat2;
passThroughPlatforms[1] = plat3;
passThroughPlatforms[2] = plat4;

var gameTime = 0;
var isGameOver;
var beforeGame = true;
var player1 = false;
var player2 = false;
var gravity = .1; 


// Update game objects
 function update(dt) {
    gameTime += dt;

    var printInfo = false;
    if (player.velocity[0] != 0)
        printInfo = true;
    
    handleInput.inputs(dt);
    handleInput.dummyInputs(dt);
    for (var i =0;i<bodies.length;i++){
        //Being hit
        bodies[i].bodyHitProcess(dt);
        //Attack process
        bodies[i].bodyAtkProcess(bodies[i].atkType,attacks,dt)
    }
    collisions.checkCollisions(dt);
    

    updateEntities(dt);
    


    if(Math.random() < 0.002) {

        clouds.push({
            pos: [-60, Math.random()*canvas.height-100],
            sprite: new Sprite('img/clouds.png', [0, 0], [51, 26], 2, [0,1,2])
        });
    }

};


function updateEntities(dt) {
    // Update player bodies
    for (var i =0;i<bodies.length;i++){
        //Sprite
        bodies[i].sprite.update(dt);
        //Position
        bodies[i].pos[0] += bodies[i].velocity[0];
        bodies[i].pos[1] += bodies[i].velocity[1];
        //Rectangle
        bodies[i].rect = [bodies[i].pos[0],bodies[i].pos[1],bodies[i].sprite.size[0],bodies[i].sprite.size[1]];
        //Being hit
        //bodies[i].bodyHitProcess(dt);
        //Attack process
        //bodies[i].bodyAtkProcess(bodies[i].atkType,dt)
    }
    
    plat1.sprite.update(dt);
    plat2.sprite.update(dt);
    plat3.sprite.update(dt);
    plat4.sprite.update(dt);
    spec1.sprite.update(dt);
    spec2.sprite.update(dt);
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
        attacks[i].atkUpdate(dt);
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
    renderEntities(spec);
    
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
    otherBody.weight = 50;
    //begin();
};


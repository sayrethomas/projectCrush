
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
    'img/clouds.png'
]);
resources.onReady(init);

// Game state
var player = new GamePiece("player",
    new Sprite('img/charHair2.png', [0, 0], [40, 40], 7, [0, 1]),
    [],
    [canvas.width/2 -40, 200], 200, 14
);

var platforms = [];
var passThroughPlatforms = [];
var clouds = [];

var plat1 = new GamePiece("platform",
    new Sprite('img/hyberbolic.png', [0, 0], [400, 151], 2, [0,1,2]),
    [canvas.width/2-200,canvas.height-150,400,150],
    [canvas.width/2-200, canvas.height-151]
);

var plat2 = new GamePiece("platform",
    new Sprite('img/hourglass.png', [0, 0], [80, 60], 3, [0,1,2,3,4,5,6,7,8,9,10]),
    [230,240,60,1],
    [220, 240]
);


var plat3 = new GamePiece("platform",
    new Sprite('img/hourglass.png', [0, 0], [80, 60], 3, [5,6,7,8,9,10,0,1,2,3,4]),
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
var dir = true;

// Update game objects
function update(dt) {
    var rand = Math.random()*canvas.height-100;
    gameTime += dt;

    handleInput(dt);
    checkCollisions(dt);
    updateEntities(dt);
    
    if(Math.random() < 0.002) {
        clouds.push(
                    new GamePiece("cloud",
                    new Sprite('img/clouds.png', [0, 0], [51, 26], 1, [0,1,2]),
                    [0,0,0,0],
                    [0, rand])
           
        );
    }

};

function handleInput(dt) {
    
    if(input.isDown('LEFT') || input.isDown('a')) {
        player.velocity[0] = -player.speed * dt;
        if(player.standing){player.sprite.frames = [4,5];}
        else{player.sprite.frames = [9];}
        dir = true;
    }else if(input.isDown('RIGHT') || input.isDown('d')) {
        player.velocity[0] = player.speed * dt;
        if(player.standing){player.sprite.frames = [6,7];}
        else{player.sprite.frames = [8];}
        dir = false;
    }else{
        player.velocity[0] = 0;
        if(dir){player.sprite.frames = [0,1];}
        else{player.sprite.frames = [2,3];}
    }
    if(input.isDown('DOWN') || input.isDown('s')) {
            player.velocity[1] = player.speed * dt;
            player.dropThrough = true;
            if(dir){player.sprite.frames = [5];}
        else{player.sprite.frames =  [6];}
        } else{
            player.dropThrough = false;
        }
    if(input.isDown('SPACE')){
       if (!player.jump && player.hasJumps > 0){
            player.velocity[1] = -player.jumpSpeed * dt;
            player.hasJumps--;
            player.jump = true;  
        }
        if(dir){player.sprite.frames = [9];}
        else{player.sprite.frames =  [8];}
    }
    else{
        player.jump = false;
    }  
        
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
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
            clouds.splice(i,1);
            i--;
        }
    }
    player.pos[0] += player.velocity[0];
    player.pos[1] += player.velocity[1];
    
    

}

// Collisions
function checkCollisions(dt) {
    //Player touch platform
    player.standing = false;
    checkPlayerBounds();
    player.standing = checkPlatformCollisions(dt);
    checkPassthroughPlatformCollisions(dt);
    
}

function checkPlatformCollisions(dt){
    var predictRect = [];
       
    var playRect = [];
    
    for(i=0;i<platforms.length;i++){
        playRect = [player.pos[0],player.pos[1]
        ,player.sprite.size[0],player.sprite.size[1]];
        var xSign = Math.sign(player.velocity[0]) * .5 * dt;
        var ySign = Math.sign(player.velocity[1]) * .5 * dt;
        var platRect = platforms[i].rect;
        
        predictRect = playRect;
        predictRect[0] += player.velocity[0];
        
        if (checkRectCollision(predictRect,platRect)){
            predictRect = playRect;
            predictRect[0] += xSign;
            player.velocity[0] = 0;
            while (!checkRectCollision(predictRect,platRect)){
                player.pos[0] += xSign;
                predictRect[0] += xSign;
            }
            
        }
        
        playRect = [player.pos[0],player.pos[1]
        ,player.sprite.size[0],player.sprite.size[1]];
        predictRect = playRect;
        predictRect[1] += player.velocity[1];
        if (checkRectCollision(predictRect,platRect)){
            predictRect = playRect;
            predictRect[1] += ySign;
            player.velocity[1] = 0;
            while (!checkRectCollision(predictRect,platRect)){
                player.pos[1] += ySign;
                predictRect[1] += ySign;
            }
        }
        predictRect = playRect;
        predictRect[1] += 1;
        if (checkRectCollision(predictRect,platRect)){
            player.standing = true;
            player.hasJumps = 3;
        }
    }
    
    
    if (!player.standing )
        player.velocity[1] += gravity;
    
    return player.standing;
    
}

function checkPassthroughPlatformCollisions(dt){
    var predictRect = [];
       
    var playRect = [];
    
    if (player.velocity[1] > 0){
        for(i=0;i<passThroughPlatforms.length;i++){
            playRect = [player.pos[0],player.pos[1]
            ,player.sprite.size[0],player.sprite.size[1]];
            var ySign = Math.sign(player.velocity[1]) * .5 * dt;
            var platRect = passThroughPlatforms[i].rect;
            
            
            if (!checkRectCollision(playRect,platRect)){
                playRect = [player.pos[0],player.pos[1]
                ,player.sprite.size[0],player.sprite.size[1]];
                predictRect = playRect;
                predictRect[1] += player.velocity[1];
                if (checkRectCollision(predictRect,platRect)){
                    predictRect = playRect;
                    predictRect[1] += ySign;
                    player.velocity[1] = 0;
                    while (!checkRectCollision(predictRect,platRect)){
                        player.pos[1] += ySign;
                        predictRect[1] += ySign;
                    }
                }

                if (!player.standing){
                    predictRect = playRect;
                    predictRect[1] += 1;
                    if (checkRectCollision(predictRect,platRect)){
                        player.standing = true;
                        player.hasJumps = 3;
                        if (player.dropThrough){
                            player.pos[1]++;
                        }
                    } 
                }
            }
        }
        
        if (!player.standing )
            player.velocity[1] += gravity;
    }
    return player.standing;
}
function checkRectCollision(rect1, rect2){
    var hit = true;
    if (rect1[0] + rect1[2] < rect2[0] 
    || rect1[0] > rect2[0] + rect2[2]
    || rect1[1] + rect1[3] < rect2[1]
    || rect1[1] > rect2[1] + rect2[3])
        hit = false;
    return hit;
}

function checkPlayerBounds() {
    // Check bounds
    var kill = false;
    if(player.pos[0] < -150) {
        player.pos[0] = 0;
        kill = true;
    }
    else if(player.pos[0] > 150+canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
        kill = true;
    }

    if(player.pos[1] < -150) {
        player.pos[1] = 0;
        kill = true;
    }
    else if(player.pos[1] > 150+canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
        if (player.velocity[1] > 0)
            player.velocity[1] = 0;
        kill = true;
    }
    if (kill) gameOver();
}
var background = new Image();
background.src = 'img/background.svg';
// Draw everything
function render() {
    //ctx.fillColor = "000000";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
    renderEntities(clouds);
    renderEntity(plat1);
    renderEntity(plat2);
    renderEntity(plat3);
    renderEntity(plat4);
    
    if(!isGameOver){
        renderEntity(player);
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
    player.pos = [canvas.width/2 -40, 200];
};



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
    [canvas.width/2 -40, 200]
);

var otherBody = new GamePiece("player",
    new Sprite('img/charHair2.png', [0, 0], [40, 40], 7, [0, 1]),
    [],
    [canvas.width/2 -40, 200]
);

var bodies = [];
bodies[0] = player;
bodies[1] = otherBody;

bodies[1].pos[0] += 135;
bodies[1].pos[1] -= 20;



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
//var dir = true;

// Speed in pixels per second
var playerSpeed = 200;
var playerJumpSpeed = 220;

// Update game objects
function update(dt) {
    gameTime += dt;

    handleInput(dt);
    console.log("input done");
    checkCollisions(dt);
    console.log("collision done");
    updateEntities(dt);
    console.log("update done");
    
    if(Math.random() < 0.005) {
        clouds.push({
            pos: [-60, Math.random()*canvas.height-100],
            sprite: new Sprite('img/clouds.png', [0, 0], [51, 26], 2, [0,1,2])
        });
    }

};

function handleInput(dt) {
    
    if(input.isDown('LEFT') || input.isDown('a')) {
        if (player.velocity[0] > -player.maxWalkSpeed * dt){
            player.velocity[0] -= player.accel * dt;
            
            if (player.velocity[0] < -player.maxWalkSpeed * dt){
                player.velocity[0] = -player.maxWalkSpeed * dt;
            }else if (player.velocity[0] < 0){
                player.velocity[0] -= player.accel * dt;
            }
        }
        
        if(player.standing){player.sprite.frames = [4,5];}
        else{player.sprite.frames = [9];}
        player.dir = true;
    }else if(input.isDown('RIGHT') || input.isDown('d')) {
        if (player.velocity[0] < player.maxWalkSpeed * dt){
            player.velocity[0] += player.accel * dt;
            
            if (player.velocity[0] > player.maxWalkSpeed * dt){
                player.velocity[0] = player.maxWalkSpeed * dt;
            }else if (player.velocity[0] > 0){
                player.velocity[0] += player.accel * dt;
            }
        }
        
        if(player.standing){player.sprite.frames = [6,7];}
        else{player.sprite.frames = [8];}
        player.dir = false;
    }else{
        player.velocity[0] -= Math.sign(player.velocity[0]) * player.accel * dt * 2;
        if (Math.abs(player.velocity[0]) < player.accel * dt){
            player.velocity[0] = 0;
        }
        
        if(player.dir){player.sprite.frames = [0,1];}
        else{player.sprite.frames = [2,3];}
    }
    
    if(input.isDown('SPACE')){
       if (!player.jump && player.hasJumps > 0){
            player.velocity[1] = -player.jumpMaxSpeed * dt;
            player.hasJumps--;
            player.jump = true;  
        }
        
        if(player.dir){player.sprite.frames = [9];}
        else{player.sprite.frames =  [8];}
    }
    else{
        player.jump = false;
        if(input.isDown('DOWN') || input.isDown('s')) {
            player.velocity[1] = player.jumpMaxSpeed * dt;
            player.dropThrough = true;
            //console.log("PING");
        } else{
            player.dropThrough = false;
        }
    }  
    
    if (input.isDown('Z')){
        var jabExists  = attackExists("jab");//attacks.findIndex(checkAtkArray,"jab");
        //console.log(jabExists);
        if (player.zAtkReady && !jabExists){
            var atkXSpd = 10;
            var atkX = player.pos[0] + (19 * !player.dir);
            atkXSpd = atkXSpd - (atkXSpd * 2* player.dir);
            if (atkXSpd < 0){
                var sprPos = [0,0];
            } else{
                var sprPos = [19,0];
            }
            var atkY = player.pos[1] + 20;
            var atkRect = [atkX,atkY,19,17];
            var shotSprite = new Sprite('img/testShot.png', sprPos, [19, 15], 1, [0]);//new Sprite("img/testShot.png",[0,0],[19,17],1,[0]);
            var shotPiece = new GamePiece("attack",shotSprite,atkRect,[atkX,atkY]);
            shotPiece.atkSet(0,6,[atkXSpd,0],"jab");
            attacks[length] = shotPiece;
            player.zAtkReady = false;
        }
    } else
        player.zAtkReady = true;
}

function attackExists(name){
    var ret = false;
    for(var i = 0;i<attacks.length;i++){
        if (attacks[i].atkName == name)
            ret = true;
            //console.log("PING");
    }
    //console.log("Out of attack exists");
    return ret;
}

function updateEntities(dt) {
    // Update player bodies
    for (var i =0;i<bodies.length;i++){
        bodies[i].sprite.update(dt);
        bodies[i].pos[0] += bodies[i].velocity[0];
        bodies[i].pos[1] += bodies[i].velocity[1];
        bodies[i].rect = [bodies[i].pos[0],bodies[i].pos[1],bodies[i].sprite.size[0],bodies[i].sprite.size[1]];
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

// Collisions
function checkCollisions(dt) {
    //Bodies touch platforms
    for (var i = 0;i<bodies.length;i++){
        bodies[i].standing = false;
        checkPlayerBounds();
        //console.log("player bounds done");
        bodies[i].standing = checkPlatformCollisions(dt,bodies,i);
        //console.log("platform done");
        checkPassthroughPlatformCollisions(dt,bodies,i);
        //console.log("passthrough done");
        checkAttackCollisions(dt, bodies,i);
        //console.log("attack done");
        
    }
    
}

function checkPlatformCollisions(dt,bodies,q){
    var predictRect = [];
       
    var playRect = [];
    bodies[q].standing = false;
    
    
    for(i=0;i<platforms.length;i++){
        playRect = [bodies[q].pos[0],bodies[q].pos[1]
        ,bodies[q].sprite.size[0],bodies[q].sprite.size[1]];
        var xSign = Math.sign(bodies[q].velocity[0]) * .5 * dt;
        var ySign = Math.sign(bodies[q].velocity[1]) * .5 * dt;
        var platRect = platforms[i].rect;
        
        predictRect = playRect;
        predictRect[0] += bodies[q].velocity[0];
        
        if (checkRectCollision(predictRect,platRect)){
            predictRect = playRect;
            predictRect[0] += xSign;
            bodies[q].velocity[0] = 0;
            while (!checkRectCollision(predictRect,platRect)){
                bodies[q].pos[0] += xSign;
                predictRect[0] += xSign;
            }
        }
        
        playRect = [bodies[q].pos[0],bodies[q].pos[1]
        ,bodies[q].sprite.size[0],bodies[q].sprite.size[1]];
        predictRect = playRect;
        predictRect[1] += bodies[q].velocity[1];
        if (checkRectCollision(predictRect,platRect)){
            predictRect = playRect;
            predictRect[1] += ySign;
            bodies[q].velocity[1] = 0;
            while (!checkRectCollision(predictRect,platRect)){
                bodies[q].pos[1] += ySign;
                predictRect[1] += ySign;
            }
        }
        predictRect = playRect;
        predictRect[1] += 1;
        if (checkRectCollision(predictRect,platRect)){
            bodies[q].standing = true;
            bodies[q].hasJumps = 3;
        }
    }
    
    if (!bodies[q].standing )
        bodies[q].velocity[1] += gravity;
    
    return bodies[q].standing;
}

function checkPassthroughPlatformCollisions(dt,bodies,q){
    var predictRect = [];
       
    var playRect = [];
    
    if (bodies[q].velocity[1] > 0){
        for(i=0;i<passThroughPlatforms.length;i++){
            
            
            playRect = [bodies[q].pos[0],bodies[q].pos[1]
            ,bodies[q].sprite.size[0],bodies[q].sprite.size[1]];
            var ySign = Math.sign(bodies[q].velocity[1]) * .5 * dt;
            var platRect = passThroughPlatforms[i].rect;
            
            
            if (!checkRectCollision(playRect,platRect)){
                playRect = [bodies[q].pos[0],bodies[q].pos[1]
                ,bodies[q].sprite.size[0],bodies[q].sprite.size[1]];
                predictRect = playRect;
                predictRect[1] += bodies[q].velocity[1];
                
                
                if (checkRectCollision(predictRect,platRect)){
                    predictRect = playRect;
                    predictRect[1] += ySign;
                    bodies[q].velocity[1] = 0;
                    var yBump = 0;
                    while (!checkRectCollision(predictRect,platRect)
                    && yBump < 20){
                        bodies[q].pos[1] += ySign;
                        predictRect[1] += ySign;
                    }
                    
                    
                }

                if (!bodies[q].standing){
                    predictRect = playRect;
                    predictRect[1] += 1;
                    if (checkRectCollision(predictRect,platRect)){
                        bodies[q].standing = true;
                        bodies[q].hasJumps = 3;
                        if (bodies[q].dropThrough){
                            bodies[q].pos[1]++;
                        }
                    } 
                }
            }
        }
        
        if (!bodies[q].standing )
            bodies[q].velocity[1] += gravity;
    }
    return bodies[q].standing;
}

function checkAttackCollisions(dt,bodies,q){
    for(var j = 0;j<attacks.length;j++){
        var atk = attacks[j];
        var aRect = atk.rect;
        var bRect = bodies[q].rect;
        if (checkRectCollision(aRect,bRect/*atk.rect,bodies[q].rect*/)){
            if (q != atk.owner && attacks[j].atkActive){
                bodies[q].bodyHitProcess(dt, atk);
                attacks[j].atkActive = false;
            }
        }
    }
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
    player.pos = [canvas.width/2 -40, 200];
};


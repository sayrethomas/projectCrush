
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

    lastTime = Date.now();
    main();
}

resources.load([
    'img/character.png'
]);
resources.onReady(init);

// Game state
var player = {
    pos: [canvas.width/2, 200],
    velocity:[0,0],
    sprite: new Sprite('img/character.png', [0, 0], [40, 40]),
    jump: false
};

var platforms = [];

var plat1 = {
    rect:[canvas.width * .25,canvas.height * .75,canvas.width * .25,canvas.height * .25]
};

var plat2 = {
    rect:[canvas.width * .8,canvas.height * .75,canvas.width * .2,canvas.height * .25]
};


platforms[1] = plat1;
platforms[0] = plat2;


var gameTime = 0;

var gravity = .1;


// Speed in pixels per second
var playerSpeed = 200;
var playerJumpSpeed = 200;

// Update game objects
function update(dt) {
    gameTime += dt;

    handleInput(dt);
    checkCollisions(dt);
    updateEntities(dt);


};

function handleInput(dt) {
    var x = player.pos[0] + player.sprite.size[0] / 2;
    var y = player.pos[1] + player.sprite.size[1] / 2;
	
    
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.velocity[1] = playerSpeed * dt;
    }else if(input.isDown('UP') || input.isDown('w')) {
        //player.velocity[1] = -playerJumpSpeed * dt;
        
         if (!player.jump){
            player.velocity[1] = -playerJumpSpeed * dt;
            player.jump = true;
        }
        
    } else{
        player.jump = false;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.velocity[0] = -playerSpeed * dt;
    }else if(input.isDown('RIGHT') || input.isDown('d')) {
        player.velocity[0] = playerSpeed * dt;
    } else
        player.velocity[0] = 0;

        
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
    
    
    
    player.pos[0] += player.velocity[0];
    player.pos[1] += player.velocity[1];
    
    

}

// Collisions
function checkCollisions(dt) {
    checkPlayerBounds();
    /*
    var playPredictRect = [player.pos[0] + player.velocity[0],player.pos[1] + player.velocity[1]
        ,player.sprite.size[0],player.sprite.size[1]];
    */
    var predictRect = [];
       
    var playRect = [];
    
    
    
    //Player touch platform
    var standing = false;
    
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
            //player.pos[1]--;
            
        }
        predictRect = playRect;
        predictRect[1] += 1;
        if (checkRectCollision(predictRect,platRect)){
            standing = true;
        }
    }
    
    
    if (!standing )
        player.velocity[1] += gravity;
    
   
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
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
        if (player.velocity[1] > 0)
            player.velocity[1] = 0;
    }
}
var background = new Image();
background.src = 'img/background.svg';
// Draw everything
function render() {
    //ctx.fillColor = "000000";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
 
    renderEntity(player);
    
    //Platforms
    for(i=0;i<platforms.length;i++){
        var plat = platforms[i];
        ctx.fillStyle = "black";
        ctx.fillRect(plat.rect[0],plat.rect[1],plat.rect[2],plat.rect[3]);
    }
};

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}


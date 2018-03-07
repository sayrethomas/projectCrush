/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global attacks, player*/

(function() {
    function checkAtkArray(atk,thisName){
    return atk.atkName = thisName;
    }
    function inputs(dt){
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
        dir = true;
    }else if(input.isDown('RIGHT') || input.isDown('d')) {
        if (player.velocity[0] < player.maxWalkSpeed * dt){
            player.velocity[0] += player.accel * dt;
            
            if (player.velocity[0] > player.maxWalkSpeed * dt){
                player.velocity[0] = player.maxWalkSpeed * dt;
            }else if (player.velocity[0] > 0){
                player.velocity[0] += player.accel * dt;
            }
        }
        //player.velocity[0] = player.speed * dt;
        if(player.standing){player.sprite.frames = [6,7];}
        else{player.sprite.frames = [8];}
        dir = false;
    }else{
        player.velocity[0] -= Math.sign(player.velocity[0]) * player.accel * dt * 2;
        if (Math.abs(player.velocity[0]) < player.accel * dt){
            player.velocity[0] = 0;
        }
        if(dir){player.sprite.frames = [0,1];}
        else{player.sprite.frames = [2,3];}
    }
    
    if(input.isDown('SPACE')){
       if (!player.jump && player.hasJumps > 0){
            player.velocity[1] = -player.jumpMaxSpeed * dt;
            player.hasJumps--;
            player.jump = true;  
        }
        if(dir){player.sprite.frames = [9];}
        else{player.sprite.frames =  [8];}
    }
    else{
        player.jump = false;
        if(input.isDown('DOWN') || input.isDown('s')) {
            player.velocity[1] = player.jumpMaxSpeed * dt;
            player.dropThrough = true;
        } else{
            player.dropThrough = false;
        }
    }  
    
    if (input.isDown('Z')){
        var jabExists  = attacks.findIndex(checkAtkArray,"jab");
        if (player.zAtkReady && jabExists == -1){
            var shotSprite = new Sprite('img/clouds.png', [0, 0], [51, 26], 2, [0,1,2]);//new Sprite("img/testShot.png",[0,0],[19,17],1,[0]);
            var atkX = player.pos[0];
            var atkY = player.pos[1] + 20;
            var atkRect = [atkX,atkY,19,17];
            var shotPiece = new GamePiece("attack",shotSprite,atkRect,[atkX,atkY]);
            shotPiece.atkSet(0,12,[5,-2],"jab");
            attacks[length] = shotPiece;
            player.zAtkReady = false;
        }
    } else
        player.zAtkReady = true;
    }
window.handleInput = {
       inputs: inputs
    };
})();


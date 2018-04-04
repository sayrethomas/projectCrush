/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global attacks, player*/

(function() {
    function attackExists(name){
        var ret = false;
            for(var i = 0;i<attacks.length;i++){
                if (attacks[i].atkName == name)
                    ret = true;
            }
        return ret;
    }
    function dummyInputs(dt){
        otherBody.velocity[0] -= Math.sign(otherBody.velocity[0]) * otherBody.accel * dt;
        if (Math.abs(otherBody.velocity[0]) < otherBody.accel * dt){
            otherBody.velocity[0] = 0;
        }
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
        player.dir = true;
    }else if(input.isDown('RIGHT') || input.isDown('d')) {
        if (player.velocity[0] < player.maxWalkSpeed * dt){
            player.velocity[0] += player.accel * dt;
            
            
            if (player.velocity[0] > player.maxWalkSpeed * dt){
                console.log("Max is: " + player.maxWalkSpeed * dt)
                console.log("equaled from " + player.velocity[0]);
                player.velocity[0] = player.maxWalkSpeed * dt;
            }else if (player.velocity[0] > 0){
                console.log("Max is: " + player.maxWalkSpeed * dt)
                console.log("reduced from " + player.velocity[0]);
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
        } else{
            player.dropThrough = false;
        }
    }  
    
    //Attacking
    if (input.isDown('Z')){
        var jabExists  = attackExists("jab");//attacks.findIndex(checkAtkArray,"jab");
        //console.log(jabExists);
        if (player.zAtkReady && !jabExists){
            var atkXSpd = 15;
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
            shotPiece.atkSet(0,6,[atkXSpd,0],"jab", player.pos[0]);
            attacks[length] = shotPiece;
            player.zAtkReady = false;
        }
    } else
        player.zAtkReady = true;
    }
window.handleInput = {
       inputs: inputs,
       dummyInputs: dummyInputs
    };
})();


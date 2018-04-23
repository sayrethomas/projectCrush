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
        
        if(player.standing){player.setFrames("playLWalk");}
        else{player.setFrames("playLJump");}
        
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
        
        if(player.standing){player.setFrames("playRWalk");}
        else{player.setFrames("playRJump")}
        
        player.dir = false;
        
    }else{
        player.velocity[0] -= Math.sign(player.velocity[0]) * player.accel * dt * 2;
        
        if (Math.abs(player.velocity[0]) < player.accel * dt){
            player.velocity[0] = 0;
        }
        
        if(player.dir){player.setFrames("playRStand");}
        else{player.setFrames("playLStand");}
    }
    
    if(input.isDown('SPACE')){
       if (!player.jump && player.hasJumps > 0){
            player.velocity[1] = -player.jumpMaxSpeed * dt;
            player.hasJumps--;
            player.jump = true;
        }
        
        if(player.dir){player.setFrames("playLJump");}
        else{player.setFrames("playRJump");}
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
    if (input.isDown('Z') && player.atkType == "none"){
        if (player.zAtkReady){
            if (player.standing)
                if (input.isDown("DOWN"))
                    player.bodyAtkStart("downJab",attacks);
                else if (input.isDown("UP"))
                    player.bodyAtkStart("upJab",attacks);
                else
                    player.bodyAtkStart("jab",attacks);
            else
                player.bodyAtkStart("sexKick",attacks);
        }
    } else if (!input.isDown("Z"))
        player.zAtkReady = true;
    }
window.handleInput = {
       inputs: inputs,
       dummyInputs: dummyInputs
    };
})();


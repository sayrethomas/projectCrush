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
    
    function inputs_1(dt){
        if(input.isDown('a')) {
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
    }else if(input.isDown('d')) {
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
        if(input.isDown('s')) {
            if (player.velocity[1] < player.jumpMaxSpeed * dt)
                player.velocity[1] = player.jumpMaxSpeed * dt;
            player.dropThrough = true;
        } else{
            player.dropThrough = false;
        }
    }  
    
    //Attacking
    if (input.isDown('SHIFT') && player.atkType == "none"){
        if (player.zAtkReady){
            if (player.standing)
                if (input.isDown("s"))
                    player.bodyAtkStart("downJab",attacks);
                else if (input.isDown("w"))
                    player.bodyAtkStart("upJab",attacks);
                else{
                    player.bodyAtkStart("jab",attacks);
                    if(player.dir){player.setFrames("playLJab");}
                    else{player.setFrames("playRJab");}
                }
            else
                player.bodyAtkStart("sexKick",attacks);
        }
        console.log(otherBody.weight);
    } else if (!input.isDown("SHIFT"))
        player.zAtkReady = true;
    }
    
    function inputs_2(dt){
        if(input.isDown('j')) {
        if (otherBody.velocity[0] > -otherBody.maxWalkSpeed * dt){
            otherBody.velocity[0] -= otherBody.accel * dt;
            
            if (otherBody.velocity[0] < -otherBody.maxWalkSpeed * dt){
                otherBody.velocity[0] = -otherBody.maxWalkSpeed * dt;
            }else if (otherBody.velocity[0] < 0){
                otherBody.velocity[0] -= otherBody.accel * dt;
            }
        }
        
        if(otherBody.standing){otherBody.setFrames("playLWalk");}
        else{otherBody.setFrames("playLJump");}
        
        otherBody.dir = true;
    }else if(input.isDown('l')) {
        if (otherBody.velocity[0] < otherBody.maxWalkSpeed * dt){
            otherBody.velocity[0] += otherBody.accel * dt;
            
            
            if (otherBody.velocity[0] > otherBody.maxWalkSpeed * dt){
                otherBody.velocity[0] = otherBody.maxWalkSpeed * dt;
            }else if (otherBody.velocity[0] > 0){
                otherBody.velocity[0] += otherBody.accel * dt;
            }
        }
        
        if(otherBody.standing){otherBody.setFrames("playRWalk");}
        else{otherBody.setFrames("playRJump")}
        
        otherBody.dir = false;
        
    }else{
        otherBody.velocity[0] -= Math.sign(otherBody.velocity[0]) * otherBody.accel * dt * 2;
        
        if (Math.abs(otherBody.velocity[0]) < otherBody.accel * dt){
            otherBody.velocity[0] = 0;
        }
        
        if(otherBody.dir){otherBody.setFrames("playRStand");}
        else{otherBody.setFrames("playLStand");}
    }
    
    if(input.isDown('n')){
       if (!otherBody.jump && otherBody.hasJumps > 0){
            otherBody.velocity[1] = -otherBody.jumpMaxSpeed * dt;
            otherBody.hasJumps--;
            otherBody.jump = true;
        }
        
        if(otherBody.dir){otherBody.setFrames("playLJump");}
        else{otherBody.setFrames("playRJump");}
    }
    else{
        otherBody.jump = false;
        if(input.isDown('k')) {
            if (otherBody.velocity[1] < otherBody.jumpMaxSpeed * dt)
                otherBody.velocity[1] = otherBody.jumpMaxSpeed * dt;
            otherBody.dropThrough = true;
        } else{
            otherBody.dropThrough = false;
        }
    }  
    
    //Attacking
    if (input.isDown('m'))
        console.log('m down');
    
    if (input.isDown('m') && otherBody.atkType == "none"){
        if (otherBody.zAtkReady){
            if (otherBody.standing)
                if (input.isDown("k"))
                    otherBody.bodyAtkStart("downJab",attacks);
                else if (input.isDown("i"))
                    otherBody.bodyAtkStart("upJab",attacks);
                else{
                    otherBody.bodyAtkStart("jab",attacks);
                    if(otherBody.dir){otherBody.setFrames("playLJab");}
                    else{otherBody.setFrames("playRJab");}
                }
            else
                otherBody.bodyAtkStart("sexKick",attacks);
        }
        //console.log(otherBody.weight);
    } else if (!input.isDown("m"))
        otherBody.zAtkReady = true;
    }
    
window.handleInput = {
       inputs_1: inputs_1,
       inputs_2: inputs_2,
       dummyInputs: dummyInputs
    };
})();


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global player */

(function() {
    
//<<<<<<< HEAD
    function sideJab(body, dt){
        
        var fly = body.weight+body.attackPower;
        if (body.stun){
            body.weight += 30;
            body.stunFrames = 5;
            body.stun = false;
        }
        
        if(body.stunFrames > 0 && body.dirOfHit == false){
            body.velocity[1] = -fly/2 * dt;
            body.velocity[0] += fly/4 * dt;
            body.stunFrames -= dt * 10000/60;
/*
=======
    function sideJab(play, dt){
        //var fly = play.weight+player.attackPower;
        if(play.stun == true && play.dirOfHit == false){
            //play.velocity[1] = -fly/2 * dt;
            //play.velocity[0] += fly/4 * dt;
            if(play.pos[0] > play.placeOfHit+fly/3){
                //play.weight += 30;
                play.velocity[0] = 0;
                play.stun = false;
            }
        }
        else if(play.stun == true && play.dirOfHit == true){
            //play.velocity[1] = -fly/2 * dt;
            //play.velocity[0] -= fly/4 * dt;
            if(play.pos[0] < play.placeOfHit-fly/3){
                play.weight += 30;
                play.velocity[0] = 0;
                play.stun = false;
            }
>>>>>>> blockGame
*/
        }
        else if(body.stunFrames > 0 && body.dirOfHit == true){
            body.velocity[1] = -fly/2 * dt;
            body.velocity[0] -= fly/4 * dt;
            body.stunFrames -= dt * 10000/60;
        }
    }    
window.getHit = {
    sideJab: sideJab
};
})();
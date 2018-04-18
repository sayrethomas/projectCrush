/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global player */

(function() {
    
    function sideJab(play, dt){
        var fly = play.weight+player.attackPower;
        if(play.stun == true && play.dirOfHit == false){
            play.velocity[1] = -fly/2 * dt;
            play.velocity[0] += fly/4 * dt;
            if(play.pos[0] > play.placeOfHit+fly/3){
                play.weight += 30;
                play.velocity[0] = 0;
                play.stun = false;
            }
        }
        else if(play.stun == true && play.dirOfHit == true){
            play.velocity[1] = -fly/2 * dt;
            play.velocity[0] -= fly/4 * dt;
            if(play.pos[0] < play.placeOfHit-fly/3){
                play.weight += 30;
                play.velocity[0] = 0;
                play.stun = false;
            }
        }
        }    
window.getHit = {
    sideJab: sideJab
};
})();
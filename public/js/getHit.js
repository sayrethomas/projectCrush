/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function() {
    
    function sideJab(player, dt){
        var fly = 300 - player.weight;
        if(player.stun == true && player.dirOfHit == false){
            player.velocity[1] = -fly * dt;
            player.velocity[0] += fly/3 * dt;
            if(player.pos[0] > player.placeOfHit+fly/3){
                player.weight -= 30;
                player.velocity[0] = 0;
                player.stun = false;
            }
        }
        else if(player.stun == true && player.dirOfHit == true){
            player.velocity[1] = -fly * dt;
            player.velocity[0] -= fly/3 * dt;
            if(player.pos[0] < player.placeOfHit-fly/3){
                player.weight -= 30;
                player.velocity[0] = 0;
                player.stun = false;
            }
        }
        }    
window.getHit = {
    sideJab: sideJab
};
})();
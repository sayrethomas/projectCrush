/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function() {
    // Collisions
    function checkCollisions(bodies, dt) {
    //Bodies touch platforms
    for (var i = 0;i<bodies.length;i++){
        bodies[i].standing = false;
        checkPlayerBounds();
        bodies[i].standing = checkPlatformCollisions(dt,bodies,i);
        checkPassthroughPlatformCollisions(dt,bodies,i);
        }
    
    }
    window.collisions = {
        checkCollisions: checkCollisions
    };
        
})();


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global passThroughPlatforms, platforms, gravity, bodies, attacks */

(function() {
 
        // Collisions
        function checkCollisions(dt) {
        //Bodies touch platforms
        for (var i = 0;i<bodies.length;i++){
            bodies[i].standing = false;
            checkPlayerBounds();
            bodies[i].standing = checkPlatformCollisions(dt,bodies,i);
            checkPassthroughPlatformCollisions(dt,bodies,i);
            checkAttackCollisions(dt, bodies,i)

        }

    }
        function checkPlayerBounds() {
        // Check bounds
        var kill = false;
        for (var i = 0;i<bodies.length;i++){
            if(bodies[i].pos[0] < -150) {
                bodies[i].pos[0] = 0;
                kill = true;
            }
            else if(bodies[i].pos[0] > 150+canvas.width - bodies[i].sprite.size[0]) {
                bodies[i].pos[0] = canvas.width - bodies[i].sprite.size[0];
                kill = true;
            }

            if(bodies[i].pos[1] < -150) {
                bodies[i].pos[1] = 0;
                kill = true;
            }
            else if(bodies[i].pos[1] > 150+canvas.height - bodies[i].sprite.size[1]) {
                bodies[i].pos[1] = canvas.height - bodies[i].sprite.size[1];
                if (bodies[i].velocity[1] > 0)
                    bodies[i].velocity[1] = 0;
                kill = true;
            }
    }
        if (kill) gameOver();
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
                        while (!checkRectCollision(predictRect,platRect)){
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
                    if(bodies[q].pos[0] > atk.atkOrig) { 
                        bodies[q].dirOfHit = false;
                    }
                    else {
                        bodies[q].dirOfHit = true;
                    }
                    bodies[q].stun = true;
                    bodies[q].placeOfHit = bodies[q].pos[0];
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
    window.collisions = {
        checkCollisions: checkCollisions
    };
        
})();


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global player, ctx, player1, player2, otherBody */

(function(){
            var strPercent = 50;
            var spdPercent = 50;
            var wgtPercent = 50;
            var totalPoints = 150;
            //var actPlay = player;
            document.getElementById('str-down').addEventListener('click', function() {
                        if(strPercent > 50 && totalPoints <=450){
                           totalPoints -= 50;
                           strPercent -= 50;
//                           if(player1){player.strength -= 50; actPlay = player;}
//                           if(player2){otherBody.strength -= 50; actPlay = otherBody;}
                           document.getElementById('str').style.width = percentage(strPercent) +'%';
                           $('.strength').html(strPercent+'/250');
                           //construct(actPlay);
                       }
                        });
            document.getElementById('str-up').addEventListener('click', function() {
                        if(strPercent < 250 && totalPoints <=400){
                            totalPoints += 50;
                           strPercent += 50;
//                           if(player1){player.strength += 50; actPlay = player;}
//                           if(player2){otherBody.strength += 50; actPlay = otherBody;}
                           document.getElementById('str').style.width = percentage(strPercent) +'%';
                           $('.strength').html(strPercent+'/250');
                           //construct(actPlay);
                       }
                        });
            document.getElementById('spd-down').addEventListener('click', function() {
                        if(spdPercent > 50 && totalPoints <=450){
                           totalPoints -= 50;
                           spdPercent -= 50;
//                           if(player1){player.speed -= 50; actPlay = player;}
//                           if(player2){otherBody.speed -= 50; actPlay = otherBody;}
                           document.getElementById('spd').style.width = percentage(spdPercent) +'%';
                           $('.speed').html(spdPercent+'/250');
                           //construct(actPlay);
                       }
                        });
            document.getElementById('spd-up').addEventListener('click', function() {
                        if(spdPercent < 250 && totalPoints <=400){
                            totalPoints += 50;
                           spdPercent += 50;
//                           if(player1){player.speed += 50; actPlay = player;}
//                           if(player2){otherBody.speed += 50; actPlay = otherBody;}
                           document.getElementById('spd').style.width = percentage(spdPercent) +'%';
                           $('.speed').html(spdPercent+'/250');
                           //construct(actPlay);
                       }
                        });
            document.getElementById('wgt-down').addEventListener('click', function() {
                        if(wgtPercent > 50 && totalPoints <=450){
                           totalPoints -= 50;
                           wgtPercent -= 50;
//                           if(player1){player.weight -= 50; actPlay = player;}
//                           if(player2){otherBody.weight -= 50; actPlay = otherBody;}
                           document.getElementById('wgt').style.width = percentage(wgtPercent) +'%';
                           $('.weight').html(wgtPercent+'/250');
                           //construct(actPlay);
                       }
                        });
            document.getElementById('wgt-up').addEventListener('click', function() {
                        if(wgtPercent < 250 && totalPoints <=400){
                           totalPoints += 50;
                           wgtPercent += 50;
//                           if(player1){player.weight += 50; actPlay = player;}
//                           if(player2){otherBody.weight += 50; actPlay = otherBody;}
                           document.getElementById('wgt').style.width = percentage(wgtPercent) +'%';
                           $('.weight').html(wgtPercent+'/250');
                           //construct(actPlay);
                       }
                        });            
            function percentage(num){
                var newNum = num/250;
                return newNum*100-1;
            }
            function construct(actPlay){
                actPlay.jumpMaxSpeed = strPercent-wgtPercent/5;
                actPlay.maxWalkSpeed = spdPercent-wgtPercent/5;
                actPlay.attackPower = strPercent-spdPercent/5;
                actPlay.strength = strPercent;
                actPlay.speed = spdPercent;
                actPlay.weight = wgtPercent;
                $('.availPts').html(totalPoints+'/450 Pts. Available');
            }
 window.menu2 = {
       construct: construct
    };
})();
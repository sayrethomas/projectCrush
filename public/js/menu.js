/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global player, ctx */

(function(){
            var strPercent = 50;
            var spdPercent = 50;
            var wgtPercent = 50;
            var totalPoints = 150;
            document.getElementById('str-down').addEventListener('click', function() {
                        if(strPercent > 50 && totalPoints <=450){
                           totalPoints -= 50;
                           strPercent -= 50;
                           player.strength -= 50;
                           document.getElementById('str').style.width = percentage(strPercent) +'%';
                           $('.strength').html(strPercent+'/250');
                           construct();
                       }
                        });
            document.getElementById('str-up').addEventListener('click', function() {
                        if(strPercent < 250 && totalPoints <=400){
                            totalPoints += 50;
                           strPercent += 50;
                           player.strength += 50;
                           document.getElementById('str').style.width = percentage(strPercent) +'%';
                           $('.strength').html(strPercent+'/250');
                           construct();
                       }
                        });
            document.getElementById('spd-down').addEventListener('click', function() {
                        if(spdPercent > 50 && totalPoints <=450){
                           totalPoints -= 50;
                           spdPercent -= 50;
                           player.speed -= 50;
                           document.getElementById('spd').style.width = percentage(spdPercent) +'%';
                           $('.speed').html(spdPercent+'/250');
                           construct();
                       }
                        });
            document.getElementById('spd-up').addEventListener('click', function() {
                        if(spdPercent < 250 && totalPoints <=400){
                            totalPoints += 50;
                           spdPercent += 50;
                           player.speed += 50;
                           document.getElementById('spd').style.width = percentage(spdPercent) +'%';
                           $('.speed').html(spdPercent+'/250');
                           construct();
                       }
                        });
            document.getElementById('wgt-down').addEventListener('click', function() {
                        if(wgtPercent > 50 && totalPoints <=450){
                           totalPoints -= 50;
                           wgtPercent -= 50;
                           player.weight -= 50;
                           document.getElementById('wgt').style.width = percentage(wgtPercent) +'%';
                           $('.weight').html(wgtPercent+'/250');
                           construct();
                       }
                        });
            document.getElementById('wgt-up').addEventListener('click', function() {
                        if(wgtPercent < 250 && totalPoints <=400){
                           totalPoints += 50;
                           wgtPercent += 50;
                           player.weight += 50;
                           document.getElementById('wgt').style.width = percentage(wgtPercent) +'%';
                           $('.weight').html(wgtPercent+'/250');
                           construct();
                       }
                        });            
            function percentage(num){
                var newNum = num/250;
                return newNum*100-1;
            }
            function construct(){
                player.jumpMaxSpeed = player.strength-player.weight/5;
                player.maxWalkSpeed = player.speed-player.weight/5;
                player.attackPower = player.strength-player.speed/5;
                $('.availPts').html(totalPoints+'/450 Pts. Available');
            }
 
})();
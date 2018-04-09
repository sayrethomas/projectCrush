/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global player */

(function(){
            var strPercent = 50;
            var spdPercent = 50;
            var wgtPercent = 50;
            document.getElementById('str-down').addEventListener('click', function() {
                        if(strPercent > 50){
                           strPercent -= 50;
                           player.strength -= 50;
                           document.getElementById('str').style.width = percentage(strPercent) +'%';
                           $('.strength').html(strPercent+'/250');
                       }
                        });
            document.getElementById('str-up').addEventListener('click', function() {
                        if(strPercent < 250){
                           strPercent += 50;
                           player.strength += 50;
                           console.log(player.strength);
                           document.getElementById('str').style.width = percentage(strPercent) +'%';
                           $('.strength').html(strPercent+'/250');
                       }
                        });
            document.getElementById('spd-down').addEventListener('click', function() {
                        if(spdPercent > 50){
                           spdPercent -= 50;
                           player.speed -= 50;
                           document.getElementById('spd').style.width = percentage(spdPercent) +'%';
                           $('.speed').html(spdPercent+'/250');
                       }
                        });
            document.getElementById('spd-up').addEventListener('click', function() {
                        if(spdPercent < 250){
                           spdPercent += 50;
                           player.speed += 50;
                           document.getElementById('spd').style.width = percentage(spdPercent) +'%';
                           $('.speed').html(spdPercent+'/250');
                       }
                        });
            document.getElementById('wgt-down').addEventListener('click', function() {
                        if(wgtPercent > 50){
                           wgtPercent -= 50;
                           player.weight -= 50;
                           document.getElementById('wgt').style.width = percentage(wgtPercent) +'%';
                           $('.weight').html(wgtPercent+'/250');
                       }
                        });
            document.getElementById('wgt-up').addEventListener('click', function() {
                        if(wgtPercent < 250){
                           wgtPercent += 50;
                           player.weight += 50;
                           document.getElementById('wgt').style.width = percentage(wgtPercent) +'%';
                           $('.weight').html(wgtPercent+'/250');
                       }
                        });            
            function percentage(num){
                var newNum = num/250;
                return newNum*100-1;
            }
})();
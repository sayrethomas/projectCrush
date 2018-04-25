(function(){
    function GamePiece(type,sprite,rect,pos){
        this.type = type;
        this.rect = rect;
        this.pos = pos;
        this.maxSpeed = 150;
        this.accel = 14;
        this.velocity = [0,0];
        this.sprite = sprite;

        if(type == "player"){
            this.weight = 50;
            this.strength = 50;
            this.speed = 50;
            this.maxWalkSpeed = 50;
            this.jumpMaxSpeed = 50;
            this.attackPower = 50;
            this.jump = false;
            this.hasJumps = 3;
            
            this.standing = false;
            this.onPassThorugh = false;
            this.dropThrough = false;
            
            this.jumpAccel = 16;
            this.zAtkReady = true;
            this.atkType = "none";
            this.atkFrames = 0;
            
            this.dir = true;
            this.stun = false;
            this.stunFrames = 0;
            this.placeOfHit = 0;
            this.dirOfHit = false;
        }
    }
    
    
    GamePiece.prototype = {
        atkSet: function(owner,time,velocity,name, origin){
            this.owner = owner;
            this.atkActive = true;
            this.atkTime = time;
            this.velocity = velocity;
            this.atkName = name;
            this.atkOrig = origin;
            this.atkPower = this.attackPower;
        },
        setFrames: function(frameString,index){
            if (index === undefined){
                this.sprite.frames = sFrames[frameString];
            } else{
                this.sprite.frames = [sFrames[frameString][index]];
                console.log("Frame ", sFrames[frameString][index]);
            }
        },
        atkUpdate: function(dt){
            if (this.atkName == "sexKick"){
               this.pos[0] = bodies[this.owner].pos[0];
               this.pos[1] = bodies[this.owner].pos[1] + 25;
               if (bodies[this.owner].standing == true){
                   this.atkTime = 1;
               }
            }
            this.atkTime--;
        },
        bodyAtkStart:function(type,atkArray){
            if (type == "jab" || type == "upJab" || type == "downJab"){
                //Body variables
                this.atkType = type;
                this.atkFrames = 6;
                this.zAtkReady = false;
            }
            else if (type == "sexKick"){
                this.atkType = type;
                this.atkFrames = 50;
                this.zAtkReady = false;
            }
        },
        bodyAtkProcess:function(type,atkArray,dt){
            if (this.atkFrames > 0){
                if (type == "jab" || type == "upJab" || type == "downJab"){
                    var sString;
                    if (this.dir)
                        sString = "playLPunch";
                    else
                        sString = "playRPunch";
                    
                    if (this.atkFrames < 5)
                        this.setFrames(sString,0);
                    else
                        this.setFrames(sString,1);
                    
                    if (this.atkFrames == 5){
                        var atkXSpd = 15;
                        var atkX = this.pos[0] + (19 * !this.dir);
                        atkXSpd = atkXSpd - (atkXSpd * 2* this.dir);
                        if (atkXSpd < 0){
                            var sprPos = [0,0];
                        } else{
                            var sprPos = [19,0];
                        }
                        
                        var atkYSpd = 0;
                        if (type == "upJab")
                            atkYSpd = -10;
                        else if (type == "downJab")
                            atkYSpd = 10;
                        
                        var atkY = this.pos[1] + 20;
                        var atkRect = [atkX,atkY,19,17];
                        var shotSprite = new Sprite('img/testShot.png', sprPos, [19, 15], 1, [0]);//new Sprite("img/testShot.png",[0,0],[19,17],1,[0]);
                        var shotPiece = new GamePiece("attack",shotSprite,atkRect,[atkX,atkY]);
                        shotPiece.atkSet(0,6,[atkXSpd,atkYSpd],"jab", this.pos[0]);
                        atkArray[length] = shotPiece;
                    }
                    
                    var xDirFactor = 1 - 2* this.dir;
                    this.velocity[0] = 0;//xDirFactor * 50 * dt;
                    if (this.velocity[1] < -1 * dt)
                        this.velocity[1] = -1 * dt;
                    
                }
                else if (type =="sexKick"){
                    if (this.atkFrames == 48){
                        var atkXSpd = 15;
                        var atkX = this.pos[0];// + (19 * !this.dir);
                        var sprPos = [0,0];
                        /*
                        atkXSpd = atkXSpd - (atkXSpd * 2* this.dir);
                        if (atkXSpd < 0){
                            var sprPos = [0,0];
                        } else{
                            var sprPos = [19,0];
                        }
                        */
                        var atkY = this.pos[1] + 20;
                        var atkRect = [atkX,atkY,19,17];
                        var shotSprite = new Sprite('img/testShot.png', sprPos, [19, 15], 1, [0]);//new Sprite("img/testShot.png",[0,0],[19,17],1,[0]);
                        var shotPiece = new GamePiece("attack",shotSprite,atkRect,[atkX,atkY]);
                        shotPiece.atkSet(0,this.atkFrames,[0,0],"sexKick", this.pos[0]);
                        atkArray[length] = shotPiece;
                    }
                }
                this.atkFrames--;
            } else
                this.atkType = "none";
        },
        bodyHitProcess: function(dt){
            getHit.sideJab(this, dt);
        }
    };

    
    window.GamePiece = GamePiece;
})();
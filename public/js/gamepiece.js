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
            this.maxWalkSpeed = 50*this.speed/this.weight;
            this.jumpMaxSpeed = 50*this.strength/this.weight;
            this.attackPower = 50*this.strength/this.speed;;
            this.jump = false;
            this.hasJumps = 3;
            this.standing = false;
            this.onPassThorugh = false;
            this.dropThrough = false;
            
            this.jumpAccel = 16;
            this.zAtkReady = true;
            this.dir = true;
            this.stun = false;
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
        atkUpdate: function(){
            this.atkTime--;
        },
        bodyHitProcess: function(dt){
                getHit.sideJab(this, dt);
        }
        
    };
    /*
    var attacks = {
        jab = {
            pos:[],
            rect:[],
            timer:6
        }
    }*/

    
    window.GamePiece = GamePiece;
})();
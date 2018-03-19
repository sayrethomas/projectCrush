(function(){
    function GamePiece(type,sprite,rect,pos){
        this.type = type;
        this.rect = rect;
        this.pos = pos;
        this.velocity = [0,0];
        this.sprite = sprite;
        
        if (type =="player"){
            this.jump = false;
            this.hasJumps = 3;
            this.standing = false;
            this.onPassThorugh = false;
            this.dropThrough = false;
            this.maxSpeed = 150;
            this.maxWalkSpeed = 200;
            this.jumpMaxSpeed = 220;
            this.accel = 14;
            this.jumpAccel = 16;
            this.zAtkReady = true;
            this.dir = true;
        }
    }
    
    GamePiece.prototype = {
        atkSet: function(owner,time,velocity,name){
            this.owner = owner;
            this.atkActive = true;
            this.atkTime = time;
            this.velocity = velocity;
            this.atkName = name;
        },
        atkUpdate: function(){
            this.atkTime--;
        },
        bodyHitProcess: function(dt, atkPiece){
            this.velocity[1] = -100 * dt;
        }
    };

    
    window.GamePiece = GamePiece;
}
)();
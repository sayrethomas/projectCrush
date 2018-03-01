(function(){
    function GamePiece(type,sprite,rect,pos,speed,accel,pass){
        this.type = type;
        this.rect = rect;
        this.pos = pos;
        this.speed = speed;
        this.accel = accel;
        this.velocity = [0,0];
        this.sprite = sprite;
        
        if(type == "player"){
        this.jump = false;
        this.hasJumps = 3;
        this.standing  = false;
        this.onPassThrough = false;
        this.dropThrough = false;
        this.jumpSpeed = 220;
        this.jumpAccel = 16;
        }
//        
//        if(type == "platform"){
//            if()
//        }
    }
    
    
    
    GamePiece.prototype = {
        
        
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
}
)();
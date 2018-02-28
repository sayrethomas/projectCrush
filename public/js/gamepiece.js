(function(){
    function GamePiece(type,sprite,rect,pos){
        this.type = type;
        this.rect = rect;
        this.pos = pos;
        this.velocity = [0,0];
        this.sprite = sprite;
    }
    
    GamePiece.prototype = {
        atkSet: function(time,velocity,name){
            this.atkActive = true;
            this.atkTime = time;
            this.velocity = velocity;
            this.atkName = name;
        },
        atkUpdate: function(){
            this.atkTime--;
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
}
)();
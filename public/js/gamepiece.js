(function(){
    function GamePiece(type,sprite,rect,pos){
        this.type = type;
        this.rect = rect;
        this.pos = pos;
        this.velocity = [0,0];
        this.sprite = sprite;
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
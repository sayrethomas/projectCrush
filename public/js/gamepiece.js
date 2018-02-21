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
    
    window.GamePiece = GamePiece;
}
)();
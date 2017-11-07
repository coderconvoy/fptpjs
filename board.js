//conventions:
//Param order Canvas,Board,Hex,x,y,s
//

board = {};

basehex = {
    color :"red"
};

board.drawHex = function(ctx,hex,x,y,s){ 
    ctx.fillStyle = hex.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillRect(x,y,s,s);
    ctx.strokeRect(x,y,s,s);
}

board.nToXy = function(b,n){
    return {
        x : n % b.w ,
        y : Math.floor(n / b.w)
    }
}

board.xyToN = function(b,x,y){
    if (y === undefined ){
        return x.x + x.y * b.w;
    }
    return x + y * b.w;
}


board.drawBoard = function(ctx,b,w,h){ 
    s = Math.min(w/ b.w, (h+0.5)/b.h);
    console.log("S:" ,s)
    for (p in b.map) {
        xy = board.nToXy(b,p); 
        yp = xy.x %2 === 0 ? 0 : s/2;
        board.drawHex(ctx,b.map[p],s*xy.x,yp + s*xy.y,s); 
    }
}

board.mposToXy = function(b,mx,my,w,h){
    s = Math.min(w/ b.w, (h+0.5)/b.h);
    
    hexx = Math.floor(mx / s)

    if (hexx > b.w) return undefined;
    
    yp = hexx %2 === 0 ? 0 : s/2;

    hexy = Math.floor( (my - yp) / s)

    if (hexy > b.h )return undefined;
    return {
        x:hexx,
        y:hexy
    }
}


//w and h cannot be zero
function Board(w,h){
    var res = {w:w, h:h, map:[]}
    for (var i = 0; i < w; i++ ){
        for (var j = 0; j < h; j++ ){
            res.map[board.xyToN(res,i,j)] = Object.create(basehex);
        }
    }
    return res;
}


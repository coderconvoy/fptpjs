//dep ukmap.js
//dep board.js
//dep canvas.js
//dep player.js
//dep deck.js
//dep layout/rowcol.js

board = Board(uk.w,uk.h,uk.country,uk.map);
can = readyCanvas(document.getElementById("cancan"));

lay = RowColLayout("red",1);
plLay = RowColLayout("green",1);
lay.add(board,3);
lay.add(plLay,1);
//lay.add(board,1); //dumb experiment, 2 of the same object on display
//lay.add(board,3); //dumb experiment, 2 of the same object on display




bdeck = NumDeck(1,50); 
shuffle(bdeck.cards);
players = Players(4,bdeck);
players[0].human = true;
for (let p = 0; p < players.length; p++){
    plLay.add(players[p],1);
}


can.draw = function(){
    console.log("Hello");
    let ctx = can.ctx;
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(0,0,can.width,can.height);
    lay.draw(can.ctx,can.width,can.height);
    //board.draw(can.ctx,can.width,can.height);
}


last_city = "";

board.onmousedown = function(e,x,y,w,h){
    let bxy = board.mposToXy(x,y,w,h)
    if (bxy === undefined) {
        return;
    }
    let mapn = board.xyToN(bxy);
    let hex = board.hmap[mapn];

    this.battlebus = mapn;
    if (hex.hexType === "City"){
        last_city = hex.constituency;
        console.log("Choosing",last_city);
        can.draw();
        return;
    }
    console.log("changing",mapn,last_city);

    board.tryGerrymander(mapn,last_city);
    last_city ="";
    can.draw();
}

players[0].onmousedown= function(e,x,y,w,h){
    
    let c = this.cardSelect(x,y,w,h);
    if (c === undefined) return;
  
    let crd = this.hand.splice(c,1)[0];
    bdeck.discard(crd); 
    can.draw();
}


can.onmousedown = can.mouser(function(e,x,y){
    let dg = lay.getxy(can.width,can.height,x,y);
    if (dg) if (dg.c.onmousedown) dg.c.onmousedown(e,dg.x,dg.y,dg.w,dg.h);
});


function tg(n,c){
    board.tryGerrymander(n,c);
    can.draw(); 
}
can.draw();

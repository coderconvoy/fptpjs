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

mouseoverrider = undefined;



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
    if (players.turn() !== 0) return;
    let bxy = board.mposToXy(x,y,w,h)
    if (bxy === undefined) {
        return false;
    }
    let mapn = board.xyToN(bxy);
    let hex = board.hmap[mapn];
    if (hex.owner !== undefined) {
        return false;
    }
    console.log(mapn,hex);
    if (!hex.inBoard()) return false;
    this.battlebus = mapn;
    return true; 
}


players[0].onmousedown= function(e,x,y,w,h){
    
    if( board.battlebus === undefined)return false;
    //TODO showmessage "please select battle location"
    
    let c = this.mouseSelectBudget(x,y,w,h);
    if (c === undefined) return false;

    for (let i = 1; i < players.length; i++){
        players[i].chooseBudget();
    }
  
    mouseoverrider = underride(voteProvince);
    return true;
}

function voteProvince(){
    let best = -1;
    let bestp = -1;
    for (let i = 0; i < players.length; i++){
        let nbest = players[i].discardBudget();
        if (nbest === undefined) continue;
        if (nbest > best){
            best = nbest;
            bestp = i;
        }
    }

    console.log("Winner = ",bestp," with score of ", best);
    let hex = board.hmap[board.battlebus];
    hex.owner = players[bestp];
    board.battlebus = undefined;
    let pt = players.endTurn();
    if (pt != 0){
        board.randomBattle();
    }
    let cRes = board.calculate();
    for (let i = 0; i < players.length; i++){
        let sc = cRes[i];
        if (sc === undefined) sc = 0;
        players[i].score = sc;
    }

    can.draw();
}


function underride(f){
    return function(){
        f();
        mouseoverrider = undefined;
    }
}

can.onmousedown = can.mouser(function(e,x,y){
    if (mouseoverrider ){
        if (mouseoverrider())return;
    }
    let dg = lay.getxy(can.width,can.height,x,y);
    if (dg) 
        if (dg.c.onmousedown) 
            if (dg.c.onmousedown(e,dg.x,dg.y,dg.w,dg.h) )
                can.draw();
});


function tg(n,c){
    board.tryGerrymander(n,c);
    can.draw(); 
}
can.draw();

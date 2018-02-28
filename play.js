//dep assets/ukmap.js
//dep board.js
//dep canvas.js
//dep player.js
//dep deck.js
//dep layout/rowcol.js
//dep layout/modal.js
//dep messagebox.js
//dep assets/newscards.js
//dep news.js

board = Board(uk.w,uk.h,uk.constits,uk.map);
can = readyCanvas(document.getElementById("cancan"));


lay = RowColLayout("red",1);
plLay = RowColLayout("green",1);
lay.add(board,3);
lay.add(plLay,1);

modlay = ModalLayout(lay);
//lay.add(board,1); //dumb experiment, 2 of the same object on display
//lay.add(board,3); //dumb experiment, 2 of the same object on display

mouseoverrider = undefined;


newsdeck = NewsDeck(newscardlist);
newsdeck.shuffle();

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
    modlay.draw(can.ctx,can.width,can.height);
    //board.draw(can.ctx,can.width,can.height);
}

function showMessage(title,mess,callback,tcol){
    let mbox = MessageBox(title,mess,"black",tcol);
    
    mbox.onmousedown = function(){
        if (callback) callback();

        modlay.unsetModal();
        can.draw();
    }
    modlay.setModal(mbox);
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
    console.log("Click At: ",mapn,hex);
    if (!hex.inBoard()) return false;
    this.battlebus = mapn;
    return true; 
}


players[0].onmousedown= function(e,x,y,w,h){
    
    if( board.battlebus === undefined){
        showMessage("Location?", "please select a battle location"); 
        return true; //Something changed
    }
    
    let c = this.mouseSelectBudget(x,y,w,h);
    if (c === undefined) return false;

    for (let i = 1; i < players.length; i++){
        players[i].chooseBudget();
    }
    let {bestp,bests}  = provinceWinner();
    
    //show winner on board
    let hex = board.hmap[board.battlebus];
    hex.owner = players[bestp];
    //show collected cities on player
    let cRes = board.calculate();
    for (let i = 0; i < players.length; i++){
        let sc = cRes[i];
        if (sc === undefined) sc = 0;
        players[i].score = sc;
    }
  
    showMessage("Player "+ bestp + " wins province", "Sway : " + bests,function(){
        players.forEach(function(p){
            p.discardBudget();
        });
        board.battlebus = undefined;
        let pt = players.endTurn();
        if (pt != 0){
            board.randomBattle();
        }
        can.draw();
    },players[bestp].pcol);
    return true;
}

function provinceWinner(discard){
    //TODO include power cards etc
    let best = -1;
    let bestp = -1;
    for (let i = 0; i < players.length; i++){
        let nbest = players[i].chosenBudget();
        if (nbest === undefined) continue;
        if (nbest > best){
            best = nbest;
            bestp = i;
        }
    }
    return {bestp:bestp,bests:best}
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
    let dg = modlay.getxy(can.width,can.height,x,y);
    if (dg) 
        if (dg.c.onmousedown) 
            if (dg.c.onmousedown(e,dg.x,dg.y,dg.w,dg.h) )
                can.draw();
});


function tg(n,c){
    board.tryGerrymander(n,c);
    can.draw(); 
}

showMessage("Where to Attack","Please select a region to campaign for");
can.draw();

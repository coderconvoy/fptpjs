//dep uk.js
//dep board.js
//dep canvas.js


board = Board(uk.w,uk.h,uk.country);

const dw = 400
const dh = 500

cancan.draw = function(ctx){
    board.drawBoard(ctx,dw,dh);
}

can.onmousemove = cancan.mouser(function(e,x,y){ 
    let bxy = board.mposToXy(x,y,dw,dh)

    if (bxy == undefined) {
        return;
    }

    let mapn = board.xyToN(bxy);
    item = board.map[mapn];
    let cs = document.getElementById("currstr");
    cs.innerHTML = item.string();
})

can.onmousedown = cancan.mouser(function(e,x,y){
    let bxy = board.mposToXy(x,y,dw,dh)

    if (!bxy) {
        return;
    }
    
    let mapn = board.xyToN(bxy);
    item = board.map[mapn];
    htype = document.getElementById("sel_type").value;
    constituency = document.getElementById("sel_const").value;

    item.hexType = htype;
    if (constituency != "_" )
    item.constituency = constituency;

    board.draw(ctx,dw,dh);

})

function outputJSON(){
    let ta = document.getElementById("textout");
    ta.value = JSON.stringify(board); 
}

function inputJSON(){
    let ta = document.getElementById("textout");
    ob = JSON.parse(ta.value);
    
    let b = Board(ob.w,ob.h,ob.country);
    for (p in b.map ){
        Object.assign(b.map[p],ob.map[p]);
    }

    board = b;
    board.draw(ctx,dw,dh);
}

//Init Code

let s_const = document.getElementById("sel_const")
let op = document.createElement("option");
op.value = "_";
op.innerHTML = "_";
s_const.appendChild(op);
for (p in uk.country){
    let op = document.createElement("option");
    op.value = p;
    op.innerHTML = p;
    s_const.appendChild(op);
}

board.draw(ctx,dw,dh);

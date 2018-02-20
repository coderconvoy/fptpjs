//dep ukcities.js
//dep board.js
//dep canvas.js


board = Board(uk.w,uk.h,uk.country);
cancan = readyCanvas(document.getElementById("cancan")); 


cancan.draw = function(ctx){
    board.draw(cancan.ctx,cancan.width,cancan.height);
}

cancan.onmousemove = cancan.mouser(function(e,x,y){ 
    let bxy = board.mposToXy(x,y,cancan.width,cancan.height)

    if (bxy == undefined) {
        return;
    }

    let mapn = board.xyToN(bxy);
    item = board.hmap[mapn];
    let cs = document.getElementById("currstr");
    cs.innerHTML = item.string();
})

cancan.onmousedown = cancan.mouser(function(e,x,y){
    let bxy = board.mposToXy(x,y,cancan.width,cancan.height)

    if (!bxy) {
        return;
    }
    
    let mapn = board.xyToN(bxy);
    item = board.hmap[mapn];
    htype = document.getElementById("sel_type").value;
    constituency = document.getElementById("sel_const").value;

    item.hexType = htype;
    if (constituency != "_" )
    item.constituency = constituency;

    board.draw(cancan.ctx,cancan.width,cancan.height);

})

function outputJSON(){
    let ta = document.getElementById("textout");
    ta.value = JSON.stringify(board); 
}

function inputJSON(){
    let ta = document.getElementById("textout");
    ob = JSON.parse(ta.value);
    
    let b = Board(ob.w,ob.h,ob.country);

    board = b;
    board.draw(cancan.ctx,cancan.width,cancan.height);
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

board.draw(cancan.ctx,cancan.width,cancan.height);

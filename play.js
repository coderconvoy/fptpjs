//dep ukmap.js
//dep board.js
//dep canvas.js
//

board = Board(uk.w,uk.h,uk.country,uk.map);
board.setBorders();
can = readyCanvas(document.getElementById("cancan"));

can.draw = function(){
    console.log("Hello");
    let ctx = can.ctx;
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(0,0,can.width,can.height);
    board.draw(can.ctx,can.width,can.height);
}


can.onmousedown = can.mouser(function(e,x,y){
    let bxy = board.mposToXy(x,y,cancan.width,cancan.height)
    if (bxy === undefined) {
        return;
    }
    let mapn = board.xyToN(bxy);
    console.log(mapn, board.map[mapn]);
});


can.draw();

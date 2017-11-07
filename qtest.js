

b = Board(9,13);

const dw = 200
const dh = 400

cancan.draw = function(ctx){
    board.drawBoard(ctx,b,dw,dh);
}
board.drawBoard(ctx,b,dw,dh);


can.onmousedown = cancan.mouser(function(e,x,y){
    console.log(e,x,y);
    let bxy = board.mposToXy(b,x,y,dw,dh)

    if (!bxy) {
        return;
    }
    
    let mapn = board.xyToN(b,bxy);
    item = b.map[mapn];
    country = document.getElementById("sel_country").value;
    constituency = document.getElementById("sel_const").value;

    item.country = country;
    item.constituency = constituency;

    


    
    console.log("click:" + bxy.x,bxy.y);
    board.drawBoard(ctx,b,dw,dh);

})





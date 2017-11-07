
can = document.getElementById("cancan");
ctx = can.getContext("2d");

cancan = {
}

cancan.mouser = function(f) { 
    return function(e){
        r = can.getBoundingClientRect(); 
        f(e,e.clientX - r.left,e.clientY - r.top);
    }
}


window.onresize = function(){
    var rect = can.getBoundingClientRect();
    console.log("resize:",rect);
    can.width = rect.width;
    can.height = rect.height;
    if (cancan.draw) {
        cancan.draw(ctx)
    }
}

window.onresize();

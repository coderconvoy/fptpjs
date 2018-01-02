//dep override.js


function readyCanvas(can){
    let ctx = can.getContext("2d");

    let canresize = function(){
    
        let rect = can.getBoundingClientRect();
        console.log("resize:",rect);
        can.width = rect.width;
        can.height = rect.height;
        if (can.draw) {
            can.draw(ctx)
        }
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(1,1,rect.width -2,rect.height-2);
    } 
    //window.onresize = canresize;
    overrider.ride(window,"onresize",canresize);

    can.mouser = function(f){
        return function(e){
            r = can.getBoundingClientRect(); 
            f(e,e.clientX - r.left,e.clientY - r.top);
        }
    }


    canresize();
    can.ctx = ctx;
    return can;
}





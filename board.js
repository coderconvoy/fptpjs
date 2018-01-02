//conventions:
//Param order ctx,Hex,x,y,s


basehex = {
    hexType:"Water"
};

basehex.string = function(){
    res = this.hexType + " ";
    switch(this.hexType){
        case "Water" , "Land": return res;
    }
    if (this.constituency ) {
        res += this.constituency;
    }
    return res
}

baseboard = {};

baseboard.getColor = function(hex){
    switch (hex.hexType){
        case "Water" : return "aqua";
        case "Land" : return "brown";
    }
    if (hex.constituency) {
        let a = this.country[hex.constituency];
        if (a) {
            console.log("a = ",a);
            return a.Color;
        }
        console.log("no value for" ,hex);
    }

    console.log("Black for" ,hex);

    return "black";
    
}

baseboard.drawHex = function(ctx,hex,x,y,s){ 
    ctx.fillStyle = this.getColor(hex);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    //ctx.fillRect(x,y,s,s);
    ctx.moveTo(x+s*0.1,y);
    ctx.lineTo(x+s*0.9,y);
    ctx.lineTo(x+s*1.1,y+s/2); 
    ctx.lineTo(x+s*0.9,y+s);
    ctx.lineTo(x+s*0.1,y+s);
    ctx.lineTo(x-s*0.1,y + s/2);
    ctx.lineTo(x+s*0.1,y);
    ctx.fill();
    ctx.stroke();


    switch( hex.hexType){
        case "City": 
            ctx.fillStyle= "black";
            ctx.fillRect(x+s/4,y+s/4,s/2,s/2);
            break;
        case "L-Town":
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(x + s/2,y+s/2,s/4,0,2*Math.PI);
            ctx.fill();
            break;
        case "S-Town":
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.arc(x + s/2,y+s/2,s/4,0,2*Math.PI);
            ctx.stroke();
    }
    
}

baseboard.nToXy = function(n){
    return {
        x : n % this.w ,
        y : Math.floor(n / this.w)
    }
}

baseboard.xyToN = function(x,y){
    if (y === undefined ){
        return x.x + x.y * this.w;
    }
    return x + y * this.w;
}


baseboard.draw = function(ctx,w,h){ 
    console.log("Drawing : ",w,h);
    s = Math.min(w/( this.w + 0.2), (h)/(this.h+0.5));
    console.log("S:" ,s, this.map.length)
    for (p in this.map) {
        xy = this.nToXy(p); 
        yp = xy.x %2 === 0 ? 0 : s/2;
        this.drawHex(ctx,this.map[p],s*xy.x,yp + s*xy.y,s); 
    }
}

baseboard.mposToXy = function(mx,my,w,h){
    s = Math.min(w/( this.w + 0.2), (h)/(this.h+0.5));
    
    hexx = Math.floor(mx / s)

    if (hexx > this.w) return undefined;
    
    yp = hexx %2 === 0 ? 0 : s/2;

    hexy = Math.floor( (my - yp) / s)

    if (hexy > this.h )return undefined;
    return {
        x:hexx,
        y:hexy
    }
}


//w and h cannot be zero
function Board(w,h,country,map){
    res = Object.create(baseboard);
    res.w = w;
    res.h = h;
    res.country = country;
    res.map = [];
    fsize = w*h;

    for (var i = 0; i < fsize; i++ ){
            res.map[i] = Object.create(basehex);
    }
    if (map !== undefined) {
        for (p in res.map ){
            Object.assign(res.map[p],ob.map[p]);
        }
    }

    return res;
}


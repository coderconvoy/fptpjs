//conventions:
//Param order ctx,Hex,x,y,s


basehex = {
    hexType:"Water"
};

basehex.inBoard = function(){
    return (this.hexType !== "Water") && (this.hexType !== "Land")
}

basehex.string = function(){
    res = this.hexType + " ";
    if (! this.inBoard()) return res;

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
            return a.Color;
        }
        console.log("no value for" ,hex);
    }

    console.log("Black for" ,hex);

    return "black";
}

baseboard.hexPath = function(ctx,x,y,s){
    ctx.beginPath();
    ctx.moveTo(x+s*0.1,y);
    ctx.lineTo(x+s*0.9,y);
    ctx.lineTo(x+s*1.1,y+s/2); 
    ctx.lineTo(x+s*0.9,y+s);
    ctx.lineTo(x+s*0.1,y+s);
    ctx.lineTo(x-s*0.1,y + s/2);
    ctx.lineTo(x+s*0.1,y);
}

baseboard.hexEdge = function(ctx,x,y,s,angle){
    switch(angle){
    case 0:
        ctx.moveTo(x+s*0.1,y);
        ctx.lineTo(x+s*0.9,y);
        return
    case 1:
        ctx.moveTo(x+s*0.9,y);
        ctx.lineTo(x+s*1.1,y+s/2); 
        return
    case 2:
        ctx.moveTo(x+s*1.1,y+s/2); 
        ctx.lineTo(x+s*0.9,y+s);
        return
    case 3:
        ctx.moveTo(x+s*0.9,y+s);
        ctx.lineTo(x+s*0.1,y+s);
        return
    case 4:
        ctx.moveTo(x+s*0.1,y+s);
        ctx.lineTo(x-s*0.1,y + s/2);
        return
    case 5:
        ctx.moveTo(x-s*0.1,y + s/2);
        ctx.lineTo(x+s*0.1,y);
        return
    }
}

baseboard.strokeHex = function(ctx,hex,x,y,s){
    switch (hex.hexType) {
        case "Water": case "Land": 
            return
        default: 
            this.hexPath(ctx,x,y,s);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.stroke();
    }
}

baseboard.fillHex = function(ctx,hex,x,y,s){
    this.hexPath(ctx,x,y,s);
    ctx.fillStyle = this.getColor(hex);
    ctx.fill();

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

baseboard.setBorders = function() {
    //special edges
    for (p in this.map){
        let mp = this.map[p];
        if (! mp.inBoard()) continue

        let adj = this.adjacent(p,true);
        for (let a = 0; a < adj.length; a++) {
            if (adj[a] === undefined) continue;
            let ma = this.map[adj[a]];
            if (! ma.inBoard()) continue

            if (this.country[ma.constituency].Country === this.country[mp.constituency].Country ) continue
            if (mp.border == undefined) mp.border = [];
            mp.border.push(a);
            
        }

    }
}

baseboard.draw = function(ctx,w,h){ 
    console.log("Drawing : ",w,h);
    s = Math.min(w/( this.w + 0.2), (h)/(this.h+0.5));
    console.log("S:" ,s, this.map.length)
    //fill
    for (p in this.map) {
        let xy = this.nToXy(p); 
        let yp = (xy.x %2) * s/2 ;
        this.fillHex(ctx,this.map[p],s*xy.x,yp + s*xy.y,s); 
    }
    //normal edges
    for (p in this.map) {
        let xy = this.nToXy(p); 
        let yp = (xy.x %2) * s/2 ;
        this.strokeHex(ctx,this.map[p],s*xy.x,yp + s*xy.y,s); 
    }
    //special edges

    for (p in this.map) {
        mp = this.map[p];
        if (mp.border === undefined) continue;
        let xy = this.nToXy(p); 
        let yp = (xy.x %2) * s/2 ;
        ctx.strokeStyle="red";
        ctx.lineWidth = 4;
        ctx.beginPath();
        for ( a in mp.border) {
            this.hexEdge(ctx,s*xy.x,yp + s*xy.y,s,mp.border[a]);
        }
        ctx.stroke();
        
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


//returns an xy, or 'undefined' for steps off the board
baseboard.stepXy = function(xy,angle) { 
    let res = {x:xy.x,y:xy.y};
    let up = res.x %2 ===0 ? 1 : 0;
    switch(angle){
    case 0:
        res.y = res.y -1;
        break;
    case 1:
        res.x = res.x + 1;
        res.y = res.y - up;
        break;
    case 2:
        res.x = res.x + 1;
        res.y = res.y + 1 - up;
        break;
    case 3: 
        res.y += 1;
        break;
    case 4:
        res.x -= 1;
        res.y += 1 - up;
        break;
    case 5:
        res.x -= 1;
        res.y -= up;
    }
    if (( res.x < 0) || (res.y <0) || (res.x >= this.w) ||(res.y >= this.h) ) return undefined;
    return res

}

//returns an [] of ints for simple locations
//allowU, allow Undefined in answer
baseboard.adjacent = function(n,allowU){
    let xy = this.nToXy(n)
    res = [];
    for (let i = 0; i < 6; i++ ){
        let r = this.stepXy(xy,i);
        if (r === undefined){
            if (allowU ) res.push(undefined);
            continue;
        }
        res.push(this.xyToN(r)); 
    }
    return res;
}


//Returns if a hex can connect to it's city, without the noUse hex
baseboard.cityConnect = function(n,noUse){
    let members = [n];
    let i = 0;
    while(true){
        let mi = members[i];
        let mpi = this.map[mi];
        if (mpi.hexType === "City") return true;
        let adj = this.adjacent(mi);
        for (let a = 0; a < adj.length; a++) {
            let ma = adj[a]
            let mpa = this.map[ma]
            if (ma === noUse) continue;
            if (!mpa.inBoard()) continue
            if (mpa.constituency !== mpi.constituency) continue;
            if ( members.indexOf(ma) !== -1) continue;
            console.log("ma",ma);
            members.push(ma);
        }
        i ++;
        if (i >= members.length) return false;
    }
}


baseboard.tryGerrymander = function(n,constit){
    let chex = this.map[n];
    console.log("try gerry",n, constit);
    if (chex.constituency == constit) return false;
    console.log("tg - is change");
    
    if (chex.hexType != "Rural") return false;
    console.log("tg - is rural");
    adj = this.adjacent(n);
    conFound = false;
    for (let a in adj){
        if (this.map[adj[a]].constituency == constit){
            conFound = true;
            break;
        }
    }
    if (! conFound){
        return false;
    }
    console.log("tg - is connected to new constit");
    // todo check no break in constituency

    this.map[n].constituency = constit;
    return true;
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
            Object.assign(res.map[p],map[p]);
        }
    }


    return res;
}


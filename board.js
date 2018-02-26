//conventions:
//Param order ctx,Hex,x,y,s


//odd util function for handling undefined
function inc(ar,loc,n){
    if (n === undefined) n = 1;
    if (ar[loc] === undefined){
        ar[loc] = n;
        return n;
    }
    ar[loc] += n;
    return ar[loc];
}

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
        let a = this.constits[hex.constituency];
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
            if (hex.cityWinner !== undefined) ctx.fillStyle = hex.cityWinner.pcol;
            ctx.strokeStyle = "black";
            ctx.fillRect(x+s/4,y+s/4,s/2,s/2);
            ctx.strokeRect(x+s/4,y+s/4,s/2,s/2);
            break;
        case "L-Town":
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(x + s/2,y+s/2,s/4,0,2*Math.PI);
            ctx.fill();
            break;
        case "S-Town":
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x + s/2,y+s/2,s/4,0,2*Math.PI);
            ctx.stroke();
    }

    if (hex.owner) {
        ctx.fillStyle = hex.owner.pcol;
        ctx.lineStyle = "black";
        ctx.beginPath();
        ctx.arc(x +s*3/4,y + s/4,s/6,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();

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


baseboard.countryOf = function(npos){ 
    let h = this.hmap[npos].constituency; 
    if (this.constits[h] ) return this.constits[h].Country;
    return undefined;

}


baseboard.draw = function(ctx,w,h){ 
    console.log("Drawing : ",w,h);
    s = Math.min(w/( this.w + 0.2), (h)/(this.h+0.5));
    console.log("S:" ,s, this.hmap.length)
    //fill
    for (p in this.hmap) {
        let xy = this.nToXy(p); 
        let yp = (xy.x %2) * s/2 ;
        this.fillHex(ctx,this.hmap[p],s*xy.x,yp + s*xy.y,s); 
    }
    //normal edges
    for (p in this.hmap) {
        let xy = this.nToXy(p); 
        let yp = (xy.x %2) * s/2 ;
        this.strokeHex(ctx,this.hmap[p],s*xy.x,yp + s*xy.y,s); 
    }
    //special edges and owners

    for (p in this.hmap) {

        mp = this.hmap[p];
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

    //Battle Bus
    if (this.battlebus !== undefined){
        xy = this.nToXy(this.battlebus);
        let yp = (xy.x %2) * s/2 ;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "red";
        ctx.lineWidth = w /300;
        ctx.fillRect(s*xy.x,yp + s*xy.y,s/2,s/2);
        ctx.strokeRect(s*xy.x,yp + s*xy.y,s/2,s/2);
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


baseboard.randomBattle = function(){
    console.log("Random Battle");
    let open = [];
    for (let i = 0; i < this.hmap.length; i++){
        if (this.hmap[i].owner !== undefined) continue;
        if (! this.hmap[i].inBoard()) continue;
        open.push(i);
    }
    
    if (open.length === 0) return undefined;

    this.battlebus = open[Math.floor(Math.random()*open.length)];
    return this.battlebus;

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
    console.log("City Connect", n,noUse);
    let members = [n];
    let i = 0;
    while(true){
        let mi = members[i];
        let mpi = this.hmap[mi];
        if (mpi.hexType === "City") return true;
        let adj = this.adjacent(mi);
        for (let a = 0; a < adj.length; a++) {
            let ma = adj[a]
            let mpa = this.hmap[ma]
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
    //todo add check on two constits of same colour touching
    let chex = this.hmap[n];
    if (chex.constituency == constit) return false;
    
    if (chex.hexType != "Rural") return false;
    adj = this.adjacent(n);
    conFound = false;
    for (let a in adj){
        if (this.hmap[adj[a]].constituency == constit){
            conFound = true;
            break;
        }
    }
    if (! conFound){
        return false;
    }
    
    // check same country
    if (this.constits[chex.constituency].Country !== this.constits[constit].Country) return false;

    // check no break in constituency

    for (let a = 0; a < adj.length; a++ ) {
        console.log("checkbreak a = ",a)
        let ma = adj[a];
        let mpa = this.hmap[ma];
        if (!mpa.inBoard()) continue;
        //if (mpa.constituency !== chex.constituency)continue
        if (this.cityConnect(ma,n)) continue
        return false
    }


    this.hmap[n].constituency = constit;
    return true;
}

baseboard.setBorders = function() {
    //special edges
    for (let p in this.hmap){
        //console.log("setBorder - ",p);
        let mp = this.hmap[p];
        if (! mp.inBoard()) continue

        let adj = this.adjacent(p,true);
        for (let a = 0; a < adj.length; a++) {
            if (adj[a] === undefined) continue;
            let ma = this.hmap[adj[a]];
            if (! ma.inBoard()) continue

            if (this.constits[ma.constituency].Country === this.constits[mp.constituency].Country ) continue
            if (mp.border == undefined) mp.border = [];
            mp.border.push(a);
        }
    }
}


baseboard.calculate = function(){
    //firt build the constituency holders
    let hmap = this.hmap; //for closures
    let players = [];
    let cscores = {};
    for (let i = 0; i < this.hmap.length ;i++){
        let h = this.hmap[i];
        if (! h.inBoard) continue;
        if ( cscores[h.constituency] === undefined) 
            cscores[h.constituency] = {c:[]};
        let cconst = cscores[h.constituency];
        if (h.hexType === "City") cconst.CityAddress = i;
        if ( h.owner === undefined) continue;
        let pnum = h.owner.pnum;
        players[pnum] = h.owner;
        inc(cconst.c,pnum);
        console.log("calc:",h.constituency, cconst.c);
        if (h.hexType === "City") {
            cconst.City = pnum;
            console.log("City Addresser",cconst);
        }
        if (h.hexType === "L-Town") cconst.LTown = pnum;
        if (h.hexType === "S-Town") cconst.STown = pnum;
    }

    //Then Calculate winner for each constit
    let res = [];  
    for (let i in cscores) {
        let ci = cscores[i];
        console.log("in cscores : ",i, ":", ci);
        let best = -1;
        let hasbest = [];
        
        for (let j = 0; j < ci.c.length; j++){
            if (ci.c[j] === best) hasbest.push(j);
            if (ci.c[j] > best) {
                best = ci.c[j];
                hasbest = [j]; 
            }
        }
        console.log("hasbest:" ,i,hasbest);

        let winnerIs = function(n){
            console.log("winnerIs:" ,i, n);
            inc(res,n);
            if (ci.CityAddress === undefined) return;
            let ch = hmap[ci.CityAddress]
            ch.cityWinner = players[n];
        }

        // Only one winner.
        if (hasbest.length === 1) {
            winnerIs(hasbest[0]);
            continue;
        }
        
        //shared so look for city.
        
        if ((ci.City!== undefined) && hasbest.indexOf(ci.City) !== -1) {
            console.log("City - winner: ", i,":",ci.City);
            winnerIs(ci.City);
            continue;
        }
        //No city- look for L-Town
        if ((ci.LTown!== undefined) && hasbest.indexOf(ci.LTown) !== -1){
            winnerIs(ci.LTown);
            continue;
        }
        //Finally Try S-Town
        if ((ci.STown !== undefined) && hasbest.indexOf(ci.STown) !== -1){
            winnerIs(ci.STown);
            continue;
        }
        winnerIs(undefined);
        
    }
    return res;

}




//w and h cannot be zero
function Board(w,h,constits,map){
    let res = Object.create(baseboard);
    res.w = w;
    res.h = h;
    res.constits = constits;
    res.battlebus = undefined;

    res.hmap = [];
    fsize = w*h;

    for (var i = 0; i < fsize; i++ ){
            res.hmap[i] = Object.create(basehex);
    }

    if (map !== undefined) {
        for (p in res.hmap ){
            Object.assign(res.hmap[p],map[p]);
        }
    }

    res.setBorders();
    return res;
}




baseplayer = {};

baseplayer.draw = function(ctx,w,h){
    console.log("drawing player")
    ctx.fillStyle = this.pcol;
    ctx.fillRect(0,0,w,h);
    ctx.font = `${w/15}pt Arial`;
    ctx.textAlign = "center";

    let cw = w/7;
    let ch = Math.min(h/2,w/3)
    ctx.lineWidth = cw/8;

    if (this.turn) {
        ctx.fillStyle = "White";
        ctx.strokeStyle = "Black";
        ctx.fillRect(0,0,w/3,h/4);
        ctx.strokeRect(0,0,w/3,h/4);
        ctx.fillStyle = "black";
        ctx.fillText("TURN",w/6,h/5);
    }
    
    //draw (display)cards 
    for (let i = 0; i < this.hand.length; i++ ){
        ctx.fillStyle = "white";
        if (this.chosen === i) {
            ctx.fillStyle = "grey";
        }

        ctx.strokeStyle = "black";
        ctx.fillRect(i*cw,h/2,cw,ch);
        ctx.strokeRect(i*cw,h/2,cw,ch);
        if (this.human || this.chosen === i) {
            ctx.fillStyle = "black";
            ctx.fillText(this.hand[i],i*cw + cw/2,h/2+ch/2);
        }
    }

    //show Score
    
    ctx.font = `${w/10}pt Arial`;
    ctx.fillStyle = "white";
    ctx.fillText (this.score || 0, w*3/4, h/3);
}


baseplayer.drawBudgetTo = function(n){
    console.log("Player :", this.pnum , "Draw budget to ",n);
    let ndraw = n - this.hand.length;
    if (ndraw < 0) return;
    this.hand.push(...this.bdeck.draw(ndraw)); 
    
    
    
}

baseplayer.discardBudget = function(n){
    if (n === undefined) n = this.chosen;
    if (n === undefined) return;
    c = this.hand.splice(n,1)[0];
    this.bdeck.discard(c);
    this.chosen = undefined;
    return c;
}


baseplayer.chooseBudget = function(n){
    this.chosen = n;
    if (n === undefined) 
    this.chosen = Math.floor(Math.random() * this.hand.length);
    return this.chosen;
}


baseplayer.mouseSelectBudget = function(x,y,w,h){
    let cw = w/7;
    let ch = Math.min(h/2,w/3);
    if (x < 0) return undefined;
    if (y < h/2) return undefined;
    if (x >= cw * this.hand.length) return undefined;
    if (y >= h/2 + ch) return undefined;
    this.chosen= Math.floor(x/cw);
    return this.chosen;
}





let player_colors = ["red","blue","green","yellow","white","purple"];


function Players(n,bud_deck){
    let res = [];
    for (i = 0 ; i < n; i++ ){
        res.push(Player(i,player_colors[i],n,bud_deck))
    }

    res.turn = function(){
        for (i = 0 ; i < res.length; i++){
            if (res[i].turn){
                return i;
            }
        }
        return 0;
    }
    res.endTurn = function(){
        let t = -1;
        for (i = 0 ; i < res.length; i++) {
            if (res[i].turn) {
                res[i].turn = false;
                t = i;
            }
        }
        t = (t +1)% res.length;
        res[t].turn = true;
        res[t].drawBudgetTo(res.length + 2);
        return t;
    }
    res[0].turn = true;

    return res;
}

function Player(n, col,nplayers,bud_deck){
    let res = Object.create(baseplayer);
    res.pnum = n; 
    res.pcol = col;
    res.bdeck = bud_deck;
    res.hand = bud_deck.draw(nplayers + 2);

    return res;        
}



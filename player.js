

baseplayer = {};

baseplayer.draw = function(ctx,w,h){
    console.log("drawing player")
    ctx.fillStyle = this.pcol;
    ctx.fillRect(0,0,w,h);
}





let player_colors = ["red","blue","green","yellow","white","purple"];


function Players(n,bud_deck){
    let res = [];
    for (i = 0 ; i < n; i++ ){
        res.push(Player(i,player_colors[i],n,bud_deck))
    }
    console.log("Players res = ",res)
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



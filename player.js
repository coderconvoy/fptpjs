

baseplayer = {};


let player_colors = ["red","blue","green","yellow","white","purple"];


function Players(n,bud_deck){
    res = [];
    for (i = 0 ; i < n; i++ ){
        res.push(Player(i,player_colors[i],n,bud_deck))
    }
    return res;
}

function Player(n, col,nplayers,bud_deck){
    res = Object.create(baseplayer);
    res.pnum = n; 
    res.pcol = col;
    res.bdeck = bud_deck;
    res.hand = bud_deck.draw(nplayers + 2);

    return res;        
}


basedeck = {}

function shuffle(ar){
    console.log("shuffling");
    for (let i = 0; i < ar.length; i++){
        let r = Math.floor(Math.random() *ar.length);
        console.log("shuff -r : ", r)
        let sw = ar[i];
        ar[i] = ar[r];
        ar[r] = sw;
    }
    console.log(ar);
}

basedeck.draw = function(n){
    res = [];
    if (n > this.cards.length){
        shuffle(this.discards);
        ar.push(...this.discards);
        this.discards = [];
    }
    return ar.splice(0,n); 
}

basedeck.discard = function(...cards){
    this.discards.push(...cards)
}


function NumDeck(low,high){
    ar = [];
    for (let i = low; i <= high;i++){
        ar.push(i);
    }
    return Deck(ar);
}

function Deck(cards){
    res = Object.create(basedeck);
    res.cards = cards;
    res.discards = [];
    return res
}

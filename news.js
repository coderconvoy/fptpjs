//dep deck.js

basenews = {}

//TODO add methods for Newscards here





function NewsDeck(jsoncards) {
    let clist = [];
    for ( let i = 0; i < jsoncards.length; i++) {
        ncard = Object.create(basenews);
        Object.assign(ncard, jsoncards[i]);
        clist.push(ncard)
    }
    return  Deck(clist);
}






//The purpose of this section is to create a responsive layout system, with a slightly simpler process than the one for enchanted convoy.
//Any system must have two methods:
//draw(ctx,w,h) which draws internally, using transform, for movement. 
//getxy(w,h,mx,my) which returns an {c,x,y,w,h} child, local x and y, object w and h 
//for the drawable or undefined, if no child exists
//usually they also have an add method

baselayout = {children:[]} // All layouts gain these methods

baselayout.fillbg = function(ctx,bg,w,h){
    if (bg === undefined) return;
    ctx.fillStyle = bg;
    ctx.fillRect(0,0,w,h);
}

baselayout.getn = function(n){
    if (this.children.length < n ){
        return undefined
    }
    return this.children[n].c;
}


baseratioswapper = Object.create(baselayout);

baseratioswapper.draw = function(ctx,w,h){
    if (h == 0) return
    if (w / h > this.rat) {
        this.a.draw(ctx,w,h);
        return
    }
    this.b.draw(ctx,w,h);
}
        
baseratioswapper.getxy =  function(w,h,mx,my){
    if (h == 0) return
    if (w / h > this.rat) {
        return this.a.getxy(w,h,mx,my);
    }
    return this.b.getxy(w,h,mx,my);
}

function RatioSwapperLayout(a,b,ratio){
    res = Object.create(baseratioswapper);
    res.a = a;
    res.b = b;
    res.rat = ratio;
    return res;
}





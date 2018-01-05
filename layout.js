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



baserow = Object.create(baselayout); // simple row with width as relative proportion

baserow.add = function(ob, width){
    this.children.push({c:ob,w:width});  
}

baserow.draw = function(ctx,w,h){
    //count total width
    let tw = 0;
    for (let i in this.children){
        tw += this.children[i].w;
    }
    if (tw === 0){
        this.fillbg(ctx,bg,w,h);
        return
    }
    ctx.save()
    for (let i in this.children){
        let ch = this.children[i]
        let cw = (ch.w * w) / tw;
        ch.c.draw(ctx,cw,h);
        ctx.translate(cw,0)
    }
    ctx.restore();
}

baserow.getxy = function(w,h,mx,my){
    //count total width
    let tw = 0;
    for (let i in this.children){
        tw += this.children[i].w;
    }
    if (tw == 0)return undefined;

    
    let dist = 0;
    for (let i in this.children){
        let ch = this.children[i];
        let aw = ch.w * w / tw;
        if (mx-dist < aw ) {
            if (ch.c.digxy !== undefined)
                return ch.c.digxy(aw,h,mx-dist,my);

            return {c:ch.c,x:mx-dist,y:my,w:aw,h:h}
            
        }
        dist += aw;
    }

    return undefined

}



function RowLayout(bg){
    res = Object.create(baserow);
    res.bg != bg;
    res.children = [];
    return res;
}

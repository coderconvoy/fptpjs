//dep layout/layout.js

baserow = Object.create(baselayout); // simple row with width as relative proportion

baserow.add = function(ob, width){
    this.children.push({c:ob,frac:width});  
}

baserow.draw = function(ctx,w,h){
    //count total width
    let tw = 0;
    for (let i in this.children){
        tw += this.children[i].frac;
    }
    if (tw === 0){
        this.fillbg(ctx,this.bg,w,h);
        return
    }
    ctx.save()
    for (let i in this.children){
        let child = this.children[i];
        let cw = (child.frac * w) / tw;
        child.c.draw(ctx,cw,h);
        ctx.translate(cw,0)
    }
    ctx.restore();
}

baserow.getxy = function(w,h,mx,my){
    //count total width
    let tw = 0;
    for (let i in this.children){
        tw += this.children[i].frac;
    }
    if (tw == 0)return undefined;

    
    let dist = 0;
    for (let i in this.children){
        let child = this.children[i];
        let aw = child.frac * w / tw;
        if (mx-dist < aw ) {
            if (child.c.digxy !== undefined)
                return child.c.digxy(aw,h,mx-dist,my);

            return {c:child.c,x:mx-dist,y:my,w:aw,h:h}
            
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

basecol = Object.create(baselayout); // simple row with width as relative proportion

basecol.add = function(ob, width){
    this.children.push({c:ob,frac:width});  
}

basecol.draw = function(ctx,w,h){
    //count total width
    let tw = 0;
    for (let i in this.children){
        tw += this.children[i].frac;
    }
    if (tw === 0){
        this.fillbg(ctx,this.bg,w,h);
        return
    }
    ctx.save()
    for (let i in this.children){
        let child = this.children[i];
        let ch = (child.frac * h) / tw;
        child.c.draw(ctx,w,ch);
        ctx.translate(0,ch);
    }
    ctx.restore();
}

basecol.getxy = function(w,h,mx,my){
    //count total width
    let tw = 0;
    for (let i in this.children){
        tw += this.children[i].frac;
    }
    if (tw == 0)return undefined;

    
    let dist = 0;
    for (let i in this.children){
        let child = this.children[i];
        let ah = child.frac * h / tw;
        if (my-dist < ah ) {
            if (child.c.digxy !== undefined)
                return child.c.digxy(w,ah,mx,my-dist);

            return {c:child.c,x:mx,y:my-dist,w:w,h:ah}
            
        }
        dist += ah;
    }

    return undefined

}

function ColLayout(bg){
    let res = Object.create(basecol);
    res.bg != bg;
    res.children = [];
    return res;
}


function RowColLayout(bg,ratio){
    let a = RowLayout(bg);
    let b = ColLayout(bg);
    let res = RatioSwapperLayout(a,b,ratio);
    res.add = function(ob,fraca,fracb){
        a.add(ob,fraca);
        if (fracb === undefined) fracb = fraca;
        b.add(ob,fracb);
    }
    return res;
}

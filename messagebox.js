basemessagebox = {};

basemessagebox.draw = function(ctx,w,h){
    let fs = w/20;
    ctx.font = `${w/20}pt Arial` ;
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.strokeWidth = w/40;
    ctx.strokeText(this.title, w/2, h/5);
    ctx.fillText(this.title,w/2,h/5);

    ctx.font = `${w/30}pt Arial`;
    ctx.strokeText(this.message,w/2, h* 2/5);
    ctx.fillText(this.message,w/2, h* 2/5);
}

MessageBox = function(title,message){
    let res = Object.create(basemessagebox);
    res.title = title;
    res.message = message;
    return res;
}



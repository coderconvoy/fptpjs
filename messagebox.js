basemessagebox = {};

basemessagebox.draw = function(ctx,w,h){
    //draw back
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0,0,w,h);


    //draw Title
    let fs = w/20;
    ctx.font = `${w/20}pt Arial` ;
    ctx.textAlign = "center";
    ctx.fillStyle = this.tfill;
    ctx.strokeStyle = "black";
    ctx.strokeWidth = w/40;
    ctx.strokeText(this.title, w/2, h/5);
    ctx.fillText(this.title,w/2,h/5);

    //draw message
    ctx.font = `${w/30}pt Arial`;
    ctx.fillStyle = this.mfill;
    ctx.strokeText(this.message,w/2, h* 2/5);
    ctx.fillText(this.message,w/2, h* 2/5);
}

MessageBox = function(title,message,tfill,mfill){
    let res = Object.create(basemessagebox);
    res.title = title;
    res.message = message;
    res.tfill = tfill || "white";
    res.mfill = mfill ||"white";
    return res;
}



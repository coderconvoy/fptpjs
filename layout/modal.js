//dep layout/layout.js

basemodal = Object.create(baselayout);


basemodal.setModal = function(m){
    this.modal = m; 
    let par = this;
    m.stopModal = function(){
        par.unsetModal();
    }
}

basemodal.unsetModal = function(){
    this.modal = undefined;
}


basemodal.draw = function(ctx,w,h){
    this.child.draw(ctx,w,h);
    if (this.modal) this.modal.draw(ctx,w,h);
}

basemodal.getxy =  function(w,h,mx,my){
    if (this.modal){
        if (this.model.getxy)
            return this.model.getxy(w,h,mx,my);
        return {child:this.modal,x:mx,y:my,w:w,h:h};
    }
    if ( this.child.getxy)
        return this.child.getxy(w,h,mx,my);
    return {child:this.child,x:mx,y:my,w:w,h:h};
}


function ModalLayout(layout){
    res = Object.create(basemodal);
    res.child = layout;
    return res;
}



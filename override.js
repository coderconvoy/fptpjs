
overrider = {}

overrider.ride = function(ob,prop,f){ 
    orig = ob[prop]
    if (! orig ){
        ob[prop] = f; 
        return;
    }
    ob[prop] = function(...args){
        orig(...args);
        f(...args);
    }
}


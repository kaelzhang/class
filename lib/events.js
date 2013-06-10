/**
 * Preset of Class Extensions: 'events'
 */
var lang = require("neuro-lang");

// @param {this} self
// @return {Array.<function()>}
function getStorage(host, type){
    var ATTR_EVENTS = '__ev',
        storage;
        
    storage = host[ATTR_EVENTS] || (host[ATTR_EVENTS] = {});
    
    return storage[type] || (storage[type] = []);
};

// @return {this}
function addOrRemoveEvent(host, type, fn, toAdd){
    var storage = getStorage(host, type),
        i = 0,
        len = storage.lenth;
        
    if(toAdd){
        // add an event
        if(lang.isFunction(fn)){
            storage.push(fn);
        }
        
    }else{
        // remove an event
        if(lang.isFunction(fn)){
            for(; i < len; i ++){
                if(storage[i] === fn){
                    storage.splice(i, 1);
                }
            }
            
        // remove all events
        }else if(!fn){
            storage.length = 0;
        }
    }
    
    return host;
};


module.exports = {
    on: lang.overloadSetter(function(type, fn){
        return addOrRemoveEvent(this, type, fn, true);
    }),
    
    off: function(type, fn){
        return addOrRemoveEvent(this, type, fn);
    },
    
    fire: function(type, args){
        var self = this;
        
        args = lang.makeArray(args);
        
        getStorage(self, type).forEach(function(fn){
            fn.apply(self, args);
        });
        
        return self;
    }
};

'use strict';

var attrs       = exports;
var clone       = require('clone');
var _           = require('underscore');

var GETTER      = 'getter';
var SETTER      = 'setter';
var VALIDATOR   = 'validator';
var READ_ONLY   = 'readOnly';

function NOOP (){};

/**
 * setter for class attributes
 * @private
 * @param {boolean} ghost inner use
    if true, setValue will ignore all flags or validators and force to writing the new value
    
 * @return {boolean} whether the new value has been successfully set
 */
function setValue(host, attr, value){
    var pass = true,
        setter,
        validator,
        v;

    if(attr[READ_ONLY]){
        pass = false;
        
    }else{
        validator = getMethod(host, attr, VALIDATOR);
        
        pass = !validator || validator.call(host, value);
    }
    
    if(pass){
        setter = getMethod(host, attr, SETTER);
        
        if(setter){
            // if setter is defined, always set the return value of setter to attr.value
            attr.value = setter.call(host, value);
        }else{
        
            // mix object values
            _.isObject(value) && _.isObject(v = attr.value) ? _.extend(v, value) : (attr.value = value);
        }
    }
    
    return pass;
};


/**
 * getter for class attributes
 */
function getValue(host, attr, undef){
    var getter = getMethod(host, attr, GETTER),
        v = attr.value;
    
    return getter ?
    
          // getter could based on the value of the current value
          getter.call(host, v)
        : v;
};


function getMethod(host, attr, name){
    var method = attr[name];
    
    return typeof method === 'string' ? host[method] : method;
};


/**
 * @private
 * @param {Object} host
 * @param {Object} sandbox shadow copy of the attributes of a class instance
 * @param {undefined=} undef
 */
function createGetterSetter(host, sandbox, undef){
    function set (key, value) {
        var attr = sandbox[key];
        
        return attr ? setValue(this, attr, value) : false;
    }

    host.set = function (key, value) {
        if ( _.isObject(key) ) {
            var k;
            var ok = true;

            for (k in key){
                // if the last one fails, do not skip setting
                ok = set.call(this, k, key[k]) && ok;
            }

            return ok;

        } else {
            return set.call(this, key, value);
        }
    };
    
    host.get = function(key){
        var attr = sandbox[key];
        
        return attr ? getValue(this, attr) : undef;
    };
    
    host.addAttr = function(key, setting, override){
        if ( override || !sandbox[key] ) {
            sandbox[key] = _.isObject(setting) ?
                // it's important to clone the setting before mixing into the sandbox,
                // or host.set method will ruin all reference
                clone(setting) :
                {};
        }
    }
};


function createPublicMethod(name){
    return function(){
        var self = this,
            
            // @private
            // sandbox
            sandbox = createSandBox(self);
        
        // .set and .get methods won't be available _ .setAttrs method excuted
        createGetterSetter(self, sandbox);
        
        return self[name].apply(self, arguments);
    };
};


function createSandBox(host){
    var attributes = host._ATTRS;
    
    return attributes ? clone(attributes) : {};
};


var EXT = attrs._EXT = {};

['addAttr', 'get', 'set'].forEach(function(name){
    EXT[name] = createPublicMethod(name);
});


attrs.patch = function (host, attributes) {
    if ( typeof host === 'function' ) {
        host = host.prototype;
    }

    _.extend(host, EXT);

    // mixed by `_.inherits`
    var parent_attrs = host._ATTRS;

    if ( parent_attrs ) {
        _.extend(attributes, parent_attrs, false);
    }

    host._ATTRS = attributes;
};

/**
 2012-02-23  Kael:
 - fix a fatal reference exception for .addAttr method

 2012-01-30  Kael:
 - remove .setAttrs methdo. sandbox will be initialized by the first execution of .set, .get, or .addAttr method

 2011-10-24  Kael:
 - setAttrs method will return this
 - prevent addAttr method from affecting the existing attr object

 2011-10-18  Kael:
 TODO:
 - ? A. optimize setAttrs method, lazily initialize presets after they are called
 
 2011-09-20  Kael:
 - attr setter will return true or false to tell whether the new value has been successfully set

 2011-09-17  Kael:
 - TODO[09-15].A

 2011-09-15  Kael:
 - privatize attributes
 - create .get and .set method
 
 TODO:
 - ? A. ATTRs inheritance

 */

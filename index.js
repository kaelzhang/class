
// Opt in to strict mode of JavaScript, [ref](http://is.gd/3Bg9QR)
// Use this statement, you can stay away from several frequent mistakes 
'use strict';

var _           = require('underscore');
var clone       = require('clone');
var attributes  = require('./lib/attrs');

/**
 * module  oop/class
 * author  Kael Zhang
 
 * unlike mootools
    - NR.Class() will return a pure javascript constructor
    - NR.Class() could inherit from a pure javascript constructor
 */



/**
 relevant javascript reserved words:

 extends
 implements

 */


/**
 Implements: 
     - classes implemented, constructor and destructor will not be inherited
     - implementing A will not make A instantiated

var myClass = NR.Class({
        Implements: [ Interface1, Interface2, 'options' ],
        
        initialize: function(){},
        
        method: function(){}
    }),

    instance = new myClass();
*/


/**
 * @return {Object}
 */
function getPrototype(obj){
    var ret;

    if(obj){
        if(_.isObject(obj)){
            ret = obj;
        }else if(typeof obj === 'string'){
            ret = getPrototype(EXTS[obj.toLowerCase()]);
        
        }else{
            ret = obj.prototype;
        }
    }
    
    return ret;
};


/**
 * @param {Object} host prototype of NR.Class instance
 * @param {Object} alien new prototype methods to be mixed in
 * @param {boolean} override whether new methods/props should override old methods/props
 */
function implementOne(host, alien, override){
    // prototype Object for mixin 
    var proto = getPrototype(alien);
    proto && _.extend(
        host, 
        clone(proto),
        // clone(proto, function(value, key){
        //    return PRIVATE_MEMBERS.indexOf(key) === -1;
        // }),
        
        // methods of an interface have second lowest priority
        override
    );
};


/**
 * implement a class with interfaces
 */
function implement(proto, extensions, override){
    if(typeof extensions === 'string'){
        extensions = extensions.trim().split(/\s+/);
    }

    if ( !_.isArray(extensions) ) {
        extensions = [extensions];
    }

    extensions.forEach(function(alien){
        implementOne(this, alien, override);
    }, proto);
};


/**
 * unlink the reference to the prototype and maintain prototype chain,
 * so that the changes of an instance will not ruin all instance references
 */
function resetPrototypeChain(instance){
    var value, key, type, reset;
    
    for(key in instance){
        value = instance[key];
        
        if(_.isObject(value)){
            var F = function(){};
            F.prototype = value;
            reset = resetPrototypeChain(new F);
        }else{
            reset = clone(value);
        }
        
        instance[key] = reset;
    }
    
    return instance;
};


var INITIALIZE  = 'initialize',
    EXTS        = {};


// @public
// @param {Object} properties
// @param {Object} attrs
function Class(properties, attrs){
    if ( this instanceof Class ) {
        throw new Error('Class should not be used with `new`');
    }

    // -> Class({ key: 123 })
    if(_.isObject(properties)){
        var EXTENDS = 'Extends',
            base = properties[EXTENDS];
        
        delete properties[EXTENDS];
        
        return _Class(base, properties, attrs);
    
    // -> Class(foo)    
    }else{                                     
        var base = _.isFunction(properties) ? properties : function(){};
        setAttrs(base, attrs);
        
        return base;
    }
};


/**
 * no arguments checking!
 * @private
 * @param {function()|Class}
 * @param {Object} proto must be an object
 * @param {Object} attrs class attributes
 */
function _Class(base, proto, attrs){
    function newClass(){
        var self = this,
            init = initialize;
        
        /**
         * clean and unlink the reference relationship of the first depth between the instance and its prototype
         * and maintain prototype chain
         */
        resetPrototypeChain(self);
    
        if(init){
            return init.apply(self, arguments);
        }
    };
    
    var IMPLEMENTS = 'Implements',
        newProto,
        
        // so, NR.Class could make a new class inherit from a pure javascript constructor
        // inherit constructor from superclass
        initialize = proto[INITIALIZE] || base,
        exts = proto[IMPLEMENTS];
        
    delete proto[INITIALIZE];
    delete proto[IMPLEMENTS];
    
    // apply super prototypes
    if(base){
        
        // discard the parent constructor
        var F = function(){};
        F.prototype = base.prototype;
        newProto = new F;
        
        // priority high to low:
        // user custom prototype > ext > super class prototype
        exts && implement(newProto, exts, true);
        
        // bring correspondence with `util` of node.js
        newClass.super_ = base;
        _.extend(newProto, proto);
        
    }else{
    
        // no super class, directly assign user prototype for performance
        newProto = proto;
        exts && implement(newProto, exts, false);
    }
    
    newClass.prototype = newProto;
    
    // fix constructor
    newProto.constructor = newClass;
    
    // Set class attributes
    attributes.path(newClass, attrs);
    
    return newClass;
};


/**
 * @public members
 * ----------------------------------------------------------------------- */


// @deprecated
// use NR.Class instead
// for backwards compact


Class.EXTS = EXTS;


/**
 change log:

 2013-03-05  Kael:
 - now we can Implements a class
 
 2012-10-17  Kael:
 - to prevent further inheritance problems, attributes will always be initialized during the creation of new class
 
 2012-09-03  Kael:
 - fix a bug that attributes of super class could not be overridden
 
 2012-07-20  Kael:
 - remove API: `NR.Class(base, proto)`;
 - now we could add ATTRS by NR.Class method: `NR.Class(properties, attrs)`;
 
 2012-01-30  Kael:
 - remove Class.destroy
 
 2011-11-16  Kael:
 - remove Class from the host(window)
 
 2011-10-19  Kael:
 - adjust the priority of inheritance chain as: user prototype > ext > super class prototype
 
 2011-09-19  Kael:
 - fix a bug the instance fail to clear the reference off its prototype
 
 2011-09-16  Kael:
 - remove a reserved word for possible future use
 - complete class extends
 
 2011-09-13  Kael:
 - refractor the whole implementation about Class
 
 2011-09-12  Kael:
 TODO:
 - A. add destructor support
 - B. make Class faster if there's no Extends
 - C. no merge, use NR.clone instead
 
 */

module.exports = Class;

Class.EXTS.attrs = attributes._EXT;
Class.EXTS.events = require("./lib/events");


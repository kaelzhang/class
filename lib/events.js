'use strict';

var events      = require('events');
var util        = require('util');
var _           = require('underscore');

_.extend(exports, events.prototype);

// legacy
exports.fire = function (type, args) {
    if ( !util.isArray(args) ) {
        if ( args === undefined || args === null ) {
            args = [];
        } else {
            args = [args];
        }
    }

    args.unshift(type);

    this.emit.apply(this, args);

    return this;
};


exports.off = function (event, listener) {
    switch(arguments.length){
        case 0:
            this.removeAllListeners();
            break;

        case 1:
            event && this.removeAllListeners(event);
            break;

        case 2:
            event && listener && this.removeListener(event, listener);
            break;
    }
    
    return this;
};
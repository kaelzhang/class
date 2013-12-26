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
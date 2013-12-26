'use strict';

var _           = require('underscore');
var events      = require('events');


_.extend(exports, events.prototype);

// legacy
exports.fire = function (type, args) {
    if ( !_.isArray(args) ) {
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
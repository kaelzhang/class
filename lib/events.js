'use strict';

var _           = require('underscore');
var events      = require('events');


_.extend(exports, events.prototype);

exports.fire = function () {
    this.emit.apply(this, arguments);

    return this;
};
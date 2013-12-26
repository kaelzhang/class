'use strict';

var expect = require('chai').expect;

module.exports = function (a) {
    return {
        toBe: function (b) {
            expect(a).to.equal(b);
        }
    }  
};
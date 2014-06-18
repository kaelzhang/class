'use strict';

var _       = require('underscore');
var Class   = require('../index');
var expect  = require('./lib/expect');

describe("events", function(){

describe("Class ext: events", function(){
    var EventClass = Class({
            Implements: 'events',
            a: 1,
            b: 2
        });


    describe(".on(), feated with .emit()", function(){
        it("could register a sync event handler", function(){
            var flag = true;
                
            var obj = new EventClass().on('myEvent', function(){
                flag = !flag
            });
        
            expect(flag).toBe(true);
            
            obj.emit('myEvent');
            expect(flag).toBe(false);
            
            obj.emit('myEvent');
            expect(flag).toBe(true);
        });
        
        
        // it("could deal with function overloading, and register a list of event handlers", function(){
        //     var flag1 = true,
        //         flag2 = true;
                
        //     var obj = new EventClass().on({
        //             event1: function(){
        //                 flag1 = !flag1;
        //             },
                    
        //             event2: function(){
        //                 flag2 = !flag2;
        //             }
        //         });
            
        //     obj.emit('event1');
        //     expect(flag1).toBe(false);
            
        //     obj.emit('event2');
        //     expect(flag2).toBe(false);
        // });
        
        it("the `this` object should be the current instance", function(){
            var obj = new EventClass().on('increase', function(){
                this.a ++;
            });
            
            expect(obj.a).toBe(1);
            
            obj.emit('increase');
            expect(obj.a).toBe(2);
        });
        
        it("could register more than one handlers to a same event type", function(){
            var obj = new EventClass();
            
            obj.on('increase', function(){
                this.a ++;
            });
            
            obj.on('increase', function(){
                this.a ++;
            });
        
            expect(obj.a).toBe(1);
            
            obj.emit('increase');
            expect(obj.a).toBe(3);
        });
        
        it("the execution of handlers should be maintained by registering sequence", function(){
            var obj = new EventClass();
            
            obj.on('increase', function(){
                this.a ++;
            });
            
            obj.on('increase', function(){
                this.c = this.a * this.b;
            });
            
            expect(obj.c).toBe(undefined);
            
            obj.emit('increase');
            expect(obj.c === 2).toBe(false);
            expect(obj.c).toBe(4);
        });
    });

    describe(".removeListener(type, fn), feated with .emit()", function(){
    
        it("should return the instance", function(){
            var handler = function(){},
                obj = new EventClass().on('increase', handler);
        
            expect(obj.removeListener('increase', handler)).toBe(obj);
            expect(obj.removeAllListeners('increase')).toBe(obj);
            expect(obj.removeAllListeners()).toBe(obj);
        });
        
        it("could remove a specific handler of a certain type: .removeListener(type, fn)", function(){
            var flag = 1,
                handler = function(){
                    flag ++;  
                },
                obj = new EventClass().on('increase', handler);
            
            obj.emit('increase');
            expect(flag).toBe(2);
            
            obj.removeListener('increase', handler);
            obj.emit('increase');
            expect(flag).toBe(2);
        });
        
        it("could remove all handlers of a certain type: .removeListener(type)", function(){
            var flag = 1,
                handler = function(){
                    flag ++;  
                },
                handler2 = function(){
                    flag = flag + 2;  
                },
                obj = new EventClass().on('increase', handler).on('increase', handler2);
            
            obj.removeAllListeners('increase');
            obj.emit('increase');
            expect(flag).toBe(1);
        });
        
        it("could remove all registered events: .removeListener()", function(){
            var flag = 1,
                handler = function(){
                    flag ++;  
                },
                handler2 = function(){
                    flag = flag + 2;  
                },
                obj = new EventClass().on('increase1', handler).on('increase2', handler2);
            
            obj.removeAllListeners();
            obj.emit('increase1');
            obj.emit('increase2');
            expect(flag).toBe(1);
        });
    });
    
    
    describe(".emit()", function(){
        
        it("normal fire, which tested before", function(){
            expect().toBe();
        });
    });

    
});
    
});


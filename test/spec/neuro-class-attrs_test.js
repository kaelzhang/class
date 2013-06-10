describe('Neuron: oop/attrs', function(){
    var Class;

    beforeEach(function(done){
        NR.use(["neuro-class@0.1.0"],function(mod) {
            Class = mod;
            done();
        });
    });

    describe('NR.Class ext: attrs', function(){

        it('will unlink the attributes of a instance with the presets', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    }
                }, {
                    a: {
                        value: 1
                    },
                    
                    b: {
                        value: 2,
                        writeOnce: true
                    }
                });
            
            var ins = new myClass({a: 5}),
                ins2;
                
            expect(ins.get('a')).to.equal(5);
            
            ins.set('a', 10);
            ins2 = new myClass();
            
            expect(ins2.get('a')).to.equal(1);
        });

        it('prevent private member from directly accessing', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    }
                }, {
                    a: {
                        value: 1
                    },
                    
                    b: {
                        value: 2,
                        writeOnce: true
                    }
                });
            
            var ins = new myClass();
            
            ins.set('a', 10);
            
            expect(ins.a).to.be.undefined;
        });
        
        it('could specify a setter(direct setter)', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    }
                }, {
                    a: {
                        value: 1,
                        setter: function(n){
                            return n * 10;
                        }
                    }
                });
            
            var my = new myClass();
            
            expect(my.get('a')).to.equal(1);
            expect(my.set('a', 2)).to.be.true;
            expect(my.get('a')).to.equal(20);
        });
        
        
        it('could specify a setter(set a member of the instance)', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    }
                }, {
                    a: {
                        setter: function(n){
                            this.b = n * 10;
                        }
                    }
                });
            
            var my = new myClass();
            
            expect(my.get('a')).to.be.undefined;
            expect(my.b).to.be.undefined;
            expect(my.set('a', 2)).to.be.true;
            expect(my.get('a')).to.be.undefined;
            expect(my.b).to.equal(20);
        });
        
        
        it('could specify a setter(instance method as a setter)', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    },
                    
                    _setA: function(n){
                        this.b = n * 10;
                    }
                }, {
                    a: {
                        setter: '_setA'
                    }
                });
            
            var my = new myClass();
            
            expect(my.get('a')).to.be.undefined;
            expect(my.b).to.be.undefined;
            expect(my.set('a', 2)).to.be.true;
            expect(my.get('a')).to.be.undefined;
            expect(my.b).to.equal(20);
        });
        
        
        it('could specify a getter(direct getter)', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    }
                }, {
                    a: {
                        value: 1,
                        getter: function(v){
                            return v * 100;
                        }
                    }
                });
            
            var my = new myClass();
            
            expect(my.get('a')).to.equal(100);
            expect(my.set('a', 2)).to.be.true;
            expect(my.get('a')).to.equal(200);
        });
        
        
        it('could specify a getter(instance method as a getter)', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    },
                    
                    _getA: function(n){
                        return n * 100
                    }
                }, {
                    a: {
                        value: 1,
                        getter: '_getA'
                    }
                });
            
            var my = new myClass();
            
            expect(my.get('a')).to.equal(100);
            expect(my.set('a', 2)).to.be.true;
            expect(my.get('a')).to.equal(200);
        });
        
        
        it('could specify a validator(direct validator)', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    }
                }, {
                    a: {
                        value: 1,
                        validator: function(n){
                            return n < 100;
                        }
                    }
                });
            
            var my = new myClass();
            
            expect(my.get('a')).to.equal(1);
            expect(my.set('a', 100)).to.be.false;
            expect(my.get('a')).to.equal(1);
            expect(my.set('a', 99)).to.be.true;
            expect(my.get('a')).to.equal(99);
        });
        
        
        it('could specify a validator(instance method as a validator)', function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    },
                    
                    _validateA: function(n){
                        return n < 100;
                    }
                }, {
                    a: {
                        value: 1,
                        validator: '_validateA'
                    }
                });
            
            var my = new myClass();
            
            expect(my.get('a')).to.equal(1);
            expect(my.set('a', 100)).to.be.false;
            expect(my.get('a')).to.equal(1);
            expect(my.set('a', 99)).to.be.true;
            expect(my.get('a')).to.equal(99);
        });
        
        
        it("could get the shadow copy of all attribute values", function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    }
                    
                }, {
                    a: {
                        value: 1
                    },
                    
                    b: {
                        value: 2
                    },
                    
                    c: {
                        value: 3
                    }
                });
                
            var obj = new myClass(),
                attrs = obj.get();
        
            expect(attrs.a).to.equal(1);
            expect(attrs.b).to.equal(2);
            expect(attrs.c).to.equal(3);
            
            attrs.c = 5;
            expect(obj.get('c')).to.equal(3);
        });
        
        
        (function(){
            var myClass = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options);
                    }
                }, {
                    a: {
                        value: 1,
                        readOnly: true
                    },
                    
                    b: {
                        value: 1,
                        writeOnce: true
                    }
                }),
                
                myClass2 = Class({
                    Implements: 'attrs',
                    initialize: function(options){
                        this.set(options, true);
                    }
                }, {
                    a: {
                        value: 1,
                        readOnly: true
                    },
                    
                    b: {
                        value: 1,
                        writeOnce: true
                    }
                });
            
            var my = new myClass({a: 2, b: 2});
            
            // force to initializing
            
            var my2 = new myClass2({a: 2, b: 2});
        
        
            it('controller: readOnly', function(){
                expect(my.get('a')).to.equal(1);
                // expect(my2.get('a')).to.equal(2);
                
                expect(my.set('a', 3)).to.be.false;
                // expect(my2.set('a', 3)).to.be.false;
                
                expect(my.get('a')).to.equal(1);
                // expect(my2.get('a')).to.equal(2);
            });
                
            it('controller: writeOnce', function(){
                expect(my.get('b')).to.equal(2);
                // expect(my2.get('b')).to.equal(2);
                
                expect(my.set('b', 3)).to.be.false;
                // expect(my2.set('b', 3)).to.be.true;
                
                expect(my.get('b')).to.equal(2);
                // expect(my2.get('b')).to.equal(3);
                
                expect(my2.set('b', 4)).to.be.false;
                // expect(my2.get('b')).to.equal(3);
            });
            
        })();
        
        describe("returnValue of .set()", function(){
            var 
            
            myClass = Class({
                Implements: 'attrs'
            }, {
                a: {
                    validator: NR.isNumber
                },
                
                b: {
                    validator: NR.isString
                }
            }),
            
            m = new myClass();
            
        
            it("returns whether the current key has been successfully set", function(){
                expect(m.set('a', 1)).to.be.true;
                expect(m.set('a', '1')).to.be.false;
            });
            
            it("returns true if all values have been successfully set", function(){
                expect(m.set({
                    a: 1,
                    b: '1'
                })).to.be.true;
            });
            
            it("returns false if there's even one value fail to set", function(){
                expect(m.set({
                    a: 1,
                    b: 1
                })).to.be.false;
            });
        });
        
        describe(".addAttr()", function(){
            var myClass = Class({
                    Implements: 'attrs'
                }),
                
                obj = new myClass(),
                
                attr = {
                    a: {
                        value: 1
                    }
                };
            
            obj.addAttr(attr);
            
            it("could add a new attribute", function(){
                expect(obj.get('a')).to.equal(1);
            });
        
            it("would not ruin the reference of attr object", function(){
                obj.set('a', 123)
            
                expect(attr.a.value).to.equal(1);
            });
        });
        
        describe(".removeAttr(key)", function(){
            var myClass = Class({
                    Implements: 'attrs'
                }, {
                    a: {
                        value: 1
                    }
                }),
                
                obj = new myClass();
                
            obj.removeAttr('a');
                
            it("could remove attr by a specified key", function(){
                expect(obj.get('a')).to.be.undefined;
            });
        });
        
        
        describe("attributes inheritance", function(){
            var superClass = Class({}, {
                    a: {
                        value: 1
                    },
                    
                    b: {
                        value: 2
                    },
                    
                    c: {
                        value: 3
                    }
                }),
                
                subClass = Class({
                    Implements: 'attrs',
                    Extends: superClass
                }, {
                    a: {
                        value: 10
                    },
                    
                    d: {
                        value: 4
                    }
                }),
                
                implementClass = Class({
                    Implements: [superClass, 'attrs']
                }, {
                    e: {
                        value: 5
                    }
                });
        
            it("could inherit attributes from super class", function(){
                var sub = new subClass();
            
                expect(sub.get('d')).to.equal(4);
                expect(sub.get('b')).to.equal(2);
                expect(sub.get('c')).to.equal(3);
            });
            
            it("could override attributes of super class", function(){
                var sub = new subClass();
            
                expect(sub.get('a')).to.equal(10);
            });
            
            it("would never inherit attributes from implements", function(){
                var im = new implementClass();
            
                expect(im.get('e')).to.equal(5);
                expect(im.get('a')).to.be.undefined;
            });
        
        });
        
        
        describe("attributes inheritance: special situations", function(){
            var
            
            Parent = NR.Class({
                Implements: 'attrs'   
            }, {
                a: {
                    value: 1
                }
                
            }),
            
            Sub = NR.Class({
                Extends: Parent
            });
        
            it("if sub-class has no attrs, setter and getter should be properly initialized", function(){
                
                var 
                
                ins = new Sub;
            
                expect(ins.get('a')).to.equal(1);
            });
            
            it("if attributes of superclass changes after the declaration of sub-class, sub-class should not be affected", function(){
                Parent.ATTRS.a.value = 2;
                
                var
                
                ins = new Sub;
            
                expect(ins.get('a')).to.equal(1);
            });
        });
    });


});
# class [![Build Status](https://travis-ci.org/kaelzhang/node-checker.png?branch=master)](https://travis-ci.org/kaelzhang/node-checker)

The inheritance implementation of [mootools-like](http://mootools.net/docs/core/Class/Class) class(but slightly different) for JavaScript modules.

## Getting Started
Before anything taking its part, you should install [node](http://nodejs.org) and [cortex](http://cortexjs.org).


## Using class In Your Project

```sh
cortex install class --save
```

## Synopsis

```js
var Class = require('class');
var Person = Class({
	initialize: function(name){
		this.name = name;
	},
	
	study: function(n){
		console.log('study')
	},
	
	selfIntro: function(){
		console.log('My name is ' + this.name);
	}
});

var Female = Class({
	Extends: Person,
	initialize: function(name, gender){
		Person.call(name);
		this.gender = gender;
	}
});

var Lily = new Femail('Lily', 'female');
Lily.selfIntro(); // My name is Lily.
```

## Usage

### Inherits from a superClass

```js
var SuperClass = Class({
	foo: function(){
		console.log('foo')
	}
});

var MyClass = Class({
	Extends: SuperClass
});

var SubClass = Class({
	Extends: MyClass
})


new SubClass().foo(); // foo
```

Extending `SuperClass` will retain the [prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain), even if the current constructor has gone through a series of inheritance.

### Implements utility methods

```js
var MyClass = Class({
    Implements: 'events'
})
```

Use the `Implements` property to mixin a bunch of utility methods. The methods impleme

#### Implements built-in methods

```js
Implements: 'events' // implements events
Implements: 'events attrs' // events and attributes
```

#### Implements from singletons and constructors

```js
Implements: constructor
Implements: constructor.prototype
Implements: singletonObject
```

#### Mixed methods

```js
Implements: [constructor, singleton, 'events']
```

## Built-in utilities

### events

If you `Implements: 'events'`, the constructor will be an [EventEmitter](http://nodejs.org/api/events.html) and will has exactly the same APIs as node's

### attrs

```
var MyClass = Class({
	Implements: 'attrs',
	initialize: function(options){
		this.set(options);
	}
}, {
	foo: {
		value: 1,
		validator: function(v){
			return typeof v === 'number';
		}
	},
	
	bar: {
		getter: function(v){
			return v < 10 ? 10 : v;
		}
	}
});

var obj = new MyClass({
	foo: '3',
	bar: 7
});

obj.get('foo'); // 1, '3' fails against the validator
obj.get('bar'); // 10
obj.set('foo', 100);
obj.get('foo'); // 100
```

After implementing `'attrs'`, the prototype of the constructor will have 4 methods:

- addAttr: add an attribute description
- get: get the value by key
- set: set a key or list of keys
- removeAttr: remove an attribute

More details about `'attrs'`, search package 'attributes' in the cortex registry.


## API Documentation

### factory: Class

Create a new class.

```
var MyClass = Class(definition, attributes);
```

Returns the constructor of the newly created class.


#### definition.Extends

Inherits from a super class.

#### definition.Implements

Mixin utility methods.

#### definition.\<property\>

Define the properties of the prototype.


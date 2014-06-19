(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Utilities.
 */
var arrayPrototype = Array.prototype,
    arrayUnshift = arrayPrototype.unshift,
    arrayPush = arrayPrototype.push,
    arraySlice = arrayPrototype.slice,
    arrayIndexOf = arrayPrototype.indexOf,
    arraySplice = arrayPrototype.splice;

/* istanbul ignore if: User forgot a polyfill much? */
if (!arrayIndexOf) {
    throw new Error('Missing Array#indexOf() method for TextOM');
}

function fire(context, callbacks, args) {
    var iterator = -1;

    if (!callbacks || !callbacks.length) {
        return;
    }

    callbacks = callbacks.concat();

    while (callbacks[++iterator]) {
        callbacks[iterator].apply(context, args);
    }

    return;
}

function trigger(context, name) {
    var args = arraySlice.call(arguments, 2),
        callbacks;

    while (context) {
        callbacks = context.callbacks;
        if (callbacks) {
            fire(context, callbacks[name], args);
        }

        callbacks = context.constructor.callbacks;
        if (callbacks) {
            fire(context, callbacks[name], args);
        }

        context = context.parent;
    }
}

function emit(context, name) {
    var args = arraySlice.call(arguments, 2),
        constructors = context.constructor.constructors,
        iterator = -1,
        callbacks = context.callbacks;

    if (callbacks) {
        fire(context, callbacks[name], args);
    }

    /* istanbul ignore if: Wrong-usage */
    if (!constructors) {
        return;
    }

    while (constructors[++iterator]) {
        callbacks = constructors[iterator].callbacks;

        if (callbacks) {
            fire(context, callbacks[name], args);
        }
    }
}

/**
 * Inserts the given `child` after (when given), the `item`, and otherwise as
 * the first item of the given parents.
 *
 * @param {Object} parent
 * @param {Object} item
 * @param {Object} child
 * @api private
 */
function insert(parent, item, child) {
    var next;

    if (!parent) {
        throw new TypeError('Illegal invocation: \'' + parent +
            ' is not a valid argument for \'insert\'');
    }

    if (!child) {
        throw new TypeError('\'' + child +
            ' is not a valid argument for \'insert\'');
    }

    if ('hierarchy' in child && 'hierarchy' in parent) {
        if (parent.hierarchy + 1 !== child.hierarchy) {
            throw new Error('HierarchyError: The operation would ' +
                'yield an incorrect node tree');
        }
    }

    if (typeof child.remove !== 'function') {
        throw new Error('The operated on node did not have a ' +
            '`remove` method');
    }

    /* Insert after... */
    if (item) {
        /* istanbul ignore if: Wrong-usage */
        if (item.parent !== parent) {
            throw new Error('The operated on node (the "pointer") ' +
                'was detached from the parent');
        }

        /* istanbul ignore if: Wrong-usage */
        if (arrayIndexOf.call(parent, item) === -1) {
            throw new Error('The operated on node (the "pointer") ' +
                'was attached to its parent, but the parent has no ' +
                'indice corresponding to the item');
        }
    }

    /* Detach the child. */
    child.remove();

    /* Set the child's parent to items parent. */
    child.parent = parent;

    if (item) {
        next = item.next;

        /* If item has a next node... */
        if (next) {
            /* ...link the child's next node, to items next node. */
            child.next = next;

            /* ...link the next nodes previous node, to the child. */
            next.prev = child;
        }

        /* Set the child's previous node to item. */
        child.prev = item;

        /* Set the next node of item to the child. */
        item.next = child;

        /* If the parent has no last node or if item is the parent last node,
         * link the parents last node to the child. */
        if (item === parent.tail || !parent.tail) {
            parent.tail = child;
            arrayPush.call(parent, child);
        /* Else, insert the child into the parent after the items index. */
        } else {
            arraySplice.call(
                parent, arrayIndexOf.call(parent, item) + 1, 0, child
            );
        }
    /* If parent has a first node... */
    } else if (parent.head) {
        next = parent.head;

        /* Set the child's next node to head. */
        child.next = next;

        /* Set the previous node of head to the child. */
        next.prev = child;

        /* Set the parents heads to the child. */
        parent.head = child;

        /* If the the parent has no last node, link the parents last node to
         * head. */
        if (!parent.tail) {
            parent.tail = next;
        }

        arrayUnshift.call(parent, child);
    /* Prepend. There is no `head` (or `tail`) node yet. */
    } else {
        /* Set parent's first node to the prependee and return the child. */
        parent.head = child;
        parent[0] = child;
        parent.length = 1;
    }

    next = child.next;

    emit(child, 'insert');

    if (item) {
        emit(item, 'changenext', child, next);
        emit(child, 'changeprev', item, null);
    }

    if (next) {
        emit(next, 'changeprev', child, item);
        emit(child, 'changenext', next, null);
    }

    trigger(parent, 'insertinside', child);

    return child;
}

/**
 * Detach a node from its (when applicable) parent, links its (when
 * existing) previous and next items to each other.
 *
 * @param {Object} node
 * @api private
 */
function remove(node) {
    /* istanbul ignore if: Wrong-usage */
    if (!node) {
        return false;
    }

    /* Cache self, the parent list, and the previous and next items. */
    var parent = node.parent,
        prev = node.prev,
        next = node.next,
        indice;

    /* If the item is already detached, return node. */
    if (!parent) {
        return node;
    }

    /* If node is the last item in the parent, link the parents last
     * item to the previous item. */
    if (parent.tail === node) {
        parent.tail = prev;
    }

    /* If node is the first item in the parent, link the parents first
     * item to the next item. */
    if (parent.head === node) {
        parent.head = next;
    }

    /* If both the last and first items in the parent are the same,
     * remove the link to the last item. */
    if (parent.tail === parent.head) {
        parent.tail = null;
    }

    /* If a previous item exists, link its next item to nodes next
     * item. */
    if (prev) {
        prev.next = next;
    }

    /* If a next item exists, link its previous item to nodes previous
     * item. */
    if (next) {
        next.prev = prev;
    }

    /* istanbul ignore else: Wrong-usage */
    if ((indice = arrayIndexOf.call(parent, node)) !== -1) {
        arraySplice.call(parent, indice, 1);
    }

    /* Remove links from node to both the next and previous items,
     * and to the parent. */
    node.prev = node.next = node.parent = null;

    emit(node, 'remove', parent);

    if (next) {
        emit(next, 'changeprev', prev || null, node);
        emit(node, 'changenext', null, next);
    }

    if (prev) {
        emit(node, 'changeprev', null, prev);
        emit(prev, 'changenext', next || null, node);
    }

    trigger(parent, 'removeinside', node);

    /* Return node. */
    return node;
}

function listen(name, callback) {
    var self = this,
        callbacks;

    if (typeof name !== 'string') {
        if (name === null || name === undefined) {
            return self;
        }

        throw new TypeError('Illegal invocation: \'' + name +
            ' is not a valid argument for \'listen\'');
    }

    if (typeof callback !== 'function') {
        if (callback === null || callback === undefined) {
            return self;
        }

        throw new TypeError('Illegal invocation: \'' + callback +
            ' is not a valid argument for \'listen\'');
    }

    callbacks = self.callbacks || (self.callbacks = {});
    callbacks = callbacks[name] || (callbacks[name] = []);
    callbacks.unshift(callback);

    return self;
}

function ignore(name, callback) {
    var self = this,
        callbacks, indice;

    if ((name === null || name === undefined) &&
        (callback === null || callback === undefined)) {
        self.callbacks = {};
        return self;
    }

    if (typeof name !== 'string') {
        if (name === null || name === undefined) {
            return self;
        }

        throw new TypeError('Illegal invocation: \'' + name +
            ' is not a valid argument for \'listen\'');
    }

    if (!(callbacks = self.callbacks)) {
        return self;
    }

    if (!(callbacks = callbacks[name])) {
        return self;
    }

    if (typeof callback !== 'function') {
        if (callback === null || callback === undefined) {
            callbacks.length = 0;
            return self;
        }

        throw new TypeError('Illegal invocation: \'' + callback +
            ' is not a valid argument for \'listen\'');
    }

    if ((indice = callbacks.indexOf(callback)) !== -1) {
        callbacks.splice(indice, 1);
    }

    return self;
}

function TextOMConstructor() {
    /**
     * Expose `Node`. Initialises a new `Node` object.
     *
     * @api public
     * @constructor
     */
    function Node() {
        if (!this.data) {
            /** @member {Object} */
            this.data = {};
        }
    }

    var prototype = Node.prototype;

    prototype.on = Node.on = listen;

    prototype.off = Node.off = ignore;

    /**
     * Inherit the contexts' (Super) prototype into a given Constructor. E.g.,
     * Node is implemented by Parent, Parent is implemented by RootNode, &c.
     *
     * @param {function} Constructor
     * @api public
     */
    Node.isImplementedBy = function (Constructor) {
        var self = this,
            constructors = self.constructors || [self],
            constructorPrototype, key, newPrototype;

        constructors = [Constructor].concat(constructors);

        constructorPrototype = Constructor.prototype;

        function AltConstructor () {}
        AltConstructor.prototype = self.prototype;
        newPrototype = new AltConstructor();

        for (key in constructorPrototype) {
            newPrototype[key] = constructorPrototype[key];
        }

        if (constructorPrototype.toString !== {}.toString) {
            newPrototype.toString = constructorPrototype.toString;
        }

        for (key in self) {
            /* istanbul ignore else */
            if (self.hasOwnProperty(key)) {
                Constructor[key] = self[key];
            }
        }

        newPrototype.constructor = Constructor;
        Constructor.constructors = constructors;
        Constructor.prototype = newPrototype;
    };

    /**
     * Expose Parent. Constructs a new Parent node;
     *
     * @api public
     * @constructor
     */
    function Parent() {
        Node.apply(this, arguments);
    }

    prototype = Parent.prototype;

    /**
     * The first child of a parent, null otherwise.
     *
     * @api public
     * @type {?Child}
     * @readonly
     */
    prototype.head = null;

    /**
     * The last child of a parent (unless the last child is also the first
     * child), null otherwise.
     *
     * @api public
     * @type {?Child}
     * @readonly
     */
    prototype.tail = null;

    /**
     * The number of children in a parent.
     *
     * @api public
     * @type {number}
     * @readonly
     */
    prototype.length = 0;

    /**
     * Insert a child at the beginning of the list (like Array#unshift).
     *
     * @param {Child} child - the child to insert as the (new) FIRST child
     * @return {Child} - the given child.
     * @api public
     */
    prototype.prepend = function (child) {
        return insert(this, null, child);
    };

    /**
     * Insert a child at the end of the list (like Array#push).
     *
     * @param {Child} child - the child to insert as the (new) LAST child
     * @return {Child} - the given child.
     * @api public
     */
    prototype.append = function (child) {
        return insert(this, this.tail || this.head, child);
    };

    /**
     * Return a child at given position in parent, and null otherwise. (like
     * NodeList#item).
     *
     * @param {?number} [index=0] - the position to find a child at.
     * @return {Child?} - the found child, or null.
     * @api public
     */
    prototype.item = function (index) {
        if (index === null || index === undefined) {
            index = 0;
        } else if (typeof index !== 'number' || index !== index) {
            throw new TypeError('\'' + index + ' is not a valid argument ' +
                'for \'Parent.prototype.item\'');
        }

        return this[index] || null;
    };

    /**
     * Split the Parent into two, dividing the children from 0–position (NOT
     * including the character at `position`), and position–length (including
     * the character at `position`).
     *
     * @param {?number} [position=0] - the position to split at.
     * @return {Parent} - the prepended parent.
     * @api public
     */
    prototype.split = function (position) {
        var self = this,
            clone, cloneNode, iterator;

        if (position === null || position === undefined ||
            position !== position || position === -Infinity) {
                position = 0;
        } else if (position === Infinity) {
            position = self.length;
        } else if (typeof position !== 'number') {
            throw new TypeError('\'' + position + ' is not a valid ' +
                'argument for \'Parent.prototype.split\'');
        } else if (position < 0) {
            position = Math.abs((self.length + position) % self.length);
        }

        /* This throws if we're not attached, thus preventing appending. */
        /*eslint-disable new-cap */
        cloneNode = insert(self.parent, self.prev, new self.constructor());
        /*eslint-enable new-cap */

        clone = arraySlice.call(self);
        iterator = -1;

        while (++iterator < position && clone[iterator]) {
            cloneNode.append(clone[iterator]);
        }

        return cloneNode;
    };

    /**
     * Return the result of calling `toString` on each of `Parent`s children.
     *
     * NOTE The `toString` method is intentionally generic; It can be
     * transferred to other kinds of (linked-list-like) objects for use as a
     * method.
     *
     * @return {String}
     * @api public
     */
    prototype.toString = function () {
        var value, node;

        value = '';
        node = this.head;

        while (node) {
            value += node;
            node = node.next;
        }

        return value;
    };

    /**
     * Inherit from `Node.prototype`.
     */
    Node.isImplementedBy(Parent);

    /**
     * Expose Child. Constructs a new Child node;
     *
     * @api public
     * @constructor
     */
    function Child() {
        Node.apply(this, arguments);
    }

    prototype = Child.prototype;

    /**
     * The parent node, null otherwise (when the child is detached).
     *
     * @api public
     * @type {?Parent}
     * @readonly
     */
    prototype.parent = null;

    /**
     * The next node, null otherwise (when `child` is the parents last child
     * or detached).
     *
     * @api public
     * @type {?Child}
     * @readonly
     */
    prototype.next = null;

    /**
     * The previous node, null otherwise (when `child` is the parents first
     * child or detached).
     *
     * @api public
     * @type {?Child}
     * @readonly
     */
    prototype.prev = null;

    /**
     * Insert a given child before the operated on child in the parent.
     *
     * @param {Child} child - the child to insert before the operated on
     *                        child.
     * @return {Child} - the given child.
     * @api public
     */
    prototype.before = function (child) {
        return insert(this.parent, this.prev, child);
    };

    /**
     * Insert a given child after the operated on child in the parent.
     *
     * @param {Child} child - the child to insert after the operated on child.
     * @return {Child} - the given child.
     * @api public
     */
    prototype.after = function (child) {
        return insert(this.parent, this, child);
    };

    /**
     * Remove the operated on child, and insert a given child at its previous
     * position in the parent.
     *
     * @param {Child} child - the child to replace the operated on child with.
     * @return {Child} - the given child.
     * @api public
     */
    prototype.replace = function (child) {
        var result = insert(this.parent, this, child);

        remove(this);

        return result;
    };

    /**
     * Remove the operated on child.
     *
     * @return {Child} - the operated on child.
     * @api public
     */
    prototype.remove = function () {
        return remove(this);
    };

    /**
     * Inherit from `Node.prototype`.
     */
    Node.isImplementedBy(Child);

    /**
     * Expose Element. Constructs a new Element node;
     *
     * @api public
     * @constructor
     */
    function Element() {
        Parent.apply(this, arguments);
        Child.apply(this, arguments);
    }

    /**
     * Inherit from `Parent.prototype` and `Child.prototype`.
     */
    Parent.isImplementedBy(Element);
    Child.isImplementedBy(Element);

    /* Add Parent as a constructor (which it is) */
    Element.constructors.splice(2, 0, Parent);

    /**
     * Expose Text. Constructs a new Text node;
     *
     * @api public
     * @constructor
     */
    function Text(value) {
        Child.apply(this, arguments);

        this.fromString(value);
    }

    prototype = Text.prototype;

    /**
     * The internal value.
     *
     * @api private
     */
    prototype.internalValue = '';

    /**
     * Return the internal value of a Text;
     *
     * @return {String}
     * @api public
     */
    prototype.toString = function () {
        return this.internalValue;
    };

    /**
     * (Re)sets and returns the internal value of a Text with the stringified
     * version of the given value.
     *
     * @param {?String} [value=''] - the value to set
     * @return {String}
     * @api public
     */
    prototype.fromString = function (value) {
        var self = this,
            previousValue = self.toString(),
            parent;

        if (value === null || value === undefined) {
            value = '';
        } else {
            value = value.toString();
        }

        if (value !== previousValue) {
            self.internalValue = value;

            emit(self, 'changetext', value, previousValue);

            parent = self.parent;
            if (parent) {
                trigger(
                    parent, 'changetextinside', self, value, previousValue
                );
            }
        }

        return value;
    };

    /**
     * Split the Text into two, dividing the internal value from 0–position
     * (NOT including the character at `position`), and position–length
     * (including the character at `position`).
     *
     * @param {?number} [position=0] - the position to split at.
     * @return {Child} - the prepended child.
     * @api public
     */
    prototype.split = function (position) {
        var self = this,
            value = self.internalValue,
            cloneNode;

        if (position === null ||
            position === undefined ||
            position !== position ||
            position === -Infinity) {
                position = 0;
        } else if (position === Infinity) {
            position = value.length;
        } else if (typeof position !== 'number') {
            throw new TypeError('\'' + position + ' is not a valid ' +
                'argument for \'Text.prototype.split\'');
        } else if (position < 0) {
            position = Math.abs((value.length + position) % value.length);
        }

        /* This throws if we're not attached, thus preventing substringing. */
        /*eslint-disable new-cap */
        cloneNode = insert(self.parent, self.prev, new self.constructor());
        /*eslint-enable new-cap */

        self.fromString(value.slice(position));
        cloneNode.fromString(value.slice(0, position));

        return cloneNode;
    };

    /**
     * Inherit from `Child.prototype`.
     */
    Child.isImplementedBy(Text);

    /**
     * Expose RootNode. Constructs a new RootNode (inheriting from Parent);
     *
     * @api public
     * @constructor
     */
    function RootNode() {
        Parent.apply(this, arguments);
    }

    /**
     * The type of an instance of RootNode.
     *
     * @api public
     * @readonly
     * @static
     */
    RootNode.prototype.type = 1;
    RootNode.prototype.hierarchy = 1;

    /**
     * Inherit from `Parent.prototype`.
     */
    Parent.isImplementedBy(RootNode);

    /**
     * Expose ParagraphNode. Constructs a new ParagraphNode (inheriting from
     * both Parent and Child);
     *
     * @api public
     * @constructor
     */
    function ParagraphNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of ParagraphNode.
     *
     * @api public
     * @readonly
     * @static
     */
    ParagraphNode.prototype.type = 2;
    ParagraphNode.prototype.hierarchy = 2;

    /**
     * Inherit from `Parent.prototype` and `Child.prototype`.
     */
    Element.isImplementedBy(ParagraphNode);

    /**
     * Expose SentenceNode. Constructs a new SentenceNode (inheriting from
     * both Parent and Child);
     *
     * @api public
     * @constructor
     */
    function SentenceNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of SentenceNode.
     *
     * @api public
     * @readonly
     * @static
     */
    SentenceNode.prototype.type = 3;
    SentenceNode.prototype.hierarchy = 3;

    /**
     * Inherit from `Parent.prototype` and `Child.prototype`.
     */
    Element.isImplementedBy(SentenceNode);

    /**
     * Expose WordNode.
     */
    function WordNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of WordNode.
     *
     * @api public
     * @readonly
     * @static
     */
    WordNode.prototype.type = 4;
    WordNode.prototype.hierarchy = 4;

    /**
     * Inherit from `Text.prototype`.
     */
    Text.isImplementedBy(WordNode);

    /**
     * Expose WhiteSpaceNode.
     */
    function WhiteSpaceNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of WhiteSpaceNode.
     *
     * @api public
     * @readonly
     * @static
     */
    WhiteSpaceNode.prototype.type = 5;

    /**
     * Inherit from `Text.prototype`.
     */
    Text.isImplementedBy(WhiteSpaceNode);

    /**
     * Expose PunctuationNode.
     */
    function PunctuationNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of PunctuationNode.
     *
     * @api public
     * @readonly
     * @static
     */
    PunctuationNode.prototype.type = 6;
    PunctuationNode.prototype.hierarchy = 4;

    /**
     * Inherit from `Text.prototype`.
     */
    Text.isImplementedBy(PunctuationNode);

    /**
     * Expose SourceNode.
     */
    function SourceNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of SourceNode.
     *
     * @api public
     * @readonly
     * @static
     */
    SourceNode.prototype.type = 7;

    /**
     * Inherit from `Text.prototype`.
     */
    Text.isImplementedBy(SourceNode);

    var nodePrototype = Node.prototype,
        TextOM;

    /**
     * Define the `TextOM` object.
     * Expose `TextOM` on every instance of Node.
     *
     * @api public
     */
    nodePrototype.TextOM = TextOM = {};

    /**
     * Export all node types to `TextOM` and `Node#`.
     */
    TextOM.ROOT_NODE = nodePrototype.ROOT_NODE =
        RootNode.prototype.type;
    TextOM.PARAGRAPH_NODE = nodePrototype.PARAGRAPH_NODE =
        ParagraphNode.prototype.type;
    TextOM.SENTENCE_NODE = nodePrototype.SENTENCE_NODE =
        SentenceNode.prototype.type;
    TextOM.WORD_NODE = nodePrototype.WORD_NODE = WordNode.prototype.type;
    TextOM.PUNCTUATION_NODE = nodePrototype.PUNCTUATION_NODE =
        PunctuationNode.prototype.type;
    TextOM.WHITE_SPACE_NODE = nodePrototype.WHITE_SPACE_NODE =
        WhiteSpaceNode.prototype.type;
    TextOM.SOURCE_NODE = nodePrototype.SOURCE_NODE =
        SourceNode.prototype.type;

    /**
     * Export all `Node`s to `TextOM`.
     */
    TextOM.Node = Node;
    TextOM.Parent = Parent;
    TextOM.Child = Child;
    TextOM.Element = Element;
    TextOM.Text = Text;
    TextOM.RootNode = RootNode;
    TextOM.ParagraphNode = ParagraphNode;
    TextOM.SentenceNode = SentenceNode;
    TextOM.WordNode = WordNode;
    TextOM.PunctuationNode = PunctuationNode;
    TextOM.WhiteSpaceNode = WhiteSpaceNode;
    TextOM.SourceNode = SourceNode;

    /**
     * Expose `TextOM`. Used to instantiate a new `RootNode`.
     */
    return TextOM;
}

module.exports = TextOMConstructor;

},{}],2:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":4}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"FWaASH":6,"inherits":5}],5:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],7:[function(require,module,exports){
'use strict';

var textom = require('..'),
    assert = require('assert');

/* istanbul ignore next: noop */
function noop() {}

/* istanbul ignore next: noop */
function altNoop() {}

var TextOM = textom(),
    Node = TextOM.Node,
    nodePrototype = Node.prototype,
    Parent = TextOM.Parent,
    parentPrototype = Parent.prototype,
    Child = TextOM.Child,
    childPrototype = Child.prototype,
    Element = TextOM.Element,
    elementPrototype = Element.prototype,
    Text = TextOM.Text,
    textPrototype = Text.prototype,
    RootNode = TextOM.RootNode,
    ParagraphNode = TextOM.ParagraphNode,
    SentenceNode = TextOM.SentenceNode,
    WordNode = TextOM.WordNode,
    PunctuationNode = TextOM.PunctuationNode,
    WhiteSpaceNode = TextOM.WhiteSpaceNode,
    SourceNode = TextOM.SourceNode;

describe('textom', function () {
    it('should be of type `function`', function () {
        assert(typeof textom === 'function');
    });

    it('should create a new TextOM when called', function () {
        var TextOM2 = textom(),
            node1 = new TextOM.Node(),
            node2 = new TextOM2.Node();

        assert(node1 instanceof node1.constructor);
        assert(!(node1 instanceof node2.constructor));
        assert(node2 instanceof node2.constructor);
        assert(!(node2 instanceof node1.constructor));
    });
});

describe('TextOM', function () {
    it('should have a `ROOT_NODE` property, equal to the `type` property ' +
        'on an instance of `RootNode`', function () {
            assert(TextOM.ROOT_NODE === (new RootNode()).type);
        }
    );

    it('should have a `PARAGRAPH_NODE` property, equal to the `type` ' +
        'property on an instance of `ParagraphNode`', function () {
            assert(
                TextOM.PARAGRAPH_NODE === (new ParagraphNode()).type
            );
        }
    );

    it('should have a `SENTENCE_NODE` property, equal to the `type` ' +
        'property on an instance of `SentenceNode`', function () {
            assert(TextOM.SENTENCE_NODE === (new SentenceNode()).type);
        }
    );

    it('should have a `WORD_NODE` property, equal to the `type` property ' +
        'on an instance of `WordNode`', function () {
            assert(TextOM.WORD_NODE === (new WordNode()).type);
        }
    );

    it('should have a `PUNCTUATION_NODE` property, equal to the `type` ' +
        'property on an instance of `PunctuationNode`', function () {
            assert(
                TextOM.PUNCTUATION_NODE === (new PunctuationNode()).type
            );
        }
    );

    it('should have a `WHITE_SPACE_NODE` property, equal to the `type` ' +
        'property on an instance of `WhiteSpaceNode`', function () {
            assert(
                TextOM.WHITE_SPACE_NODE === (new WhiteSpaceNode()).type
            );
        }
    );

    it('should have a `SOURCE_NODE` property, equal to the `type` property ' +
        'on an instance of `SourceNode`', function () {
            assert(TextOM.SOURCE_NODE === (new SourceNode()).type);
        }
    );
});

describe('TextOM.Node', function () {
    it('should be of type `function`', function () {
        assert(typeof Node === 'function');
    });

    it('should set a `data` property on the newly constructed instance, ' +
        'which should be an object', function () {
            var node = new Node();
            assert(node.hasOwnProperty('data'));
            assert(
                Object.prototype.toString.call(node.data) ===
                '[object Object]'
            );
        }
    );
});

describe('TextOM.Node.isImplementedBy', function () {
    it('should be of type `function`', function () {
        assert(typeof Node.isImplementedBy === 'function');
    });

    it('should add the properties of the operated on context ' +
        'to the given constructor', function () {
            var property;

            /* istanbul ignore next */
            function CustomNode() {}

            Node.isImplementedBy(CustomNode);

            for (property in Node) {
                /* istanbul ignore else */
                if (Node.hasOwnProperty(property)) {
                    assert(property in CustomNode);
                    assert(CustomNode[property] === Node[property]);
                }
            }
        }
    );

    it('should add the operated on context as a prototype to the given ' +
        'constructor', function () {
            /* istanbul ignore next */
            function CustomNode() {}

            Node.isImplementedBy(CustomNode);

            assert(new CustomNode() instanceof Node);
        }
    );

    it('should not remove properties defined on the given constructor',
        function () {
            /* istanbul ignore next */
            function CustomNode() {}

            /* istanbul ignore next */
            function someFunction() {}

            CustomNode.test = 'test';
            CustomNode.someFunction = someFunction;

            Node.isImplementedBy(CustomNode);

            assert(CustomNode.test === 'test');
            assert(CustomNode.someFunction === someFunction);
        }
    );

    it('should not remove properties defined on the given constructors ' +
        'prototype', function () {
            /* istanbul ignore next */
            function CustomNode() {}

            /* istanbul ignore next */
            function someFunction() {}

            CustomNode.prototype.test = 'test';
            CustomNode.prototype.someFunction = someFunction;

            Node.isImplementedBy(CustomNode);

            assert(CustomNode.prototype.test === 'test');
            assert(CustomNode.prototype.someFunction === someFunction);
        }
    );

    it('should not change the `constructor` property on the given ' +
        'constructors prototype', function () {
            var constructor;

            /* istanbul ignore next */
            function CustomNode() {}

            constructor = CustomNode.prototype.constructor;

            Node.isImplementedBy(CustomNode);

            assert(CustomNode.prototype.constructor === constructor);
        }
    );

    it('should add a `constructors` array to the given constructor, filled ' +
        'with the given constructor, and the operated on context',
        function () {
            /* istanbul ignore next */
            function CustomNode() {}

            Node.isImplementedBy(CustomNode);

            assert(CustomNode.constructors.length === 2);
            assert(CustomNode.constructors[0] === CustomNode);
            assert(CustomNode.constructors[1] === Node);
        }
    );
});

describe('TextOM.Node.on', function () {
    it('should be of type `function`', function () {
        assert(typeof Node.on === 'function');
    });
});

describe('TextOM.Node.off', function () {
    it('should be of type `function`', function () {
        assert(typeof Node.off === 'function');
    });
});

describe('TextOM.Node#ROOT_NODE', function () {
    it('should be equal to the `type` property on an instance of `RootNode`',
        function () {
            assert(nodePrototype.ROOT_NODE === (new RootNode()).type);
        }
    );
});

describe('TextOM.Node#PARAGRAPH_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`ParagraphNode`', function () {
            assert(
                nodePrototype.PARAGRAPH_NODE ===
                (new ParagraphNode()).type
            );
        }
    );
});

describe('TextOM.Node#SENTENCE_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`SentenceNode`', function () {
            assert(
                nodePrototype.SENTENCE_NODE ===
                (new SentenceNode()).type
            );
        }
    );
});

describe('TextOM.Node#WORD_NODE', function () {
    it('should be equal to the `type` property on an instance of `WordNode`',
        function () {
            assert(
                nodePrototype.WORD_NODE === (new WordNode()).type
            );
        }
    );
});

describe('TextOM.Node#PUNCTUATION_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`PunctuationNode`', function () {
            assert(
                nodePrototype.PUNCTUATION_NODE ===
                (new PunctuationNode()).type
            );
        }
    );
});

describe('TextOM.Node#WHITE_SPACE_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`WhiteSpaceNode`', function () {
            assert(
                nodePrototype.WHITE_SPACE_NODE ===
                (new WhiteSpaceNode()).type
            );
        }
    );
});

describe('TextOM.Node#SOURCE_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`SourceNode`', function () {
            assert(nodePrototype.SOURCE_NODE === (new SourceNode()).type);
        }
    );
});

describe('TextOM.Node#on(name, callback)', function () {
    it('should be of type `function`', function () {
        assert(typeof nodePrototype.on === 'function');
    });

    it('should NOT throw, when no arguments are given, but return the ' +
        'current context', function () {
            assert.doesNotThrow(function () {
                (new Node()).on();
            });

            var node = new Node();
            assert(node.on() === node);
        }
    );

    it('should NOT throw, when a name but no callback is given, but ' +
        'return the current context', function () {
            assert.doesNotThrow(function () {
                (new Node()).on('test');
            });
            var node = new Node();
            assert(node.on('test') === node);
        }
    );

    it('should throw, when an invalid name is given', function () {
        assert.throws(function () {
            (new Node()).on(true);
        });
    });

    it('should throw, when an invalid callback is given', function () {
        assert.throws(function () {
            (new Node()).on('test', true);
        });
    });

    it('should set a `callbacks` attribute on the instance, when a name ' +
        'and callback is given', function () {
            var node = new Node();
            assert(!('callbacks' in node));
            node.on('test', noop);
            assert('callbacks' in node);
        }
    );

    it('should add the callback, when a name and a callback are given',
        function () {
            var node = new Node();
            assert(!('callbacks' in node));
            node.on('test', noop);
            assert('callbacks' in node);
            assert('test' in node.callbacks);
            assert(node.callbacks.test[0] === noop);
        }
    );
});

describe('TextOM.Node#off(name?, callback?)', function () {
    it('should be of type `function`', function () {
        assert(typeof nodePrototype.off === 'function');
    });

    it('should NOT throw, when no arguments are given, but return the ' +
        'current context', function () {
            assert.doesNotThrow(function () {
                (new Node()).off();
            });
            var node = new Node();
            assert(node.off() === node);
        }
    );

    it('should throw, when an invalid name is given', function () {
        assert.throws(function () {
            (new Node()).off(false);
        });
    });

    it('should throw, when an invalid callback is given', function () {
        var node = new Node();

        node.on('test', noop);

        assert.throws(function () {
            node.off('test', false);
        });
    });

    it('should NOT throw, when valid arguments are given, but no listeners ' +
        'are subscribed, but return the current context', function () {
            var node = new Node();

            assert.doesNotThrow(function () {
                assert(node.off('test') === node);
            });
        }
    );

    it('should NOT throw, when listeners to the given name do not exist, ' +
        'but return the current context', function () {
            var node = new Node();
            node.on('test', noop);

            assert.doesNotThrow(function () {
                assert(node.off('test2') === node);
            });

            node = new Node();
            node.on('test', noop);
            assert.doesNotThrow(function () {
                assert(node.off('test', altNoop) === node);
            });
        }
    );

    it('should NOT throw, when a listener but no name is given, but return ' +
        'the current context', function () {
            var node = new Node();
            node.on('test', noop);
            assert.doesNotThrow(function () {
                assert(node.off(null, noop) === node);
            });
        }
    );

    it('should remove all callbacks, when no name and no callback is given',
        function () {
            var node = new Node();
            node.on('test', noop);
            node.on('test2', altNoop);
            assert('test' in node.callbacks);
            assert('test2' in node.callbacks);
            node.off();
            assert(!('test' in node.callbacks));
            assert(!('test2' in node.callbacks));
        }
    );

    it('should remove all listeners to a given name, when a name but no ' +
        'callback are given', function () {
            var node = new Node();
            node.on('test', noop);
            node.on('test', altNoop);
            assert(node.callbacks.test.indexOf(noop) > -1);
            assert(node.callbacks.test.indexOf(altNoop) > -1);
            node.off('test');
            assert(node.callbacks.test.indexOf(noop) === -1);
            assert(node.callbacks.test.indexOf(altNoop) === -1);
        }
    );

    it('should remove a listener, when a name and a callback are given',
        function () {
            var node = new Node();
            node.on('test', noop);
            node.on('test', altNoop);
            assert(node.callbacks.test.indexOf(noop) > -1);
            assert(node.callbacks.test.indexOf(altNoop) > -1);
            node.off('test', noop);
            assert(node.callbacks.test.indexOf(noop) === -1);
            assert(node.callbacks.test.indexOf(altNoop) > -1);
        }
    );
});

describe('TextOM.Parent', function () {
    it('should be of type `function`', function () {
        assert(typeof Parent === 'function');
    });

    it('should inherit from `Node`', function () {
        assert(new Parent() instanceof Node);
    });
});

describe('TextOM.Parent#head', function () {
    it('should be `null` when no child exist', function () {
        assert(parentPrototype.head === null);
        assert((new Parent()).head === null);
    });

    it('should be the first child when one or more children exist',
        function () {
            var parent = new Parent();
            parent.append(new Child());
            assert(parent.head === parent[0]);
            parent.prepend(new Child());
            assert(parent.head === parent[0]);
        }
    );
});

describe('TextOM.Parent#tail', function () {
    it('should be `null` when no child exist', function () {
        assert(parentPrototype.tail === null);
        assert((new Parent()).tail === null);
    });

    it('should be `null` when one (1) child exist', function () {
        var parent = new Parent();
        parent.append(new Child());
        assert(parent.tail === null);
    });

    it('should be the last child when two or more children exist',
        function () {
            var parent = new Parent();
            parent.append(new Child());
            parent.prepend(new Child());
            assert(parent.tail === parent[1]);
            parent.append(new Child());
            assert(parent.tail === parent[2]);
        }
    );
});

describe('TextOM.Parent#length', function () {
    it('should be `0` when no children exist', function () {
        assert(parentPrototype.length === 0);
        assert((new Parent()).length === 0);
    });

    it('should be the number of children when one or more children exist',
        function () {
            var parent = new Parent();
            parent.append(new Child());
            assert(parent.length === 1);
            parent.prepend(new Child());
            assert(parent.length === 2);
            parent.append(new Child());
            assert(parent.length === 3);
        }
    );
});

describe('TextOM.Parent#prepend(childNode)', function () {
    it('should throw when falsey values are provided', function () {
        var parent = new Parent();

        assert.throws(function () {
            parent.prepend();
        }, 'undefined');

        assert.throws(function () {
            parent.prepend(null);
        }, 'null');

        assert.throws(function () {
            parent.prepend(undefined);
        }, 'undefined');

        assert.throws(function () {
            parent.prepend(false);
        }, 'false');
    });

    it('should throw when non-removable nodes are prepended (e.g., not ' +
        'inheriting from TextOM.Child)', function () {
            var parent = new Parent();

            assert.throws(function () {
                parent.prepend(new Node());
            }, 'remove');

            assert.throws(function () {
                parent.prepend({});
            }, 'remove');
        }
    );

    it('should call the `remove` method on the prependee', function () {
        var parent = new Parent(),
            node = new Child(),
            nodeRemove = node.remove,
            isCalled = false;

        node.remove = function () {
            isCalled = true;
            nodeRemove.apply(this, arguments);
        };

        parent.prepend(node);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the prependee to the operated ' +
        'on parent', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child();

            parent.prepend(node);
            assert(node.parent === parent);

            parent.prepend(node1);
            assert(node1.parent === parent);
        }
    );

    it('should set the `head` and `0` properties to the prepended node',
        function () {
            var parent = new Parent(),
                node = new Child();

            parent.prepend(node);
            assert(parent.head === node);
            assert(parent[0] === node);
        }
    );

    it('should set the `tail` and `1` properties to the previous `head`, ' +
        'when no `tail` exists', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child();

            parent.prepend(node);
            parent.prepend(node1);
            assert(parent.tail === node);
            assert(parent[1] === node);
        }
    );

    it('should set the `head` and `0` properties to further prepended nodes',
        function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child(),
                node2 = new Child();

            parent.prepend(node);
            parent.prepend(node1);
            assert(parent.head === node1);
            assert(parent[0] === node1);
            parent.prepend(node2);
            assert(parent.head === node2);
            assert(parent[0] === node2);
        }
    );

    it('should set the `next` property on the prependee to the parents ' +
        'previous `head`', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child();

            parent.prepend(node);
            assert(node.next === null);

            parent.prepend(node1);
            assert(node1.next === node);
        }
    );

    it('should set the `prev` property on the parents previous `head` to ' +
        'the prependee', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child();

            parent.prepend(node);

            parent.prepend(node1);
            assert(node.prev === node1);
        }
    );

    it('should update the `length` property to correspond to the number ' +
        'of prepended children', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child(),
                node2 = new Child();

            assert(parent.length === 0);

            parent.prepend(node);
            assert(parent.length === 1);

            parent.prepend(node1);
            assert(parent.length === 2);

            parent.prepend(node2);
            assert(parent.length === 3);
        }
    );

    it('should shift the indices of all children', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child(),
            child3 = new Child();

        parent.prepend(child);
        parent.prepend(child1);

        parent.prepend(child2);
        assert(parent[0] === child2);
        assert(parent[1] === child1);
        assert(parent[2] === child);

        parent.prepend(child3);
        assert(parent[0] === child3);
        assert(parent[1] === child2);
        assert(parent[2] === child1);
        assert(parent[3] === child);
    });

    it('should return the prepended child', function () {
        var parent = new Parent(),
            node = new Child();

        assert(node === parent.prepend(node));
    });
});

describe('TextOM.Parent#append(childNode)', function () {
    it('should throw when falsey values are provided', function () {
        var parent = new Parent();

        assert.throws(function () {
            parent.append();
        }, 'undefined');

        assert.throws(function () {
            parent.append(null);
        }, 'null');

        assert.throws(function () {
            parent.append(undefined);
        }, 'undefined');

        assert.throws(function () {
            parent.append(false);
        }, 'false');
    });

    it('should throw when non-removable nodes are appended (e.g., not ' +
        'inheriting from TextOM.Child)', function () {
            var parent = new Parent();

            assert.throws(function () {
                parent.append(new Node());
            }, 'remove');

            assert.throws(function () {
                parent.append({});
            }, 'remove');
        }
    );

    it('should call the `remove` method on the appendee', function () {
        var parent = new Parent(),
            node = new Child(),
            nodeRemove = node.remove,
            isCalled = false;

        node.remove = function () {
            isCalled = true;
            nodeRemove.apply(this, arguments);
        };

        parent.append(node);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the appendee to the operated ' +
        'on parent', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child();

            parent.append(node);
            assert(node.parent === parent);

            parent.append(node1);
            assert(node1.parent === parent);
        }
    );

    it('should set the `head` and `0` properties to the appended node, ' +
        'when no `head` exists', function () {
            var parent = new Parent(),
                node = new Child();

            parent.append(node);
            assert(parent.head === node);
            assert(parent[0] === node);
        }
    );

    it('should set the `tail` and `1` properties to the appended node, ' +
        'when no `tail` exists', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child();

            parent.append(node);
            parent.append(node1);
            assert(parent.tail === node1);
            assert(parent[1] === node1);
        }
    );

    it('should set the `tail`, and `length - 1`, properties to further ' +
        'appended nodes', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child(),
                node2 = new Child();

            parent.append(node);
            parent.append(node1);
            assert(parent.tail === node1);
            assert(parent[1] === node1);
            parent.append(node2);
            assert(parent.tail === node2);
            assert(parent[2] === node2);
        }
    );

    it('should set the `prev` property on the appendee to the parents ' +
        'previous `tail` (or `head`, when no `tail` exists)', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child(),
                node2 = new Child();

            parent.append(node);
            assert(node.prev === null);

            parent.append(node1);
            assert(node1.prev === node);

            parent.append(node2);
            assert(node2.prev === node1);
        }
    );

    it('should set the `next` property on the parents previous `tail` (or ' +
        '`head`, when no `tail` exists) to the appendee', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child(),
                node2 = new Child();

            parent.append(node);

            parent.append(node1);
            assert(node.next === node1);

            parent.append(node2);
            assert(node1.next === node2);
        }
    );

    it('should update the `length` property to correspond to the number of ' +
        'appended children', function () {
            var parent = new Parent(),
                node = new Child(),
                node1 = new Child(),
                node2 = new Child();

            assert(parent.length === 0);

            parent.append(node);
            assert(parent.length === 1);

            parent.append(node1);
            assert(parent.length === 2);

            parent.append(node2);
            assert(parent.length === 3);
        }
    );

    it('should return the appended child', function () {
        var parent = new Parent(),
            node = new Child();

        assert(node === parent.append(node));
    });
});

describe('TextOM.Parent#item(index?)', function () {
    it('should throw on non-nully, non-number (including NaN) values',
        function () {
            var parent = new Parent();

            assert.throws(function () {
                parent.item('string');
            }, 'string');

            assert.throws(function () {
                parent.item(0 / 0);
            }, 'NaN');

            assert.throws(function () {
                parent.item(true);
            }, 'true');
        }
    );

    it('should return the first child when the given index is either null, ' +
        'undefined, or not given', function () {
        var parent = new Parent();
        parent[0] = new Node();
        assert(parent.item(null) === parent[0]);
        assert(parent.item(undefined) === parent[0]);
        assert(parent.item() === parent[0]);
    });

    it('should return a child at a given index when available, and null ' +
        'otherwise', function () {
        var parent = new Parent();
        parent[0] = new Node();
        parent[1] = new Node();
        parent[2] = new Node();
        assert(parent.item(0) === parent[0]);
        assert(parent.item(1) === parent[1]);
        assert(parent.item(2) === parent[2]);
        assert(parent.item(3) === null);
    });
});

describe('TextOM.Parent#split(position)', function () {
    it('should throw when the operated on item is not attached',
        function () {
            var parent = new Parent();

            assert.throws(function () {
                parent.split();
            }, 'undefined');
        }
    );

    it('should throw when a position was given, not of type number',
        function () {
            var parent = new Parent(),
                element = parent.append(new Element());

            assert.throws(function () {
                element.split('failure');
            }, 'failure');
        }
    );

    it('should return a new instance() of the operated on item',
        function () {
            var parent = new Parent(),
                element = parent.append(new Element(''));

            assert(element.split() instanceof element.constructor);
        }
    );

    it('should treat a given negative position, as an position from the ' +
        'end (e.g., when the internal value of element is `alfred`, treat ' +
        '`-1` as `5`)', function () {
            var parent = new Parent(),
                element = parent.append(new Element());

            element.append(new Text('alfred'));
            element.append(new Text('bertrand'));

            element.split(-1);

            assert(element.toString() === 'bertrand');
            assert(element.prev.toString() === 'alfred');
        }
    );

    it('should NOT throw when NaN, or -Infinity are given (but treat it ' +
        'as `0`)', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(NaN);

        assert(element.toString() === 'alfredbertrand');
        assert(element.prev.toString() === '');

        element.split(-Infinity);

        assert(element.toString() === 'alfredbertrand');
        assert(element.prev.toString() === '');
    });

    it('should NOT throw when Infinity is given (but treat it as ' +
        '`this.length`)', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(Infinity);

        assert(element.toString() === '');
        assert(element.prev.toString() === 'alfredbertrand');
    });

    it('should NOT throw when a position greater than the length of the ' +
        'element is given (but treat it as `this.length`)', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(3);

        assert(element.toString() === '');
        assert(element.prev.toString() === 'alfredbertrand');
    });

    it('should NOT throw when a nully position is given, but treat it as ' +
        '`0`', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split();
        assert(element.toString() === 'alfredbertrand');
        assert(element.prev.toString() === '');

        element.split(null);
        assert(element.toString() === 'alfredbertrand');
        assert(element.prev.toString() === '');

        element.split(undefined);
        assert(element.toString() === 'alfredbertrand');
        assert(element.prev.toString() === '');
    });

    it('should remove the children of the current items value, from `0` to ' +
        'the given position', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(1);

        assert(element.toString() === 'bertrand');
    });

    it('should prepend a new instance() of the operated on item',
        function () {
            var parent = new Parent(),
                element = parent.append(new Element());

            element.split();

            assert(element.prev instanceof element.constructor);
        }
    );

    it('should move the part of the current items value, from `0` to the ' +
        'given position, to prepended item', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(1);

        assert(element.prev.toString() === 'alfred');
    });
});

describe('TextOM.Parent#toString', function () {
    it('should be a method', function () {
        assert(typeof parentPrototype.toString === 'function');
    });

    it('should return an empty string when no children are present',
        function () {
            assert((new Parent()).toString() === '');
        }
    );

    it('should return the concatenation of its children\'s `toString` ' +
        'methods', function () {
        var node = new Parent(),
            head = node.head = new Node(),
            tail = node.tail = new Node();

        head.next = tail;

        head.toString = function () {
            return 'a ';
        };

        tail.toString = function () {
            return 'value';
        };

        assert(node.toString() === 'a value');
    });
});

describe('TextOM.Child', function () {
    it('should be of type `function`', function () {
        assert(typeof Child === 'function');
    });

    it('should inherit from `Node`', function () {
        assert(new Child() instanceof Node);
    });
});

describe('TextOM.Child#parent', function () {
    it('should be `null` when not attached', function () {
        assert(childPrototype.parent === null);
        assert((new Child()).parent === null);
    });

    it('should be the parent when attached', function () {
        var parent = new Parent(),
            child = new Child();

        parent.append(child);

        assert(child.parent === parent);
    });
});

describe('TextOM.Child#prev', function () {
    it('should be `null` when not attached', function () {
        assert(childPrototype.prev === null);
        assert((new Child()).prev === null);
    });

    it('should be `null` when attached, but no previous sibling exist',
        function () {
            var parent = new Parent(),
                child = new Child();

            parent.append(child);

            assert(child.prev === null);
        }
    );

    it('should be the previous sibling when it exists', function () {
        var parent = new Parent(),
            previousSibling = new Child(),
            nextSibling = new Child();

        parent.append(previousSibling);
        parent.append(nextSibling);

        assert(nextSibling.prev === previousSibling);
    });
});

describe('TextOM.Child#next', function () {
    it('should be `null` when not attached', function () {
        assert(childPrototype.next === null);
        assert((new Child()).next === null);
    });

    it('should be `null` when attached, but no next sibling exist',
        function () {
            var parent = new Parent(),
                child = new Child();

            parent.append(child);

            assert(child.next === null);
        }
    );

    it('should be the next sibling when it exists', function () {
        var parent = new Parent(),
            previousSibling = new Child(),
            nextSibling = new Child();

        parent.append(previousSibling);
        parent.append(nextSibling);

        assert(previousSibling.next === nextSibling);
    });
});

describe('TextOM.Child#before(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () {
            (new Child()).before(new Child());
        }, 'Illegal invocation');
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.before();
        }, 'undefined');

        assert.throws(function () {
            child.before(null);
        }, 'null');

        assert.throws(function () {
            child.before(undefined);
        }, 'undefined');

        assert.throws(function () {
            child.before(false);
        }, 'false');
    });

    it('should throw when non-removable nodes are prepended (e.g., not ' +
        'inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.before(new Node());
        }, 'remove');

        assert.throws(function () {
            child.before({});
        }, 'remove');
    });

    it('should call the `remove` method on the prependee', function () {
        var child = (new Parent()).append(new Child()),
            child1 = new Child(),
            childRemove = child1.remove,
            isCalled = false;

        child1.remove = function () {
            isCalled = true;
            childRemove.apply(this, arguments);
        };

        child.before(child1);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the prependee to the operated ' +
        'on nodes\' parent', function () {
        var child = (new Parent()).append(new Child()),
            child1 = new Child();

        child.before(child1);

        assert(child.parent === child1.parent);
    });

    it('should set the parents `head` and `0` properties to the prepended ' +
        'node, when the operated on node is its parents `head`', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);
        child.before(child1);
        assert(parent.head === child1);
        assert(parent[0] === child1);
    });

    it('should set the parents `tail` and `1` properties to the operated ' +
        'on node, when no `tail` exists', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);

        child.before(child1);
        assert(parent.tail === child);
        assert(parent[1] === child);
    });

    it('should set the `prev` property to the operated on nodes\' `prev` ' +
        'property', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);

        child.before(child1);
        assert(child1.prev === null);

        child.before(child2);
        assert(child2.prev === child1);
    });

    it('should set the `next` property to the operated on node',
        function () {
            var parent = new Parent(),
                child = new Child(),
                child1 = new Child(),
                child2 = new Child();

            parent.append(child);

            child.before(child1);
            assert(child1.next === child);

            child.before(child2);
            assert(child2.next === child);
        }
    );

    it('should update the parents `length` property to correspond to the' +
        'number of prepended children', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);

        child.before(child1);
        assert(parent.length === 2);

        child.before(child2);
        assert(parent.length === 3);
    });

    it('should shift the indices of the operated on item, and its next' +
        'siblings', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child(),
            child3 = new Child();

        parent.append(child);
        parent.prepend(child1);

        child1.before(child2);
        assert(parent[0] === child2);
        assert(parent[1] === child1);
        assert(parent[2] === child);

        child2.before(child3);
        assert(parent[0] === child3);
        assert(parent[1] === child2);
        assert(parent[2] === child1);
        assert(parent[3] === child);
    });

    it('should return the prepended child', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);

        assert(child1 === child.before(child1));
    });
});

describe('TextOM.Child#after(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () {
            (new Child()).after(new Child());
        }, 'Illegal invocation');
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.after();
        }, 'undefined');

        assert.throws(function () {
            child.after(null);
        }, 'null');

        assert.throws(function () {
            child.after(undefined);
        }, 'undefined');

        assert.throws(function () {
            child.after(false);
        }, 'false');
    });

    it('should throw when non-removable nodes are appended (e.g., not' +
        'inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.after(new Node());
        }, 'remove');

        assert.throws(function () {
            child.after({});
        }, 'remove');
    });

    it('should call the `remove` method on the appendee', function () {
        var child = (new Parent()).append(new Child()),
            child1 = new Child(),
            childRemove = child1.remove,
            isCalled = false;

        child1.remove = function () {
            isCalled = true;
            childRemove.apply(this, arguments);
        };

        child.after(child1);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the appendee to the operated on' +
        'nodes\' parent', function () {
        var child = (new Parent()).append(new Child()),
            child1 = new Child();

        child.after(child1);

        assert(child.parent === child1.parent);
    });

    it('should set the parents `tail` and `1` properties to the appendee,' +
        'when no `tail` exists', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);
        child.after(child1);
        assert(parent.tail === child1);
        assert(parent[1] === child1);
    });

    it('should set the parents `tail` and `1` properties to the appendee,' +
        'when the operated on item is the parents `tail`', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);
        parent.append(child1);
        child1.after(child2);

        assert(parent.tail === child2);
        assert(parent[2] === child2);
    });

    it('should set the `next` property to the operated on nodes\' `next`' +
        'property', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);

        child.after(child1);
        assert(child1.next === null);

        child.after(child2);
        assert(child2.next === child1);
    });

    it('should set the `prev` property to the operated on node',
        function () {
            var parent = new Parent(),
                child = new Child(),
                child1 = new Child(),
                child2 = new Child();

            parent.append(child);

            child.after(child1);
            assert(child1.prev === child);

            child.after(child2);
            assert(child2.prev === child);
        }
    );

    it('should update the parents `length` property to correspond to the' +
        'number of appended children', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);

        child.after(child1);
        assert(parent.length === 2);

        child.after(child2);
        assert(parent.length === 3);
    });

    it('should shift the indices of the operated on items next siblings',
        function () {
            var parent = new Parent(),
                child = new Child(),
                child1 = new Child(),
                child2 = new Child(),
                child3 = new Child();

            parent.append(child);
            parent.append(child1);

            child.after(child2);
            assert(parent[0] === child);
            assert(parent[1] === child2);
            assert(parent[2] === child1);

            child.after(child3);
            assert(parent[0] === child);
            assert(parent[1] === child3);
            assert(parent[2] === child2);
            assert(parent[3] === child1);
        }
    );

    it('should return the appended child', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);

        assert(child1 === child.after(child1));
    });
});

describe('TextOM.Child#remove()', function () {
    it('should NOT throw when the operated on item is not attached',
        function () {
            assert.doesNotThrow(function () {
                (new Child()).remove();
            });
        }
    );

    it('should set the `parent` property on the operated on node to `null`',
        function () {
            var child = (new Parent()).append(new Child());

            child.remove();

            assert(child.parent === null);
        }
    );

    it('should set the `prev` property on the operated on node to `null`',
        function () {
            var child = (new Parent()).append(new Child());

            child.before(new Child());

            child.remove();

            assert(child.prev === null);
        }
    );

    it('should set the `next` property on the operated on node to `null`',
        function () {
            var child = (new Parent()).append(new Child());

            child.after(new Child());

            child.remove();

            assert(child.next === null);
        }
    );

    it('should set the parents `head` property to the next sibling, when ' +
        'the operated on item has no previous sibling', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);
        parent.append(child1);
        parent.append(child2);

        child.remove();

        assert(parent.head === child1);

        child1.remove();
        assert(parent.head === child2);
    });

    it('should set the parents `tail` property to the previous sibling, ' +
        'when the operated on item has no next sibling', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);
        parent.append(child1);
        parent.append(child2);

        child2.remove();
        assert(parent.tail === child1);
    });

    it('should set the parents `tail` property to `null` when the ' +
        'operated on item is the current `tail`, and the current `head` ' +
        'is its previous sibling', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);
        parent.append(child1);

        child1.remove();
        assert(parent.tail === null);
    });

    it('should set the parents `head` property to `null` when the operated ' +
        'on item is the current `head`, and no `tail` exists', function () {
        var parent = new Parent(),
            child = new Child();

        parent.append(child);
        child.remove();

        assert(parent.head === null);
    });

    it('should decrease the parents `length` property by one (1), to ' +
        'correspond to the removed child', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);
        parent.append(child1);
        parent.append(child2);

        child.remove();
        assert(parent.length === 2);

        child1.remove();
        assert(parent.length === 1);

        child2.remove();
        assert(parent.length === 0);
    });

    it('should unshift the indices of the operated on items next siblings',
        function () {
            var parent = new Parent(),
                child = new Child(),
                child1 = new Child(),
                child2 = new Child(),
                child3 = new Child();

            parent.append(child);
            parent.append(child1);
            parent.append(child2);
            parent.append(child3);

            child.remove();
            assert(parent[0] === child1);
            assert(parent[1] === child2);
            assert(parent[2] === child3);

            child1.remove();
            assert(parent[0] === child2);
            assert(parent[1] === child3);

            child2.remove();
            assert(parent[0] === child3);
        }
    );

    it('should return the removed child', function () {
        var parent = new Parent(),
            child = new Child();

        assert(child === child.remove());

        parent.append(child);
        assert(child === child.remove());
    });
});

describe('TextOM.Child#replace(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () {
            (new Child()).replace(new Child());
        }, 'Illegal invocation');
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.replace();
        }, 'undefined');

        assert.throws(function () {
            child.replace(null);
        }, 'null');

        assert.throws(function () {
            child.replace(undefined);
        }, 'undefined');

        assert.throws(function () {
            child.replace(false);
        }, 'false');
    });

    it('should throw when non-removable nodes are given (e.g., not ' +
        'inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.replace(new Node());
        }, 'remove');

        assert.throws(function () {
            child.replace({});
        }, 'remove');
    });

    it('should call the `remove` method on the replacee', function () {
        var child = (new Parent()).append(new Child()),
            child1 = new Child(),
            childRemove = child1.remove,
            isCalled = false;

        child1.remove = function () {
            isCalled = true;
            childRemove.apply(this, arguments);
        };

        child.replace(child1);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the replacee to the operated ' +
        'on nodes\' parent', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);
        child.replace(child1);

        assert(parent === child1.parent);
    });

    it('should set the `parent` property on the operated on node to `null`',
        function () {
            var parent = new Parent(),
                child = new Child(),
                child1 = new Child();

            parent.append(child);
            child.replace(child1);

            assert(child.parent === null);
        }
    );

    it('should set the parents `head` properties to the replacee, when the ' +
        'operated on item is the current head', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);
        child.replace(child1);

        assert(parent.head === child1);
    });

    it('should set the parents `tail` property to the replacee, when the ' +
        'operated on item is the current tail', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);
        parent.append(child1);
        child1.replace(child2);

        assert(parent.tail === child2);
    });

    it('should set the `next` property to the operated on nodes\' `next` ' +
        'property', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);
        parent.append(child1);
        child.replace(child2);

        assert(child2.next === child1);
    });

    it('should set the `prev` property to the operated on nodes\' `prev` ' +
        'property', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);
        parent.append(child1);
        child1.replace(child2);

        assert(child2.prev === child);
    });

    it('should NOT update the parents `length` property', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child(),
            child2 = new Child();

        parent.append(child);
        child.replace(child1);
        assert(parent.length === 1);

        parent.prepend(child);
        child.replace(child2);
        assert(parent.length === 2);
    });

    it('should NOT shift the indices of the operated on items siblings',
        function () {
            var parent = new Parent(),
                child = new Child(),
                child1 = new Child(),
                child2 = new Child(),
                child3 = new Child();

            parent.append(child);
            parent.append(child1);
            parent.append(child2);
            assert(parent[0] === child);
            assert(parent[1] === child1);
            assert(parent[2] === child2);

            child.replace(child3);
            assert(parent[0] === child3);
            assert(parent[1] === child1);
            assert(parent[2] === child2);

            child2.replace(child);
            assert(parent[0] === child3);
            assert(parent[1] === child1);
            assert(parent[2] === child);

            child1.replace(child2);
            assert(parent[0] === child3);
            assert(parent[1] === child2);
            assert(parent[2] === child);
        }
    );

    it('should return the replacee', function () {
        var parent = new Parent(),
            child = new Child(),
            child1 = new Child();

        parent.append(child);

        assert(child1 === child.replace(child1));
    });
});

describe('TextOM.Element()', function () {
    it('should be of type `function`', function () {
        assert(typeof Element === 'function');
    });

    // The following tests are a bit weird, because:
    // - First, we need to ducktype because inheritance of both Child and
    //   Parent is impossible not work.
    // - Second, istanbul overwrites methods on prototypes to detect if their
    //   called. Thus, what used to be the same method, is now overwritten.
    it('should inherit from `Child`', function () {
        var element = new Element(),
            key;

        for (key in childPrototype) {
            if (!childPrototype.hasOwnProperty(key)) {
                continue;
            }

            if (typeof childPrototype[key] === 'function') {
                assert(key in element);
            } else {
                assert(element[key] === childPrototype[key]);
            }
        }
    });

    it('should inherit from `Parent`', function () {
        var element = new Element(),
            key;

        for (key in childPrototype) {
            if (!parentPrototype.hasOwnProperty(key)) {
                continue;
            }

            /* istanbul ignore else: maybe in the future? */
            if (typeof parentPrototype[key] === 'function') {
                assert(key in element);
            } else {
                assert(element[key] === parentPrototype[key]);
            }
        }
    });
});

describe('TextOM.Text(value?)', function () {
    it('should be of type `function`', function () {
        assert(typeof Text === 'function');
    });

    it('should inherit from `Child`', function () {
        assert(new Text() instanceof Child);
    });
});

describe('TextOM.Text#toString()', function () {
    it('should return an empty string (`""`) when never set', function () {
        assert((new Text()).toString() === '');
    });

    it('should return the set value otherwise', function () {
        assert((new Text('alfred')).toString() === 'alfred');
    });
});

describe('TextOM.Text#fromString(value?)', function () {
    it('should (re)set an empty string (`""`) when a nully value is given',
        function () {
            var box = new Text('alfred');

            assert(box.fromString() === '');

            box.fromString('alfred');
            assert(box.fromString(null) === '');

            box.fromString('alfred');
            assert(box.fromString(undefined) === '');
        }
    );

    it('should return the set value otherwise', function () {
        var box = new Text();

        assert(box.fromString('alfred') === 'alfred');
        /*eslint-disable no-new-wrappers */
        assert(box.fromString(new String('alfred')) === 'alfred');
        /*eslint-enable no-new-wrappers */
    });
});

describe('TextOM.Text#split(position)', function () {
    it('should throw when the operated on item is not attached', function () {
        var box = new Text('alfred');

        assert.throws(function () {
            box.split();
        }, 'Illegal invocation');
    });

    it('should throw when a position was given, not of type number',
        function () {
            var parent = new Parent(),
                box = parent.append(new Text('alfred'));

            assert.throws(function () {
                box.split('failure');
            }, 'failure');
        }
    );

    it('should return a new instance() of the operated on item', function () {
        var parent = new Parent(),
            box = parent.append(new Text(''));

        assert(box.split() instanceof box.constructor);
    });

    it('should treat a given negative position, as an position from the ' +
        'end (e.g., when the internal value of box is `alfred`, treat ' +
        '`-1` as `5`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(-1);

        assert(box.toString() === 'd');
        assert(box.prev.toString() === 'alfre');
    });

    it('should NOT throw when NaN, or -Infinity are given (but treat it as ' +
        '`0`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(NaN);

        assert(box.toString() === 'alfred');
        assert(box.prev.toString() === '');

        box.split(-Infinity);

        assert(box.toString() === 'alfred');
        assert(box.prev.toString() === '');
    });

    it('should NOT throw when Infinity is given (but treat it as ' +
        '`value.length`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(Infinity);

        assert(box.toString() === '');
        assert(box.prev.toString() === 'alfred');
    });

    it('should NOT throw when a position greater than the length of the ' +
        'box is given (but treat it as `this.value.length`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(7);

        assert(box.toString() === '');
        assert(box.prev.toString() === 'alfred');
    });

    it('should NOT throw when a nully position is given, but treat it as `0`',
        function () {
            var parent = new Parent(),
                box = parent.append(new Text('alfred'));

            box.split();
            assert(box.toString() === 'alfred');
            assert(box.prev.toString() === '');

            box.split(null);
            assert(box.toString() === 'alfred');
            assert(box.prev.toString() === '');

            box.split(undefined);
            assert(box.toString() === 'alfred');
            assert(box.prev.toString() === '');
        }
    );

    it('should remove the part of the current items value, from `0` to the ' +
        'given position', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(2);

        assert(box.toString() === 'fred');
    });

    it('should prepend a new instance() of the operated on item',
        function () {
            var parent = new Parent(),
                box = parent.append(new Text('alfred'));

            box.split(2);

            assert(box.prev instanceof box.constructor);
        }
    );

    it('should move the part of the current items value, from `0` to the' +
        'given position, to prepended item', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(2);

        assert(box.prev.toString() === 'al');
    });
});

describe('TextOM.RootNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof RootNode === 'function');
    });

    it('should inherit from `Parent`', function () {
        assert((new RootNode()) instanceof Parent);
    });
});

describe('TextOM.ParagraphNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof ParagraphNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert((new ParagraphNode()) instanceof Element);
    });
});

describe('TextOM.SentenceNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof SentenceNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert((new SentenceNode()) instanceof Element);
    });
});

describe('TextOM.WordNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof WordNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert((new WordNode()) instanceof Text);
    });
});

describe('TextOM.PunctuationNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof PunctuationNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert((new PunctuationNode()) instanceof Text);
    });
});

describe('TextOM.WhiteSpaceNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof WhiteSpaceNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert((new WhiteSpaceNode()) instanceof Text);
    });
});

describe('TextOM.SourceNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof SourceNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert((new SourceNode()) instanceof Text);
    });
});

describe('HierarchyError', function () {
    it('should throw when appending a `RootNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                (new RootNode()).append(new RootNode());
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `ParagraphNode` to a `RootNode`',
        function () {
            assert.doesNotThrow(function () {
                (new RootNode()).append(new ParagraphNode());
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `SentenceNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                (new RootNode()).append(new SentenceNode());
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `WordNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                (new RootNode()).append(new WordNode());
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `PunctuationNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                (new RootNode()).append(new PunctuationNode());
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a `RootNode`',
        function () {
            assert.doesNotThrow(function () {
                (new RootNode()).append(new WhiteSpaceNode());
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `SourceNode` to a `RootNode`',
        function () {
            assert.doesNotThrow(function () {
                (new RootNode()).append(new SourceNode());
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `RootNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                (new ParagraphNode()).append(new RootNode());
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `ParagraphNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                (new ParagraphNode()).append(
                    new ParagraphNode()
                );
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `SentenceNode` to a ' +
        '`ParagraphNode`', function () {
            assert.doesNotThrow(function () {
                (new ParagraphNode()).append(
                    new SentenceNode()
                );
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `WordNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                (new ParagraphNode()).append(new WordNode());
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `PunctuationNode` to a ' +
        '`ParagraphNode`', function () {
            assert.throws(function () {
                (new ParagraphNode()).append(
                    new PunctuationNode()
                );
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a ' +
        '`ParagraphNode`', function () {
            assert.doesNotThrow(function () {
                (new ParagraphNode()).append(
                    new WhiteSpaceNode()
                );
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `SourceNode` to a ' +
        '`ParagraphNode`', function () {
            assert.doesNotThrow(function () {
                (new ParagraphNode()).append(
                    new SourceNode()
                );
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `RootNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                (new SentenceNode()).append(new RootNode());
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `ParagraphNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                (new SentenceNode()).append(
                    new ParagraphNode()
                );
            }, 'HierarchyError');
        }
    );

    it('should throw when appending a `SentenceNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                (new SentenceNode()).append(new SentenceNode());
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `PunctuationNode` to a ' +
        '`SentenceNode`', function () {
            assert.doesNotThrow(function () {
                (new SentenceNode()).append(
                    new PunctuationNode()
                );
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `WordNode` to a `SentenceNode`',
        function () {
            assert.doesNotThrow(function () {
                (new SentenceNode()).append(new WordNode());
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a ' +
        '`SentenceNode`', function () {
            assert.doesNotThrow(function () {
                (new SentenceNode()).append(
                    new WhiteSpaceNode()
                );
            }, 'HierarchyError');
        }
    );

    it('should NOT throw when appending a `SourceNode` to a ' +
        '`SentenceNode`', function () {
            assert.doesNotThrow(function () {
                (new SentenceNode()).append(
                    new SourceNode()
                );
            }, 'HierarchyError');
        }
    );
});

describe('Events on TextOM.Parent', function () {
    describe('[insertinside]', function () {
        it('emits on all `Child`s ancestors, with the current ancestor ' +
            'as the context, and the inserted child as an argument, when ' +
            'a Child is inserted', function () {
                var rootNode = new RootNode(),
                    paragraphNode = rootNode.append(
                        new ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new SentenceNode()
                    ),
                    wordNode = new WordNode('alfred'),
                    whiteSpaceNode = new WhiteSpaceNode('\n\n'),
                    iterator = 0,
                    shouldBeChild = null;

                function oninsertinsideFactory(context) {
                    return function (child) {
                        iterator++;
                        assert(this === context);
                        assert(child === shouldBeChild);
                    };
                }

                rootNode.on('insertinside',
                    oninsertinsideFactory(rootNode)
                );
                paragraphNode.on('insertinside',
                    oninsertinsideFactory(paragraphNode)
                );
                sentenceNode.on('insertinside',
                    oninsertinsideFactory(sentenceNode)
                );
                shouldBeChild = wordNode;

                sentenceNode.append(wordNode);
                assert(iterator === 3);

                iterator = 0;
                shouldBeChild = whiteSpaceNode;

                rootNode.append(whiteSpaceNode);
                assert(iterator === 1);
            }
        );

        it('emits on all `Child`s ancestors constructors, with the ' +
            'current ancestor as the context, and the inserted child ' +
            'as an argument, when a Child is inserted', function () {
                var rootNode = new RootNode(),
                    paragraphNode = rootNode.append(
                        new ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new SentenceNode()
                    ),
                    wordNode = new WordNode('alfred'),
                    whiteSpaceNode = new WhiteSpaceNode('\n\n'),
                    iterator = 0,
                    shouldBeChild = null;

                function oninsertinsideFactory(context) {
                    return function (child) {
                        iterator++;
                        assert(child === shouldBeChild);
                        assert(this === context);
                    };
                }

                RootNode.on('insertinside',
                    oninsertinsideFactory(rootNode)
                );
                ParagraphNode.on('insertinside',
                    oninsertinsideFactory(paragraphNode)
                );
                SentenceNode.on('insertinside',
                    oninsertinsideFactory(sentenceNode)
                );
                shouldBeChild = wordNode;

                sentenceNode.append(wordNode);
                assert(iterator === 3);

                iterator = 0;
                shouldBeChild = whiteSpaceNode;

                rootNode.append(whiteSpaceNode);
                assert(iterator === 1);

                // Clean.
                RootNode.off('insertinside');
                ParagraphNode.off('insertinside');
                SentenceNode.off('insertinside');
            });
        }
    );

    describe('[removeinside]', function () {
        it('emits on all `Child`s ancestors, with the current ancestor ' +
            'as the context, and the removed child as an argument, when ' +
            'a Child is removed', function () {
                var rootNode = new RootNode(),
                    paragraphNode = rootNode.append(
                        new ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new SentenceNode()
                    ),
                    wordNode = sentenceNode.append(
                        new WordNode('alfred')
                    ),
                    whiteSpaceNode = rootNode.append(
                        new WhiteSpaceNode('\n\n')
                    ),
                    iterator = 0,
                    shouldBeChild = null;

                function onremoveinsideFactory(context) {
                    return function (child) {
                        iterator++;
                        assert(child === shouldBeChild);
                        assert(this === context);
                    };
                }

                rootNode.on('removeinside',
                    onremoveinsideFactory(rootNode)
                );
                paragraphNode.on('removeinside',
                    onremoveinsideFactory(paragraphNode)
                );
                sentenceNode.on('removeinside',
                    onremoveinsideFactory(sentenceNode)
                );
                shouldBeChild = wordNode;

                wordNode.remove();
                assert(iterator === 3);

                iterator = 0;
                shouldBeChild = whiteSpaceNode;

                whiteSpaceNode.remove();
                assert(iterator === 1);
            }
        );

        it('emits on all `Child`s ancestors constructors, with the ' +
            'current ancestor as the context, and the removed child ' +
            'as an argument, when a Child is removed', function () {
                var rootNode = new RootNode(),
                    paragraphNode = rootNode.append(
                        new ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new SentenceNode()
                    ),
                    wordNode = sentenceNode.append(
                        new WordNode('alfred')
                    ),
                    whiteSpaceNode = rootNode.append(
                        new WhiteSpaceNode('\n\n')
                    ),
                    iterator = 0,
                    shouldBeChild = null;

                function onremoveinsideFactory(context) {
                    return function (child) {
                        iterator++;
                        assert(child === shouldBeChild);
                        assert(this === context);
                    };
                }

                RootNode.on('removeinside',
                    onremoveinsideFactory(rootNode)
                );
                ParagraphNode.on('removeinside',
                    onremoveinsideFactory(paragraphNode)
                );
                SentenceNode.on('removeinside',
                    onremoveinsideFactory(sentenceNode)
                );
                shouldBeChild = wordNode;

                wordNode.remove();
                assert(iterator === 3);

                iterator = 0;
                shouldBeChild = whiteSpaceNode;

                whiteSpaceNode.remove();
                assert(iterator === 1);

                // Clean.
                RootNode.off('removeinside');
                ParagraphNode.off('removeinside');
                SentenceNode.off('removeinside');
            }
        );
    });

    describe('[changetextinside]', function () {
        it('emits on all `Text`s ancestors, with the current ancestor as ' +
            'the context, and the changed child and the previous value as ' +
            'arguments, when a Text is changed', function () {
                var rootNode = new RootNode(),
                    paragraphNode = rootNode.append(
                        new ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new SentenceNode()
                    ),
                    wordNode = sentenceNode.append(
                        new WordNode('alfred')
                    ),
                    whiteSpaceNode = rootNode.append(
                        new WhiteSpaceNode('\n\n')
                    ),
                    iterator = 0,
                    shouldBePreviousValue = null,
                    shouldBeChild = null;

                function onchangetextinsideFactory(context) {
                    return function (child, value, previousValue) {
                        iterator++;
                        assert(this === context);
                        assert(child === shouldBeChild);
                        assert(value === child.toString());
                        assert(previousValue === shouldBePreviousValue);
                    };
                }

                rootNode.on('changetextinside',
                    onchangetextinsideFactory(rootNode)
                );
                paragraphNode.on('changetextinside',
                    onchangetextinsideFactory(paragraphNode)
                );
                sentenceNode.on('changetextinside',
                    onchangetextinsideFactory(sentenceNode)
                );
                shouldBeChild = wordNode;
                shouldBePreviousValue = wordNode.toString();

                shouldBeChild.fromString('bertrand');
                assert(iterator === 3);

                iterator = 0;
                shouldBeChild = whiteSpaceNode;
                shouldBePreviousValue = whiteSpaceNode.toString();

                shouldBeChild.fromString('\n');
                assert(iterator === 1);
            }
        );

        it('emits on all `Text`s ancestors, with the current ancestor as ' +
            'the context, and the changed child and the previous value as ' +
            'arguments, when a Text is changed', function () {
                var rootNode = new RootNode(),
                    paragraphNode = rootNode.append(
                        new ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new SentenceNode()
                    ),
                    wordNode = sentenceNode.append(
                        new WordNode('alfred')
                    ),
                    whiteSpaceNode = rootNode.append(
                        new WhiteSpaceNode('\n\n')
                    ),
                    iterator = 0,
                    shouldBeChild = null,
                    shouldBePreviousValue = null;

                function onchangetextinsideFactory(context) {
                    return function (child, value, previousValue) {
                        iterator++;
                        assert(this === context);
                        assert(child === shouldBeChild);
                        assert(value === child.toString());
                        assert(previousValue === shouldBePreviousValue);
                    };
                }

                RootNode.on('changetextinside',
                    onchangetextinsideFactory(rootNode)
                );
                ParagraphNode.on('changetextinside',
                    onchangetextinsideFactory(paragraphNode)
                );
                SentenceNode.on('changetextinside',
                    onchangetextinsideFactory(sentenceNode)
                );
                shouldBeChild = wordNode;
                shouldBePreviousValue = wordNode.toString();

                wordNode.fromString('bertrand');
                assert(iterator === 3);

                iterator = 0;
                shouldBeChild = whiteSpaceNode;
                shouldBePreviousValue = whiteSpaceNode.toString();

                whiteSpaceNode.fromString('\n');
                assert(iterator === 1);

                RootNode.off('changetextinside');
                ParagraphNode.off('changetextinside');
                SentenceNode.off('changetextinside');
            }
        );
    });
});

describe('Events on TextOM.Child', function () {
    describe('[insert]', function () {
        it('emits on child and all `child`s constructors, with `child` as ' +
            'the context, when `child` is inserted', function () {
                var paragraphNode = new ParagraphNode(),
                    sentenceNode = new SentenceNode(),
                    iterator = 0;

                sentenceNode.append(new WordNode('alfred'));

                function oninsert() {
                    iterator++;
                    assert(this === sentenceNode);
                }

                sentenceNode.on('insert', oninsert);
                SentenceNode.on('insert', oninsert);
                Element.on('insert', oninsert);
                Child.on('insert', oninsert);
                Parent.on('insert', oninsert);
                Node.on('insert', oninsert);

                paragraphNode.append(sentenceNode);
                assert(iterator === 6);

                SentenceNode.off('insert');
                Element.off('insert');
                Child.off('insert');
                Parent.off('insert');
                Node.off('insert');
            }
        );
    });

    describe('[changenext]', function () {
        it('emits on child and all child\'s constructors, with child as ' +
            'the context, and the new and the old next nodes as arguments, ' +
            'when the `next` attribute on child changes', function () {
                var sentenceNode = new SentenceNode(),
                    wordNode = sentenceNode.append(
                        new WordNode('alfred')
                    ),
                    whiteSpaceNode = sentenceNode.append(
                        new WhiteSpaceNode(' ')
                    ),
                    punctuationNode = new PunctuationNode(','),
                    iterator = 0;

                function onchangenext(node, previousNode) {
                    iterator++;
                    assert(this === wordNode);
                    assert(node === punctuationNode);
                    assert(previousNode === whiteSpaceNode);
                }

                wordNode.on('changenext', onchangenext);
                WordNode.on('changenext', onchangenext);

                wordNode.after(punctuationNode);
                assert(iterator === 2);

                wordNode.off('changenext');
                WordNode.off('changenext');
            }
        );
    });

    describe('[changeprev]', function () {
        it('emits on child and all child\'s constructors, with child as ' +
            'the context, and the new and the old prev nodes as arguments, ' +
            'when the `prev` attribute on child changes', function () {
                var sentenceNode = new SentenceNode(),
                    wordNode = sentenceNode.append(
                        new WordNode('alfred')
                    ),
                    whiteSpaceNode = sentenceNode.append(
                        new WhiteSpaceNode(' ')
                    ),
                    punctuationNode = new PunctuationNode(','),
                    iterator = 0;

                function onchangeprev(node, previousValue) {
                    iterator++;
                    assert(this === whiteSpaceNode);
                    assert(node === punctuationNode);
                    assert(previousValue === wordNode);
                }

                whiteSpaceNode.on('changeprev', onchangeprev);
                WhiteSpaceNode.on('changeprev', onchangeprev);

                whiteSpaceNode.before(punctuationNode);
                assert(iterator === 2);

                whiteSpaceNode.off('changeprev');
                WhiteSpaceNode.off('changeprev');
            }
        );
    });

    describe('[remove]', function () {
        it('emits on child and all `child`s constructors, with `child` as ' +
            'the context, and the previous parent as an argument, when ' +
            '`child` is removed', function () {
                var paragraphNode = new ParagraphNode(),
                    sentenceNode = paragraphNode.append(
                        new SentenceNode()
                    ),
                    iterator = 0;

                function onremove(parent) {
                    iterator++;
                    assert(this === sentenceNode);
                    assert(parent === paragraphNode);
                }

                sentenceNode.on('remove', onremove);
                SentenceNode.on('remove', onremove);
                Element.on('remove', onremove);
                Child.on('remove', onremove);
                Parent.on('remove', onremove);
                Node.on('remove', onremove);

                sentenceNode.remove();
                assert(iterator === 6);

                SentenceNode.off('remove');
                Element.off('remove');
                Child.off('remove');
                Parent.off('remove');
                Node.off('remove');
            }
        );
    });
});

describe('Events on TextOM.Text', function () {
    describe('[changetext]', function () {
        it('emits on text and all `text`s constructors, with `text` as the ' +
            'context, and the current and previous values as arguments, ' +
            'when a `text` is changed', function () {
                var sentenceNode = new SentenceNode(),
                    wordNode = sentenceNode.append(
                        new WordNode('alfred')
                    ),
                    iterator = 0,
                    shouldBeValue = 'bertrand',
                    shouldBePreviousValue = wordNode.toString();

                function onchangetext(value, previousValue) {
                    iterator++;
                    assert(this === wordNode);
                    assert(value === shouldBeValue);
                    assert(previousValue === shouldBePreviousValue);
                }

                wordNode.on('changetext', onchangetext);
                WordNode.on('changetext', onchangetext);
                Child.on('changetext', onchangetext);
                Node.on('changetext', onchangetext);

                wordNode.fromString(shouldBeValue);
                assert(iterator === 4);

                wordNode.off('changetext');
                WordNode.off('changetext');
                Child.off('changetext');
                Node.off('changetext');
            });
    });
});

},{"..":1,"assert":2}]},{},[7])
'use strict';

/*
 * Cached methods.
 */

var has,
    arrayPrototype,
    arraySlice,
    arrayJoin;

has = Object.prototype.hasOwnProperty;

arrayPrototype = Array.prototype;

arraySlice = arrayPrototype.slice;
arrayJoin = arrayPrototype.join;

/*
 * Utilities.
 *
 * These utilities are specialised to work on nodes,
 * with a length property that needs updating,
 * and without falsey/missing values.
 */

/**
 * Insert `value` at `position` in `arrayLike`,
 * and move all values in `arrayLike` from `position`
 * to `length` one position forwards.
 *
 * Expects all values in `arrayLike` to be truthy.
 *
 * @param {Array.<*>} arrayLike
 * @param {*} value
 * @param {number} position
 * @private
 */
function arrayLikeMove(arrayLike, value, position) {
    var next;

    if (!arrayLike[position]) {
        arrayLike[position] = value;

        position++;
    } else {
        while (value) {
            next = arrayLike[position];

            arrayLike[position] = value;

            position++;

            value = next;
        }
    }

    arrayLike.length = position;
}

/**
 * Remove the item at `position` in `arrayLike`,
 * and move all values in `arrayLike` from `position`
 * to `length` one position backwards.
 *
 * Expects all values in `arrayLike` to be truthy.
 *
 * @param {Array.<*>} arrayLike
 * @param {number} position
 * @private
 */
function arrayLikeRemove(arrayLike, position) {
    while (arrayLike[position]) {
        arrayLike[position] = arrayLike[++position];
    }

    arrayLike.length--;
}

/**
 * Find the position of `value` in `arrayLike`.
 * Returns `-1` if value is not found.
 *
 * Expects all values in `arrayLike` to be truthy.
 *
 * @param {Array.<*>} arrayLike
 * @param {*} value
 * @return {number} position, or `-1`
 * @private
 */
function arrayLikeIndexOf(arrayLike, value) {
    var index;

    index = -1;

    while (arrayLike[++index]) {
        if (arrayLike[index] === value) {
            return index;
        }
    }

    return -1;
}

/*
 * Static node types.
 */

var ROOT_NODE,
    PARAGRAPH_NODE,
    SENTENCE_NODE,
    WORD_NODE,
    SYMBOL_NODE,
    PUNCTUATION_NODE,
    WHITE_SPACE_NODE,
    SOURCE_NODE,
    TEXT_NODE;

ROOT_NODE = 'RootNode';
PARAGRAPH_NODE = 'ParagraphNode';
SENTENCE_NODE = 'SentenceNode';
WORD_NODE = 'WordNode';
SYMBOL_NODE = 'SymbolNode';
PUNCTUATION_NODE = 'PunctuationNode';
WHITE_SPACE_NODE = 'WhiteSpaceNode';
SOURCE_NODE = 'SourceNode';
TEXT_NODE = 'TextNode';

/*
 * Static node names.
 */

var NODE,
    PARENT,
    CHILD,
    ELEMENT,
    TEXT;

NODE = 'Node';
PARENT = 'Parent';
CHILD = 'Child';
ELEMENT = 'Element';
TEXT = 'Text';

/**
 * Invoke listeners while a condition returns true
 *
 * @param {function(): function(): boolean} condition
 * @private
 */
function invokeEvent(condition) {
    /**
     * Invoke every callback in `callbacks` with `parameters`
     * and `context` as its context object, while the condition
     * returns truthy.
     *
     * @param {Array.<Function>} handlers
     * @param {string} name
     * @param {Array.<*>} parameters
     * @param {Node} context
     */
    return function (handlers, name, parameters, context) {
        var index,
            length,
            test;

        if (!handlers) {
            return true;
        }

        handlers = handlers[name];

        if (!handlers || !handlers.length) {
            return true;
        }

        test = condition.apply(context, parameters);

        index = -1;
        length = handlers.length;

        handlers = handlers.concat();

        while (++index < length) {
            if (!test()) {
                return false;
            }

            handlers[index].apply(context, parameters);
        }

        return test();
    };
}

/*
 * `remove` event condition.
 */

invokeEvent.remove = invokeEvent(function (previousParent) {
    var self;

    self = this;

    /**
     * Return true if the current parent is not
     * the removed-from parent.
     *
     * @return {boolean}
     */
    return function () {
        return previousParent !== self.parent;
    };
});

/*
 * `insert` event condition.
 */

invokeEvent.insert = invokeEvent(function () {
    var self,
        parent;

    self = this;
    parent = self.parent;

    /**
     * Return true if the current parent is
     * the inserted-into parent.
     *
     * @return {boolean}
     */
    return function () {
        return parent === self.parent;
    };
});

/*
 * `insertinside` event condition.
 */

invokeEvent.insertinside = invokeEvent(function (node) {
    var parent;

    parent = node.parent;

    return function () {
        return node.parent === parent;
    };
});

/*
 * `removeinside` event condition.
 */

invokeEvent.removeinside = invokeEvent(function (node, previousParent) {
    return function () {
        return node.parent !== previousParent;
    };
});

/*
 * Default conditional (always returns `true`).
 */

var invokeAll;

invokeAll = invokeEvent(function () {
    return function () {
        return true;
    };
});

/**
 * Return whether or not `child` can be inserted
 * into `parent`.
 *
 * @param {Parent} parent
 * @param {Child} child
 * @return {boolean}
 * @private
 */
function canInsertIntoParent(parent, child) {
    var allowed;

    allowed = parent.allowedChildTypes;

    if (!allowed || !allowed.length || !child.type) {
        return true;
    }

    return arrayLikeIndexOf(allowed, child.type) !== -1;
}

/**
 * Insert all `children` after `start` in `parent`, or at
 * `parent`s head when `start` is not given.
 *
 * @param {Parent} parent
 * @param {Child?} start
 * @param {Array.<Child>} children
 * @return {Array.<Child>} `children`.
 * @private
 */
function insertAll(parent, start, children) {
    var index,
        length,
        prev,
        end,
        child,
        indice;

    if (!parent) {
        throw new Error(
            'TypeError: `' + parent + '` is not a ' +
            'valid `parent` for `insertAll`'
        );
    }

    if (!children) {
        throw new Error(
            'TypeError: `' + children + '` is not a ' +
            'valid `children` for `insertAll`'
        );
    }

    /*
     * Exit early.
     */

    length = children.length;

    if (!length) {
        return children;
    }

    if (start) {
        if (start.parent !== parent) {
            throw new Error(
                'HierarchyError: The operated on node ' +
                'is detached from `parent`'
            );
        }

        indice = arrayLikeIndexOf(parent, start);

        if (indice === -1) {
            throw new Error(
                'HierarchyError: The operated on node ' +
                'is attached to `parent`, but `parent` ' +
                'has no index corresponding to the node'
            );
        }
    }

    /*
     * Remove `children` from their parents.
     */

    index = -1;

    while (++index < length) {
        child = children[index];

        if (typeof child.remove !== 'function') {
            throw new Error(
                'TypeError: `' + child + '` does not ' +
                'have a `remove` method'
            );
        }

        if (parent === child) {
            throw new Error(
                'HierarchyError: Cannot insert `node` into ' +
                'self'
            );
        }

        /*
         * Detach `child`.
         */

        child.remove();
    }

    /*
     * Clean start and end after removal.
     */

    if (start && start.parent === parent) {
        end = start.next;
    } else {
        start = null;
        end = parent.head;
        indice = -1;
    }

    /*
     * Insert `children`.
     */

    index = -1;

    prev = start;

    while (children[++index]) {
        child = children[index];

        /*
         * Set `child`s parent to parent.
         */

        child.parent = parent;

        /*
         * Set `child`s prev node to `prev` and
         * `prev`s next node to `child`.
         */

        if (prev) {
            child.prev = prev;

            prev.next = child;
        }

        /*
         * Prepare for the next iteration.
         */

        prev = child;
    }

    /*
     * Set the `child`s next node to `end`.
     */

    if (end) {
        prev.next = end;
        end.prev = prev;
    }

    /*
     * Update `head` and `tail`.
     */

    if (!start) {
        parent.head = children[0];

        if (!parent.tail && (end || length !== 1)) {
            parent.tail = end || prev;
        }
    } else if (!end) {
        parent.tail = prev;
    }

    /*
     * Update array-like representation.
     *
     * The linked-list representation is valid, but
     */

    index = indice;

    child = children[0];

    while (child) {
        parent[++index] = child;

        child = child.next;
    }

    parent.length += children.length;

    /*
     * Emit events.
     */

    index = -1;

    while (children[++index]) {
        children[index].trigger('insert', parent);
    }

    /*
     * Emit a single `change` event.
     * This will also trigger `changeinside` events on
     * `parent` and its constructors.
     */

    parent.trigger('change', parent);

    return children;
}

/**
 * Insert `child` after `item` in `parent`, or at
 * `parent`s head when `item` is not given.
 *
 * @param {Parent} parent
 * @param {Child} item
 * @param {Child} child
 * @return {Child} `child`.
 * @private
 */
function insert(parent, item, child) {
    var next,
        indice;

    if (!parent) {
        throw new Error(
            'TypeError: `' + parent + '` is not a ' +
            'valid `parent` for `insert`'
        );
    }

    if (!child) {
        throw new Error(
            'TypeError: `' + child + '` is not a ' +
            'valid `child` for `insert`'
        );
    }

    if (parent === child || parent === item) {
        throw new Error(
            'HierarchyError: Cannot insert `node` into ' +
            'self'
        );
    }

    if (!canInsertIntoParent(parent, child)) {
        throw new Error(
            'HierarchyError: The operation would yield ' +
            'an incorrect node tree'
        );
    }

    if (typeof child.remove !== 'function') {
        throw new Error(
            'TypeError: The operated on node does not ' +
            'have a `remove` method'
        );
    }

    /*
     * Exit early.
     */

    if (item && item === child) {
        return child;
    }

    /*
     * Detach `child`.
     */

    child.remove();

    /*
     * Set `child`s parent to parent.
     */

    child.parent = parent;

    if (item) {
        next = item.next;

        if (item.parent !== parent) {
            throw new Error(
                'HierarchyError: The operated on node ' +
                'is detached from `parent`'
            );
        }

        indice = arrayLikeIndexOf(parent, item);

        if (indice === -1) {
            throw new Error(
                'HierarchyError: The operated on node ' +
                'is attached to `parent`, but `parent` ' +
                'has no index corresponding to the node'
            );
        }
    } else {
        item = null;
        next = parent.head;
        indice = -1;
    }

    if (item || next) {
        /*
         * If `item` has a next node, link `child`s next
         * node, to `item`s next node, and link the next
         * nodes previous node to `child`.
         */

        if (next) {
            child.next = next;
            next.prev = child;
        }

        /*
         * Set `child`s previous node to `item`, and set
         * the next node of `item` to `child`.
         */

        if (item) {
            child.prev = item;
            item.next = child;

            if (item === parent.tail || !parent.tail) {
                parent.tail = child;
            }
        } else {
            parent.head = child;

            if (!parent.tail) {
                parent.tail = next;
            }
        }

        /*
         * If the parent has no last node or if `item` is
         * `parent`s last node.
         */

        arrayLikeMove(parent, child, indice + 1);
    } else {
        /*
         * Prepend the node: There is no `head`, nor
         * `tail` node yet.
         *
         * Set `parent`s head to `child`.
         */

        parent.head = child;
        parent[0] = child;
        parent.length = 1;
    }

    /*
     * Emit events.
     */

    child.trigger('insert', parent);

    /*
     * Emit a single `change` event.
     * This will also trigger `changeinside` events on
     * `parent` and its constructors.
     */

    parent.trigger('change', parent);

    return child;
}

/**
 * Remove `node` from its parent.
 *
 * @param {Child} node
 * @return {Child} - `node`.
 * @private
 */
function remove(node) {
    var parent,
        prev,
        next,
        indice;

    if (!node) {
        throw new Error(
            'TypeError: `' + node + '` is not a ' +
            'valid `node` for `remove`'
        );
    }

    /*
     * Exit early when the node is already detached.
     */

    parent = node.parent;

    if (!parent) {
        return node;
    }

    prev = node.prev;
    next = node.next;

    /*
     * If `node` is its parent's tail, link the
     * tail to `node`s previous item.
     */

    if (parent.tail === node) {
        parent.tail = prev;
    }

    /*
     * If `node` is its parent's head, link the
     * head to `node`s next item.
     */

    if (parent.head === node) {
        parent.head = next;
    }

    /*
     * If node was its parent's only child,
     * remove the `tail` we just added.
     */

    if (parent.tail === parent.head) {
        parent.tail = null;
    }

    /*
     * If a previous item exists, link its next item to
     * `node`s next item.
     */

    if (prev) {
        prev.next = next;
    }

    /*
     * If a next item exists, link its previous item to
     * `node`s previous item.
     */

    if (next) {
        next.prev = prev;
    }

    indice = arrayLikeIndexOf(parent, node);

    if (indice === -1) {
        throw new Error(
            'HierarchyError: The operated on node ' +
            'is attached to `parent`, but `parent` ' +
            'has no index corresponding to the node'
        );
    }

    arrayLikeRemove(parent, indice);

    /*
     * Remove links from `node` to both its next and
     * previous items, and its parent.
     */

    node.prev = null;
    node.next = null;
    node.parent = null;

    /*
     * Emit events.
     */

    node.trigger('remove', parent, parent);

    /*
     * Emit a single `change` event.
     * This will also trigger `changeinside` events on
     * `parent` and its constructors.
     */

    parent.trigger('change', parent);

    return node;
}

/**
 * Throw an error if a split would be invalid.
 *
 * @param {number} position
 * @param {number} length
 * @return {number} - Normalised position.
 * @private
 */
function validateSplitPosition(position, length) {
    if (
        position === null ||
        position === undefined ||
        position !== position ||
        position === -Infinity
    ) {
        position = 0;
    } else if (position === Infinity) {
        position = length;
    } else if (typeof position !== 'number') {
        throw new TypeError(
            'TypeError: `' + position + '` is not a ' +
            'valid `position` for `#split()`'
        );
    } else if (position < 0) {
        position = Math.abs((length + position) % length);
    }

    return position;
}

/**
 * Add data in a TextOM node to an NLCST node.
 *
 * @param {Node} node
 * @param {NLCSTNode} nlcst
 * @private
 */
function dataToJSON(node, nlcst) {
    var data,
        attribute;

    data = node.data;

    for (attribute in data) {
        if (has.call(data, attribute)) {
            /*
             * This makes sure no empty data objects
             * are created.
             */

            if (!nlcst.data) {
                nlcst.data = {};
            }

            nlcst.data[attribute] = data[attribute];
        }
    }
}

/**
 * Inherit Super's prototype into a `Constructor`.
 *
 * Such as `Node` is implemented by `Parent`, `Parent`
 * is implemented by `RootNode`, etc.
 *
 * @param {Function} Constructor
 * @this {Function} - Super.
 * @private
 */
function isImplementedBy(Constructor) {
    var self,
        constructors,
        constructorPrototype,
        key,
        newPrototype;

    self = this;

    constructors = [Constructor].concat(self.constructors || [self]);

    constructorPrototype = Constructor.prototype;

    /**
     * Construct a new prototype.
     */
    function AltConstructor () {}

    AltConstructor.prototype = self.prototype;

    newPrototype = new AltConstructor();

    for (key in constructorPrototype) {
        /*
         * Note: Code climate, and probably other
         * linters, will fail here. Thats okay,
         * they're wrong.
         */

        newPrototype[key] = constructorPrototype[key];
    }

    /*
     * Some browser do not enumerate custom
     * `toString` methods, `Node.isImplementedBy`
     * does cater for `toString`, but not others
     * (`valueOf` and such).
     */

    if (constructorPrototype.toString !== {}.toString) {
        newPrototype.toString = constructorPrototype.toString;
    }

    if (constructorPrototype.valueOf !== {}.valueOf) {
        newPrototype.valueOf = constructorPrototype.valueOf;
    }

    /*
     * Copy properties and methods on the Super (not
     * its prototype) over to the given `Constructor`.
     */

    for (key in self) {
        if (has.call(self, key)) {
            Constructor[key] = self[key];
        }
    }

    /*
     * Enable nicely displayed `> Node` instead of
     * `> Object` in some browser consoles.
     */

    newPrototype.constructor = Constructor;

    /*
     * Store all constructor function.
     */

    Constructor.constructors = constructors;

    /*
     * Set the new prototype.
     */

    Constructor.prototype = newPrototype;
}

/**
 * Construct a new TextOM namespace.
 *
 * @return {TextOM}
 */
function TextOMConstructor() {
    var nodePrototype,
        parentPrototype,
        childPrototype,
        textPrototype,
        TextOM;

    /**
     * Define `Node`.
     *
     * @constructor Node
     */
    function Node() {
        if (!this.data) {
            this.data = {};
        }
    }

    nodePrototype = Node.prototype;

    /**
     * Expose the node name of `Node`.
     *
     * @readonly
     * @static
     * @memberof Node#
     */
    nodePrototype.nodeName = NODE;

    /**
     * Listen to an event.
     *
     * @param {string} name
     * @param {function(...*)} handler
     * @this {Node|Function}
     * @return {Node|Function}
     */
    nodePrototype.on = Node.on = function (name, handler) {
        var self,
            handlers;

        self = this;

        if (typeof name !== 'string') {
            if (name === null || name === undefined) {
                return self;
            }

            throw new Error(
                'Illegal invocation: `' + name + '` ' +
                'is not a valid `name` for ' +
                '`on(name, handler)`'
            );
        }

        if (typeof handler !== 'function') {
            if (handler === null || handler === undefined) {
                return self;
            }

            throw new TypeError(
                'Illegal invocation: `' + handler + '` ' +
                'is not a valid `handler` for ' +
                '`on(name, handler)`'
            );
        }

        handlers = self.callbacks || (self.callbacks = {});
        handlers = handlers[name] || (handlers[name] = []);
        handlers.unshift(handler);

        return self;
    };

    /**
     * Stop listening to an event.
     *
     * - When no arguments are given, stops listening;
     * - When `name` is given, stops listening to events
     *   of name `name`;
     * - When `name` and `handler` are given, stops
     *   invoking `handler` when events of name `name`
     *   are emitted.
     *
     * @param {string?} name
     * @param {function(...[*])?} handler
     * @this {Node|Function}
     * @return {Node|Function}
     */
    nodePrototype.off = Node.off = function (name, handler) {
        var self,
            handlers,
            indice;

        self = this;

        if (
            (name === null || name === undefined) &&
            (handler === null || handler === undefined)
        ) {
            self.callbacks = {};

            return self;
        }

        if (typeof name !== 'string') {
            if (name === null || name === undefined) {
                return self;
            }

            throw new Error(
                'Illegal invocation: `' + name + '` ' +
                'is not a valid `name` for ' +
                '`off(name, handler)`'
            );
        }

        handlers = self.callbacks;

        if (!handlers) {
            return self;
        }

        handlers = handlers[name];

        if (!handlers) {
            return self;
        }

        if (typeof handler !== 'function') {
            if (handler === null || handler === undefined) {
                self.callbacks[name] = [];

                return self;
            }

            throw new Error(
                'Illegal invocation: `' + handler + '` ' +
                'is not a valid `handler` for ' +
                '`off(name, handler)`'
            );
        }

        indice = handlers.indexOf(handler);

        if (indice !== -1) {
            handlers.splice(indice, 1);
        }

        return self;
    };

    /**
     * Emit an event.
     * Passes all other arguments to the handlers.
     *
     * @param {string} name
     * @this {Node}
     * @return {Node|boolean}
     */
    nodePrototype.emit = function (name) {
        var self,
            parameters,
            constructors,
            constructor,
            index,
            length,
            invoke,
            handlers;

        self = this;
        handlers = self.callbacks;

        invoke = invokeEvent[name] || invokeAll;

        parameters = arraySlice.call(arguments, 1);

        if (!invoke(handlers, name, parameters, self)) {
            return false;
        }

        constructors = self.constructor.constructors;

        if (!constructors) {
            throw new Error(
                'HierarchyError: The operated on node ' +
                'is not a node'
            );
        }

        length = constructors.length;
        index = -1;

        while (++index < length) {
            constructor = constructors[index];

            if (!invoke(constructor.callbacks, name, parameters, self)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Emit an event, and trigger a bubbling event on context.
     * Passes all other arguments to the handlers.
     *
     * @param {string} name
     * @param {Node} context
     * @this {Node}
     * @return {Node|boolean}
     */
    nodePrototype.trigger = function (name, context) {
        var self,
            node,
            parameters,
            invoke;

        self = this;

        parameters = arraySlice.call(arguments, 2);

        /*
         * Emit the event, exit with an error if it's canceled.
         */

        if (!self.emit.apply(self, [name].concat(parameters))) {
            return false;
        }

        /*
         * Exit if no context exists.
         */

        if (!context) {
            return true;
        }

        /*
         * Start firing bubbling events.
         */

        name += 'inside';

        invoke = invokeEvent[name] || invokeAll;

        parameters = [self].concat(parameters);

        node = context;

        while (node) {
            if (!invoke(node.callbacks, name, parameters, node)) {
                return false;
            }

            if (!invoke(node.constructor.callbacks, name, parameters, node)) {
                return false;
            }

            node = node.parent;
        }

        return true;
    };

    /*
     * Expose `isImplementedBy` on Node.
     */

    Node.isImplementedBy = isImplementedBy;

    /**
     * Define `Parent`.
     *
     * @constructor Parent
     * @extends {Node}
     */
    function Parent() {
        Node.apply(this, arguments);
    }

    parentPrototype = Parent.prototype;

    /**
     * Expose the node name of `Parent`.
     *
     * @readonly
     * @static
     */
    parentPrototype.nodeName = PARENT;

    /**
     * First child of a `parent`, null otherwise.
     *
     * @type {Child?}
     * @readonly
     */
    parentPrototype.head = null;

    /**
     * Last child of a `parent` (unless the last child
     * is also the first child), `null` otherwise.
     *
     * @type {Child?}
     * @readonly
     */
    parentPrototype.tail = null;

    /**
     * Number of children in `parent`.
     *
     * @type {number}
     * @readonly
     */
    parentPrototype.length = 0;

    /**
     * Insert a child at the beginning of the parent.
     *
     * @param {Child} child - Child to insert as the new
     *   head.
     * @return {self}
     */
    parentPrototype.prepend = function (child) {
        return insert(this, null, child);
    };

    /**
     * Insert children at the beginning of the parent.
     *
     * @param {Array.<Child>} children - Children to
     *   insert at the start.
     * @return {self}
     */
    parentPrototype.prependAll = function (children) {
        return insertAll(this, null, children);
    };

    /**
     * Insert a child at the end of the list (like Array#push).
     *
     * @param {Child} child - Child to insert as the new
     *   tail.
     * @return {self}
     */
    parentPrototype.append = function (child) {
        return insert(this, this.tail || this.head, child);
    };

    /**
     * Insert children at the end of the parent.
     *
     * @param {Array.<Child>} children - Children to
     *   insert at the end.
     * @return {self}
     */
    parentPrototype.appendAll = function (children) {
        return insertAll(this, this.tail || this.head, children);
    };

    /**
     * Get child at `position` in `parent`.
     *
     * @param {number?} [index=0] - Position of `child`;
     * @return {Child?}
     */
    parentPrototype.item = function (index) {
        if (index === null || index === undefined) {
            index = 0;
        } else if (typeof index !== 'number' || index !== index) {
            throw new Error(
                'TypeError: `' + index + '` ' +
                'is not a valid `index` for ' +
                '`item(index)`'
            );
        }

        return this[index] || null;
    };

    /**
     * Return the result of calling `toString` on each of `Parent`s children.
     *
     * @this {Parent}
     * @return {string}
     */
    parentPrototype.toString = function () {
        return arrayJoin.call(this, '');
    };

    /**
     * Return an NLCST node representing the context.
     *
     * @this {Parent}
     * @return {NLCSTNode}
     */
    parentPrototype.valueOf = function () {
        var self,
            index,
            children,
            nlcst;

        self = this;

        children = [];

        nlcst = {
            'type': self.type || '',
            'children': children
        };

        index = -1;

        while (self[++index]) {
            children[index] = self[index].valueOf();
        }

        dataToJSON(self, nlcst);

        return nlcst;
    };

    /*
     * Inherit from `Node.prototype`.
     */

    Node.isImplementedBy(Parent);

    /**
     * Define `Child`.
     *
     * @constructor Child
     * @extends {Node}
     */
    function Child() {
        Node.apply(this, arguments);
    }

    childPrototype = Child.prototype;

    /*
     * Expose the node name of `Child`.
     *
     * @readonly
     * @static
     */

    childPrototype.nodeName = CHILD;

    /*
     * Parent or `null`.
     *
     * @type {Parent?}
     * @readonly
     */

    childPrototype.parent = null;

    /*
     * The next node, `null` otherwise (when `child` is
     * its parent's tail or detached).
     *
     * @type {Child?}
     * @readonly
     */

    childPrototype.next = null;

    /*
     * The previous node, `null` otherwise (when `child` is
     * its parent's head or detached).
     *
     * @type {Child?}
     * @readonly
     */

    childPrototype.prev = null;

    /**
     * Insert `child` before the context in its parent.
     *
     * @param {Child} child - Child to insert.
     * @this {Child}
     * @return {self}
     */
    childPrototype.before = function (child) {
        return insert(this.parent, this.prev, child);
    };

    /**
     * Insert `children` before the context in its parent.
     *
     * @param {Array.<Child>} children - Children to
     *   insert.
     * @this {Child}
     * @return {self}
     */
    childPrototype.beforeAll = function (children) {
        return insertAll(this.parent, this.prev, children);
    };

    /**
     * Insert `child` after the context in its parent.
     *
     * @param {Child} child - Child to insert.
     * @this {Child}
     * @return {self}
     */
    childPrototype.after = function (child) {
        return insert(this.parent, this, child);
    };

    /**
     * Insert `children` after the context in its parent.
     *
     * @param {Array.<Child>} children - Children to
     *   insert.
     * @this {Child}
     * @return {self}
     */
    childPrototype.afterAll = function (children) {
        return insertAll(this.parent, this, children);
    };

    /**
     * Replace the context object with `child`.
     *
     * @param {Child} child - Child to insert.
     * @this {Child}
     * @return {self}
     */
    childPrototype.replace = function (child) {
        var result;

        result = insert(this.parent, this, child);

        remove(this);

        return result;
    };

    /**
     * Remove the context object.
     *
     * @this {Child}
     * @return {self}
     */
    childPrototype.remove = function () {
        return remove(this);
    };

    /*
     * Inherit from `Node.prototype`.
     */

    Node.isImplementedBy(Child);

    /**
     * Define `Element`.
     *
     * @constructor Element
     * @extends {Parent}
     * @extends {Child}
     */
    function Element() {
        Parent.apply(this, arguments);
        Child.apply(this, arguments);
    }

    /*
     * Inherit from `Parent.prototype` and
     * `Child.prototype`.
     */

    Parent.isImplementedBy(Element);
    Child.isImplementedBy(Element);

    /**
     * Split the context in two, dividing the children
     * from 0-position (NOT INCLUDING the character at
     * `position`), and position-length (INCLUDING the
     * character at `position`).
     *
     * @param {number?} [position=0] - Position to split
     *   at.
     * @this {Parent}
     * @return {self}
     */
    Element.prototype.split = function (position) {
        var self,
            cloneNode,
            index;

        self = this;

        position = validateSplitPosition(position, self.length);

        /*eslint-disable new-cap */
        cloneNode = insert(self.parent, self.prev, new self.constructor());
        /*eslint-enable new-cap */

        index = -1;

        /*
         * Move the children of `self` to the clone,
         * from `0` to `position`. Looks a bit weird,
         * but when a node is appended, it's also
         * removed.
         */

        while (++index < position && self[0]) {
            cloneNode.append(self[0]);
        }

        return cloneNode;
    };

    /*
     * Add Parent as a constructor (which it is)
     */

    Element.constructors.splice(2, 0, Parent);

    /**
     * Expose the node name of `Element`.
     *
     * @readonly
     * @static
     */
    Element.prototype.nodeName = ELEMENT;

    /**
     * Define `Text`.
     *
     * @param {string?} value
     * @constructor Text
     * @extends {Child}
     */
    function Text(value) {
        Child.apply(this, arguments);

        this.fromString(value);
    }

    textPrototype = Text.prototype;

    /*
     * Expose the node name of `Text`.
     *
     * @readonly
     * @static
     */

    textPrototype.nodeName = TEXT;

    /*
     * Default value.
     */

    textPrototype.internalValue = '';

    /**
     * Get the internal value of a Text;
     *
     * @this {Text}
     * @return {string}
     */
    textPrototype.toString = function () {
        return this.internalValue;
    };

    /**
     * Return an NLCST node representing the text.
     *
     * @this {Text}
     * @return {NLCSTNode}
     */
    textPrototype.valueOf = function () {
        var self,
            nlcst;

        self = this;

        nlcst = {
            'type': self.type || '',
            'value': self.internalValue
        };

        dataToJSON(self, nlcst);

        return nlcst;
    };

    /**
     * Sets the internal value of the context with the
     * stringified `value`.
     *
     * @param {string?} [value='']
     * @this {Text}
     * @return {string}
     */
    textPrototype.fromString = function (value) {
        var self,
            current,
            parent;

        self = this;

        if (value === null || value === undefined) {
            value = '';
        } else {
            value = String(value);
        }

        current = self.toString();

        if (value !== current) {
            parent = self.parent;

            self.internalValue = value;

            self.trigger('changetext', parent, value, current);

            /*
             * Emit a single `change` event.
             * This will also trigger `changeinside` events on
             * `parent` and its constructors.
             */

            if (parent) {
                parent.trigger('change', parent);
            }
        }

        return value;
    };

    /**
     * Split the context in two, dividing the children
     * from 0-position (NOT INCLUDING the character at
     * `position`), and position-length (INCLUDING the
     * character at `position`).
     *
     * @param {number?} [position=0] - Position to split
     *   at.
     * @this {Text}
     * @return {self}
     */
    textPrototype.split = function (position) {
        var self,
            value,
            cloneNode;

        self = this;
        value = self.internalValue;

        position = validateSplitPosition(position, value.length);

        /*eslint-disable new-cap */
        cloneNode = insert(self.parent, self.prev, new self.constructor());
        /*eslint-enable new-cap */

        self.fromString(value.slice(position));
        cloneNode.fromString(value.slice(0, position));

        return cloneNode;
    };

    /*
     * Inherit from `Child.prototype`.
     */

    Child.isImplementedBy(Text);

    /**
     * Define `RootNode`.
     *
     * @constructor RootNode
     * @extends {Parent}
     */
    function RootNode() {
        Parent.apply(this, arguments);
    }

    /**
     * The type of an instance of RootNode.
     *
     * @readonly
     * @static
     */
    RootNode.prototype.type = ROOT_NODE;

    /**
     * Define allowed children.
     *
     * @readonly
     */
    RootNode.prototype.allowedChildTypes = [
        PARAGRAPH_NODE,
        WHITE_SPACE_NODE,
        SOURCE_NODE
    ];

    /*
     * Inherit from `Parent.prototype`.
     */

    Parent.isImplementedBy(RootNode);

    /**
     * Define `ParagraphNode`.
     *
     * @constructor ParagraphNode
     * @extends {Element}
     */
    function ParagraphNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of ParagraphNode.
     *
     * @readonly
     * @static
     */
    ParagraphNode.prototype.type = PARAGRAPH_NODE;

    /**
     * Define allowed children.
     *
     * @readonly
     */
    ParagraphNode.prototype.allowedChildTypes = [
        SENTENCE_NODE,
        WHITE_SPACE_NODE,
        SOURCE_NODE
    ];

    /*
     * Inherit from `Parent.prototype` and `Child.prototype`.
     */

    Element.isImplementedBy(ParagraphNode);

    /**
     * Define `SentenceNode`.
     *
     * @constructor SentenceNode
     * @extends {Element}
     */
    function SentenceNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of SentenceNode.
     *
     * @readonly
     * @static
     */
    SentenceNode.prototype.type = SENTENCE_NODE;

    /**
     * Define allowed children.
     *
     * @readonly
     */
    SentenceNode.prototype.allowedChildTypes = [
        WORD_NODE,
        SYMBOL_NODE,
        PUNCTUATION_NODE,
        WHITE_SPACE_NODE,
        SOURCE_NODE
    ];

    /*
     * Inherit from `Parent.prototype` and `Child.prototype`.
     */

    Element.isImplementedBy(SentenceNode);

    /**
     * Define `WordNode`.
     *
     * @constructor WordNode
     * @extends {Element}
     */
    function WordNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of WordNode.
     *
     * @readonly
     * @static
     */
    WordNode.prototype.type = WORD_NODE;

    /**
     * Define allowed children.
     *
     * @readonly
     */
    WordNode.prototype.allowedChildTypes = [
        TEXT_NODE,
        SYMBOL_NODE,
        PUNCTUATION_NODE
    ];

    /*
     * Inherit from `Text.prototype`.
     */

    Element.isImplementedBy(WordNode);

    /**
     * Define `SymbolNode`.
     *
     * @constructor SymbolNode
     * @extends {Text}
     */
    function SymbolNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of SymbolNode.
     *
     * @readonly
     * @static
     */
    SymbolNode.prototype.type = SYMBOL_NODE;

    /*
     * Inherit from `SymbolNode.prototype`.
     */

    Text.isImplementedBy(SymbolNode);

    /**
     * Define `PunctuationNode`.
     *
     * @constructor PunctuationNode
     * @extends {Text}
     */
    function PunctuationNode() {
        SymbolNode.apply(this, arguments);
    }

    /**
     * The type of an instance of PunctuationNode.
     *
     * @readonly
     * @static
     */
    PunctuationNode.prototype.type = PUNCTUATION_NODE;

    /*
     * Inherit from `SymbolNode.prototype`.
     */

    SymbolNode.isImplementedBy(PunctuationNode);

    /**
     * Expose `WhiteSpaceNode`.
     *
     * @constructor WhiteSpaceNode
     * @extends {Text}
     */
    function WhiteSpaceNode() {
        SymbolNode.apply(this, arguments);
    }

    /**
     * The type of an instance of WhiteSpaceNode.
     *
     * @readonly
     * @static
     */
    WhiteSpaceNode.prototype.type = WHITE_SPACE_NODE;

    /**
     * Inherit from `SymbolNode.prototype`.
     */
    SymbolNode.isImplementedBy(WhiteSpaceNode);

    /***
     * Expose `SourceNode`.
     *
     * @constructor SourceNode
     * @extends {Text}
     */
    function SourceNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of SourceNode.
     *
     * @readonly
     * @static
     */
    SourceNode.prototype.type = SOURCE_NODE;

    /*
     * Inherit from `Text.prototype`.
     */

    Text.isImplementedBy(SourceNode);

    /**
     * Expose `TextNode`.
     *
     * @constructor TextNode
     * @extends {Text}
     */
    function TextNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of TextNode.
     *
     * @readonly
     * @static
     */
    TextNode.prototype.type = TEXT_NODE;

    /*
     * Inherit from `Text.prototype`.
     */

    Text.isImplementedBy(TextNode);

    /**
     * Define the `TextOM` object.
     *
     * @namespace TextOM
     */
    TextOM = {};

    /*
     * Expose all node names on `TextOM`.
     */

    TextOM.NODE = NODE;
    TextOM.PARENT = PARENT;
    TextOM.CHILD = CHILD;
    TextOM.ELEMENT = ELEMENT;
    TextOM.TEXT = TEXT;

    /*
     * Expose all different `Node`s on `TextOM`.
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
    TextOM.SymbolNode = SymbolNode;
    TextOM.PunctuationNode = PunctuationNode;
    TextOM.WhiteSpaceNode = WhiteSpaceNode;
    TextOM.SourceNode = SourceNode;
    TextOM.TextNode = TextNode;

    /*
     * Expose all node types on `TextOM`.
     */

    TextOM.ROOT_NODE = ROOT_NODE;
    TextOM.PARAGRAPH_NODE = PARAGRAPH_NODE;
    TextOM.SENTENCE_NODE = SENTENCE_NODE;
    TextOM.WORD_NODE = WORD_NODE;
    TextOM.SYMBOL_NODE = SYMBOL_NODE;
    TextOM.PUNCTUATION_NODE = PUNCTUATION_NODE;
    TextOM.WHITE_SPACE_NODE = WHITE_SPACE_NODE;
    TextOM.SOURCE_NODE = SOURCE_NODE;
    TextOM.TEXT_NODE = TEXT_NODE;

    /*
     * Expose `TextOM` on every `Node`.
     */

    nodePrototype.TextOM = TextOM;

    /*
     * Expose all node names on every `Node`.
     */

    nodePrototype.NODE = NODE;
    nodePrototype.PARENT = PARENT;
    nodePrototype.CHILD = CHILD;
    nodePrototype.ELEMENT = ELEMENT;
    nodePrototype.TEXT = TEXT;

    /*
     * Expose all node types on every `Node`.
     */

    nodePrototype.ROOT_NODE = ROOT_NODE;
    nodePrototype.PARAGRAPH_NODE = PARAGRAPH_NODE;
    nodePrototype.SENTENCE_NODE = SENTENCE_NODE;
    nodePrototype.WORD_NODE = WORD_NODE;
    nodePrototype.SYMBOL_NODE = SYMBOL_NODE;
    nodePrototype.PUNCTUATION_NODE = PUNCTUATION_NODE;
    nodePrototype.WHITE_SPACE_NODE = WHITE_SPACE_NODE;
    nodePrototype.SOURCE_NODE = SOURCE_NODE;
    nodePrototype.TEXT_NODE = TEXT_NODE;

    /*
     * Expose `TextOM`.
     */

    return TextOM;
}

/*
 * Expose `TextOMConstructor`.
 */

module.exports = TextOMConstructor;

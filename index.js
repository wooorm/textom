(function () {

    /**
     * Utilities.
     */
    var util = (function () {
        var _arrayPrototype = Array.prototype,
            _arrayUnshift = _arrayPrototype.unshift,
            _arrayPush = _arrayPrototype.push,
            _arraySplice = _arrayPrototype.splice;

        /**
         * Return the index of a given node in a given parent, and -1
         * otherwise.
         *
         * @param {Object} parent
         * @param {Object} node
         * @api private
         */
        function _at(parent, node) {
            var iterator = -1,
                length = parent.length;

            while (++iterator < length) {
                if (node === parent[iterator]) {
                    return iterator;
                }
            }

            /* istanbul ignore next: Wrong-useage */
            return -1;
        }

        /**
         * Inserts the given `appendee` after the given `item`.
         *
         * @param {Object} item
         * @param {Object} appendee
         * @api private
         */
        function _insertAfter(item, appendee) {

            // Cache the items parent and the next item.
            var parent = item.parent,
                next = item.next,
                position;

            // Detach the appendee.
            appendee.remove();

            // If item has a next node...
            if (next) {
                // ...link the appendees next node, to items next node.
                appendee.next = next;

                // ...link the next nodes previous node, to the appendee.
                next.prev = appendee;
            }

            // Set the appendees previous node to item.
            appendee.prev = item;

            // Set the appendees parent to items parent.
            appendee.parent = parent;

            // Set the next node of item to the appendee.
            item.next = appendee;

            // If the parent has no last node or if item is the parent last 
            // node, link the parents last node to the appendee.
            if (item === parent.tail || !parent.tail) {
                parent.tail = appendee;
                _arrayPush.call(parent, appendee);
            // Else, insert the appendee into the parent after the items index.
            } else {
                _arraySplice.call(parent, _at(parent, item) + 1, 0, appendee);
            }

            // Return the appendee.
            return appendee;
        }

        /**
         * Inserts the given `prependee` before the given `item` (which should 
         * always be its parents head).
         *
         * @param {Object} item
         * @param {Object} prependee
         * @api private
         */
        function _insertBeforeHead(item, prependee) {

            // Cache the items parent and the previous item.
            var parent = item.parent;

            // Detach the prependee.
            prependee.remove();

            // Set the prependees next node to item.
            prependee.next = item;

            // Set the prependees parent parent to items parent parent.
            prependee.parent = parent;

            // Set the previous node of item to the prependee.
            item.prev = prependee;

            // If item is the first node in the parent parent, link the parents 
            // first node to the prependee.
            parent.head = prependee;

            // If the the parent parent has no last node, link the parents last 
            // node to item.
            if (!parent.tail) {
                parent.tail = item;
            }

            _arrayUnshift.call(parent, prependee);

            // Return the prependee.
            return prependee;
        }

        /**
         * Inserts the given `appendee` after (when given), the `item`, and 
         * otherwise as the first item of the given parents.
         *
         * @param {Object} parent
         * @param {Object} item
         * @param {Object} appendee
         * @api private
         */
        function _append(parent, item, appendee) {

            if (!parent) {
                throw new Error('No parent was provided to insert into');
            }

            if (!appendee) {
                throw new Error('No item was provided to insert');
            }

            // Insert after...
            if (item) {

                /* istanbul ignore if: Wrong-useage */
                if (item.parent !== parent) {
                    throw new Error('The operated on node (the "pointer") was detached from the parent');
                }

                /* istanbul ignore if: Wrong-useage */
                if (-1 === _at(parent, item)) {
                    throw new Error('The operated on node (the "pointer") was attached to its parent, but the parent has no indice corresponding to the item');
                }

                /* istanbul ignore if: Wrong-useage */
                if (typeof item.remove !== 'function') {
                    throw new Error('The operated on node did not have a `remove` method');
                }

                return _insertAfter(item, appendee);
            }

            // If parent has a first node...
            /*jshint boss:true */
            if (item = parent.head) {
                return _insertBeforeHead(item, appendee);
            }

            // Prepend. There is no `head` (or `tail`) node yet.

            // Detach the prependee.
            appendee.remove();

            // Set the prependees parent to reference parent.
            appendee.parent = parent;

            // Set parent's first node to the prependee and return the 
            // appendee.
            parent.head = appendee;
            parent[0] = appendee;
            parent.length = 1;

            return appendee;
        }

        /**
         * Detach a node from its (when applicable) parent, links its (when 
         * existing) previous and next items to eachother.
         *
         * @param {Object} node
         * @api private
         */
        function _remove(node) {

            /* istanbul ignore if: Wrong-useage */
            if (!node) {
                return false;
            }

            // Cache self, the parent list, and the previous and next items.
            var parent = node.parent,
                prev = node.prev,
                next = node.next,
                indice;

            // If the item is already detached, return node.
            if (!parent) {
                return node;
            }

            // If node is the last item in the parent, link the parents last 
            // item to the previous item.
            if (parent.tail === node) {
                parent.tail = prev;
            }

            // If node is the first item in the parent, link the parents first 
            // item to the next item.
            if (parent.head === node) {
                parent.head = next;
            }

            // If both the last and first items in the parent are the same, 
            // remove the link to the last item.
            if (parent.tail === parent.head) {
                parent.tail = null;
            }

            // If a previous item exists, link its next item to nodes next 
            // item.
            if (prev) {
                prev.next = next;
            }

            // If a next item exists, link its previous item to nodes previous 
            // item.
            if (next) {
                next.prev = prev;
            }

            /*jshint boss:true */
            /* istanbul ignore else: Wrong-useage */
            if (-1 !== (indice = _at(parent, node))) {
                _arraySplice.call(parent, indice, 1);
            }

            // Remove links from node to both the next and previous items, and to the 
            // parent parent.
            node.prev = node.next = node.parent = null;

            // Return node.
            return node;

        }

        /**
         * Let the given `Constructor` inherit from `Super`s prototype.
         *
         * @param {function} Constructor
         * @param {function} Super
         * @api private
         */
        function _implements(Constructor, Super) {

            var prototype, key, prototype_, constructors;

            prototype = Constructor.prototype;

            function Constructor_ () {}
            Constructor_.prototype = Super.prototype;
            prototype_ = new Constructor_();

            for (key in prototype) {
                prototype_[key] = prototype[key];
            }

            for (key in Super) {
                /* istanbul ignore else */
                if (Super.hasOwnProperty(key)) {
                    Constructor[key] = Super[key];
                }
            }
    
            prototype_.constructor = Constructor;
            Constructor.prototype = prototype_;
        }

        var RANGE_BREAK = -1;
        var RANGE_CONTINUE = 1;

        function _findNextParent(node) {
            while (node) {
                if ((node = node.parent) && node.next) {
                    return node.next;
                }
            }

            return null;
        }

        function _findPrevParent(node) {
            while (node) {
                if ((node = node.parent) && node.prev) {
                    return node.prev;
                }
            }

            return null;
        }

        function _findRoot(node) {
            while (node) {
                if (!node.parent) {
                    return node;
                }
        
                node = node.parent;
            }
        }

        // walkUpwards goes upwards.
        function _walkUpwards(start, callback) {

            var pointer = start.parent;

            while (pointer) {
                if (callback(pointer) === RANGE_BREAK) {
                    return;
                }

                pointer = pointer.parent;
            }
        }

        // _walkForwards tries to go deeper, otherwise forwards.
        // When callback returns:
        // -1 (RANGE_BREAK): Stop.
        function _walkForwards(start, callback) {

            var pointer = start.next || _findNextParent(start);

            while (pointer) {
                result = callback(pointer);

                if (result === RANGE_BREAK) {
                    return;
                }

                pointer = pointer.head || pointer.next || _findNextParent(pointer);
            }
        }

        // _walkBackwards tries to go deeper, otherwise backwards.
        // When callback returns:
        // -1 (RANGE_BREAK): Stop.
        function _walkBackwards(start, callback) {

            var pointer = start.prev || _findPrevParent(start);

            while (pointer) {
                result = callback(pointer);

                if (result === RANGE_BREAK) {
                    return;
                }

                pointer = pointer.tail || pointer.prev || _findPrevParent(pointer);
            }
        }

        return {
            'RANGE_BREAK' : RANGE_BREAK,
            'RANGE_CONTINUE' : RANGE_CONTINUE,
            'implements' : _implements,
            'append' : _append,
            'remove' : _remove,
            'findRoot' : _findRoot,
            'walkUpwards' : _walkUpwards,
            'walkBackwards' : _walkBackwards,
            'walkForwards' : _walkForwards
        };
    })();


    /**
     * Cache much-used functions.
     */
    var append = util.append,
        remove = util.remove,
        implements = util.implements,
        findRoot = util.findRoot,
        walkUpwards = util.walkUpwards,
        walkForwards = util.walkForwards,
        walkBackwards = util.walkBackwards,
        RANGE_BREAK = util.RANGE_BREAK,
        RANGE_CONTINUE = util.RANGE_CONTINUE,
        arraySlice = Array.prototype.slice;


    /**
     * Expose `TextOM`. Defined below, and used to instantiate a new 
     * `RootNode`.
     */
    exports = module.exports = TextOM;

    /**
     * Expose `Node`. Initializes a new `Node` object.
     *
     * @api public
     * @constructor
     */
    function Node() {
        /** @member {Object} */
        /*jshint expr:true */
        this.data || (this.data = {});
    }

    /**
     * The type of an instance of Node.
     *
     * @api public
     * @readonly
     * @static
     */
    Node.prototype.type = 0;

    /**
     * Inherit the contexts' (Super) prototype into a given Constructor. E.g.,
     * Node is implemeted by Parent, Parent is implemeted by RootNode, &c.
     *
     * @api public
     */
    Node.isImplementedBy = function (Constructor) {
        implements(Constructor, this);
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

    var prototype = Parent.prototype;

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
        return append(this, null, child);
    };

    /**
     * Insert a child at the end of the list (like Array#push).
     *
     * @param {Child} child - the child to insert as the (new) LAST child
     * @return {Child} - the given child.
     * @api public
     */
    prototype.append = function (child) {
        return append(this, this.tail || this.head, child);
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
        /*jshint eqnull:true */
        if (index != null && (typeof index !== 'number' || index !== index)) {
            throw new Error('Parent#item expected its given argument to be ' +
                'either a number, null, or undefined.');
        }
        
        return this[index || 0] || null;
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
     * @param {Child} child - the child to insert before the operated on child.
     * @return {Child} - the given child.
     * @api public
     */
    prototype.before = function (child) {
        return append(this.parent, this.prev, child);
    };

    /**
     * Insert a given child after the operated on child in the parent.
     *
     * @param {Child} child - the child to insert after the operated on child.
     * @return {Child} - the given child.
     * @api public
     */
    prototype.after = function (child) {
        return append(this.parent, this, child);
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
        var result = append(this.parent, this, child);
        
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
    prototype._value = '';

    /**
     * Return the internal value of a Text;
     *
     * @return {String}
     * @api public
     */
    prototype.toString = function () {
        return this._value;
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
        /*jshint eqnull:true, -W093 */
        return this._value = (value == null) ? '' : '' + value;
    };
    
    /**
     * Split the Text into two, dividing the internal value from 0–position, 
     * and position–length (both not including the character at `position`).
     *
     * @param {?number} [position=0] - the position to split at.
     * @return {Child} - the prepended child.
     * @api public
     */
    prototype.split = function (position) {
        var self = this,
            value = self._value,
            cloneNode;
        
        /*jshint eqnull:true*/
        if (position == null || position !== position || position === Infinity ||
            position === -Infinity) {
                position = 0;
        } else if (typeof position !== 'number') {
            throw new Error('A `position` was given that was not a number');
        } else if (position < 0) {
            position = Math.abs((value.length + position) % value.length);
        }
        
        // This throws if we're not attached, thus preventing substringing.
        cloneNode = append(self.parent, self.prev, new self.constructor());
        
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

    /**
     * Inherit from `Text.prototype`.
     */
    Text.isImplementedBy(PunctuationNode);
    
    
    /**
     * Expose Range.
     */
    function Range() {}

    prototype = Range.prototype;

    /**
     * The starting node of a range, null otherwise.
     *
     * @api public
     * @type {?Node}
     * @readonly
     */
    prototype.startContainer = null;

    /**
     * The starting offset of a range `null` when not existing.
     *
     * @api public
     * @type {?number}
     * @readonly
     */
    prototype.startOffset = null;

    /**
     * The ending node of a range, null otherwise.
     *
     * @api public
     * @type {?Node}
     * @readonly
     */
    prototype.endContainer = null;

    /**
     * The ending offset of a range, `null` when not existing.
     *
     * @api public
     * @type {?number}
     * @readonly
     */
    prototype.endOffset = null;
    
    // prototype.commonAncestorContainer = null;

    /**
     * Set the start container and offset of a range.
     *
     * @param {Node} node - the start container to start the range at.
     * @param {?number} offset - (integer) the start offset of the container to start the range at;
     * @api public
     */
    prototype.setStart = function (node, offset) {

        if (!node) {
            throw new Error('No `node` was given to `setStart`, but it is required');
        }

        if (!node.parent) {
            throw new Error('A `node` was given to `setStart`, but it was not attached');
        }

        var self = this,
            length = node.length,
            endContainer = self.endContainer,
            endOffset = self.endOffset,
            switchContainers = false;

        /*jshint eqnull:true*/
        if (offset == null) {
            offset = 0;
        } else if (offset !== offset || typeof offset !== 'number') {
            throw new Error('An `offset` was given but it was either NaN, or not a number');
        } else if (offset < 0) {
            throw new Error('An `offset` was given, but it was a negative number');
        // If offset is greater than node's length, throw an "IndexSizeError" 
        // exception.
        } else if ('length' in node && offset > length) {
            throw new Error('This should be an `IndexSizeError`');
        }

        // If boundaryPoint is after the range's end, set range's end to 
        // boundaryPoint.
        if (endContainer) {

            if (findRoot(endContainer) !== findRoot(node)) {
                throw new Error('A node was given that does not share the same root as the current `endContainer`');
            }

            // When node is also the endContainer;
            if (endContainer === node) {
                if (endOffset < offset) {
                    switchContainers = true;
                }
            } else {
                walkUpwards(node, function (node_) {
                    if (node_ === endContainer) {
                        switchContainers = true;
                        return RANGE_BREAK;
                    }
                });
                
                if (!switchContainers) {
                    walkBackwards(node, function (node_) {
                        if (node_ === endContainer) {
                            switchContainers = true;
                            return RANGE_BREAK;
                        }
                    });
                }
            }
            
            if (switchContainers) {
                self.endContainer = node;
                self.endOffset = offset;
                node = endContainer;
                offset = endOffset;
            }
        }
        
        // Set range's start to boundaryPoint.
        self.startContainer = node;
        self.startOffset = offset;
    };

    /**
     * Set the end container and offset of a range.
     *
     * @param {Node} node - the end container to start the range at.
     * @param {?number} offset - (integer) the end offset of the container to end the range at;
     * @api public
     */
    prototype.setEnd = function (node, offset) {

        if (!node) {
            throw new Error('No `node` was given to `setEnd`, but it is required');
        }

        if (!node.parent) {
            throw new Error('A `node` was given to `setEnd`, but it was not attached');
        }
        

        var self = this,
            length = node.length,
            startContainer = self.startContainer,
            startOffset = self.startOffset,
            switchContainers = false;

        /*jshint eqnull:true*/
        if (offset == null) {
            offset = length;
        } else if (offset !== offset || typeof offset !== 'number') {
            throw new Error('An `offset` was given but it was either NaN, or not a number');
        } else if (offset < 0) {
            throw new Error('An `offset` was given, but it was a negative number');
        // If offset is greater than node's length, throw an "IndexSizeError" 
        // exception.
        } else if ('length' in node && offset > length) {
            throw new Error('This should be an `IndexSizeError`');
        }
        
        // If boundaryPoint is before the range's start, set range's start to 
        // boundaryPoint.
        if (startContainer) {
            
            if (findRoot(startContainer) !== findRoot(node)) {
                throw new Error('A node was given that does not share the same root as the current `startContainer`');
            }

            // When node is also the startContainer;
            if (startContainer === node) {
                if (startOffset > offset) {
                    switchContainers = true;
                }
            } else {
                walkForwards(node, function (node_) {
                    if (node_ === startContainer) {
                        switchContainers = true;
                        return RANGE_BREAK;
                    }
                });
            }
        }

        if (switchContainers) {
            self.startContainer = node;
            self.startOffset = offset;
            node = startContainer;
            offset = startOffset;
        }

        // Set range's start to boundaryPoint.
        self.endContainer = node;
        self.endOffset = offset;
    };

    // prototype.deleteContents = function () {
    //     // http://dom.spec.whatwg.org/#dom-range-deletecontents;
    //     throw new Error('Range#deleteContents() was not implemented yet.');
    // }

    prototype.cloneRange = function () {
        var self = this,
            range = new self.constructor();

        range.startContainer = self.startContainer;
        range.startOffset = self.startOffset;
        range.endContainer = self.endContainer;
        range.endOffset = self.endOffset;

        return range;
    };

    /**
     * Return the result of calling `toString` on each of Text node inside 
     * `range`, substringing when necessary;
     *
     * @return {String}
     * @api public
     */
    prototype.toString = function () {
        var value = '',
            self = this,
            startContainer = self.startContainer,
            startOffset = self.startOffset,
            endContainer = self.endContainer,
            endOffset = self.endOffset;

        if (!startContainer || !endContainer) {
            return value;
        }

        if (startContainer === endContainer && startOffset === endOffset) {
            return value;
        }
        
        if (findRoot(startContainer) !== findRoot(endContainer)) {
            return value;
        }
        
        // If start node equals end node, and it is a Text node, return the 
        // substring of that Text node's data beginning at start offset and
        // ending at end offset.
        if (startContainer === endContainer) {
            if (!('length' in startContainer)) {
                return startContainer.toString().slice(startOffset, endOffset);
            }

            return arraySlice.call(startContainer, startOffset, endOffset).join('');
        }

        // If start node is a Text node, append to value the substring of that
        // node's data from the start offset until the end.
        if (!('length' in startContainer)) {
            value += startContainer.toString().slice(startOffset);
        } else {
            value += arraySlice.call(startContainer, startOffset);
        }

        // Append to value the concatenation, in tree order, of the data of all 
        // Text nodes that are contained in the context object.
        walkForwards(startContainer, function (node) {
            if (node === endContainer) {
                if (!('length' in node)) {
                    value += endContainer.toString().slice(0, endOffset);
                } else {
                    value += arraySlice.call(endContainer, 0, endOffset);
                }

                return RANGE_BREAK;
            }

            if (!('length' in node)) {
                value += node.toString();
            }
        });

        return value;
    };


    /**
     * Define `TextOM`. Exported above, and used to instantiate a new 
     * `RootNode`.
     *
     * @api public
     * @constructor
     */
    function TextOM() {
        return new RootNode();
    }
    
    var NodeProtype = Node.prototype;
    
    /**
     * Export all node types to `exports` (i.e. `TextOM`), and `Node#`.
     */
    exports.ROOT_NODE = NodeProtype.ROOT_NODE = RootNode.prototype.type;
    exports.PARAGRAPH_NODE = NodeProtype.PARAGRAPH_NODE = ParagraphNode.prototype.type;
    exports.SENTENCE_NODE = NodeProtype.SENTENCE_NODE = SentenceNode.prototype.type;
    exports.WORD_NODE = NodeProtype.WORD_NODE = WordNode.prototype.type;
    exports.PUNCTUATION_NODE = NodeProtype.PUNCTUATION_NODE = PunctuationNode.prototype.type;
    exports.WHITE_SPACE_NODE = NodeProtype.WHITE_SPACE_NODE = WhiteSpaceNode.prototype.type;
    
    /**
     * Export all `Node`s and `Range` to `exports` (i.e. `TextOM`).
     */
    exports.Node = Node;
    exports.Parent = Parent;
    exports.Child = Child;
    exports.Element = Element;
    exports.Text = Text;
    exports.Range = Range;
    exports.RootNode = RootNode;
    exports.ParagraphNode = ParagraphNode;
    exports.SentenceNode = SentenceNode;
    exports.WordNode = WordNode;
    exports.PunctuationNode = PunctuationNode;
    exports.WhiteSpaceNode = WhiteSpaceNode;
})();
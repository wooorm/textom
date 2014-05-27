(function () {
    /**
     * Utilities.
     */
    var arrayPrototype = Array.prototype,
        arrayUnshift = arrayPrototype.unshift,
        arrayPush = arrayPrototype.push,
        arraySlice = arrayPrototype.slice,
        arraySplice = arrayPrototype.splice;

    /**
     * Return the index of a given node in a given parent, and -1
     * otherwise.
     *
     * @param {Object} parent
     * @param {Object} node
     * @api private
     */
    function at(parent, node) {
        var iterator = -1,
            length = parent.length;

        while (++iterator < length) {
            if (node === parent[iterator]) {
                return iterator;
            }
        }

        /* istanbul ignore next: Wrong-usage */
        return -1;
    }

    /**
     * Inserts the given `appendee` after the given `item`.
     *
     * @param {Object} item
     * @param {Object} appendee
     * @api private
     */
    function insertAfter(item, appendee) {
        /* Cache the items parent and the next item. */
        var parent = item.parent,
            next = item.next,
            position;

        /* Detach the appendee. */
        appendee.remove();

        /* If item has a next node... */
        if (next) {
            /* ...link the appendees next node, to items next node. */
            appendee.next = next;

            /* ...link the next nodes previous node, to the appendee. */
            next.prev = appendee;
        }

        /* Set the appendees previous node to item. */
        appendee.prev = item;

        /* Set the appendees parent to items parent. */
        appendee.parent = parent;

        /* Set the next node of item to the appendee. */
        item.next = appendee;

        /* If the parent has no last node or if item is the parent last
         * node, link the parents last node to the appendee. */
        if (item === parent.tail || !parent.tail) {
            parent.tail = appendee;
            arrayPush.call(parent, appendee);
        /* Else, insert the appendee into the parent after the items
         * index. */
        } else {
            arraySplice.call(parent, at(parent, item) + 1, 0, appendee);
        }

        /* Return the appendee. */
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
    function insertBeforeHead(item, prependee) {
        /* Cache the items parent and the previous item. */
        var parent = item.parent;

        /* Detach the prependee. */
        prependee.remove();

        /* Set the prependees next node to item. */
        prependee.next = item;

        /* Set the prependees parent parent to items parent parent. */
        prependee.parent = parent;

        /* Set the previous node of item to the prependee. */
        item.prev = prependee;

        /* If item is the first node in the parent parent, link the
         * parents first node to the prependee. */
        parent.head = prependee;

        /* If the the parent parent has no last node, link the parents
         * last node to item. */
        if (!parent.tail) {
            parent.tail = item;
        }

        arrayUnshift.call(parent, prependee);

        /* Return the prependee. */
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
    function append(parent, item, appendee) {
        if (!parent) {
            throw new TypeError('Illegal invocation: \'' + parent +
                ' is not a valid argument for \'append\'');
        }

        if (!appendee) {
            throw new TypeError('\'' + appendee +
                ' is not a valid argument for \'append\'');
        }

        if ('hierarchy' in appendee && 'hierarchy' in parent) {
            if (parent.hierarchy + 1 !== appendee.hierarchy) {
                throw new Error('HierarchyError: The operation would ' +
                    'yield an incorrect node tree');
            }
        }

        if (typeof appendee.remove !== 'function') {
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
            if (at(parent, item) === -1) {
                throw new Error('The operated on node (the "pointer") ' +
                    'was attached to its parent, but the parent has no ' +
                    'indice corresponding to the item');
            }

            return insertAfter(item, appendee);
        }

        /* If parent has a first node... */
        /* jshint boss:true */
        if (item = parent.head) {
            return insertBeforeHead(item, appendee);
        }

        /* Prepend. There is no `head` (or `tail`) node yet. */

        /* Detach the prependee. */
        appendee.remove();

        /* Set the prependees parent to reference parent. */
        appendee.parent = parent;

        /* Set parent's first node to the prependee and return the
         * appendee. */
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
        if ((indice = at(parent, node)) !== -1) {
            arraySplice.call(parent, indice, 1);
        }

        /* Remove links from node to both the next and previous items,
         * and to the parent parent. */
        node.prev = node.next = node.parent = null;

        /* Return node. */
        return node;
    }

    /**
     * Let the given `Constructor` inherit from `Super`s prototype.
     *
     * @param {function} Constructor
     * @param {function} Super
     * @api private
     */
    function implements(Constructor, Super) {
        var prototype, key, newPrototype, constructors;

        prototype = Constructor.prototype;

        function AltConstructor () {}
        AltConstructor.prototype = Super.prototype;
        newPrototype = new AltConstructor();

        for (key in prototype) {
            newPrototype[key] = prototype[key];
        }

        for (key in Super) {
            /* istanbul ignore else */
            if (Super.hasOwnProperty(key)) {
                Constructor[key] = Super[key];
            }
        }

        newPrototype.constructor = Constructor;
        Constructor.prototype = newPrototype;
    }

    function findRoot(node) {
        var result = findAncestors(node);
        return result[result.length - 1].parent;
    }

    function findAncestors(node) {
        var result = [];

        while (node) {
            if (!node.parent) {
                return result;
            }

            result.push(node);

            node = node.parent;
        }
    }

    function findNextAncestor(node) {
        while (node) {
            if ((node = node.parent) && node.next) {
                return node.next;
            }
        }

        return null;
    }

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
        /* jshint expr:true */
        this.data || (this.data = {});
    }

    /**
     * Expose `TextOM` on every instance of Node.
     */
    Node.prototype.TextOM = TextOM;

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
        /* jshint eqnull:true */
        if (index != null && (typeof index !== 'number' || index !== index)) {
            throw new TypeError('\'' + index + ' is not a valid argument ' +
                'for \'Parent.prototype.item\'');
        }

        return this[index || 0] || null;
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

        /* jshint eqnull:true */
        if (position == null || position !== position ||
            position === -Infinity) {
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
        cloneNode = append(self.parent, self.prev, new self.constructor());

        clone = [].slice.call(self);
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
        /* jshint eqnull:true, -W093 */
        return this.internalValue = (value == null) ? '' : value.toString();
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

        /* jshint eqnull:true*/
        if (position == null || position !== position ||
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

    /**
     * Set the start container and offset of a range.
     *
     * @param {Node} startContainer - the start container to start the range
     *                                at.
     * @param {?number} offset - (integer) the start offset of the container
     *                           to start the range at;
     * @api public
     */
    prototype.setStart = function (startContainer, offset) {
        if (!startContainer) {
            throw new TypeError('\'' + startContainer + ' is not a valid ' +
                'argument for \'Range.prototype.setStart\'');
        }

        var self = this,
            endContainer = self.endContainer,
            endOffset = self.endOffset,
            offsetIsDefault = false,
            wouldBeValid = false,
            endAncestors, node;

        /* jshint eqnull:true*/
        if (offset == null || offset !== offset) {
            offset = 0;
            offsetIsDefault = true;
        } else if (typeof offset !== 'number' || offset < 0) {
            throw new TypeError('\'' + offset + ' is not a valid argument ' +
                'for \'Range.prototype.setStart\'');
        }

        if (!endContainer) {
            wouldBeValid = true;
        } else {
            if (findRoot(endContainer) !== findRoot(startContainer)) {
                throw new Error('WrongRootError: The given startContainer ' +
                    'is in the wrong document.');
            }

            /* When startContainer is also the endContainer; */
            if (endContainer === startContainer) {
                wouldBeValid = endOffset >= offset;
            } else {
                endAncestors = findAncestors(endContainer);
                node = startContainer;

                while (node) {
                    if (node === endContainer) {
                        wouldBeValid = true;
                        break;
                    }

                    if (endAncestors.indexOf(node) === -1) {
                        node = node.next || findNextAncestor(node);
                    } else {
                        node = node.head;
                    }
                }
            }
        }

        if (wouldBeValid) {
            self.startContainer = startContainer;
            self.startOffset = offset;
        } else {
            self.endContainer = startContainer;
            self.endOffset = offsetIsDefault ? Infinity : offset;
            self.startContainer = endContainer;
            self.startOffset = endOffset;
        }
    };

    /**
     * Set the end container and offset of a range.
     *
     * @param {Node} endContainer - the end container to start the range at.
     * @param {?number} offset - (integer) the end offset of the container to
     *                           end the range at;
     * @api public
     */
    prototype.setEnd = function (endContainer, offset) {
        if (!endContainer) {
            throw new TypeError('\'' + endContainer + ' is not a valid ' +
                'argument for \'Range.prototype.setEnd\'');
        }

        var self = this,
            startContainer = self.startContainer,
            startOffset = self.startOffset,
            offsetIsDefault = false,
            wouldBeValid = false,
            endAncestors, node;

        /* jshint eqnull:true*/
        if (offset == null || offset !== offset) {
            offset = Infinity;
            offsetIsDefault = true;
        } else if (typeof offset !== 'number' || offset < 0) {
            throw new TypeError('\'' + offset + ' is not a valid argument ' +
                'for \'Range.prototype.setEnd\'');
        }

        if (!startContainer) {
            wouldBeValid = true;
        } else {
            if (findRoot(startContainer) !== findRoot(endContainer)) {
                throw new Error('WrongRootError: The given endContainer ' +
                    'is in the wrong document.');
            }

            /* When endContainer is also the startContainer; */
            if (startContainer === endContainer) {
                wouldBeValid = startOffset <= offset;
            } else {
                endAncestors = findAncestors(endContainer);
                node = startContainer;

                while (node) {
                    if (node === endContainer) {
                        wouldBeValid = true;
                        break;
                    }

                    if (endAncestors.indexOf(node) === -1) {
                        node = node.next || findNextAncestor(node);
                    } else {
                        node = node.head;
                    }
                }
            }
        }

        if (wouldBeValid) {
            self.endContainer = endContainer;
            self.endOffset = offset;
        } else {
            self.startContainer = endContainer;
            self.startOffset = offsetIsDefault ? 0 : offset;
            self.endContainer = startContainer;
            self.endOffset = startOffset;
        }
    };

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
        var content = this.getContent(),
            startOffset = this.startOffset,
            endOffset = this.endOffset,
            startContainer = this.startContainer,
            endContainer = this.endContainer,
            startIsText, index;

        if (content.length === 0) {
            return '';
        }

        startIsText = !('length' in startContainer);

        if (startContainer === endContainer && startIsText) {
            return startContainer.toString().slice(startOffset, endOffset);
        }

        if (startIsText) {
            content[0] = content[0].toString().slice(startOffset);
        }

        if (!('length' in endContainer)) {
            index = content.length - 1;
            content[index] = content[index].toString().slice(0, endOffset);
        }

        return content.join('');
    };

    /**
     * Return the nodes in a range as an array. If a nodes parent is
     * completely encapsulated by the range, returns that parent. Ignores
     * startOffset (i.e., treats as `0`) when startContainer is a text node.
     * Ignores endOffset (i.e., treats as `Infinity`) when endContainer is a
     * text node.
     *
     * @return {Node|Node[]} content - The nodes completely encapsulated by
     *                                 the range.
     * @api public
     */
    prototype.getContent = function () {
        var content = [],
            self = this,
            startContainer = self.startContainer,
            startOffset = self.startOffset,
            endContainer = self.endContainer,
            endOffset = self.endOffset,
            endAncestors, node;

        /*
         * Return an empty array when either:
         * - startContainer or endContainer are not set;
         * - startContainer or endContainer are not attached;
         * - startContainer does not share a root with endContainer.
         */
        if (!startContainer || !endContainer || !startContainer.parent ||
            !endContainer.parent || findRoot(startContainer) !==
            findRoot(endContainer)) {
                return content;
        }

        /* If startContainer equals endContainer... */
        if (startContainer === endContainer) {
            /* Return an array containg startContainer when startContainer
             * either:
             * - does not accept children;
             * - starts and ends so range contains all its children.
             */
            if (!('length' in startContainer) ||
                (startOffset === 0 && endOffset >= startContainer.length)) {
                    return [startContainer];
            }

            /* Return an array containg the children of startContainer between
             * startOffset and endOffset. */
            return arraySlice.call(startContainer, startOffset, endOffset);
        }

        /* If startOffset isnt `0` and startContainer accepts children... */
        if (startOffset && ('length' in startContainer)) {
            /* If a child exists at startOffset, let startContainer be that
             * child. */
            if (startOffset in startContainer) {
                startContainer = startContainer[startOffset];
            /* Otherwise, let startContainer be a following node of
             * startContainer. */
            } else {
                startContainer = startContainer.next || findNextAncestor(
                    startContainer
                );
            }
        }

        /* If the whole endNode is in the range... */
        if (endOffset >= endContainer.length) {
            /* While endContainer is the last child of its parent... */
            while (endContainer.parent.tail === endContainer) {
                /* Let endContainer be its parent. */
                endContainer = endContainer.parent;

                /* Break when the new endContainer has no parent. */
                if (!endContainer.parent) {
                    break;
                }
            }
        }

        /* Find all ancestors of endContainer. */
        endAncestors = findAncestors(endContainer);

        /* While node is truthy... */
        node = startContainer;

        while (node) {
            /* If node equals endContainer... */
            if (node === endContainer) {
                /* Add endContainer to content, if either:
                 * - endContainer does not accept children;
                 * - ends so range contains all its children.
                 */
                if (!('length' in endContainer) ||
                    endOffset >= endContainer.length) {
                        content.push(node);
                /* Add the children of endContainer to content from its start
                 * untill its endOffset. */
                } else {
                    content = content.concat(
                        arraySlice.call(endContainer, 0, endOffset)
                    );
                }

                /* Stop iterating. */
                break;
            }

            /* If node is not an ancestor of endContainer... */
            if (endAncestors.indexOf(node) === -1) {
                /* Add node to content */
                content.push(node);

                /* Let the next node to iterate over be either its next
                 * sibling, or a following ancestor. */
                node = node.next || findNextAncestor(node);
            /* Otherwise, let the next node to iterate over be either its
             * first child, its next sibling, or a following ancestor. */
            } else {
                /* Note that a `head` always exists on a parent of
                 * `endContainer`, thus we do not check for `next`, or a next
                 * ancestor. */
                node = node.head;
            }
        }

        /* Return content. */
        return content;
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
    exports.ROOT_NODE = NodeProtype.ROOT_NODE =
        RootNode.prototype.type;
    exports.PARAGRAPH_NODE = NodeProtype.PARAGRAPH_NODE =
        ParagraphNode.prototype.type;
    exports.SENTENCE_NODE = NodeProtype.SENTENCE_NODE =
        SentenceNode.prototype.type;
    exports.WORD_NODE = NodeProtype.WORD_NODE = WordNode.prototype.type;
    exports.PUNCTUATION_NODE = NodeProtype.PUNCTUATION_NODE =
        PunctuationNode.prototype.type;
    exports.WHITE_SPACE_NODE = NodeProtype.WHITE_SPACE_NODE =
        WhiteSpaceNode.prototype.type;

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

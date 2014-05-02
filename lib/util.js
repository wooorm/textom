var _arrayPrototype = Array.prototype,
    _arrayUnshift = _arrayPrototype.unshift,
    _arrayPush = _arrayPrototype.push,
    // _arraySlice = _arrayPrototype.slice,
    _arraySplice = _arrayPrototype.splice;


/* == PRIVATE METHODS ====================================================== */

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
 * Inserts the given `prependee` before the given `item` (which should always 
 * be its parents head).
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

    // If item is the first node in the parent parent, link the parents first 
    // node to the prependee.
    parent.head = prependee;

    // If the the parent parent has no last node, link the parents last node to 
    // item.
    if (!parent.tail) {
        parent.tail = item;
    }

    _arrayUnshift.call(parent, prependee);

    // Return the prependee.
    return prependee;
}

/**
 * Inserts the given `appendee` after (when given), the `item`, and otherwise 
 * as the first item of the given parents.
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

    // Set parent's first node to the prependee and return the appendee.
    parent.head = appendee;
    parent[0] = appendee;
    parent.length = 1;

    return appendee;
}

/**
 * Detach a node from its (when applicable) parent, links its (when existing) 
 * previous and next items to eachother.
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

    // If node is the last item in the parent, link the parents last item 
    // to the previous item.
    if (parent.tail === node) {
        parent.tail = prev;
    }

    // If node is the first item in the parent, link the parents first item 
    // to the next item.
    if (parent.head === node) {
        parent.head = next;
    }

    // If both the last and first items in the parent are the same, remove 
    // the link to the last item.
    if (parent.tail === parent.head) {
        parent.tail = null;
    }

    // If a previous item exists, link its next item to nodes next item.
    if (prev) {
        prev.next = next;
    }

    // If a next item exists, link its previous item to nodes previous item.
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


exports.RANGE_BREAK = RANGE_BREAK;
exports.RANGE_CONTINUE = RANGE_CONTINUE;
exports.implements = _implements;
exports.append = _append;
exports.remove = _remove;
exports.findRoot = _findRoot;
exports.walkUpwards = _walkUpwards;
exports.walkBackwards = _walkBackwards;
exports.walkForwards = _walkForwards;
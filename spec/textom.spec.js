
var TextOM = require('..'),
    assert = require('assert');

/* istanbul ignore next: noop */
function noop() {}

/* istanbul ignore next: noop */
function altNoop() {}

describe('TextOM', function () {

    it('should have a `ROOT_NODE` property, equal to the `type` property on an instance of `RootNode`', function () {
        assert(TextOM.ROOT_NODE === (new TextOM.RootNode()).type);
    });

    it('should have a `PARAGRAPH_NODE` property, equal to the `type` property on an instance of `ParagraphNode`', function () {
        assert(TextOM.PARAGRAPH_NODE === (new TextOM.ParagraphNode()).type);
    });

    it('should have a `SENTENCE_NODE` property, equal to the `type` property on an instance of `SentenceNode`', function () {
        assert(TextOM.SENTENCE_NODE === (new TextOM.SentenceNode()).type);
    });

    it('should have a `WORD_NODE` property, equal to the `type` property on an instance of `WordNode`', function () {
        assert(TextOM.WORD_NODE === (new TextOM.WordNode()).type);
    });

    it('should have a `PUNCTUATION_NODE` property, equal to the `type` property on an instance of `PunctuationNode`', function () {
        assert(TextOM.PUNCTUATION_NODE === (new TextOM.PunctuationNode()).type);
    });

    it('should have a `WHITE_SPACE_NODE` property, equal to the `type` property on an instance of `WhiteSpaceNode`', function () {
        assert(TextOM.WHITE_SPACE_NODE === (new TextOM.WhiteSpaceNode()).type);
    });

    it('should return a newly initialized `RootNode` object when invoked', function () {
        assert(new TextOM() instanceof TextOM.RootNode);
        assert(TextOM() instanceof TextOM.RootNode);
    });

});

var Node = TextOM.Node,
    nodePrototype = Node.prototype;

describe('TextOM.Node', function () {
    it('should be of type `function`', function () {
        assert(typeof Node === 'function');
    });

    it('should set a `data` property on the newly constructed instance, which should be an object', function () {
        var node = new Node();
        assert(node.hasOwnProperty('data'));
        assert('[object Object]' === Object.prototype.toString.call(node.data));
    });
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
    it('should be equal to the `type` property on an instance of `RootNode`', function () {
        assert(nodePrototype.ROOT_NODE === (new TextOM.RootNode()).type);
    });
});

describe('TextOM.Node#PARAGRAPH_NODE', function () {
    it('should be equal to the `type` property on an instance of `ParagraphNode`', function () {
        assert(nodePrototype.PARAGRAPH_NODE === (new TextOM.ParagraphNode()).type);
    });
});

describe('TextOM.Node#SENTENCE_NODE', function () {
    it('should be equal to the `type` property on an instance of `SentenceNode`', function () {
        assert(nodePrototype.SENTENCE_NODE === (new TextOM.SentenceNode()).type);
    });
});

describe('TextOM.Node#WORD_NODE', function () {
    it('should be equal to the `type` property on an instance of `WordNode`', function () {
        assert(nodePrototype.WORD_NODE === (new TextOM.WordNode()).type);
    });
});

describe('TextOM.Node#PUNCTUATION_NODE', function () {
    it('should be equal to the `type` property on an instance of `PunctuationNode`', function () {
        assert(nodePrototype.PUNCTUATION_NODE === (new TextOM.PunctuationNode()).type);
    });
});

describe('TextOM.Node#WHITE_SPACE_NODE', function () {
    it('should be equal to the `type` property on an instance of `WhiteSpaceNode`', function () {
        assert(nodePrototype.WHITE_SPACE_NODE === (new TextOM.WhiteSpaceNode()).type);
    });
});

describe('TextOM.Node#on(name?, callback)', function () {
    it('should be of type `function`', function () {
        assert(typeof nodePrototype.on === 'function');
    });

    it('should NOT throw, when no arguments are given, but return the current contex', function () {
        assert.doesNotThrow(function () { (new Node()).on(); });
        var node = new Node();
        assert(node.on() === node);
    });

    it('should set a `callbacks` attribute on the instance, when a callback is given', function () {
        var node = new Node();
        assert(!('callbacks' in node));
        node.on(noop);
        assert('callbacks' in node);
    });

    it('should add the callback, when a callback without type is given', function () {
        var node = new Node();
        assert(!('callbacks' in node));
        node.on(noop);
        assert('callbacks' in node);
        assert('*' in node.callbacks);
        assert(node.callbacks['*'][0] === noop);
    });

    it('should add the callback, when a callback with type is given', function () {
        var node = new Node();
        assert(!('callbacks' in node));
        node.on('test', noop);
        assert('callbacks' in node);
        assert('test' in node.callbacks);
        assert(node.callbacks.test[0] === noop);
    });
});

describe('TextOM.Node#off(name?, callback?)', function () {
    it('should be of type `function`', function () {
        assert(typeof nodePrototype.off === 'function');
    });

    it('should NOT throw, when no arguments are given, but return the current contex', function () {
        assert.doesNotThrow(function () { (new Node()).off(); });
        var node = new Node();
        assert(node.off() === node);
    });

    it('should NOT throw, when listeners to the given type do not exist, but return the current contex', function () {
        var node = new Node();
        node.on(noop);
        assert.doesNotThrow(function () {
            assert(node.off('test') === node);
        });

        node = new Node();
        node.on('test', noop);
        assert.doesNotThrow(function () {
            assert(node.off('test', altNoop) === node);
        });
    });

    it('should remove a callback, when a callback is given', function () {
        var node = new Node();
        node.on(noop);
        assert(node.callbacks['*'][0] === noop);
        node.off(noop);
        assert(node.callbacks['*'].length === 0);
    });

    it('should remove the callback, when a callback without type is given', function () {
        var node = new Node();
        node.on(noop);
        assert(node.callbacks['*'][0] === noop);
        node.off(noop);
        assert(node.callbacks['*'].length === 0);
    });

    it('should remove the callback, when a callback with type is given', function () {
        var node = new Node();
        node.on('test', noop);
        assert(node.callbacks.test[0] === noop);
        node.off('test', noop);
        assert(node.callbacks.test.length === 0);
    });

    it('should remove all callbacks of the given type, when only a type is given', function () {
        var node = new Node();
        node.on('test', noop);
        node.on('test', noop);
        assert(node.callbacks.test[0] === noop);
        assert(node.callbacks.test[1] === noop);
        node.off('test');
        assert(node.callbacks.test.length === 0);
    });

    it('should remove all callbacks added without a type argument, when nothing is given', function () {
        var node = new Node();
        node.on('test', noop);
        node.on(noop);
        node.off();
        assert(node.callbacks.test.length === 1);
        assert(node.callbacks['*'].length === 0);
    });
});

var Parent = TextOM.Parent,
    parentPrototype = Parent.prototype;

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

    it('should be the first child when one or more children exist', function () {
        var parent = new Parent();
        parent.append(new TextOM.Child());
        assert(parent.head === parent[0]);
        parent.prepend(new TextOM.Child());
        assert(parent.head === parent[0]);
    });
});

describe('TextOM.Parent#tail', function () {
    it('should be `null` when no child exist', function () {
        assert(parentPrototype.tail === null);
        assert((new Parent()).tail === null);
    });

    it('should be `null` when one (1) child exist', function () {
        var parent = new Parent();
        parent.append(new TextOM.Child());
        assert(parent.tail === null);
    });

    it('should be the last child when two or more children exist', function () {
        var parent = new Parent();
        parent.append(new TextOM.Child());
        parent.prepend(new TextOM.Child());
        assert(parent.tail === parent[1]);
        parent.append(new TextOM.Child());
        assert(parent.tail === parent[2]);
    });
});

describe('TextOM.Parent#length', function () {
    it('should be `0` when no children exist', function () {
        assert(parentPrototype.length === 0);
        assert((new Parent()).length === 0);
    });

    it('should be the number of children when one or more children exist', function () {
        var parent = new Parent();
        parent.append(new TextOM.Child());
        assert(parent.length === 1);
        parent.prepend(new TextOM.Child());
        assert(parent.length === 2);
        parent.append(new TextOM.Child());
        assert(parent.length === 3);
    });
});

describe('TextOM.Parent#prepend(childNode)', function () {
    it('should throw when falsey values are provided', function () {
        var parent = new Parent();
        assert.throws(function () { parent.prepend(); }, /undefined/);
        assert.throws(function () { parent.prepend(null); }, /null/);
        assert.throws(function () { parent.prepend(undefined); }, /undefined/);
        assert.throws(function () { parent.prepend(false); }, /false/);
    });

    it('should throw when non-removable nodes are prepended (e.g., not inheriting from TextOM.Child)', function () {
        var parent = new Parent();
        assert.throws(function () { parent.prepend(new Node()); }, /remove/);
        assert.throws(function () { parent.prepend({}); }, /remove/);
    });

    it('should call the `remove` method on the prependee', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            nodeRemove = node.remove,
            isCalled = false;

        node.remove = function () {
            isCalled = true;
            nodeRemove.apply(this, arguments);
        };

        parent.prepend(node);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the prependee to the operated on parent', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child();

        parent.prepend(node);
        assert(node.parent === parent);

        parent.prepend(node_);
        assert(node_.parent === parent);
    });

    it('should set the `head` and `0` properties to the prepended node', function () {
        var parent = new Parent(),
            node = new TextOM.Child();

        parent.prepend(node);
        assert(parent.head === node);
        assert(parent[0] === node);
    });

    it('should set the `tail` and `1` properties to the previous `head`, when no `tail` exists', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child();

        parent.prepend(node);
        parent.prepend(node_);
        assert(parent.tail === node);
        assert(parent[1] === node);
    });

    it('should set the `head` and `0` properties to further prepended nodes', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child(),
            node__ = new TextOM.Child();

        parent.prepend(node);
        parent.prepend(node_);
        assert(parent.head === node_);
        assert(parent[0] === node_);
        parent.prepend(node__);
        assert(parent.head === node__);
        assert(parent[0] === node__);
    });

    it('should set the `next` property on the prependee to the parents previous `head`', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child();

        parent.prepend(node);
        assert(node.next === null);

        parent.prepend(node_);
        assert(node_.next === node);
    });

    it('should set the `prev` property on the parents previous `head` to the prependee', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child();

        parent.prepend(node);

        parent.prepend(node_);
        assert(node.prev === node_);
    });

    it('should update the `length` property to correspond to the number of prepended children', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child(),
            node__ = new TextOM.Child();

        assert(parent.length === 0);

        parent.prepend(node);
        assert(parent.length === 1);

        parent.prepend(node_);
        assert(parent.length === 2);

        parent.prepend(node__);
        assert(parent.length === 3);
    });

    it('should shift the indices of all children', function () {
        var parent = new Parent(),
            child = new TextOM.Child(),
            child_ = new TextOM.Child(),
            child__ = new TextOM.Child(),
            child___ = new TextOM.Child();

        parent.prepend(child);
        parent.prepend(child_);

        parent.prepend(child__);
        assert(parent[0] === child__);
        assert(parent[1] === child_);
        assert(parent[2] === child);

        parent.prepend(child___);
        assert(parent[0] === child___);
        assert(parent[1] === child__);
        assert(parent[2] === child_);
        assert(parent[3] === child);
    });

    it('should return the prepended child', function () {
        var parent = new Parent(),
            node = new TextOM.Child();

        assert(node === parent.prepend(node));
    });
});

describe('TextOM.Parent#append(childNode)', function () {
    it('should throw when falsey values are provided', function () {
        var parent = new Parent();
        assert.throws(function () { parent.append(); }, /undefined/);
        assert.throws(function () { parent.append(null); }, /null/);
        assert.throws(function () { parent.append(undefined); }, /undefined/);
        assert.throws(function () { parent.append(false); }, /false/);
    });

    it('should throw when non-removable nodes are appended (e.g., not inheriting from TextOM.Child)', function () {
        var parent = new Parent();
        assert.throws(function () { parent.append(new Node()); }, /remove/);
        assert.throws(function () { parent.append({}); }, /remove/);
    });

    it('should call the `remove` method on the appendee', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            nodeRemove = node.remove,
            isCalled = false;

        node.remove = function () {
            isCalled = true;
            nodeRemove.apply(this, arguments);
        };

        parent.append(node);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the appendee to the operated on parent', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child();

        parent.append(node);
        assert(node.parent === parent);

        parent.append(node_);
        assert(node_.parent === parent);
    });

    it('should set the `head` and `0` properties to the appended node, when no `head` exists', function () {
        var parent = new Parent(),
            node = new TextOM.Child();

        parent.append(node);
        assert(parent.head === node);
        assert(parent[0] === node);
    });

    it('should set the `tail` and `1` properties to the appended node, when no `tail` exists', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child();

        parent.append(node);
        parent.append(node_);
        assert(parent.tail === node_);
        assert(parent[1] === node_);
    });

    it('should set the `tail`, and `length - 1`, properties to further appended nodes', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child(),
            node__ = new TextOM.Child();

        parent.append(node);
        parent.append(node_);
        assert(parent.tail === node_);
        assert(parent[1] === node_);
        parent.append(node__);
        assert(parent.tail === node__);
        assert(parent[2] === node__);
    });

    it('should set the `prev` property on the appendee to the parents previous `tail` (or `head`, when no `tail` exists)', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child(),
            node__ = new TextOM.Child();

        parent.append(node);
        assert(node.prev === null);

        parent.append(node_);
        assert(node_.prev === node);

        parent.append(node__);
        assert(node__.prev === node_);
    });

    it('should set the `next` property on the parents previous `tail` (or `head`, when no `tail` exists) to the appendee', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child(),
            node__ = new TextOM.Child();

        parent.append(node);

        parent.append(node_);
        assert(node.next === node_);

        parent.append(node__);
        assert(node_.next === node__);
    });

    it('should update the `length` property to correspond to the number of appended children', function () {
        var parent = new Parent(),
            node = new TextOM.Child(),
            node_ = new TextOM.Child(),
            node__ = new TextOM.Child();

        assert(parent.length === 0);

        parent.append(node);
        assert(parent.length === 1);

        parent.append(node_);
        assert(parent.length === 2);

        parent.append(node__);
        assert(parent.length === 3);
    });

    it('should return the appended child', function () {
        var parent = new Parent(),
            node = new TextOM.Child();

        assert(node === parent.append(node));
    });
});

describe('TextOM.Parent#item(index?)', function () {
    it('should throw on non-nully, non-number (including NaN) values', function () {
        var parent = new Parent();
        assert.throws(function () { parent.item('string'); }, /string/);
        assert.throws(function () { parent.item(0/0); }, /NaN/);
        assert.throws(function () { parent.item(true); }, /true/);
    });

    it('should return the first child when the given index is either null, undefined, or not given', function () {
        var parent = new Parent();
        parent[0] = new Node();
        assert(parent.item(null) === parent[0]);
        assert(parent.item(undefined) === parent[0]);
        assert(parent.item() === parent[0]);
    });

    it('should return a child at a given index when available, and null otherwise', function () {
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

    it('should throw when the operated on item is not attached', function () {
        var parent = new Parent();

        assert.throws(function () { parent.split(); }, /undefined/);
    });

    it('should throw when a position was given, not of type number', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        assert.throws(function () { element.split('failure'); }, /failure/);
    });

    it('should return a new instance() of the operated on item', function () {
        var parent = new Parent(),
            element = parent.append(new Element(''));

        assert(element.split() instanceof element.constructor);
    });

    it('should treat a given negative position, as an position from the end (e.g., when the internal value of element is `alfred`, treat `-1` as `5`)', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(-1);

        assert(element.toString() === 'bertrand');
        assert(element.prev.toString() === 'alfred');
    });

    it('should NOT throw when NaN, or -Infinity are given (but treat it as `0`)', function () {
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

    it('should NOT throw when Infinity is given (but treat it as `this.length`)', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(Infinity);

        assert(element.toString() === '');
        assert(element.prev.toString() === 'alfredbertrand');
    });

    it('should NOT throw when a position greater than the length of the element is given (but treat it as `this.length`)', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(3);

        assert(element.toString() === '');
        assert(element.prev.toString() === 'alfredbertrand');
    });

    it('should NOT throw when a nully position is given, but treat it as `0`', function () {
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

    it('should remove the children of the current items value, from `0` to the given position', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.append(new Text('alfred'));
        element.append(new Text('bertrand'));

        element.split(1);

        assert(element.toString() === 'bertrand');
    });

    it('should prepend a new instance() of the operated on item', function () {
        var parent = new Parent(),
            element = parent.append(new Element());

        element.split();

        assert(element.prev instanceof element.constructor);
    });

    it('should move the part of the current items value, from `0` to the given position, to prepended item', function () {
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

    it('should return an empty string when no children are present', function () {
        assert((new Parent()).toString() === '');
    });

    it('should return the concatenation of its childrens `toString` methods', function () {
        var node = new Parent(),
            head = node.head = new Node(),
            tail = node.tail = new Node();

        head.next = tail;

        head.toString = function () { return 'a '; };
        tail.toString = function () { return 'value'; };

        assert(node.toString() === 'a value');
    });
});

var Child = TextOM.Child,
    childPrototype = Child.prototype;

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
            child = new TextOM.Child();

        parent.append(child);

        assert(child.parent === parent);
    });
});

describe('TextOM.Child#prev', function () {
    it('should be `null` when not attached', function () {
        assert(childPrototype.prev === null);
        assert((new Child()).prev === null);
    });

    it('should be `null` when attached, but no previous sibling exist', function () {
        var parent = new Parent(),
            child = new Child();

        parent.append(child);

        assert(child.prev === null);
    });

    it('should be the previous sibling when it exists', function () {
        var parent = new Parent(),
            previousSibling = new TextOM.Child(),
            nextSibling = new TextOM.Child();

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

    it('should be `null` when attached, but no next sibling exist', function () {
        var parent = new Parent(),
            child = new Child();

        parent.append(child);

        assert(child.next === null);
    });

    it('should be the next sibling when it exists', function () {
        var parent = new Parent(),
            previousSibling = new TextOM.Child(),
            nextSibling = new TextOM.Child();

        parent.append(previousSibling);
        parent.append(nextSibling);

        assert(previousSibling.next === nextSibling);
    });
});

describe('TextOM.Child#before(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () { (new Child()).before(new Child()); }, /Illegal invocation/);
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.before(); }, /undefined/);
        assert.throws(function () { child.before(null); }, /null/);
        assert.throws(function () { child.before(undefined); }, /undefined/);
        assert.throws(function () { child.before(false); }, /false/);
    });

    it('should throw when non-removable nodes are prepended (e.g., not inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.before(new Node()); }, /remove/);
        assert.throws(function () { child.before({}); }, /remove/);
    });

    it('should call the `remove` method on the prependee', function () {
        var child = (new Parent()).append(new Child()),
            child_ = new TextOM.Child(),
            childRemove = child_.remove,
            isCalled = false;

        child_.remove = function () {
            isCalled = true;
            childRemove.apply(this, arguments);
        };

        child.before(child_);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the prependee to the operated on nodes\' parent', function () {
        var child = (new Parent()).append(new Child()),
            child_ = new Child();

        child.before(child_);

        assert(child.parent === child_.parent);
    });

    it('should set the parents `head` and `0` properties to the prepended node, when the operated on node is its parents `head`', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);
        child.before(child_);
        assert(parent.head === child_);
        assert(parent[0] === child_);
    });

    it('should set the parents `tail` and `1` properties to the operated on node, when no `tail` exists', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);

        child.before(child_);
        assert(parent.tail === child);
        assert(parent[1] === child);
    });

    it('should set the `prev` property to the operated on nodes\' `prev` property', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);

        child.before(child_);
        assert(child_.prev === null);

        child.before(child__);
        assert(child__.prev === child_);
    });

    it('should set the `next` property to the operated on node', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);

        child.before(child_);
        assert(child_.next === child);

        child.before(child__);
        assert(child__.next === child);
    });

    it('should update the parents `length` property to correspond to the number of prepended children', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);

        child.before(child_);
        assert(parent.length === 2);

        child.before(child__);
        assert(parent.length === 3);
    });

    it('should shift the indices of the operated on item, and its next siblings', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child(),
            child___ = new Child();

        parent.append(child);
        parent.prepend(child_);

        child_.before(child__);
        assert(parent[0] === child__);
        assert(parent[1] === child_);
        assert(parent[2] === child);

        child__.before(child___);
        assert(parent[0] === child___);
        assert(parent[1] === child__);
        assert(parent[2] === child_);
        assert(parent[3] === child);
    });

    it('should return the prepended child', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);

        assert(child_ === child.before(child_));
    });
});

describe('TextOM.Child#after(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () { (new Child()).after(new Child()); }, /Illegal invocation/);
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.after(); }, /undefined/);
        assert.throws(function () { child.after(null); }, /null/);
        assert.throws(function () { child.after(undefined); }, /undefined/);
        assert.throws(function () { child.after(false); }, /false/);
    });

    it('should throw when non-removable nodes are appended (e.g., not inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.after(new Node()); }, /remove/);
        assert.throws(function () { child.after({}); }, /remove/);
    });

    it('should call the `remove` method on the appendee', function () {
        var child = (new Parent()).append(new Child()),
            child_ = new TextOM.Child(),
            childRemove = child_.remove,
            isCalled = false;

        child_.remove = function () {
            isCalled = true;
            childRemove.apply(this, arguments);
        };

        child.after(child_);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the appendee to the operated on nodes\' parent', function () {
        var child = (new Parent()).append(new Child()),
            child_ = new Child();

        child.after(child_);

        assert(child.parent === child_.parent);
    });

    it('should set the parents `tail` and `1` properties to the appendee, when no `tail` exists', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);
        child.after(child_);
        assert(parent.tail === child_);
        assert(parent[1] === child_);
    });

    it('should set the parents `tail` and `1` properties to the appendee, when the operated on item is the parents `tail`', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);
        parent.append(child_);
        child_.after(child__);

        assert(parent.tail === child__);
        assert(parent[2] === child__);
    });

    it('should set the `next` property to the operated on nodes\' `next` property', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);

        child.after(child_);
        assert(child_.next === null);

        child.after(child__);
        assert(child__.next === child_);
    });

    it('should set the `prev` property to the operated on node', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);

        child.after(child_);
        assert(child_.prev === child);

        child.after(child__);
        assert(child__.prev === child);
    });

    it('should update the parents `length` property to correspond to the number of appended children', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);

        child.after(child_);
        assert(parent.length === 2);

        child.after(child__);
        assert(parent.length === 3);
    });

    it('should shift the indices of the operated on items next siblings', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child(),
            child___ = new Child();

        parent.append(child);
        parent.append(child_);

        child.after(child__);
        assert(parent[0] === child);
        assert(parent[1] === child__);
        assert(parent[2] === child_);

        child.after(child___);
        assert(parent[0] === child);
        assert(parent[1] === child___);
        assert(parent[2] === child__);
        assert(parent[3] === child_);
    });

    it('should return the appended child', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);

        assert(child_ === child.after(child_));
    });
});

describe('TextOM.Child#remove()', function () {
    it('should NOT throw when the operated on item is not attached', function () {
        assert.doesNotThrow(function () { (new Child()).remove(); });
    });

    it('should set the `parent` property on the operated on node to `null`', function () {
        var child = (new Parent()).append(new Child());

        child.remove();

        assert(child.parent === null);
    });

    it('should set the `prev` property on the operated on node to `null`', function () {
        var child = (new Parent()).append(new Child()),
            child_ = child.before(new Child());

        child.remove();

        assert(child.prev === null);
    });

    it('should set the `next` property on the operated on node to `null`', function () {
        var child = (new Parent()).append(new Child()),
            child_ = child.after(new Child());

        child.remove();

        assert(child.next === null);
    });

    it('should set the parents `head` property to the next sibling, when the operated on item has no previous sibling', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);
        parent.append(child_);
        parent.append(child__);

        child.remove();

        assert(parent.head === child_);

        child_.remove();
        assert(parent.head === child__);
    });

    it('should set the parents `tail` property to the previous sibling, when the operated on item has no next sibling', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);
        parent.append(child_);
        parent.append(child__);

        child__.remove();
        assert(parent.tail === child_);
    });

    it('should set the parents `tail` property to `null` when the operated on item is the current `tail`, and the current `head` is its previous sibling', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);
        parent.append(child_);

        child_.remove();
        assert(parent.tail === null);
    });

    it('should set the parents `head` property to `null` when the operated on item is the current `head`, and no `tail` exists', function () {
        var parent = new Parent(),
            child = new Child();

        parent.append(child);
        child.remove();

        assert(parent.head === null);
    });

    it('should decreese the parents `length` property by one (1), to correspond to the removed child', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);
        parent.append(child_);
        parent.append(child__);

        child.remove();
        assert(parent.length === 2);

        child_.remove();
        assert(parent.length === 1);

        child__.remove();
        assert(parent.length === 0);
    });

    it('should unshift the indices of the operated on items next siblings', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child(),
            child___ = new Child();

        parent.append(child);
        parent.append(child_);
        parent.append(child__);
        parent.append(child___);

        child.remove();
        assert(parent[0] === child_);
        assert(parent[1] === child__);
        assert(parent[2] === child___);

        child_.remove();
        assert(parent[0] === child__);
        assert(parent[1] === child___);

        child__.remove();
        assert(parent[0] === child___);
    });

    it('should return the removed child', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        assert(child === child.remove());

        parent.append(child);
        assert(child === child.remove());
    });
});

describe('TextOM.Child#replace(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () { (new Child()).replace(new Child()); }, /Illegal invocation/);
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.replace(); }, /undefined/);
        assert.throws(function () { child.replace(null); }, /null/);
        assert.throws(function () { child.replace(undefined); }, /undefined/);
        assert.throws(function () { child.replace(false); }, /false/);
    });

    it('should throw when non-removable nodes are given (e.g., not inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.replace(new Node()); }, /remove/);
        assert.throws(function () { child.replace({}); }, /remove/);
    });

    it('should call the `remove` method on the replacee', function () {
        var child = (new Parent()).append(new Child()),
            child_ = new TextOM.Child(),
            childRemove = child_.remove,
            isCalled = false;

        child_.remove = function () {
            isCalled = true;
            childRemove.apply(this, arguments);
        };

        child.replace(child_);
        assert(isCalled === true);
    });

    it('should set the `parent` property on the replacee to the operated on nodes\' parent', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);
        child.replace(child_);

        assert(parent === child_.parent);
    });

    it('should set the `parent` property on the operated on node to `null`', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);
        child.replace(child_);

        assert(child.parent === null);
    });

    it('should set the parents `head` properties to the replacee, when the operated on item is the current head', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);
        child.replace(child_);

        assert(parent.head === child_);
    });

    it('should set the parents `tail` property to the replacee, when the operated on item is the current tail', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);
        parent.append(child_);
        child_.replace(child__);

        assert(parent.tail === child__);
    });

    it('should set the `next` property to the operated on nodes\' `next` property', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);
        parent.append(child_);
        child.replace(child__);

        assert(child__.next === child_);
    });

    it('should set the `prev` property to the operated on nodes\' `prev` property', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);
        parent.append(child_);
        child_.replace(child__);

        assert(child__.prev === child);
    });

    it('should NOT update the parents `length` property', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child();

        parent.append(child);
        child.replace(child_);
        assert(parent.length === 1);

        parent.prepend(child);
        child.replace(child__);
        assert(parent.length === 2);
    });

    it('should NOT shift the indices of the operated on items siblings', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child(),
            child__ = new Child(),
            child___ = new Child();

        parent.append(child);
        parent.append(child_);
        parent.append(child__);
        assert(parent[0] === child);
        assert(parent[1] === child_);
        assert(parent[2] === child__);

        child.replace(child___);
        assert(parent[0] === child___);
        assert(parent[1] === child_);
        assert(parent[2] === child__);

        child__.replace(child);
        assert(parent[0] === child___);
        assert(parent[1] === child_);
        assert(parent[2] === child);

        child_.replace(child__);
        assert(parent[0] === child___);
        assert(parent[1] === child__);
        assert(parent[2] === child);
    });

    it('should return the replacee', function () {
        var parent = new Parent(),
            child = new Child(),
            child_ = new Child();

        parent.append(child);

        assert(child_ === child.replace(child_));
    });
});

var Element = TextOM.Element,
    elementPrototype = Element.prototype;

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
        var element = new Element();
        Object.keys(childPrototype).forEach(function (key) {
            if (typeof childPrototype[key] === 'function') {
                assert(key in element);
            } else {
                assert(element[key] === childPrototype[key]);
            }
        });
    });

    it('should inherit from `Parent`', function () {
        var element = new Element();
        Object.keys(parentPrototype).forEach(function (key) {
            if (typeof parentPrototype[key] === 'function') {
                assert(key in element);
            } else {
                assert(element[key] === parentPrototype[key]);
            }
        });
    });
});

var Text = TextOM.Text,
    textPrototype = Text.prototype;

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

    it('should (re)set an empty string (`""`) when a nully value is given', function () {
        var box = new Text('alfred');

        assert(box.fromString() === '');

        box.fromString('alfred');
        assert(box.fromString(null) === '');

        box.fromString('alfred');
        assert(box.fromString(undefined) === '');
    });

    it('should return the set value otherwise', function () {
        var box = new Text();

        assert(box.fromString('alfred') === 'alfred');
        /*jshint -W053 */
        assert(box.fromString(new String('alfred')) === 'alfred');
    });
});

describe('TextOM.Text#split(position)', function () {

    it('should throw when the operated on item is not attached', function () {
        var box = new Text('alfred');

        assert.throws(function () { box.split(); }, /Illegal invocation/);
    });

    it('should throw when a position was given, not of type number', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        assert.throws(function () { box.split('failure'); }, /failure/);
    });

    it('should return a new instance() of the operated on item', function () {
        var parent = new Parent(),
            box = parent.append(new Text(''));

        assert(box.split() instanceof box.constructor);
    });

    it('should treat a given negative position, as an position from the end (e.g., when the internal value of box is `alfred`, treat `-1` as `5`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(-1);

        assert(box.toString() === 'd');
        assert(box.prev.toString() === 'alfre');
    });

    it('should NOT throw when NaN, or -Infinity are given (but treat it as `0`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(NaN);

        assert(box.toString() === 'alfred');
        assert(box.prev.toString() === '');

        box.split(-Infinity);

        assert(box.toString() === 'alfred');
        assert(box.prev.toString() === '');
    });

    it('should NOT throw when Infinity is given (but treat it as `value.length`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(Infinity);

        assert(box.toString() === '');
        assert(box.prev.toString() === 'alfred');
    });

    it('should NOT throw when a position greater than the length of the box is given (but treat it as `this.value.length`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(7);

        assert(box.toString() === '');
        assert(box.prev.toString() === 'alfred');
    });

    it('should NOT throw when a nully position is given, but treat it as `0`', function () {
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
    });

    it('should remove the part of the current items value, from `0` to the given position', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(2);

        assert(box.toString() === 'fred');
    });

    it('should prepend a new instance() of the operated on item', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(2);

        assert(box.prev instanceof box.constructor);
    });

    it('should move the part of the current items value, from `0` to the given position, to prepended item', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(2);

        assert(box.prev.toString() === 'al');
    });
});

var Range = TextOM.Range,
    rangePrototype = Range.prototype;

describe('TextOM.Range()', function () {
    it('should be of type `function`', function () {
        assert(typeof Range === 'function');
    });
});

describe('TextOM.Range#setStart(node, offset?)', function () {
    it('should be of type `function`', function () {
        assert(typeof (new Range()).setStart === 'function');
    });

    it('should throw when no node is given', function () {
        var range = new Range();
        assert.throws(function () { range.setStart(); }, /undefined/);
        assert.throws(function () { range.setStart(false); }, /false/);
    });

    it('should NOT throw when an unattached node is given', function () {
        var range = new Range();
        assert.doesNotThrow(function () { range.setStart(new Child()); });
        assert.doesNotThrow(function () { range.setStart(new Parent()); });
    });

    it('should throw when a negative offset is given', function () {
        var child = (new Parent()).append(new Child());
        assert.throws(function () { (new Range()).setStart(child, -1); }, /-1/);
        assert.throws(function () { (new Range()).setStart(child, -Infinity); }, /-Infinity/);
    });

    it('should NOT throw when NaN is given, but treat it as `0`', function () {
        var child = (new Parent()).append(new Child());
        var range = new Range();
        assert.doesNotThrow(function () { range.setStart(child, NaN); });
        assert(range.startOffset === 0);
    });

    it('should throw when a value other than a number is given', function () {
        var child = (new Parent()).append(new Child());
        assert.throws(function () { (new Range()).setStart(child, 'failure'); }, /failure/);
    });

    it('should NOT throw when an offset greater than the length of the node is given', function () {
        var parent = new Parent(),
            parent_ = new Parent(),
            child = new Child(),
            child_ = new Child();

        // Fool code to think parent is attached;
        parent_.parent = parent;
        parent[0] = parent.head = parent_;

        parent_.append(child);
        parent_.append(child_);

        assert.doesNotThrow(function () { (new Range()).setStart(parent_, 3); });
        assert.doesNotThrow(function () { (new Range()).setStart(parent_, Infinity); });
    });

    it('should throw when `endContainer` does not share the same root as the given node', function () {
        var range = new Range(),
           parent = new Parent(),
           parent_ = new Parent(),
           child = parent.append(new Text('alfred')),
           child_ = parent_.append(new Text('bertrand'));

        range.setEnd(child_);
        assert.throws(function () { range.setStart(child); }, /WrongRootError/);
    });

    it('should not throw when an offset is given, but no length property exists on the given node', function () {
        var child = (new Parent()).append(new Child());
        assert.doesNotThrow(function () { (new Range()).setStart(child, 1); });
        assert.doesNotThrow(function () { (new Range()).setStart(child, Infinity); });
    });

    it('should set `startContainer` and `startOffset` to the given values, when no endContainer exists', function () {
        var parent = new Parent(),
            child = new Child(),
            range = new Range(),
            offset = 1;

        parent.append(child);

        range.setStart(child, offset);
        assert(range.startContainer === child);
        assert(range.startOffset === offset);
    });

    it('should switch the given start values with the current end values, when `endContainer` equals the given container and the endOffset is lower than the given offset', function () {
        var parent = new Parent(),
            child = new Child(),
            range = new Range();

        parent.append(child);

        range.setEnd(child, 0);
        range.setStart(child, 1);

        assert(range.startOffset === 0);
        assert(range.endOffset === 1);
    });

    it('should switch the given start values with the current end values, when the given item is a descendant of the current end container', function () {
        /*
        Tree:
              greatGrandparent[
                  grandparent[
                      parent[
                          child
                      ]
                  ]
              ]
        */
        var greatGrandparent = new TextOM.RootNode(),
            grandparent = new TextOM.ParagraphNode(),
            parent = new TextOM.SentenceNode(),
            child = new Child(),
            range;

        greatGrandparent.append(grandparent);
        grandparent.append(parent);
        parent.append(child);

        /*
        Case: The intended startContainer is a child of the current
              endContainer.
        */
        range = new Range();

        range.setEnd(parent);
        range.setStart(child);
        assert(range.endContainer === child);
        assert(range.startContainer === parent);

        range = new Range();

        range.setEnd(grandparent);
        range.setStart(child);
        assert(range.endContainer === child);
        assert(range.startContainer === grandparent);
    });

    it('should switch the given start values with the current end values, when the given item is before the current end container', function () {
        /*
        Tree:
              greatGrandparent[
                  grandparent0[
                      parent0[
                          child0,
                          child1
                      ],
                      parent1[
                          child2,
                          child3
                      ]
                  ],
                  grandparent1[
                      parent2[
                          child4,
                          child5
                      ],
                      parent3[
                          child6,
                          child7
                      ]
                  ],
              ]
        */
        var greatGrandparent = new TextOM.RootNode(),
            grandparent0 = new TextOM.ParagraphNode(),
            grandparent1 = new TextOM.ParagraphNode(),
            parent0 = new TextOM.SentenceNode(),
            parent1 = new TextOM.SentenceNode(),
            parent2 = new TextOM.SentenceNode(),
            parent3 = new TextOM.SentenceNode(),
            child0 = new TextOM.WordNode(),
            child1 = new TextOM.WordNode(),
            child2 = new TextOM.WordNode(),
            child3 = new TextOM.WordNode(),
            child4 = new TextOM.WordNode(),
            child5 = new TextOM.WordNode(),
            child6 = new TextOM.WordNode(),
            child7 = new TextOM.WordNode(),
            range;

        greatGrandparent.append(grandparent0);
        grandparent0.append(parent0);
        grandparent0.append(parent1);
        parent0.append(child0);
        parent0.append(child1);
        parent1.append(child2);
        parent1.append(child3);

        greatGrandparent.append(grandparent1);
        grandparent1.append(parent2);
        grandparent1.append(parent3);
        parent2.append(child4);
        parent2.append(child5);
        parent3.append(child6);
        parent3.append(child7);

        range = new Range();

        range.setEnd(child5);
        range.setStart(child7);
        assert(range.startContainer === child5);
        assert(range.endContainer === child7);

        range = new Range();

        range.setEnd(child3);
        range.setStart(child7);
        assert(range.startContainer === child3);
        assert(range.endContainer === child7);

        range = new Range();

        range.setEnd(child1);
        range.setStart(child7);
        assert(range.startContainer === child1);
        assert(range.endContainer === child7);

        range = new Range();

        range.setEnd(parent3);
        range.setStart(child7);
        assert(range.startContainer === parent3);
        assert(range.endContainer === child7);

        range = new Range();

        range.setEnd(parent1);
        range.setStart(child7);
        assert(range.startContainer === parent1);
        assert(range.endContainer === child7);

        range = new Range();

        range.setEnd(grandparent0);
        range.setStart(child7);
        assert(range.startContainer === grandparent0);
        assert(range.endContainer === child7);
    });
});

describe('TextOM.Range#setEnd(node, offset?)', function () {
    it('should be of type `function`', function () {
        assert(typeof (new Range()).setEnd === 'function');
    });

    it('should throw when no node is given', function () {
        var range = new Range();
        assert.throws(function () { range.setEnd(); }, /undefined/);
        assert.throws(function () { range.setEnd(false); }, /false/);
    });

    it('should NOT throw when an unattached node is given', function () {
        var range = new Range();
        assert.doesNotThrow(function () { range.setEnd(new Child()); });
        assert.doesNotThrow(function () { range.setEnd(new Parent()); });
    });

    it('should throw when a negative offset is given', function () {
        var child = (new Parent()).append(new Child());
        assert.throws(function () { (new Range()).setEnd(child, -1); }, /-1/);
        assert.throws(function () { (new Range()).setEnd(child, -Infinity); }, /-Infinity/);
    });

    it('should NOT throw when NaN is given, but treat it as `0`', function () {
        var child = (new Parent()).append(new Child());
        var range = new Range();
        assert.doesNotThrow(function () { range.setStart(child, NaN); });
        assert(range.startOffset === 0);
    });

    it('should throw when a value other than a number is given', function () {
        var child = (new Parent()).append(new Child());
        assert.throws(function () { (new Range()).setStart(child, 'failure'); }, /failure/);
    });

    it('should NOT throw when an offset greater than the length of the node is given', function () {
        var parent = new Parent(),
            parent_ = new Parent(),
            child = new Child(),
            child_ = new Child();

        // Fool code to think parent is attached;
        parent_.parent = parent;
        parent[0] = parent.head = parent_;

        parent_.append(child);
        parent_.append(child_);

        assert.doesNotThrow(function () { (new Range()).setEnd(parent_, 3); });
        assert.doesNotThrow(function () { (new Range()).setEnd(parent_, Infinity); });
    });

    it('should throw when `startContainer` does not share the same root as the given node', function () {
        var range = new Range(),
           parent = new Parent(),
           parent_ = new Parent(),
           child = parent.append(new Text('alfred')),
           child_ = parent_.append(new Text('bertrand'));

        range.setStart(child);
        assert.throws(function () { range.setEnd(child_); }, /WrongRootError/);
    });

    it('should not throw when an offset is given, but no length property exists on the given node', function () {
        var child = (new Parent()).append(new Child());
        assert.doesNotThrow(function () { (new Range()).setEnd(child, 1); });
        assert.doesNotThrow(function () { (new Range()).setEnd(child, Infinity); });
    });

    it('should set `endContainer` and `endOffset` to the given values, when no startContainer exists', function () {
        var parent = new Parent(),
            child = new Child(),
            range = new Range(),
            offset = 1;

        parent.append(child);

        range.setEnd(child, offset);
        assert(range.endContainer === child);
        assert(range.endOffset === offset);
    });

    it('should switch the given end values with the current start values, when `startContainer` equals the given container and the startOffset is higher than the given offset', function () {
        var parent = new Parent(),
            child = new Child(),
            range = new Range();

        parent.append(child);

        range.setStart(child, 1);
        range.setEnd(child, 0);

        assert(range.startOffset === 0);
        assert(range.endOffset === 1);
    });

    it('should switch the given end values with the current start values, when the given item is before the current start container', function () {
        /*
        Tree:
              greatGrandparent[
                  grandparent0[
                      parent0[
                          child0,
                          child1
                      ],
                      parent1[
                          child2,
                          child3
                      ]
                  ],
                  grandparent1[
                      parent2[
                          child4,
                          child5
                      ],
                      parent3[
                          child6,
                          child7
                      ]
                  ],
              ]
        */
        var greatGrandparent = new TextOM.RootNode(),
            grandparent0 = new TextOM.ParagraphNode(),
            grandparent1 = new TextOM.ParagraphNode(),
            parent0 = new TextOM.SentenceNode(),
            parent1 = new TextOM.SentenceNode(),
            parent2 = new TextOM.SentenceNode(),
            parent3 = new TextOM.SentenceNode(),
            child0 = new TextOM.WordNode(),
            child1 = new TextOM.WordNode(),
            child2 = new TextOM.WordNode(),
            child3 = new TextOM.WordNode(),
            child4 = new TextOM.WordNode(),
            child5 = new TextOM.WordNode(),
            child6 = new TextOM.WordNode(),
            child7 = new TextOM.WordNode(),
            range;

        greatGrandparent.append(grandparent0);
        grandparent0.append(parent0);
        grandparent0.append(parent1);
        parent0.append(child0);
        parent0.append(child1);
        parent1.append(child2);
        parent1.append(child3);

        greatGrandparent.append(grandparent1);
        grandparent1.append(parent2);
        grandparent1.append(parent3);
        parent2.append(child4);
        parent2.append(child5);
        parent3.append(child6);
        parent3.append(child7);

        range = new Range();

        range.setStart(child7);
        range.setEnd(child5);
        assert(range.startContainer === child5);
        assert(range.endContainer === child7);

        range = new Range();

        range.setStart(child7);
        range.setEnd(child3);
        assert(range.startContainer === child3);
        assert(range.endContainer === child7);


        range = new Range();

        range.setStart(child7);
        range.setEnd(child1);
        assert(range.startContainer === child1);
        assert(range.endContainer === child7);

        range = new Range();

        range.setStart(child7);
        range.setEnd(parent3);
        assert(range.endContainer === child7);
        assert(range.startContainer === parent3);

        range = new Range();

        range.setStart(child7);
        range.setEnd(parent1);
        assert(range.startContainer === parent1);
        assert(range.endContainer === child7);

        range = new Range();

        range.setStart(child7);
        range.setEnd(grandparent0);
        assert(range.startContainer === grandparent0);
        assert(range.endContainer === child7);
    });
});

describe('TextOM.Range#cloneRange()', function () {
    it('should be of type `function`', function () {
        assert(typeof (new Range()).cloneRange === 'function');
    });

    it('should return a new instance() of `this.constructor`', function () {
        assert((new Range()).cloneRange() instanceof (new Range()).constructor);

        function F () {}
        F.prototype.cloneRange = Range.prototype.cloneRange;

        assert((new F()).cloneRange() instanceof (new F()).constructor);
    });

    it('should copy `startContainer`, `startOffset`, `endContainer`, and `endOffset` to the new instance()', function () {
        var range = new Range(),
            range_;

        range.startContainer = 'a';
        range.endContainer = 'b';
        range.startOffset = 0;

        range_ = range.cloneRange();

        assert(range.startContainer === range_.startContainer);
        assert(range.endContainer === range_.endContainer);
        assert(range.startOffset === range_.startOffset);
        assert(range.endOffset === range_.endOffset);
    });
});

describe('TextOM.Range#toString()', function () {
    it('should be of type `function`', function () {
        assert(typeof (new Range()).toString === 'function');
    });

    it('should return an empty string when no start- or endpoints exist', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        assert(range.toString() === '');

        range = new Range();
        range.setStart(child);
        assert(range.toString() === '');

        range = new Range();
        range.setEnd(child);
        assert(range.toString() === '');
    });

    it('should return an empty string when startContainer equals endContainer and startOffset equals endOffset', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child, 2);
        range.setEnd(child, 2);
        assert(range.toString() === '');
    });

    it('should return the substring of the `startContainer`, starting at `startOffset` and ending at `endOffset`, when `startContainer` equals `endContainer` and `startContainer` has no `length` property', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child, 2);
        range.setEnd(child, 4);
        assert(range.toString() === 'fr');

        range.setEnd(child);
        assert(range.toString() === 'fred');

        range.setStart(child);
        assert(range.toString() === 'alfred');
    });

    it('should return the substring of the `startContainer`, starting at `startOffset` and ending at the last possible character, when `startContainer` equals `endContainer`, `startContainer` has no `length`property, and `endOffset` is larger than the result of calling the `toString` method on `startContainer`', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child);
        range.setEnd(child);
        child.fromString('bert');
        assert(range.toString() === 'bert');
    });

    it('should substring the endContainer from its start and ending at its `endOffset`', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child_ = parent.append(new Text('bertrand'));

        range.setStart(child);
        range.setEnd(child_, 6);
        assert(range.toString() === 'alfredbertra');
    });

    it('should concatenate two siblings', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child_ = parent.append(new Text('bertrand'));

        range.setStart(child);
        range.setEnd(child_);
        assert(range.toString() === 'alfredbertrand');

        range.setStart(child, 2);
        assert(range.toString() === 'fredbertrand');

        range.setEnd(child_, 6);
        assert(range.toString() === 'fredbertra');
    });

    it('should concatenate multiple siblings', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child_ = parent.append(new Text('bertrand')),
            child__ = parent.append(new Text('cees')),
            child___ = parent.append(new Text('dick')),
            child____ = parent.append(new Text('eric')),
            child_____ = parent.append(new Text('ferdinand'));

        range.setStart(child);
        range.setEnd(child_____);
        assert(range.toString() === 'alfredbertrandceesdickericferdinand');

        range.setStart(child, 3);
        assert(range.toString() === 'redbertrandceesdickericferdinand');

        range.setEnd(child_____, 7);
        assert(range.toString() === 'redbertrandceesdickericferdina');
    });

    it('should concatenate children of different parents', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent.append(new TextOM.WordNode('bertrand')),
            child__ = parent_.append(new TextOM.WordNode('cees'));

        range.setStart(child);
        range.setEnd(child__);
        assert(range.toString() === 'alfredbertrandcees');

        range.setStart(child, 1);
        assert(range.toString() === 'lfredbertrandcees');

        range.setStart(child_);
        assert(range.toString() === 'bertrandcees');

        range.setEnd(child__, 3);
        assert(range.toString() === 'bertrandcee');
    });

    it('should concatenate children of different grandparents', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            grandparent_ = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            parent__ = grandparent_.append(new TextOM.SentenceNode()),
            parent___ = grandparent_.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent_.append(new TextOM.WordNode('bertrand')),
            child__ = parent__.append(new TextOM.WordNode('cees')),
            child___ = parent___.append(new TextOM.WordNode('dick'));

        range.setStart(child);
        range.setEnd(child___);
        assert(range.toString() === 'alfredbertrandceesdick');

        range.setStart(child, 1);
        assert(range.toString() === 'lfredbertrandceesdick');

        range.setEnd(child___, 3);
        assert(range.toString() === 'lfredbertrandceesdic');

        range.setStart(child_);
        assert(range.toString() === 'bertrandceesdic');

        range.setEnd(child__);
        assert(range.toString() === 'bertrandcees');

        range.setStart(child_, 1);
        assert(range.toString() === 'ertrandcees');

        range.setEnd(child__, 3);
        assert(range.toString() === 'ertrandcee');
    });

    it('should return an empty string, when startContainer and endContainer no longer share the same root', function () {
        var range = new Range(),
           parent = new Parent(),
           child = parent.append(new Text('alfred')),
           child_ = parent.append(new Text('bertrand')),
           child__ = parent.append(new Text('cees'));

        range.setStart(child);
        range.setEnd(child__);
        assert(range.toString() === 'alfredbertrandcees');

        child__.remove();
        assert(range.toString() === '');
    });

    it('should concatenate a parent using offset', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent.append(new TextOM.WordNode('bertrand')),
            child__ = parent.append(new TextOM.WordNode('cees')),
            child___ = parent.append(new TextOM.WordNode('dick'));

        range.setStart(parent, 1);
        range.setEnd(parent, 3);
        assert(range.toString() === 'bertrandcees');
    });

    it('should concatenate different parents', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent_.append(new TextOM.WordNode('bertrand'));

        range.setStart(parent);
        range.setEnd(parent_);
        assert(range.toString() === 'alfredbertrand');
    });

    it('should concatenate different grandparents', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            grandparent_ = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent_.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent_.append(new TextOM.WordNode('bertrand'));

        range.setStart(grandparent);
        range.setEnd(grandparent_);
        assert(range.toString() === 'alfredbertrand');
    });

    it('should concatenate different parents using offset', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent.append(new TextOM.WordNode('bertrand')),
            child__ = parent_.append(new TextOM.WordNode('cees')),
            child___ = parent_.append(new TextOM.WordNode('dick'));

        range.setStart(parent, 1);
        range.setEnd(parent_, 1);
        assert(range.toString() === 'bertrandcees');
    });
});

describe('TextOM.Range#getContent()', function () {
    it('should be of type `function`', function () {
        assert(typeof (new Range()).getContent === 'function');
    });

    it('should return an empty array, when no start- or endpoints exist', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            result = range.getContent();

        assert(result.length === 0);
        assert(result instanceof Array);

        range = new Range();
        range.setStart(child);
        result = range.getContent();
        assert(result.length === 0);
        assert(result instanceof Array);

        range = new Range();
        range.setEnd(child);
        result = range.getContent();
        assert(result.length === 0);
        assert(result instanceof Array);
    });

    it('should return an empty array, when startContainer is not in the same root as endContainer', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent_.append(new TextOM.WordNode('bertrand')),
            result = range.getContent();

        range = new Range();
        range.setStart(child);
        range.setEnd(child_);

        parent_.remove();

        result = range.getContent();
        assert(result.length === 0);
        assert(result instanceof Array);
    });

    it('should return an array containg node, when startContainer equals endContainer, and startContainer is a Text node', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            result;

        range.setStart(child);
        range.setEnd(child);

        result = range.getContent();
        assert(result.length === 1);
        assert(result[0] === child);
    });

    it('should return an array containg node, when startContainer equals endContainer, is a Text node, and startOffset equals endOffset', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            result;

        range.setStart(child, 2);
        range.setEnd(child, 2);

        result = range.getContent();
        assert(result.length === 1);
        assert(result[0] === child);
    });

    it('should return an array containing two direct text siblings', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child_ = parent.append(new Text('bertrand')),
            result;

        range.setStart(child);
        range.setEnd(child_);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === child);
        assert(result[1] === child_);
    });

    it('should return an array containing multiple text siblings', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child_ = parent.append(new Text('bertrand')),
            child__ = parent.append(new Text('cees')),
            child___ = parent.append(new Text('dick')),
            child____ = parent.append(new Text('eric')),
            child_____ = parent.append(new Text('ferdinand')),
            result;

        range.setStart(child);
        range.setEnd(child_____);
        result = range.getContent();
        assert(result.length === 6);
        assert(result.join('|') === 'alfred|bertrand|cees|dick|eric|ferdinand');

        range.setStart(child, 3);
        result = range.getContent();
        assert(result.length === 6);
        assert(result.join('|') === 'alfred|bertrand|cees|dick|eric|ferdinand');

        range.setEnd(child_____, 7);
        result = range.getContent();
        assert(result.length === 6);
        assert(result.join('|') === 'alfred|bertrand|cees|dick|eric|ferdinand');
    });

    it('should return an array containing text children of different parents', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent.append(new TextOM.WordNode('bertrand')),
            child__ = parent_.append(new TextOM.WordNode('cees')),
            child___ = parent_.append(new TextOM.WordNode('dick')),
            result;

        range.setStart(child_);
        range.setEnd(child__);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === child_);
        assert(result[1] === child__);
    });

    it('should return an array containing text children of different grandparents', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            grandparent_ = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent.append(new TextOM.WordNode('bertrand')),
            child__ = parent_.append(new TextOM.WordNode('cees')),
            child___ = parent_.append(new TextOM.WordNode('dick')),
            result;

        range.setStart(child_);
        range.setEnd(child__);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === child_);
        assert(result[1] === child__);
        assert(result.join('|') === 'bertrand|cees');
    });

    it('should return an empty array, when start- and endContainer no longer share the same root', function () {
        var range = new Range(),
           parent = new Parent(),
           child = parent.append(new Text('alfred')),
           child_ = parent.append(new Text('bertrand')),
           child__ = parent.append(new Text('cees'));

        range.setStart(child);
        range.setEnd(child__);
        assert(range.getContent().join('|') === 'alfred|bertrand|cees');

        child__.remove();
        assert(range.getContent().length === 0);
    });

    it('should return an array containing startContainer, when startContainer equals endContainer, is an Element node, startOffset is `0`, and endOffset is equal to or greater than the length of node', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            result;

        range.setStart(parent);
        range.setEnd(parent);
        result = range.getContent();
        assert(result.length === 1);
        assert(result[0] === parent);
    });

    it('should return an array containing two direct elements siblings', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            result;

        range.setStart(parent);
        range.setEnd(parent_);
        result = range.getContent();

        assert(result.length === 2);
        assert(result[0] === parent);
        assert(result[1] === parent_);
    });

    it('should return an array containing multiple elements siblings', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            parent__ = grandparent.append(new TextOM.SentenceNode()),
            parent___ = grandparent.append(new TextOM.SentenceNode()),
            parent____ = grandparent.append(new TextOM.SentenceNode()),
            parent_____ = grandparent.append(new TextOM.SentenceNode()),
            result;

        range.setStart(parent);
        range.setEnd(parent____);
        result = range.getContent();
        assert(result.length === 5);
        assert(result[0] === parent);
        assert(result[1] === parent_);
        assert(result[2] === parent__);
        assert(result[3] === parent___);
        assert(result[4] === parent____);

        range.setStart(parent_);
        result = range.getContent();
        assert(result.length === 4);
        assert(result[0] === parent_);
        assert(result[1] === parent__);
        assert(result[2] === parent___);
        assert(result[3] === parent____);

        range.setEnd(parent___);
        result = range.getContent();
        assert(result.length === 3);
        assert(result[0] === parent_);
        assert(result[1] === parent__);
        assert(result[2] === parent___);
    });

    it('should return an array containing elements of different grandparents', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            grandparent_ = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent_.append(new TextOM.SentenceNode()),
            result;

        range.setStart(parent);
        range.setEnd(parent_);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === parent);
        assert(result[1] === parent_);
    });

    it('should return an array containing children, when startContainer equals endContainer, is an Element node, and endOffset is NOT equal to or greater than the length of node', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent.append(new TextOM.WordNode('bertrand')),
            child__ = parent.append(new TextOM.WordNode('cees')),
            child___ = parent.append(new TextOM.WordNode('dick')),
            result;

        range.setStart(parent);
        range.setEnd(parent, 3);
        result = range.getContent();
        assert(result.length === 3);
        assert(result[0] === child);
        assert(result[1] === child_);
        assert(result[2] === child__);

        range.setStart(parent, 1);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === child_);
        assert(result[1] === child__);
    });

    it('should return an array containing children, when startContainer is an Element node, and endContainer is inside startContainer', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent.append(new TextOM.WordNode('bertrand')),
            child__ = parent.append(new TextOM.WordNode('cees')),
            child___ = parent.append(new TextOM.WordNode('dick')),
            result;

        range.setStart(parent);
        range.setEnd(child__);
        result = range.getContent();
        assert(result.length === 3);
        assert(result[0] === child);
        assert(result[1] === child_);
        assert(result[2] === child__);

        range.setStart(parent, 1);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === child_);
        assert(result[1] === child__);
    });

    it('should return an array containing children, when startContainer equals endContainer, is a grandparent, and endOffset is NOT equal to or greater than the length of node', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            parent__ = grandparent.append(new TextOM.SentenceNode()),
            parent___ = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent_.append(new TextOM.WordNode('bertrand')),
            child__ = parent__.append(new TextOM.WordNode('cees')),
            child___ = parent___.append(new TextOM.WordNode('dick')),
            result;

        range.setStart(grandparent);
        range.setEnd(grandparent, 3);
        result = range.getContent();
        assert(result.length === 3);
        assert(result[0] === parent);
        assert(result[1] === parent_);
        assert(result[2] === parent__);

        range.setStart(grandparent, 1);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === parent_);
        assert(result[1] === parent__);
    });

    it('should return an array containing children, when startContainer is a Parent node, and endContainer is inside startContainer', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            parent__ = grandparent.append(new TextOM.SentenceNode()),
            parent___ = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent_.append(new TextOM.WordNode('bertrand')),
            child__ = parent__.append(new TextOM.WordNode('cees')),
            child___ = parent___.append(new TextOM.WordNode('dick')),
            result;

        range.setStart(grandparent);
        range.setEnd(child___);
        result = range.getContent();
        assert(result.length === 4);
        assert(result[0] === parent);
        assert(result[1] === parent_);
        assert(result[2] === parent__);
        assert(result[3] === child___);

        range.setStart(grandparent, 1);
        result = range.getContent();
        assert(result.length === 3);
        assert(result[0] === parent_);
        assert(result[1] === parent__);
        assert(result[2] === child___);

        range.setEnd(parent___);
        result = range.getContent();
        assert(result.length === 3);
        assert(result[0] === parent_);
        assert(result[1] === parent__);
        assert(result[2] === parent___);
    });

    it('should return an array containing children but excluding startContainer, when startOffset is more than the length of startContainer', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            grandparent_ = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            parent__ = grandparent_.append(new TextOM.SentenceNode()),
            parent___ = grandparent_.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent_.append(new TextOM.WordNode('bertrand')),
            child__ = parent__.append(new TextOM.WordNode('cees')),
            child___ = parent___.append(new TextOM.WordNode('dick')),
            result;

        range.setStart(grandparent, Infinity);
        range.setEnd(child___);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === parent__);
        assert(result[1] === child___);

        range.setStart(parent, Infinity);
        result = range.getContent();
        assert(result.length === 3);
        assert(result[0] === parent_);
        assert(result[1] === parent__);
        assert(result[2] === child___);


        range = new Range();
        greatGrandparent = new TextOM.RootNode();
        grandparent = greatGrandparent.append(new TextOM.ParagraphNode());
        grandparent_ = greatGrandparent.append(new TextOM.ParagraphNode());
        parent = grandparent.append(new TextOM.SentenceNode());
        parent_ = grandparent_.append(new TextOM.SentenceNode());
        parent__ = grandparent_.append(new TextOM.SentenceNode());

        range.setStart(parent, Infinity);
        range.setEnd(parent__);
        result = range.getContent();
        assert(result.length === 1);
        assert(result[0] === grandparent_);
    });

    it('should return an array containing children, when endContainer is an element, and endOffset is equal to or greater than the length of node', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            grandparent_ = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            parent__ = grandparent_.append(new TextOM.SentenceNode()),
            parent___ = grandparent_.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent_.append(new TextOM.WordNode('bertrand')),
            child__ = parent__.append(new TextOM.WordNode('cees')),
            child___ = parent___.append(new TextOM.WordNode('dick')),
            result;

        range.setStart(grandparent);
        range.setEnd(parent___, Infinity);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === grandparent);
        assert(result[1] === grandparent_);

        range.setEnd(grandparent_);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === grandparent);
        assert(result[1] === grandparent_);
    });

    it('should return an array containing children, when endContainer is an element, and endOffset is less than the length of node', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(new TextOM.ParagraphNode()),
            grandparent_ = greatGrandparent.append(new TextOM.ParagraphNode()),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent_ = grandparent.append(new TextOM.SentenceNode()),
            parent__ = grandparent_.append(new TextOM.SentenceNode()),
            parent___ = grandparent_.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child_ = parent.append(new TextOM.WordNode('bertrand')),
            child__ = parent_.append(new TextOM.WordNode('cees')),
            child___ = parent_.append(new TextOM.WordNode('dick')),
            child____ = parent__.append(new TextOM.WordNode('eric')),
            child_____ = parent__.append(new TextOM.WordNode('ferdinand')),
            child______ = parent___.append(new TextOM.WordNode('gerard')),
            child_______ = parent___.append(new TextOM.WordNode('hendrick')),
            result;

        range.setStart(grandparent);
        range.setEnd(parent___, 1);
        result = range.getContent();
        assert(result.length === 3);
        assert(result[0] === grandparent);
        assert(result[1] === parent__);
        assert(result[2] === child______);

        range.setEnd(grandparent_, 1);
        result = range.getContent();
        assert(result.length === 2);
        assert(result[0] === grandparent);
        assert(result[1] === parent__);
    });
});

describe('TextOM.RootNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof TextOM.RootNode === 'function');
    });

    it('should inherit from `Parent`', function () {
        assert((new TextOM.RootNode()) instanceof Parent);
    });
});

describe('TextOM.ParagraphNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof TextOM.ParagraphNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert((new TextOM.ParagraphNode()) instanceof Element);
    });
});

describe('TextOM.SentenceNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof TextOM.SentenceNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert((new TextOM.SentenceNode()) instanceof Element);
    });
});

describe('TextOM.WordNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof TextOM.WordNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert((new TextOM.WordNode()) instanceof Text);
    });
});

describe('TextOM.PunctuationNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof TextOM.PunctuationNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert((new TextOM.PunctuationNode()) instanceof Text);
    });
});

describe('TextOM.WhiteSpaceNode()', function () {
    it('should be of type `function`', function () {
        assert(typeof TextOM.WhiteSpaceNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert((new TextOM.WhiteSpaceNode()) instanceof Text);
    });
});

describe('HierarchyError', function () {
    it('should throw when appending a `RootNode` to a `RootNode`', function () {
        assert.throws(function () {
            (new TextOM.RootNode()).append(new TextOM.RootNode());
        }, /HierarchyError/);
    });
    it('should NOT throw when appending a `ParagraphNode` to a `RootNode`', function () {
        assert.doesNotThrow(function () {
            (new TextOM.RootNode()).append(new TextOM.ParagraphNode());
        }, /HierarchyError/);
    });
    it('should throw when appending a `SentenceNode` to a `RootNode`', function () {
        assert.throws(function () {
            (new TextOM.RootNode()).append(new TextOM.SentenceNode());
        }, /HierarchyError/);
    });
    it('should throw when appending a `WordNode` to a `RootNode`', function () {
        assert.throws(function () {
            (new TextOM.RootNode()).append(new TextOM.WordNode());
        }, /HierarchyError/);
    });
    it('should throw when appending a `PunctuationNode` to a `RootNode`', function () {
        assert.throws(function () {
            (new TextOM.RootNode()).append(new TextOM.PunctuationNode());
        }, /HierarchyError/);
    });
    it('should NOT throw when appending a `WhiteSpaceNode` to a `RootNode`', function () {
        assert.doesNotThrow(function () {
            (new TextOM.RootNode()).append(new TextOM.WhiteSpaceNode());
        }, /HierarchyError/);
    });

    it('should throw when appending a `RootNode` to a `ParagraphNode`', function () {
        assert.throws(function () {
            (new TextOM.ParagraphNode()).append(new TextOM.RootNode());
        }, /HierarchyError/);
    });
    it('should throw when appending a `ParagraphNode` to a `ParagraphNode`', function () {
        assert.throws(function () {
            (new TextOM.ParagraphNode()).append(new TextOM.ParagraphNode());
        }, /HierarchyError/);
    });
    it('should NOT throw when appending a `SentenceNode` to a `ParagraphNode`', function () {
        assert.doesNotThrow(function () {
            (new TextOM.ParagraphNode()).append(new TextOM.SentenceNode());
        }, /HierarchyError/);
    });
    it('should throw when appending a `WordNode` to a `ParagraphNode`', function () {
        assert.throws(function () {
            (new TextOM.ParagraphNode()).append(new TextOM.WordNode());
        }, /HierarchyError/);
    });
    it('should throw when appending a `PunctuationNode` to a `ParagraphNode`', function () {
        assert.throws(function () {
            (new TextOM.ParagraphNode()).append(new TextOM.PunctuationNode());
        }, /HierarchyError/);
    });
    it('should NOT throw when appending a `WhiteSpaceNode` to a `ParagraphNode`', function () {
        assert.doesNotThrow(function () {
            (new TextOM.ParagraphNode()).append(new TextOM.WhiteSpaceNode());
        }, /HierarchyError/);
    });

    it('should throw when appending a `RootNode` to a `SentenceNode`', function () {
        assert.throws(function () {
            (new TextOM.SentenceNode()).append(new TextOM.RootNode());
        }, /HierarchyError/);
    });
    it('should throw when appending a `ParagraphNode` to a `SentenceNode`', function () {
        assert.throws(function () {
            (new TextOM.SentenceNode()).append(new TextOM.ParagraphNode());
        }, /HierarchyError/);
    });
    it('should throw when appending a `SentenceNode` to a `SentenceNode`', function () {
        assert.throws(function () {
            (new TextOM.SentenceNode()).append(new TextOM.SentenceNode());
        }, /HierarchyError/);
    });

    it('should NOT throw when appending a `PunctuationNode` to a `SentenceNode`', function () {
        assert.doesNotThrow(function () {
            (new TextOM.SentenceNode()).append(new TextOM.PunctuationNode());
        }, /HierarchyError/);
    });
    it('should NOT throw when appending a `WordNode` to a `SentenceNode`', function () {
        assert.doesNotThrow(function () {
            (new TextOM.SentenceNode()).append(new TextOM.WordNode());
        }, /HierarchyError/);
    });
    it('should NOT throw when appending a `WhiteSpaceNode` to a `SentenceNode`', function () {
        assert.doesNotThrow(function () {
            (new TextOM.SentenceNode()).append(new TextOM.WhiteSpaceNode());
        }, /HierarchyError/);
    });
});

describe('Events on TextOM.Parent', function () {
    describe('[insertinside]', function () {
        it('emits on all `Child`s ancestors, with the current ancestor as the context, and the inserted child as an argument, when a Child is inserted', function () {
            var rootNode = new TextOM.RootNode(),
                paragraphNode = rootNode.append(new TextOM.ParagraphNode()),
                sentenceNode = paragraphNode.append(new TextOM.SentenceNode()),
                wordNode = new TextOM.WordNode('alfred'),
                whiteSpaceNode = new TextOM.WhiteSpaceNode('\n\n'),
                iterator = 0,
                shouldBeChild = null;

            function oninsertinsideFactory(context) {
                return function (child) {
                    iterator++;
                    assert(this === context);
                    assert(child === shouldBeChild);
                };
            }

            rootNode.on('insertinside', oninsertinsideFactory(rootNode));
            paragraphNode.on('insertinside', oninsertinsideFactory(paragraphNode));
            sentenceNode.on('insertinside', oninsertinsideFactory(sentenceNode));
            shouldBeChild = wordNode;

            sentenceNode.append(wordNode);
            assert(iterator === 3);

            iterator = 0;
            shouldBeChild = whiteSpaceNode;

            rootNode.append(whiteSpaceNode);
            assert(iterator === 1);
        });

        it('emits on all `Child`s ancestors constructors, with the current ancestor as the context, and the inserted child as an argument, when a Child is inserted', function () {
            var rootNode = new TextOM.RootNode(),
                paragraphNode = rootNode.append(new TextOM.ParagraphNode()),
                sentenceNode = paragraphNode.append(new TextOM.SentenceNode()),
                wordNode = new TextOM.WordNode('alfred'),
                whiteSpaceNode = new TextOM.WhiteSpaceNode('\n\n'),
                iterator = 0,
                shouldBeChild = null;

            function oninsertinsideFactory(context) {
                return function (child) {
                    iterator++;
                    assert(child === shouldBeChild);
                    assert(this === context);
                };
            }

            TextOM.RootNode.on('insertinside', oninsertinsideFactory(rootNode));
            TextOM.ParagraphNode.on('insertinside', oninsertinsideFactory(paragraphNode));
            TextOM.SentenceNode.on('insertinside', oninsertinsideFactory(sentenceNode));
            shouldBeChild = wordNode;

            sentenceNode.append(wordNode);
            assert(iterator === 3);

            iterator = 0;
            shouldBeChild = whiteSpaceNode;

            rootNode.append(whiteSpaceNode);
            assert(iterator === 1);

            // Clean.
            TextOM.RootNode.off('insertinside');
            TextOM.ParagraphNode.off('insertinside');
            TextOM.SentenceNode.off('insertinside');
        });
    });

    describe('[removeinside]', function () {
        it('emits on all `Child`s ancestors, with the current ancestor as the context, and the removed child as an argument, when a Child is removed', function () {
            var rootNode = new TextOM.RootNode(),
                paragraphNode = rootNode.append(new TextOM.ParagraphNode()),
                sentenceNode = paragraphNode.append(new TextOM.SentenceNode()),
                wordNode = sentenceNode.append(new TextOM.WordNode('alfred')),
                whiteSpaceNode = rootNode.append(new TextOM.WhiteSpaceNode('\n\n')),
                iterator = 0,
                shouldBeChild = null;

            function onremoveinsideFactory(context) {
                return function (child) {
                    iterator++;
                    assert(child === shouldBeChild);
                    assert(this === context);
                };
            }

            rootNode.on('removeinside', onremoveinsideFactory(rootNode));
            paragraphNode.on('removeinside', onremoveinsideFactory(paragraphNode));
            sentenceNode.on('removeinside', onremoveinsideFactory(sentenceNode));
            shouldBeChild = wordNode;

            wordNode.remove();
            assert(iterator === 3);

            iterator = 0;
            shouldBeChild = whiteSpaceNode;

            whiteSpaceNode.remove();
            assert(iterator === 1);
        });

        it('emits on all `Child`s ancestors constructors, with the current ancestor as the context, and the removed child as an argument, when a Child is removed', function () {
            var rootNode = new TextOM.RootNode(),
                paragraphNode = rootNode.append(new TextOM.ParagraphNode()),
                sentenceNode = paragraphNode.append(new TextOM.SentenceNode()),
                wordNode = sentenceNode.append(new TextOM.WordNode('alfred')),
                whiteSpaceNode = rootNode.append(new TextOM.WhiteSpaceNode('\n\n')),
                iterator = 0,
                shouldBeChild = null;

            function onremoveinsideFactory(context) {
                return function (child) {
                    iterator++;
                    assert(child === shouldBeChild);
                    assert(this === context);
                };
            }

            TextOM.RootNode.on('removeinside', onremoveinsideFactory(rootNode));
            TextOM.ParagraphNode.on('removeinside', onremoveinsideFactory(paragraphNode));
            TextOM.SentenceNode.on('removeinside', onremoveinsideFactory(sentenceNode));
            shouldBeChild = wordNode;

            wordNode.remove();
            assert(iterator === 3);

            iterator = 0;
            shouldBeChild = whiteSpaceNode;

            whiteSpaceNode.remove();
            assert(iterator === 1);

            // Clean.
            TextOM.RootNode.off('removeinside');
            TextOM.ParagraphNode.off('removeinside');
            TextOM.SentenceNode.off('removeinside');
        });
    });

    describe('[changetextinside]', function () {
        it('emits on all `Text`s ancestors, with the current ancestor as the context, and the changed child and the previous value as arguments, when a Text is changed', function () {
            var rootNode = new TextOM.RootNode(),
                paragraphNode = rootNode.append(new TextOM.ParagraphNode()),
                sentenceNode = paragraphNode.append(new TextOM.SentenceNode()),
                wordNode = sentenceNode.append(new TextOM.WordNode('alfred')),
                whiteSpaceNode = rootNode.append(new TextOM.WhiteSpaceNode('\n\n')),
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

            rootNode.on('changetextinside', onchangetextinsideFactory(rootNode));
            paragraphNode.on('changetextinside', onchangetextinsideFactory(paragraphNode));
            sentenceNode.on('changetextinside', onchangetextinsideFactory(sentenceNode));
            shouldBeChild = wordNode;
            shouldBePreviousValue = wordNode.toString();

            shouldBeChild.fromString('bertrand');
            assert(iterator === 3);

            iterator = 0;
            shouldBeChild = whiteSpaceNode;
            shouldBePreviousValue = whiteSpaceNode.toString();

            shouldBeChild.fromString('\n');
            assert(iterator === 1);
        });

        it('emits on all `Text`s ancestors, with the current ancestor as the context, and the changed child and the previous value as arguments, when a Text is changed', function () {
            var rootNode = new TextOM.RootNode(),
                paragraphNode = rootNode.append(new TextOM.ParagraphNode()),
                sentenceNode = paragraphNode.append(new TextOM.SentenceNode()),
                wordNode = sentenceNode.append(new TextOM.WordNode('alfred')),
                whiteSpaceNode = rootNode.append(new TextOM.WhiteSpaceNode('\n\n')),
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

            TextOM.RootNode.on('changetextinside', onchangetextinsideFactory(rootNode));
            TextOM.ParagraphNode.on('changetextinside', onchangetextinsideFactory(paragraphNode));
            TextOM.SentenceNode.on('changetextinside', onchangetextinsideFactory(sentenceNode));
            shouldBeChild = wordNode;
            shouldBePreviousValue = wordNode.toString();

            wordNode.fromString('bertrand');
            assert(iterator === 3);

            iterator = 0;
            shouldBeChild = whiteSpaceNode;
            shouldBePreviousValue = whiteSpaceNode.toString();

            whiteSpaceNode.fromString('\n');
            assert(iterator === 1);

            TextOM.RootNode.off('changetextinside');
            TextOM.ParagraphNode.off('changetextinside');
            TextOM.SentenceNode.off('changetextinside');
        });
    });
});

describe('Events on TextOM.Child', function () {
    describe('[insert]', function () {
        it('emits on child and all `child`s constructors, with `child` as the context, when `child` is inserted', function () {
            var paragraphNode = new TextOM.ParagraphNode(),
                sentenceNode = new TextOM.SentenceNode(),
                wordNode = sentenceNode.append(new TextOM.WordNode('alfred')),
                iterator = 0;

            function oninsert() {
                iterator++;
                assert(this === sentenceNode);
            }

            sentenceNode.on('insert', oninsert);
            TextOM.SentenceNode.on('insert', oninsert);
            TextOM.Element.on('insert', oninsert);
            TextOM.Child.on('insert', oninsert);
            TextOM.Parent.on('insert', oninsert);
            TextOM.Node.on('insert', oninsert);

            paragraphNode.append(sentenceNode);
            assert(iterator === 6);

            TextOM.SentenceNode.off('insert');
            TextOM.Element.off('insert');
            TextOM.Child.off('insert');
            TextOM.Parent.off('insert');
            TextOM.Node.off('insert');
        });
    });

    describe('[changenext]', function () {
        it('emits on child and all childs constructors, with child as the context, and the new and the old next nodes as arguments, when the `next` attribute on child changes', function () {
            var sentenceNode = new TextOM.SentenceNode(),
                wordNode = sentenceNode.append(new TextOM.WordNode('alfred')),
                whiteSpaceNode = sentenceNode.append(new TextOM.WhiteSpaceNode(' ')),
                punctuationNode = new TextOM.PunctuationNode(','),
                iterator = 0;

            function onchangenext(node, previousNode) {
                iterator++;
                assert(this === wordNode);
                assert(node === punctuationNode);
                assert(previousNode === whiteSpaceNode);
            }

            wordNode.on('changenext', onchangenext);
            TextOM.WordNode.on('changenext', onchangenext);

            wordNode.after(punctuationNode);
            assert(iterator === 2);

            wordNode.off('changenext');
            TextOM.WordNode.off('changenext');
        });
    });

    describe('[changeprev]', function () {
        it('emits on child and all childs constructors, with child as the context, and the new and the old prev nodes as arguments, when the `prev` attribute on child changes', function () {
            var sentenceNode = new TextOM.SentenceNode(),
                wordNode = sentenceNode.append(new TextOM.WordNode('alfred')),
                whiteSpaceNode = sentenceNode.append(new TextOM.WhiteSpaceNode(' ')),
                punctuationNode = new TextOM.PunctuationNode(','),
                iterator = 0;

            function onchangeprev(node, previousValue) {
                iterator++;
                assert(this === whiteSpaceNode);
                assert(node === punctuationNode);
                assert(previousValue === wordNode);
            }

            whiteSpaceNode.on('changeprev', onchangeprev);
            TextOM.WhiteSpaceNode.on('changeprev', onchangeprev);

            whiteSpaceNode.before(punctuationNode);
            assert(iterator === 2);

            whiteSpaceNode.off('changeprev');
            TextOM.WhiteSpaceNode.off('changeprev');
        });
    });

    describe('[remove]', function () {
        it('emits on child and all `child`s constructors, with `child` as the context, when `child` is removed', function () {
            var paragraphNode = new TextOM.ParagraphNode(),
                sentenceNode = paragraphNode.append(new TextOM.SentenceNode()),
                iterator = 0;

            function onremove() {
                iterator++;
                assert(this === sentenceNode);
            }

            sentenceNode.on('remove', onremove);
            TextOM.SentenceNode.on('remove', onremove);
            TextOM.Element.on('remove', onremove);
            TextOM.Child.on('remove', onremove);
            TextOM.Parent.on('remove', onremove);
            TextOM.Node.on('remove', onremove);

            sentenceNode.remove();
            assert(iterator === 6);

            TextOM.SentenceNode.off('remove');
            TextOM.Element.off('remove');
            TextOM.Child.off('remove');
            TextOM.Parent.off('remove');
            TextOM.Node.off('remove');
        });
    });
});

describe('Events on TextOM.Text', function () {
    describe('[changetext]', function () {
        it('emits on text and all `text`s constructors, with `text` as the context, and the current and previous values as arguments, when a `text` is changed', function () {
            var sentenceNode = new TextOM.SentenceNode(),
                wordNode = sentenceNode.append(new TextOM.WordNode('alfred')),
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
            TextOM.WordNode.on('changetext', onchangetext);
            TextOM.Child.on('changetext', onchangetext);
            TextOM.Node.on('changetext', onchangetext);

            wordNode.fromString(shouldBeValue);
            assert(iterator === 4);

            wordNode.off('changetext');
            TextOM.WordNode.off('changetext');
            TextOM.Child.off('changetext');
            TextOM.Node.off('changetext');
        });
    });
});

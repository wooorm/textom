
var TextOM = require('..'),
    assert = require('assert');

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

describe('TextOM.Node#type', function () {
    it('should be 0', function () {
        assert(nodePrototype.type === 0);
    });
});

describe('TextOM.Node#ROOT_NODE', function () {
    it('should be equal to the `type` property on an instance of `RootNode`', function () {
        assert(TextOM.Node.prototype.ROOT_NODE === (new TextOM.RootNode()).type);
    });
});

describe('TextOM.Node#PARAGRAPH_NODE', function () {
    it('should be equal to the `type` property on an instance of `ParagraphNode`', function () {
        assert(TextOM.Node.prototype.PARAGRAPH_NODE === (new TextOM.ParagraphNode()).type);
    });
});

describe('TextOM.Node#SENTENCE_NODE', function () {
    it('should be equal to the `type` property on an instance of `SentenceNode`', function () {
        assert(TextOM.Node.prototype.SENTENCE_NODE === (new TextOM.SentenceNode()).type);
    });
});

describe('TextOM.Node#WORD_NODE', function () {
    it('should be equal to the `type` property on an instance of `WordNode`', function () {
        assert(TextOM.Node.prototype.WORD_NODE === (new TextOM.WordNode()).type);
    });
});

describe('TextOM.Node#PUNCTUATION_NODE', function () {
    it('should be equal to the `type` property on an instance of `PunctuationNode`', function () {
        assert(TextOM.Node.prototype.PUNCTUATION_NODE === (new TextOM.PunctuationNode()).type);
    });
});

describe('TextOM.Node#WHITE_SPACE_NODE', function () {
    it('should be equal to the `type` property on an instance of `WhiteSpaceNode`', function () {
        assert(TextOM.Node.prototype.WHITE_SPACE_NODE === (new TextOM.WhiteSpaceNode()).type);
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
        assert.throws(function () { parent.prepend(); });
        assert.throws(function () { parent.prepend(null); });
        assert.throws(function () { parent.prepend(undefined); });
        assert.throws(function () { parent.prepend(false); });
    });

    it('should throw when non-removable nodes are prepended (e.g., not inheriting from TextOM.Child)', function () {
        var parent = new Parent();
        assert.throws(function () { parent.prepend(new Node()); });
        assert.throws(function () { parent.prepend({}); });
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
        assert.throws(function () { parent.append(); });
        assert.throws(function () { parent.append(null); });
        assert.throws(function () { parent.append(undefined); });
        assert.throws(function () { parent.append(false); });
    });

    it('should throw when non-removable nodes are appended (e.g., not inheriting from TextOM.Child)', function () {
        var parent = new Parent();
        assert.throws(function () { parent.append(new Node()); });
        assert.throws(function () { parent.append({}); });
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
        assert.throws(function () { parent.item('string'); });
        assert.throws(function () { parent.item(0/0); });
        assert.throws(function () { parent.item(true); });
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

describe('TextOM.child#parent', function () {
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

describe('TextOM.child#prev', function () {
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

describe('TextOM.child#next', function () {
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
        assert.throws(function () { (new Child()).before(new Child()); });
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.before(); });
        assert.throws(function () { child.before(null); });
        assert.throws(function () { child.before(undefined); });
        assert.throws(function () { child.before(false); });
    });

    it('should throw when non-removable nodes are prepended (e.g., not inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.before(new Node()); });
        assert.throws(function () { child.before({}); });
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
        assert.throws(function () { (new Child()).after(new Child()); });
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.after(); });
        assert.throws(function () { child.after(null); });
        assert.throws(function () { child.after(undefined); });
        assert.throws(function () { child.after(false); });
    });

    it('should throw when non-removable nodes are appended (e.g., not inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.after(new Node()); });
        assert.throws(function () { child.after({}); });
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
        assert.throws(function () { (new Child()).replace(new Child()); });
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.replace(); });
        assert.throws(function () { child.replace(null); });
        assert.throws(function () { child.replace(undefined); });
        assert.throws(function () { child.replace(false); });
    });

    it('should throw when non-removable nodes are given (e.g., not inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () { child.replace(new Node()); });
        assert.throws(function () { child.replace({}); });
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

        assert.throws(function () { box.split(); });
    });

    it('should throw when a position was given, not of type number', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        assert.throws(function () { box.split('failure'); });
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

    it('should NOT throw when NaN, Infinity, or -Infinity are given (but treat it as `0`)', function () {
        var parent = new Parent(),
            box = parent.append(new Text('alfred'));

        box.split(NaN);

        assert(box.toString() === 'alfred');
        assert(box.prev.toString() === '');

        box.split(Infinity);

        assert(box.toString() === 'alfred');
        assert(box.prev.toString() === '');

        box.split(-Infinity);

        assert(box.toString() === 'alfred');
        assert(box.prev.toString() === '');
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
        assert.throws(function () { range.setStart(); });
        assert.throws(function () { range.setStart(false); });
    });

    it('should throw when an unattached node is given', function () {
        var range = new Range();
        assert.throws(function () { range.setStart(new Child()); });
        assert.throws(function () { range.setStart(new Parent()); });
    });

    it('should throw when a negative offset is given', function () {
        var child = (new Parent()).append(new Child());
        assert.throws(function () { (new Range()).setStart(child, -1); });
        assert.throws(function () { (new Range()).setStart(child, -Infinity); });
    });

    it('should throw when NaN or something other than a number is given', function () {
        var child = (new Parent()).append(new Child());
        assert.throws(function () { (new Range()).setStart(child, NaN); });
        assert.throws(function () { (new Range()).setStart(child, 'failure'); });
    });

    it('should throw when an offset greater than the length of the node is given', function () {
        var parent = new Parent(),
            parent_ = new Parent(),
            child = new Child(),
            child_ = new Child();

        // Fool code to think parent is attached;
        parent_.parent = parent;
        parent[0] = parent.head = parent_;

        parent_.append(child);
        parent_.append(child_);

        assert.throws(function () { (new Range()).setStart(parent_, 3); });
        assert.throws(function () { (new Range()).setStart(parent_, Infinity); });
    });

    it('should throw when `endContainer` does not share the same root as the given node', function () {
        var range = new Range(),
           parent = new Parent(),
           parent_ = new Parent(),
           child = parent.append(new Text('alfred')),
           child_ = parent_.append(new Text('bertrand'));

        range.setEnd(child_);
        assert.throws(function () { range.setStart(child); });
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

        /* parent[ child ]*/

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
        assert.throws(function () { range.setEnd(); });
        assert.throws(function () { range.setEnd(false); });
    });

    it('should throw when an unattached node is given', function () {
        var range = new Range();
        assert.throws(function () { range.setEnd(new Child()); });
        assert.throws(function () { range.setEnd(new Parent()); });
    });

    it('should throw when a negative offset is given', function () {
        var child = (new Parent()).append(new Child());
        assert.throws(function () { (new Range()).setEnd(child, -1); });
        assert.throws(function () { (new Range()).setEnd(child, -Infinity); });
    });

    it('should throw when NaN or something other than a number is given', function () {
        var child = (new Parent()).append(new Child());
        assert.throws(function () { (new Range()).setEnd(child, NaN); });
        assert.throws(function () { (new Range()).setEnd(child, 'failure'); });
    });

    it('should throw when an offset greater than the length of the node is given', function () {
        var parent = new Parent(),
            parent_ = new Parent(),
            child = new Child(),
            child_ = new Child();

        // Fool code to think parent is attached;
        parent_.parent = parent;
        parent[0] = parent.head = parent_;

        parent_.append(child);
        parent_.append(child_);

        assert.throws(function () { (new Range()).setEnd(parent_, 3); });
        assert.throws(function () { (new Range()).setEnd(parent_, Infinity); });
    });

    it('should throw when `startContainer` does not share the same root as the given node', function () {
        var range = new Range(),
           parent = new Parent(),
           parent_ = new Parent(),
           child = parent.append(new Text('alfred')),
           child_ = parent_.append(new Text('bertrand'));

        range.setStart(child);
        assert.throws(function () { range.setEnd(child_); });
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
        assert(range.endContainer === parent3);
        assert(range.startContainer === child7);

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
            child = parent.append(new Text('')),
            child_ = parent.append(new Text('bertrand'));

        range.setStart(child);
        range.setEnd(child_, 6);
        assert(range.toString() === 'bertra');
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


'use strict';

/**
 * Dependencies.
 */

var TextOMConstructor,
    assert;

TextOMConstructor = require('..');
assert = require('assert');

/**
 * Constants.
 */

var TextOM,
    Node,
    Parent,
    Child,
    Element,
    Text,
    RootNode,
    ParagraphNode,
    SentenceNode,
    WordNode,
    PunctuationNode,
    WhiteSpaceNode,
    SourceNode,
    TextNode,
    nodePrototype,
    parentPrototype,
    childPrototype;

TextOM = new TextOMConstructor();
Node = TextOM.Node;
Parent = TextOM.Parent;
Child = TextOM.Child;
Element = TextOM.Element;
Text = TextOM.Text;

RootNode = TextOM.RootNode;
ParagraphNode = TextOM.ParagraphNode;
SentenceNode = TextOM.SentenceNode;
WordNode = TextOM.WordNode;
PunctuationNode = TextOM.PunctuationNode;
WhiteSpaceNode = TextOM.WhiteSpaceNode;
SourceNode = TextOM.SourceNode;
TextNode = TextOM.TextNode;

nodePrototype = Node.prototype;
parentPrototype = Parent.prototype;
childPrototype = Child.prototype;

/* istanbul ignore next: noop */
function noop() {}

/* istanbul ignore next: noop */
function altNoop() {}

var has;

has = Object.prototype.hasOwnProperty;

/**
 * Tests.
 */

describe('TextOMConstructor', function () {
    it('should be a `function`', function () {
        assert(typeof TextOMConstructor === 'function');
    });

    it('should construct a new `TextOM`', function () {
        var TextOM2,
            node1,
            node2;

        TextOM2 = new TextOMConstructor();
        node1 = new TextOM.Node();
        node2 = new TextOM2.Node();

        assert(node1 instanceof node1.constructor);
        assert(!(node1 instanceof node2.constructor));
        assert(node2 instanceof node2.constructor);
        assert(!(node2 instanceof node1.constructor));
    });
});

describe('TextOM', function () {
    it('should have a `ROOT_NODE` property equal to the `type` property ' +
        'on an instance of `RootNode`',
        function () {
            assert(TextOM.ROOT_NODE === new RootNode().type);
        }
    );

    it('should have a `PARAGRAPH_NODE` property equal to the `type` ' +
        'property on an instance of `ParagraphNode`',
        function () {
            assert(TextOM.PARAGRAPH_NODE === new ParagraphNode().type);
        }
    );

    it('should have a `SENTENCE_NODE` property equal to the `type` ' +
        'property on an instance of `SentenceNode`',
        function () {
            assert(TextOM.SENTENCE_NODE === new SentenceNode().type);
        }
    );

    it('should have a `WORD_NODE` property equal to the `type` property ' +
        'on an instance of `WordNode`',
        function () {
            assert(TextOM.WORD_NODE === new WordNode().type);
        }
    );

    it('should have a `PUNCTUATION_NODE` property equal to the `type` ' +
        'property on an instance of `PunctuationNode`',
        function () {
            assert(TextOM.PUNCTUATION_NODE === new PunctuationNode().type);
        }
    );

    it('should have a `WHITE_SPACE_NODE` property equal to the `type` ' +
        'property on an instance of `WhiteSpaceNode`',
        function () {
            assert(TextOM.WHITE_SPACE_NODE === new WhiteSpaceNode().type);
        }
    );

    it('should have a `SOURCE_NODE` property equal to the `type` property ' +
        'on an instance of `SourceNode`',
        function () {
            assert(TextOM.SOURCE_NODE === new SourceNode().type);
        }
    );

    it('should have a `TEXT_NODE` property equal to the `type` property ' +
        'on an instance of `TextNode`',
        function () {
            assert(TextOM.TEXT_NODE === new TextNode().type);
        }
    );

    it('should have a `NODE` property equal to the `nodeName` property ' +
        'on an instance of `Node`',
        function () {
            assert(TextOM.NODE === new Node().nodeName);
        }
    );

    it('should have a `PARENT` property equal to the `nodeName` property ' +
        'on an instance of `Parent`',
        function () {
            assert(TextOM.PARENT === new Parent().nodeName);
        }
    );

    it('should have a `CHILD` property equal to the `nodeName` property ' +
        'on an instance of `Child`',
        function () {
            assert(TextOM.CHILD === new Child().nodeName);
        }
    );

    it('should have a `ELEMENT` property equal to the `nodeName` property ' +
        'on an instance of `Element`',
        function () {
            assert(TextOM.ELEMENT === new Element().nodeName);
        }
    );

    it('should have a `TEXT` property equal to the `nodeName` property ' +
        'on an instance of `Text`',
        function () {
            assert(TextOM.TEXT === new Text().nodeName);
        }
    );
});

describe('TextOM.Node', function () {
    it('should be a `function`', function () {
        assert(typeof Node === 'function');
    });

    it('should set a `data` property to an object on the newly constructed' +
        'instance',
        function () {
            var node;

            node = new Node();

            assert(has.call(node, 'data'));

            assert(
                Object.prototype.toString.call(node.data) ===
                '[object Object]'
            );
        }
    );
});

describe('TextOM.Node.isImplementedBy', function () {
    it('should be a `function`', function () {
        assert(typeof Node.isImplementedBy === 'function');
    });

    it('should add the properties of the operated on context ' +
        'to the given constructor',
        function () {
            var property;

            /* istanbul ignore next */
            function CustomNode() {}

            Node.isImplementedBy(CustomNode);

            for (property in Node) {
                /* istanbul ignore else */
                if (has.call(Node, property)) {
                    assert(property in CustomNode);
                    assert(CustomNode[property] === Node[property]);
                }
            }
        }
    );

    it('should add the operated on context as a prototype to the given ' +
        'constructor',
        function () {
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
        'prototype',
        function () {
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
        'constructors prototype',
        function () {
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
    it('should be a `function`', function () {
        assert(typeof Node.on === 'function');
    });
});

describe('TextOM.Node.off', function () {
    it('should be a `function`', function () {
        assert(typeof Node.off === 'function');
    });
});

describe('TextOM.Node#NODE', function () {
    it('should have a `NODE` property equal to the `nodeName` property ' +
        'on an instance of `Node`',
        function () {
            assert(nodePrototype.NODE === new Node().nodeName);
        }
    );
});

describe('TextOM.Node#PARENT', function () {
    it('should have a `PARENT` property equal to the `nodeName` property ' +
        'on an instance of `Parent`',
        function () {
            assert(nodePrototype.PARENT === new Parent().nodeName);
        }
    );
});

describe('TextOM.Node#CHILD', function () {
    it('should have a `CHILD` property equal to the `nodeName` property ' +
        'on an instance of `Child`',
        function () {
            assert(nodePrototype.CHILD === new Child().nodeName);
        }
    );
});

describe('TextOM.Node#ELEMENT', function () {
    it('should have a `ELEMENT` property equal to the `nodeName` property ' +
        'on an instance of `Element`',
        function () {
            assert(nodePrototype.ELEMENT === new Element().nodeName);
        }
    );
});

describe('TextOM.Node#TEXT', function () {
    it('should have a `TEXT` property equal to the `nodeName` property ' +
        'on an instance of `Text`',
        function () {
            assert(nodePrototype.TEXT === new Text().nodeName);
        }
    );
});

describe('TextOM.Node#ROOT_NODE', function () {
    it('should be equal to the `type` property on an instance of `RootNode`',
        function () {
            assert(nodePrototype.ROOT_NODE === new RootNode().type);
        }
    );
});

describe('TextOM.Node#PARAGRAPH_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`ParagraphNode`',
        function () {
            assert(nodePrototype.PARAGRAPH_NODE === new ParagraphNode().type);
        }
    );
});

describe('TextOM.Node#SENTENCE_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`SentenceNode`',
        function () {
            assert(nodePrototype.SENTENCE_NODE === new SentenceNode().type);
        }
    );
});

describe('TextOM.Node#WORD_NODE', function () {
    it('should be equal to the `type` property on an instance of `WordNode`',
        function () {
            assert(nodePrototype.WORD_NODE === new WordNode().type);
        }
    );
});

describe('TextOM.Node#PUNCTUATION_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`PunctuationNode`',
        function () {
            assert(
                nodePrototype.PUNCTUATION_NODE === new PunctuationNode().type
            );
        }
    );
});

describe('TextOM.Node#WHITE_SPACE_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`WhiteSpaceNode`',
        function () {
            assert(
                nodePrototype.WHITE_SPACE_NODE === new WhiteSpaceNode().type
            );
        }
    );
});

describe('TextOM.Node#SOURCE_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`SourceNode`',
        function () {
            assert(nodePrototype.SOURCE_NODE === new SourceNode().type);
        }
    );
});

describe('TextOM.Node#TEXT_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`TextNode`',
        function () {
            assert(nodePrototype.TEXT_NODE === new TextNode().type);
        }
    );
});

describe('TextOM.Node#on(name, callback)', function () {
    it('should be a `function`', function () {
        assert(typeof nodePrototype.on === 'function');
    });

    it('should NOT throw, when no arguments are given, but return the ' +
        'current context',
        function () {
            var node;

            assert.doesNotThrow(function () {
                new Node().on();
            });

            node = new Node();

            assert(node.on() === node);
        }
    );

    it('should NOT throw, when a name but no callback is given, but ' +
        'return the current context',
        function () {
            var node;

            assert.doesNotThrow(function () {
                new Node().on('test');
            });

            node = new Node();

            assert(node.on('test') === node);
        }
    );

    it('should throw, when an invalid name is given', function () {
        assert.throws(function () {
            new Node().on(true);
        });
    });

    it('should throw, when an invalid callback is given', function () {
        assert.throws(function () {
            new Node().on('test', true);
        });
    });

    it('should set a `callbacks` attribute on the instance, when a name ' +
        'and callback is given',
        function () {
            var node;

            node = new Node();

            assert(!('callbacks' in node));

            node.on('test', noop);

            assert('callbacks' in node);
        }
    );

    it('should add the callback, when a name and a callback are given',
        function () {
            var node;

            node = new Node();

            assert(!('callbacks' in node));

            node.on('test', noop);

            assert('callbacks' in node);
            assert('test' in node.callbacks);
            assert(node.callbacks.test[0] === noop);
        }
    );
});

describe('TextOM.Node#off(name?, callback?)', function () {
    it('should be a `function`', function () {
        assert(typeof nodePrototype.off === 'function');
    });

    it('should NOT throw, when no arguments are given, but return the ' +
        'current context',
        function () {
            var node;

            assert.doesNotThrow(function () {
                new Node().off();
            });

            node = new Node();

            assert(node.off() === node);
        }
    );

    it('should throw, when an invalid name is given', function () {
        assert.throws(function () {
            new Node().off(false);
        });
    });

    it('should throw, when an invalid callback is given', function () {
        var node;

        node = new Node();

        node.on('test', noop);

        assert.throws(function () {
            node.off('test', false);
        });
    });

    it('should NOT throw, when valid arguments are given, but no listeners ' +
        'are subscribed, but return the current context',
        function () {
            var node;

            node = new Node();

            assert.doesNotThrow(function () {
                assert(node.off('test') === node);
            });
        }
    );

    it('should NOT throw, when listeners to the given name do not exist, ' +
        'but return the current context',
        function () {
            var node;

            node = new Node();
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
        'the current context',
        function () {
            var node;

            node = new Node();

            node.on('test', noop);

            assert.doesNotThrow(function () {
                assert(node.off(null, noop) === node);
            });
        }
    );

    it('should remove all callbacks, when no name and no callback is given',
        function () {
            var node;

            node = new Node();

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
        'callback are given',
        function () {
            var node;

            node = new Node();

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
            var node;

            node = new Node();

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

describe('TextOM.Node#emit(name, values...)', function () {
    it('should be a `function`', function () {
        assert(typeof nodePrototype.emit === 'function');
    });
});

describe('TextOM.Node#trigger(name, values...)', function () {
    it('should be a `function`', function () {
        assert(typeof nodePrototype.trigger === 'function');
    });
});

describe('TextOM.Parent', function () {
    it('should be a `function`', function () {
        assert(typeof Parent === 'function');
    });

    it('should inherit from `Node`', function () {
        assert(new Parent() instanceof Node);
    });
});

describe('TextOM.Parent#head', function () {
    it('should be `null` when no child exist', function () {
        assert(parentPrototype.head === null);
        assert(new Parent().head === null);
    });

    it('should be the first child when one or more children exist',
        function () {
            var parent;

            parent = new Parent();

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
        assert(new Parent().tail === null);
    });

    it('should be `null` when one (1) child exist', function () {
        var parent;

        parent = new Parent();

        parent.append(new Child());

        assert(parent.tail === null);
    });

    it('should be the last child when two or more children exist',
        function () {
            var parent;

            parent = new Parent();

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

        assert(new Parent().length === 0);
    });

    it('should be the number of children when one or more children exist',
        function () {
            var parent;

            parent = new Parent();

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
        var parent;

        parent = new Parent();

        assert.throws(function () {
            parent.prepend();
        }, /undefined/);

        assert.throws(function () {
            parent.prepend(null);
        }, /null/);

        assert.throws(function () {
            parent.prepend(undefined);
        }, /undefined/);

        assert.throws(function () {
            parent.prepend(false);
        }, /false/);
    });

    it('should throw when non-removable nodes are prepended (e.g., not ' +
        'inheriting from TextOM.Child)',
        function () {
            var parent;

            parent = new Parent();

            assert.throws(function () {
                parent.prepend(new Node());
            }, /remove/);

            assert.throws(function () {
                parent.prepend({});
            }, /remove/);
        }
    );

    it('should throw when prepending a node into itself', function () {
        var element;

        element = new Element();

        assert.throws(function () {
            element.prepend(element);
        }, /HierarchyError/);
    });

    it('should call the `remove` method on the prependee', function () {
        var parent,
            node,
            nodeRemove,
            isCalled;

        parent = new Parent();
        node = new Child();

        nodeRemove = node.remove;

        isCalled = false;

        node.remove = function () {
            isCalled = true;
            nodeRemove.apply(this, arguments);
        };

        parent.prepend(node);

        assert(isCalled === true);
    });

    it('should set the `parent` property on the prependee to the operated ' +
        'on parent',
        function () {
            var parent,
                node,
                node1;

            parent = new Parent();
            node = new Child();
            node1 = new Child();

            parent.prepend(node);

            assert(node.parent === parent);

            parent.prepend(node1);

            assert(node1.parent === parent);
        }
    );

    it('should set the `head` and `0` properties to the prepended node',
        function () {
            var parent,
                node;

            parent = new Parent();
            node = new Child();

            parent.prepend(node);

            assert(parent.head === node);
            assert(parent[0] === node);
        }
    );

    it('should set the `tail` and `1` properties to the previous `head`, ' +
        'when no `tail` exists',
        function () {
            var parent,
                node,
                node1;

            parent = new Parent();
            node = new Child();
            node1 = new Child();

            parent.prepend(node);
            parent.prepend(node1);

            assert(parent.tail === node);
            assert(parent[1] === node);
        }
    );

    it('should set the `head` and `0` properties to further prepended nodes',
        function () {
            var parent,
                node,
                node1,
                node2;

            parent = new Parent();
            node = new Child();
            node1 = new Child();
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
        'previous `head`',
        function () {
            var parent,
                node,
                node1;

            parent = new Parent();
            node = new Child();
            node1 = new Child();

            parent.prepend(node);

            assert(node.next === null);

            parent.prepend(node1);

            assert(node1.next === node);
        }
    );

    it('should set the `prev` property on the parents previous `head` to ' +
        'the prependee',
        function () {
            var parent,
                node,
                node1;

            parent = new Parent();
            node = new Child();
            node1 = new Child();

            parent.prepend(node);

            parent.prepend(node1);

            assert(node.prev === node1);
        }
    );

    it('should update the `length` property to correspond to the number ' +
        'of prepended children',
        function () {
            var parent,
                node,
                node1,
                node2;

            parent = new Parent();
            node = new Child();
            node1 = new Child();
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
        var parent,
            child,
            child1,
            child2,
            child3;

        parent = new Parent();
        child = new Child();
        child1 = new Child();
        child2 = new Child();
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
        var parent,
            node;

        parent = new Parent();
        node = new Child();

        assert(node === parent.prepend(node));
    });
});

describe('TextOM.Parent#append(childNode)', function () {
    it('should throw when falsey values are provided', function () {
        var parent;

        parent = new Parent();

        assert.throws(function () {
            parent.append();
        }, /undefined/);

        assert.throws(function () {
            parent.append(null);
        }, /null/);

        assert.throws(function () {
            parent.append(undefined);
        }, /undefined/);

        assert.throws(function () {
            parent.append(false);
        }, /false/);
    });

    it('should throw when non-removable nodes are appended (e.g., not ' +
        'inheriting from TextOM.Child)',
        function () {
            var parent;

            parent = new Parent();

            assert.throws(function () {
                parent.append(new Node());
            }, /remove/);

            assert.throws(function () {
                parent.append({});
            }, /remove/);
        }
    );

    it('should throw when appending a node into itself', function () {
        var element;

        element = new Element();

        assert.throws(function () {
            element.append(element);
        }, /HierarchyError/);
    });

    it('should call the `remove` method on the appendee', function () {
        var parent,
            node,
            nodeRemove,
            isCalled;

        parent = new Parent();
        node = new Child();
        nodeRemove = node.remove;
        isCalled = false;

        node.remove = function () {
            isCalled = true;
            nodeRemove.apply(this, arguments);
        };

        parent.append(node);

        assert(isCalled === true);
    });

    it('should set the `parent` property on the appendee to the operated ' +
        'on parent',
        function () {
            var parent,
                node,
                node1;

            parent = new Parent();
            node = new Child();
            node1 = new Child();

            parent.append(node);

            assert(node.parent === parent);

            parent.append(node1);

            assert(node1.parent === parent);
        }
    );

    it('should set the `head` and `0` properties to the appended node, ' +
        'when no `head` exists',
        function () {
            var parent,
                node;

            parent = new Parent();
            node = new Child();

            parent.append(node);

            assert(parent.head === node);
            assert(parent[0] === node);
        }
    );

    it('should set the `tail` and `1` properties to the appended node, ' +
        'when no `tail` exists',
        function () {
            var parent,
                node,
                node1;

            parent = new Parent();
            node = new Child();
            node1 = new Child();

            parent.append(node);
            parent.append(node1);

            assert(parent.tail === node1);
            assert(parent[1] === node1);
        }
    );

    it('should set the `tail`, and `length - 1`, properties to further ' +
        'appended nodes',
        function () {
            var parent,
                node,
                node1,
                node2;

            parent = new Parent();
            node = new Child();
            node1 = new Child();
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
        'previous `tail` (or `head`, when no `tail` exists)',
        function () {
            var parent,
                node,
                node1,
                node2;

            parent = new Parent();
            node = new Child();
            node1 = new Child();
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
        '`head`, when no `tail` exists) to the appendee',
        function () {
            var parent,
                node,
                node1,
                node2;

            parent = new Parent();
            node = new Child();
            node1 = new Child();
            node2 = new Child();

            parent.append(node);

            parent.append(node1);

            assert(node.next === node1);

            parent.append(node2);

            assert(node1.next === node2);
        }
    );

    it('should update the `length` property to correspond to the number of ' +
        'appended children',
        function () {
            var parent,
                node,
                node1,
                node2;

            parent = new Parent();
            node = new Child();
            node1 = new Child();
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
        var parent,
            node;

        parent = new Parent();
        node = new Child();

        assert(node === parent.append(node));
    });
});

describe('TextOM.Parent#item(index?)', function () {
    it('should throw on non-nully, non-number (including NaN) values',
        function () {
            var parent;

            parent = new Parent();

            assert.throws(function () {
                parent.item('string');
            }, /string/);

            assert.throws(function () {
                parent.item(0 / 0);
            }, /NaN/);

            assert.throws(function () {
                parent.item(true);
            }, /true/);
        }
    );

    it('should return the first child when the given index is either null, ' +
        'undefined, or not given',
        function () {
            var parent;

            parent = new Parent();

            parent[0] = new Node();

            assert(parent.item(null) === parent[0]);
            assert(parent.item(undefined) === parent[0]);
            assert(parent.item() === parent[0]);
        }
    );

    it('should return a child at a given index when available, and null ' +
        'otherwise',
        function () {
            var parent;

            parent = new Parent();

            parent[0] = new Node();
            parent[1] = new Node();
            parent[2] = new Node();

            assert(parent.item(0) === parent[0]);
            assert(parent.item(1) === parent[1]);
            assert(parent.item(2) === parent[2]);
            assert(parent.item(3) === null);
        }
    );
});

describe('TextOM.Parent#split(position)', function () {
    it('should throw when the operated on item is not attached',
        function () {
            var parent;

            parent = new Parent();

            assert.throws(function () {
                parent.split();
            }, /undefined/);
        }
    );

    it('should throw when a position was given, not a number',
        function () {
            var parent,
                element;

            parent = new Parent();

            element = parent.append(new Element());

            assert.throws(function () {
                element.split('failure');
            }, /failure/);
        }
    );

    it('should return a new instance() of the operated on item',
        function () {
            var parent,
                element;

            parent = new Parent();

            element = parent.append(new Element());

            assert(element.split() instanceof element.constructor);
        }
    );

    it('should treat a given negative position, as an position from the ' +
        'end (e.g., when the internal value of element is `alfred`, treat ' +
        '`-1` as `5`)',
        function () {
            var parent,
                element;

            parent = new Parent();

            element = parent.append(new Element());

            element.append(new Text('alfred'));
            element.append(new Text('bertrand'));

            element.split(-1);

            assert(element.toString() === 'bertrand');
            assert(element.prev.toString() === 'alfred');
        }
    );

    it('should NOT throw when NaN, or -Infinity are given (but treat it ' +
        'as `0`)',
        function () {
            var parent,
                element;

            parent = new Parent();

            element = parent.append(new Element());

            element.append(new Text('alfred'));
            element.append(new Text('bertrand'));

            element.split(NaN);

            assert(element.toString() === 'alfredbertrand');
            assert(element.prev.toString() === '');

            element.split(-Infinity);

            assert(element.toString() === 'alfredbertrand');
            assert(element.prev.toString() === '');
        }
    );

    it('should NOT throw when Infinity is given (but treat it as ' +
        '`this.length`)',
        function () {
            var parent,
                element;

            parent = new Parent();

            element = parent.append(new Element());

            element.append(new Text('alfred'));
            element.append(new Text('bertrand'));

            element.split(Infinity);

            assert(element.toString() === '');
            assert(element.prev.toString() === 'alfredbertrand');
        }
    );

    it('should NOT throw when a position greater than the length of the ' +
        'element is given (but treat it as `this.length`)',
        function () {
            var parent,
                element;

            parent = new Parent();
            element = parent.append(new Element());

            element.append(new Text('alfred'));
            element.append(new Text('bertrand'));

            element.split(3);

            assert(element.toString() === '');
            assert(element.prev.toString() === 'alfredbertrand');
        }
    );

    it('should NOT throw when a nully position is given, but treat it as ' +
        '`0`',
        function () {
            var parent,
                element;

            parent = new Parent();

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
        }
    );

    it('should remove the children of the current items value, from `0` to ' +
        'the given position',
        function () {
            var parent,
                element;

            parent = new Parent();

            element = parent.append(new Element());

            element.append(new Text('alfred'));
            element.append(new Text('bertrand'));

            element.split(1);

            assert(element.toString() === 'bertrand');
        }
    );

    it('should prepend a new instance() of the operated on item',
        function () {
            var parent,
                element;

            parent = new Parent();

            element = parent.append(new Element());

            element.split();

            assert(element.prev instanceof element.constructor);
        }
    );

    it('should move the part of the current items value, from `0` to the ' +
        'given position, to prepended item',
        function () {
            var parent,
                element;

            parent = new Parent();

            element = parent.append(new Element());

            element.append(new Text('alfred'));
            element.append(new Text('bertrand'));

            element.split(1);

            assert(element.prev.toString() === 'alfred');
        }
    );
});

describe('TextOM.Parent#toString', function () {
    it('should be a method', function () {
        assert(typeof parentPrototype.toString === 'function');
    });

    it('should return an empty string when no children are present',
        function () {
            assert(new Parent().toString() === '');
        }
    );

    it('should return the concatenation of its children\'s `toString` ' +
        'methods',
        function () {
            var node,
                head,
                tail;

            node = new Parent();
            head = new Node();
            tail = new Node();

            node.head = head;
            node.tail = tail;
            head.next = tail;

            head.toString = function () {
                return 'a ';
            };

            tail.toString = function () {
                return 'value';
            };

            assert(node.toString() === 'a value');
        }
    );
});

describe('TextOM.Child', function () {
    it('should be a `function`', function () {
        assert(typeof Child === 'function');
    });

    it('should inherit from `Node`', function () {
        assert(new Child() instanceof Node);
    });
});

describe('TextOM.Child#parent', function () {
    it('should be `null` when not attached', function () {
        assert(childPrototype.parent === null);
        assert(new Child().parent === null);
    });

    it('should be the parent when attached', function () {
        var parent,
            child;

        parent = new Parent();
        child = new Child();

        parent.append(child);

        assert(child.parent === parent);
    });
});

describe('TextOM.Child#prev', function () {
    it('should be `null` when not attached', function () {
        assert(childPrototype.prev === null);
        assert(new Child().prev === null);
    });

    it('should be `null` when attached, but no previous sibling exist',
        function () {
            var parent,
                child;

            parent = new Parent();

            child = new Child();

            parent.append(child);

            assert(child.prev === null);
        }
    );

    it('should be the previous sibling when it exists', function () {
        var parent,
            previousSibling,
            nextSibling;

        parent = new Parent();
        previousSibling = new Child();
        nextSibling = new Child();

        parent.append(previousSibling);
        parent.append(nextSibling);

        assert(nextSibling.prev === previousSibling);
    });
});

describe('TextOM.Child#next', function () {
    it('should be `null` when not attached', function () {
        assert(childPrototype.next === null);
        assert(new Child().next === null);
    });

    it('should be `null` when attached, but no next sibling exist',
        function () {
            var parent,
                child;

            parent = new Parent();
            child = new Child();

            parent.append(child);

            assert(child.next === null);
        }
    );

    it('should be the next sibling when it exists', function () {
        var parent,
            child,
            child1;

        parent = new Parent();
        child = new Child();
        child1 = new Child();

        parent.append(child);
        parent.append(child1);

        assert(child.next === child1);
    });
});

describe('TextOM.Child#before(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () {
            new Child().before(new Child());
        }, /parent/);
    });

    it('should throw when falsey values are provided', function () {
        var parent,
            child;

        parent = new Parent();
        child = new Child();

        parent.append(child);

        assert.throws(function () {
            child.before();
        }, /undefined/);

        assert.throws(function () {
            child.before(null);
        }, /null/);

        assert.throws(function () {
            child.before(undefined);
        }, /undefined/);

        assert.throws(function () {
            child.before(false);
        }, /false/);
    });

    it('should throw when non-removable nodes are prepended (e.g., not ' +
        'inheriting from TextOM.Child)',
        function () {
            var parent,
                child;

            parent = new Parent();
            child = new Child();

            parent.append(child);

            assert.throws(function () {
                child.before(new Node());
            }, /remove/);

            assert.throws(function () {
                child.before({});
            }, /remove/);
        }
    );

    it('should NOT throw when inserting a node before itself', function () {
        var parent,
            child;

        parent = new Parent();
        child = new Child();

        parent.append(child);

        assert.doesNotThrow(function () {
            child.before(child);
        });
    });

    it('should call the `remove` method on the prependee', function () {
        var parent,
            child,
            child1,
            childRemove,
            isCalled;

        parent = new Parent();
        child = new Child();
        child1 = new Child();

        parent.append(child);

        childRemove = child1.remove;
        isCalled = false;

        child1.remove = function () {
            isCalled = true;
            childRemove.apply(this, arguments);
        };

        child.before(child1);

        assert(isCalled === true);
    });

    it('should set the `parent` property on the prependee to the operated ' +
        'on nodes\' parent',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);

            child.before(child1);

            assert(child.parent === child1.parent);
        }
    );

    it('should set the parents `head` and `0` properties to the prepended ' +
        'node, when the operated on node is its parents `head`',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);
            child.before(child1);

            assert(parent.head === child1);
            assert(parent[0] === child1);
        }
    );

    it('should set the parents `tail` and `1` properties to the operated ' +
        'on node, when no `tail` exists',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);

            child.before(child1);

            assert(parent.tail === child);
            assert(parent[1] === child);
        }
    );

    it('should set the `prev` property to the operated on nodes\' `prev` ' +
        'property',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);

            child.before(child1);

            assert(child1.prev === null);

            child.before(child2);

            assert(child2.prev === child1);
        }
    );

    it('should set the `next` property to the operated on node',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);

            child.before(child1);

            assert(child1.next === child);

            child.before(child2);

            assert(child2.next === child);
        }
    );

    it('should update the parents `length` property to correspond to the' +
        'number of prepended children',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);

            child.before(child1);

            assert(parent.length === 2);

            child.before(child2);

            assert(parent.length === 3);
        }
    );

    it('should shift the indices of the operated on item, and its next' +
        'siblings',
        function () {
            var parent,
                child,
                child1,
                child2,
                child3;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();
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
        }
    );

    it('should return the prepended child', function () {
        var parent,
            child,
            child1;

        parent = new Parent();
        child = new Child();
        child1 = new Child();

        parent.append(child);

        assert(child1 === child.before(child1));
    });
});

describe('TextOM.Child#after(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () {
            new Child().after(new Child());
        }, /parent/);
    });

    it('should throw when falsey values are provided', function () {
        var parent,
            child;

        parent = new Parent();
        child = new Child();

        parent.append(child);

        assert.throws(function () {
            child.after();
        }, /undefined/);

        assert.throws(function () {
            child.after(null);
        }, /null/);

        assert.throws(function () {
            child.after(undefined);
        }, /undefined/);

        assert.throws(function () {
            child.after(false);
        }, /false/);
    });

    it('should throw when non-removable nodes are appended (e.g., not' +
        'inheriting from TextOM.Child)',
        function () {
            var parent,
                child;

            parent = new Parent();
            child = new Child();

            parent.append(child);

            assert.throws(function () {
                child.after(new Node());
            }, /remove/);

            assert.throws(function () {
                child.after({});
            }, /remove/);
        }
    );

    it('should NOT throw when inserting a node after itself', function () {
        var parent,
            child;

        parent = new Parent();
        child = new Child();

        parent.append(child);

        assert.doesNotThrow(function () {
            child.after(child);
        });
    });

    it('should call the `remove` method on the appendee', function () {
        var parent,
            child,
            child1,
            childRemove,
            isCalled;

        parent = new Parent();
        child = new Child();
        child1 = new Child();

        parent.append(child);

        childRemove = child1.remove;
        isCalled = false;

        child1.remove = function () {
            isCalled = true;

            childRemove.apply(this, arguments);
        };

        child.after(child1);

        assert(isCalled === true);
    });

    it('should set the `parent` property on the appendee to the operated on' +
        'nodes\' parent',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);

            child.after(child1);

            assert(child.parent === child1.parent);
        }
    );

    it('should set the parents `tail` and `1` properties to the appendee,' +
        'when no `tail` exists',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);
            child.after(child1);

            assert(parent.tail === child1);
            assert(parent[1] === child1);
        }
    );

    it('should set the parents `tail` and `1` properties to the appendee,' +
        'when the operated on item is the parents `tail`',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);
            parent.append(child1);
            child1.after(child2);

            assert(parent.tail === child2);
            assert(parent[2] === child2);
        }
    );

    it('should set the `next` property to the operated on nodes\' `next`' +
        'property',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);

            child.after(child1);

            assert(child1.next === null);

            child.after(child2);

            assert(child2.next === child1);
        }
    );

    it('should set the `prev` property to the operated on node',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);

            child.after(child1);

            assert(child1.prev === child);

            child.after(child2);

            assert(child2.prev === child);
        }
    );

    it('should update the parents `length` property to correspond to the' +
        'number of appended children',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);

            child.after(child1);

            assert(parent.length === 2);

            child.after(child2);

            assert(parent.length === 3);
        }
    );

    it('should shift the indices of the operated on items next siblings',
        function () {
            var parent,
                child,
                child1,
                child2,
                child3;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();
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
        var parent,
            child,
            child1;

        parent = new Parent();
        child = new Child();
        child1 = new Child();

        parent.append(child);

        assert(child1 === child.after(child1));
    });
});

describe('TextOM.Child#remove()', function () {
    it('should NOT throw when the operated on item is not attached',
        function () {
            assert.doesNotThrow(function () {
                new Child().remove();
            });
        }
    );

    it('should set the `parent` property on the operated on node to `null`',
        function () {
            var parent,
                child;

            parent = new Parent();
            child = new Child();

            parent.append(child);

            child.remove();

            assert(child.parent === null);
        }
    );

    it('should set the `prev` property on the operated on node to `null`',
        function () {
            var parent,
                child;

            parent = new Parent();
            child = new Child();

            parent.append(child);

            child.before(new Child());

            child.remove();

            assert(child.prev === null);
        }
    );

    it('should set the `next` property on the operated on node to `null`',
        function () {
            var parent,
                child;

            parent = new Parent();
            child = new Child();

            parent.append(child);

            child.after(new Child());

            child.remove();

            assert(child.next === null);
        }
    );

    it('should set the parents `head` property to the next sibling, when ' +
        'the operated on item has no previous sibling',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);
            parent.append(child1);
            parent.append(child2);

            child.remove();

            assert(parent.head === child1);

            child1.remove();

            assert(parent.head === child2);
        }
    );

    it('should set the parents `tail` property to the previous sibling, ' +
        'when the operated on item has no next sibling',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);
            parent.append(child1);
            parent.append(child2);

            child2.remove();

            assert(parent.tail === child1);
        }
    );

    it('should set the parents `tail` property to `null` when the ' +
        'operated on item is the current `tail`, and the current `head` ' +
        'is its previous sibling',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);
            parent.append(child1);

            child1.remove();

            assert(parent.tail === null);
        }
    );

    it('should set the parents `head` property to `null` when the operated ' +
        'on item is the current `head`, and no `tail` exists',
        function () {
            var parent,
                child;

            parent = new Parent();
            child = new Child();

            parent.append(child);
            child.remove();

            assert(parent.head === null);
        }
    );

    it('should decrease the parents `length` property by one (1), to ' +
        'correspond to the removed child',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
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
        }
    );

    it('should unshift the indices of the operated on items next siblings',
        function () {
            var parent,
                child,
                child1,
                child2,
                child3;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();
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
        var parent,
            child;

        parent = new Parent();
        child = new Child();

        assert(child === child.remove());

        parent.append(child);

        assert(child === child.remove());
    });
});

describe('TextOM.Child#replace(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () {
            new Child().replace(new Child());
        }, /parent/);
    });

    it('should throw when falsey values are provided', function () {
        var parent,
            child;

        parent = new Parent();
        child = new Child();

        parent.append(child);

        assert.throws(function () {
            child.replace();
        }, /undefined/);

        assert.throws(function () {
            child.replace(null);
        }, /null/);

        assert.throws(function () {
            child.replace(undefined);
        }, /undefined/);

        assert.throws(function () {
            child.replace(false);
        }, /false/);
    });

    it('should throw when non-removable nodes are given (e.g., not ' +
        'inheriting from TextOM.Child)',
        function () {
            var parent,
                child;

            parent = new Parent();
            child = new Child();

            parent.append(child);

            assert.throws(function () {
                child.replace(new Node());
            }, /remove/);

            assert.throws(function () {
                child.replace({});
            }, /remove/);
        }
    );

    it('should call the `remove` method on the replacee', function () {
        var parent,
            child,
            child1,
            childRemove,
            isCalled;

        parent = new Parent();
        child = new Child();
        child1 = new Child();

        childRemove = child1.remove;
        isCalled = false;

        parent.append(child);

        child1.remove = function () {
            isCalled = true;
            childRemove.apply(this, arguments);
        };

        child.replace(child1);

        assert(isCalled === true);
    });

    it('should set the `parent` property on the replacee to the operated ' +
        'on nodes\' parent',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);
            child.replace(child1);

            assert(parent === child1.parent);
        }
    );

    it('should set the `parent` property on the operated on node to `null`',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);
            child.replace(child1);

            assert(child.parent === null);
        }
    );

    it('should set the parents `head` properties to the replacee, when the ' +
        'operated on item is the current head',
        function () {
            var parent,
                child,
                child1;

            parent = new Parent();
            child = new Child();
            child1 = new Child();

            parent.append(child);
            child.replace(child1);

            assert(parent.head === child1);
        }
    );

    it('should set the parents `tail` property to the replacee, when the ' +
        'operated on item is the current tail',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);
            parent.append(child1);
            child1.replace(child2);

            assert(parent.tail === child2);
        }
    );

    it('should set the `next` property to the operated on nodes\' `next` ' +
        'property',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);
            parent.append(child1);
            child.replace(child2);

            assert(child2.next === child1);
        }
    );

    it('should set the `prev` property to the operated on nodes\' `prev` ' +
        'property',
        function () {
            var parent,
                child,
                child1,
                child2;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();

            parent.append(child);
            parent.append(child1);
            child1.replace(child2);

            assert(child2.prev === child);
        }
    );

    it('should NOT update the parents `length` property', function () {
        var parent,
            child,
            child1,
            child2;

        parent = new Parent();
        child = new Child();
        child1 = new Child();
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
            var parent,
                child,
                child1,
                child2,
                child3;

            parent = new Parent();
            child = new Child();
            child1 = new Child();
            child2 = new Child();
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
        var parent,
            child,
            child1;

        parent = new Parent();
        child = new Child();
        child1 = new Child();

        parent.append(child);

        assert(child1 === child.replace(child1));
    });
});

describe('TextOM.Element()', function () {
    it('should be a `function`', function () {
        assert(typeof Element === 'function');
    });

    /**
     * The following tests are a bit weird, because:
     *
     * - We need to ducktype because inheritance of both
     *   `Child` and `Parent` is impossible;
     * - Istanbul overwrites methods on prototypes to
     *   detect if they are invoked. Thus, what used to
     *   be the same method, is now overwritten.
     */

    it('should inherit from `Child`', function () {
        var element,
            key;

        element = new Element();

        for (key in childPrototype) {
            if (has.call(childPrototype, key)) {
                if (typeof childPrototype[key] === 'function') {
                    assert(key in element);
                } else if (!has.call(Element.prototype, key)) {
                    assert(element[key] === childPrototype[key]);
                }
            }
        }
    });

    it('should inherit from `Parent`', function () {
        var element,
            key;

        element = new Element();

        for (key in childPrototype) {
            if (has.call(parentPrototype, key)) {
                /* istanbul ignore else: maybe in the future? */
                if (typeof parentPrototype[key] === 'function') {
                    assert(key in element);
                } else if (!has.call(Element.prototype, key)) {
                    assert(element[key] === parentPrototype[key]);
                }
            }
        }
    });
});

describe('TextOM.Text(value?)', function () {
    it('should be a `function`', function () {
        assert(typeof Text === 'function');
    });

    it('should inherit from `Child`', function () {
        assert(new Text() instanceof Child);
    });
});

describe('TextOM.Text#toString()', function () {
    it('should return an empty string (`""`) when never set', function () {
        assert(new Text().toString() === '');
    });

    it('should return the set value otherwise', function () {
        assert(new Text('alfred').toString() === 'alfred');
    });
});

describe('TextOM.Text#fromString(value?)', function () {
    it('should (re)set an empty string (`""`) when a nully value is given',
        function () {
            var box;

            box = new Text('alfred');

            assert(box.fromString() === '');

            box.fromString('alfred');

            assert(box.fromString(null) === '');

            box.fromString('alfred');

            assert(box.fromString(undefined) === '');
        }
    );

    it('should return the set value otherwise', function () {
        var box;

        box = new Text();

        assert(box.fromString('alfred') === 'alfred');
        /* eslint-disable no-new-wrappers */
        assert(box.fromString(new String('alfred')) === 'alfred');
        /* eslint-enable no-new-wrappers */
    });
});

describe('TextOM.Text#split(position)', function () {
    it('should throw when the operated on item is not attached', function () {
        var box;

        box = new Text('alfred');

        assert.throws(function () {
            box.split();
        }, /parent/);
    });

    it('should throw when a position was given, not a number',
        function () {
            var parent,
                box;

            parent = new Parent();
            box = parent.append(new Text('alfred'));

            assert.throws(function () {
                box.split('failure');
            }, /failure/);
        }
    );

    it('should return a new instance() of the operated on item', function () {
        var parent,
            box;

        parent = new Parent();
        box = parent.append(new Text(''));

        assert(box.split() instanceof box.constructor);
    });

    it('should treat a given negative position, as an position from the ' +
        'end (e.g., when the internal value of box is `alfred`, treat ' +
        '`-1` as `5`)',
        function () {
            var parent,
                box;

            parent = new Parent();
            box = parent.append(new Text('alfred'));

            box.split(-1);

            assert(box.toString() === 'd');
            assert(box.prev.toString() === 'alfre');
        }
    );

    it('should NOT throw when NaN, or -Infinity are given (but treat it as ' +
        '`0`)',
        function () {
            var parent,
                box;

            parent = new Parent();
            box = parent.append(new Text('alfred'));

            box.split(NaN);

            assert(box.toString() === 'alfred');
            assert(box.prev.toString() === '');

            box.split(-Infinity);

            assert(box.toString() === 'alfred');
            assert(box.prev.toString() === '');
        }
    );

    it('should NOT throw when Infinity is given (but treat it as ' +
        '`value.length`)',
        function () {
            var parent,
                box;

            parent = new Parent();
            box = parent.append(new Text('alfred'));

            box.split(Infinity);

            assert(box.toString() === '');
            assert(box.prev.toString() === 'alfred');
        }
    );

    it('should NOT throw when a position greater than the length of the ' +
        'box is given (but treat it as `this.value.length`)',
        function () {
            var parent,
                box;

            parent = new Parent();
            box = parent.append(new Text('alfred'));

            box.split(7);

            assert(box.toString() === '');
            assert(box.prev.toString() === 'alfred');
        }
    );

    it('should NOT throw when a nully position is given, but treat it as `0`',
        function () {
            var parent,
                box;

            parent = new Parent();
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
        'given position',
        function () {
            var parent,
                box;

            parent = new Parent();
            box = parent.append(new Text('alfred'));

            box.split(2);

            assert(box.toString() === 'fred');
        }
    );

    it('should prepend a new instance() of the operated on item',
        function () {
            var parent,
                box;

            parent = new Parent();
            box = parent.append(new Text('alfred'));

            box.split(2);

            assert(box.prev instanceof box.constructor);
        }
    );

    it('should move the part of the current items value, from `0` to the' +
        'given position, to prepended item',
        function () {
            var parent,
                box;

            parent = new Parent();
            box = parent.append(new Text('alfred'));

            box.split(2);

            assert(box.prev.toString() === 'al');
        }
    );
});

describe('TextOM.RootNode()', function () {
    it('should be a `function`', function () {
        assert(typeof RootNode === 'function');
    });

    it('should inherit from `Parent`', function () {
        assert(new RootNode() instanceof Parent);
    });

    it('TextOM.RootNode#nodeName should be equal to Node#PARENT',
        function () {
            assert(new RootNode().nodeName === nodePrototype.PARENT);
        }
    );
});

describe('TextOM.ParagraphNode()', function () {
    it('should be a `function`', function () {
        assert(typeof ParagraphNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert(new ParagraphNode() instanceof Element);
    });

    it('TextOM.ParagraphNode#nodeName should be equal to Node#ELEMENT',
        function () {
            assert(new ParagraphNode().nodeName === nodePrototype.ELEMENT);
        }
    );
});

describe('TextOM.SentenceNode()', function () {
    it('should be a `function`', function () {
        assert(typeof SentenceNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert(new SentenceNode() instanceof Element);
    });

    it('TextOM.SentenceNode#nodeName should be equal to Node#ELEMENT',
        function () {
            assert(new SentenceNode().nodeName === nodePrototype.ELEMENT);
        }
    );
});

describe('TextOM.WordNode()', function () {
    it('should be a `function`', function () {
        assert(typeof WordNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert(new WordNode() instanceof Element);
    });

    it('TextOM.WordNode#nodeName should be equal to Node#ELEMENT',
        function () {
            assert(new WordNode().nodeName === nodePrototype.ELEMENT);
        }
    );
});

describe('TextOM.PunctuationNode()', function () {
    it('should be a `function`', function () {
        assert(typeof PunctuationNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert(new PunctuationNode() instanceof Element);
    });

    it('TextOM.PunctuationNode#nodeName should be equal to Node#ELEMENT',
        function () {
            assert(new PunctuationNode().nodeName === nodePrototype.ELEMENT);
        }
    );
});

describe('TextOM.WhiteSpaceNode()', function () {
    it('should be a `function`', function () {
        assert(typeof WhiteSpaceNode === 'function');
    });

    it('should inherit from `Element`', function () {
        assert(new WhiteSpaceNode() instanceof Element);
    });

    it('should inherit from `PunctuationNode`', function () {
        assert(new WhiteSpaceNode() instanceof PunctuationNode);
    });

    it('TextOM.WhiteSpaceNode#nodeName should be equal to Node#ELEMENT',
        function () {
            assert(new WhiteSpaceNode().nodeName === nodePrototype.ELEMENT);
        }
    );
});

describe('TextOM.SourceNode()', function () {
    it('should be a `function`', function () {
        assert(typeof SourceNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert(new SourceNode() instanceof Text);
    });

    it('TextOM.SourceNode#nodeName should be equal to Node#TEXT',
        function () {
            assert(new SourceNode().nodeName === nodePrototype.TEXT);
        }
    );
});

describe('TextOM.TextNode()', function () {
    it('should be a `function`', function () {
        assert(typeof TextNode === 'function');
    });

    it('should inherit from `Text`', function () {
        assert(new TextNode() instanceof Text);
    });

    it('TextOM.TextNode#nodeName should be equal to Node#TEXT',
        function () {
            assert(new TextNode().nodeName === nodePrototype.TEXT);
        }
    );
});

describe('HierarchyError', function () {
    it('should throw when appending a `RootNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                new RootNode().append(new RootNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `ParagraphNode` to a `RootNode`',
        function () {
            assert.doesNotThrow(function () {
                new RootNode().append(new ParagraphNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `SentenceNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                new RootNode().append(new SentenceNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `WordNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                new RootNode().append(new WordNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `PunctuationNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                new RootNode().append(new PunctuationNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a `RootNode`',
        function () {
            assert.doesNotThrow(function () {
                new RootNode().append(new WhiteSpaceNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `SourceNode` to a `RootNode`',
        function () {
            assert.doesNotThrow(function () {
                new RootNode().append(new SourceNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `TextNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                new RootNode().append(new TextNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `RootNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                new ParagraphNode().append(new RootNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `ParagraphNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                new ParagraphNode().append(
                    new ParagraphNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `SentenceNode` to a ' +
        '`ParagraphNode`',
        function () {
            assert.doesNotThrow(function () {
                new ParagraphNode().append(
                    new SentenceNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `WordNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                new ParagraphNode().append(new WordNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `PunctuationNode` to a ' +
        '`ParagraphNode`',
        function () {
            assert.throws(function () {
                new ParagraphNode().append(
                    new PunctuationNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a ' +
        '`ParagraphNode`',
        function () {
            assert.doesNotThrow(function () {
                new ParagraphNode().append(
                    new WhiteSpaceNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `SourceNode` to a ' +
        '`ParagraphNode`',
        function () {
            assert.doesNotThrow(function () {
                new ParagraphNode().append(
                    new SourceNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `TextNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                new ParagraphNode().append(new TextNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `RootNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                new SentenceNode().append(new RootNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `ParagraphNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                new SentenceNode().append(
                    new ParagraphNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `SentenceNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                new SentenceNode().append(new SentenceNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `PunctuationNode` to a ' +
        '`SentenceNode`',
        function () {
            assert.doesNotThrow(function () {
                new SentenceNode().append(
                    new PunctuationNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `WordNode` to a `SentenceNode`',
        function () {
            assert.doesNotThrow(function () {
                new SentenceNode().append(new WordNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a ' +
        '`SentenceNode`',
        function () {
            assert.doesNotThrow(function () {
                new SentenceNode().append(
                    new WhiteSpaceNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `SourceNode` to a ' +
        '`SentenceNode`',
        function () {
            assert.doesNotThrow(function () {
                new SentenceNode().append(
                    new SourceNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `TextNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                new SentenceNode().append(new TextNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `TextNode` to a `WordNode`',
        function () {
            assert.doesNotThrow(function () {
                new WordNode().append(new TextNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `TextNode` to a `WhiteSpaceNode`',
        function () {
            assert.doesNotThrow(function () {
                new WhiteSpaceNode().append(new TextNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `TextNode` to a `PunctuationNode`',
        function () {
            assert.doesNotThrow(function () {
                new PunctuationNode().append(new TextNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `PunctuationNode` to a `WordNode`',
        function () {
            assert.doesNotThrow(function () {
                new WordNode().append(new PunctuationNode());
            }, /HierarchyError/);
        }
    );
});

describe('Events on TextOM.Parent', function () {
    describe('[insertinside]', function () {
        it('emits on all `Child`s ancestors, with the current ancestor ' +
            'as the context, and the inserted child as an argument, when ' +
            'a Child is inserted',
            function () {
                var rootNode,
                    paragraphNode,
                    sentenceNode,
                    wordNode,
                    whiteSpaceNode,
                    index,
                    shouldBeChild;

                rootNode = new RootNode();
                paragraphNode = new ParagraphNode();
                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                whiteSpaceNode = new WhiteSpaceNode();

                index = 0;

                shouldBeChild = null;

                rootNode.append(paragraphNode);
                paragraphNode.append(sentenceNode);

                function oninsertinsideFactory(context) {
                    return function (child) {
                        index++;

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

                assert(index === 3);

                index = 0;
                shouldBeChild = whiteSpaceNode;

                rootNode.append(whiteSpaceNode);

                assert(index === 1);
            }
        );

        it('emits on all `Child`s ancestors constructors, with the ' +
            'current ancestor as the context, and the inserted child ' +
            'as an argument, when a Child is inserted',
            function () {
                var rootNode,
                    paragraphNode,
                    sentenceNode,
                    wordNode,
                    whiteSpaceNode,
                    index,
                    shouldBeChild;

                rootNode = new RootNode();
                paragraphNode = new ParagraphNode();
                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                whiteSpaceNode = new WhiteSpaceNode();

                index = 0;

                shouldBeChild = null;

                rootNode.append(paragraphNode);
                paragraphNode.append(sentenceNode);

                function oninsertinsideFactory(context) {
                    return function (child) {
                        index++;

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

                assert(index === 3);

                index = 0;
                shouldBeChild = whiteSpaceNode;

                rootNode.append(whiteSpaceNode);

                assert(index === 1);

                /**
                 * Clean.
                 */

                RootNode.off('insertinside');
                ParagraphNode.off('insertinside');
                SentenceNode.off('insertinside');
            }
        );
    });

    describe('[removeinside]', function () {
        it('emits on all `Child`s ancestors, with the current ancestor ' +
            'as the context, and the removed child and the previous parent ' +
            'as arguments, when a Child is removed',
            function () {
                var rootNode,
                    paragraphNode,
                    sentenceNode,
                    wordNode,
                    whiteSpaceNode,
                    index,
                    shouldBeChild,
                    shouldBeParent;

                rootNode = new RootNode();
                paragraphNode = new ParagraphNode();
                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                whiteSpaceNode = new WhiteSpaceNode();

                index = 0;

                shouldBeChild = null;
                shouldBeParent = null;

                rootNode.append(paragraphNode);
                rootNode.append(whiteSpaceNode);
                paragraphNode.append(sentenceNode);
                sentenceNode.append(wordNode);

                function onremoveinsideFactory(context) {
                    return function (child, parent) {
                        index++;

                        assert(child === shouldBeChild);
                        assert(parent === shouldBeParent);
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
                shouldBeParent = sentenceNode;

                wordNode.remove();

                assert(index === 3);

                index = 0;
                shouldBeChild = whiteSpaceNode;
                shouldBeParent = rootNode;

                whiteSpaceNode.remove();

                assert(index === 1);
            }
        );

        it('emits on all `Child`s ancestors constructors, with the ' +
            'current ancestor as the context, and the removed child ' +
            'and the previous parent as an arguments, when a Child is ' +
            'removed',
            function () {
                var rootNode,
                    paragraphNode,
                    sentenceNode,
                    wordNode,
                    whiteSpaceNode,
                    index,
                    shouldBeChild,
                    shouldBeParent;

                rootNode = new RootNode();
                paragraphNode = new ParagraphNode();
                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                whiteSpaceNode = new WhiteSpaceNode();

                index = 0;

                shouldBeChild = null;
                shouldBeParent = null;

                rootNode.append(paragraphNode);
                rootNode.append(whiteSpaceNode);
                paragraphNode.append(sentenceNode);
                sentenceNode.append(wordNode);

                function onremoveinsideFactory(context) {
                    return function (child, parent) {
                        index++;

                        assert(child === shouldBeChild);
                        assert(parent === shouldBeParent);
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

                shouldBeParent = sentenceNode;

                wordNode.remove();

                assert(index === 3);

                index = 0;
                shouldBeChild = whiteSpaceNode;
                shouldBeParent = rootNode;

                whiteSpaceNode.remove();

                assert(index === 1);

                /**
                 * Clean.
                 */

                RootNode.off('removeinside');
                ParagraphNode.off('removeinside');
                SentenceNode.off('removeinside');
            }
        );
    });

    describe('[changetextinside]', function () {
        it('emits on all `Text`s ancestors, with the current ancestor as ' +
            'the context, and the changed child and the previous value as ' +
            'arguments, when a Text is changed',
            function () {
                var rootNode,
                    paragraphNode,
                    sentenceNode,
                    wordNode,
                    textNode0,
                    whiteSpaceNode,
                    textNode1,
                    index,
                    shouldBePreviousValue,
                    shouldBeChild;

                rootNode = new RootNode();
                paragraphNode = new ParagraphNode();
                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                whiteSpaceNode = new WhiteSpaceNode();
                textNode0 = new TextNode('alfred');
                textNode1 = new TextNode('\n\n');

                rootNode.append(paragraphNode);
                paragraphNode.append(sentenceNode);
                sentenceNode.append(wordNode);
                wordNode.append(textNode0);
                rootNode.append(whiteSpaceNode);
                whiteSpaceNode.append(textNode1);

                index = 0;

                shouldBePreviousValue = null;
                shouldBeChild = null;

                function onchangetextinsideFactory(context) {
                    return function (child, value, previousValue) {
                        index++;

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

                wordNode.on('changetextinside',
                    onchangetextinsideFactory(wordNode)
                );

                shouldBeChild = textNode0;
                shouldBePreviousValue = textNode0.toString();

                shouldBeChild.fromString('bertrand');

                assert(index === 4);

                index = 0;
                shouldBeChild = textNode1;
                shouldBePreviousValue = textNode1.toString();

                shouldBeChild.fromString('\n');

                assert(index === 1);
            }
        );

        it('emits on all `Text`s ancestors, with the current ancestor as ' +
            'the context, and the changed child and the previous value as ' +
            'arguments, when a Text is changed',
            function () {
                var rootNode,
                    paragraphNode,
                    sentenceNode,
                    wordNode,
                    textNode0,
                    whiteSpaceNode,
                    textNode1,
                    index,
                    shouldBePreviousValue,
                    shouldBeChild;

                rootNode = new RootNode();
                paragraphNode = new ParagraphNode();
                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                whiteSpaceNode = new WhiteSpaceNode();
                textNode0 = new TextNode('alfred');
                textNode1 = new TextNode('\n\n');

                rootNode.append(paragraphNode);
                paragraphNode.append(sentenceNode);
                sentenceNode.append(wordNode);
                wordNode.append(textNode0);
                rootNode.append(whiteSpaceNode);
                whiteSpaceNode.append(textNode1);

                index = 0;

                shouldBePreviousValue = null;
                shouldBeChild = null;

                function onchangetextinsideFactory(context) {
                    return function (child, value, previousValue) {
                        index++;

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

                WordNode.on('changetextinside',
                    onchangetextinsideFactory(wordNode)
                );

                shouldBeChild = textNode0;
                shouldBePreviousValue = textNode0.toString();

                textNode0.fromString('bertrand');

                assert(index === 4);

                index = 0;
                shouldBeChild = textNode1;
                shouldBePreviousValue = textNode1.toString();

                textNode1.fromString('\n');

                assert(index === 1);

                RootNode.off('changetextinside');
                ParagraphNode.off('changetextinside');
                SentenceNode.off('changetextinside');
                WordNode.off('changetextinside');
            }
        );
    });
});

describe('Events on TextOM.Child', function () {
    describe('[insert]', function () {
        it('emits on child and all `child`s constructors, with `child` as ' +
            'the context, when `child` is inserted',
            function () {
                var paragraphNode,
                    sentenceNode,
                    index;

                paragraphNode = new ParagraphNode();
                sentenceNode = new SentenceNode();
                index = 0;

                sentenceNode.append(new WordNode());

                function oninsert() {
                    index++;

                    assert(this === sentenceNode);
                }

                sentenceNode.on('insert', oninsert);
                SentenceNode.on('insert', oninsert);
                Element.on('insert', oninsert);
                Child.on('insert', oninsert);
                Parent.on('insert', oninsert);
                Node.on('insert', oninsert);

                paragraphNode.append(sentenceNode);

                assert(index === 6);

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
            'when the `next` attribute on child changes',
            function () {
                var sentenceNode,
                    wordNode,
                    whiteSpaceNode,
                    punctuationNode,
                    index;

                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                whiteSpaceNode = new WhiteSpaceNode();
                punctuationNode = new PunctuationNode();

                index = 0;

                sentenceNode.append(wordNode);
                sentenceNode.append(whiteSpaceNode);

                function onchangenext(node, previousNode) {
                    index++;

                    assert(this === wordNode);
                    assert(node === punctuationNode);
                    assert(previousNode === whiteSpaceNode);
                }

                wordNode.on('changenext', onchangenext);
                WordNode.on('changenext', onchangenext);

                wordNode.after(punctuationNode);

                assert(index === 2);

                wordNode.off('changenext');
                WordNode.off('changenext');
            }
        );
    });

    describe('[changeprev]', function () {
        it('emits on child and all child\'s constructors, with child as ' +
            'the context, and the new and the old prev nodes as arguments, ' +
            'when the `prev` attribute on child changes',
            function () {
                var sentenceNode,
                    wordNode,
                    whiteSpaceNode,
                    punctuationNode,
                    index;

                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                whiteSpaceNode = new WhiteSpaceNode();
                punctuationNode = new PunctuationNode();

                index = 0;

                sentenceNode.append(wordNode);
                sentenceNode.append(whiteSpaceNode);

                function onchangeprev(node, previousValue) {
                    index++;

                    assert(this === whiteSpaceNode);
                    assert(node === punctuationNode);
                    assert(previousValue === wordNode);
                }

                whiteSpaceNode.on('changeprev', onchangeprev);
                WhiteSpaceNode.on('changeprev', onchangeprev);

                whiteSpaceNode.before(punctuationNode);

                assert(index === 2);

                whiteSpaceNode.off('changeprev');
                WhiteSpaceNode.off('changeprev');
            }
        );
    });

    describe('[remove]', function () {
        it('emits on child and all `child`s constructors, with `child` as ' +
            'the context, and the previous parent as an argument, when ' +
            '`child` is removed',
            function () {
                var paragraphNode,
                    sentenceNode,
                    index;

                paragraphNode = new ParagraphNode();
                sentenceNode = new SentenceNode();

                index = 0;

                paragraphNode.append(sentenceNode);

                function onremove(parent) {
                    index++;

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

                assert(index === 6);

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
            'when a `text` is changed',
            function () {
                var sentenceNode,
                    wordNode,
                    textNode,
                    index,
                    shouldBeValue,
                    shouldBePreviousValue;

                sentenceNode = new SentenceNode();
                wordNode = new WordNode();
                textNode = new TextNode('alfred');

                index = 0;

                shouldBeValue = 'bertrand';

                shouldBePreviousValue = textNode.toString();

                sentenceNode.append(wordNode);
                wordNode.append(textNode);

                function onchangetext(value, previousValue) {
                    index++;

                    assert(this === textNode);
                    assert(value === shouldBeValue);
                    assert(previousValue === shouldBePreviousValue);
                }

                textNode.on('changetext', onchangetext);
                TextNode.on('changetext', onchangetext);
                Text.on('changetext', onchangetext);
                Child.on('changetext', onchangetext);
                Node.on('changetext', onchangetext);

                textNode.fromString(shouldBeValue);

                assert(index === 5);

                textNode.off('changetext');
                TextNode.off('changetext');
                Text.off('changetext');
                Child.off('changetext');
                Node.off('changetext');
            }
        );
    });
});

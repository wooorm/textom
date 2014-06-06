
var TextOM = require('..'),
    assert = require('assert');

/* istanbul ignore next: noop */
function noop() {}

/* istanbul ignore next: noop */
function altNoop() {}

describe('TextOM', function () {
    it('should have a `ROOT_NODE` property, equal to the `type` property ' +
        'on an instance of `RootNode`', function () {
            assert(TextOM.ROOT_NODE === (new TextOM.RootNode()).type);
        }
    );

    it('should have a `PARAGRAPH_NODE` property, equal to the `type` ' +
        'property on an instance of `ParagraphNode`', function () {
            assert(
                TextOM.PARAGRAPH_NODE === (new TextOM.ParagraphNode()).type
            );
        }
    );

    it('should have a `SENTENCE_NODE` property, equal to the `type` ' +
        'property on an instance of `SentenceNode`', function () {
            assert(TextOM.SENTENCE_NODE === (new TextOM.SentenceNode()).type);
        }
    );

    it('should have a `WORD_NODE` property, equal to the `type` property ' +
        'on an instance of `WordNode`', function () {
            assert(TextOM.WORD_NODE === (new TextOM.WordNode()).type);
        }
    );

    it('should have a `PUNCTUATION_NODE` property, equal to the `type` ' +
        'property on an instance of `PunctuationNode`', function () {
            assert(
                TextOM.PUNCTUATION_NODE ===
                (new TextOM.PunctuationNode()).type
            );
        }
    );

    it('should have a `WHITE_SPACE_NODE` property, equal to the `type` ' +
        'property on an instance of `WhiteSpaceNode`', function () {
            assert(
                TextOM.WHITE_SPACE_NODE ===
                (new TextOM.WhiteSpaceNode()).type
            );
        }
    );

    it('should return a newly initialised `RootNode` object when invoked',
        function () {
            assert(new TextOM() instanceof TextOM.RootNode);
            assert(TextOM() instanceof TextOM.RootNode);
        }
    );
});

var Node = TextOM.Node,
    nodePrototype = Node.prototype;

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
            assert(nodePrototype.ROOT_NODE === (new TextOM.RootNode()).type);
        }
    );
});

describe('TextOM.Node#PARAGRAPH_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`ParagraphNode`', function () {
            assert(
                nodePrototype.PARAGRAPH_NODE ===
                (new TextOM.ParagraphNode()).type
            );
        }
    );
});

describe('TextOM.Node#SENTENCE_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`SentenceNode`', function () {
            assert(
                nodePrototype.SENTENCE_NODE ===
                (new TextOM.SentenceNode()).type
            );
        }
    );
});

describe('TextOM.Node#WORD_NODE', function () {
    it('should be equal to the `type` property on an instance of `WordNode`',
        function () {
            assert(
                nodePrototype.WORD_NODE === (new TextOM.WordNode()).type
            );
        }
    );
});

describe('TextOM.Node#PUNCTUATION_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`PunctuationNode`', function () {
            assert(
                nodePrototype.PUNCTUATION_NODE ===
                (new TextOM.PunctuationNode()).type
            );
        }
    );
});

describe('TextOM.Node#WHITE_SPACE_NODE', function () {
    it('should be equal to the `type` property on an instance of ' +
        '`WhiteSpaceNode`', function () {
            assert(
                nodePrototype.WHITE_SPACE_NODE ===
                (new TextOM.WhiteSpaceNode()).type
            );
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

    it('should be the first child when one or more children exist',
        function () {
            var parent = new Parent();
            parent.append(new TextOM.Child());
            assert(parent.head === parent[0]);
            parent.prepend(new TextOM.Child());
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
        parent.append(new TextOM.Child());
        assert(parent.tail === null);
    });

    it('should be the last child when two or more children exist',
        function () {
            var parent = new Parent();
            parent.append(new TextOM.Child());
            parent.prepend(new TextOM.Child());
            assert(parent.tail === parent[1]);
            parent.append(new TextOM.Child());
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
            parent.append(new TextOM.Child());
            assert(parent.length === 1);
            parent.prepend(new TextOM.Child());
            assert(parent.length === 2);
            parent.append(new TextOM.Child());
            assert(parent.length === 3);
        }
    );
});

describe('TextOM.Parent#prepend(childNode)', function () {
    it('should throw when falsey values are provided', function () {
        var parent = new Parent();

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
        'inheriting from TextOM.Child)', function () {
            var parent = new Parent();

            assert.throws(function () {
                parent.prepend(new Node());
            }, /remove/);

            assert.throws(function () {
                parent.prepend({});
            }, /remove/);
        }
    );

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

    it('should set the `parent` property on the prependee to the operated ' +
        'on parent', function () {
            var parent = new Parent(),
                node = new TextOM.Child(),
                node1 = new TextOM.Child();

            parent.prepend(node);
            assert(node.parent === parent);

            parent.prepend(node1);
            assert(node1.parent === parent);
        }
    );

    it('should set the `head` and `0` properties to the prepended node',
        function () {
            var parent = new Parent(),
                node = new TextOM.Child();

            parent.prepend(node);
            assert(parent.head === node);
            assert(parent[0] === node);
        }
    );

    it('should set the `tail` and `1` properties to the previous `head`, ' +
        'when no `tail` exists', function () {
            var parent = new Parent(),
                node = new TextOM.Child(),
                node1 = new TextOM.Child();

            parent.prepend(node);
            parent.prepend(node1);
            assert(parent.tail === node);
            assert(parent[1] === node);
        }
    );

    it('should set the `head` and `0` properties to further prepended nodes',
        function () {
            var parent = new Parent(),
                node = new TextOM.Child(),
                node1 = new TextOM.Child(),
                node2 = new TextOM.Child();

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
                node = new TextOM.Child(),
                node1 = new TextOM.Child();

            parent.prepend(node);
            assert(node.next === null);

            parent.prepend(node1);
            assert(node1.next === node);
        }
    );

    it('should set the `prev` property on the parents previous `head` to ' +
        'the prependee', function () {
            var parent = new Parent(),
                node = new TextOM.Child(),
                node1 = new TextOM.Child();

            parent.prepend(node);

            parent.prepend(node1);
            assert(node.prev === node1);
        }
    );

    it('should update the `length` property to correspond to the number ' +
        'of prepended children', function () {
            var parent = new Parent(),
                node = new TextOM.Child(),
                node1 = new TextOM.Child(),
                node2 = new TextOM.Child();

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
            child = new TextOM.Child(),
            child1 = new TextOM.Child(),
            child2 = new TextOM.Child(),
            child3 = new TextOM.Child();

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
            node = new TextOM.Child();

        assert(node === parent.prepend(node));
    });
});

describe('TextOM.Parent#append(childNode)', function () {
    it('should throw when falsey values are provided', function () {
        var parent = new Parent();

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
        'inheriting from TextOM.Child)', function () {
            var parent = new Parent();

            assert.throws(function () {
                parent.append(new Node());
            }, /remove/);

            assert.throws(function () {
                parent.append({});
            }, /remove/);
        }
    );

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

    it('should set the `parent` property on the appendee to the operated ' +
        'on parent', function () {
            var parent = new Parent(),
                node = new TextOM.Child(),
                node1 = new TextOM.Child();

            parent.append(node);
            assert(node.parent === parent);

            parent.append(node1);
            assert(node1.parent === parent);
        }
    );

    it('should set the `head` and `0` properties to the appended node, ' +
        'when no `head` exists', function () {
            var parent = new Parent(),
                node = new TextOM.Child();

            parent.append(node);
            assert(parent.head === node);
            assert(parent[0] === node);
        }
    );

    it('should set the `tail` and `1` properties to the appended node, ' +
        'when no `tail` exists', function () {
            var parent = new Parent(),
                node = new TextOM.Child(),
                node1 = new TextOM.Child();

            parent.append(node);
            parent.append(node1);
            assert(parent.tail === node1);
            assert(parent[1] === node1);
        }
    );

    it('should set the `tail`, and `length - 1`, properties to further ' +
        'appended nodes', function () {
            var parent = new Parent(),
                node = new TextOM.Child(),
                node1 = new TextOM.Child(),
                node2 = new TextOM.Child();

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
                node = new TextOM.Child(),
                node1 = new TextOM.Child(),
                node2 = new TextOM.Child();

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
                node = new TextOM.Child(),
                node1 = new TextOM.Child(),
                node2 = new TextOM.Child();

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
                node = new TextOM.Child(),
                node1 = new TextOM.Child(),
                node2 = new TextOM.Child();

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
            node = new TextOM.Child();

        assert(node === parent.append(node));
    });
});

describe('TextOM.Parent#item(index?)', function () {
    it('should throw on non-nully, non-number (including NaN) values',
        function () {
            var parent = new Parent();

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
            }, /undefined/);
        }
    );

    it('should throw when a position was given, not of type number',
        function () {
            var parent = new Parent(),
                element = parent.append(new Element());

            assert.throws(function () {
                element.split('failure');
            }, /failure/);
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
            previousSibling = new TextOM.Child(),
            nextSibling = new TextOM.Child();

        parent.append(previousSibling);
        parent.append(nextSibling);

        assert(previousSibling.next === nextSibling);
    });
});

describe('TextOM.Child#before(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () {
            (new Child()).before(new Child());
        }, /Illegal invocation/);
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

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
        'inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.before(new Node());
        }, /remove/);

        assert.throws(function () {
            child.before({});
        }, /remove/);
    });

    it('should call the `remove` method on the prependee', function () {
        var child = (new Parent()).append(new Child()),
            child1 = new TextOM.Child(),
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
        }, /Illegal invocation/);
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

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
        'inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.after(new Node());
        }, /remove/);

        assert.throws(function () {
            child.after({});
        }, /remove/);
    });

    it('should call the `remove` method on the appendee', function () {
        var child = (new Parent()).append(new Child()),
            child1 = new TextOM.Child(),
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
            var child = (new Parent()).append(new Child()),
                child1 = child.before(new Child());

            child.remove();

            assert(child.prev === null);
        }
    );

    it('should set the `next` property on the operated on node to `null`',
        function () {
            var child = (new Parent()).append(new Child()),
                child1 = child.after(new Child());

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
            child = new Child(),
            child1 = new Child();

        assert(child === child.remove());

        parent.append(child);
        assert(child === child.remove());
    });
});

describe('TextOM.Child#replace(childNode)', function () {
    it('should throw when not attached', function () {
        assert.throws(function () {
            (new Child()).replace(new Child());
        }, /Illegal invocation/);
    });

    it('should throw when falsey values are provided', function () {
        var child = (new Parent()).append(new Child());

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
        'inheriting from TextOM.Child)', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            child.replace(new Node());
        }, /remove/);

        assert.throws(function () {
            child.replace({});
        }, /remove/);
    });

    it('should call the `remove` method on the replacee', function () {
        var child = (new Parent()).append(new Child()),
            child1 = new TextOM.Child(),
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
        /*jshint -W053 */
        assert(box.fromString(new String('alfred')) === 'alfred');
    });
});

describe('TextOM.Text#split(position)', function () {
    it('should throw when the operated on item is not attached', function () {
        var box = new Text('alfred');

        assert.throws(function () {
            box.split();
        }, /Illegal invocation/);
    });

    it('should throw when a position was given, not of type number',
        function () {
            var parent = new Parent(),
                box = parent.append(new Text('alfred'));

            assert.throws(function () {
                box.split('failure');
            }, /failure/);
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

        assert.throws(function () {
            range.setStart();
        }, /undefined/);

        assert.throws(function () {
            range.setStart(false);
        }, /false/);
    });

    it('should NOT throw when an unattached node is given', function () {
        var range = new Range();

        assert.doesNotThrow(function () {
            range.setStart(new Child());
        });

        assert.doesNotThrow(function () {
            range.setStart(new Parent());
        });
    });

    it('should throw when a negative offset is given', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            (new Range()).setStart(child, -1);
        }, /-1/);

        assert.throws(function () {
            (new Range()).setStart(child, -Infinity);
        }, /-Infinity/);
    });

    it('should NOT throw when NaN is given, but treat it as `0`',
        function () {
            var child = (new Parent()).append(new Child()),
                range = new Range();

            assert.doesNotThrow(function () {
                range.setStart(child, NaN);
            });

            assert(range.startOffset === 0);
        }
    );

    it('should throw when a value other than a number is given',
        function () {
            var child = (new Parent()).append(new Child());

            assert.throws(function () {
                (new Range()).setStart(child, 'failure');
            }, /failure/);
        }
    );

    it('should NOT throw when an offset greater than the length of the ' +
        'node is given', function () {
        var parent = new Parent(),
            parent1 = new Parent(),
            child = new Child(),
            child1 = new Child();

        // Fool code to think parent is attached;
        parent1.parent = parent;
        parent[0] = parent.head = parent1;

        parent1.append(child);
        parent1.append(child1);

        assert.doesNotThrow(function () {
            (new Range()).setStart(parent1, 3);
        });

        assert.doesNotThrow(function () {
            (new Range()).setStart(parent1, Infinity);
        });
    });

    it('should throw when `endContainer` does not share the same root as ' +
        'the given node', function () {
        var range = new Range(),
           parent = new Parent(),
           parent1 = new Parent(),
           child = parent.append(new Text('alfred')),
           child1 = parent1.append(new Text('bertrand'));

        range.setEnd(child1);

        assert.throws(function () {
            range.setStart(child);
        }, /WrongRootError/);
    });

    it('should not throw when an offset is given, but no length property ' +
        'exists on the given node', function () {
        var child = (new Parent()).append(new Child());

        assert.doesNotThrow(function () {
            (new Range()).setStart(child, 1);
        });

        assert.doesNotThrow(function () {
            (new Range()).setStart(child, Infinity);
        });
    });

    it('should set `startContainer` and `startOffset` to the given values, ' +
        'when no endContainer exists', function () {
        var parent = new Parent(),
            child = new Child(),
            range = new Range(),
            offset = 1;

        parent.append(child);

        range.setStart(child, offset);
        assert(range.startContainer === child);
        assert(range.startOffset === offset);
    });

    it('should switch the given start values with the current end values, ' +
        'when `endContainer` equals the given container and the endOffset ' +
        'is lower than the given offset', function () {
        var parent = new Parent(),
            child = new Child(),
            range = new Range();

        parent.append(child);

        range.setEnd(child, 0);
        range.setStart(child, 1);

        assert(range.startOffset === 0);
        assert(range.endOffset === 1);
    });

    it('should switch the given start values with the current end values, ' +
        'when the given item is a descendant of the current end container',
        function () {
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

    it('should switch the given start values with the current end values, ' +
        'when the given item is before the current end container',
        function () {
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

        assert.throws(function () {
            range.setEnd();
        }, /undefined/);

        assert.throws(function () {
            range.setEnd(false);
        }, /false/);
    });

    it('should NOT throw when an unattached node is given', function () {
        var range = new Range();

        assert.doesNotThrow(function () {
            range.setEnd(new Child());
        });

        assert.doesNotThrow(function () {
            range.setEnd(new Parent());
        });
    });

    it('should throw when a negative offset is given', function () {
        var child = (new Parent()).append(new Child());

        assert.throws(function () {
            (new Range()).setEnd(child, -1);
        }, /-1/);

        assert.throws(function () {
            (new Range()).setEnd(child, -Infinity);
        }, /-Infinity/);
    });

    it('should NOT throw when NaN is given, but treat it as `0`',
        function () {
            var child = (new Parent()).append(new Child()),
                range = new Range();

            assert.doesNotThrow(function () {
                range.setStart(child, NaN);
            });

            assert(range.startOffset === 0);
        }
    );

    it('should throw when a value other than a number is given',
        function () {
            var child = (new Parent()).append(new Child());

            assert.throws(function () {
                (new Range()).setStart(child, 'failure');
            }, /failure/);
        }
    );

    it('should NOT throw when an offset greater than the length of the ' +
        'node is given', function () {
        var parent = new Parent(),
            parent1 = new Parent(),
            child = new Child(),
            child1 = new Child();

        // Fool code to think parent is attached;
        parent1.parent = parent;
        parent[0] = parent.head = parent1;

        parent1.append(child);
        parent1.append(child1);

        assert.doesNotThrow(function () {
            (new Range()).setEnd(parent1, 3);
        });

        assert.doesNotThrow(function () {
            (new Range()).setEnd(parent1, Infinity);
        });
    });

    it('should throw when `startContainer` does not share the same root ' +
        'as the given node', function () {
        var range = new Range(),
           parent = new Parent(),
           parent1 = new Parent(),
           child = parent.append(new Text('alfred')),
           child1 = parent1.append(new Text('bertrand'));

        range.setStart(child);

        assert.throws(function () {
            range.setEnd(child1);
        }, /WrongRootError/);
    });

    it('should not throw when an offset is given, but no length property ' +
        'exists on the given node', function () {
        var child = (new Parent()).append(new Child());

        assert.doesNotThrow(function () {
            (new Range()).setEnd(child, 1);
        });

        assert.doesNotThrow(function () {
            (new Range()).setEnd(child, Infinity);
        });
    });

    it('should set `endContainer` and `endOffset` to the given values, ' +
        'when no startContainer exists', function () {
        var parent = new Parent(),
            child = new Child(),
            range = new Range(),
            offset = 1;

        parent.append(child);

        range.setEnd(child, offset);
        assert(range.endContainer === child);
        assert(range.endOffset === offset);
    });

    it('should switch the given end values with the current start values, ' +
        'when `startContainer` equals the given container and the ' +
        'startOffset is higher than the given offset', function () {
        var parent = new Parent(),
            child = new Child(),
            range = new Range();

        parent.append(child);

        range.setStart(child, 1);
        range.setEnd(child, 0);

        assert(range.startOffset === 0);
        assert(range.endOffset === 1);
    });

    it('should switch the given end values with the current start values, ' +
        'when the given item is before the current start container',
        function () {
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
        assert(
            (new Range()).cloneRange() instanceof (new Range()).constructor
        );

        function F () {}
        F.prototype.cloneRange = Range.prototype.cloneRange;

        assert((new F()).cloneRange() instanceof (new F()).constructor);
    });

    it('should copy `startContainer`, `startOffset`, `endContainer`, and ' +
        '`endOffset` to the new instance()', function () {
        var range = new Range(),
            range1;

        range.startContainer = 'a';
        range.endContainer = 'b';
        range.startOffset = 0;

        range1 = range.cloneRange();

        assert(range.startContainer === range1.startContainer);
        assert(range.endContainer === range1.endContainer);
        assert(range.startOffset === range1.startOffset);
        assert(range.endOffset === range1.endOffset);
    });
});

describe('TextOM.Range#toString()', function () {
    it('should be of type `function`', function () {
        assert(typeof (new Range()).toString === 'function');
    });

    it('should return an empty string when no start- or endpoints exist',
        function () {
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
        }
    );

    it('should return an empty string when startContainer equals ' +
        'endContainer and startOffset equals endOffset', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child, 2);
        range.setEnd(child, 2);
        assert(range.toString() === '');
    });

    it('should return the substring of the `startContainer`, starting at ' +
        '`startOffset` and ending at `endOffset`, when `startContainer` ' +
        'equals `endContainer` and `startContainer` has no `length` ' +
        'property', function () {
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

    it('should return the substring of the `startContainer`, starting at ' +
        '`startOffset` and ending at the last possible character, when ' +
        '`startContainer` equals `endContainer`, `startContainer` has no ' +
        '`length`property, and `endOffset` is larger than the result of ' +
        'calling the `toString` method on `startContainer`', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child);
        range.setEnd(child);
        child.fromString('bert');
        assert(range.toString() === 'bert');
    });

    it('should substring the endContainer from its start and ending at ' +
        'its `endOffset`', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child1 = parent.append(new Text('bertrand'));

        range.setStart(child);
        range.setEnd(child1, 6);
        assert(range.toString() === 'alfredbertra');
    });

    it('should concatenate two siblings', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child1 = parent.append(new Text('bertrand'));

        range.setStart(child);
        range.setEnd(child1);
        assert(range.toString() === 'alfredbertrand');

        range.setStart(child, 2);
        assert(range.toString() === 'fredbertrand');

        range.setEnd(child1, 6);
        assert(range.toString() === 'fredbertra');
    });

    it('should concatenate multiple siblings', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child1 = parent.append(new Text('bertrand')),
            child2 = parent.append(new Text('cees')),
            child3 = parent.append(new Text('dick')),
            child4 = parent.append(new Text('eric')),
            child5 = parent.append(new Text('ferdinand'));

        range.setStart(child);
        range.setEnd(child5);
        assert(range.toString() === 'alfredbertrandceesdickericferdinand');

        range.setStart(child, 3);
        assert(range.toString() === 'redbertrandceesdickericferdinand');

        range.setEnd(child5, 7);
        assert(range.toString() === 'redbertrandceesdickericferdina');
    });

    it('should concatenate children of different parents', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent.append(new TextOM.WordNode('bertrand')),
            child2 = parent1.append(new TextOM.WordNode('cees'));

        range.setStart(child);
        range.setEnd(child2);
        assert(range.toString() === 'alfredbertrandcees');

        range.setStart(child, 1);
        assert(range.toString() === 'lfredbertrandcees');

        range.setStart(child1);
        assert(range.toString() === 'bertrandcees');

        range.setEnd(child2, 3);
        assert(range.toString() === 'bertrandcee');
    });

    it('should concatenate children of different grandparents',
        function () {
            var range = new Range(),
                greatGrandparent = new TextOM.RootNode(),
                grandparent = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                grandparent1 = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                parent2 = grandparent1.append(new TextOM.SentenceNode()),
                parent3 = grandparent1.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent1.append(new TextOM.WordNode('bertrand')),
                child2 = parent2.append(new TextOM.WordNode('cees')),
                child3 = parent3.append(new TextOM.WordNode('dick'));

            range.setStart(child);
            range.setEnd(child3);
            assert(range.toString() === 'alfredbertrandceesdick');

            range.setStart(child, 1);
            assert(range.toString() === 'lfredbertrandceesdick');

            range.setEnd(child3, 3);
            assert(range.toString() === 'lfredbertrandceesdic');

            range.setStart(child1);
            assert(range.toString() === 'bertrandceesdic');

            range.setEnd(child2);
            assert(range.toString() === 'bertrandcees');

            range.setStart(child1, 1);
            assert(range.toString() === 'ertrandcees');

            range.setEnd(child2, 3);
            assert(range.toString() === 'ertrandcee');
        }
    );

    it('should return an empty string, when startContainer and ' +
        'endContainer no longer share the same root', function () {
        var range = new Range(),
           parent = new Parent(),
           child = parent.append(new Text('alfred')),
           child1 = parent.append(new Text('bertrand')),
           child2 = parent.append(new Text('cees'));

        range.setStart(child);
        range.setEnd(child2);
        assert(range.toString() === 'alfredbertrandcees');

        child2.remove();
        assert(range.toString() === '');
    });

    it('should concatenate a parent using offset', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent.append(new TextOM.WordNode('bertrand')),
            child2 = parent.append(new TextOM.WordNode('cees')),
            child3 = parent.append(new TextOM.WordNode('dick'));

        range.setStart(parent, 1);
        range.setEnd(parent, 3);
        assert(range.toString() === 'bertrandcees');
    });

    it('should concatenate different parents', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent1.append(new TextOM.WordNode('bertrand'));

        range.setStart(parent);
        range.setEnd(parent1);
        assert(range.toString() === 'alfredbertrand');
    });

    it('should concatenate different grandparents', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(
                new TextOM.ParagraphNode()
            ),
            grandparent1 = greatGrandparent.append(
                new TextOM.ParagraphNode()
            ),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent1.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent1.append(new TextOM.WordNode('bertrand'));

        range.setStart(grandparent);
        range.setEnd(grandparent1);
        assert(range.toString() === 'alfredbertrand');
    });

    it('should concatenate different parents using offset', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent.append(new TextOM.WordNode('bertrand')),
            child2 = parent1.append(new TextOM.WordNode('cees')),
            child3 = parent1.append(new TextOM.WordNode('dick'));

        range.setStart(parent, 1);
        range.setEnd(parent1, 1);
        assert(range.toString() === 'bertrandcees');
    });
});

describe('TextOM.Range#removeContent()', function () {
    it('should be of type `function`', function () {
        assert(typeof (new Range()).removeContent === 'function');
    });

    it('should return an empty array when no start- or endpoints exist',
        function () {
            var range = new Range(),
                parent = new Parent(),
                child = parent.append(new Text('alfred'));

            assert(range.removeContent().length === 0);

            range = new Range();
            range.setStart(child);
            assert(range.removeContent().length === 0);

            range = new Range();
            range.setEnd(child);
            assert(range.removeContent().length === 0);
        }
    );

    it('should return an empty array when startContainer equals ' +
        'endContainer and startOffset equals endOffset', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child, 2);
        range.setEnd(child, 2);
        assert(range.removeContent().length === 0);
    });

    it('should return the substring of the `startContainer`, starting at ' +
        '`startOffset` and ending at `endOffset`, when `startContainer` ' +
        'equals `endContainer` and `startContainer` has no `length` ' +
        'property', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child, 2);
        range.setEnd(child, 4);

        assert(range.removeContent().toString() === 'fr');

        child = parent.append(new Text('alfred'));
        range = new Range();
        range.setStart(child, 2);
        range.setEnd(child);
        assert(range.removeContent().toString() === 'fred');

        child = parent.append(new Text('alfred'));
        range = new Range();
        range.setStart(child);
        range.setEnd(child);
        assert(range.removeContent().toString() === 'alfred');
    });

    it('should return the substring of the `startContainer`, starting at ' +
        '`startOffset` and ending at the last possible character, when ' +
        '`startContainer` equals `endContainer`, `startContainer` has no ' +
        '`length`property, and `endOffset` is larger than the result of ' +
        'calling the `toString` method on `startContainer`', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child);
        range.setEnd(child);
        child.fromString('bert');
        assert(range.removeContent().toString() === 'bert');
    });

    it('should substring the endContainer, when `startContainer` equals ' +
        '`endContainer`, from its start and ending at its `endOffset`',
        function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred'));

        range.setStart(child);
        range.setEnd(child, 4);
        assert(range.removeContent().toString() === 'alfr');
    });

    it('should substring the endContainer from its start and ending at its ' +
        '`endOffset`', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child1 = parent.append(new Text('bertrand'));

        range.setStart(child);
        range.setEnd(child1, 6);
        assert(range.removeContent().toString() === 'alfred,bertra');
    });

    it('should concatenate two siblings', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child1 = parent.append(new Text('bertrand'));

        range.setStart(child);
        range.setEnd(child1);
        assert(range.removeContent().toString() === 'alfred,bertrand');

        range = new Range();
        child = parent.append(new Text('alfred'));
        child1 = parent.append(new Text('bertrand'));
        range.setStart(child, 2);
        range.setEnd(child1);
        assert(range.removeContent().toString() === 'fred,bertrand');

        range = new Range();
        child = parent.append(new Text('alfred'));
        child1 = parent.append(new Text('bertrand'));
        range.setStart(child, 2);
        range.setEnd(child1, 6);
        assert(range.removeContent().toString() === 'fred,bertra');
    });

    it('should concatenate multiple siblings', function () {
        var range = new Range(),
            parent = new Parent(),
            child = parent.append(new Text('alfred')),
            child1 = parent.append(new Text('bertrand')),
            child2 = parent.append(new Text('cees')),
            child3 = parent.append(new Text('dick')),
            child4 = parent.append(new Text('eric')),
            child5 = parent.append(new Text('ferdinand'));

        range.setStart(child);
        range.setEnd(child5);

        assert(
            range.removeContent().toString() ===
            'alfred,bertrand,cees,dick,eric,ferdinand'
        );

        range = new Range();
        child = parent.append(new Text('alfred'));
        child1 = parent.append(new Text('bertrand'));
        child2 = parent.append(new Text('cees'));
        child3 = parent.append(new Text('dick'));
        child4 = parent.append(new Text('eric'));
        child5 = parent.append(new Text('ferdinand'));
        range.setStart(child, 3);
        range.setEnd(child5);

        assert(
            range.removeContent().toString() ===
            'red,bertrand,cees,dick,eric,ferdinand'
        );

        range = new Range();
        child = parent.append(new Text('alfred'));
        child1 = parent.append(new Text('bertrand'));
        child2 = parent.append(new Text('cees'));
        child3 = parent.append(new Text('dick'));
        child4 = parent.append(new Text('eric'));
        child5 = parent.append(new Text('ferdinand'));
        range.setStart(child, 3);
        range.setEnd(child5, 7);

        assert(
            range.removeContent().toString() ===
            'red,bertrand,cees,dick,eric,ferdina'
        );
    });

    it('should concatenate children of different parents', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent.append(new TextOM.WordNode('bertrand')),
            child2 = parent1.append(new TextOM.WordNode('cees'));

        range.setStart(child);
        range.setEnd(child2);
        assert(range.removeContent().toString() === 'alfred,bertrand,cees');

        range = new Range();
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent.append(new TextOM.WordNode('bertrand'));
        child2 = parent1.append(new TextOM.WordNode('cees'));
        range.setStart(child, 1);
        range.setEnd(child2);
        assert(range.removeContent().toString() === 'lfred,bertrand,cees');

        range = new Range();
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent.append(new TextOM.WordNode('bertrand'));
        child2 = parent1.append(new TextOM.WordNode('cees'));
        range.setStart(child1);
        range.setEnd(child2);
        assert(range.removeContent().toString() === 'bertrand,cees');

        range = new Range();
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent.append(new TextOM.WordNode('bertrand'));
        child2 = parent1.append(new TextOM.WordNode('cees'));
        range.setStart(child1);
        range.setEnd(child2, 3);
        assert(range.removeContent().toString() === 'bertrand,cee');
    });

    it('should concatenate children of different grandparents', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(
                new TextOM.ParagraphNode()
            ),
            grandparent1 = greatGrandparent.append(
                new TextOM.ParagraphNode()
            ),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent.append(new TextOM.SentenceNode()),
            parent2 = grandparent1.append(new TextOM.SentenceNode()),
            parent3 = grandparent1.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent1.append(new TextOM.WordNode('bertrand')),
            child2 = parent2.append(new TextOM.WordNode('cees')),
            child3 = parent3.append(new TextOM.WordNode('dick'));

        range.setStart(child);
        range.setEnd(child3);
        assert(
            range.removeContent().toString() === 'alfred,bertrand,cees,dick'
        );

        range = new Range();
        grandparent = greatGrandparent.append(new TextOM.ParagraphNode());
        grandparent1 = greatGrandparent.append(new TextOM.ParagraphNode());
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        parent2 = grandparent1.append(new TextOM.SentenceNode());
        parent3 = grandparent1.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent1.append(new TextOM.WordNode('bertrand'));
        child2 = parent2.append(new TextOM.WordNode('cees'));
        child3 = parent3.append(new TextOM.WordNode('dick'));
        range.setStart(child, 1);
        range.setEnd(child3);
        assert(
            range.removeContent().toString() === 'lfred,bertrand,cees,dick'
        );

        range = new Range();
        grandparent = greatGrandparent.append(new TextOM.ParagraphNode());
        grandparent1 = greatGrandparent.append(new TextOM.ParagraphNode());
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        parent2 = grandparent1.append(new TextOM.SentenceNode());
        parent3 = grandparent1.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent1.append(new TextOM.WordNode('bertrand'));
        child2 = parent2.append(new TextOM.WordNode('cees'));
        child3 = parent3.append(new TextOM.WordNode('dick'));
        range.setStart(child, 1);
        range.setEnd(child3, 3);
        assert(
            range.removeContent().toString() === 'lfred,bertrand,cees,dic'
        );

        range = new Range();
        grandparent = greatGrandparent.append(new TextOM.ParagraphNode());
        grandparent1 = greatGrandparent.append(new TextOM.ParagraphNode());
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        parent2 = grandparent1.append(new TextOM.SentenceNode());
        parent3 = grandparent1.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent1.append(new TextOM.WordNode('bertrand'));
        child2 = parent2.append(new TextOM.WordNode('cees'));
        child3 = parent3.append(new TextOM.WordNode('dick'));
        range.setStart(child1);
        range.setEnd(child3, 3);
        assert(range.removeContent().toString() === 'bertrand,cees,dic');

        range = new Range();
        grandparent = greatGrandparent.append(new TextOM.ParagraphNode());
        grandparent1 = greatGrandparent.append(new TextOM.ParagraphNode());
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        parent2 = grandparent1.append(new TextOM.SentenceNode());
        parent3 = grandparent1.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent1.append(new TextOM.WordNode('bertrand'));
        child2 = parent2.append(new TextOM.WordNode('cees'));
        child3 = parent3.append(new TextOM.WordNode('dick'));
        range.setStart(child1);
        range.setEnd(child2);
        assert(range.removeContent().toString() === 'bertrand,cees');

        range = new Range();
        grandparent = greatGrandparent.append(new TextOM.ParagraphNode());
        grandparent1 = greatGrandparent.append(new TextOM.ParagraphNode());
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        parent2 = grandparent1.append(new TextOM.SentenceNode());
        parent3 = grandparent1.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent1.append(new TextOM.WordNode('bertrand'));
        child2 = parent2.append(new TextOM.WordNode('cees'));
        child3 = parent3.append(new TextOM.WordNode('dick'));
        range.setStart(child1, 1);
        range.setEnd(child2);
        assert(range.removeContent().toString() === 'ertrand,cees');

        range = new Range();
        grandparent = greatGrandparent.append(new TextOM.ParagraphNode());
        grandparent1 = greatGrandparent.append(new TextOM.ParagraphNode());
        parent = grandparent.append(new TextOM.SentenceNode());
        parent1 = grandparent.append(new TextOM.SentenceNode());
        parent2 = grandparent1.append(new TextOM.SentenceNode());
        parent3 = grandparent1.append(new TextOM.SentenceNode());
        child = parent.append(new TextOM.WordNode('alfred'));
        child1 = parent1.append(new TextOM.WordNode('bertrand'));
        child2 = parent2.append(new TextOM.WordNode('cees'));
        child3 = parent3.append(new TextOM.WordNode('dick'));
        range.setStart(child1, 1);
        range.setEnd(child2, 3);
        assert(range.removeContent().toString() === 'ertrand,cee');
    });

    it('should return an empty string, when startContainer and ' +
        'endContainer no longer share the same root', function () {
        var range = new Range(),
           parent = new Parent(),
           child = parent.append(new Text('alfred')),
           child1 = parent.append(new Text('bertrand')),
           child2 = parent.append(new Text('cees'));

        range.setStart(child);
        range.setEnd(child2);

        child2.remove();
        assert(range.removeContent().length === 0);
    });

    it('should concatenate a parent using offset', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent.append(new TextOM.WordNode('bertrand')),
            child2 = parent.append(new TextOM.WordNode('cees')),
            child3 = parent.append(new TextOM.WordNode('dick'));

        range.setStart(parent, 1);
        range.setEnd(parent, 3);
        assert(range.removeContent().toString() === 'bertrand,cees');
    });

    it('should concatenate different parents', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent1.append(new TextOM.WordNode('bertrand'));

        range.setStart(parent);
        range.setEnd(parent1);
        assert(range.removeContent().toString() === 'alfred,bertrand');
    });

    it('should concatenate different grandparents', function () {
        var range = new Range(),
            greatGrandparent = new TextOM.RootNode(),
            grandparent = greatGrandparent.append(
                new TextOM.ParagraphNode()
            ),
            grandparent1 = greatGrandparent.append(
                new TextOM.ParagraphNode()
            ),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent1.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent1.append(new TextOM.WordNode('bertrand'));

        range.setStart(grandparent);
        range.setEnd(grandparent1);
        assert(range.removeContent().toString() === 'alfred,bertrand');
    });

    it('should concatenate different parents using offset', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent.append(new TextOM.WordNode('bertrand')),
            child2 = parent1.append(new TextOM.WordNode('cees')),
            child3 = parent1.append(new TextOM.WordNode('dick'));

        range.setStart(parent, 1);
        range.setEnd(parent1, 1);
        assert(range.removeContent().toString() === 'bertrand,cees');
    });
});

describe('TextOM.Range#getContent()', function () {
    it('should be of type `function`', function () {
        assert(typeof (new Range()).getContent === 'function');
    });

    it('should return an empty array, when no start- or endpoints exist',
        function () {
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
        }
    );

    it('should return an empty array, when startContainer is not in the ' +
        'same root as endContainer', function () {
        var range = new Range(),
            grandparent = new TextOM.ParagraphNode(),
            parent = grandparent.append(new TextOM.SentenceNode()),
            parent1 = grandparent.append(new TextOM.SentenceNode()),
            child = parent.append(new TextOM.WordNode('alfred')),
            child1 = parent1.append(new TextOM.WordNode('bertrand')),
            result = range.getContent();

        range = new Range();
        range.setStart(child);
        range.setEnd(child1);

        parent1.remove();

        result = range.getContent();
        assert(result.length === 0);
        assert(result instanceof Array);
    });

    it('should return an array containing node, when startContainer equals ' +
        'endContainer, and startContainer is a Text node', function () {
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

    it('should return an array containg node, when startContainer equals ' +
        'endContainer, is a Text node, and startOffset equals endOffset',
        function () {
            var range = new Range(),
                parent = new Parent(),
                child = parent.append(new Text('alfred')),
                result;

            range.setStart(child, 2);
            range.setEnd(child, 2);

            result = range.getContent();
            assert(result.length === 1);
            assert(result[0] === child);
        }
    );

    it('should return an array containing two direct text siblings',
        function () {
            var range = new Range(),
                parent = new Parent(),
                child = parent.append(new Text('alfred')),
                child1 = parent.append(new Text('bertrand')),
                result;

            range.setStart(child);
            range.setEnd(child1);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === child);
            assert(result[1] === child1);
        }
    );

    it('should return an array containing multiple text siblings',
        function () {
            var range = new Range(),
                parent = new Parent(),
                child = parent.append(new Text('alfred')),
                child1 = parent.append(new Text('bertrand')),
                child2 = parent.append(new Text('cees')),
                child3 = parent.append(new Text('dick')),
                child4 = parent.append(new Text('eric')),
                child5 = parent.append(new Text('ferdinand')),
                result;

            range.setStart(child);
            range.setEnd(child5);
            result = range.getContent();
            assert(result.length === 6);
            assert(
                result.join() === 'alfred,bertrand,cees,dick,eric,ferdinand'
            );

            range.setStart(child, 3);
            result = range.getContent();
            assert(result.length === 6);
            assert(
                result.join() === 'alfred,bertrand,cees,dick,eric,ferdinand'
            );

            range.setEnd(child5, 7);
            result = range.getContent();
            assert(result.length === 6);
            assert(
                result.join() === 'alfred,bertrand,cees,dick,eric,ferdinand'
            );
        }
    );

    it('should return an array containing text children of different parents',
        function () {
            var range = new Range(),
                grandparent = new TextOM.ParagraphNode(),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent.append(new TextOM.WordNode('bertrand')),
                child2 = parent1.append(new TextOM.WordNode('cees')),
                child3 = parent1.append(new TextOM.WordNode('dick')),
                result;

            range.setStart(child1);
            range.setEnd(child2);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === child1);
            assert(result[1] === child2);
        }
    );

    it('should return an array containing text children of different ' +
        'grandparents', function () {
            var range = new Range(),
                greatGrandparent = new TextOM.RootNode(),
                grandparent = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                grandparent1 = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent.append(new TextOM.WordNode('bertrand')),
                child2 = parent1.append(new TextOM.WordNode('cees')),
                child3 = parent1.append(new TextOM.WordNode('dick')),
                result;

            range.setStart(child1);
            range.setEnd(child2);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === child1);
            assert(result[1] === child2);
            assert(result.join() === 'bertrand,cees');
        }
    );

    it('should return an empty array, when start- and endContainer no ' +
        'longer share the same root', function () {
            var range = new Range(),
               parent = new Parent(),
               child = parent.append(new Text('alfred')),
               child1 = parent.append(new Text('bertrand')),
               child2 = parent.append(new Text('cees'));

            range.setStart(child);
            range.setEnd(child2);
            assert(range.getContent().join() === 'alfred,bertrand,cees');

            child2.remove();
            assert(range.getContent().length === 0);
        }
    );

    it('should return an array containing startContainer, when ' +
        'startContainer equals endContainer, is an Element node, ' +
        'startOffset is `0`, and endOffset is equal to or greater ' +
        'than the length of node', function () {
            var range = new Range(),
                grandparent = new TextOM.ParagraphNode(),
                parent = grandparent.append(new TextOM.SentenceNode()),
                result;

            range.setStart(parent);
            range.setEnd(parent);
            result = range.getContent();
            assert(result.length === 1);
            assert(result[0] === parent);
        }
    );

    it('should return an array containing two direct elements siblings',
        function () {
            var range = new Range(),
                grandparent = new TextOM.ParagraphNode(),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                result;

            range.setStart(parent);
            range.setEnd(parent1);
            result = range.getContent();

            assert(result.length === 2);
            assert(result[0] === parent);
            assert(result[1] === parent1);
        }
    );

    it('should return an array containing multiple elements siblings',
        function () {
            var range = new Range(),
                grandparent = new TextOM.ParagraphNode(),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                parent2 = grandparent.append(new TextOM.SentenceNode()),
                parent3 = grandparent.append(new TextOM.SentenceNode()),
                parent4 = grandparent.append(new TextOM.SentenceNode()),
                parent5 = grandparent.append(new TextOM.SentenceNode()),
                result;

            range.setStart(parent);
            range.setEnd(parent4);
            result = range.getContent();
            assert(result.length === 5);
            assert(result[0] === parent);
            assert(result[1] === parent1);
            assert(result[2] === parent2);
            assert(result[3] === parent3);
            assert(result[4] === parent4);

            range.setStart(parent1);
            result = range.getContent();
            assert(result.length === 4);
            assert(result[0] === parent1);
            assert(result[1] === parent2);
            assert(result[2] === parent3);
            assert(result[3] === parent4);

            range.setEnd(parent3);
            result = range.getContent();
            assert(result.length === 3);
            assert(result[0] === parent1);
            assert(result[1] === parent2);
            assert(result[2] === parent3);
        }
    );

    it('should return an array containing elements of different grandparents',
        function () {
            var range = new Range(),
                greatGrandparent = new TextOM.RootNode(),
                grandparent = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                grandparent1 = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent1.append(new TextOM.SentenceNode()),
                result;

            range.setStart(parent);
            range.setEnd(parent1);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === parent);
            assert(result[1] === parent1);
        }
    );

    it('should return an array containing children, when startContainer ' +
        'equals endContainer, is an Element node, and endOffset is NOT ' +
        'equal to or greater than the length of node', function () {
            var range = new Range(),
                grandparent = new TextOM.ParagraphNode(),
                parent = grandparent.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent.append(new TextOM.WordNode('bertrand')),
                child2 = parent.append(new TextOM.WordNode('cees')),
                child3 = parent.append(new TextOM.WordNode('dick')),
                result;

            range.setStart(parent);
            range.setEnd(parent, 3);
            result = range.getContent();
            assert(result.length === 3);
            assert(result[0] === child);
            assert(result[1] === child1);
            assert(result[2] === child2);

            range.setStart(parent, 1);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === child1);
            assert(result[1] === child2);
        }
    );

    it('should return an array containing children, when startContainer ' +
        'is an Element node, and endContainer is inside startContainer',
        function () {
            var range = new Range(),
                grandparent = new TextOM.ParagraphNode(),
                parent = grandparent.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent.append(new TextOM.WordNode('bertrand')),
                child2 = parent.append(new TextOM.WordNode('cees')),
                child3 = parent.append(new TextOM.WordNode('dick')),
                result;

            range.setStart(parent);
            range.setEnd(child2);
            result = range.getContent();
            assert(result.length === 3);
            assert(result[0] === child);
            assert(result[1] === child1);
            assert(result[2] === child2);

            range.setStart(parent, 1);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === child1);
            assert(result[1] === child2);
        }
    );

    it('should return an array containing children, when startContainer ' +
        'equals endContainer, is a grandparent, and endOffset is NOT ' +
        'equal to or greater than the length of node', function () {
            var range = new Range(),
                greatGrandparent = new TextOM.RootNode(),
                grandparent = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                parent2 = grandparent.append(new TextOM.SentenceNode()),
                parent3 = grandparent.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent1.append(new TextOM.WordNode('bertrand')),
                child2 = parent2.append(new TextOM.WordNode('cees')),
                child3 = parent3.append(new TextOM.WordNode('dick')),
                result;

            range.setStart(grandparent);
            range.setEnd(grandparent, 3);
            result = range.getContent();
            assert(result.length === 3);
            assert(result[0] === parent);
            assert(result[1] === parent1);
            assert(result[2] === parent2);

            range.setStart(grandparent, 1);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === parent1);
            assert(result[1] === parent2);
        }
    );

    it('should return an array containing children, when startContainer ' +
        'is a Parent node, and endContainer is inside startContainer',
        function () {
            var range = new Range(),
                greatGrandparent = new TextOM.RootNode(),
                grandparent = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                parent2 = grandparent.append(new TextOM.SentenceNode()),
                parent3 = grandparent.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent1.append(new TextOM.WordNode('bertrand')),
                child2 = parent2.append(new TextOM.WordNode('cees')),
                child3 = parent3.append(new TextOM.WordNode('dick')),
                result;

            range.setStart(grandparent);
            range.setEnd(child3);
            result = range.getContent();
            assert(result.length === 4);
            assert(result[0] === parent);
            assert(result[1] === parent1);
            assert(result[2] === parent2);
            assert(result[3] === child3);

            range.setStart(grandparent, 1);
            result = range.getContent();
            assert(result.length === 3);
            assert(result[0] === parent1);
            assert(result[1] === parent2);
            assert(result[2] === child3);

            range.setEnd(parent3);
            result = range.getContent();
            assert(result.length === 3);
            assert(result[0] === parent1);
            assert(result[1] === parent2);
            assert(result[2] === parent3);
        }
    );

    it('should return an array containing children but excluding ' +
        'startContainer, when startOffset is more than the length ' +
        'of startContainer', function () {
            var range = new Range(),
                greatGrandparent = new TextOM.RootNode(),
                grandparent = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                grandparent1 = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                parent2 = grandparent1.append(new TextOM.SentenceNode()),
                parent3 = grandparent1.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent1.append(new TextOM.WordNode('bertrand')),
                child2 = parent2.append(new TextOM.WordNode('cees')),
                child3 = parent3.append(new TextOM.WordNode('dick')),
                result;

            range.setStart(grandparent, Infinity);
            range.setEnd(child3);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === parent2);
            assert(result[1] === child3);

            range.setStart(parent, Infinity);
            result = range.getContent();
            assert(result.length === 3);
            assert(result[0] === parent1);
            assert(result[1] === parent2);
            assert(result[2] === child3);

            range = new Range();
            greatGrandparent = new TextOM.RootNode();
            grandparent = greatGrandparent.append(
                new TextOM.ParagraphNode()
            );
            grandparent1 = greatGrandparent.append(
                new TextOM.ParagraphNode()
            );
            parent = grandparent.append(new TextOM.SentenceNode());
            parent1 = grandparent1.append(new TextOM.SentenceNode());
            parent2 = grandparent1.append(new TextOM.SentenceNode());

            range.setStart(parent, Infinity);
            range.setEnd(parent2);
            result = range.getContent();
            assert(result.length === 1);
            assert(result[0] === grandparent1);
        }
    );

    it('should return an array containing children, when endContainer ' +
        'is an element, and endOffset is equal to or greater than the ' +
        'length of node', function () {
            var range = new Range(),
                greatGrandparent = new TextOM.RootNode(),
                grandparent = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                grandparent1 = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                parent2 = grandparent1.append(new TextOM.SentenceNode()),
                parent3 = grandparent1.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent1.append(new TextOM.WordNode('bertrand')),
                child2 = parent2.append(new TextOM.WordNode('cees')),
                child3 = parent3.append(new TextOM.WordNode('dick')),
                result;

            range.setStart(grandparent);
            range.setEnd(parent3, Infinity);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === grandparent);
            assert(result[1] === grandparent1);

            range.setEnd(grandparent1);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === grandparent);
            assert(result[1] === grandparent1);
        }
    );

    it('should return an array containing children, when endContainer ' +
        'is an element, and endOffset is less than the length of node',
        function () {
            var range = new Range(),
                greatGrandparent = new TextOM.RootNode(),
                grandparent = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                grandparent1 = greatGrandparent.append(
                    new TextOM.ParagraphNode()
                ),
                parent = grandparent.append(new TextOM.SentenceNode()),
                parent1 = grandparent.append(new TextOM.SentenceNode()),
                parent2 = grandparent1.append(new TextOM.SentenceNode()),
                parent3 = grandparent1.append(new TextOM.SentenceNode()),
                child = parent.append(new TextOM.WordNode('alfred')),
                child1 = parent.append(new TextOM.WordNode('bertrand')),
                child2 = parent1.append(new TextOM.WordNode('cees')),
                child3 = parent1.append(new TextOM.WordNode('dick')),
                child4 = parent2.append(new TextOM.WordNode('eric')),
                child5 = parent2.append(new TextOM.WordNode('ferdinand')),
                child6 = parent3.append(new TextOM.WordNode('gerard')),
                child7 = parent3.append(new TextOM.WordNode('hendrick')),
                result;

            range.setStart(grandparent);
            range.setEnd(parent3, 1);
            result = range.getContent();
            assert(result.length === 3);
            assert(result[0] === grandparent);
            assert(result[1] === parent2);
            assert(result[2] === child6);

            range.setEnd(grandparent1, 1);
            result = range.getContent();
            assert(result.length === 2);
            assert(result[0] === grandparent);
            assert(result[1] === parent2);
        }
    );
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
    it('should throw when appending a `RootNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                (new TextOM.RootNode()).append(new TextOM.RootNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `ParagraphNode` to a `RootNode`',
        function () {
            assert.doesNotThrow(function () {
                (new TextOM.RootNode()).append(new TextOM.ParagraphNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `SentenceNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                (new TextOM.RootNode()).append(new TextOM.SentenceNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `WordNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                (new TextOM.RootNode()).append(new TextOM.WordNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `PunctuationNode` to a `RootNode`',
        function () {
            assert.throws(function () {
                (new TextOM.RootNode()).append(new TextOM.PunctuationNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a `RootNode`',
        function () {
            assert.doesNotThrow(function () {
                (new TextOM.RootNode()).append(new TextOM.WhiteSpaceNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `RootNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                (new TextOM.ParagraphNode()).append(new TextOM.RootNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `ParagraphNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                (new TextOM.ParagraphNode()).append(
                    new TextOM.ParagraphNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `SentenceNode` to a ' +
        '`ParagraphNode`', function () {
            assert.doesNotThrow(function () {
                (new TextOM.ParagraphNode()).append(
                    new TextOM.SentenceNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `WordNode` to a `ParagraphNode`',
        function () {
            assert.throws(function () {
                (new TextOM.ParagraphNode()).append(new TextOM.WordNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `PunctuationNode` to a ' +
        '`ParagraphNode`', function () {
            assert.throws(function () {
                (new TextOM.ParagraphNode()).append(
                    new TextOM.PunctuationNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a ' +
        '`ParagraphNode`', function () {
            assert.doesNotThrow(function () {
                (new TextOM.ParagraphNode()).append(
                    new TextOM.WhiteSpaceNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `RootNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                (new TextOM.SentenceNode()).append(new TextOM.RootNode());
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `ParagraphNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                (new TextOM.SentenceNode()).append(
                    new TextOM.ParagraphNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should throw when appending a `SentenceNode` to a `SentenceNode`',
        function () {
            assert.throws(function () {
                (new TextOM.SentenceNode()).append(new TextOM.SentenceNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `PunctuationNode` to a ' +
        '`SentenceNode`', function () {
            assert.doesNotThrow(function () {
                (new TextOM.SentenceNode()).append(
                    new TextOM.PunctuationNode()
                );
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `WordNode` to a `SentenceNode`',
        function () {
            assert.doesNotThrow(function () {
                (new TextOM.SentenceNode()).append(new TextOM.WordNode());
            }, /HierarchyError/);
        }
    );

    it('should NOT throw when appending a `WhiteSpaceNode` to a ' +
        '`SentenceNode`', function () {
            assert.doesNotThrow(function () {
                (new TextOM.SentenceNode()).append(
                    new TextOM.WhiteSpaceNode()
                );
            }, /HierarchyError/);
        }
    );
});

describe('Events on TextOM.Parent', function () {
    describe('[insertinside]', function () {
        it('emits on all `Child`s ancestors, with the current ancestor ' +
            'as the context, and the inserted child as an argument, when ' +
            'a Child is inserted', function () {
                var rootNode = new TextOM.RootNode(),
                    paragraphNode = rootNode.append(
                        new TextOM.ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new TextOM.SentenceNode()
                    ),
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
                var rootNode = new TextOM.RootNode(),
                    paragraphNode = rootNode.append(
                        new TextOM.ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new TextOM.SentenceNode()
                    ),
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

                TextOM.RootNode.on('insertinside',
                    oninsertinsideFactory(rootNode)
                );
                TextOM.ParagraphNode.on('insertinside',
                    oninsertinsideFactory(paragraphNode)
                );
                TextOM.SentenceNode.on('insertinside',
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
                TextOM.RootNode.off('insertinside');
                TextOM.ParagraphNode.off('insertinside');
                TextOM.SentenceNode.off('insertinside');
            });
        }
    );

    describe('[removeinside]', function () {
        it('emits on all `Child`s ancestors, with the current ancestor ' +
            'as the context, and the removed child as an argument, when ' +
            'a Child is removed', function () {
                var rootNode = new TextOM.RootNode(),
                    paragraphNode = rootNode.append(
                        new TextOM.ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new TextOM.SentenceNode()
                    ),
                    wordNode = sentenceNode.append(
                        new TextOM.WordNode('alfred')
                    ),
                    whiteSpaceNode = rootNode.append(
                        new TextOM.WhiteSpaceNode('\n\n')
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
                var rootNode = new TextOM.RootNode(),
                    paragraphNode = rootNode.append(
                        new TextOM.ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new TextOM.SentenceNode()
                    ),
                    wordNode = sentenceNode.append(
                        new TextOM.WordNode('alfred')
                    ),
                    whiteSpaceNode = rootNode.append(
                        new TextOM.WhiteSpaceNode('\n\n')
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

                TextOM.RootNode.on('removeinside',
                    onremoveinsideFactory(rootNode)
                );
                TextOM.ParagraphNode.on('removeinside',
                    onremoveinsideFactory(paragraphNode)
                );
                TextOM.SentenceNode.on('removeinside',
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
                TextOM.RootNode.off('removeinside');
                TextOM.ParagraphNode.off('removeinside');
                TextOM.SentenceNode.off('removeinside');
            }
        );
    });

    describe('[changetextinside]', function () {
        it('emits on all `Text`s ancestors, with the current ancestor as ' +
            'the context, and the changed child and the previous value as ' +
            'arguments, when a Text is changed', function () {
                var rootNode = new TextOM.RootNode(),
                    paragraphNode = rootNode.append(
                        new TextOM.ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new TextOM.SentenceNode()
                    ),
                    wordNode = sentenceNode.append(
                        new TextOM.WordNode('alfred')
                    ),
                    whiteSpaceNode = rootNode.append(
                        new TextOM.WhiteSpaceNode('\n\n')
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
                var rootNode = new TextOM.RootNode(),
                    paragraphNode = rootNode.append(
                        new TextOM.ParagraphNode()
                    ),
                    sentenceNode = paragraphNode.append(
                        new TextOM.SentenceNode()
                    ),
                    wordNode = sentenceNode.append(
                        new TextOM.WordNode('alfred')
                    ),
                    whiteSpaceNode = rootNode.append(
                        new TextOM.WhiteSpaceNode('\n\n')
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

                TextOM.RootNode.on('changetextinside',
                    onchangetextinsideFactory(rootNode)
                );
                TextOM.ParagraphNode.on('changetextinside',
                    onchangetextinsideFactory(paragraphNode)
                );
                TextOM.SentenceNode.on('changetextinside',
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

                TextOM.RootNode.off('changetextinside');
                TextOM.ParagraphNode.off('changetextinside');
                TextOM.SentenceNode.off('changetextinside');
            }
        );
    });
});

describe('Events on TextOM.Child', function () {
    describe('[insert]', function () {
        it('emits on child and all `child`s constructors, with `child` as ' +
            'the context, when `child` is inserted', function () {
                var paragraphNode = new TextOM.ParagraphNode(),
                    sentenceNode = new TextOM.SentenceNode(),
                    wordNode = sentenceNode.append(
                        new TextOM.WordNode('alfred')
                    ),
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
            }
        );
    });

    describe('[changenext]', function () {
        it('emits on child and all child\'s constructors, with child as the ' +
            'context, and the new and the old next nodes as arguments, ' +
            'when the `next` attribute on child changes', function () {
                var sentenceNode = new TextOM.SentenceNode(),
                    wordNode = sentenceNode.append(
                        new TextOM.WordNode('alfred')
                    ),
                    whiteSpaceNode = sentenceNode.append(
                        new TextOM.WhiteSpaceNode(' ')
                    ),
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
            }
        );
    });

    describe('[changeprev]', function () {
        it('emits on child and all child\'s constructors, with child as the ' +
            'context, and the new and the old prev nodes as arguments, ' +
            'when the `prev` attribute on child changes', function () {
                var sentenceNode = new TextOM.SentenceNode(),
                    wordNode = sentenceNode.append(
                        new TextOM.WordNode('alfred')
                    ),
                    whiteSpaceNode = sentenceNode.append(
                        new TextOM.WhiteSpaceNode(' ')
                    ),
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
            }
        );
    });

    describe('[remove]', function () {
        it('emits on child and all `child`s constructors, with `child` as ' +
            'the context, and the previous parent as an argument, when ' +
            '`child` is removed', function () {
                var paragraphNode = new TextOM.ParagraphNode(),
                    sentenceNode = paragraphNode.append(
                        new TextOM.SentenceNode()
                    ),
                    iterator = 0;

                function onremove(parent) {
                    iterator++;
                    assert(this === sentenceNode);
                    assert(parent === paragraphNode);
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
            }
        );
    });
});

describe('Events on TextOM.Text', function () {
    describe('[changetext]', function () {
        it('emits on text and all `text`s constructors, with `text` as the ' +
            'context, and the current and previous values as arguments, ' +
            'when a `text` is changed', function () {
                var sentenceNode = new TextOM.SentenceNode(),
                    wordNode = sentenceNode.append(
                        new TextOM.WordNode('alfred')
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

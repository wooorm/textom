'use strict';

/**
 * Dependencies.
 */

var TextOMConstructor;

TextOMConstructor = require('./');

/**
 * `TextOM`.
 */

var TextOM;

TextOM = new TextOMConstructor();

/**
 * Fixtures.
 */

var parent,
    append,
    prepend,
    before,
    after,
    children,
    child,
    otherChild,
    anotherChild;

parent = new TextOM.Parent();
child = new TextOM.Child();
otherChild = new TextOM.Child();
anotherChild = new TextOM.Child();

children = Array.apply(0, Array(100)).map(function () {
    return parent.append(new TextOM.Child());
});

parent.append(child);
parent.append(otherChild);
parent.append(anotherChild);

append = parent.append;
prepend = parent.prepend;
before = child.before;
after = child.after;

/**
 * Benchmark.
 */

set('concurrency', 1);

suite('Parent', function () {
    bench('Append 1 new node to an empty parent', function () {
        new TextOM.Parent().append(new TextOM.Child());
    });

    bench('Append 2 new nodes to an empty parent', function () {
        parent = new TextOM.Parent();

        parent.append(new TextOM.Child());
        parent.append(new TextOM.Child());
    });

    bench('Append 3 new nodes to an empty parent', function () {
        parent = new TextOM.Parent();

        parent.append(new TextOM.Child());
        parent.append(new TextOM.Child());
        parent.append(new TextOM.Child());
    });

    bench('Append 1 attached node to an empty parent', function () {
        new TextOM.Parent().append(child);
    });

    bench('Append 2 attached nodes to an empty parent', function () {
        parent = new TextOM.Parent();

        parent.append(child);
        parent.append(otherChild);
    });

    bench('Append 3 attached nodes to an empty parent', function () {
        parent = new TextOM.Parent();

        parent.append(child);
        parent.append(otherChild);
        parent.append(anotherChild);
    });

    bench('Append 100 attached nodes to an empty parent', function () {
        children.forEach(append, new TextOM.Parent());
    });

    bench('Prepend 1 new node to an empty parent', function () {
        new TextOM.Parent().prepend(new TextOM.Child());
    });

    bench('Prepend 2 new nodes to an empty parent', function () {
        parent = new TextOM.Parent();

        parent.prepend(new TextOM.Child());
        parent.prepend(new TextOM.Child());
    });

    bench('Prepend 3 new nodes to an empty parent', function () {
        parent = new TextOM.Parent();

        parent.prepend(new TextOM.Child());
        parent.prepend(new TextOM.Child());
        parent.prepend(new TextOM.Child());
    });

    bench('Prepend 1 attached node to an empty parent', function () {
        new TextOM.Parent().prepend(child);
    });

    bench('Prepend 2 attached nodes to an empty parent', function () {
        parent = new TextOM.Parent();

        parent.prepend(child);
        parent.prepend(otherChild);
    });

    bench('Prepend 3 attached nodes to an empty parent', function () {
        parent = new TextOM.Parent();

        parent.prepend(child);
        parent.prepend(otherChild);
        parent.prepend(anotherChild);
    });

    bench('Prepend 100 attached nodes to an empty parent', function () {
        children.forEach(prepend, new TextOM.Parent());
    });
});

suite('Child', function () {
    bench('Insert 1 new node after an only child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .after(new TextOM.Child());
    });

    bench('Insert 2 new nodes after an only child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .after(new TextOM.Child())
            .after(new TextOM.Child());
    });

    bench('Insert 3 new nodes after an only child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .after(new TextOM.Child())
            .after(new TextOM.Child())
            .after(new TextOM.Child());
    });

    bench('Insert 1 attached node after an only child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .after(child);
    });

    bench('Insert 2 attached nodes after an only child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .after(child)
            .after(otherChild);
    });

    bench('Insert 3 attached nodes after an only child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .after(child)
            .after(otherChild)
            .after(anotherChild);
    });

    bench('Insert 100 attached nodes after a first child', function () {
        children.forEach(after, new TextOM.Parent().append(child));
    });

    bench('Insert 1 new node before a first child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .before(new TextOM.Child());
    });

    bench('Insert 2 new nodes before a first child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .before(new TextOM.Child())
            .before(new TextOM.Child());
    });

    bench('Insert 3 new nodes before a first child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .before(new TextOM.Child())
            .before(new TextOM.Child())
            .before(new TextOM.Child());
    });

    bench('Insert 1 attached node before a first child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .before(child);
    });

    bench('Insert 2 attached nodes before a first child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .before(child)
            .before(otherChild);
    });

    bench('Insert 3 attached nodes before a first child', function () {
        new TextOM.Parent()
            .append(new TextOM.Child())
            .before(child)
            .before(otherChild)
            .before(anotherChild);
    });

    bench('Insert 100 attached nodes before a first child', function () {
        children.forEach(before, new TextOM.Parent().append(child));
    });
});

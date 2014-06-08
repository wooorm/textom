# TextOM [![Build Status](https://travis-ci.org/wooorm/textom.png)](https://travis-ci.org/wooorm/textom)

**TextOM** provides an object model for natural language in JavaScript. No dependencies. NodeJS, and the browser. Lots of tests (280+), including 640+ assertions. 100% coverage.

Note: This project is **not** a parser for natural language, or an extensible system for analysing and manipulating natural language, its rather the core that lies underneath such systems. Its like a simplified and modified version of the DOM, without any parsing capabilities, for natural language. If you need the above-mentioned functionalities, use the following project—both build on top of this module.

* For parsing capabilities, see [parse-english](https://github.com/wooorm/parse-english "Parse English");
* For a pluggable system for analysing and manipulating, see [retext](https://github.com/wooorm/retext "Retext").

## Installation

```sh
$ npm install textom
```

## Usage

```js
TextOM = require('textom')();
var root = new TextOM();
```

## API
See below for an abbreviated IDL definition.

Lets say all the following examples start with this code. Any changes made by below examples are discarded upon their ending.
```js
// Import TextOM.
var TextOM = require('textom')();

// Create a root.
var root = new TextOM();

// Add a paragraph.
var paragraph = new TextOM.ParagraphNode();
root.append(paragraph);

// Add a sentence.
var sentence = new TextOM.SentenceNode();
paragraph.append(sentence);

// Add some actual contents.
var dogs = new TextOM.WordNode('Dogs')
var space0 = new TextOM.WhiteSpaceNode(' ')
var ampersand = new TextOM.PunctuationNode('&')
var space1 = new TextOM.WhiteSpaceNode(' ')
var cats = new TextOM.WordNode('cats')
var fullStop = new TextOM.PunctuationNode('.')

sentence.append(dogs);
sentence.append(space0);
sentence.append(ampersand);
sentence.append(space1);
sentence.append(cats);
sentence.append(fullStop);
```

### TextOM
```js
new TextOM(); // An instance of RootNode.
```

Returns a new RootNode (the same as `new TextOM.RootNode()`);

#### TextOM.Node
Constructor. Creates a new Node.

##### TextOM\.Node.on(name, listener)
```js
TextOM.WordNode.on('changetext', function (value, previousValue) {
  this; // the node which text changed
  value; // the current value
  previousValue; // the previous value
});
```

Registers the specified listener on any instance of constructor, to events of the given name. Returns self.

##### TextOM\.Node.off(name?, listener?)
```js
TextOM.WordNode.off('changetext');
```

Removes the specified listener on all instances of constructor, to events of the given name.
If no listener is given, removes all listeners to events of the given type.
If no name and node listener are given, removes all listeners to all events.
Returns self.

##### TextOM\.Node#on(name, listener)
```js
root.on('insertinside', function (node) {
  node; // the inserted node
});
```

Registers the specified listener on the node it's called on, to events of the given name. Returns self.

##### TextOM\.Node#off(name?, listener?)
```js
root.off('insertinside');
```

Removes the specified listener on the node it's called on, to events of the given name.
If no listener is given, removes all listeners to events of the given type.
If no name and node listener are given, removes all listeners to all events.
Returns self.

##### TextOM\.Node#TextOM
```js
root.TextOM === TextOM; // true
```

Every node contains a `TextOM` attribute linking back to the original TextOM.

##### TextOM\.Node#ROOT_NODE
```js
root.type === root.ROOT_NODE; // true
root.type === TextOM.ROOT_NODE; // true
```

Unique identifier for all instances of `RootNode`.

##### TextOM\.Node#PARAGRAPH_NODE
```js
paragraph.type === paragraph.PARAGRAPH_NODE; // true
paragraph.type === TextOM.PARAGRAPH_NODE; // true
```

Unique identifier for all instances of `ParagraphNode`.

##### TextOM\.Node#SENTENCE_NODE
```js
sentence.type === sentence.SENTENCE_NODE; // true
sentence.type === TextOM.SENTENCE_NODE; // true
```

Unique identifier for all instances of `SentenceNode`.

##### TextOM\.Node#WORD_NODE
```js
dogs.type === dogs.WORD_NODE; // true
dogs.type === TextOM.WORD_NODE; // true
```

Unique identifier for all instances of `WordNode`.

##### TextOM\.Node#PUNCTUATION_NODE
```js
fullStop.type === fullStop.PUNCTUATION_NODE; // true
fullStop.type === TextOM.PUNCTUATION_NODE; // true
```

Unique identifier for all instances of `PunctuationNode`.

##### TextOM\.Node#WHITE_SPACE_NODE
```js
space0.type === space0.WHITE_SPACE_NODE; // true
space0.type === TextOM.WHITE_SPACE_NODE; // true
```

Unique identifier for all instances of `WhiteSpaceNode`.

#### TextOM.Parent
Constructor. Creates a new Parent. Inherits from Node (i.e., a node accepting children).

##### TextOM\.Parent#head
```js
paragraph.head; // sentence
sentence.head; // dogs
```

The first child of a parent, null otherwise.

##### TextOM\.Parent#tail
```js
paragraph.tail; // null (see description below);
sentence.tail; // fullStop
```

The last child of a parent (unless the last child is also the first child), null otherwise.
     
##### TextOM\.Parent#length
```js
root.length; // 1
sentence.length; // 6
```

The number of children in a parent.

##### TextOM\.Parent#prepend(child)
```js
sentence.head; // dogs
sentence.prepend(fullStop);
sentence.head; // fullStop
```

Insert a child at the beginning of the list (like Array#unshift).

##### TextOM\.Parent#append(child)
```js
sentence.tail; // fullStop
sentence.append(dogs);
sentence.tail; // dogs
```

Insert a child at the end of the list (like Array#push).

##### TextOM\.Parent#item(index?)
```js
root.item(); // paragraph
sentence.item(0); // dogs
sentence.item(6); // fullStop
sentence.item(7); // null
```

Return a child at given position in parent, and null otherwise. (like NodeList#item).
     
##### TextOM\.Parent#toString
```js
root.toString(); // "Dogs & cats."
'' + sentence; // "Dogs & cats."
```

Return the result of calling `toString` on each of `Parent`s children.

#### TextOM.Child
Constructor. Creates a new Child. Inherits from Node (i.e., a node accepting a parent).

##### TextOM\.child#parent
```js
dogs.parent; // sentence
sentence.parent; // paragraph
paragraph.parent; // root
```

The parent node, null otherwise (when the child is detached).

##### TextOM\.child#prev
```js
dogs.prev; // null
space1.prev; // dogs
```

The previous node, null otherwise (when `child` is the parents first child or detached).
     
##### TextOM\.child#next
```js
cats.next; // fullStop
fullStop.next; // null
```

The next node, null otherwise (when `child` is the parents last child or detached).

##### TextOM\.Child#before(child)
```js
dogs.prev; // null
dogs.before(cats);
dogs.prev; // cats
```

Insert a given child before the operated on child in the parent.

##### TextOM\.Child#after(child)
```js
cats.next; // null
cats.before(dogs);
cats.next; // dogs
```

Insert a given child after the operated on child in the parent.

##### TextOM\.Child#remove()
```js
root.toString(); // "Dogs & cats."
fullStop.remove();
root.toString(); // "Dogs & cats"
```

Remove the operated on child.

##### TextOM\.Child#replace(child)
```js
root.toString(); // "Dogs & cats."
cats.replace(dogs);
root.toString(); // " & Dogs"
```

Remove the operated on child, and insert a given child at its previous position in the parent.

#### TextOM.Element()
Constructor. Creates a new Element. Inherits from Parent and Child (i.e., a node accepting both children and a parent).

#### TextOM.Text(value?)
Constructor. Creates a new Element. Inherits from Child. Has a value.


##### TextOM\.Text#toString()
```js
dogs.toString(); // "Dogs"
space1.toString(); // " "
fullStop.toString(); // "."
```

Returns the internal value of a Text.

##### TextOM\.Text#fromString(value?)
```js
'' + root; // "Dogs & cats."
cats.fromString();
'' + root; // "Dogs & ."
cats.fromString("Cats");
'' + root; // "Dogs & Cats."
```

(Re)sets and returns the internal value of a Text with the stringified version of the given value.

##### TextOM\.Text#split(position)
```js
cats.prev; // space1
cats.split(2);
'' + cats; // "ts"
'' + cats.prev; // "ca"
```

Split the node into two nodes, prepends a new node (an instance of the operated on `text`s constructor), moving the internal value from 0–position to the prepended node, and removing it from the operated on node.

#### TextOM.Range()
Constructor. Creates a new Range (an object allowing for cross-tree manipulation).

##### TextOM\.Range#setStart(node, offset?)
```js
var range = new Range();
range.setStart(dogs, 1);
range.startContainer; // dogs
range.startOffset; // 1
```

Set the start container and offset of a range.

##### TextOM\.Range#setEnd(node, offset?)
```js
var range = new Range();
range.setEnd(fullStop, 2);
range.endContainer; // fullStop
range.endOffset; // 2
```

Set the end container and offset of a range.

##### TextOM\.Range#cloneRange()
Clones the range into a new range object.

##### TextOM\.Range#toString()
```js
var range = new Range();
range.setStart(space0);
range.setEnd(space1);
range.toString(); // " & "

range.setStart(dogs);
range.toString(); // "Dogs & "

range.setEnd(cats, 2);
range.toString(); // "Dogs & ca"

range.setEnd(fullStop);
range.toString(); // "Dogs & cats."
```

Return the result of calling `toString` on each text node inside `range`, sub-stringing when necessary;

##### TextOM\.Range#removeContent()
```js
var range = new Range();
range.setStart(space0);
range.setEnd(space1);
range.removeContent(); // [space0, ampersand, space1]
range.toString(); // [dogs, cats, fullStop]
```

Or with partial covered nodes...

```js
var range = new Range();
range.setStart(dogs, 2);
range.setEnd(cats, 2);
range.removeContent(); // [gs, space0, ampersand, space1, ca]
range.toString(); // [do, ts, fullStop]
```

Removes all nodes completely covered by `range` and removes the parts covered by `range` in partial covered nodes.

##### TextOM\.Range#getContent()
```js
var range = new Range();
range.setStart(space0);
range.setEnd(space1);
range.getContent(); // [space0, ampersand, space1]

range.setStart(dogs, 2);
range.getContent(); // [dogs, space0, ampersand, space1]

range.setEnd(cats, 1);
range.getContent(); // [dogs, space0, ampersand, space1, cats]

range.setEnd(fullStop);
range.getContent(); // [dogs, space0, ampersand, space1, cats, fullStop]
```

Return the nodes in a range as an array. If a nodes parent is completely encapsulated by the range, returns that parent. Ignores startOffset (i.e., treats as `0`) when startContainer is a text node. Ignores endOffset (i.e., treats as `Infinity`) when endContainer is a text node.

### IDL
The following IDL document gives a short view of the defined interfaces by TextOM. Note: It not might be that valid in the eyes of W3C standardistas, buts its pretty readable for us simple developers :).

```idl
module textom
{
  [Constructor]
  interface Node {
    const unsigned long ROOT_NODE = 1
    const unsigned long PARAGRAPH_NODE = 2
    const unsigned long SENTENCE_NODE = 3
    const unsigned long WORD_NODE = 4
    const unsigned long PUNCTUATION_NODE = 5
    const unsigned long WHITE_SPACE_NODE = 6

    void on(String type, Function callback);
    void off(optional String type = null, optional Function callback = null);
  };

  [Constructor,
   ArrayClass]
  interface Parent {
    getter Child? item(unsigned long index);
    readonly attribute unsigned long length;

    readonly attribute Child? head;
    readonly attribute Child? tail;

    Child prepend(Child child);
    Child append(Child child);

    [NewObject] Parent split(unsigned long position);
    
    string toString();
  };
  Parent implements Node;

  [Constructor]
  interface Child {
    readonly attribute Parent? parent;
    readonly attribute Child? prev;
    readonly attribute Child? next;

    Child before(Child child);
    Child after(Child child);
    Child replace(Child child);
    Child remove(Child child);
  };
  Child implements Node;

  [Constructor]
  interface Element {
  };
  Element implements Child;
  Element implements Parent;

  [Constructor(optional String value = "")]
  interface Text {
    string toString();
    string fromString(String value);
    [NewObject] Text split(unsigned long position);
  };
  Text implements Child;

  [Constructor]
  interface RootNode {
    readonly attribute unsigned long type = 1;
    readonly attribute unsigned long hierarchy = 1;
  };
  RootNode implements Parent;

  [Constructor]
  interface ParagraphNode {
    readonly attribute unsigned long type = 2;
    readonly attribute unsigned long hierarchy = 2;
  };
  ParagraphNode implements Element;

  [Constructor]
  interface SentenceNode {
    readonly attribute unsigned long type = 3;
    readonly attribute unsigned long hierarchy = 3;
  };
  SentenceNode implements Element;

  [Constructor(optional String value = "")]
  interface WordNode {
    readonly attribute unsigned long type = 4;
    readonly attribute unsigned long hierarchy = 4;
  };
  WordNode implements Text;

  [Constructor(optional String value = "")]
  interface WhiteSpaceNode {
    readonly attribute unsigned long type = 5;
  };
  WhiteSpaceNode implements Text;

  [Constructor(optional String value = "")]
  interface PunctuationNode {
    readonly attribute unsigned long type = 6;
    readonly attribute unsigned long hierarchy = 4;
  };
  PunctuationNode implements Text;

  [Constructor]
  interface Range {
    readonly attribute Node? startContainer;
    readonly attribute unsigned long? startOffset;
    readonly attribute Node? endContainer;
    readonly attribute unsigned long? endOffset;
    void setStart(Node node, unsigned long offset);
    void setEnd(Node node, unsigned long offset);
  
    [NewObject] Range cloneRange();
  
    string toString();
    Array getContent();
    Array removeContent();
  };
}
```

## Events
TextOM provides a few handy events, listened to through the `on`—and its opposite silencing functionality, `off`—methods. These `on` and `off` methods exist on every instance of Node, and on every constructor (e.g., Node, Element, and WhiteSpaceNode). When used on an instance, only events on that specific instance will be exposed to the listener. When however used on a constructor, all events on all instances will be exposed to the listener.

TextOM provides two different types of events: Bubbling, and non-bubbling. In API terms, bubbling event names end with `"inside"`.

### Non-bubbling (“normal”) events
Normal events fire on instances of Child (and thus also on Element, or Text—which both subclass Child), and do not continue firing on through ancestors. They do however, fire on all constructors of the instance.

Lets say, for example, we have the example in [API](#api), and add the following code to it:

```js
dogs.fromString('Poodles');
```

A `"changetext"` event will fire on dogs, and because dogs is an instance of WordNode, the event will also fire on WordNode. Because a WordNode also inherits from Text, the event will also fire on Text, continuing with Child, and finally on Node.

### Bubbling events
Bubbling events start at a parent, and continue up through its ancestors, until no higher ancestor exists. These events also fire on the (single) parents constructor.

Lets say, for example, we have the example in [API](#api), and add the following code to it:

```js
dogs.fromString('Poodles');
```

A `"changetextinside"` event will fire on the parent of dogs (sentence), and because sentence is an instance of SentenceNode, this event will also fire on SentenceNode. The same would happen through sentences ancestors: paragraph and ParagraphNode, root and RootNode.

### List of events
#### remove
```js
dogs.on('remove', function (parent) {
  this === dogs; // true
  parent === sentence; // true
})
dogs.remove();
```

Fired when a node is removed from its parent.

- this: the removed node;
- arguments:
  - parent: the previous parent.

#### insert
```js
dogs.on('insert', function () {
  this === dogs; // true
})
sentence.append(dogs);
```

Fired when a node is inserted into a parent.

- this: the inserted node;

#### changetext
```js
dogs.on('changetext', function (value, previousValue) {
  this === dogs; // true
  value === 'Poodles'; // true
  previousValue === 'Dogs'; // true
})
dogs.fromString('Poodles');
```

Fired when the internal value of an instance of Text (i.e., WhiteSpaceNode, PunctuationNode, or WordNode) changes.

- this: the node which text changed;
- arguments:
  - value: the current value;
  - previousValue: the previous value;

#### changeprev
```js
cats.on('changeprev', function (node, previousNode) {
  this === cats; // true
  node === ampersand; // true
  previousNode === space1; // true
})
space1.remove();
```

Fired when the `prev` attribute on a child is changed (i.e., by removing the previous node, or inserting a node before the child).

- this: the node succeeding the changed node;
- arguments:
  - node: the current `prev` attribute, null otherwise;
  - previousNode: the previous `prev` node, null otherwise;

#### changenext
```js
cats.on('changenext', function (node, previousNode) {
  this === cats; // true
  node === null; // true
  previousNode === fullStop; // true
})
fullStop.remove();
```

Fired when the `next` attribute on a child is changed (i.e., by removing the next node, or inserting a node after the child).

- this: the node succeeding the changed node;
- arguments:
  - node: the current `next` attribute, null otherwise;
  - previousNode: the previous `next` node, null otherwise;

### List of Bubbling events
#### changetextinside
```js
root.on('changetextinside', function (node, value, previousValue) {
  this === root; // true
  node === cats; // true
  value === 'lions'; // true
  previousValue === 'cats'; // true
})
cats.fromString('lions');
```

Fired when a child’s internal value changes inside an ancestor.

- this: an ancestor in which the change happened;
- arguments:
  - node: the changed node;
  - value: the current value;
  - previousValue: the previous value;

#### insertinside
```js
sentence.on('insertinside', function (node) {
  this === sentence; // true
  node === ampersand; // true
})
sentence.append(ampersand);
```

Fired when a node is inserted inside an ancestor.

- this: an ancestor in which the change happened;
- arguments:
  - node: the inserted node;

#### removeinside
```js
root.on('removeinside', function (node) {
  this === root; // true
  node === dogs; // true
})
dogs.remove();
```

Fired when a node is removed from an ancestor.

- this: an ancestor in which the change happened;
- arguments:
  - node: the removed node;

## Related

  * [parse-english](https://github.com/wooorm/parse-english "Parse English")
  * [retext](https://github.com/wooorm/retext "Retext")

## License

  MIT

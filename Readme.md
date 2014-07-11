# TextOM [![Build Status](https://travis-ci.org/wooorm/textom.svg?branch=master)](https://travis-ci.org/wooorm/textom) [![Coverage Status](https://img.shields.io/coveralls/wooorm/textom.svg)](https://coveralls.io/r/wooorm/textom?branch=master)

[![browser support](https://ci.testling.com/wooorm/textom.png) ](https://ci.testling.com/wooorm/textom)

See [Browser Support](#browser-support) for more information (a.k.a. don’t worry about those grey icons above).

---

**TextOM** provides an object model for natural language in JavaScript. No dependencies. NodeJS, and the browser. Lots of tests (280+), including 640+ assertions. 100% coverage.

Note: This project is **not** a parser for natural language, or an extensible system for analysing and manipulating natural language, its rather the core that lies underneath such systems. Its like a simplified and modified version of the DOM, without any parsing capabilities, for natural language. If you need the above-mentioned functionalities, use the following project—both build on top of this module.

* For parsing capabilities, see [parse-english](https://github.com/wooorm/parse-english "Parse English");
* For a pluggable system for analysing and manipulating, see [retext](https://github.com/wooorm/retext "Retext").

## Installation

NPM:
```sh
$ npm install textom
```

Component.js:
```sh
$ component install wooorm/textom
```

## Usage

```js
TextOM = require('textom')();
var root = new TextOM.RootNode();
```

Note that the exported object is a function, which in turn returns brand-new TextOM objects. There’s whole slew of issues that can arise from extending prototypes like (DOM) Node, NodeList, or Array—this feature however allows for multiple sandboxed environments (i.e., prototypes) without those disadvantages.

## API
See below for an abbreviated IDL definition.

Lets say all the following examples start with this code. Any changes made by below examples are discarded upon their ending.
```js
// Import TextOM.
var TextOM = require('textom')();

// Create a root.
var root = new TextOM.RootNode();

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

#### TextOM.Node
Constructor.

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

##### TextOM\.Node#emit(name, values...)
```js
TextOM.WordNode.on('custom-emitted-event', function () {
    this; // dogs
})
dogs.trigger('custom-emitted-event');
```

Fire's an event of name `name` on the node, and bubbles up through its constructors.

##### TextOM\.Node#trigger(name, values...)
```js
root.on('custom-triggered-event', function () {
    this; // dogs
})
dogs.trigger('custom-triggered-event');
```

Fire's an event of name `name` on the node, and bubbles up through its parents.

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

Unique identifier for all instances of [RootNode](#textomrootnode).

##### TextOM\.Node#PARAGRAPH_NODE
```js
paragraph.type === paragraph.PARAGRAPH_NODE; // true
paragraph.type === TextOM.PARAGRAPH_NODE; // true
```

Unique identifier for all instances of [ParagraphNode](#textomparagraphnode).

##### TextOM\.Node#SENTENCE_NODE
```js
sentence.type === sentence.SENTENCE_NODE; // true
sentence.type === TextOM.SENTENCE_NODE; // true
```

Unique identifier for all instances of [SentenceNode](#textomsentencenode).

##### TextOM\.Node#WORD_NODE
```js
dogs.type === dogs.WORD_NODE; // true
dogs.type === TextOM.WORD_NODE; // true
```

Unique identifier for all instances of [WordNode](#textomwordnode).

##### TextOM\.Node#PUNCTUATION_NODE
```js
fullStop.type === fullStop.PUNCTUATION_NODE; // true
fullStop.type === TextOM.PUNCTUATION_NODE; // true
```

Unique identifier for all instances of [PunctuationNode](#textompunctuationnode).

##### TextOM\.Node#WHITE_SPACE_NODE
```js
space0.type === space0.WHITE_SPACE_NODE; // true
space0.type === TextOM.WHITE_SPACE_NODE; // true
```

Unique identifier for all instances of [WhiteSpaceNode](#textomwhitespacenode).

##### TextOM\.Node#SOURCE_NODE

Unique identifier for all instances of [SourceNode](#textomsourcenode).

##### TextOM\.Node#TEXT_NODE

Unique identifier for all instances of [TextNode](#textomtextnode).

#### TextOM.Parent
Constructor. Inherits from [Node](#textomnode).

##### TextOM\.Parent#head
```js
paragraph.head; // sentence
sentence.head; // dogs
```

The first [child](#textomchild) of a parent, null otherwise.

##### TextOM\.Parent#tail
```js
paragraph.tail; // null (see description below);
sentence.tail; // fullStop
```

The last [child](#textomchild) of a parent (unless the last child is also the first child), null otherwise.
     
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

Insert a [child](#textomchild) at the beginning of the parent (like Array#unshift).

##### TextOM\.Parent#append(child)
```js
sentence.tail; // fullStop
sentence.append(dogs);
sentence.tail; // dogs
```

Insert a [child](#textomchild) at the end of the parent (like Array#push).

##### TextOM\.Parent#item(index?)
```js
root.item(); // paragraph
sentence.item(0); // dogs
sentence.item(6); // fullStop
sentence.item(7); // null
```

Return a [child](#textomchild) at given position in parent, and null otherwise. (like NodeList#item).
     
##### TextOM\.Parent#toString
```js
root.toString(); // "Dogs & cats."
'' + sentence; // "Dogs & cats."
```

Return the result of calling `toString` on each of `Parent`s children.

#### TextOM.Child
Constructor. Inherits from [Node](#textomnode).

##### TextOM\.child#parent
```js
dogs.parent; // sentence
sentence.parent; // paragraph
paragraph.parent; // root
```

The [parent](#textomparent) node, null otherwise (when the child is detached).

##### TextOM\.child#prev
```js
dogs.prev; // null
space1.prev; // dogs
```

The previous sibling, null otherwise (when the context object is the first of its parent's children or detached).
     
##### TextOM\.child#next
```js
cats.next; // fullStop
fullStop.next; // null
```

The next sibling, null otherwise (when the context object is the last of its parent's children, or detached).

##### TextOM\.Child#before(child)
```js
dogs.prev; // null
dogs.before(cats);
dogs.prev; // cats
```

Insert a given [child](#textomchild) before the context object's position in its [parent](#textomparent).

##### TextOM\.Child#after(child)
```js
cats.next; // null
cats.before(dogs);
cats.next; // dogs
```

Insert a given [child](#textomchild) after the context object's position in its [parent](#textomparent).

##### TextOM\.Child#remove()
```js
root.toString(); // "Dogs & cats."
fullStop.remove();
root.toString(); // "Dogs & cats"
```

Remove the operated on [child](#textomchild).

##### TextOM\.Child#replace(child)
```js
root.toString(); // "Dogs & cats."
cats.replace(dogs);
root.toString(); // " & Dogs"
```

Remove the context object and insert a given [child](#textomchild) at its previous position in its [parent](#textomparent).

#### TextOM.Element()
Constructor. Inherits from [Parent](#textomparent) and [Child](#textomchild) (i.e., a node accepting both children and a parent).

#### TextOM.Text(value?)
Constructor. Inherits from [Child](#textomchild). Has a value.

##### TextOM\.Text#toString()
```js
dogs.toString(); // "Dogs"
space1.toString(); // " "
fullStop.toString(); // "."
```

Returns the internal value of the context object.

##### TextOM\.Text#fromString(value?)
```js
'' + root; // "Dogs & cats."
cats.fromString();
'' + root; // "Dogs & ."
cats.fromString("Cats");
'' + root; // "Dogs & Cats."
```

(Re)sets and returns the internal value of the context object with the stringified version of the given value.

##### TextOM\.Text#split(position)
```js
cats.prev; // space1
cats.split(2);
'' + cats; // "ts"
'' + cats.prev; // "ca"
```

Split the context object into two nodes: prepends a new node (an instance of the context object's constructor), moving the internal value from 0–position to the prepended node, and removing the internal value from 0–position of the context object.

#### TextOM.RootNode()
Constructor. Inherits from [Parent](#textomparent).

#### TextOM.ParagraphNode()
Constructor. Inherits from [Element](#textomelement).

#### TextOM.SentenceNode()
Constructor. Inherits from [Element](#textomelement).

#### TextOM.WordNode()
Constructor. Inherits from [Element](#textomelement).

#### TextOM.PunctuationNode()
Constructor. Inherits from [Element](#textomelement).

#### TextOM.WhiteSpaceNode()
Constructor. Inherits from [Element](#textomelement).

#### TextOM.SourceNode()
Constructor. Inherits from [Text](#textomtext).

#### TextOM.TextNode()
Constructor. Inherits from [Text](#textomtext).

### IDL
The following IDL document gives a short view of the defined interfaces by TextOM. Note: It not might be that valid in the eyes of W3C standardistas, buts its pretty readable for us simple developers :).

```idl
module textom
{
  [Constructor]
  interface Node {
    const string ROOT_NODE = "RootNode"
    const string PARAGRAPH_NODE = "ParagraphNode"
    const string SENTENCE_NODE = "SentenceNode"
    const string WORD_NODE = "WordNode"
    const string PUNCTUATION_NODE = "PunctuationNode"
    const string WHITE_SPACE_NODE = "WhiteSpaceNode"
    const string SOURCE_NODE = "SourceNode"
    const string TEXT_NODE = "TextNode"

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
    readonly attribute string type = "RootNode";
  };
  RootNode implements Parent;

  [Constructor]
  interface ParagraphNode {
    readonly attribute string type = "ParagraphNode";
  };
  ParagraphNode implements Element;

  [Constructor]
  interface SentenceNode {
    readonly attribute string type = "SentenceNode";
  };
  SentenceNode implements Element;

  [Constructor]
  interface WordNode {
    readonly attribute string type = "WordNode";
  };
  WordNode implements Parent;

  [Constructor]
  interface PunctuationNode {
    readonly attribute string type = "PunctuationNode";
  };
  PunctuationNode implements Parent;

  [Constructor]
  interface WhiteSpaceNode {
    readonly attribute string type = "WhiteSpaceNode";
  };
  WhiteSpaceNode implements PunctuationNode;

  [Constructor(optional String value = "")]
  interface TextNode {
    readonly attribute string type = "TextNode";
  };

  [Constructor(optional String value = "")]
  interface SourceNode {
    readonly attribute string type = "SourceNode";
  };
  SourceNode implements Text;
}
```

## Events
TextOM provides a few handy events, listened to through the `on`—and its opposite silencing functionality, `off`—methods. These `on` and `off` methods exist on every instance of [Node](#textomnode), and on every constructor (e.g., [Node](#textomnode), [Element](#textomelement), and [WhiteSpaceNode](#textomwhitespacenode)). When used on an instance, only events on that specific instance will be exposed to the listener. When however used on a constructor, all events on all instances will be exposed to the listener.

TextOM provides two different types of events: Bubbling, and non-bubbling. In API terms, bubbling event names end with `"inside"`.

### Non-bubbling (“normal”) events
Normal events fire on instances of [Child](#textomchild) (and thus also on [Element](#textomelement), or [Text](#textomtext)—which both subclass [Child](#textomchild)), and do not continue firing on through ancestors. They do however, fire on all constructors of the instance.

Lets say, for example, we have the example in [API](#api), and add the following code to it:

```js
dogs.fromString('Poodles');
```

A `"changetext"` event will fire on dogs, and because dogs is an instance of [WordNode](#textomwordnode), the event will also fire on [WordNode](#textomwordnode). Because a [WordNode](#textomwordnode) also inherits from [Text](#textomtext), the event will also fire on [Text](#textomtext), continuing with [Child](#textomchild), and finally on [Node](#textomnode).

### Bubbling events
Bubbling events start at a [parent](#textomparent), and continue up through its ancestors, until no higher ancestor exists. These events also fire on the (single) parents constructor.

Lets say, for example, we have the example in [API](#api), and add the following code to it:

```js
dogs.fromString('Poodles');
```

A `"changetextinside"` event will fire on the [parent](#textomparent) of dogs (sentence), and because sentence is an instance of [SentenceNode](#textomsentencenode), this event will also fire on [SentenceNode](#textomsentencenode). The same would happen through sentences ancestors: paragraph and [ParagraphNode](#textomparagraphnode), root and [RootNode](#textomrootnode).

### List of events
#### remove
```js
dogs.on('remove', function (parent) {
  this === dogs; // true
  parent === sentence; // true
})
dogs.remove();
```

Fired when a child is removed from its parent.

- this: the removed [child](#textomchild);
- arguments:
  - parent: the previous [parent](#textomparent).

#### insert
```js
dogs.on('insert', function () {
  this === dogs; // true
})
sentence.append(dogs);
```

Fired when a child is inserted into a parent.

- this: the inserted [child](#textomchild);

#### changetext
```js
dogs.on('changetext', function (value, previousValue) {
  this === dogs; // true
  value === 'Poodles'; // true
  previousValue === 'Dogs'; // true
})
dogs.fromString('Poodles');
```

Fired when the internal value of an instance of [Text](#textomtext) (i.e., WhiteSpaceNode, PunctuationNode, WordNode, or SourceNode) changes.

- this: the [text](#textomtext) which value changed;
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

Fired when the `prev` attribute on a [child](#textomchild) is changed (i.e., by removing the previous sibling, or inserting a sibling before the child).

- this: the [child](#textomchild) succeeding the changed node;
- arguments:
  - node: the current previous [child](#textomchild), null otherwise;
  - previousNode: the previous `prev` [child](#textomchild), null otherwise;

#### changenext
```js
cats.on('changenext', function (node, previousNode) {
  this === cats; // true
  node === null; // true
  previousNode === fullStop; // true
})
fullStop.remove();
```

Fired when the `next` attribute on a [child](#textomchild) is changed (i.e., by removing the next sibling, or inserting a sibling after the child).

- this: the [child](#textomchild) succeeding the changed node;
- arguments:
  - node: the current following [child](#textomchild), null otherwise;
  - previousNode: the previous `next` [child](#textomchild), null otherwise;

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

Fired when a [child](#textomchild)’s internal value changes inside an ancestor.

- this: a [parent](#textomparent) in which the change happened;
- arguments:
  - node: the changed [child](#textomchild);
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

Fired when a [child](#textomchild) is inserted inside an ancestor.

- this: a [parent](#textomparent) in which the change happened;
- arguments:
  - node: the inserted [child](#textomchild);

#### removeinside
```js
root.on('removeinside', function (node, parent) {
  this === root; // true
  parent === sentence; // true;
  node === dogs; // true
})
dogs.remove();
```

Fired when a [child](#textomchild) is removed from an ancestor.

- this: a [parent](#textomparent) in which the change happened;
- arguments:
  - node: the removed [child](#textomchild);
  - parent: the previous [parent](#textomparent).

## Browser Support
Pretty much every browser (available through browserstack) runs all TextOM unit tests; just make sure `Array#indexOf()` is [polyfill](mzl.la/19ZfdDP)’d in browser that need it.

## Related

  * [parse-latin](https://github.com/wooorm/parse-latin "Parse Latin")
  * [parse-english](https://github.com/wooorm/parse-english "Parse English")
  * [retext](https://github.com/wooorm/retext "Retext")

## License

  MIT

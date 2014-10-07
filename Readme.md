# TextOM [![Build Status](https://travis-ci.org/wooorm/textom.svg?branch=master)](https://travis-ci.org/wooorm/textom) [![Coverage Status](https://img.shields.io/coveralls/wooorm/textom.svg)](https://coveralls.io/r/wooorm/textom?branch=master)

Object model for manipulating natural language in JavaScript.

---

* For parsing capabilities, see [parse-latin](https://github.com/wooorm/parse-latin);
* For a pluggable system for analysing and manipulating natural language, see [retext](https://github.com/wooorm/retext);
* For semantics of natural language nodes, see [NLCST](https://github.com/wooorm/nlcst).

## Installation

npm:
```sh
$ npm install textom
```

Component:
```sh
$ component install wooorm/textom
```

Bower:
```sh
$ bower install textom
```

## Usage

```js
var TextOMConstructor = require('textom');

/**
 * Construct a new ``document''.
 */

var TextOM = new TextOMConstructor();

/**
 * Construct a new root node.
 */

var root = new TextOM.RootNode();
```

## API

> See below for [IDL definitions](#idl).

Let’s say all following examples start with below code.

Any changes made by below examples are discarded upon their ending.

```js
var TextOMConstructor = require('textom');

/* Construct a new ``document''. */
var TextOM = new TextOMConstructor();

/* Construct a root node. */
var root = new TextOM.RootNode();

/* Add a paragraph node. */
var paragraph = new TextOM.ParagraphNode();
root.append(paragraph);

/* Add a sentence node. */
var sentence = new TextOM.SentenceNode();
paragraph.append(sentence);

/* Add words, punctuation, and white space. */
var dogs = sentence.append(new TextOM.WordNode()),
    space0 = sentence.append(new TextOM.WhiteSpaceNode()),
    ampersand = sentence.append(new TextOM.PunctuationNode()),
    space1 = sentence.append(new TextOM.WhiteSpaceNode()),
    cats = sentence.append(new TextOM.WordNode()),
    fullStop = sentence.append(new TextOM.PunctuationNode());

/* Add content. */
var dogsText = dogs.append(new TextOM.TextNode('Dogs')),
    space0Text = space0.append(new TextOM.TextNode(' ')),
    ampersandText = ampersand.append(new TextOM.TextNode('&')),
    space1Text = space1.append(new TextOM.TextNode(' ')),
    catsText = cats.append(new TextOM.TextNode('cats')),
    fullStopText = fullStop.append(new TextOM.TextNode('.'));

/* Check root's content. */
root.toString(); // 'Dogs & cats.'
```

### TextOM

Object.

#### TextOM.Node() [[NLCST:Node](https://github.com/wooorm/nlcst#node)]

Constructor.

##### TextOM\.Node.on(name, listener)

```js
TextOM.RootNode.on('someeventname', function () {});
```

Subscribe `listener` to `name` events on instances of `Node`.

##### TextOM\.Node.off(name?, listener?)

```js
TextOM.WordNode.off('someeventname');
```

- `off(name, listener)`: Unsubscribe `listener` from `name` events on instances of `Node`;
- `off(name)`: Unsubscribe from `name` events on instances of `Node`;
- `off()`: Unsubscribe from events on instances of `Node`.

##### TextOM\.Node#on(name, listener)

```js
root.on('someeventname', function () {});
```

Subscribe `listener` to `name` events on `node`.

##### TextOM\.Node#off(name?, listener?)

```js
dogs.off('someeventname');
```

- `off(name, listener)`: Unsubscribe `listener` from `name` events on `node`;
- `off(name)`: Unsubscribe from `name` events on `node`;
- `off()`: Unsubscribe from events on `node`.


##### TextOM\.Node#emit(name, parameters...)

```js
TextOM.WordNode.on('someeventname', function () {
    this; // dogs
});

dogs.emit('someeventname');
```

- `emit(name, parameters...)`: Fire a `name` event with `parameters` on `node`;
- `emit(name)`: Fire a `name` event on `node`.

Bubbles through `node`s constructors. In the case of `dogs`: `WordNode`, `Element`, `Child`, `Parent`, `Node`.

##### TextOM\.Node#trigger(name, context, parameters...)

```js
root.on('someeventnameinside', function () {
    this; // dogs
});

dogsText.trigger('someeventname', dogs);
```

- `trigger(name, context, parameters...)`: Fire a `name` event with `parameters` on `node`;
- `trigger(name, context)`: Fire a `name` event on `node`;
- `trigger(name)`: Same as `TextOM\.Node#emit(name)`.

[`emit`](#textomnodeemitnameparameters)s an event, and triggers `name + "inside"` events on context and its parents, and their constructor.

In the case of `dogsText`: `someeventname` is emitted on `dogsText` and `TextNode`, and `someeventname` is triggered on `dogs` and `WordNode`; `sentence` and `SentenceNode`; `paragraph` and `ParagraphNode`; `root` and `RootNode`.

##### TextOM\.Node#nodeName

Identifier for [Node](#textomnodenlcstnode)s.

##### TextOM\.Node#TextOM

```js
root.TextOM === TextOM; // true
```

[TextOM](#textom) object associated with `node`.

##### TextOM\.Node#ROOT_NODE

Identifier for [RootNode](#textomrootnodenlcstrootnode)s.

##### TextOM\.Node#PARAGRAPH_NODE

Identifier for [ParagraphNode](#textomparagraphnodenlcstparagraphnode)s.

##### TextOM\.Node#SENTENCE_NODE

Identifier for [SentenceNode](#textomsentencenodenlcstsentencenode)s.

##### TextOM\.Node#WORD_NODE

Identifier for [WordNode](#textomwordnodenlcstwordnode)s.

##### TextOM\.Node#PUNCTUATION_NODE

Identifier for [PunctuationNode](#textompunctuationnodenlcstpunctuationnode)s.

##### TextOM\.Node#WHITE_SPACE_NODE

Identifier for [WhiteSpaceNode](#textomwhitespacenodenlcstwhitespacenode)s.

##### TextOM\.Node#SOURCE_NODE

Identifier for [SourceNode](#textomsourcenodenlcstsourcenode)s.

##### TextOM\.Node#TEXT_NODE

Identifier for [TextNode](#textomtextnodenlcsttextnode)s.

##### TextOM\.Node#NODE

Identifier for [Node](#textomnodenlcstnode)s.

##### TextOM\.Node#PARENT

Identifier for [Parent](#textomparentnlcstparent)s.

##### TextOM\.Node#ELEMENT

Identifier for [element](#textomelement)s.

##### TextOM\.Node#CHILD

Identifier for [Child](#textomchild)s.

##### TextOM\.Node#TEXT

Identifier for [Text](#textomtextnlcsttext)s.

#### TextOM.Parent() [[NLCST:Parent](https://github.com/wooorm/nlcst#parent)]

Constructor ([Node](#textomnodenlcstnode)).

##### TextOM\.Parent#nodeName

Identifier for [Parent](#textomparentnlcstparent)s.

##### TextOM\.Parent#head

```js
paragraph.head; // sentence
sentence.head; // dogs
```

First [child](#textomchild) of `parent` or `null`.

##### TextOM\.Parent#tail

```js
paragraph.tail; // null (see description below);
sentence.tail; // fullStop
```

Last [child](#textomchild) of `parent` (if more than one child exists) or `null`.
     
##### TextOM\.Parent#length

```js
root.length; // 1
sentence.length; // 6
```

Number of children in `parent`.

##### TextOM\.Parent#prepend(child)

```js
sentence.head; // dogs
sentence.prepend(fullStop);
sentence.head; // fullStop
```

Insert [`child`](#textomchild) as `parent`s first child.

##### TextOM\.Parent#append(child)

```js
sentence.tail; // fullStop
sentence.append(dogs);
sentence.tail; // dogs
```

Insert [`child`](#textomchild) as `parent`s last child.

##### TextOM\.Parent#item(index?)

```js
root.item(); // paragraph
sentence.item(0); // dogs
sentence.item(6); // fullStop
sentence.item(7); // null
```

- `item(index)`: Get [`Child`](#textomchild) at `index` in `parent` or `null`;
- `item()`: Get `parent`s first [`Child`](#textomchild) or `null`.
     
##### TextOM\.Parent#toString()

```js
root.toString(); // "Dogs & cats."
'' + sentence; // "Dogs & cats."
```

Get `parent`s content.

##### TextOM\.Parent#valueOf()

```js
dogs.valueOf();
/**
 * {
 *   "type": "WordNode",
 *   "children": [
 *     {
 *       "type": "TextNode",
 *       "value": "Dogs"
 *     }
 *   ]
 * }
 */
```

Get `parent`s [NLCST](https://github.com/wooorm/nlcst) representation.

#### TextOM.Child()

Constructor ([Node](#textomnodenlcstnode)).

##### TextOM\.Child#nodeName

Identifier for [Child](#textomchild)s.

##### TextOM\.child#parent

```js
dogs.parent; // sentence
sentence.parent; // paragraph
paragraph.parent; // root
```

`child`s [parent](#textomparentnlcstparent) or `null`.

##### TextOM\.child#prev

```js
dogs.prev; // null
space1.prev; // dogs
```

`child`s preceding sibling ([child](#textomchild)) or `null`.
     
##### TextOM\.child#next

```js
cats.next; // fullStop
fullStop.next; // null
```

`child`s following sibling ([child](#textomchild)) or `null`.

##### TextOM\.Child#before(sibling)

```js
dogs.prev; // null
dogs.before(cats);
dogs.prev; // cats
```

Insert `sibling` ([child](#textomchild)) as `child`s preceding sibling in `parent`.

##### TextOM\.Child#after(child)

```js
cats.next; // null
cats.before(dogs);
cats.next; // dogs
```

Insert `sibling` ([child](#textomchild)) as `child`s following sibling in `parent`.

##### TextOM\.Child#remove()

```js
root.toString(); // "Dogs & cats."
fullStop.remove();
root.toString(); // "Dogs & cats"
```

Remove `child` from `parent`.

##### TextOM\.Child#replace(sibling)

```js
root.toString(); // "Dogs & cats."
cats.replace(dogs);
root.toString(); // " & Dogs"
```


Replace `child` with `sibling` ([child](#textomchild)) in `parent`.

#### TextOM.Element()

Constructor ([Parent](#textomparentnlcstparent) and [Child](#textomchild)).

##### TextOM\.Element#nodeName

Identifier for [Element](#textomelement)s.

##### TextOM\.Element#split(position?)

```js
sentence.prev; // null
sentence.toString(); // "Dogs & cats."
sentence.split(2);
sentence.toString(); // "& cats"
sentence.prev.toString(); // "Dogs "
```

Split `element` in two.

- `split(position)`: A new node, `prependee` (a new instance of `element`s constructor), is inserted before `element` in `parent`. `prependee` receives the children from 0 to `position` (not including). `element` receives the children from `position` (including);
- `split()`: A new node, `prependee` (a new instance of `element`s constructor), is inserted before `element` in `parent`.

#### TextOM.Text(value?) [[NLCST:Text](https://github.com/wooorm/nlcst#text)]

Constructor ([Child](#textomchild)).

##### TextOM\.Text#nodeName

Identifier for [Text](#textomtextnlcsttext)s.

##### TextOM\.Text#toString()

```js
dogsText.toString(); // "Dogs"
space1Text.toString(); // " "
fullStopText.toString(); // "."
```

Get `text`s value.

##### TextOM\.Text#valueOf()

```js
dogsText.valueOf();
/**
 * {
 *   "type": "TextNode",
 *   "value": "Dogs"
 * }
 */
```

Get `text`s [NLCST](https://github.com/wooorm/nlcst) representation.

##### TextOM\.Text#fromString(value?)

```js
root.toString(); // "Dogs & cats."
catsText.fromString();
root.toString(); // "Dogs & ."
catsText.fromString("Lions");
root.toString(); // "Dogs & Lions."
```

- `fromString(value)`: Set `text`s value to `value`;
- `fromString()`: Remove `text`s value.

##### TextOM\.Text#split(position?)

```js
catsText.prev; // null
catsText.toString(); // "cats"
catsText.split(2);
catsText.toString(); // "ts"
catsText.prev.toString(); // "ca"
```

Split `text` in two.

- `split(position)`: A new node, `prependee` (a new instance of `text`s constructor), is inserted before `text` in `parent`. `prependee` receives the value from 0 to `position` (not including). `text` receives the value from `position` (including);
- `split()`: A new node, `prependee` (a new instance of `text`s constructor), is inserted before `text` in `parent`.

#### TextOM.RootNode() [[NLCST:RootNode](https://github.com/wooorm/nlcst#rootnode)]

Constructor ([Parent](#textomparentnlcstparent)).

##### TextOM\.RootNode#type

Identifier for [RootNode](#textomrootnodenlcstrootnode)s.

#### TextOM.ParagraphNode() [[NLCST:ParagraphNode](https://github.com/wooorm/nlcst#paragraphnode)]

Constructor ([Element](#textomelement)).

##### TextOM\.ParagraphNode#type

Identifier for [ParagraphNode](#textomparagraphnodenlcstparagraphnode)s.

#### TextOM.SentenceNode() [[NLCST:SentenceNode](https://github.com/wooorm/nlcst#sentencenode)]

Constructor ([Element](#textomelement)).

##### TextOM\.SentenceNode#type

Identifier for [SentenceNode](#textomsentencenodenlcstsentencenode)s.

#### TextOM.WordNode() [[NLCST:SentenceNode](https://github.com/wooorm/nlcst#wordnode)]

Constructor ([Element](#textomelement)).

##### TextOM\.WordNode#type

Identifier for [WordNode](#textomwordnodenlcstwordnode)s.

#### TextOM.PunctuationNode() [[NLCST:PunctuationNode](https://github.com/wooorm/nlcst#punctuationnode)]

Constructor ([Element](#textomelement)).

##### TextOM\.PunctuationNode#type

Identifier for [PunctuationNode](#textompunctuationnodenlcstpunctuationnode)s.

#### TextOM.WhiteSpaceNode() [[NLCST:WhiteSpaceNode](https://github.com/wooorm/nlcst#whitespacenode)]

Constructor ([PunctuationNode](#textompunctuationnodenlcstpunctuationnode)).

##### TextOM\.WhiteSpaceNode#type

Identifier for [WhiteSpaceNode](#textomwhitespacenodenlcstwhitespacenode)s.

#### TextOM.SourceNode() [[NLCST:SourceNode](https://github.com/wooorm/nlcst#sourcenode)]

Constructor ([Text](#textomtextnlcsttext)).

##### TextOM\.SourceNode#type

Identifier for [SourceNode](#textomsourcenodenlcstsourcenode)s.

#### TextOM.TextNode() [[NLCST:TextNode](https://github.com/wooorm/nlcst#textnode)]

Constructor ([Text](#textomtextnlcsttext)).

##### TextOM\.TextNode#type

Identifier for [TextNode](#textomtextnodenlcsttextnode)s.

### IDL

The below IDL-like document gives a short view of the defined interfaces by **TextOM**.

```idl
module textom
{
  [Constructor]
  interface Node {
    const string nodeName = "Node"

    const string NODE = "Node"
    const string PARENT = "Parent"
    const string ELEMENT = "Element"
    const string CHILD = "Child"
    const string TEXT = "Text"

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
    readonly attribute string nodeName = "Parent";

    getter Child? item(unsigned long index);
    readonly attribute unsigned long length;

    readonly attribute Child? head;
    readonly attribute Child? tail;

    Child prepend(Child child);
    Child append(Child child);

    [NewObject] Object valueOf();

    string toString();
  };
  Parent implements Node;

  [Constructor]
  interface Child {
    readonly attribute nodeName = "Child"

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
    readonly attribute nodeName = "Element"

    [NewObject] Element split(unsigned long position);
  };
  Element implements Child;
  Element implements Parent;

  [Constructor(optional String value = "")]
  interface Text {
    readonly attribute nodeName = "Text"

    [NewObject] Object valueOf();

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
  WordNode implements Element;

  [Constructor]
  interface PunctuationNode {
    readonly attribute string type = "PunctuationNode";
  };
  PunctuationNode implements Element;

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

**TextOM** provides events which can be subscribed to, to get notified when something changes.

Event can be subscribed to through `on()` methods, and unsubscribed to through `off()` methods. These methods exist on every instance and on every constructor. 

When subscribing to an instance's events, `listener` is invoked for changes to that specific instance. When subscribing to a constructor's events, `listener` is invoked for changes to any of constructor's instances.

### List of events

#### remove [[non-bubbling](#nonbubblingnormalevents)]

```js
dogs.on('remove', function (previous) {
  this === dogs; // true
  previous === sentence; // true
});

dogs.remove();
```

Fires when a [`Child`](#textomchild) is removed from `previousParent`.

- this: Removed [`Child`](#textomchild);
- parameters:
  - previous: Removed from [`Parent`](#textomparentnlcstparent).

#### insert [[non-bubbling](#nonbubblingnormalevents)]

```js
dogs.on('insert', function () {
  this === dogs; // true
});

sentence.append(dogs);
```

Fires when a [`Child`](#textomchild) is inserted into a [`Parent`](#textomparentnlcstparent).

- this: Inserted [`Child`](#textomchild).

#### changetext [[non-bubbling](#nonbubblingnormalevents)]

```js
dogsText.on('changetext', function (current, previous) {
  this === dogsText; // true
  current === 'Poodles'; // true
  previous === 'Dogs'; // true
});

dogsText.fromString('Poodles');
```

Fires when a [`Text`](#textomtextnlcsttext) changes value.

- this: Changed [`Text`](#textomtextnlcsttext);
- parameters:
  - current: Current value;
  - previous: Previous value;

#### changeprev [[non-bubbling](#nonbubblingnormalevents)]

```js
cats.on('changeprev', function (current, previous) {
  this === cats; // true
  current === ampersand; // true
  previousNode === space1; // true
});

space1.remove();
```

Fires when a preceding sibling ([`Child`](#textomtextnlcsttext)) changes.

- this: [`Child`](#textomchild) following the changed sibling;
- parameters:
  - current: Current previous [`Child`](#textomchild) or `null`;
  - previous: Previous previous [`Child`](#textomchild) or `null`;

#### changenext [[non-bubbling](#nonbubblingnormalevents)]

```js
cats.on('changenext', function (current, previous) {
  this === cats; // true
  node === null; // true
  previousNode === fullStop; // true
});

fullStop.remove();
```

Fires when a following sibling ([`Child`](#textomtextnlcsttext)) changes.

- this: [`Child`](#textomchild) preceding the changed sibling;
- parameters:
  - current: Current next [`Child`](#textomchild) or `null`;
  - previous: Previous next [`Child`](#textomchild) or `null`;

#### changetextinside  [[bubbling](#bubblingevents)]

```js
root.on('changetextinside', function (node, current, previous) {
  this === root; // true
  node === catsText; // true
  current === 'lions'; // true
  previous === 'cats'; // true
});

catsText.fromString('lions');
```

Fires when a [`Text`](#textomtextnlcsttext) inside an ancestor.

- this: Ancestor of a [`Text`](#textomtextnlcsttext);
- parameters:
  - node: Changed [`Text`](#textomtextnlcsttext);
  - current: Current value;
  - previous: Previous value;

#### insertinside  [[bubbling](#bubblingevents)]

```js
sentence.on('insertinside', function (node) {
  this === sentence; // true
  node === ampersand; // true
});

sentence.append(ampersand);
```

Fires when a [`Child`](#textomchild) is inserted inside an ancestor.

- this: Ancestor of a [`Child`](#textomchild);
- parameters:
  - node: Inserted [`Child`](#textomchild);

#### removeinside  [[bubbling](#bubblingevents)]

```js
root.on('removeinside', function (node, previous) {
  this === root; // true
  previous === sentence; // true;
  node === dogs; // true
});

dogs.remove();
```

Fires when a [`Child`](#textomchild) is removed inside an ancestor.

- this: Ancestor of a [`Child`](#textomchild);
- parameters:
  - node: Removed [`Child`](#textomchild);
  - previous: Removed from [`Parent`](#textomparent);

### Bubbling & Non-bubbling events

**TextOM** provides two types of events: Bubbling and non-bubbling. In API terms, bubbling event names end with `"inside"`.

### Non-bubbling (“normal”) events

Normal events fire on instances of [Child](#textomchild) and do not fire on ancestors. They additionally fire on all constructors of the instance.

Let’s say we have the example code [given in API](#api), and add the following line to it:

```js
dogsText.fromString('Poodles');
```

A `"changetext"` event fires on `dogsText`. Because `dogsText` is a [`TextNode`](#textomtextnodenlcsttextnode), the event fires on `TextNode` too. Because `TextNode` inherits from [`Text`](#textomtextnlcsttext), the event also fires on `Text`, continuing with [`Child`](#textomchild), and finally [`Node`](#textomnodenlcstnode).

### Bubbling events

Bubbling events start on a [`Parent`](#textomparentnlcstparent) and continue through its ancestors. These events also fire on the ancestors constructor.

Let’s say we have the example code [given in API](#api), and add the following line to it:

```js
dogsText.fromString('Wolves');
```

A `"changetextinside"` event fires on `dogsText` parent, `dogs`, and because `dogs` is a [`WordNode`](#textomwordnodenlcstwordnode), the event fires on `WordNode` too, continuing with `sentence` and [`SentenceNode`](#textomsentencenodenlcstsentencenode), `paragraph` and [`ParagraphNode`](#textomparagraphnodenlcstparagraphnode), and finally `root` and [`RootNode`](#textomrootnodenlcstrootnode).

## Related

- [parse-dutch](https://github.com/wooorm/parse-dutch "Parse Dutch")
- [parse-latin](https://github.com/wooorm/parse-latin "Parse Latin")
- [parse-english](https://github.com/wooorm/parse-english "Parse English")
- [retext](https://github.com/wooorm/retext "Retext")

## License

MIT © Titus Wormer

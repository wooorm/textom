# TextOM [![Build Status](https://travis-ci.org/wooorm/textom.png)](https://travis-ci.org/wooorm/textom)

**TextOM** provides an object model for natural language in JavaScript. No dependencies. NodeJS, and the browser. Lots of tests (200+), including 400+ assertions. 100% coverage.

Note: This project is **not** a parser for natural language, its rather the core that lies underneath such a parser. Its like a simplified and modified version of the DOM, without any parsing capabilities. For parsing capabilities, see [parse-english](https://github.com/wooorm/parse-english "Parse English")—build on top of this module.

## Installation

### With NPM

```sh
$ npm install textom
```

### Git

```sh
git clone https://github.com/wooorm/textom.git
cd textom
npm install
```

## Usage

````js
  var root = new TextOM();
````

## API
See below for an abbreviated IDL definition.

Lets say all the following examples start with this code. Any changes made by below examples are discarded uppong their ending.
```js
// Import TextOM.
var TextOM = require('textom');

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

##### TextOM\.Node#TextOM
```js
root.TextOM === TextOM; // true
```

Every node contains a `TextOM` attribute linking back to the original TextOM.

##### TextOM\.Node#ROOT_NODE
```js
root.type === root.ROOT_NODE === TextOM.ROOT_NODE; // true
```

Unique identifier for all instances of `RootNode`.

##### TextOM\.Node#PARAGRAPH_NODE
```js
paragraph.type === paragraph.PARAGRAPH_NODE === TextOM.PARAGRAPH_NODE; // true
```

Unique identifier for all instances of `ParagraphNode`.

##### TextOM\.Node#SENTENCE_NODE
```js
sentence.type === sentence.SENTENCE_NODE === TextOM.SENTENCE_NODE; // true
```

Unique identifier for all instances of `SentenceNode`.

##### TextOM\.Node#WORD_NODE
```js
dogs.type === dogs.WORD_NODE === TextOM.WORD_NODE; // true
```

Unique identifier for all instances of `WordNode`.

##### TextOM\.Node#PUNCTUATION_NODE
```js
fullStop.type === fullStop.PUNCTUATION_NODE === TextOM.PUNCTUATION_NODE; // true
```

Unique identifier for all instances of `PunctuationNode`.

##### TextOM\.Node#WHITE_SPACE_NODE
```js
space0.type === space0.WHITE_SPACE_NODE === TextOM.WHITE_SPACE_NODE; // true
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

Return the result of calling `toString` on each text node inside `range`, substringing when necessary;


### IDL
The following IDL document gives a short view of the defined interfaces by TextOM. Note: It not might be that valid in the eyes of W3C standardistas, buts its pretty readable for us simple developers :).

```idl
module textom
{
  interface Node {
    const unsigned long ROOT_NODE = 1
    const unsigned long PARAGRAPH_NODE = 2
    const unsigned long SENTENCE_NODE = 3
    const unsigned long WORD_NODE = 4
    const unsigned long PUNCTUATION_NODE = 5
    const unsigned long WHITE_SPACE_NODE = 6
  };

  [ArrayClass]
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

  interface RootNode {
    readonly attribute unsigned long type = 1;
    readonly attribute unsigned long hierarchy = 1;
  };
  RootNode implements Parent;

  interface ParagraphNode {
    readonly attribute unsigned long type = 2;
    readonly attribute unsigned long hierarchy = 2;
  };
  ParagraphNode implements Element;

  interface SentenceNode {
    readonly attribute unsigned long type = 3;
    readonly attribute unsigned long hierarchy = 3;
  };
  SentenceNode implements Element;

  interface WordNode {
    readonly attribute unsigned long type = 4;
    readonly attribute unsigned long hierarchy = 4;
  };
  WordNode implements Text;

  interface WhiteSpaceNode {
    readonly attribute unsigned long type = 5;
  };
  WhiteSpaceNode implements Text;

  interface PunctuationNode {
    readonly attribute unsigned long type = 6;
    readonly attribute unsigned long hierarchy = 4;
  };
  PunctuationNode implements Text;

  interface Range {
    readonly attribute Node? startContainer;
    readonly attribute unsigned long? startOffset;
    readonly attribute Node? endContainer;
    readonly attribute unsigned long? endOffset;
    void setStart(Node node, unsigned long offset);
    void setEnd(Node node, unsigned long offset);
  
    [NewObject] Range cloneRange();
  
    string toString();
  };
}
```

## Related

  * [parse-english](https://github.com/wooorm/parse-english "Parse English")

More to come.

## License

  MIT

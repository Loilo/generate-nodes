# generate-nodes
> JavaScript function to generate an array of DOM Nodes from pretty much anything

## Motivation
I found myself in the need of mixing up pieces of existing DOM with plain HTML markup. This function is the result of trying to make that task as pleasant as possible. It allows to create DOM structures with as little visual noise as possible. You can do things like this:

```javascript
var worldImage = document.createTextNode('World')
worldImag.src = 'World.svg'

generateNodes([
  '<p>Function demo:</p>',
  {
    '<div>': [
      'Hello ',
      worldImage
      '!'
    ]
  }
])
```

That would generate an array with two entries (consider this pseudo code since there's no proper short representation of DOM nodes in JavaScript):

```
[
  HTMLParagraphElement "Function demo:",
  HTMLDivElement "Hello ", HTMLImageElement[src="World.svg"], "!"
]
```

## Install

Run

```console
$ npm install --save generate-nodes
```

or

```console
$ yarn add generate-nodes
```

## Run

### Browser
This function is designed to run in the browser. It will define a global `generateNodes()` function that will work as explained in the *Usage* section.
```html
<script src="node_modules/generate-nodes/dist/generate-nodes.min.js"></script>
```

### Node.js
However with DOM "emulators" like [jsdom](https://github.com/tmpvar/jsdom) you might as well use it in Node.js:

```javascript
var window = require('jsdom').jsdom().defaultView
var generateNodes = require('generate-nodes').withWindow(window)

generateNodes( '<p>Hello Node.js!</p>' )
```

Note that using the `withWindow()` method just creates a bound version of the `generateNodes()` function. If you prefer you might as well pass the `window` object directly to it as second parameter:

```javascript
var window = require('jsdom').jsdom().defaultView
var generateNodes = require('generate-nodes')

generateNodes( '<p>Hello Node.js!</p>', window )
```

## Usage
The `generateNode()` function takes several possible types of input and returns an array of `Node` objects.

This array also gets a `.appendTo(element)` method monkey-patched onto it so the resulting nodes can easily be attached to an existing DOM node.

### Arrays
You can provide an array of literally anything listed here to nest your content as needed.
```javascript
generateNodes([ 'Hello', 'World!' ])
```

Please note that the following is *not* possible since each HTML string must be a self-contained piece of markup.
```javascript
// DON'T do this
generateNodes([ '<p>Hello', 'World!</p>' ])
```

### HTML strings
Just a plain HTML string. You saw it in the motivational example above.
```javascript
generateNodes([ 'Hello', 'World!' ])
```

### DOM Node objects
An existing DOM `Node` object (and thus all its derivates like `HTMLElement` or `Text`).

### Plain objects
A plain object allows you to create parent-child relationships.

* The property values might be anything that can be passed to the `generateNodes()` function.
* The property keys can be either the a node name or an HTML string.

The generated DOM Nodes of the values are placed inside of the generated Node of their associated keys.

```javascript
// A node name as key
generateNodes({
  p: 'Hello World!'
})
// This equals running generateNodes('<p>Hello World!</p>')

// HTML Markup as key
generateNodes({
  '<div class="greetings">': 'Hello World!'
})
```

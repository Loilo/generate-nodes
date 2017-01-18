// Create a browser environment
require('jsdom-global')()

const generateNodes = require('../dist/generate-nodes')
const assertEqual = require('./assert-equal-nodes')

// Create some preset Nodes to test against
const { div_foo, p_bar, text_blank } = require('./preset-nodes')

// Empty
assertEqual(generateNodes(''), [])
assertEqual(generateNodes(['', '', '']), [])

// Mappings
// NaiveMapping
assertEqual(generateNodes({
  div: 'foo',
  p: 'bar'
}), [ div_foo, p_bar ])

// OrderSafeMapping
assertEqual(
  generateNodes(new Map([
    ['div', 'foo'],
    ['p', 'bar']
  ])),
  [ div_foo, p_bar ]
)

// HTML strings
assertEqual(
  generateNodes(' '),
  [ text_blank ]
)
assertEqual(
  generateNodes('<p>bar</p> '),
  [ p_bar, text_blank ]
)

// Node
assertEqual(
  generateNodes(document.createElement('div')),
  [ document.createElement('div') ]
)

// Nested array of all
assertEqual(
  generateNodes([
    '<p>bar</p> <div>foo</div>',
    [
      {
        div: 'foo'
      },
      {
        p: 'bar'
      },
      '<p>bar</p>'
    ],
    '',
    document.createTextNode(' ')
  ]),
  [ p_bar, text_blank, div_foo, div_foo, p_bar, p_bar, text_blank ]
)

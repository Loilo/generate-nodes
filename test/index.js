// Create a browser environment
const window = require('jsdom').jsdom().defaultView

const generateNodes = require('../dist/generate-nodes').withWindow(window)
const assertEqual = require('./assert-equal-nodes')(window)

// Create some preset Nodes to test against
const { div_foo, p_bar, text_blank } = require('./preset-nodes')(window)


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
  generateNodes(window.document.createElement('div')),
  [ window.document.createElement('div') ]
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
    window.document.createTextNode(' ')
  ]),
  [ p_bar, text_blank, div_foo, div_foo, p_bar, p_bar, text_blank ]
)

console.log('\x1b[32m', 'All tests have been passed.' ,'\x1b[0m')

const assert = require('assert')

// Assert two lists of Nodes are equal
module.exports = (tested, reference) => {
  // tested list is actually an array
  assert(Array.isArray(tested), 'Not an array')

  // tested list has correct number of items
  assert(tested.length === reference.length, `Array has ${tested.length} item${tested.length === 1 ? '' : 's'}, expected ${reference.length}`)

  // tested list contains exclusively Nodes
  assert(tested.every(item => item instanceof Node), `Array does not include exclusively Node objects`)

  // all items from tested vs reference are equal Nodes
  reference.forEach((referenceNode, index) => {
    assert(referenceNode.isEqualNode(tested[index]), `Node #${index} differs from reference node`)
  })
}

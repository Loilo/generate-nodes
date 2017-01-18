const div_foo = (() => {
  const el = document.createElement('div')
  el.appendChild(document.createTextNode('foo'))
  return el
})()

const p_bar = (() => {
  const el = document.createElement('p')
  el.appendChild(document.createTextNode('bar'))
  return el
})()

const text_blank = document.createTextNode(' ')

module.exports = { div_foo, p_bar, text_blank }

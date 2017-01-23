module.exports = window => ({
  div_foo: (() => {
    const el = window.document.createElement('div')
    el.appendChild(window.document.createTextNode('foo'))
    return el
  })(),

  p_bar: (() => {
    const el = window.document.createElement('p')
    el.appendChild(window.document.createTextNode('bar'))
    return el
  })(),

  text_blank: window.document.createTextNode(' ')
})

/*
 * We need to add those, sadly somehow providing the "lib" flag
 * in tsconfig.json doesn't work.
 */
interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    set(key: K, value: V): Map<K, V>;
    keys(): K[];
    size: number;
}
declare var Map: {
    new <K, V>(): Map<K, V>;
    prototype: Map<any, any>;
}

/*------------------------
 * CONVERTIBLE
 *------------------------
 *
 * This is the most general structure to be converted into a Node array.
 * Further elaboration of what they do consist follows below.
 * 
 */
type Convertable = Input | Input[]


/*------------------------
 * MAPPINGS
 *------------------------
 *
 * Mappings describe key-value structures that take node name strings
 * (e.g. "div") as keys a Convertables as values.
 * 
 * That means a structure like this:
 * { p: "Hello <em>World</em>!" }
 * will be turned into the DOM representation of
 * "<p>Hello <em>World</em>!</p>"
 * 
 * A Mapping might be a real ES2015 Map object (OrderSafeMapping) or just a
 * plain JavaScript object (NaiveMapping).
 * 
 * I call those "NaiveMapping" to make it clear that while it's desired for
 * this use case to preserve key order plain objects usually do this but
 * they are not guaranteed to.
 * 
 */

type Mapping = NaiveMapping | OrderSafeMapping

interface OrderSafeMapping extends Map<string, Convertable> {}

interface NaiveMapping {
  [s: string]: Convertable
}

/**
 * Check if an input is a naive mapping (= plain object)
 * @param input  The value to be checked
 * @returns      True if the input variable is a plain object
 */
const isNaiveMapping = (input: any): input is NaiveMapping => input.constructor === Object


/*------------------------
 * INPUT
 *------------------------
 *
 * An Input represents an HTML string, a Node object, a Mapping or
 * a (mixed) array of any of those.
 * 
 */

type Input = SingleInput | SingleInput[]

type SingleInput = string | Node | Mapping


/*------------------------
 * CONVERTERS
 *------------------------
 *
 * Converters for the stated types are below.
 * 
 */

/**
 * Turn an HTML string into a list of Nodes
 * @param input  The HTML string
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
const stringToNodes = (input: string, window: Window): Node[] => {
  // Basically put the HTML into a temporary DOM node and read its children
  const div = window.document.createElement('div')
  div.innerHTML = input
  return Array.prototype.slice.call(div.childNodes)
}

/**
 * Turn a Mapping into a list of Nodes
 * @param input  The Mapping to be converted
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
const mappingToNodes = (input: Mapping, window: Window): Node[] => {
  const keys = isNaiveMapping(input)
    // Get the keys of a naive map
    ? Object.keys(input)

    // If the input is an ES2015 Map it's fair to assume
    // that Array.from() is available
    : Array.from(input.keys())

  return keys.reduce<Node[]>((carry, nodeName: string) => {
    let modNode = nodeName
    if (nodeName.match(/^[a-zA-Z-]+$/)) {
      modNode = '<' + nodeName + '>'
    }

    const container = stringToNodes(modNode, window).pop()

    for (const node of generateNodes(isNaiveMapping(input) ? input[nodeName] : input.get(nodeName), window)) {
      container.appendChild(node)
    }
    
    return carry.concat(container)
  }, [])
}

/**
 * Turn an Input into a list of Nodes
 * @param input  The Input to be converted
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
const inputToNodes = (input: Input, window: Window): Node[] => {
  if (input instanceof Array) return arrayToNodes(input, window)
  else if (input instanceof window['Node']) return [ <Node>input ]
  else if (typeof input === 'string') return stringToNodes(input, window)
  else return mappingToNodes(<Mapping>input, window)
}

/**
 * Turn an array of Inputs into a list of Nodes
 * @param input  The array of Inputs to be converted
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
const arrayToNodes = (input: Input[], window: Window): Node[] => {
  return input.reduce<Node[]>((carry, current) => (
    carry.concat(inputToNodes(current, window))
  ), [])
}

/**
 * Generate a list of Nodes from an according input
 * @param input  The stuff to convert
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
const originalWindow = typeof window === 'object' ? window : null
const generateNodes = (input: Convertable, window?: Window): Node[] => {
  const usedWindow = window || originalWindow
  if (usedWindow == null) throw new Error('No `window` object provided')

  if (input == null) return []
  else if (input instanceof Array) return arrayToNodes(input, usedWindow)
  else return arrayToNodes([ input ], usedWindow)
}

/**
 * Creates a version of the `generateNodes` function bound to a certain window object
 */
generateNodes['withWindow'] = (window: Window) => {
  return (input: Convertable) => generateNodes(input, window)
}

export = generateNodes

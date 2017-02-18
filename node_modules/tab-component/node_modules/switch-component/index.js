var classes = require('classes')
var computedStyle = require('computed-style')
var isArray = Array.isArray
if (!isArray) throw new Error('isArray is not supported need polyfill')

/**
 * Switch element `style`,`className` or `property`
 *
 * @param {Element} first Element
 * @param {Element} second Element
 * @param {Object} opt options object
 * @api public
 */
module.exports = function (first, second, opt) {
  for (var k in opt) {
    var prop = opt[k]
    switch (k) {
      case 'style':
        switchStyle(first, second, prop)
        break;
      case 'className':
        switchClasses(first, second, prop)
        break;
      case 'property':
        switchProperty(first, second, prop)
        break;
      default:
        throw new Error('unknown option property [' + k + ']')
    }
  }
}

function each(arr, first, second, fn) {
  arr.forEach(function (v) {
    fn(first, second, v)
  })
}

function switchStyle(first, second, prop) {
  if (isArray(prop)) {
    return each(prop, first, second, switchStyle)
  }
  var tmp = computedStyle(second, prop)
  second.style[prop] = computedStyle(first, prop)
  first.style[prop] = tmp
}

function switchClasses(first, second, name) {
  if (isArray(name)) {
    return each(name, first, second, switchClasses)
  }
  if (classes(first).has(name)) {
    classes(first).remove(name)
    classes(second).add(name)
  } else {
    classes(second).remove(name)
    classes(first).add(name)
  }
}

function switchProperty(first, second, prop) {
  if (isArray(prop)) {
    return each(prop, first, second, switchProperty)
  }
  var tmp = second[prop]
  second[prop] = first[prop]
  first[prop] = tmp
}

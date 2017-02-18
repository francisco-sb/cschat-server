/*global describe,it*/

if (window._phantom) {
  // Patch since PhantomJS does not implement click() on HTMLElement. In some 
  // cases we need to execute the native click on an element
  if (!HTMLElement.prototype.click) {
    HTMLElement.prototype.click = function() {
      var ev = document.createEvent('MouseEvent')
      ev.initMouseEvent(
          'click',
          /*bubble*/true, /*cancelable*/true,
          window, null,
          0, 0, 0, 0, /*coordinates*/
          false, false, false, false, /*modifier keys*/
          0/*button=left*/, null
      )
      this.dispatchEvent(ev)
    }
  }
}

var Tabs = require('..')
var parentNode
var assert = require('assert')
var domify = require('domify')

beforeEach(function() {
  parentNode = document.createElement('div')
  var header = document.createElement('ul')
  header.className = 'tabs-header'
  parentNode.appendChild(header)
  var body = document.createElement('div')
  body.className = 'tabs-body'
  parentNode.appendChild(body)
  document.body.appendChild(parentNode)
})

afterEach(function() {
  document.body.removeChild(parentNode)
})

describe('Tabs', function() {
  describe('Tabs()', function() {
    it('should initial the tab', function() {
      var tabs = new Tabs(parentNode)
      var nodes = parentNode.childNodes
      assert(nodes[0].classList.contains('tabs-header'))
      assert(nodes[1].classList.contains('tabs-body'))
      tabs.unbind()
    })
  })

  describe('#add()', function() {
    it('should create a new tab', function() {
      var tabs = new Tabs(parentNode)
      tabs.add('<li>tab</li>', '<div>content</div>')
      var tab = tabs.header.childNodes[0]
      var body = tabs.body.childNodes[0]
      assert(tab !== null)
      assert(body !== null)
      tabs.unbind()
    })
  })

  describe('#active()', function() {
    it('should active a tab by element', function() {
      var tabs = new Tabs(parentNode)
      var body = domify('<div>content</div>')
      var obody = domify('<div>content of other tab</div>')
      tabs.add('<li>tab</li>', body)
      tabs.add('<li>other tab</li>', obody)
      var tab = tabs.header.childNodes[0]
      tabs.active(tab)
      assert(tab.classList.contains('active'))
      assert(obody.classList.contains('hide'))
      tabs.unbind()
    })

    it('should active a tab by query selector', function() {
      var tabs = new Tabs(parentNode)
      var body = domify('<div>content</div>')
      var obody = domify('<div>content of other tab</div>')
      tabs.add('<li>one tab</li>', body)
      tabs.add('<li>other tab</li>', obody)
      var tab = tabs.header.childNodes[0]
      tabs.active(':first-child')
      assert(tab.classList.contains('active'))
      assert(obody.classList.contains('hide'))
      tabs.unbind()
    })
  })

  describe('close', function() {
    it('should be closable', function() {
      var tabs = new Tabs(parentNode)
      tabs.closable()
      tabs.add('<li>tab</li>', '<div>body</div>')
      var called
      tabs.on('empty', function() {
        called = true
      })
      var a = tabs.header.querySelector('.close')
      window.a = a
      a.click()
      assert(called === true)
      assert(tabs.header.childNodes.length === 0)
      assert(tabs.body.childNodes.length === 0)
      tabs.unbind()
    })
  })

})


/*!
 *
 * tabs
 *
 * MIT licence
 *
 */

var Emitter = require('emitter')
var domify = require('domify')
var events = require('events')
var classes = require('classes')
var Sortable = require('sweet-sortable')
var traverse = require('traverse')
var matches = require('matches-selector')
var sw = require('switch')

/**
 * Exports.
 */

module.exports = Tabs

/**
 * Construct Tabs with parentNode and optional options
 *
 * opts.headerSelector children selector for header default `li`
 * opts.bodySelector children selector for body default `div`
 *
 * @param {Element} parent
 * @params {opts} optional options
 * @api public
 */
function Tabs (parentNode, opts) {
  if(! this instanceof Tabs) return new Tabs(parentNode, opts)
  opts = opts || {}
  opts.headerSelector = opts.headerSelector || 'li'
  opts.bodySelector = opts.bodySelector || 'div'
  this.opts = opts
  this.header = parentNode.querySelector('.tabs-header')
  this.body = parentNode.querySelector('.tabs-body')
  if (!this.header) throw new Error('expect header element with class tabs-header')
  if (!this.body) throw new Error('expect body element with class tabs-body')
  var hs = opts.headerSelector
  var titles = children(this.header, hs)
  var contents = children(this.body, opts.bodySelector)
  if (titles.length !== contents.length) throw new Error('titles length and contents length not the same')
  for (var i = 0, len = titles.length; i < len; i++) {
    var item = titles[i]
    item.__target = contents[i]
    classes(contents[i]).add('hide')
  }
  this.events = events(this.header, this)
  this.events.bind('click .close', 'close')
  this.events.bind('click ' + hs, 'click')
  if (titles.length) this.active(titles[0])
}

Emitter(Tabs.prototype)

/**
 * Destroy all the tabs
 * @api public
 */
Tabs.prototype.unbind = function() {
  this.events.unbind()
  if (this._sortable) this._sortable.unbind()
}

/**
 * Make tabs closable
 *
 * @api public
 */
Tabs.prototype.closable = function() {
  this._closable = true
  var hs = this.opts.headerSelector
  var titles = children(this.header, hs)
  for (var i = 0, l = titles.length; i < l; i++) {
    var close = domify('<a href="#" class="close">×</a>')
    titles[i].appendChild(close)
  }
}

/**
 * Make tabs sortable, pass true if you need vertical sortable
 *
 * @public
 * @param {Boolean} vertical
 * @return {self}
 */
Tabs.prototype.sortable = function(vertical) {
  var hs = this.opts.headerSelector
  var sortable = this._sortable = Sortable(this.header)
  sortable.bind(hs)
  if (!vertical) {
    sortable.horizon()
  }
  sortable.on('update', function() {
    var titles = children(this.header, hs)
    this.emit('sort', titles)
  }.bind(this))
  return this
}

/**
 * Add tab with `title` element(string) and content element(string)
 *
 * @param {Element | String} title
 * @param {Element | String} node
 * @api public
 */
Tabs.prototype.add = function(title, content) {
  if (typeof title === 'string') title = domify(title)
  if (typeof content === 'string') content = domify(content)
  classes(content).add('hide')
  if (this._closable) {
    var close = domify('<a href="#" class="close">×</a>')
    title.appendChild(close)
  }
  title.__target = content
  this.header.appendChild(title)
  this.body.appendChild(content)
}

/**
 * Active a tab by selector or tab element
 * @param {String|Element} el
 * @api public
 */
Tabs.prototype.active = function(el) {
  if (typeof el === 'string') {
    el = this.header.querySelector(el)
  }
  var target = el.__target
  if (!el || !target || el === this._active) return
  if (!this._active) {
    classes(el).add('active')
    classes(target).remove('hide')
  } else {
    sw(el, this._active, {
      className: 'active'
    })
    sw(target, this._active.__target, {
      className: 'hide'
    })
  }
  this._active = el
  this.emit('active', el)
}

/**
 * click handler
 *
 * @private
 * @param  {Event}  e
 */
Tabs.prototype.click = function (e) {
  var el = e.delegateTarget
  if (withIn(e.target, '.close', this.header)) return
  e.stopPropagation()
  this.active(el)
}

/**
 * Remove title and coresspond content by close click
 *
 * @private
 * @param  {Event}  e
 */
Tabs.prototype.close = function (e) {
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
  var el = e.delegateTarget.parentNode
  var hs = this.opts.headerSelector
  var bs = this.opts.bodySelector
  var prev = traverse('previousSibling', el, hs, 1)[0]
  var next = traverse('nextSibling', el, hs, 1)[0]
  var target = el.__target
  target.parentNode.removeChild(target)
  el.parentNode.removeChild(el)
  this.emit('remove', el, target)
  var contents = children(this.body, bs)
  if (contents.length === 0) return this.emit('empty')
  if (this._active !== el) return
  if (next) {
    this.active(next)
  }
  else if (prev) {
    this.active(prev)
  }
}

/**
 * withIn
 *
 * @param {Element} el
 * @param {String} selector
 * @param {Element} root
 * @return {undefined}
 */
function withIn(el, selector, root) {
  do {
    if (matches(el, selector)) return true
    if (el === root) return false
    el = el.parentNode
  } while(el)
}

function children(el, selector) {
  var res = []
  var children = el.children
  for (var i = 0, l = children.length; i < l; i++) {
    var node = children[i]
    if (node.nodeType !== 1) continue
    if (matches(node, selector)) res.push(node)
  }
  return res
}

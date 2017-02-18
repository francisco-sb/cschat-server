/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Tabs = __webpack_require__(1);

	var p = document.getElementById('tabs');
	var tabs = new Tabs(p, {
	  headerSelector: '.title'
	});
	tabs.closable()
	tabs.sortable()
	tabs.on('empty', function() {
	  console.log('empty');
	})
	tabs.on('sort', function(lis) {
	  console.log(lis);
	})
	tabs.on('active', function(el) {
	  console.log('active ' + el.firstChild.textContent)
	})

	tabs.add('<li class="tabs-header title">tab4</li>', '<div><h2>Tab 4</h2></div>')


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 *
	 * tabs
	 *
	 * MIT licence
	 *
	 */

	var Emitter = __webpack_require__(2)
	var domify = __webpack_require__(3)
	var events = __webpack_require__(4)
	var classes = __webpack_require__(10)
	var Sortable = __webpack_require__(12)
	var traverse = __webpack_require__(33)
	var matches = __webpack_require__(35)
	var sw = __webpack_require__(37)

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	
	/**
	 * Expose `parse`.
	 */

	module.exports = parse;

	/**
	 * Tests for browser support.
	 */

	var innerHTMLBug = false;
	var bugTestDiv;
	if (typeof document !== 'undefined') {
	  bugTestDiv = document.createElement('div');
	  // Setup
	  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
	  // Make sure that link elements get serialized correctly by innerHTML
	  // This requires a wrapper element in IE
	  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
	  bugTestDiv = undefined;
	}

	/**
	 * Wrap map from jquery.
	 */

	var map = {
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
	  // for script/link/style tags to work in IE6-8, you have to wrap
	  // in a div with a non-whitespace character in front, ha!
	  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
	};

	map.td =
	map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

	map.option =
	map.optgroup = [1, '<select multiple="multiple">', '</select>'];

	map.thead =
	map.tbody =
	map.colgroup =
	map.caption =
	map.tfoot = [1, '<table>', '</table>'];

	map.polyline =
	map.ellipse =
	map.polygon =
	map.circle =
	map.text =
	map.line =
	map.path =
	map.rect =
	map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

	/**
	 * browser
	 * @api private
	 */

	function parse(html, doc) {
	  if ('string' != typeof html) throw new TypeError('String expected');

	  // default to the global `document` object
	  if (!doc) doc = document;

	  // tag name
	  var m = /<([\w:]+)/.exec(html);
	  if (!m) return doc.createTextNode(html);

	  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

	  var tag = m[1];

	  // body support
	  if (tag == 'body') {
	    var el = doc.createElement('html');
	    el.innerHTML = html;
	    return el.removeChild(el.lastChild);
	  }

	  // wrap map
	  var wrap = map[tag] || map._default;
	  var depth = wrap[0];
	  var prefix = wrap[1];
	  var suffix = wrap[2];
	  var el = doc.createElement('div');
	  el.innerHTML = prefix + html + suffix;
	  while (depth--) el = el.lastChild;

	  // one element
	  if (el.firstChild == el.lastChild) {
	    return el.removeChild(el.firstChild);
	  }

	  // several elements
	  var fragment = doc.createDocumentFragment();
	  while (el.firstChild) {
	    fragment.appendChild(el.removeChild(el.firstChild));
	  }

	  return fragment;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var events = __webpack_require__(5);
	var delegate = __webpack_require__(6);

	/**
	 * Expose `Events`.
	 */

	module.exports = Events;

	/**
	 * Initialize an `Events` with the given
	 * `el` object which events will be bound to,
	 * and the `obj` which will receive method calls.
	 *
	 * @param {Object} el
	 * @param {Object} obj
	 * @api public
	 */

	function Events(el, obj) {
	  if (!(this instanceof Events)) return new Events(el, obj);
	  if (!el) throw new Error('element required');
	  if (!obj) throw new Error('object required');
	  this.el = el;
	  this.obj = obj;
	  this._events = {};
	}

	/**
	 * Subscription helper.
	 */

	Events.prototype.sub = function(event, method, cb){
	  this._events[event] = this._events[event] || {};
	  this._events[event][method] = cb;
	};

	/**
	 * Bind to `event` with optional `method` name.
	 * When `method` is undefined it becomes `event`
	 * with the "on" prefix.
	 *
	 * Examples:
	 *
	 *  Direct event handling:
	 *
	 *    events.bind('click') // implies "onclick"
	 *    events.bind('click', 'remove')
	 *    events.bind('click', 'sort', 'asc')
	 *
	 *  Delegated event handling:
	 *
	 *    events.bind('click li > a')
	 *    events.bind('click li > a', 'remove')
	 *    events.bind('click a.sort-ascending', 'sort', 'asc')
	 *    events.bind('click a.sort-descending', 'sort', 'desc')
	 *
	 * @param {String} event
	 * @param {String|function} [method]
	 * @return {Function} callback
	 * @api public
	 */

	Events.prototype.bind = function(event, method){
	  var e = parse(event);
	  var el = this.el;
	  var obj = this.obj;
	  var name = e.name;
	  var method = method || 'on' + name;
	  var args = [].slice.call(arguments, 2);

	  // callback
	  function cb(){
	    var a = [].slice.call(arguments).concat(args);
	    obj[method].apply(obj, a);
	  }

	  // bind
	  if (e.selector) {
	    cb = delegate.bind(el, e.selector, name, cb);
	  } else {
	    events.bind(el, name, cb);
	  }

	  // subscription for unbinding
	  this.sub(name, method, cb);

	  return cb;
	};

	/**
	 * Unbind a single binding, all bindings for `event`,
	 * or all bindings within the manager.
	 *
	 * Examples:
	 *
	 *  Unbind direct handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * Unbind delegate handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * @param {String|Function} [event]
	 * @param {String|Function} [method]
	 * @api public
	 */

	Events.prototype.unbind = function(event, method){
	  if (0 == arguments.length) return this.unbindAll();
	  if (1 == arguments.length) return this.unbindAllOf(event);

	  // no bindings for this event
	  var bindings = this._events[event];
	  if (!bindings) return;

	  // no bindings for this method
	  var cb = bindings[method];
	  if (!cb) return;

	  events.unbind(this.el, event, cb);
	};

	/**
	 * Unbind all events.
	 *
	 * @api private
	 */

	Events.prototype.unbindAll = function(){
	  for (var event in this._events) {
	    this.unbindAllOf(event);
	  }
	};

	/**
	 * Unbind all events for `event`.
	 *
	 * @param {String} event
	 * @api private
	 */

	Events.prototype.unbindAllOf = function(event){
	  var bindings = this._events[event];
	  if (!bindings) return;

	  for (var method in bindings) {
	    this.unbind(event, method);
	  }
	};

	/**
	 * Parse `event`.
	 *
	 * @param {String} event
	 * @return {Object}
	 * @api private
	 */

	function parse(event) {
	  var parts = event.split(/ +/);
	  return {
	    name: parts.shift(),
	    selector: parts.join(' ')
	  }
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';

	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};

	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var closest = __webpack_require__(7)
	  , event = __webpack_require__(5);

	/**
	 * Delegate event `type` to `selector`
	 * and invoke `fn(e)`. A callback function
	 * is returned which may be passed to `.unbind()`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, selector, type, fn, capture){
	  return event.bind(el, type, function(e){
	    var target = e.target || e.srcElement;
	    e.delegateTarget = closest(target, selector, true, el);
	    if (e.delegateTarget) fn.call(el, e);
	  }, capture);
	};

	/**
	 * Unbind event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  event.unbind(el, type, fn, capture);
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */

	var matches = __webpack_require__(8)

	/**
	 * Export `closest`
	 */

	module.exports = closest

	/**
	 * Closest
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {Element} scope (optional)
	 */

	function closest (el, selector, scope) {
	  scope = scope || document.documentElement;

	  // walk up the dom
	  while (el && el !== scope) {
	    if (matches(el, selector)) return el;
	    el = el.parentNode;
	  }

	  // check scope for match
	  return matches(el, selector) ? el : null;
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var query = __webpack_require__(9);

	/**
	 * Element prototype.
	 */

	var proto = Element.prototype;

	/**
	 * Vendor function.
	 */

	var vendor = proto.matches
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;

	/**
	 * Expose `match()`.
	 */

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (!el || el.nodeType !== 1) return false;
	  if (vendor) return vendor.call(el, selector);
	  var nodes = query.all(selector, el.parentNode);
	  for (var i = 0; i < nodes.length; ++i) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	function one(selector, el) {
	  return el.querySelector(selector);
	}

	exports = module.exports = function(selector, el){
	  el = el || document;
	  return one(selector, el);
	};

	exports.all = function(selector, el){
	  el = el || document;
	  return el.querySelectorAll(selector);
	};

	exports.engine = function(obj){
	  if (!obj.one) throw new Error('.one callback required');
	  if (!obj.all) throw new Error('.all callback required');
	  one = obj.one;
	  exports.all = obj.all;
	  return exports;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var index = __webpack_require__(11);

	/**
	 * Whitespace regexp.
	 */

	var re = /\s+/;

	/**
	 * toString reference.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Wrap `el` in a `ClassList`.
	 *
	 * @param {Element} el
	 * @return {ClassList}
	 * @api public
	 */

	module.exports = function(el){
	  return new ClassList(el);
	};

	/**
	 * Initialize a new ClassList for `el`.
	 *
	 * @param {Element} el
	 * @api private
	 */

	function ClassList(el) {
	  if (!el || !el.nodeType) {
	    throw new Error('A DOM element reference is required');
	  }
	  this.el = el;
	  this.list = el.classList;
	}

	/**
	 * Add class `name` if not already present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.add = function(name){
	  // classList
	  if (this.list) {
	    this.list.add(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (!~i) arr.push(name);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove class `name` when present, or
	 * pass a regular expression to remove
	 * any which match.
	 *
	 * @param {String|RegExp} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.remove = function(name){
	  if ('[object RegExp]' == toString.call(name)) {
	    return this.removeMatching(name);
	  }

	  // classList
	  if (this.list) {
	    this.list.remove(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (~i) arr.splice(i, 1);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove all classes matching `re`.
	 *
	 * @param {RegExp} re
	 * @return {ClassList}
	 * @api private
	 */

	ClassList.prototype.removeMatching = function(re){
	  var arr = this.array();
	  for (var i = 0; i < arr.length; i++) {
	    if (re.test(arr[i])) {
	      this.remove(arr[i]);
	    }
	  }
	  return this;
	};

	/**
	 * Toggle class `name`, can force state via `force`.
	 *
	 * For browsers that support classList, but do not support `force` yet,
	 * the mistake will be detected and corrected.
	 *
	 * @param {String} name
	 * @param {Boolean} force
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.toggle = function(name, force){
	  // classList
	  if (this.list) {
	    if ("undefined" !== typeof force) {
	      if (force !== this.list.toggle(name, force)) {
	        this.list.toggle(name); // toggle again to correct
	      }
	    } else {
	      this.list.toggle(name);
	    }
	    return this;
	  }

	  // fallback
	  if ("undefined" !== typeof force) {
	    if (!force) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  } else {
	    if (this.has(name)) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  }

	  return this;
	};

	/**
	 * Return an array of classes.
	 *
	 * @return {Array}
	 * @api public
	 */

	ClassList.prototype.array = function(){
	  var className = this.el.getAttribute('class') || '';
	  var str = className.replace(/^\s+|\s+$/g, '');
	  var arr = str.split(re);
	  if ('' === arr[0]) arr.shift();
	  return arr;
	};

	/**
	 * Check if class `name` is present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.has =
	ClassList.prototype.contains = function(name){
	  return this.list
	    ? this.list.contains(name)
	    : !! ~index(this.array(), name);
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function(arr, obj){
	  if (arr.indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dependencies
	 */

	var emitter = __webpack_require__(13)
	var classes = __webpack_require__(14)
	var events = __webpack_require__(16)
	var closest = __webpack_require__(19)
	var event = __webpack_require__(17)
	var throttle = __webpack_require__(22)
	var transform = __webpack_require__(24)
	var util = __webpack_require__(25)
	var Animate = __webpack_require__(30)
	var transition = __webpack_require__(28)
	var transitionend = __webpack_require__(31)

	var hasTouch = 'ontouchend' in window

	/**
	 * export `Sortable`
	 */

	module.exports = Sortable

	/**
	 * Initialize `Sortable` with `el`.
	 *
	 * @param {Element} el
	 */

	function Sortable(el, opts){
	  if (!(this instanceof Sortable)) return new Sortable(el, opts)
	  if (!el) throw new TypeError('sortable(): expects an element')
	  opts = opts || {}
	  this.delta = opts.delta == null ? 15 : opts.delta
	  this.el = el
	  util.touchAction(el, 'none')
	  this.pel = util.getRelativeElement(el)
	  this.dragging = false

	  var h
	  this.on('start', function () {
	    h = el.style.height
	    var ch = el.getBoundingClientRect().height || el.clientHeight
	    el.style.height = ch + 'px'
	  })
	  this.on('end', function () {
	    el.style.height = h
	  })
	}

	/**
	 * Mixins.
	 */

	emitter(Sortable.prototype)

	/**
	 * Bind the draggable element selector
	 *
	 * @param {String} selector
	 * @api public
	 */
	Sortable.prototype.bind = function (selector){
	  this.selector = selector || ''
	  this.docEvents = events(document, this)
	  this.events = events(this.el, this)

	  this.events.bind('touchstart')
	  this.events.bind('touchmove')
	  this.events.bind('touchend')
	  this.docEvents.bind('touchcancel', 'ontouchend')
	  this.docEvents.bind('touchend')

	  if (!hasTouch) {
	    this.events.bind('mousedown', 'ontouchstart')
	    this.events.bind('mousemove', 'ontouchmove')
	    this.docEvents.bind('mouseup', 'ontouchend')
	  }


	  // MS IE touch events
	  this.events.bind('PointerDown', 'ontouchstart')
	  this.events.bind('PointerMove', 'ontouchmove')
	  this.docEvents.bind('PointerUp', 'ontouchend')
	  return this
	}

	/**
	 * Ignore items that t match the `selector`.
	 *
	 * @param {String} selector
	 * @return {Sortable}
	 * @api public
	 */
	Sortable.prototype.ignore = function(selector){
	  this.ignored = selector
	  return this
	}

	Sortable.prototype.horizon = function () {
	  this.dir = 'horizon'
	  return this
	}

	/**
	 * Set handle to `selector`.
	 *
	 * @param {String} selector
	 * @return {Sortable}
	 * @api public
	 */

	Sortable.prototype.handle = function(selector){
	  this._handle = selector
	  return this
	}

	Sortable.prototype.ontouchstart = function(e) {
	  if (this.dragEl != null) return
	  if (this.ignored && closest(e.target, this.ignored, this.el)) return
	  var node = this.findDelegate(e)
	  if (node == null) return
	  if (this.timer) clearTimeout(this.timer)
	  var touch = util.getTouch(e)
	  if (this._handle) e.preventDefault()
	  this.timer = setTimeout(function () {
	    this.dragEl = node
	    this.dragging = true
	    this.index = util.indexof(node)
	    this.mouseStart = {}
	    this.x = this.mouseStart.x = touch.clientX,
	    this.y = this.mouseStart.y = touch.clientY
	    var pos = util.getAbsolutePosition(node, this.pel)
	    // place holder
	    var holder = this.holder = node.cloneNode(false)
	    holder.removeAttribute('id')
	    classes(holder).add('sortable-holder')
	    util.copy(holder.style, {
	      borderColor: 'rgba(255,255,255,0)',
	      backgroundColor: 'rgba(255,255,255,0)',
	      height: pos.height + 'px',
	      width: pos.width + 'px'
	    })
	    classes(node).add('sortable-dragging')
	    this.orig = util.copy(node.style, {
	      height: pos.height + 'px',
	      width: pos.width + 'px',
	      left: pos.left + 'px',
	      top: pos.top + 'px',
	      zIndex: 99,
	      position: 'absolute'
	    })
	    this.el.insertBefore(holder, node)
	    this.animate = new Animate(this.pel, node, holder)
	    this.emit('start')
	  }.bind(this), 100)
	}

	Sortable.prototype.ontouchmove = function(e) {
	  if (this.mouseStart == null) return
	  if (e.changedTouches && e.changedTouches.length !== 1) return
	  var el = this.dragEl
	  e.preventDefault()
	  e.stopPropagation()
	  var touch = util.getTouch(e)
	  var touchDir = 0
	  if (this.dir === 'horizon') {
	    var dx = touch.clientX - this.x
	    if (dx === 0) return
	    touchDir = dx > 0 ? 1 : 3
	    this.tx = touch.clientX - this.mouseStart.x
	    util.translate(el, this.tx, 0)
	  } else {
	    var dy = touch.clientY - this.y
	    if (dy === 0) return
	    touchDir = dy > 0 ? 0 : 2
	    this.ty = touch.clientY - this.mouseStart.y
	    util.translate(el, 0, this.ty)
	  }
	  this.x = touch.clientX
	  this.y = touch.clientY
	  this.positionHolder(touch, touchDir)
	  return false
	}

	Sortable.prototype.ontouchend = function() {
	  this.reset()
	}

	Sortable.prototype.remove =
	Sortable.prototype.unbind = function() {
	  this.events.unbind()
	  this.docEvents.unbind()
	  this.off()
	}

	Sortable.prototype.findDelegate = function(e){
	  var el
	  if (this._handle) {
	    el = closest(e.target, this._handle, this.el)
	  } else if (this.selector) {
	    el = closest(e.target, this.selector, this.el)
	  } else {
	    el = e.target
	  }
	  if (!el) return null
	  return util.matchAsChild(el, this.el)
	}

	var positionHolder = function (e, touchDir) {
	  var d = this.dragEl
	  if (d == null) return
	  var delta = this.delta
	  var rect = d.getBoundingClientRect()
	  var x = rect.left + rect.width/2
	  var y = rect.top + rect.height/2
	  var horizon = this.dir === 'horizon'
	  var holder = this.holder
	  var last = this.last || holder
	  var el = last
	  var property = touchDir < 2 ? 'nextSibling' : 'previousSibling'
	  while(el) {
	    if (el.nodeType !== 1 || el === d || el === holder) {
	      el = el[property]
	      continue
	    }
	    var r = el.getBoundingClientRect()
	    if (horizon) {
	      var dx = x - (r.left + r.width/2)
	      if (touchDir === 1 && dx < - delta) break
	      if (touchDir === 3 && dx > delta) break
	      if (el === last) {
	        if ((touchDir === 1 && x > r.right) || (touchDir === 3 && x < r.left)) {
	          el = el[property]
	          continue
	        }
	      }
	      this.last = el
	      this.animate.animate(el, (touchDir + 2)%4)
	    } else {
	      var dy = y - (r.top +  r.height/2)
	      if (touchDir === 2 && dy > delta) break
	      if (touchDir === 0 && dy < - delta) break
	      if (el === last) {
	        if ((touchDir === 0 && y > r.bottom) || (touchDir === 2 && y < r.top)) {
	          el = el[property]
	          continue
	        }
	      }
	      this.last = el
	      this.animate.animate(el, (touchDir + 2)%4)
	    }
	    el = el[property]
	  }
	}

	Sortable.prototype.positionHolder = throttle(positionHolder)

	/**
	 * Reset sortable.
	 *
	 * @api private
	 * @return {Sortable}
	 * @api private
	 */

	Sortable.prototype.reset = function(){
	  if (this.timer) {
	    clearTimeout(this.timer)
	    this.timer = null
	  }
	  // make sure called once
	  if (this.mouseStart == null) return
	  this.mouseStart = null
	  var el = this.dragEl
	  var h = this.holder
	  this.moveTo(el, h, function () {
	    // performance better
	    el.style[transform] = ''
	    el.style[transition] = ''
	    if (el.parentNode) {
	      el.parentNode.insertBefore(el, h)
	    }
	    if (h.parentNode) {
	      h.parentNode.removeChild(h)
	    }
	    util.copy(el.style, this.orig)
	    if (util.indexof(el) !== this.index) {
	      this.emit('update', el)
	    }
	    classes(el).remove('sortable-dragging')
	    delete this.index
	    this.last = this.animate = this.holder = this.dragEl = null
	    this.dragging = false
	    this.emit('end')
	  }.bind(this))
	}

	Sortable.prototype.moveTo = function (el, target, cb) {
	  var duration = 330
	  util.transitionDuration(el, duration, 'ease')
	  var tx = this.tx || 0
	  var ty = this.ty || 0
	  var dir = this.animate.dir
	  if (!dir) {
	    if (this.dir === 'horizon') {
	      dir = tx > 0 ? 1 : 3
	    } else {
	      dir = ty > 0 ? 2 : 0
	    }
	  }
	  var dis = util.getDistance(el, target, dir)
	  var x = tx + dis.x
	  var y = ty + dis.y
	  var nomove = (dis.x ==0 && dis.y === 0)
	  if (nomove) {
	    setTimeout(cb, duration)
	  } else {
	    var end = function () {
	      event.unbind(el, transitionend, end)
	      cb()
	    }
	    event.bind(el, transitionend, end)
	    util.translate(el, x, y)
	  }
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var index = __webpack_require__(15);

	/**
	 * Whitespace regexp.
	 */

	var re = /\s+/;

	/**
	 * toString reference.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Wrap `el` in a `ClassList`.
	 *
	 * @param {Element} el
	 * @return {ClassList}
	 * @api public
	 */

	module.exports = function(el){
	  return new ClassList(el);
	};

	/**
	 * Initialize a new ClassList for `el`.
	 *
	 * @param {Element} el
	 * @api private
	 */

	function ClassList(el) {
	  if (!el || !el.nodeType) {
	    throw new Error('A DOM element reference is required');
	  }
	  this.el = el;
	  this.list = el.classList;
	}

	/**
	 * Add class `name` if not already present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.add = function(name){
	  // classList
	  if (this.list) {
	    this.list.add(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (!~i) arr.push(name);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove class `name` when present, or
	 * pass a regular expression to remove
	 * any which match.
	 *
	 * @param {String|RegExp} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.remove = function(name){
	  if ('[object RegExp]' == toString.call(name)) {
	    return this.removeMatching(name);
	  }

	  // classList
	  if (this.list) {
	    this.list.remove(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (~i) arr.splice(i, 1);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove all classes matching `re`.
	 *
	 * @param {RegExp} re
	 * @return {ClassList}
	 * @api private
	 */

	ClassList.prototype.removeMatching = function(re){
	  var arr = this.array();
	  for (var i = 0; i < arr.length; i++) {
	    if (re.test(arr[i])) {
	      this.remove(arr[i]);
	    }
	  }
	  return this;
	};

	/**
	 * Toggle class `name`, can force state via `force`.
	 *
	 * For browsers that support classList, but do not support `force` yet,
	 * the mistake will be detected and corrected.
	 *
	 * @param {String} name
	 * @param {Boolean} force
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.toggle = function(name, force){
	  // classList
	  if (this.list) {
	    if ("undefined" !== typeof force) {
	      if (force !== this.list.toggle(name, force)) {
	        this.list.toggle(name); // toggle again to correct
	      }
	    } else {
	      this.list.toggle(name);
	    }
	    return this;
	  }

	  // fallback
	  if ("undefined" !== typeof force) {
	    if (!force) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  } else {
	    if (this.has(name)) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  }

	  return this;
	};

	/**
	 * Return an array of classes.
	 *
	 * @return {Array}
	 * @api public
	 */

	ClassList.prototype.array = function(){
	  var className = this.el.getAttribute('class') || '';
	  var str = className.replace(/^\s+|\s+$/g, '');
	  var arr = str.split(re);
	  if ('' === arr[0]) arr.shift();
	  return arr;
	};

	/**
	 * Check if class `name` is present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.has =
	ClassList.prototype.contains = function(name){
	  return this.list
	    ? this.list.contains(name)
	    : !! ~index(this.array(), name);
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(arr, obj){
	  if (arr.indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var events = __webpack_require__(17);
	var delegate = __webpack_require__(18);

	/**
	 * Expose `Events`.
	 */

	module.exports = Events;

	/**
	 * Initialize an `Events` with the given
	 * `el` object which events will be bound to,
	 * and the `obj` which will receive method calls.
	 *
	 * @param {Object} el
	 * @param {Object} obj
	 * @api public
	 */

	function Events(el, obj) {
	  if (!(this instanceof Events)) return new Events(el, obj);
	  if (!el) throw new Error('element required');
	  if (!obj) throw new Error('object required');
	  this.el = el;
	  this.obj = obj;
	  this._events = {};
	}

	/**
	 * Subscription helper.
	 */

	Events.prototype.sub = function(event, method, cb){
	  this._events[event] = this._events[event] || {};
	  this._events[event][method] = cb;
	};

	/**
	 * Bind to `event` with optional `method` name.
	 * When `method` is undefined it becomes `event`
	 * with the "on" prefix.
	 *
	 * Examples:
	 *
	 *  Direct event handling:
	 *
	 *    events.bind('click') // implies "onclick"
	 *    events.bind('click', 'remove')
	 *    events.bind('click', 'sort', 'asc')
	 *
	 *  Delegated event handling:
	 *
	 *    events.bind('click li > a')
	 *    events.bind('click li > a', 'remove')
	 *    events.bind('click a.sort-ascending', 'sort', 'asc')
	 *    events.bind('click a.sort-descending', 'sort', 'desc')
	 *
	 * @param {String} event
	 * @param {String|function} [method]
	 * @return {Function} callback
	 * @api public
	 */

	Events.prototype.bind = function(event, method){
	  var e = parse(event);
	  var el = this.el;
	  var obj = this.obj;
	  var name = e.name;
	  var method = method || 'on' + name;
	  var args = [].slice.call(arguments, 2);

	  // callback
	  function cb(){
	    var a = [].slice.call(arguments).concat(args);
	    obj[method].apply(obj, a);
	  }

	  // bind
	  if (e.selector) {
	    cb = delegate.bind(el, e.selector, name, cb);
	  } else {
	    events.bind(el, name, cb);
	  }

	  // subscription for unbinding
	  this.sub(name, method, cb);

	  return cb;
	};

	/**
	 * Unbind a single binding, all bindings for `event`,
	 * or all bindings within the manager.
	 *
	 * Examples:
	 *
	 *  Unbind direct handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * Unbind delegate handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * @param {String|Function} [event]
	 * @param {String|Function} [method]
	 * @api public
	 */

	Events.prototype.unbind = function(event, method){
	  if (0 == arguments.length) return this.unbindAll();
	  if (1 == arguments.length) return this.unbindAllOf(event);

	  // no bindings for this event
	  var bindings = this._events[event];
	  if (!bindings) return;

	  // no bindings for this method
	  var cb = bindings[method];
	  if (!cb) return;

	  events.unbind(this.el, event, cb);
	};

	/**
	 * Unbind all events.
	 *
	 * @api private
	 */

	Events.prototype.unbindAll = function(){
	  for (var event in this._events) {
	    this.unbindAllOf(event);
	  }
	};

	/**
	 * Unbind all events for `event`.
	 *
	 * @param {String} event
	 * @api private
	 */

	Events.prototype.unbindAllOf = function(event){
	  var bindings = this._events[event];
	  if (!bindings) return;

	  for (var method in bindings) {
	    this.unbind(event, method);
	  }
	};

	/**
	 * Parse `event`.
	 *
	 * @param {String} event
	 * @return {Object}
	 * @api private
	 */

	function parse(event) {
	  var parts = event.split(/ +/);
	  return {
	    name: parts.shift(),
	    selector: parts.join(' ')
	  }
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';

	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};

	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var closest = __webpack_require__(19)
	  , event = __webpack_require__(17);

	/**
	 * Delegate event `type` to `selector`
	 * and invoke `fn(e)`. A callback function
	 * is returned which may be passed to `.unbind()`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, selector, type, fn, capture){
	  return event.bind(el, type, function(e){
	    var target = e.target || e.srcElement;
	    e.delegateTarget = closest(target, selector, true, el);
	    if (e.delegateTarget) fn.call(el, e);
	  }, capture);
	};

	/**
	 * Unbind event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  event.unbind(el, type, fn, capture);
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */

	var matches = __webpack_require__(20)

	/**
	 * Export `closest`
	 */

	module.exports = closest

	/**
	 * Closest
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {Element} scope (optional)
	 */

	function closest (el, selector, scope) {
	  scope = scope || document.documentElement;

	  // walk up the dom
	  while (el && el !== scope) {
	    if (matches(el, selector)) return el;
	    el = el.parentNode;
	  }

	  // check scope for match
	  return matches(el, selector) ? el : null;
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var query = __webpack_require__(21);

	/**
	 * Element prototype.
	 */

	var proto = Element.prototype;

	/**
	 * Vendor function.
	 */

	var vendor = proto.matches
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;

	/**
	 * Expose `match()`.
	 */

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (!el || el.nodeType !== 1) return false;
	  if (vendor) return vendor.call(el, selector);
	  var nodes = query.all(selector, el.parentNode);
	  for (var i = 0; i < nodes.length; ++i) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}


/***/ },
/* 21 */
/***/ function(module, exports) {

	function one(selector, el) {
	  return el.querySelector(selector);
	}

	exports = module.exports = function(selector, el){
	  el = el || document;
	  return one(selector, el);
	};

	exports.all = function(selector, el){
	  el = el || document;
	  return el.querySelectorAll(selector);
	};

	exports.engine = function(obj){
	  if (!obj.one) throw new Error('.one callback required');
	  if (!obj.all) throw new Error('.all callback required');
	  one = obj.one;
	  exports.all = obj.all;
	  return exports;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies.
	 */

	var raf = __webpack_require__(23);

	/**
	 * Export `throttle`.
	 */

	module.exports = throttle;

	/**
	 * Executes a function at most once per animation frame. Kind of like
	 * throttle, but it throttles at ~60Hz.
	 *
	 * @param {Function} fn - the Function to throttle once per animation frame
	 * @return {Function}
	 * @public
	 */

	function throttle(fn) {
	  var rtn;
	  var ignoring = false;

	  return function queue() {
	    if (ignoring) return rtn;
	    ignoring = true;

	    raf(function() {
	      ignoring = false;
	    });

	    rtn = fn.apply(this, arguments);
	    return rtn;
	  };
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * Expose `requestAnimationFrame()`.
	 */

	exports = module.exports = window.requestAnimationFrame
	  || window.webkitRequestAnimationFrame
	  || window.mozRequestAnimationFrame
	  || fallback;

	/**
	 * Fallback implementation.
	 */

	var prev = new Date().getTime();
	function fallback(fn) {
	  var curr = new Date().getTime();
	  var ms = Math.max(0, 16 - (curr - prev));
	  var req = setTimeout(fn, ms);
	  prev = curr;
	  return req;
	}

	/**
	 * Cancel.
	 */

	var cancel = window.cancelAnimationFrame
	  || window.webkitCancelAnimationFrame
	  || window.mozCancelAnimationFrame
	  || window.clearTimeout;

	exports.cancel = function(id){
	  cancel.call(window, id);
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	
	var styles = [
	  'webkitTransform',
	  'MozTransform',
	  'msTransform',
	  'OTransform',
	  'transform'
	];

	var el = document.createElement('p');
	var style;

	for (var i = 0; i < styles.length; i++) {
	  style = styles[i];
	  if (null != el.style[style]) {
	    module.exports = style;
	    break;
	  }
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var styles = __webpack_require__(26)
	var transform = __webpack_require__(24)
	var has3d = __webpack_require__(27)
	var transition = __webpack_require__(28)
	var touchAction = __webpack_require__(29)

	/**
	 * Get the child of topEl by element within a child
	 *
	 * @param  {Element}  el
	 * @param {Element} topEl
	 * @return {Element}
	 * @api private
	 */
	exports.matchAsChild = function (el, topEl) {
	  if (el === topEl) return
	  do {
	    if (el.parentNode === topEl) return el
	    el = el.parentNode
	  } while(el)
	}

	/**
	 * Get absolute left top width height
	 *
	 * @param  {Element}  el
	 * @param {Element} pel
	 * @return {Object}
	 * @api public
	 */
	var getAbsolutePosition = exports.getAbsolutePosition = function (el, pel) {
	  var r = el.getBoundingClientRect()
	  var rect = pel.getBoundingClientRect()
	  return {
	    left: r.left - rect.left,
	    top: r.top -rect.top,
	    width: r.width || el.offsetWidth,
	    height: r.height || el.offsetHeight
	  }
	}

	/**
	 * Make an element absolute, return origin props
	 *
	 * @param  {Element}  el
	 * @param {Element} pel
	 * @return {Object}
	 * @api public
	 */
	exports.makeAbsolute = function (el, pel) {
	  var pos = getAbsolutePosition(el, pel)
	  var orig = copy(el.style, {
	    height: pos.height + 'px',
	    width: pos.width + 'px',
	    left: pos.left + 'px',
	    top: pos.top + 'px',
	    position: 'absolute',
	    float: 'none'
	  })
	  return orig
	}

	var doc = document.documentElement
	/**
	 * Get relative element of el
	 *
	 * @param  {Element}  el
	 * @return {Element}
	 * @api public
	 */
	exports.getRelativeElement = function (el) {
	  while(el) {
	    if (el === doc) return el
	    var p = styles(el, 'position')
	    if (p === 'absolute' || p === 'fixed' || p === 'relative') {
	      return el
	    }
	    el = el.parentNode
	  }
	}

	/**
	 * Insert newNode after ref
	 *
	 * @param {Element} newNode
	 * @param {Element} ref
	 * @api public
	 */
	exports.insertAfter = function (newNode, ref) {
	  if (ref.nextSibling) {
	    ref.parentNode.insertBefore(newNode, ref.nextSibling)
	  } else {
	    ref.parentNode.appendChild(newNode)
	  }
	}

	/**
	 * Copy props from from to to
	 * return original props
	 *
	 * @param {Object} to
	 * @param {Object} from
	 * @return {Object}
	 * @api public
	 */
	var copy = exports.copy = function (to, from) {
	  var orig = {}
	  Object.keys(from).forEach(function (k) {
	    orig[k] = to[k]
	    to[k] = from[k]
	  })
	  return orig
	}

	/**
	 * Get index of element as children
	 *
	 * @param  {Element}  el
	 * @return {Number}
	 * @api public
	 */
	exports.indexof = function (el) {
	  var children = el.parentNode.children
	  for (var i = children.length - 1; i >= 0; i--) {
	    var node = children[i];
	    if (node === el) {
	      return i
	    }
	  }
	}

	/**
	 * Translate el to `x` `y`.
	 *
	 * @api public
	 */
	exports.translate = function(el, x, y){
	  var s = el.style
	  x = x || 0
	  y = y || 0
	  if (has3d) {
	    s[transform] = 'translate3d(' + x + 'px,' + y + 'px, 0)'
	  } else {
	    s[transform] = 'translateX(' + x + 'px),translateY(' + y + 'px)'
	  }
	}

	exports.getDistance = function (from, to, dir) {
	  var x
	  var y
	  var r = from.getBoundingClientRect()
	  var tr = to.getBoundingClientRect()
	  var prop
	  if (dir%2 === 0) {
	    x = 0
	    prop = dir === 0 ? 'top' : 'bottom'
	    y = tr[prop] - r[prop]
	  } else {
	    y = 0
	    prop = dir === 1 ? 'left' : 'right'
	    x = tr[prop] - r[prop]
	  }
	  return {x: x, y: y}
	}

	/**
	 * Set transition duration to `ms`
	 *
	 * @param  {Element}  el
	 * @param {Number} ms
	 * @api public
	 */
	var prefix = transition.replace(/transition/i, '').toLowerCase()
	exports.transitionDuration = function(el, ms, ease){
	  var s = el.style;
	  ease = ease || 'ease-in-out'
	  if (!prefix) {
	    s[transition] = ms + 'ms transform ' + ease
	  } else {
	    s[transition] = ms + 'ms -' + prefix + '-transform ' + ease
	  }
	}

	/**
	 * Gets the appropriate "touch" object for the `e` event. The event may be from
	 * a "mouse", "touch", or "Pointer" event, so the normalization happens here.
	 *
	 * @api private
	 */
	exports.getTouch = function(e){
	  // "mouse" and "Pointer" events just use the event object itself
	  var touch = e;
	  if (e.changedTouches && e.changedTouches.length > 0) {
	    // W3C "touch" events use the `changedTouches` array
	    touch = e.changedTouches[0];
	  }
	  return touch;
	}

	/**
	 * Sets the "touchAction" CSS style property to `value`.
	 *
	 * @api private
	 */
	exports.touchAction = function(el, value){
	  var s = el.style;
	  if (touchAction) {
	    s[touchAction] = value;
	  }
	}


/***/ },
/* 26 */
/***/ function(module, exports) {

	// DEV: We don't use var but favor parameters since these play nicer with minification
	function computedStyle(el, prop, getComputedStyle, style) {
	  getComputedStyle = window.getComputedStyle;
	  style =
	      // If we have getComputedStyle
	      getComputedStyle ?
	        // Query it
	        // TODO: From CSS-Query notes, we might need (node, null) for FF
	        getComputedStyle(el) :

	      // Otherwise, we are in IE and use currentStyle
	        el.currentStyle;
	  if (style) {
	    return style
	    [
	      // Switch to camelCase for CSSOM
	      // DEV: Grabbed from jQuery
	      // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
	      // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
	      prop.replace(/-(\w)/gi, function (word, letter) {
	        return letter.toUpperCase();
	      })
	    ];
	  }
	}

	module.exports = computedStyle;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	var prop = __webpack_require__(24);

	// IE <=8 doesn't have `getComputedStyle`
	if (!prop || !window.getComputedStyle) {
	  module.exports = false;

	} else {
	  var map = {
	    webkitTransform: '-webkit-transform',
	    OTransform: '-o-transform',
	    msTransform: '-ms-transform',
	    MozTransform: '-moz-transform',
	    transform: 'transform'
	  };

	  // from: https://gist.github.com/lorenzopolidori/3794226
	  var el = document.createElement('div');
	  el.style[prop] = 'translate3d(1px,1px,1px)';
	  document.body.insertBefore(el, null);
	  var val = getComputedStyle(el).getPropertyValue(map[prop]);
	  document.body.removeChild(el);
	  module.exports = null != val && val.length && 'none' != val;
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	var styles = [
	  'webkitTransition',
	  'MozTransition',
	  'OTransition',
	  'msTransition',
	  'transition'
	]

	var el = document.createElement('p')
	var style

	for (var i = 0; i < styles.length; i++) {
	  if (null != el.style[styles[i]]) {
	    style = styles[i]
	    break
	  }
	}
	el = null

	module.exports = style


/***/ },
/* 29 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 */

	module.exports = touchActionProperty();

	/**
	 * Returns "touchAction", "msTouchAction", or null.
	 */

	function touchActionProperty(doc) {
	  if (!doc) doc = document;
	  var div = doc.createElement('div');
	  var prop = null;
	  if ('touchAction' in div.style) prop = 'touchAction';
	  else if ('msTouchAction' in div.style) prop = 'msTouchAction';
	  div = null;
	  return prop;
	}


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(25)
	var transform = __webpack_require__(24)
	var transition = __webpack_require__(28)
	var transitionend = __webpack_require__(31)
	var event = __webpack_require__(17)
	var uid = __webpack_require__(32)

	function Animate(pel, dragEl, holder) {
	  var d = this.dragEl = dragEl
	  var r = d.getBoundingClientRect()
	  this.holder = holder
	  this.dx = r.width
	  this.dy = r.height
	  this.pel = pel
	  this.animates = {}
	}

	/**
	 * Animate element with direction
	 * 0 1 2 3 is for down right up left
	 *
	 * @param  {Element}  el
	 * @param {Number} dir
	 * @api public
	 */
	Animate.prototype.animate = function (el, dir) {
	  if (!el.id) el.id = uid(7)
	  var o = this.animates[el.id] || {}
	  if (o.dir === dir) return
	  this.dir = dir
	  o.dir = dir
	  // var holder = this.holder
	  if (o.end) {
	    event.unbind(el, transitionend, o.end);
	    if (o.transform) {
	      o.transform = false
	      this.transit(el, 0, 0, dir)
	    } else {
	      o.transform = true
	      var props = this.getTransformProperty(dir)
	      this.transit(el, props.x, props.y, dir)
	    }
	  } else {
	    o.transform = true
	    util.transitionDuration(el, 320)
	    this.animates[el.id] = o
	    this.start(o, el, dir)
	  }
	}

	Animate.prototype.getTransformProperty = function (dir) {
	  var x
	  var y
	  if (dir%2 === 0) {
	    y = dir > 1 ? - this.dy : this.dy
	  } else {
	    x = dir > 1 ? - this.dx : this.dx
	  }
	  return {
	    x: x,
	    y: y
	  }
	}

	Animate.prototype.start = function (o, el, dir) {
	  var holder = this.holder
	  var r = holder.getBoundingClientRect()
	  var h = r.height
	  var w = r.width
	  var s = holder.style
	  o.orig = util.makeAbsolute(el, this.pel)
	  // bigger the holder
	  if (dir%2 === 0) {
	    s.height = (h + this.dy) + 'px'
	  } else {
	    s.width = (w + this.dx) + 'px'
	  }
	  var props = this.getTransformProperty(dir)
	  // test if transition begin
	  o.end = this.transit(el, props.x, props.y, dir)
	}

	Animate.prototype.transit = function (el, x, y, dir) {
	  var holder = this.holder
	  var s = holder.style
	  var self = this
	  var end = function () {
	    event.unbind(el, transitionend, end);
	    var o = self.animates[el.id]
	    if (!o) return
	    var orig = o.orig
	    // reset el
	    el.style[transition] = ''
	    el.style[transform] = ''
	    var removed = !holder.parentNode
	    if (!removed && o.transform && el.parentNode) {
	      if (dir > 1) {
	        util.insertAfter(holder, el)
	      } else {
	        el.parentNode.insertBefore(holder, el)
	      }
	    }
	    util.copy(el.style, orig)
	    if (removed) return
	    // reset holder
	    var rect = holder.getBoundingClientRect()
	    if (dir%2 === 0) {
	      s.height = (rect.height - self.dy) + 'px'
	    } else {
	      s.width = (rect.width - self.dx) + 'px'
	    }
	    self.animates[el.id] = null
	  }
	  event.bind(el, transitionend, end)
	  util.translate(el, x, y)
	  return end
	}

	module.exports = Animate


/***/ },
/* 31 */
/***/ function(module, exports) {

	/**
	 * Transition-end mapping
	 */

	var map = {
	  'WebkitTransition' : 'webkitTransitionEnd',
	  'MozTransition' : 'transitionend',
	  'OTransition' : 'oTransitionEnd',
	  'msTransition' : 'MSTransitionEnd',
	  'transition' : 'transitionend'
	};

	/**
	 * Expose `transitionend`
	 */

	var el = document.createElement('p');

	for (var transition in map) {
	  if (null != el.style[transition]) {
	    module.exports = map[transition];
	    break;
	  }
	}


/***/ },
/* 32 */
/***/ function(module, exports) {

	/**
	 * Export `uid`
	 */

	module.exports = uid;

	/**
	 * Create a `uid`
	 *
	 * @param {String} len
	 * @return {String} uid
	 */

	function uid(len) {
	  len = len || 7;
	  return Math.random().toString(35).substr(2, len);
	}


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * dependencies
	 */

	var matches = __webpack_require__(34);

	/**
	 * Traverse with the given `el`, `selector` and `len`.
	 *
	 * @param {String} type
	 * @param {Element} el
	 * @param {String|Element} selector
	 * @param {Number} len
	 * @return {Array}
	 * @api public
	 */

	module.exports = function(type, el, selector, len){
	  var el = el[type]
	    , n = len || 1
	    , ret = [];

	  if (!el) return ret;

	  // check if `selector` is a DOM node
	  var isElement = selector && selector.nodeName;

	  do {
	    if (n == ret.length) break;
	    if (1 != el.nodeType) continue;
	    if (isElement) el == selector && ret.push(el);
	    else if (matches(el, selector)) ret.push(el);
	    if (!selector) ret.push(el);
	  } while (el = el[type]);

	  return ret;
	}


/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';

	var proto = Element.prototype;
	var vendor = proto.matches
	  || proto.matchesSelector
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (vendor) return vendor.call(el, selector);
	  var nodes = el.parentNode.querySelectorAll(selector);
	  for (var i = 0; i < nodes.length; i++) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var query = __webpack_require__(36);

	/**
	 * Element prototype.
	 */

	var proto = Element.prototype;

	/**
	 * Vendor function.
	 */

	var vendor = proto.matches
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;

	/**
	 * Expose `match()`.
	 */

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (!el || el.nodeType !== 1) return false;
	  if (vendor) return vendor.call(el, selector);
	  var nodes = query.all(selector, el.parentNode);
	  for (var i = 0; i < nodes.length; ++i) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}


/***/ },
/* 36 */
/***/ function(module, exports) {

	function one(selector, el) {
	  return el.querySelector(selector);
	}

	exports = module.exports = function(selector, el){
	  el = el || document;
	  return one(selector, el);
	};

	exports.all = function(selector, el){
	  el = el || document;
	  return el.querySelectorAll(selector);
	};

	exports.engine = function(obj){
	  if (!obj.one) throw new Error('.one callback required');
	  if (!obj.all) throw new Error('.all callback required');
	  one = obj.one;
	  exports.all = obj.all;
	  return exports;
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var classes = __webpack_require__(38)
	var computedStyle = __webpack_require__(40)

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

	function switchStyle(first, second, prop) {
	  var tmp = computedStyle(second, prop)
	  second.style[prop] = computedStyle(first, prop)
	  first.style[prop] = tmp
	}

	function switchClasses(first, second, name) {
	  if (classes(first).has(name)) {
	    classes(first).remove(name)
	    classes(second).add(name)
	  } else {
	    classes(second).remove(name)
	    classes(first).add(name)
	  }
	}

	function switchProperty(first, second, prop) {
	  var tmp = second[prop]
	  second[prop] = first[prop]
	  first[prop] = tmp
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var index = __webpack_require__(39);

	/**
	 * Whitespace regexp.
	 */

	var re = /\s+/;

	/**
	 * toString reference.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Wrap `el` in a `ClassList`.
	 *
	 * @param {Element} el
	 * @return {ClassList}
	 * @api public
	 */

	module.exports = function(el){
	  return new ClassList(el);
	};

	/**
	 * Initialize a new ClassList for `el`.
	 *
	 * @param {Element} el
	 * @api private
	 */

	function ClassList(el) {
	  if (!el || !el.nodeType) {
	    throw new Error('A DOM element reference is required');
	  }
	  this.el = el;
	  this.list = el.classList;
	}

	/**
	 * Add class `name` if not already present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.add = function(name){
	  // classList
	  if (this.list) {
	    this.list.add(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (!~i) arr.push(name);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove class `name` when present, or
	 * pass a regular expression to remove
	 * any which match.
	 *
	 * @param {String|RegExp} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.remove = function(name){
	  if ('[object RegExp]' == toString.call(name)) {
	    return this.removeMatching(name);
	  }

	  // classList
	  if (this.list) {
	    this.list.remove(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (~i) arr.splice(i, 1);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove all classes matching `re`.
	 *
	 * @param {RegExp} re
	 * @return {ClassList}
	 * @api private
	 */

	ClassList.prototype.removeMatching = function(re){
	  var arr = this.array();
	  for (var i = 0; i < arr.length; i++) {
	    if (re.test(arr[i])) {
	      this.remove(arr[i]);
	    }
	  }
	  return this;
	};

	/**
	 * Toggle class `name`, can force state via `force`.
	 *
	 * For browsers that support classList, but do not support `force` yet,
	 * the mistake will be detected and corrected.
	 *
	 * @param {String} name
	 * @param {Boolean} force
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.toggle = function(name, force){
	  // classList
	  if (this.list) {
	    if ("undefined" !== typeof force) {
	      if (force !== this.list.toggle(name, force)) {
	        this.list.toggle(name); // toggle again to correct
	      }
	    } else {
	      this.list.toggle(name);
	    }
	    return this;
	  }

	  // fallback
	  if ("undefined" !== typeof force) {
	    if (!force) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  } else {
	    if (this.has(name)) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  }

	  return this;
	};

	/**
	 * Return an array of classes.
	 *
	 * @return {Array}
	 * @api public
	 */

	ClassList.prototype.array = function(){
	  var className = this.el.getAttribute('class') || '';
	  var str = className.replace(/^\s+|\s+$/g, '');
	  var arr = str.split(re);
	  if ('' === arr[0]) arr.shift();
	  return arr;
	};

	/**
	 * Check if class `name` is present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.has =
	ClassList.prototype.contains = function(name){
	  return this.list
	    ? this.list.contains(name)
	    : !! ~index(this.array(), name);
	};


/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = function(arr, obj){
	  if (arr.indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	// DEV: We don't use var but favor parameters since these play nicer with minification
	function computedStyle(el, prop, getComputedStyle, style) {
	  getComputedStyle = window.getComputedStyle;
	  style =
	      // If we have getComputedStyle
	      getComputedStyle ?
	        // Query it
	        // TODO: From CSS-Query notes, we might need (node, null) for FF
	        getComputedStyle(el) :

	      // Otherwise, we are in IE and use currentStyle
	        el.currentStyle;
	  if (style) {
	    return style
	    [
	      // Switch to camelCase for CSSOM
	      // DEV: Grabbed from jQuery
	      // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
	      // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
	      prop.replace(/-(\w)/gi, function (word, letter) {
	        return letter.toUpperCase();
	      })
	    ];
	  }
	}

	module.exports = computedStyle;


/***/ }
/******/ ]);
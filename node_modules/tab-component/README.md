# tabs

[![NPM version](https://img.shields.io/npm/v/tab-component.svg?style=flat-square)](https://www.npmjs.com/package/tab-component)
[![Dependency Status](https://img.shields.io/david/chemzqm/tabs.svg?style=flat-square)](https://david-dm.org/chemzqm/tabs)
[![Build Status](https://img.shields.io/travis/chemzqm/tabs/master.svg?style=flat-square)](http://travis-ci.org/chemzqm/tabs)

[demo](http://chemzqm.github.io/tabs/)

Dynamic tabs component with add, remove and order support.

May not works in ie < 9

## Install

    component install chemzqm/tabs

or

    npm install tab-component

## Usage

``` html
<div id="tabs">
  <ul class="tabs-header">
    <li>tab1</li>
  </ul>
  <div class="tabs-body">
    <div>
      body
    </div>
  </div>
</div>
```

`tabs-header` and `tabs-body` is requried classes for header and body

```js
var Tabs = require('tabs')

var parentNode = document.getElementById('tabs')
var tabs = new Tabs(parentNode)
tabs.closable()
tabs.sortable()
```
## events

* `active` emitted with activated nav element
* `sort` emitted when the tabs get reordered
* `empty` emitted when all tabs removed
* `remove` emitted with remove header and body

## API

### new Tabs(parentNode, [opts])

Init tabs inside parentNode and optional `opts`, direct children of `tabs-header` and `tabs-body`
matches selector are used as header item and body items

* `opts.headerSelector` selector for header item default `li`
* `opts.bodySelector` selector for body items default `div`

### .closable()

Add close icon to the tab navs to make the tabs closable.

### .sortable()

Make the tab navs sortable

### .add(title, content)

Add a tab with title and content (could be string of element)

### .active(el | selector)

Active the tab by css query(querySelector inside) or tab element.

### .unbind()

Unbind all event handlers, including sort, click

## MIT license

Copyright (c) 2015 chemzqm@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

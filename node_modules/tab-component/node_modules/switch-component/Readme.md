# Switch

[![NPM version](https://img.shields.io/npm/v/switch.svg?style=flat-square)](https://www.npmjs.com/package/switch)
[![Build Status](https://img.shields.io/travis/chemzqm/switch/master.svg?style=flat-square)](http://travis-ci.org/chemzqm/switch)

Switch element `style` `className` `property`

**Notice** computed style is used for style switch, for some property like color the style property would always be rgb.

## Install

    npm i switch-component

## Usage

```
var switcher = require('switch-component')
switcher(firstEl, secondEl, {style: 'display'})
switcher(firstEl, secondEl, {style: 'visibility'})
switcher(firstEl, secondEl, {className: 'active'})
switcher(firstEl, secondEl, {property: 'textContent'})
```
`style` `className` and `property` value could be string or array of string

See [test.js](https://github.com/chemzqm/switch/blob/master/test/test.js)

## MIT license
Copyright (c) 2015 chemzqm@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

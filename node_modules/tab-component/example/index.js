var Tabs = require('..');

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

const san = require('../../dist/san.ssr');
const swig  = require('swig');
const art = require('art-template');
const etpl = require('etpl');

const App = san.defineComponent({
    template: `<div id='app'><ul><li s-for='item in items'>{{item}}</li></ul></div>`
});

const Item = san.defineComponent({
    template: `<li>{{item}}</li>`
});
const App2 = san.defineComponent({
    components: {
        'x-item': Item
    },
    template: `<div id='app'><ul><x-item s-for='item in items' item="{{item}}"/></ul></div>`
});


let data = { items: [] };
for (let i = 0; i < 10000; i++) {
    data.items.push(i);
}



let renderer = san.compileToRenderer(App);
let renderer2 = san.compileToRenderer(App2);
let swigRenderer = swig.compile(`<div id='app'><ul>{% for item in items %}<li>{{item}}</li>{% endfor %}</ul></div>`);
let artRenderer = art.compile(`<div id='app'><ul>{<% for(let i = 0; i < items.length; i++){ %><li><%= items[i] %></li><% } %></ul></div>`);
let etplRenderer = etpl.compile('<div id=\'app\'><ul><!-- for: ${items} as ${item} --><li>${item}</li><!-- /for --></ul></div>');

console.log('----- Simple List SSR Perf (10000 items x 100 times) -----');

console.time('san');
for (let i = 0; i < 100; i++) {
    renderer(data);
}
console.timeEnd('san');


console.time('san(item as component)');
for (let i = 0; i < 100; i++) {
    renderer2(data);
}
console.timeEnd('san(item as component)');


console.time('swig');
for (let i = 0; i < 100; i++) {
    swigRenderer(data);
}
console.timeEnd('swig');


console.time('artTpl');
for (let i = 0; i < 100; i++) {
    artRenderer(data);
}
console.timeEnd('artTpl');


console.time('etpl');
for (let i = 0; i < 100; i++) {
    etplRenderer(data);
}
console.timeEnd('etpl');


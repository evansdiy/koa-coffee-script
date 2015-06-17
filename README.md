# koa-coffee-script

Coffee-script middleware for Koa

## Installation

```js
$ npm install koa-coffee-script
```

## Example

```js
var koa = require('koa');
var less = require('koa-less');
var coffee = require('koa-coffee-script');

var app = koa();

app.use(coffee(__dirname + '/public'));

```

## License

MIT
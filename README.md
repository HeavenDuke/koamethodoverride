koamethodoverride
=================

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koamethodoverride.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koamethodoverride
[travis-image]: https://travis-ci.org/HeavenDuke/koamethodoverride.svg
[travis-url]: https://travis-ci.org/HeavenDuke/koamethodoverride
[download-image]: https://img.shields.io/npm/dm/koamethodoverride.svg?style=flat-square
[download-url]: https://npmjs.org/package/koamethodoverride

Full method override for koajs, enabling developer to launch PUT/DELETE/GET/POST request from HTTP form or links.

# Install

npm install koamethodoverride

# Dependencies

Koa 2(Node >= 0.12.0)[https://github.com/koajs/koa]
koa-bodyparser[https://github.com/koajs/bodyparser]

# Usage

Configuration your server as follows:
```js
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var override = require('koamethodoverride');
var server = koa();
server.use(bodyParser());
server.use(override());
server.listen(3000);
```

Now you can write your form as follows:
```html
<form action="/something" method="POST">
    <input style="display: none;" name="_method" value="delete" />
    <!-- something more -->
</form>
```

Or link like this:
```html
<a href="/something?_method=delete&something=something" />
```

# Detail

The middle ware will take 3 part of a request into consideration:  

*   request.body._method
*   request.query._method(from query string)
*   "x-http-method-override" header(case sensitive)

The priority of above is request.body > request.query > "x-http-method-override" header.

If the override method from a higher priority level exists but the value is not within:

*   GET
*   POST
*   PUT
*   PATCH
*   DELETE

then the middleware will search for lower level override methods, if such don't exist or all go wrong, then the middleware will simply use the original method and will not raise exception.

# License
[MIT](./LICENSE)
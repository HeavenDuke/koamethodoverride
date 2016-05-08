# koamethodoverride
Full method override for koajs, enabling developer to launch PUT/DELETE/GET/POST request from HTTP form or links.

# Install
In progress.

# Usage

Configuration your server as follows:
```js
var koa = require('koa');
var bodyParser = require('koa-body-parser');
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

The override priority of above is request.body > request.query > "x-http-method-override" header.

If the override method from a higher priority level exists but the value is not within:

*   GET
*   POST
*   PUT
*   PATCH
*   DELETE

then the middleware will search for lower level override methods, if such don't exist or all go wrong, then the middleware will simply use the original method and will raise exception.

# License
[MIT](./LICENSE)
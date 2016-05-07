/**
 * Created by Obscurity on 2016/5/7.
 */

module.exports = function () {
    return function* (next) {

        var methods = require('methods').map(function (method) {
            return method.toUpperCase();
        });

        var method = this.request.method;

        // body support
        var body = this.request.body;
        if (body && body._method) {
            method = body._method.toUpperCase();
        }

        // query support
        var query = this.request.body;
        if (query && query._method) {
            method = query._method.toUpperCase();
        }

        // header support
        var header = this.get('x-http-method-override');
        if (header) {
            method = header.toUpperCase();
        }

        // only allow supported methods
        // if the method don't match the following: GET POST PUT DELETE
        // this middleware will simply fail the override method and use the original request.method instead
        if (methods.indexOf(method) === -1) {
            method = this.request.method;
        }

        this.request.method = method;
        yield* next;
    };
};
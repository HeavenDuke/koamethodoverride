/**
 * Created by Obscurity on 2016/5/7.
 */

module.exports = function () {
    return function* (next) {

        var methods = require('methods').map(function (method) {
            return method.toUpperCase();
        });

        var overriden_methods = [];

        // header support
        var header = this.get('x-http-method-override');
        if (header) {
            overriden_methods.push(header.toUpperCase());
        }

        // query support
        var query = this.request.query;
        if (query && query._method) {
            overriden_methods.push(query._method.toUpperCase());
        }

        // body support
        var body = this.request.body;
        if (body && body._method) {
            overriden_methods.push(body._method.toUpperCase());
        }

        // only allow supported methods
        // if the method don't match the following: GET POST PUT DELETE
        // this middleware will simply fail the override method and use the original request.method instead

        var selected_method = null;
        overriden_methods.map(function (method) {
            if (methods.indexOf(method) !== -1) {
                selected_method = method;
            }
            return method;
        });

        if (selected_method != null) {
            this.request.method = selected_method;
        }
        yield* next;
    };
};
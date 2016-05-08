/**
 * Created by Obscurity on 2016/5/8.
 */

var assert = require('assert');
var koa = require('koa');
var request = require('supertest');
var bodyParser = require('koa-bodyparser');
var override = require('../');

describe('koa method override middleware for koa 2.0', function () {

    it('should override nothing', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url
            };
        });

        var test = request(server.listen());
        var result = test.post('/test').send({something: 'something'});
        result.expect({
            method: 'POST',
            url: '/test'
        }).expect(200, done);
    });

    it('should override with request.body._method', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                body: this.request.body
            };
        });

        var test = request(server.listen());
        var result = test.post('/test').send({_method: 'delete', something: 'something'});
        result.expect({
            method: 'DELETE',
            url: '/test',
            body: {
                _method: 'delete',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('should override with request.query._method', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                query: this.request.query
            };
        });

        var test = request(server.listen());
        var result = test.post('/test?_method=delete&something=something');
        result.expect({
            method: 'DELETE',
            url: '/test?_method=delete&something=something',
            query: {
                _method: 'delete',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('should override with x-http-method-override header', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url
            };
        });

        var test = request(server.listen());
        var result = test.post('/test').set('x-http-method-override', 'delete');
        result.expect({
            method: 'DELETE',
            url: '/test'
        }).expect(200, done);
    });

    it('should override nothing due to wrong format request.body._method', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                body: this.request.body
            };
        });

        var test = request(server.listen());
        var result = test.post('/test').send({_method: 'something', something: 'something'});
        result.expect({
            method: 'POST',
            url: '/test',
            body: {
                _method: 'something',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('should override nothing due to wrong format request.query._method', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                query: this.request.query
            };
        });

        var test = request(server.listen());
        var result = test.post('/test?_method=something&something=something');
        result.expect({
            method: 'POST',
            url: '/test?_method=something&something=something',
            query: {
                _method: 'something',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('should override nothing due to wrong format x-http-method-override header', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url
            };
        });

        var test = request(server.listen());
        var result = test.post('/test').set('x-http-method-override', 'something');
        result.expect({
            method: 'POST',
            url: '/test'
        }).expect(200, done);
    });

    it('request.body._method should override request.query._method', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                body: this.request.body
            };
        });

        var test = request(server.listen());
        var result = test.post('/test?_method=put&something=something').send({_method: 'delete', something: 'something'});
        result.expect({
            method: 'DELETE',
            url: '/test?_method=put&something=something',
            body: {
                _method: 'delete',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('request.body._method should override x-http-method-override header', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                body: this.request.body
            };
        });

        var test = request(server.listen());
        var result = test.post('/test').set('x-http-method-override', 'put').send({_method: 'delete', something: 'something'});
        result.expect({
            method: 'DELETE',
            url: '/test',
            body: {
                _method: 'delete',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('request.query._method should override x-http-method-override header', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url
            };
        });

        var test = request(server.listen());
        var result = test.post('/test?_method=delete&something=something').set('x-http-method-override', 'put');
        result.expect({
            method: 'DELETE',
            url: '/test?_method=delete&something=something'
        }).expect(200, done);
    });

    it('should use request.query._method when request.body._method goes wrong', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                body: this.request.body,
                query: this.request.query
            };
        });

        var test = request(server.listen());
        var result = test.post('/test?_method=put&something=something').set('x-http-method-override', 'delete').send({_method: 'something', something: 'something'});
        result.expect({
            method: 'PUT',
            url: '/test?_method=put&something=something',
            body: {
                _method: 'something',
                something: 'something'
            },
            query: {
                _method: 'put',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('should use x-http-method-override header when the rest goes wrong', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                body: this.request.body,
                query: this.request.query
            };
        });

        var test = request(server.listen());
        var result = test.post('/test?_method=something&something=something').set('x-http-method-override', 'delete').send({_method: 'something', something: 'something'});
        result.expect({
            method: 'DELETE',
            url: '/test?_method=something&something=something',
            body: {
                _method: 'something',
                something: 'something'
            },
            query: {
                _method: 'something',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('should override nothing when every overriding approach goes wrong', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url,
                body: this.request.body,
                query: this.request.query
            };
        });

        var test = request(server.listen());
        var result = test.post('/test?_method=something&something=something').set('x-http-method-override', 'something').send({_method: 'something', something: 'something'});
        result.expect({
            method: 'POST',
            url: '/test?_method=something&something=something',
            body: {
                _method: 'something',
                something: 'something'
            },
            query: {
                _method: 'something',
                something: 'something'
            }
        }).expect(200, done);
    });

    it('patch should work too', function (done) {
        var server = koa();
        server.use(bodyParser());
        server.use(override());
        server.use(function *() {
            this.body = {
                method: this.method,
                url: this.url
            };
        });

        var test = request(server.listen());
        var result = test.post('/test').set('x-http-method-override', 'patch');
        result.expect({
            method: 'PATCH',
            url: '/test'
        }).expect(200, done);
    });

});
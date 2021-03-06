/*jshint node:true, eqeqeq:true */
'use strict';

var hprose = require('../lib/hprose.js');
var client = hprose.Client.create('http://127.0.0.1:8080/', []);
client.filter = new hprose.JSONRPCClientFilter();
client.simple = true;
client.on('error', function(func, e) {
    console.log(func, e);
});
var proxy = client.useService(['hello', 'hello2', 'getMaps']);
var start = new Date().getTime();
var max = 10;
var n = 0;
var callback = function(result) {
    console.log(result);
    n++;
    if (n === max) {
        var end = new Date().getTime();
        console.log(end - start);
    }
};
client.beginBatch();
for (var i = 0; i < max; i++) {
    proxy.hello(i, callback);
}
var end = new Date().getTime();
console.log(end - start);
proxy.getMaps('name', 'age', 'age', function(result) {
    console.log(result);
});
client.endBatch();
proxy.getMaps('name', 'age', 'birthday', function(result) {
    console.log(hprose.BytesIO.toString(result));
    console.log(hprose.unserialize(result));
    console.log(hprose.serialize(hprose.unserialize(result)).toString());
}, hprose.Serialized);

var settings = require('./settings').conf;
var io = require('socket.io').listen(settings.messageServer.port);
var __ = require('underscore');

io.set('log level', 0);

var Connection = exports.Connection = function(options) {
  __.extend(this.options, options);
  this.options.socket.on('msg', __.bind(this.onMessage, this));
}
var C = Connection.prototype;

C.options = {
  socket: null,
  listeners: []
}

C.send = function(message, data, response) {
  this.options.socket.emit('msg', {
    message: message,
    data: data,
    response: response || false
  });
}

C.addListener = function(listener, context) {
  var context = context || window;
  this.options.listeners.push({
    listener: listener,
    context: context
  });
}

C.onMessage = function(message) {
  var name = message.response? message.message + '_response' : message.message;
  __.each(this.options.listeners, function(listener) {
    if(listener.listener[name]) {
      listener.listener[name].call(listener.context, message);
    }
  });
}

exports.start = function() {
  io.sockets.on('connection', __.bind(this.onConnection, this));
}

exports.listeners = [];
exports.onConnection = function(socket) {
  var connection = new Connection({socket: socket});
  __.each(this.listeners, function(listener) {
    listener.onConnection(connection);
  });
}

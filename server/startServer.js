var net = require("net");
var repl = require("repl");
var vm = require('vm');
var io = require('socket.io').listen(8080);

var debugRepl = {};

debugRepl.messages = {
  run_response: function(message) {
    var data = message.data;
    var err;
    if(data.error) {
      err = data.error.message ? data.error.message : data.error;
    }

    this.replCallback(err, data.result);
  }
}

debugRepl.listen = function() {
  var self = this;
  var connections = 0;
  //io.set('log level', 1);

  io.sockets.on('connection', function(socket) {
    self.socket = socket;
    connections++;

    self.socket.on('msg', function(message) {
      // dispatch callback
      var messageName = message.response? message.message + '_response' : message.message;
      if(self.messages[messageName]) {
        self.messages[messageName].call(self, message);
      } else {
        console.log('message callback not found, name: ' + messageName);
      }
    });

    self.startRepl();
  });
}

debugRepl.startRepl = function() {
  repl.start('> ', null, debugRepl.replEval);
}

debugRepl.replEval = function(code, context, file, callback) {
  debugRepl.replCallback = callback;
  debugRepl.socket.emit('msg', {
    message: 'run',
    data: code,
    response: false
  });
}

debugServer.listen();

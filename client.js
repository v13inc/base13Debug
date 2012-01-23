var net = require("net");
var repl = require("repl");
var vm = require('vm');
var io = require('socket.io').listen(8080);

io.set('log level', 1);

io.sockets.on('connection', function(socket) {
  connections = 0;
  var callback;

  socket.on('response', function(resp) {
    var err;
    if(resp.error) {
      err = resp.error.message ? resp.error.message : resp.error;
    }

    callback(err, resp.result);
  });

  var evalFunc = function(code, context, file, cb) {
    callback = cb;
    socket.emit('run', code);
  };

  repl.start('> ', null, evalFunc);
});

var settings = require('./settings').conf;

var repl = require('repl');
var vm = require('vm');
var __ = require('underscore');
var inspect = require('eyes').inspector(settings.eyes);

var messageServer = require('./messageServer');
var RemoteRepl = require('./remoteRepl').Repl;

var session = exports;

session.commands = {
  remote: {
    help: 'Opens a repl for the first connection',
    action: function(num) {
      if(session.connections.length == 0) {
        console.log('No remote sessions available');
        this.displayPrompt();
        return;
      }
      
      if(num) {
        var connection = session.connections[num];
      } else {
        var connection = session.connections[0];
        var num = 0;
      }

      session.startRemoteRepl(connection);
      session.repl.prompt = '[' + num + '] > ';
      console.log('Connected to remote [' + num + ']');
      this.displayPrompt();
    }
  },
  close: {
    help: 'Closes a remote repl',
    action: function() {
      session.replEval = session.origReplEval;
      session.repl.prompt = '# ';
      console.log('Remote session closed');
      this.displayPrompt();
    }
  },
  connections: {
    help: 'Lists the remote REPL connections available',
    action: function() {
      console.log('Connections:');
      __.each(session.connections, function(connection, index) {
        console.log('[' + index + ']');
      });

      this.displayPrompt();
    }
  },
  inspect: {
    help: 'Pretty prints the given object',
    action: function(obj) {
      console.log(cliff.inspect(obj));

      this.displayPrompt();
    }
  }
}

session.startRemoteRepl = function(connection) {
  var remote = new RemoteRepl(connection);
  this.replEval = __.bind(remote.eval, remote);
}

session.startMessageServer = function() {
  messageServer.listeners.push(this);
  messageServer.start();
}

session.connections = [];
session.onConnection = function(connection) {
  console.log('');
  console.log('New connection: [' + this.connections.length + ']');
  this.connections.push(connection);
  this.repl.displayPrompt();
}

session.replEvalWrapper = function(){
  this.replEval.apply(this, arguments);
}

session.origReplEval = session.replEval = function(code, context, file, cb) {
  var err, result;
  try {
    result = vm.runInContext(code, this.context, file);
  } catch (e) {
    err = e;
  }
  cb(err, result);
}
  
session.startRepl = function() {
  this.repl = repl.start('# ', null, __.bind(this.replEvalWrapper, this));
  this.context = this.repl.context;
  
  __.each(this.commands, function(command, name) {
    this.repl.defineCommand(name, command);
  }, this);
}

session.start = function() {
  this.startMessageServer();
  this.startRepl();
}

repl.writer = function(obj) {
  return inspect(obj);
}

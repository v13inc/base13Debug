var settings = require('./settings').conf;

var nodeRepl = require('repl');
var vm = require('vm');
var util = require('util');
var inspect = require('eyes').inspector(settings.eyes);
var __ = require('underscore');

var Repl = exports.Repl = function(connection, options) {
  __.extend(this.options, options);

  this.connection = connection;
  this.connection.addListener(this.messages, this);
}

var R = Repl.prototype;

R.options = {
  prompt: '> ',
  stream: null
}

R.messages = {
  run_response: function(message) {
    var data = message.data;
    var err;
    if(data.error) {
      err = data.error.message ? data.error.message : data.error;
    }

    this.replCallback(err, data.result);
  },
  log: function(message) {
    util.puts('\n');
    console.log(inspect(message.data, 'remote'));
  }
}

R.eval = function(code, context, file, callback) {
  this.replCallback = callback;
  this.connection.send('run', code);
}

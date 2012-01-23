// 
// debugClient.js
//
// Creates a connection with the debug server to allow remote debugging.
//
// Message protocol:
//  message format: {
//    message: <message_name>,
//    data: <message_data>,
//    response: false
//      - if true, data is a response to a previous message
//  }
//
//  message: run
//  data: <code string>
//  response data: <run response>
//    - run response: {
//        result: <value returned from 'code string'>,
//        error: <error object or null if no error>
//      }
//

var debugClient = namespace('debugClient');

var settings = namespace('settings');

debugClient.messages = {
  run: function(message) {
    var code = message.data;
    var result, error;

    try {
      result = eval(code);
    } catch(e) {
      error = e;
    }

    this.sendResponse('run', {
      result: result,
      error: error
    });
  }
}

debugClient.connect = function() {
  var self = this;

  this.socket = io.connect(settings.server.host);

  // attach message callbacks
  this.socket.on('msg', function(message) {
    var name = message.name;
    // dispatch
    var messageName = message.response? message.message + '_response' : message.message;
    if(self.messages[messageName]) {
      self.messages[messageName].call(self, message);
    } else {
      console.log('message callback not found, name: ' + messageName);
    }
  })
}

debugClient.sendResponse = function(messageName, data) {
  console.log('msg sent, name: ' + messageName + '_response, data: ' + data);
  this.socket.emit('msg', {
    message: messageName,
    data: data,
    response: true
  });
}

debugClient.connect();

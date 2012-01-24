exports.conf = {
  messageServer: {
    port: 8080
  },
  eyes: {
    styles: {                 // Styles applied to stdout
        all:     'cyan',      // Overall style applied to everything
        label:   'underline', // Inspection labels, like 'array' in `array: [1, 2, 3]`
        other:   'inverted',  // Objects which don't have a literal representation, such as functions
        key:     'bold',      // The keys in object literals, like 'a' in `{a: 1}`
        special: 'grey',      // null, undefined...
        string:  'green',
        number:  'magenta',
        bool:    'blue',      // true false
        regexp:  'green',     // /\d+/
    },
    stream: null,
    pretty: true,             // Indent object literals
    hideFunctions: false,
    showHidden: false,
    maxLength: 2048           // Truncate output if longer
  }    
}

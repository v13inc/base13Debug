var page = new WebPage();

var includes = [
  '../node_modules/jasmine/jasmine.js',
  '../node_modules/jasmine/jasmine-html.js',
  '../node_modules/jasmine/ConsoleReporter.js',
  'example.js'
]


var runnerPath = 'file://' + phantom.args[0];
console.log(runnerPath);

page.onConsoleMessage = function(message) {
  console.log(message);
}

page.open('about:blank', function(status) {
  console.log('status: ' + status);
  if(status != 'success') {
    console.log('Could not load page: ' + runnerPath);
    phantom.exit();
  }
  console.log('loading js');

  console.log('underscore: ');
  includes.forEach(function(include) {
    var status = page.injectJs(include);
    console.log('injecting: ' + include + ', status: ' + status);
  });

  page.evaluate(function() {
    var env = jasmine.getEnv();
    var reporter = new jasmine.ConsoleReporter(function(message) {
      console.log(message);
    });
    env.addReporter(reporter);
    env.execute();
  });
});

var page = new WebPage();

page.onConsoleMessage = function(msg) {
  console.log('!' + msg);
}

page.open('file:///Users/v13inc/projects/phantomjs/test.html', function(status) {
  console.log('opened', status);
  console.log(status);
});

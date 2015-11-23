var vm = require('vm');
var path = require('path');
var fs = require('fs')

var filename = path.resolve(__dirname, 'foo.js')
var filedata = fs.readFileSync(filename)

var fn = vm.runInThisContext(
  filedata,
  {filename: filename + '.transpiled'}
);

fn()
fn()
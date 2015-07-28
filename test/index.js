var test = require('tape')

test('basic require', function (t) {
  var require = module.require('../index.js')(module)
  require('./basic-require')(t)
})

test('only affects target module', function (t) {
  require('./only-in-root/es6/')(t)
})

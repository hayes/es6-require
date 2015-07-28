module.exports = function (t) {
  t.plan(7)
  var require = module.require('../../../index.js')(module)
  var obj = {}
  t.equal(require('./index.es6')(obj), obj)
  t.equal(require('../double.js')(5), 10)
  t.equal(require('./node_modules/foo')(obj), obj)

  var notFound
  try {
    notFound = require('../other.es6')
  } catch (err) {
    t.ok(err.message.match(/Unexpected token/))
  }
  t.equal(notFound)

  try {
    notFound = require('./node_modules/foo/bar.es6')
  } catch (err) {
    t.ok(err.message.match(/Unexpected token/))
  }
  t.equal(notFound)

  t.end()
}

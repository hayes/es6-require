module.exports = test

function test (t) {
  t.equal(require('./1'), 1)
  t.equal(require('./2'), 2)
  t.equal(require('./3'), 3)
  t.equal(require('./4.js'), 4)
  t.equal(require('./5.es6'), 5)
  t.equal(require('./6.jsx'), 6)
  t.equal(require('./7/index.js'), 7)
  t.equal(require('./8/index.es6'), 8)
  t.equal(require('./9/index.jsx'), 9)
  t.equal(require('./10'), 10)
  t.equal(require('./11'), 11)
  t.equal(require('./12'), 12)
  t.end()
}

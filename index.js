var Module = require('module')
var babel = require('babel')
var path = require('path')
var fs = require('fs')
var vm = require('vm')

module.exports = makeRequire

function makeRequire (original, _extensions, root) {
  var ES6Module = Object.create(Module)
  ES6Module._extensions = Object.create(Module._extensions)

  var extensions = _extensions || ['.es6', '.jsx']

  for (var i = 0; i < extensions.length; ++i) {
    ES6Module._extensions[extensions[i]] = true
  }

  require.main = process.mainModule
  require.cache = Module._cache
  require.resolve = resolve
  return require

  function resolve (req) {
    return ES6Module._resolveFilename(req, original)
  }

  function require (req) {
    if (!req || typeof req !== 'string') return original.require(req)
    try {
      var filename = resolve(req)
    } catch (err) {
      return original.require(req)
    }

    var ext = path.extname(filename)
    if (extensions.indexOf(ext) === -1) return original.require(req)

    var rootPath = root || path.dirname(original.filename)
    var relative = path.relative(rootPath, filename)
    if (filename[0] !== '/') return original.require(req)
    if (relative[0] === '.' || relative[0] === '/') return original.require(req)
    if (relative.indexOf('node_modules') !== -1) return original.require(req)

    var cachedModule = Module._cache[filename]
    if (cachedModule) return cachedModule.exports
    var module = new Module(filename, original)
    Module._cache[filename] = module
    module.filename = filename
    module.paths = Module._nodeModulePaths(path.dirname(filename))

    var hadException = true
    try {
      compile(module, filename, makeRequire(module, extensions, rootPath))
      hadException = false
    } finally {
      if (hadException) delete Module._cache[filename]
    }

    module.loaded = true
    return module.exports
  }
}

function compile (module, filename, require) {
  var dirname = path.dirname(filename)
  var content = fs.readFileSync(filename, 'utf8')
  var code = babel.transform(content, {optional: ['runtime']}).code
  var wrapper = wrap(code)
  var compiled = vm.runInThisContext(wrapper, {filename: filename})
  return compiled.call(module.exports, module.exports, require, module, filename, dirname)
}

function wrap (code) {
  return '0 || ' + new Function(
    'exports, require, module, __filename, __dirname',
    code
  ).toString()
}

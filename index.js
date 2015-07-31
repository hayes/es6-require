var Module = require('module')
var babel = require('babel')
var path = require('path')
var util = require('util')
var fs = require('fs')
var vm = require('vm')

module.exports = es6Require

function es6Require (rootModule, _options, _root) {
  var ES6Module = Object.create(Module)
  ES6Module._extensions = Object.create(Module._extensions)

  var options = util._extend({}, _options || {})
  var es6Extensions = options.extensions || ['.es6', '.jsx']
  var extensions = Object.keys(Module._extensions).concat(es6Extensions)
  var root = _root || path.dirname(rootModule.filename)
  var rootNodeModules = path.resolve(__dirname, 'node_modules')

  options.babel = util._extend({}, options.babel || {})

  if (options.babel.retainLines === undefined) options.babel.retainLines = true
  if (options.babel.optional === undefined) options.babel.optional = ['runtime']

  for (var i = 0; i < extensions.length; ++i) {
    ES6Module._extensions[extensions[i]] = compile
  }

  return makeRequire(rootModule, options)

  function makeRequire (original) {
    require.main = process.mainModule
    require.cache = Module._cache
    require.resolve = resolve

    var clonedModule = Object.create(original)
    clonedModule.paths = original.paths.concat(rootNodeModules)

    return require

    function resolve (req) {
      var prev = Module._extensions
      Module._extensions = ES6Module._extensions
      try {
        return ES6Module._resolveFilename(req, clonedModule)
      } finally {
        Module._extensions = prev
      }
    }

    function require (req) {
      if (!req || typeof req !== 'string') return clonedModule.require(req)
      try {
        var filename = resolve(req)
      } catch (err) {
        return clonedModule.require(req)
      }

      var relative = path.relative(root, filename)
      if (filename[0] !== '/') return clonedModule.require(req)
      if (relative[0] === '.' || relative[0] === '/') return clonedModule.require(req)
      if (relative.indexOf('node_modules') !== -1) return clonedModule.require(req)

      var cachedModule = Module._cache[filename]
      if (cachedModule) return cachedModule.exports
      var module = new Module(filename, clonedModule)
      Module._cache[filename] = module
      module.filename = filename
      module.paths = Module._nodeModulePaths(path.dirname(filename))

      var hadException = true
      try {
        compile(module, filename)
        hadException = false
      } finally {
        if (hadException) delete Module._cache[filename]
      }

      module.loaded = true
      return module.exports
    }
  }

  function compile (module, filename) {
    var require = makeRequire(module)
    var dirname = path.dirname(filename)
    var content = fs.readFileSync(filename, 'utf8')
    var ext = path.extname(filename)
    var code

    if (es6Extensions.indexOf(ext) !== -1) {
      code = babel.transform(content, options.babel).code
    } else {
      code = content
    }

    var wrapper = wrap(code)
    var compiled = vm.runInThisContext(wrapper, filename)
    return compiled.call(module.exports, module.exports, require, module, filename, dirname)
  }
}

function wrap (code) {
  return '0 || ' + new Function(
    'exports, require, module, __filename, __dirname',
    code
  ).toString()
}

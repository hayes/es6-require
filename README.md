# es6-require

require es6 modules without polluting global require.

This module allows you to require es6 (and jsx) files that are
part of your module.  Other non-es6 modules in your module or other
outside of your module will not be affected. Any es6 modules that
the module you required requires will also be wrapped.

The purpose for this library is to provide a runtime compile option
for babel that is acceptable to use in libraries. Use this module in
`index.js` to require your main es6 file, and set a browser key in your
package.json as well as a browserify transfrom to make sure your module
works in node, browserify, and webpack (the application will need to
provide a transformer for .es6 or .jsx extensions when using webpack)

## install
```
npm install es6-require
```

## Use
In an es5 js file
```
var require = module.require('es6-require')(module)
require('./my-module.es6')
```

## API

### `es6Require(module[, options[, root]])`
 * module (required instanceof Module): the module variable from the calling
   file
 * options (optional object): described in more detail below
 * root (option string): the file path to the root folder of the es6 module
   if not supplied, `__dirname` from the calling module will be used. Files
   outside this directory will not be transformed. any file in a node_modules
   directory inside inside this directory will also be ignored.

#### Options (may have any of the following keys)
  * extensions: an array of strings, each string should be a file extension
    (including the leading '.') to be compiled as es6/jsx.
  * babel: an options object passed to babel, see [babel docs][babel] for more details


[babel]: https://babeljs.io/docs/usage/options/

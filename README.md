# es6-require

require es6 modules without polluting global require.

This module allows you to require es6 (and jsx) files that are
part of your module.  Other non-es6 modules in your module or other
outside of your module will not be affected. Any es6 modules that
the module you required requres will also be wrapped.

The purpose for this library is to provide a runtime copile option
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
require('./my-es6-module')
```

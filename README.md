# rewrite-files

Rewrite file contents in-place.

[![NPM](https://nodei.co/npm/rewrite-files.png)](https://nodei.co/npm/rewrite-files/)

Use glob matching to discover a list of files, or specify them directly. Write a transformer function that receives
filenames and file contents, which can asynchronously indicate the new file contents when done.

This can be usefully paired with something like [falafel](https://www.npmjs.com/package/falafel) to parse JS into an
AST and rewrite code.

## Install

```sh
npm install --save rewrite-files
```

## Examples

```js
var rewriteFiles = require('rewrite-files');

function rewrite(fileName, contents, callback) {
  var newContents = '<wrap ' + contents + '>';
  callback(null, newContents);
}

exports.upgrade = function(next) {
  var basePath = config.get('webapp.js.src.basePath');
  var pattern = path.join(basePath, '**/*.js');
  rewriteFiles.withPattern(pattern, rewrite, function(err) {
    next(err ? (err.stack || err) : null);
  });
};
```

## Methods

### rewriteFiles

```js
rewriteFiles(files, transformer, callback);
```

- `files`: Array of filenames to operate on
- `tranformer`: Function
  - Called like: `transformer(fileName, fileContents, callback)`
  - `fileContents` is a string
  - Should call callback like: `callback(err, newContents)`
  - `newContents` should be a string
- `callback`: Function
  - Called like: `callback(err)`

### rewriteFiles.withPattern

```js
rewriteFiles.withPattern(pattern, transformer, callback);
```

- `pattern`: Glob pattern used to extract list of files
- `tranformer`: Function
  - Called like: `transformer(fileName, fileContents, callback)`
  - `fileContents` is a string
  - Should call `callback` like: `callback(err, newContents)`
  - `newContents` should be a string
- `callback`: Function
  - Called like: `callback(err)`

## License

MIT

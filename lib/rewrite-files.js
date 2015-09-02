'use strict'

var async = require('async');
var fs = require('fs');
var glob = require('glob');

function processOne(fileName, transform, callback) {
  var contents;

  function readFile(callback) {
    fs.readFile(fileName, function(err, buffer) {
      if (!err) {
        contents = buffer.toString();
      }
      callback(err);
    });
  }

  function rewrite(callback) {
    transform(fileName, contents, function(err, newContents) {
      if (!err) {
        contents = newContents;
      }
      callback(err);
    });
  }

  function writeFile(callback) {
    fs.writeFile(fileName, contents, callback);
  }

  async.series([readFile, rewrite, writeFile], callback);
}

function withPattern(filenamePattern, transform, callback) {
  if (typeof filenamePattern != 'string') {
    throw new Error('expected string as first argument');
  }
  withFiles(glob.sync(filenamePattern), transform, callback);
}

function withFiles(files, transform, callback) {
  if (!Array.isArray(files)) {
    throw new Error('expected array as first argument');
  }
  async.each(files, function(fileName, callback) {
    processOne(fileName, transform, callback);
  }, callback);
}

module.exports = withFiles;
module.exports.withPattern = withPattern;

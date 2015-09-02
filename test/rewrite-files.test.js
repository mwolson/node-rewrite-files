var expect = require('./lib/expect');
var rewire = require('rewire');
var sinon = require('sinon');

describe('rewrite-files module', function() {

  var globResults, readContents, fs, glob, rewriteFiles;

  function setup() {
    globResults = [];
    readContents = "";
    rewriteFiles = rewire('../lib/rewrite-files');

    fs = {
      readFile: sinon.spy(function(fileName, callback) {
        callback(null, readContents);
      }),
      writeFile: sinon.spy(function(fileName, contents, callback) {
        callback(null);
      })
    };
    rewriteFiles.__set__('fs', fs);

    glob = {
      sync: sinon.spy(function(filenamePattern) {
        return globResults;
      })
    };
    rewriteFiles.__set__('glob', glob);
  }

  beforeEach(setup);

  describe('- withFiles function', function() {
    describe('when files is not an array', function() {
      it('throws error', function() {
        var transform = sinon.spy();
        var afterTransform = sinon.spy();
        expect(function() {
          rewriteFiles('', transform, afterTransform);
        }).to.throw('expected array as first argument');
        expect(transform).not.to.be.called;
        expect(afterTransform).not.to.be.called;
      });
    });

    describe('with empty array', function() {
      it('does no file processing', function(done) {
        var transform = sinon.spy();
        rewriteFiles([], transform, function() {
          expect(transform).not.to.be.called;
          done();
        });
      });
    });

    describe('with array of one or more files', function() {
      it('does file processing', function(done) {
        globResults = ['filename'];
        readContents = 'read file contents';
        var writeContents = 'write file contents';
        var pattern = 'nope';
        var transform = sinon.spy(function(fileName, contents, callback) {
          callback(null, writeContents);
        });

        rewriteFiles(globResults, transform, function() {
          expect(glob.sync).not.to.be.called;

          expect(transform).to.be.calledOnce;
          expect(transform.args[0][0]).to.eq(globResults[0]);
          expect(transform.args[0][1]).to.eq(readContents);

          expect(fs.writeFile).to.be.calledOnce;
          expect(fs.writeFile.args[0][0]).to.eq(globResults[0]);
          expect(fs.writeFile.args[0][1]).to.eq(writeContents);
          done();
        });
      });
    });
  });

  describe('- withPattern function', function() {
    describe('when pattern is not a string', function() {
      it('throws error', function() {
        var transform = sinon.spy();
        var afterTransform = sinon.spy();
        expect(function() {
          rewriteFiles.withPattern([], transform, afterTransform);
        }).to.throw('expected string as first argument');
      });
    });

    describe('when pattern matches no files', function() {
      it('does no file processing', function(done) {
        var transform = sinon.spy();
        var pattern = 'nope';
        rewriteFiles.withPattern(pattern, transform, function() {
          expect(glob.sync).to.be.calledWith(pattern);
          expect(transform).not.to.be.called;
          done();
        });
      });
    });

    describe('when pattern matches one or more files', function() {
      it('does file processing', function(done) {
        globResults = ['filename'];
        readContents = 'read file contents';
        var writeContents = 'write file contents';
        var pattern = 'nope';
        var transform = sinon.spy(function(fileName, contents, callback) {
          callback(null, writeContents);
        });

        rewriteFiles.withPattern(pattern, transform, function() {
          expect(glob.sync).to.be.calledWith(pattern);

          expect(transform).to.be.calledOnce;
          expect(transform.args[0][0]).to.eq(globResults[0]);
          expect(transform.args[0][1]).to.eq(readContents);

          expect(fs.writeFile).to.be.calledOnce;
          expect(fs.writeFile.args[0][0]).to.eq(globResults[0]);
          expect(fs.writeFile.args[0][1]).to.eq(writeContents);
          done();
        });
      });
    });
  });
});

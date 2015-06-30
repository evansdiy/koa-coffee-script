var path = require('path');
var url = require('url');
var coffeeScript = require('coffee-script');
var updateSyntaxError = require('coffee-script/lib/coffee-script/helpers').updateSyntaxError;
var fs = require('co-fs');

module.exports = function(opt) {

  var pathname;

  if(typeof opt === 'string') {
    opt = {
      src: url.parse(opt).pathname
    };
  }

  if(!opt.src) {
    throw new Error('You should specify the src directory for koa-coffee-script');
  }

  return function*(next){
    yield compile(this.req, this.res, opt);
    yield next;
  };
};

function compile(req, res, opt) {

  var pathname = url.parse(req.url).pathname;
  var filePath, file, compiledFilePath, compiledFile;

  return function*() {
    if(/\.js$/.test(pathname)) {
      compiledFilePath = path.join(opt.src, pathname);
      filePath = compiledFilePath.replace(/\.js$/, '.coffee');

      try{
        file = yield fs.readFile(filePath, 'utf8');
      } catch(ex) {
        if(ex.code === 'ENOENT') {
          return;
        }
      }

      try{
        compiledFile = coffeeScript.compile(file);
      } catch(ex) {
        updateSyntaxError(ex, null, filePath);
        throw ex;
      }
      
      yield fs.writeFile(compiledFilePath, compiledFile);
    }
  }
}
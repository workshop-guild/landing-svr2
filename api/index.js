var express = require('express'),
    fs      = require('fs'),
    path    = require('path'),
    partialResponse = require('express-partial-response');

module.exports = function(en){ // pass in the nodeapp engine
  var db = en.db;
  var log = en.logger;

  var router = express.Router();

  router.use(function(req, res, next){
    req.en = en;
    next();
  });

  // filters json output using ?fields=...
  router.use(partialResponse());

  // walk the api directory and mount each modules' router
  var apiDir = __dirname;
  var versionRegex = /^v([0-9]+)$/g;
  var versionDirectories = fs.readdirSync(apiDir).filter(function(dir){
    return dir.match(versionRegex);
  });
  versionDirectories.forEach(function(v){
    var versionPath = path.join(apiDir, v);
    var modules = fs.readdirSync(versionPath);
    modules.forEach(function(modName){
      var modulePath = path.join(versionPath, modName);
      var stat = fs.statSync(modulePath);
      if ( stat && stat.isDirectory() ){
        var mountPath = '/' + v + '/' + modName;
        log.info('API - Mounting at ' + mountPath + ' from ' + modulePath);
        router.use(mountPath, require(modulePath));
      }
    });
  });

  return router;
};
var express = require('express'),
    fs      = require('fs'),
    path    = require('path');

module.exports = function(en){ // pass in the nodeapp engine
  var db = en.db;
  var log = en.logger;

  var router = express.Router();

  router.use(function(req, res, next){
    req.db = db;
    next();
  });

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
        console.log('Mounting ' + modName + ' from ' + modulePath);
        router.use('/' + modName, require(modulePath));
      }
    });
  });

  return router;
};
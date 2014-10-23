var express = require('express'),
    fs      = require('fs'),
    path    = require('path'),
    multiparty = require('multiparty');
    // partialResponse = require('express-partial-response');

module.exports = function(en){ // pass in the nodeapp engine
  var db = en.db;
  var log = en.logger;

  var router = express.Router();

  router.use(function(req, res, next){
    req.en = en;
    next();
  });

  var parsePostData = function(req, res, next){ // to support multipart/form-data
    if ( req.is('multipart/form-data') ){
      var form = new multiparty.Form({
          uploadDir: req.en.CONSTANTS.DATA_DIR
      });
      form.parse(req, function(err, fields, files){
        req.body = req.body || {};
        req.files = req.files || {};
        Object.keys(fields).forEach(function(key){
            req.body[key] = fields[key][0];
        });
        Object.keys(files).forEach(function(key){
            req.files[key] = files[key][0];
        });
        next();
      });
    } else {
      next();
    }
  };
  router.use(parsePostData);

  // filters json output using ?fields=...
  // router.use(partialResponse());

  var resource = require('./resource.js');

  var guilds = resource('guilds', { name: String });
  router.use('/v1/guilds', guilds);

  var users = resource('users', { name: String });
  // add in an images route for now
  users.get('/:username/images/:filename', function(req, res){
    var log = req.en.logger;
    var username = req.params.username;
    var filename = req.params.filename;
    var options = {
      root: req.en.CONSTANTS.DATA_DIR + '/' + username + '/'
    }
    res.sendfile(filename, options, function(err){
      if (err){
        res.status(400).send(err);
      } else {
        log.info('Sending ' + username + '\'s ' + ' image ' + filename);
      }
    });
  });
  router.use('/v1/users', users);

  // walk the api directory and mount each modules' router
  // var apiDir = __dirname;
  // var versionRegex = /^v([0-9]+)$/g;
  // var versionDirectories = fs.readdirSync(apiDir).filter(function(dir){
  //   return dir.match(versionRegex);
  // });
  // versionDirectories.forEach(function(v){
  //   var versionPath = path.join(apiDir, v);
  //   var modules = fs.readdirSync(versionPath);
  //   modules.forEach(function(modName){
  //     var modulePath = path.join(versionPath, modName);
  //     var stat = fs.statSync(modulePath);
  //     if ( stat && stat.isDirectory() ){
  //       var mountPath = '/' + v + '/' + modName;
  //       log.info('API - Mounting at ' + mountPath + ' from ' + modulePath);
  //       router.use(mountPath, require(modulePath));
  //     }
  //   });
  // });

  return router;
};
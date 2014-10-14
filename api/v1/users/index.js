var express = require('express');
var fs = require('fs');
var expressValidator = require('express-validator');

var router = express.Router();

var postDataValidator = expressValidator();

/**
 * @api {get} /users/:user_id Find
 * @apiName Find
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiParam {ObjectID} user_id User ID
 *
 * @apiSuccess {String} _id
 * @apiSuccess {String} username
 * @apiSuccess {String} firstname
 * @apiSuccess {String} lastname
 * @apiSuccess {String} role
 * @apiSuccess {String} avatarURL
 */
router.get('/:user_id', function(req, res){
  var id = ObjectID(req.params.user_id);
  req.en.db.collection('users').findOne({ _id: id }, function(err, result){
    res.status(200).json(result);
  });
});

/**
 * @api {get} /users FindAll
 * @apiName FindAll
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiSuccess {Object[]} users           List of users
 * @apiSuccess {String}   users._id
 * @apiSuccess {String}   users.username
 * @apiSuccess {String}   users.firstname
 * @apiSuccess {String}   users.lastname
 * @apiSuccess {String}   users.role
 * @apiSuccess {String}   users.avatarURL
 */
router.get('/', function(req, res){
  req.en.db.collection('users').find(/*{ query }, { options }*/).toArray(function(err, result){
    res.status(200).json(result);
  });
});

/**
 * @api {put} /users/:user_id Update
 * @apiName Update
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiParam {ObjectID} user_id User ID
 *
 * @apiSuccess {String} _id
 * @apiSuccess {String} username
 * @apiSuccess {String} firstname
 * @apiSuccess {String} lastname
 * @apiSuccess {String} role
 * @apiSuccess {String} avatarURL
 */
router.put('/:user_id', function(req, res){

  var id = ObjectID(req.params.user_id);
  var data = req.body;
  req.en.db.collection('users').update({ _id: id }, data, function(err, result){
    res.status(200).json(result);
  });
});

/**
 * @api {post} /users Create
 * @apiName Create
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiSuccess {String} _id
 * @apiSuccess {String} username
 * @apiSuccess {String} firstname
 * @apiSuccess {String} lastname
 * @apiSuccess {String} role
 * @apiSuccess {String} avatarURL
 */
router.post('/', postDataValidator, function(req, res){
  req.assert('email').isEmail();
  req.assert('username').notEmpty();
  req.assert('firstname').len(2, 20);
  req.assert('lastname').len(2, 20);

  var errors = req.validationErrors();
  if ( errors ){
    res.status(400).json({ errors: errors });
    return;
  } else {
    var data = req.body;
    var record = {
      _id: data.email,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      role: data.role || ''
    }
    var avatar = req.files.avatar;
    if ( avatar ){
      var tmpPath = avatar.path;
      var fileName = avatar.originalFilename;
      var userImageDir = req.en.CONSTANTS.DATA_DIR + '/' + record.username + '/';
      var filePath = userImageDir + fileName;
      if ( !fs.existsSync(userImageDir) ){
        fs.mkdirSync(userImageDir);
      }
      fs.renameSync(tmpPath, filePath);
      record.avatarURL = record.username + '/images/' + fileName;
    }
    req.en.db.collection('users').insert(record, { w: 1 }, function(err, result){
      res.status(201).json(result[0]);
    });
  }
});

/**
 * @api {delete} /users/:user_id Delete
 * @apiName Delete
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiParam {ObjectID} user_id User ID
 *
 * @apiSuccess {String} _id
 * @apiSuccess {String} username
 * @apiSuccess {String} firstname
 * @apiSuccess {String} lastname
 * @apiSuccess {String} role
 * @apiSuccess {String} avatarURL
 */
router.delete('/:user_id', function(req, res){
  req.en.db.collection('users').remove({ _id: 1 }, function(err, result){
    res.status(204).end();
  });
});

router.get('/:username/images/:filename', function(req, res){
  var log = req.en.logger;
  var username = req.params.username;
  var filename = req.params.filename;
  var options = {
    root: req.en.CONSTANTS.DATA_DIR + '/' + username + '/'
  }
  res.sendfile(filename, options, function(err){
    if (err){
      res.status(err.status).end();
    } else {
      log.info('Sending ' + username + '\'s ' + ' image ' + filename);
    }
  });
});

module.exports = router;
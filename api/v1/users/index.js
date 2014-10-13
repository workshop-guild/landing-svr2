var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var murmurhash = require('murmurhash');
var multiparty = require('multiparty');

var router = express.Router();

var parsePostData = function(req, res, next){ // to support multipart/form-data
  if ( req.method !== 'POST') next();
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
  }
};

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
function berp(){};
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
function burp(){}
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
router.post('/', parsePostData, function(req, res){
  // TODO: validate req.body
  var urlhash = murmurhash.v3(req.session.id);

  var data = req.body;
  var avatar = req.files.avatar;
  if ( avatar ){
    var tmpPath = avatar.path;
    var userImageDir = req.en.CONSTANTS.DATA_DIR + '/' + urlhash + '/';
    if ( !fs.existsSync(userImageDir) ){
      fs.mkdirSync(userImageDir);
    }
    var filePath = userImageDir + avatar.originalFilename;
    data.avatarURL = '/images/' + avatar.originalFilename;
    fs.rename(tmpPath, filePath, function(err){
      if (err){
        res.status(err.status).end();
      } else {
        req.en.db.collection('users').insert(data, function(err, result){
          res.status(201).json(result[0]);
        });
      }
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

module.exports = router;
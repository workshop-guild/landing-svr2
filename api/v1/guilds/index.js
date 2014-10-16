var express = require('express');
var fs = require('fs');
var expressValidator = require('express-validator');
var async = require('async');

var router = express.Router();

var postDataValidator = expressValidator();

var guildsCollection = 'guilds';

/**
 * @apiDefineStructure GuildID
 * @apiParam {Number} guild_id Guild ID
 */

/**
 * @apiDefineSuccessStructure GuildResourceObject
 * @apiSuccess {String} guild.id   Guild ID
 * @apiSuccess {String} guild.desc Short description
 * @apiSuccess {String} guild.link Link to the guild's page
 * @apiSuccess {String} guild.name Guild name
 * @apiSuccess {String} guild.page Markdown to use for the guild's home page
 * @apiSuccess {String} guild.pic  Link to the guild's index picture
 */

/**
 * @api {get} /guilds/:guild_id Find
 * @apiName Find
 * @apiGroup Guilds
 * @apiVersion 0.1.0
 *
 * @apiStructure GuildID
 *
 * @apiSuccess {Object} guilds A guild resource object
 * @apiSuccessStructure GuildResourceObject
 */
router.get('/:guild_id', function(req, res){
  var id = req.params.guild_id;
  var collection = req.en.db.collection(guildsCollection);
  collection.findOne({ _id: id }, function(err, result){
    if (err){
      res.status(400).send(err);
    } else {
      result.id = result._id;
      delete result._id;
      res.status(200).json({ 'guilds': result });
    }
  });
});

/**
 * @api {get} /guilds FindAll
 * @apiName FindAll
 * @apiGroup Guilds
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Object[]} guilds List of guild resource objects
 * @apiSuccessStructure GuildResourceObject
 */
router.get('/', function(req, res){
  var collection = req.en.db.collection(guildsCollection);
  // find(query, options)
  collection.find(/* {}, { skip:1, limit:1, fields: {_id: false} }*/).toArray(function(err, result){
    if (err){
      res.status(400).send(err);
    } else {
      result.forEach(function(doc){
        // (!) temporarily transform id, and remove _id, until a proper _id structure is decided
        doc.id = doc._id;
        delete doc._id;
      });
      res.status(200).json({ 'guilds': result });
    }
  });
});

/**
 * @api {post} /guilds Create
 * @apiName Create
 * @apiGroup Guilds
 * @apiVersion 0.1.0
 *
 * @apiParam {Number} id
 *
 * @apiExample Create single resource
 * {
 *   "guilds": {
 *     "id": "7",
 *     "name": "Workshop Guild",
 *     "desc": "The most useful guild.",
 *     "link": "http://workshop-guild.github.io",
 *     "page": "",
 *     "pic": "http://placehold.it/300x300"
 *   }
 * }
 * @apiExample Create multiple resources
 * {
 *   "guilds": [{
 *     "id": "7",
 *     "name": "Workshop Guild",
 *     "desc": "The most useful guild.",
 *     "link": "http://workshop-guild.github.io",
 *     "page": "",
 *     "pic": "http://placehold.it/300x300"
 *   },{
 *     "id": "8",
 *     "name": "Laundry Guild",
 *     "desc": "The next most useful guild.",
 *     "link": "",
 *     "page": "",
 *     "pic": "http://placehold.it/300x300"
 *   }]
 * }
 *
 *
 * @apiSuccessExample Single resource created
 * HTTP/1.1 200 OK
 * {
 *   "guilds": {
 *     "id": "7",
 *     "name": "Workshop Guild",
 *     "desc": "The most useful guild.",
 *     "link": "http://workshop-guild.github.io",
 *     "page": "",
 *     "pic": "http://placehold.it/300x300"
 *   }
 * }
 *
 * @apiSuccessExample Multiple resources created
 * HTTP/1.1 200 OK
 * {
 *   "guilds": [{
 *     "id": "7",
 *     "name": "Workshop Guild",
 *     "desc": "The most useful guild.",
 *     "link": "http://workshop-guild.github.io",
 *     "page": "",
 *     "pic": "http://placehold.it/300x300"
 *   },{
 *     "id": "8",
 *     "name": "Laundry Guild",
 *     "desc": "The next most useful guild.",
 *     "link": "",
 *     "page": "",
 *     "pic": "http://placehold.it/300x300"
 *   }]
 * }
 *
 * @apiSuccessStructure GuildResourceObject
 */
// this route is still WIP, it is currently taking a multipart/form-data,
// should use application/json or application.vnd.api+json
// I suppose file uploads should be done separately, and then file metadata
// gets associated here?
router.post('/', postDataValidator, function(req, res){
  // TODO(Leon): fix _id, validate post data
  var data = req.body['guilds'];
  data = JSON.parse(data); // this isn't json, its a string of json
  if (data.constructor && data.constructor === {}.constructor){ // single resource
    data = [data];
  }
  if (Array.isArray(data)){ // multiple resource
    data.forEach(function(resource){
      resource._id = resource.id;
      delete resource.id;
    });
  }
  // TODO(Leon): check for multiple resources
  var collection = req.en.db.collection(guildsCollection);
  collection.insertMany(data, function(err, result){
    if (err) {
      // TODO(Leon): should parse err and let it make sense to API consumer
      res.status(400).send(err);
    } else {
      if (result.insertedCount === data.length){
        data.forEach(function(resource){
          resource.id = resource._id;
          delete resource._id;
        });
        res.status(201).json({ 'guilds': data });
      } else {
        res.status(400).end();
      }
    }
  });
});

// TODO(Leon): implement bulk update
router.put('/bulk', function(req, res){
  // the following is an incomplete implementation
  var data = req.body['guilds'];
  // if (ids.length === 1){ // single resource
  //   data = [data];
  // }
  var collection = req.en.db.collection(guildsCollection);
  var bulkOp = collection.initializeUnorderedBulkOp({useLegacyOps:true});
  data.forEach(function(datum){
    var id = datum.id;
    delete datum.id;
    bulkOp.find({ _id: id }).updateOne({ $set: datum });
  });
  bulkOp.execute({ w: 1 }, function(err, result){
    if (err){
      res.status(400).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

/**
 * @api {put} /guilds/:guild_id Update
 * @apiName Update
 * @apiGroup Guilds
 * @apiVersion 0.1.0
 *
 * @apiStructure GuildID
 *
 * @apiSuccess {Object} guilds A guild resource object
 * @apiSuccessStructure GuildResourceObject
 */
router.put('/:guild_id', postDataValidator, function(req, res){
  // TODO(Leon): fix _id, validate post data
  var data = req.body['guild'];
  var id = req.params.guild_id;
  var collection = req.en.db.collection(guildsCollection);
  collection.findAndModify({ _id: id }, [], { $set: data }, { w: 1, new: true }, function(err, result){
    if (err){
      res.status(400).send(err);
    } else {
      var json = result.value;
      json.id = json._id;
      delete json._id;
      res.status(200).json({ 'guilds': json });
    }
  });
});

router.delete('/bulk', function(req, res){
  var data = req.body['guilds']; // ids of resources to remove
  var collection = req.en.db.collection(guildsCollection)
  var bulkOp = collection.initializeUnorderedBulkOp({useLegacyOps:true});
  data.forEach(function(resource_id){
      bulkOp.find({ _id: resource_id }).remove({ _id: resource_id });
    });
    bulkOp.execute({ w: 1 }, function(err, result){
      if (err){
        res.status(400).send(err);
      } else {
        res.status(200).send({ 'guilds': data/*, 'debug': result */ });
      }
    });
});

/**
 * @api {delete} /guilds/:guild_id Delete
 * @apiName Delete
 * @apiGroup Guilds
 * @apiVersion 0.1.0
 *
 * @apiStructure GuildID
 */
router.delete('/:guild_id', function(req, res){
  // TODO: validate this action
  var id = req.params.guild_id;
  var collection = req.en.db.collection(guildsCollection);
  collection.removeOne({ _id: id }, function(err, result){
    if (err){
      res.status(400).send(err);
    } else {
      res.status(204).end();
    }
  });
});

module.exports = router;
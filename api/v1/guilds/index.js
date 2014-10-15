var express = require('express');
var fs = require('fs');
var expressValidator = require('express-validator');

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
 * @apiStructure GuildID
 *
 * @apiSuccess {Object} guilds A guild resource object
 * @apiSuccessStructure GuildResourceObject
 */
router.post('/', postDataValidator, function(req, res){
  // TODO(Leon): fix _id, validate post data
  var data = req.body;
  var collection = req.en.db.collection(guildsCollection);
  collection.insertOne(data, function(err, result){
    if (err) {
      // TODO(Leon): should parse err and let it make sense to API consumer
      res.status(400).send(err);
    } else {
      if (result.insertedCount === 1){
        // TODO(Leon): Client should not be passing _id field
        data.id = data._id;
        delete data._id;
        res.status(201).json({ 'guilds': data });
      } else {
        res.status(400).end();
      }
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
  var data = req.body;
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
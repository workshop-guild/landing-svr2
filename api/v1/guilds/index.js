var express = require('express');
var fs = require('fs');
var expressValidator = require('express-validator');

var router = express.Router();

var postDataValidator = expressValidator();

var guildsCollection = 'guilds';

// Find
router.get('/:guild_id', function(req, res){
  var id = req.params.guild_id;
  var collection = req.en.db.collection(guildsCollection);
  collection.findOne({ _id: id }, function(err, result){
    if (err){
      res.status(400).send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

// FindAll
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
      res.status(200).json({ 'guild': result });
    }
  });
});

// Create
router.post('/', postDataValidator, function(req, res){
  // TODO(Leon): fix _id, validate post data
  var data = req.body;
  var collection = req.en.db.collection(guildsCollection);
  collection.insertOne(data, function(err, result){
    if (err) {
      // TODO(Leon): should parse err and let it make sense to API consumer
      res.status(400).send(err);
    } else {
      res.status(201).json(result);
    }
  });
});

// Update
router.put('/:guild_id', postDataValidator, function(req, res){
  // TODO(Leon): fix _id, validate post data
  var data = req.body;
  var id = req.params.guild_id;
  var collection = req.en.db.collection(guildsCollection);
  collection.findAndModify({ _id: id }, [], { $set: data }, { w: 1, new: true }, function(err, result){
    if (err){
      res.status(400).send(err);
    } else {
      res.status(200).json(result.value);
    }
  });
});

// Delete
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
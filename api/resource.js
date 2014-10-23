// middleware for creating resources
var express = require('express');
var fs = require('fs');
var expressValidator = require('express-validator');

var postDataValidator = expressValidator();

var factory = function(resource, fields){
  fields = fields || {};

  var router = express.Router();

  router.get('/:id', function(req, res){
    var id = req.params.id;
    var collection = req.en.db.collection(resource);
    collection.findOne({ _id: id }, function(err, result){
      if (err){
        res.status(400).send(err);
      } else {
        result.id = result._id;
        delete result._id;
        var json = {};
        json[resource] = result;
        res.status(200).json(json);
      }
    });
  });

  router.get('/', function(req, res){
    var collection = req.en.db.collection(resource);
    collection.find(/* {}, { skip:1, limit:1, fields: {_id: false} }*/).toArray(function(err, result){
      if (err){
        res.status(400).send(err);
      } else {
        result.forEach(function(doc){
          // (!) temporarily transform id, and remove _id, until a proper _id structure is decided
          doc.id = doc._id;
          delete doc._id;
        });
        var json = {};
        json[resource] = result;
        res.status(200).json(json);
      }
    });
  });

  router.post('/', postDataValidator, function(req, res){
    // TODO(Leon): fix _id, validate post data
    var data = req.body[resource];
    data = JSON.parse(data); // this isn't json, its a string of json
    if (data.constructor && data.constructor === {}.constructor){ // single resource
      data = [data];
    }
    if (Array.isArray(data)){ // multiple resource
      data.forEach(function(datum){
        datum._id = datum.id;
        delete datum.id;
      });
    }
    // TODO(Leon): check for multiple resources
    var collection = req.en.db.collection(resource);
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
          var json = {};
          json[resource] = data;
          res.status(201).json(json);
        } else {
          res.status(400).end();
        }
      }
    });
  });

  // TODO(Leon): implement bulk update
  router.put('/bulk', function(req, res){
    // the following is an incomplete implementation
    var data = req.body[resource];
    // if (ids.length === 1){ // single resource
    //   data = [data];
    // }
    var collection = req.en.db.collection(resource);
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

  router.put('/:id', postDataValidator, function(req, res){
    // TODO(Leon): fix _id, validate post data
    var data = req.body[resource]; // eh.
    var id = req.params.guild_id;
    var collection = req.en.db.collection(resource);
    collection.findAndModify({ _id: id }, [], { $set: data }, { w: 1, new: true }, function(err, result){
      if (err){
        res.status(400).send(err);
      } else {
        result.value.id = result.value._id;
        delete result.value._id;
        var json = {};
        json[resource] = result.value;
        res.status(200).json(json);
      }
    });
  });

  router.delete('/bulk', function(req, res){
    var data = req.body[resource]; // ids of resources to remove
    var collection = req.en.db.collection(resource)
    var bulkOp = collection.initializeUnorderedBulkOp({useLegacyOps:true});
    data.forEach(function(resource_id){
        bulkOp.find({ _id: resource_id }).remove({ _id: resource_id });
      });
      bulkOp.execute({ w: 1 }, function(err, result){
        if (err){
          res.status(400).send(err);
        } else {
          var json = {};
          json[resource] = data;
          // json['debug'] = result;
          res.status(200).send(json);
        }
      });
  });

  router.delete('/:id', function(req, res){
    // TODO: validate this action
    var id = req.params.id;
    var collection = req.en.db.collection(resource);
    collection.removeOne({ _id: id }, function(err, result){
      if (err){
        res.status(400).send(err);
      } else {
        res.status(204).end();
      }
    });
  });

  return router;
};

module.exports = factory;
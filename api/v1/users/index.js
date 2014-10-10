var express = require('express');
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();

// Find
router.get('/:user_id', function(req, res){
  var id = ObjectID(req.params.user_id);
  req.db.collection('users').findOne({ _id: id }, function(err, result){
    res.status(200).json(result);
  });
});

// Find All
router.get('/', function(req, res){
  req.db.collection('users').find(/*{ query }, { options }*/).toArray(function(err, result){
    res.status(200).json(result);
  });
});

// Update
router.put('/:user_id', function(req, res){
  var id = ObjectID(req.params.user_id);
  var data = req.body;
  req.db.collection('users').update({ _id: id }, data, function(err, result){
    res.status(200).json(result);
  });
});

// Create
router.post('/', function(req, res){
  // TODO: validate req.body
  var data = req.body;
  req.db.collection('users').insert(data, function(err, result){
    res.status(201).json(result[0]);
  });
});

// Delete
router.delete('/:user_id', function(req, res){
  req.db.collection('users').remove({ _id: 1 }, function(err, result){
    res.status(204).end();
  });
});

module.exports = router;
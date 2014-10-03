var express = require('express');

var router = express.Router();

// GET
router.get('/read', function(req, res){
  res.status(200).json({ json: 'read' });
});

// POST
router.post('/create', function(req, res){
  res.status(201).json({ json: 'create' });
});

router.post('/update', function(req, res){
  res.status(200).json({ json: 'update' });
});

router.post('/delete', function(req, res){
  res.status(204).send();
});

// WRITE TO DB
router.post('/create_entity', function(req, res){
  req.db.collection('example').insert({ _id: 1, test: 'entity_created' }, function(err, docs){
    res.status(201).send(docs);
  });
});

module.exports = router;
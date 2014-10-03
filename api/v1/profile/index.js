var express = require('express');

var router = express.Router();

router.get('/me', function(req, res, next){
  res.status(200).send('ok');
});

router.get('/:user_id', function(req, res, next){
  res.status(200).send(req.params.user_id);
});

router.post('/update', function(req, res, next){

});

router.post('/create', function(req, res, next){

});

module.exports = router;
function ContentHandler(en) {
"use strict";
var crypto = require('crypto');
    
    
    //---- Private -----//
    var app = en.app;
    var db  = en.db;
    var log = en.logger;
    var engine = en;

    log.debug('new ContentHandler');

    function _saltedhash(seed, msg) {
        var mid_len = Math.ceil(seed.length/2);
        var salt1 = seed.slice(0, mid_len);
        var salt2 = seed.slice(mid_len, seed.length);
        var combined = salt1 + msg + salt2;     
        log.debug('_saltedhash: ' + combined);
        return crypto.createHash('md5').update(combined).digest('hex');
    }

    this.register = function(req, res) {
        log.info(req.ips);   
        log.info(req.body);    
        log.info('Registering New User');

        var session = req.session;

        var post = req.body;
        var players = db.collection('players');

        var email     = post['email'];
        var password  = post['password'];

        var player = { 
            '_id' : email,
            'password' : _saltedhash(email,password)    
        };

        players.insert( player, { w : 1 }, function(err, document) {
            if (err) {
                log.info('error in registering profile: ' + err);   
                res.status(en.HTTP_CODE.FORBIDDEN).send({'status' : en.STATUS_CODE.ERROR, 'errorno' : err});
            }
            else {
              log.debug(document[0]);
              res.send({'email' : email, 'status' : en.STATUS_CODE.OK});
            }
        });           

    }

    this.login = function (req,res) {
        
        console.log('Login');
   
        var players = db.collection('players');
        var client_ip = req.headers['x-forwarded-for'] || 
                        req.connection.remoteAddress;

        var post = req.body;

        var email    = post.email;
        var password = post.password;
        var session = req.session;

        var hashed_pass = _saltedhash(email, password);
        
        console.log('ip ' + client_ip);
        log.info('user ip: ' + client_ip);
        log.info('--post body--');
        log.info(post);

        //var hash = crypto.createHash('md5').update(password).digest('hex');

        var query = {
            '_id' : email
        };

        var fields = {
            'id_' : 1,
            'password' : 1
        };

        console.log(password);

        players.findOne( query, fields, function (err, doc) {

            

            if (err) return res.status(500).send({'status' : en.STATUS_CODE.ERROR, 'errorno' : err})

            if (!doc) return res.status(404).send({'status' : en.STATUS_CODE.ERROR, 'errorno' : 'user not found or wrong credentials'});

            if (doc.password != hashed_pass) {
                console.log(doc);
                res.status(401).send({'status' : en.STATUS_CODE.ERROR, 'errorno' : 'wrong password'});
            }
            else {           
                var lastseen = new Date();

                session.email    =  email;
                session.lastseen = lastseen;
                res.send({ 
                    'email'  : email,
                    'lastseen' : lastseen,
                    'status' : en.STATUS_CODE.OK
                });                     

                players.update(
                    {'_id' : email}, 
                    { $set : { 'lastseen' : lastseen } }, 
                    function(err) {
                        if (err) return console.log('error setting lastseen');
                        console.log('updated lastseen for ' + email);
                });
            }
        });    
    }

        
}

module.exports = ContentHandler;

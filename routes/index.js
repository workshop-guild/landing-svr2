var Content = require('./content');

var urls = require('../urls.json');

module.exports = exports = function(en) {
"use strict";
    var contentHandler = new Content(en);

    var db  = en.db;
    var app = en.app;
    var log = en.logger;

    /* CHAT URL */
    app.get('/chatapi', function(req, res, next) {
        res.send(en.CONSTANTS.WEBSOCKET_URL);
    });

    app.get('/getsession', function(req, res, next) {
        res.send(req.session);
    });

    app.get('/killsession', function(req, res, next) {
        req.session.destroy(function(err) {
            if (err) {
                return res.status(en.HTTP_CODE.ERROR)
                .send({'status' : en.STATUS_CODE.ERROR});
            }
            res.send({'status' : en.STATUS_CODE.OK});
        });
    });

    app.get('/fakesession', function(req, res, next) {
        var sess = req.session;

        if (!sess.visits) {
            sess.visits = 1;
            sess.username = 'fakeuser';
            sess.is_auth = true;
        }
        else {
            sess.visits += 1;
        }

        //en.logger.debug(sess.visits);
        console.log(sess);

        res.send(sess);
    });

    // console.log(contentHandler);

    app.post('/login', contentHandler.login);
    app.post('/register', contentHandler.register);
    app.post('/upload', contentHandler.upload);

    app.get('/navigate/:item', function(req, res){
        console.log(req.param('item'));
        var redir = urls[req.param('item')];
        if ( redir ){
            res.status(en.HTTP_CODE.OK).redirect(redir);
        }
        res.status(en.HTTP_CODE.NOT_FOUND).send('404');
    });

    // mount the API router
    var api = require('../api')(en);
    app.use('/api', api);
};

var Content = require('./content');  

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
    
    console.log(contentHandler);
    
    app.post('/login', contentHandler.login);
    app.post('/register', contentHandler.register);
};
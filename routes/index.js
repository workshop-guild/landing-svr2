
module.exports = exports = function(en) {

    /* CHAT URL */
    en.app.get('/chatapi', function(req, res, next) {
        res.send(en.CONSTANTS.WEBSOCKET_URL);
    });
        
    en.app.get('/fakesession', function(req, res, next) {
        
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
};
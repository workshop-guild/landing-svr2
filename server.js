#!/bin/env node
//-- NodeLibs --//
var fs = require('fs'),
    express = require('express'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    http = require('http'),
    mongodb = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'), // logging for express
    moment = require('moment'),
    multiparty = require('multiparty'),
    murmurhash = require('murmurhash'), // Generating user hash for url
    crypto = require('crypto'),
    async = require('async'),
    Promise = require('promise'),
    redis  = require("redis"),
    uuid = require('node-uuid'),
    socketIO = require('socket.io');

//-- local libs --//
var SERVER_ENV = require(__dirname + '/env.json'),
    routes = require(__dirname + '/routes');

var app = express();

var ipaddress  = process.env.OPENSHIFT_NODEJS_IP     || SERVER_ENV.web_url;
var port       = process.env.OPENSHIFT_NODEJS_PORT   || SERVER_ENV.web_port;
var redis_host = process.env.OPENSHIFT_REDIS_DB_HOST || SERVER_ENV.redis_host;
var redis_port = process.env.OPENSHIFT_REDIS_DB_PORT || SERVER_ENV.redis_port;
var redis_pwd  = process.env.OPENSHIFT_REDIS_DB_PASSWORD;

var data_dir   = process.env.OPENSHIFT_DATA_DIR || __dirname + '/data';
var PROFILE_URL_ROOT   = '/profile';
var SERVER_PUBLIC_ADDR = 'http://' + SERVER_ENV.web_url + ':' + port;
var WEBSOCKET_URL      = 'http://' + SERVER_ENV.web_url + ':' + SERVER_ENV.websock_port;

var URL_ROOT = '/';
var DATA_URL =  URL_ROOT + 'data';
var VIEWS_DIR = __dirname + '/views';
var SESSION_SECRET = 'xx==abyss==xx';

var CONSTANTS = {
    SERVER_IP   : ipaddress,
    SERVER_PORT : port,
    REDIS_HOST  : redis_host,
    REDIS_PWD   : redis_pwd,
    DATA_DIR    : data_dir,
    PROFILE_URL_ROOT : PROFILE_URL_ROOT,
    SERVER_PUBLIC_ADDR : SERVER_PUBLIC_ADDR,
    WEBSOCKET_URL : WEBSOCKET_URL,
    VIEWS_DIR : VIEWS_DIR,
    URL_ROOT : URL_ROOT,
    DATA_URL : DATA_URL
};

var HTTP_CODE = {
    BAD_REQUEST  : 400,
    UNAUTHORIZED : 401,
    FORBIDDEN    : 403,
    NOT_FOUND    : 404,
    ERROR        : 500
}

var STATUS_CODE = {
    OK    : 0,
    ERROR : 1
};

var ERROR_CODE = {
    OK : 0,
    UNAUTHORIZE : 1001
};

function Timestamp()
{
    return moment().format("YYYY-MM-DD HH:mm:ss");
}

function parseSessionID(cookie) {
    var items = cookie.split(' ');
    for (var i in items) {
        var decoded   = unescape(items[i]);
        var index = decoded.indexOf('connect.sid=s:');
        if ( index != -1) {
            var signedStr = decoded.substring(index + 'connect.sid='.length, decoded.length);
            console.log('signed: ' + signedStr);
            return cookieParser.signedCookie(signedStr, SESSION_SECRET)
        }
    }
}


var Logger = (function _CreateLogger() {

    function toJson(msg) {
        if ( typeof msg === 'object' ) {
            return JSON.stringify(msg, undefined, 2);
        }
        return msg;
    }

    return {
        info : function (msg) {
            console.log("[%s] [INFO] %s", Timestamp(), toJson(msg));
        },
        debug : function (msg) {
            console.log("[%s] [DEBUG] %s", Timestamp(), toJson(msg));
        },
        warn : function (msg) {
            console.log("[%s] [WARNING] %s", Timestamp(), toJson(msg));
        },
        error : function (msg) {
            console.log("[%s] [ERROR] %s", Timestamp(), toJson(msg));
        },
    };

})();

(function _ConnectDB () {

    var engine = {};

    engine.CONSTANTS    = CONSTANTS;
    engine.STATUS_CODE = STATUS_CODE;
    engine.HTTP_CODE    = HTTP_CODE;

    engine.parseSessionID = parseSessionID;

    return new Promise(function ( ok, fail ) {
        mongodb.connect(SERVER_ENV.db_url, function(err, db) {

            if (err) {
                Logger.error('Error connecting to DB');
                return fail(err);
            }

            engine.db = db;
            engine.logger = Logger;

            ok(engine);
        });
    });
})()
.then(function _HTTPListen(engine) {
    Logger.info('connected to db');

    return new Promise( function (ok, fail) {
        var server = http.createServer(app).listen(port,ipaddress, function(err) {

            if (err) return console.log('Error in startin server: ' + err);
            Logger.info('Node Started and listening on ' +
                server.address().address + ':' +
                server.address().port);
        });

        engine.app    = app;
        engine.server = server;

        ok(engine);
    });
})
.then( function _ConnectRedisSub(engine) {
    return new Promise( function (ok, fail) {
        var clientSub   = redis.createClient(redis_port, redis_host, {});
        if (redis_host != 'localhost') {
            clientSub.auth(redis_pwd, function(err) {
                Logger.error(err);
            });
        }
        clientSub.on('ready', function() {
            Logger.info('redis_sub connected');
            engine.redis_sub  = clientSub;
            ok(engine);
        });
    });
})
.then( function _ConnectRedisSub2(engine) {
    return new Promise( function( ok, fail ) {
        var redisClient = redis.createClient(redis_port, redis_host, {});
        if (redis_host != 'localhost') {
            redisClient.auth(redis_pwd, function(err) {
                Logger.error(err);
            });
        }
        redisClient.on('ready', function() {
            Logger.info('redis_main connected');
            engine.redis_main  = redisClient;
            ok(engine);
        });
    });
})
.then( function _App(en) {

    return new Promise( function( ok, fail ) {
        var app = en.app;

        Logger.info('Setting up statics and app.use');

        app.set('trust proxy', true);

        app.use(URL_ROOT, express.static(VIEWS_DIR));
        app.use(DATA_URL, express.static(data_dir));

        // POST middleware
        app.use(bodyParser.json());       // to support JSON-encoded bodies
        app.use(bodyParser.urlencoded()); // to support URL-encoded bodies


        // Session Middleware
        app.use(session({
            store: new RedisStore({host : redis_host, port: redis_port})
            , secret: SESSION_SECRET
        }));

        // Set up session_id on request
        app.use(function (req, res, next) {
            if (!req.session) {
                Logger.error('Redis Session Not Found!');
            }

            req.session.id = en.parseSessionID(req.headers.cookie);
            next();
        });

        ok(en);
    });

})
.then( function _Main(en) {

    Logger.info('Starting Main');

    en.loadSession = en.redis_main.get;

    routes(en);

    //en.redis_main.flushall();
    en.redis_main.set('online', 0);

    en.redis_sub.subscribe('global');
    en.redis_sub.subscribe('news');


    en.redis_main.on("error", function (err) {
        Logger.error("redis_main Error " + err);
    });

    en.redis_sub.on("error", function (err) {
        Logger.error("redis_sub Error " + err);
    });

    en.redis_sub.on('message', function(channel, msg) {
        Logger.debug('from ' + channel + " > " + msg);
    });

    en.redis_sub.on('subscribe', function (channel, count) {
        Logger.info('subscribed to ' + channel);
        Logger.info('total: ' + count);

        en.redis_main.publish(channel, channel + ' is live');
    });


    // Bind Websocket Events
    var io = socketIO(en.server);

    en.io = io;

    // Create and Store Session CookieID
    io.use(function(socket, next) {
        Logger.debug('-------io handshake-----------');
        var sessionID = parseSessionID(socket.request.headers.cookie);
        console.log(socket.request.headers);
        socket.session_id = sessionID;
        next();
    });


    io.on('connection', function(socket){

        console.log('Socket SesssionID: ' + socket.session_id);

        var userid = murmurhash.v3(socket.id);
        var username = 'agent-' + userid;
        Logger.debug('User ' + userid + ' connected');

        en.redis_main.incr('online');
        io.sockets.emit('msg', { date : new Date, name : 'Server', msg: username + ' joined' });
        socket.on('msg', function(msg) {
            Logger.debug('msg: ' + msg);

            var now = new Date;

            socket.emit('msg', { date: now, name : 'Myself', msg: msg });
            socket.broadcast.emit('msg', { date: now, name : username, msg: msg });
        });

        socket.on('disconnect', function(){
            Logger.debug(username + ' disconnected');
            io.sockets.emit('msg', { date: new Date, name : username, msg: 'cowardly left the room' });

            en.redis_main.decr('online');
        });
    });


    // Bind Game Loop

}); // end of main




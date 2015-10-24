// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8000; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var demo = require('eu-demo');

demo.printLog();

var bunyan = require('bunyan'),
    bunyantcp = require('bunyan-logstash-tcp');

var log = bunyan.createLogger({
    name: 'example',
    serializers: bunyan.stdSerializers,
    streams: [{
        level: 'debug',
        stream: process.stdout
    },{
        level: 'debug',
        type: "raw",
        stream: bunyantcp.createStream({
            host: '55.55.55.5',
            port: 5000
        })
    }],
    level: 'debug'
});

log.debug('Salam Orxan debug');
log.error('Sagol Orxan error');


//logger
var bunyan      = require('bunyan');
var bunyanTcp   = require('bunyan-logstash-tcp');

var log = bunyan.createLogger({
    name: 'myLogger',
    serializers: bunyan.stdSerializers,
    streams: [
        {
            level: 'debug',
            type: 'raw',
            stream: (bunyanTcp.createStream({
                host: '172.17.42.1',
                port: 9998,
                max_connect_retries: -1, // Don't give up on reconnecting
                retry_interval: 1000     // Wait 1s between reconnect attempts
            }))
        }]
});

log.info("Orxans log by bunyan from docker");

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/bower', express.static(__dirname + '/bower_components/'));

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

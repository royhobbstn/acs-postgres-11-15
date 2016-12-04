//MICROSERVICES for CensusAPI

var express = require('express');
var app = express();
var pg = require('pg');
var csv = require('express-csv');

var conString = "postgres://codemog:demography@gis.dola.colorado.gov:5432/";

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');

    next();
}

app.use(allowCrossDomain);

require('./easyapi/meta.js')(app, pg, conString);
require('./easyapi/demog.js')(app, pg, csv, conString);
require('./easyapi/geojson.js')(app, pg, csv, conString);


var server = app.listen(4002, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://', host, port);
});
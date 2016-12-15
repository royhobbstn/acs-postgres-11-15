#! /usr/bin/env node
"use strict";


console.log("acs 11-15 5yr");


var request = require("request");
var fs = require("fs");
var mkdirp = require("mkdirp");
var unzip = require("unzip");

var EventEmitterG = require("events").EventEmitter;
var filesEEG = new EventEmitterG();


var winston = require("winston");

// setup logfile
try {
    fs.unlinkSync("somefile.log");
} catch (e) {
    if (e) {
        console.log("logfile doesn't exist:  creating.");
    }
}

winston.add(winston.transports.File, {filename: "somefile.log"});
winston.remove(winston.transports.Console);


winston.info("Logfile Created!");


// index.js

// CONNECTION STRING (TO DO LATER)
// if omitted, will read connection json file
// -h gis.dola.colorado.gov -p 5433 -u postgres -w password -d acs1014

// OPTIONS (TO DO LATER)
// -l load & unzip data to disk only  ::stops after dl_and_extract.js
// -s upload to database only (keep in seq files, no processing) ::stops after upload_files.js
// -k keep temp files on disk ::doesn't run cleanup.js
// -x dont clean temp files (seq files) from database  ::doesn't run streamline.js

// STATES (REQUIRED!)
// -s ne,ca,fl   ::all lower case.  comma separated.  no spaces.
// -s all ::for everything

var statestring = "";

if (process.argv.indexOf("-s") !== -1) { // does our flag exist?
    statestring = process.argv[process.argv.indexOf("-s") + 1]; // grab the next item
}


// EXAMPLE
// node index.js host=gis.dola.colorado.gov port=5433 user=postgres password=password -k -s states=ne,ca,tx

var dl_scan_files = require("./createdb/a_dl_scan_files.js");
var dl_and_extract = require("./createdb/b_dl_and_extract.js");
var scaffold = require("./createdb/c_scaffold.js");
var create_meta = require("./createdb/d_create_meta.js");
var geo_clean = require("./createdb/e_geo_clean.js");
var replace_dot = require("./createdb/f_replace_dot.js");
var upload_geo = require("./createdb/g_upload_geo.js");
var upload_files = require("./createdb/h_upload_files.js");
var geo_operate = require("./createdb/i_geo_operate.js");
var create_tables = require("./createdb/j_create_tables.js");
var streamline = require("./createdb/k_streamline.js");
var cleanup = require("./createdb/l_cleanup.js");

winston.info("A. dl_scan_files called");
dl_scan_files(filesEEG, winston);

filesEEG.on("b_dl_and_extract", function () {
    winston.info("B. dl_and_extract called");
    dl_and_extract(statestring, filesEEG, winston);
});

filesEEG.on("c_scaffold", function () {
    winston.info("C. scaffold called");
    scaffold(filesEEG, winston);
});

filesEEG.on("d_create_meta", function () {
    winston.info("D. create_meta called");
    create_meta(filesEEG, winston);
});

filesEEG.on("e_geo_clean", function () {
    winston.info("E. geo_clean called");
    geo_clean(statestring, filesEEG, winston);
});

filesEEG.on("f_replace_dot", function () {
    winston.info("F. replace_dot called");
    replace_dot(statestring, filesEEG, winston);
});

filesEEG.on("g_upload_geo", function () {
    winston.info("G. upload_geo called");
    upload_geo(statestring, filesEEG, winston);
});

filesEEG.on("h_upload_files", function () {
    winston.info("H. upload_files called");
    upload_files(statestring, filesEEG, winston);
});

filesEEG.on("i_geo_operate", function () {
    winston.info("I. geo_operate called");
    geo_operate(filesEEG, winston);
});


// the choke point.  Need to wait until all files done


filesEEG.on("j_create_tables", function () {
    winston.info("J. create_tables called");
    create_tables(filesEEG, winston);
});

filesEEG.on("k_streamline", function () {
    winston.info("K. streamline called");
    streamline(filesEEG, winston);
});

filesEEG.on("l_cleanup", function () {
    winston.info("L. cleanup called");
    cleanup(filesEEG, winston);
});
   
  
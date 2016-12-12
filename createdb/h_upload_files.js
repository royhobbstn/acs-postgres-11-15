"use strict";

var fs = require("fs");
var pg = require("pg");
var copyFrom = require("pg-copy-streams").from;

module.exports = function(st_string, filesEEG, winston) {

  var i, j;

  var states = st_string.split(",");
  if (st_string === "") {
    states = [];
  }

  // no state arguments.  end
  if (states.length === 0) {
    console.log("missing state argument.  program exiting");
    winston.info("missing state argument.  program exiting");
    process.exit();
  }

  // check state code validity
  for (j = 0; j < states.length; j = j + 1) {
    if (states[j] === "al" || states[j] === "ak" || states[j] === "az" || states[j] === "ar" || states[j] === "ca" || states[j] === "co" || states[j] === "ct" || states[j] === "de" || states[j] === "dc" || states[j] === "fl" || states[j] === "ga" || states[j] === "hi" || states[j] === "id" || states[j] === "il" || states[j] === "in" || states[j] === "ia" || states[j] === "ks" || states[j] === "ky" || states[j] === "la" || states[j] === "me" || states[j] === "md" || states[j] === "ma" || states[j] === "mi" || states[j] === "mn" || states[j] === "ms" || states[j] === "mo" || states[j] === "mt" || states[j] === "ne" || states[j] === "nv" || states[j] === "nh" || states[j] === "nj" || states[j] === "nm" || states[j] === "ny" || states[j] === "nc" || states[j] === "nd" || states[j] === "oh" || states[j] === "ok" || states[j] === "or" || states[j] === "pa" || states[j] === "pr" || states[j] === "ri" || states[j] === "sc" || states[j] === "sd" || states[j] === "tn" || states[j] === "tx" || states[j] === "us" || states[j] === "ut" || states[j] === "vt" || states[j] === "va" || states[j] === "wa" || states[j] === "wv" || states[j] === "wi" || states[j] === "wy" || states[j] === "all") {
      // valid state
    } else {
      console.log("one or more of your state codes are not valid");
      winston.info("one or more of your state codes are not valid");
      process.exit();
    }

    if (states[j] === "all") {
      states = ["al", "ak", "az", "ar", "ca", "co", "ct", "de", "dc", "fl", "ga", "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "pr", "ri", "sc", "sd", "tn", "tx", "us", "ut", "vt", "va", "wa", "wv", "wi", "wy"];
      break;
    }

  } // end j loop


  console.log("begin upload_files");
  winston.info("begin upload_files");

  var obj = JSON.parse(fs.readFileSync("./connection.json", "utf8"));

  var conString = "postgres://" + obj.name + ":" + obj.password + "@" + obj.host + ":" + obj.port + "/" + obj.db;

  var totalfiles = 0;
  var completedfiles = 0;

  // All other Geo's File
  fs.readdir("temp/file1", function(err, files) {

    if (err) throw err;

    // promise array

    var pr = files.map(function(file, index) {

      return new Promise(function(fulfill, reject) {

        setTimeout(function() {



          var fntext = file.split(".");


          // grab seq number
          var thefn = parseInt(fntext[0].substring(9, 12));


          // only doing estimate files and moe files - no geos
          if (fntext[0][0] === "e" || fntext[0][0] === "m") {
            totalfiles++;
            // table prefix of moe for Margin of Error Tables
            var prefix = "";
            if (fntext[0][0] === "m") {
              prefix = "moe";
            }

            // connect to db
            pg.connect(conString, function(err, client, done) {
              if (err) throw err;
              var stream = client.query(copyFrom("COPY data." + prefix + "seq" + thefn + " FROM STDIN USING DELIMITERS ',' CSV"));
              var fileStream = fs.createReadStream("temp/file1/" + fntext[0] + ".txt");
              fileStream.on("end", done);
              fileStream.on("end", function() {
                console.log("temp/file1/" + prefix + "seq" + thefn + " uploaded.");
                winston.info("temp/file1/" + prefix + "seq" + thefn + " uploaded.");
                fulfill("temp/file1/" + prefix + "seq" + thefn + " uploaded.");
                completedfiles++;
              });
              fileStream.on("error", done);
              fileStream.on("error", function() {
                console.log("temp/file1/" + prefix + "seq" + thefn + " ERROR.");
                winston.info("temp/file1/" + prefix + "seq" + thefn + " ERROR.");
                reject("temp/file1/" + prefix + "seq" + thefn + " ERROR.");
              });
              fileStream.pipe(stream);

            });

          }


        }, index * 400);

      });



    });

    Promise.all(pr).then(values => {
      console.log(values); // [3, 1337, "foo"] 
    }, reason => {
      console.log(reason)
    });

  });


  // Tracts BGs file
  fs.readdir("temp/file2", function(err, files) {

    if (err) throw err;


    var ps = files.map(function(file, index) {


      return new Promise(function(fulfill, reject) {

        setTimeout(function() {

          var fntext = file.split(".");


          // grab seq number
          var thefn = parseInt(fntext[0].substring(9, 12));
          console.log('thefn: ' + thefn);


          // only doing estimate files and moe files - no geos
          if (fntext[0][0] === "e" || fntext[0][0] === "m") {
            totalfiles++;
            // table prefix of moe for Margin of Error Tables
            var prefix = "";
            if (fntext[0][0] === "m") {
              prefix = "moe";
            }

            // connect to db
            pg.connect(conString, function(err, client, done) {
              if (err) throw err;
              var stream = client.query(copyFrom("COPY data." + prefix + "seq" + thefn + " FROM STDIN USING DELIMITERS ',' CSV"));
              var fileStream = fs.createReadStream("temp/file2/" + fntext[0] + ".txt");
              fileStream.on("end", done);
              fileStream.on("end", function() {
                console.log("temp/file2/" + prefix + "seq" + thefn + " uploaded.");
                winston.info("temp/file2/" + prefix + "seq" + thefn + " uploaded.");
                fulfill("temp/file2/" + prefix + "seq" + thefn + " uploaded.");
                completedfiles++;
              });
              fileStream.on("error", done);
              fileStream.on("error", function() {
                console.log("temp/file2/" + prefix + "seq" + thefn + " ERROR.");
                winston.info("temp/file2/" + prefix + "seq" + thefn + " ERROR.");
                reject("temp/file2/" + prefix + "seq" + thefn + " ERROR.");
              });

              fileStream.pipe(stream);

            });

          }



        }, index * 400);

      });

    });


    Promise.all(ps).then(values => {
      console.log(values); // [3, 1337, "foo"] 
    }, reason => {
      console.log(reason)
    });

  });


  // wait for count to increase to max
  // check that all files were downloaded and unzipped before moving on to scaffolding
  function check() {
    winston.info("u_completed files: " + completedfiles);
    winston.info("u_total files: " + totalfiles);
    winston.info("u_completed files: " + completedfiles);
    winston.info("u_total files: " + totalfiles);
    // to 488 when seq121 issue is resolved
    if (completedfiles < ((states.length) * 488)) {
      setTimeout(check, 1000); // setTimeout(func, timeMS, params...)
    } else {
      winston.info("calling geo_operate");
      process.exit();
      filesEEG.emit("i_geo_operate");
    }


  }

  check();


};
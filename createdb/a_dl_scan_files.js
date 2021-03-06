"use strict";

var request = require("request");
var fs = require("fs");
var mkdirp = require("mkdirp");
var unzip = require("unzip");


module.exports = function (filesEEG, winston) {


    // create temp directory
    mkdirp("scan", function (err) {

        // path was created unless there was error
        if (err) {
            winston.info("Error:" + err);
        } else {
            winston.info("scan directory created");
        }

        request("http://www2.census.gov/programs-surveys/acs/summary_file/2015/data/2015_5yr_Summary_FileTemplates.zip")
            .pipe(fs.createWriteStream("scan/2015_5yr_Summary_FileTemplates.zip"))
            .on("close", function () {
                winston.info("Template File Written!");

                // create temp directory
                mkdirp("scan/unzip", function (err) {

                    if (err) {
                        winston.error(err);
                    }

                    // unzip file to temp/file1
                    fs.createReadStream("scan/2015_5yr_Summary_FileTemplates.zip").pipe(unzip.Extract({
                        path: "scan/unzip"
                    }));
                    winston.info("unzipped template file");

                    request("http://www2.census.gov/programs-surveys/acs/summary_file/2015/documentation/user_tools/ACS_5yr_Seq_Table_Number_Lookup.xls")
                        .pipe(fs.createWriteStream("scan/ACS_5yr_Seq_Table_Number_Lookup.xls"))
                        .on("close", function () {
                            winston.info("Metadata File Written!");

                            filesEEG.emit("b_dl_and_extract");

                        });

                });

            });


    });


};
"use strict";

module.exports = function (filesEEG, winston) {

    var rmdir = require("rmdir");
    var path = "temp";
    var path2 = "scan";

    rmdir(path, function (err, dirs, files) {
        if (err) {
            winston.error(err);
        }
        winston.info(dirs);
        winston.info(files);
        winston.info("all temp directory files are removed");
    });

    rmdir(path2, function (err, dirs, files) {
        if (err) {
            winston.error(err);
        }
        winston.info(dirs);
        winston.info(files);
        winston.info("all scan directory files are removed");
    });

};
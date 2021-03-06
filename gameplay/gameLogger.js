var utilities = require(__basedir + "/utilities/");
var Class = utilities.Class;
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var moment = require('moment');
var format = require("string-format");
var extend = require("extend");
var log = require("./log");

/**
 * @class GameLogger: a simple manager that attaches to a directory and logs games (creates gamelogs) into that folder, as well as retrieves them from.
 */
var GameLogger = Class({
    /**
     * @param {Array.<string>} gameNames - strings of all games that could be logged
     * @param {string} [dir] - path to directory to log games into, and to read them from
     */
    init: function(gameNames, options) {
        this.gamelogExtension = ".json.gz";
        this.usingCompression = true;
        this.gamelogDirectory = (options && options.directory) || 'output/gamelogs/';
        this.gamelogs = []; // simple array of all gamelogs (regardless of game), sorted by epoch (time), with newest gamelogs at the end

        this._filenameFormat = "{moment}-{gameName}-{gameSession}";
        if(options && options.arenaMode) {
            this._filenameFormat = "{gameName}-{gameSession}"; // TODO: upgrade arena so it can get the "real" filename with the moment string in it via RESTful API
        }

        this.gamelogFor = {};
        for(var i = 0; i < gameNames.length; i++) {
            this.gamelogFor[gameNames[i]] = {};
        }

        this._loadGamelogs = Boolean(options && options.loadGamelogs);

        if(this._loadGamelogs) {
            var filenames = utilities.getFiles(this.gamelogDirectory);
            for(var i = 0; i < filenames.length; i++) {
                var filename = filenames[i];
                if(filename.endsWith(this.gamelogExtension)) {
                    (function(self, filename) {
                        var path = self.gamelogDirectory + filename;

                        var strings = [];
                        var readStream = fs.createReadStream(path)
                            .pipe(zlib.createGunzip()) // Un-Gzip
                            .on("data", function(buffer) {
                                strings.push(buffer.toString('utf8'));
                            })
                            .on("end", function() {
                                var gamelog = JSON.parse(strings.join(''));
                                self._memorizeGamelog(gamelog);
                            });
                    })(this, filename);
                }
            }
        }
    },

    /**
     * Creates a gamelog for the game in the directory set during init
     *
     * @param {Object} gamelog - the gamelog which should be serializable to json representation of the gamelog
     */
    log: function(gamelog) {
        var serialized = JSON.stringify(gamelog);
        var filename = format(this._filenameFormat, extend({
            moment: utilities.momentString(gamelog.epoch),
        }, gamelog));

        this._memorizeGamelog(gamelog);

        var path = (this.gamelogDirectory + filename + this.gamelogExtension);
        var writeSteam = fs.createWriteStream(path, 'utf8');
        var gzip = zlib.createGzip();

        gzip.on("error", function(err) {
            log.error("Could not save gamelog '" + gamelog.gameName + "' - '" + gamelog.gameSession + "'.", err);
        });

        gzip.pipe(writeSteam);
        gzip.write(serialized);
        gzip.end();
    },

    /**
     * Takes a parsed gamelog and stores it in memory
     *
     * @param {Object} gamelog - parsed gamelog to store in memory and in various lookup dictionaries
     */
    _memorizeGamelog: function(gamelog) {
        if(this._loadGamelogs) {
            this.gamelogFor[gamelog.gameName] = this.gamelogFor[gamelog.gameName] || {};
            this.gamelogFor[gamelog.gameName][gamelog.gameSession] = this.gamelogFor[gamelog.gameName][gamelog.gameSession] || {};
            this.gamelogFor[gamelog.gameName][gamelog.gameSession][gamelog.epoch] = gamelog;

            var index = 0;
            for(index; index < this.gamelogs.length; index++) {
                if(this.gamelogs[index].epoch > gamelog.epoch) { // then the gamelog we are looking at was logged after the current one
                    break; // this index is where we want to put this new gamelog
                }
            }
            this.gamelogs.insert(index, gamelog);
        }
    },

    /**
     * Gets all the gamelogs this GameLogger knows of.
     * 
     * @returns {Array<Object>} array of gamelogs matching
     */
    getLogs: function(filter) {
        // TODO: use the filter in the future
        return this.gamelogs;
    },

    /**
     * Gets the first game log matching the gameName, sessionID, and (optional) epoch
     *
     * @param {string} gameName - name of the game you want a log for
     * @param {string} sessionID - id of the session that for the game
     * @param {number} [epoch] - the epoch for the specific game ran of session id
     * @returns {Object|undefined} gamelog matching passed in parameters, or undefined if doesn't exist
     */
    getLog: function(gameName, sessionID, epoch) {
        if(!this.gamelogFor[gameName] || !this.gamelogFor[gameName][sessionID]) {
            return;
        }

        if(!epoch) { // then give them the latest gamelog
            var maxEpoch = 0;
            var gamelog = undefined;
            for(var gamelogEpoch in this.gamelogFor[gameName][sessionID]) {
                if(gamelogEpoch > maxEpoch) {
                    gamelog = this.gamelogFor[gameName][sessionID][gamelogEpoch];
                }
            }

            return gamelog;
        }
        else {
            return this.gamelogFor[gameName][sessionID][epoch];
        }
    }
});

module.exports = GameLogger;

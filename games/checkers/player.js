// Generated by Creer at 03:23PM on September 16, 2015 UTC, git hash: '3f0e08b46657dff30d7c082da7471381f8a1ab62'
// Note: this is the file you should modify. The logic generated by Creer should be mostly in ./generated/

var Class = require(__basedir + "/utilities/class");
var serializer = require(__basedir + "/gameplay/serializer");
var GameObject = require("./gameObject");

//<<-- Creer-Merge: requires -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
// any additional requires you want can be required here safely between cree runs
//<<-- /Creer-Merge: requires -->>

// @class Player: A player in this game. Every AI controls one player.
var Player = Class(GameObject, {
    /**
     * Initializes Players.
     *
     * @param {Object} a simple mapping passsed in to the constructor with whatever you sent with it.
     */
    init: function(data) {
        GameObject.init.apply(this, arguments);

        /**
         * All the checkers currently in the game owned by this player
         *
         * @type {list.<Checker>}
         */
        this._addProperty("checkers", serializer.defaultArray(data.checkers));

        /**
         * What type of client this is, e.g. 'Python', 'JavaScript', or some other language. For potential data mining purposes.
         *
         * @type {string}
         */
        this._addProperty("clientType", serializer.defaultString(data.clientType));

        /**
         * if the player lost the game or not
         *
         * @type {boolean}
         */
        this._addProperty("lost", serializer.defaultBoolean(data.lost));

        /**
         * The name of the player
         *
         * @type {string}
         */
        this._addProperty("name", serializer.defaultString(data.name));

        /**
         * the reason why the player lost the game
         *
         * @type {string}
         */
        this._addProperty("reasonLost", serializer.defaultString(data.reasonLost));

        /**
         * the reason why the player won the game
         *
         * @type {string}
         */
        this._addProperty("reasonWon", serializer.defaultString(data.reasonWon));

        /**
         * The amount of time (in ns) remaining for this AI to send commands.
         *
         * @type {number}
         */
        this._addProperty("timeRemaining", serializer.defaultNumber(data.timeRemaining));

        /**
         * if the player won the game or not
         *
         * @type {boolean}
         */
        this._addProperty("won", serializer.defaultBoolean(data.won));

        /**
         * The direction your checkers must go along the y-axis until kinged
         *
         * @type {number}
         */
        this._addProperty("yDirection", serializer.defaultInteger(data.yDirection));


        //<<-- Creer-Merge: init -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        // put any initialization logic here. the base variables should be set from 'data' in Generated${obj_key}'s init function
        // NOTE: no players are connected at this point.
        //<<-- /Creer-Merge: init -->>
    },

    gameObjectName: "Player",


    //<<-- Creer-Merge: added-functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // You can add additional functions here. These functions will not be directly callable by client AIs
    //<<-- /Creer-Merge: added-functions -->>

});

module.exports = Player;

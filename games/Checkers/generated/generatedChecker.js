// Generated by Creer at 09:43PM on May 07, 2015 UTC, git hash: '3d2d5f08585852420c55724fccd252e71c025a37'
// Note: this file should never be modified, instead if you want to add game logic modify just the ../Checker.js file. This is to ease merging main.data changes

var Class = require("../../../utilities/class");
var GameObject = require("../gameObject");


// @class GeneratedChecker: The generated version of the Checker, that handles basic logic.
var GeneratedChecker = Class(GameObject, {
	init: function(data) {
		GameObject.init.apply(this, arguments);

		this.y = parseInt(data.y === undefined ? 0 : data.y);
		this.owner = (data.owner === undefined ? null : data.owner);
		this.x = parseInt(data.x === undefined ? 0 : data.x);
		this.kinged = Boolean(data.kinged === undefined ? false : data.kinged);

		this._serializableKeys["y"] = true;
		this._serializableKeys["owner"] = true;
		this._serializableKeys["x"] = true;
		this._serializableKeys["kinged"] = true;
	},

	gameObjectName: "Checker",

	_runIsMine: function(player, data) {
		var returned = this.isMine(player);
		return Boolean(returned);
	},

	_runMove: function(player, data) {
		var returned = this.move(player, data.x, data.y);
		return (returned);
	},

});

module.exports = GeneratedChecker;

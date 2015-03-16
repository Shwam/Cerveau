// Generated by Creer, git hash Error: git probably not installed
// Note: this file should never be modified, instead if you want to add game logic modify just the ../Game.js file. This is to ease merging main.data changes
var extend = require("extend");
var Class = require("../../../structures/class");
var TurnBasedGame = require("../../turnBasedGame");

// Custom Game Objects
var GameObject = require("../gameObject");
var Checker = require("../checker");
var Player = require("../player");

// @class Checkers.GeneratedGame: The simple version of American Checkers
var GeneratedGame = Class(
	TurnBasedGame,
{
	init: function(data) {
		TurnBasedGame.init.apply(this, arguments);

		this.name = "Checkers";
		extend(this.state, {
			checkerLastJumped: null,
			checkers: [],
			boardWidth: 0,
			boardHeight: 0,
			checkerLastMoved: null,
		});
	},

	newGameObject: function(data) {
		data.game = this;
		return new GameObject(data);
	},

	newChecker: function(data) {
		data.game = this;
		return new Checker(data);
	},

	newPlayer: function(data) {
		data.game = this;
		return new Player(data);
	},

});

module.exports = GeneratedGame;

var log = require("../log");
var Class = require(__basedir + "/utilities/class");
var DeltaMergeable = require("./deltaMergeable");
var constants = require("../constants");

var prototype = {
    init: function(baseGame, pathInBaseGame, copyFrom) {
        DeltaMergeable.init.apply(this, arguments);

        var self = this;
        self._addProperty("length", 0, {
            deltaKey: true,
            setter: function(newValue) {
                return self._resize(newValue);
            },
        });

        if(copyFrom) {
            this.push.apply(this, copyFrom);
        }
    },

    /**
     * given a new length this resizes the internal properties to that new size. Also does range checks.
     *
     * @param {number} newLength - the new length of the array
     * @returns {number} actual new length, if you pass in negative values this will be 0
     */
    _resize: function(newLength) {
        var newlength = Math.max(newLength, 0);
        var currentLength = this.length;

        while(currentLength > newlength) {
            this._removeProperty(--currentLength);
        }

        while(currentLength < newlength) {
            this._addProperty(currentLength++, undefined);
        }

        return newLength;
    },

    /**
     * re-implimentation of Array.push which registers pushed properties. Use this for expanding DeltaMergeableArrays instead of 'this[this.length] = newNum';
     *
     * @see Array.push
     * @param {...*} var_args - any number of elements to push into this array.
     * @returns {number} new length of this array
     */
    push: function(/* element1, element2, ..., elementN */) {
        var oldLength = this.length;
        this.length += arguments.length;

        for(var i = 0; i < arguments.length; i++) {
            this[oldLength + i] = arguments[i];
        }
        return this.length;
    },

    /**
     * re-implimentation of Array.pop which registers removes popped properties. Use this for removing DeltaMergeableArrays instead of 'delete this[this.length - 1]';
     *
     * @see Array.pop
     * @returns {*} element popped from the end of the list
     */
    pop: function() {
        var popping = this[this.length - 1];
        this.length--;
        return popping;
    },

    /**
     * re-implimentation of Array.unshift which registers pushed properties at the front. Use this for expanding DeltaMergeableArrays.
     *
     * @see Array.unshift
     * @param {...*} var_args - any number of elements to push into this array at the front
     * @returns {number} new length of this array
     */
    unshift: function(/* element1, element2, ..., elementN */) {
        var clone = this.slice();
        this.length = 0;
        this.push.apply(this, arguments);
        this.push.apply(this, clone);

        return this.length;
    },

    /**
     * re-implimentation of Array.shift which pops the first element off the array, shift all ements down.
     *
     * @see Array.shift
     * @returns {*} the element of the array that was shifted from the front.
     */
    shift: function() {
        if(this.length > 0) {
            var first = this[0];
            for(var i = 0; i < (this.length - 1); i++) {
                this[i] = this[i + 1];
            }
            this.pop();
            return first;
        }
    },
};

// We copy all the functions from the Array prototype to this prototype so it can act like an array. They above functions have to be manually re-written so the properties get created correctly
// NOTE: These functions SHOULD all work, because DeltaMergeableArrays function like a normal Array, but errors could happen. Be careful
var arrayPrototypeKeys = Object.getOwnPropertyNames(Array.prototype);
for(var i = 0; i < arrayPrototypeKeys.length; i++) {
    var property = arrayPrototypeKeys[i];
    if(!prototype.hasOwnProperty(property)) {
        (function(property) {
            prototype[property] = function(/* ... */) {
                return Array.prototype[property].apply(this, arguments);
            };
        })(property);
    }
}

/**
 * @class DeltaMergeableArray - a re-implimentation of the native js Array that tracks its deltas
 */
var DeltaMergeableArray = Class(DeltaMergeable, prototype);
module.exports = DeltaMergeableArray;

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.generateNodes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/**
 * Check if an input is a naive mapping (= plain object)
 * @param input  The value to be checked
 * @returns      True if the input variable is a plain object
 */
var isNaiveMapping = function (input) { return input.constructor === Object; };
/*------------------------
 * CONVERTERS
 *------------------------
 *
 * Converters for the stated types are below.
 *
 */
/**
 * Turn an HTML string into a list of Nodes
 * @param input  The HTML string
 * @returns      A list of Nodes
 */
var stringToNodes = function (input) {
    // Basically put the HTML into a temporary DOM node and read its children
    var div = document.createElement('div');
    div.innerHTML = input;
    return Array.prototype.slice.call(div.childNodes);
};
/**
 * Turn a Mapping into a list of Nodes
 * @param input  The Mapping to be converted
 * @returns      A list of Nodes
 */
var mappingToNodes = function (input) {
    var keys = isNaiveMapping(input)
        ? Object.keys(input)
        : Array.from(input.keys());
    return keys.reduce(function (carry, nodeName) {
        var modNode = nodeName;
        if (nodeName.match(/^[a-zA-Z-]+$/)) {
            modNode = '<' + nodeName + '>';
        }
        var container = stringToNodes(modNode).pop();
        for (var _i = 0, _a = generateNodes(isNaiveMapping(input) ? input[nodeName] : input.get(nodeName)); _i < _a.length; _i++) {
            var node = _a[_i];
            container.appendChild(node);
        }
        return carry.concat(container);
    }, []);
};
/**
 * Turn an Input into a list of Nodes
 * @param input  The Input to be converted
 * @returns      A list of Nodes
 */
var inputToNodes = function (input) {
    if (input instanceof Array)
        return arrayToNodes(input);
    else if (input instanceof Node)
        return [input];
    else if (typeof input === 'string')
        return stringToNodes(input);
    else
        return mappingToNodes(input);
};
/**
 * Turn an array of Inputs into a list of Nodes
 * @param input  The array of Inputs to be converted
 * @returns      A list of Nodes
 */
var arrayToNodes = function (input) {
    return input.reduce(function (carry, current) { return (carry.concat(inputToNodes(current))); }, []);
};
/**
 * Generate a list of Nodes from an according input
 * @param input  The stuff to convert
 * @returns      A list of Nodes
 */
var generateNodes = function (input) {
    if (input == null)
        return [];
    else if (input instanceof Array)
        return arrayToNodes(input);
    else
        return arrayToNodes([input]);
};
module.exports = generateNodes;

},{}]},{},[1])(1)
});
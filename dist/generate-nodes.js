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
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
var stringToNodes = function (input, window) {
    // Basically put the HTML into a temporary DOM node and read its children
    var div = window.document.createElement('div');
    div.innerHTML = input;
    return Array.prototype.slice.call(div.childNodes);
};
/**
 * Turn a Mapping into a list of Nodes
 * @param input  The Mapping to be converted
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
var mappingToNodes = function (input, window) {
    var keys = isNaiveMapping(input)
        ? Object.keys(input)
        : Array.from(input.keys());
    return keys.reduce(function (carry, nodeName) {
        var modNode = nodeName;
        if (nodeName.match(/^[a-zA-Z-]+$/)) {
            modNode = '<' + nodeName + '>';
        }
        var container = stringToNodes(modNode, window).pop();
        for (var _i = 0, _a = generateNodes(isNaiveMapping(input) ? input[nodeName] : input.get(nodeName), window); _i < _a.length; _i++) {
            var node = _a[_i];
            container.appendChild(node);
        }
        return carry.concat(container);
    }, []);
};
/**
 * Turn an Input into a list of Nodes
 * @param input  The Input to be converted
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
var inputToNodes = function (input, window) {
    if (input instanceof Array)
        return arrayToNodes(input, window);
    else if (input instanceof window['Node'])
        return [input];
    else if (typeof input === 'string')
        return stringToNodes(input, window);
    else
        return mappingToNodes(input, window);
};
/**
 * Turn an array of Inputs into a list of Nodes
 * @param input  The array of Inputs to be converted
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
var arrayToNodes = function (input, window) {
    return input.reduce(function (carry, current) { return (carry.concat(inputToNodes(current, window))); }, []);
};
/**
 * Generate a list of Nodes from an according input
 * @param input  The stuff to convert
 * @param window The Window object that contains the "Node" and "document" properties
 * @returns      A list of Nodes
 */
var originalWindow = typeof window === 'object' ? window : null;
var generateNodes = function (input, window) {
    var usedWindow = window || originalWindow;
    if (usedWindow == null)
        throw new Error('No `window` object provided');
    if (input == null)
        return [];
    else if (input instanceof Array)
        return arrayToNodes(input, usedWindow);
    else
        return arrayToNodes([input], usedWindow);
};
/**
 * Creates a version of the `generateNodes` function bound to a certain window object
 */
generateNodes['withWindow'] = function (window) {
    return function (input) { return generateNodes(input, window); };
};
module.exports = generateNodes;

},{}]},{},[1])(1)
});
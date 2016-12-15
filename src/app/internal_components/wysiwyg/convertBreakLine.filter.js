/**
 * @ngdoc filter
 * @name wysiwyg.filter:convertBreakLine
 * @description
 * Replace break line \n to html line break <br/>
 */
(function () {
    'use strict';

    var filter = function(_, $log) {
        return function(text) {
            return text.replace(/\n/g, '<br/>');
        };
    };

    module.exports = filter;
}());

'use strict';
/**
 * @description Directive used to allow the addition of sources when "enter" is pressed.
 * @class voidEditor.editorApp.editorAppDirectives
 */
var editorAppDirectives = angular.module('editorAppDirectives', []);

/**
 * @description  http://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
 */

editorAppDirectives.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
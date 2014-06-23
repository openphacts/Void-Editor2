'use strict';
/**
 * @namespace angular_module
 */

/**
 *  App Module
 * @class angular_module.editorApp
 */
var editorApp = angular.module('editorApp', ['ngRoute' , 'editorAppControllers', 'editorAppDirectives', 'ngSanitize'
    , 'ui.bootstrap' , 'modalControllers' , 'dateControllers']);



'use strict';
/**
 * @namespace voidEditor
 */

/**
 *  App Module
 * @class voidEditor.editorApp
 */
var editorApp = angular.module('editorApp', ['ngRoute' , 'editorAppControllers', 'editorAppDirectives', 'ngSanitize'
    , 'ui.bootstrap' , 'modalControllers' , 'dateControllers']);



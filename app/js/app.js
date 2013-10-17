'use strict';

/* App Module */

var editorApp = angular.module('editorApp', ['ngRoute' ,'editorAppControllers','ui.bootstrap' ]);

editorApp.config(['$routeProvider',
  function($routeProvider ) {
    $routeProvider.
      when('/step', {
          templateUrl: 'partials/page.html',
          controller: 'editorCtrl'
      }).
      otherwise({
        redirectTo: '/step'
      });
  }]);

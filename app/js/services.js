'use strict';

/* Services */

var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function($resource) {
        return $resource('res/datasources.json');
    });




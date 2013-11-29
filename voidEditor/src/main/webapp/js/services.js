'use strict';

/* Services */
var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function($resource) {
        return $resource('https://beta.openphacts.org/sources?app_id=b9eff02c&app_key=3f9a38bd5bcf831b79d40e04dfe99338&_format=json');
    });

var voidDataService = angular.module('voidDataService', [])
    .service('voidData', function($rootScope , $http , $window) {
        var turtleData = "Loading...",
            fileLocation ="",
            data = {};

        data.sources = [];

        this.setTurtle = function(value) {
            turtleData = value;
            $rootScope.$broadcast('TurtleChanged', turtleData);
        };
        this.getTurtle = function() {
            return turtleData;
        };

        this.setData = function(value) {
            data = value;
            $rootScope.$broadcast('DataChanged', data);
        };

        this.getData = function() {
            return data;
        };

        this.createVoid = function (){

            $rootScope.$broadcast('needData', data);

            $http({method: 'POST', url: '/voidEditor/rest/void/output' , data: data}).
                success(function(data, status, headers, config) {
                    turtleData =  data;
                    $rootScope.$broadcast('TurtleChanged', turtleData);
                }).
                error(function(data, status, headers, config) {
                    console.log("Error in creating void - Status: " + status + "   data=>" + data);
                });

            return turtleData;
        };

        this.setSourceData = function(value) {
            data.sources = value;
            console.log("====");
            console.log( data.sources);
            console.log("====");
            $rootScope.$broadcast('DataSourcesChanged',  data.sources);
        };

        this.getSourceData = function() {
            return data.sources;
        };

        this.deleteFile = function() {
            $http({method: 'DELETE', url: '/voidEditor/rest/void/delete' }).
                success(function(data, status, headers, config) {
                    console.log("Deleted file");
                }).
                error(function(data, status, headers, config) {
                    console.log("Error in deleting void - Status: " + status + "   data=>" + data);
                });
        };

        this.createVoidAndDownload = function (){

            $rootScope.$broadcast('needData', data);

            console.log("going to do ajax call.");
            $.ajax({
                type: 'POST',
                url: '/voidEditor/rest/void/output',
                data: JSON.stringify( data ),
                contentType: "application/json",
                beforeSend : function (){
                    $(".spinner").show();
                    console.log("beforesend in ajax call.");
                },
                success: function(){
                    console.log("post success");
                    $(".spinner").hide();
                },
                error: function(){
                    console.log("POST FAILED");
                    return false;
                },
                async:false
            });
            return true;

        };

    });
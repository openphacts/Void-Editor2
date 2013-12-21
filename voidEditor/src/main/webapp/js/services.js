'use strict';

/* Services */
var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function ($resource) {
        return $resource('https://beta.openphacts.org/sources?app_id=b9eff02c&app_key=3f9a38bd5bcf831b79d40e04dfe99338&_format=json');
    });

var voidUploadService = angular.module('voidUploadService', [])
    .service('uploadData', function ($rootScope, $http) {
        var URL;

        URL = '/voidEditor/rest/void/upload';
        this.process = function (file) {
            $http.post(URL, file, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (data) {
                console.log("upload Success==> " + data);
                $rootScope.$broadcast('SuccessUpload', data);
            })
            .error(function (data, status) {
                   var message = "Error : " + status ;// + "=> " + data ;
                   $rootScope.$broadcast('POSTFailedUpload', message)
            });
        }
    });


var voidDataService = angular.module('voidDataService', [])
    .service('voidData', function ($rootScope, $http, $window) {
        var turtleData, fileLocation, data, uriForSourcesExist, outputURL;
        turtleData = "Loading...";
        fileLocation = "";
        data = {};
        uriForSourcesExist = "passed";
        outputURL = '/voidEditor/rest/void/output';

        data.sources = [];

        this.setTurtle = function (value) {
            turtleData = value;
            $rootScope.$broadcast('TurtleChanged', turtleData);
        };
        this.getTurtle = function () {
            return turtleData;
        };

        this.setUriForSourcesExist = function (value) {
            uriForSourcesExist = value;
        };

        this.setData = function (value) {
            data = value;
            $rootScope.$broadcast('DataChanged', data);
        };

        this.getData = function () {
            return data;
        };

        this.checkSources = function () {
            $rootScope.$broadcast("checkSources");
        };

        this.checkIfUriForSourcesExist = function () {
            return uriForSourcesExist;
        };

        this.createVoid = function () {
            $rootScope.$broadcast('needData', data);
            $rootScope.$broadcast('StartLoader');

            return $http({method: 'POST', url: outputURL, data: data}).
                error(function (data, status) {
                    turtleData = "Error in creating void - Status: " + status;
                    console.log(turtleData);
                    $rootScope.$broadcast('TurtleChanged', turtleData);
                    return turtleData;
                }).
                then(function (data) {
                    turtleData = data.data;
                    $rootScope.$broadcast('TurtleChanged', turtleData);
                    return turtleData;
                });

        };

        this.setSourceData = function (value) {
            data.sources = value;
            $rootScope.$broadcast('DataSourcesChanged', data.sources);
        };

        this.getSourceData = function () {
            return data.sources;
        };

        this.deleteFile = function () {
            $http({method: 'DELETE', url: '/rest/void/delete' }).
                success(function (data, status, headers, config) {
                    console.log("Deleted file");
                }).
                error(function (data, status, headers, config) {
                    console.log("Error in deleting void - Status: " + status + "   data=>" + data);
                });
        };

        this.createVoidAndDownload = function () {

            $rootScope.$broadcast('needData', data);
            $.ajax({
                type: 'POST',
                url: outputURL,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function () {$rootScope.$broadcast('SuccessDownload');},
                error: function (status) {$rootScope.$broadcast('FailedDownload', status);},
                async: false
            });
            return true;

        };

    });
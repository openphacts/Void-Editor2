'use strict';

/* Services */
var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function ($resource) {
        return $resource('https://beta.openphacts.org/1.3/sources?app_id=b9eff02c&app_key=3f9a38bd5bcf831b79d40e04dfe99338&_format=json');
    });

var URLPreface = "" ;//"/voidEditor"; // to be changed between dev and prod

var ORCIDService = angular.module('ORCIDService', [])
    .service('ORCIDService', function ($rootScope, $http) {

        this.callORCIDEndpoint = function (id) {
            var URL = 'http://pub.orcid.org/' + id + '/orcid-bio';
            $.ajax({
                type: 'GET',
                url: URL,
                headers: {
                    "Accept": "application/orcid+json"
                },
                success: function (data) {
                    $rootScope.$broadcast('SuccessORCIDData', data);
                },
                error: function (status) {
                    console.log("ORCID SERVICE ERROR + status => " + status);
                    var er = "Could not retrieve information from your ORCID.";
                    $rootScope.$broadcast('FailORCIDData', er);
                }
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
        outputURL = URLPreface + '/rest/linkset/output';

        this.setTurtle = function (value) {
            turtleData = value;
            $rootScope.$broadcast('TurtleChanged', turtleData);
        };


        this.setSourceData = function (value) {
            data.sources = value;
            $rootScope.$broadcast('DataSourcesChanged', data.sources);
        };

        this.getTurtle = function () {
            return turtleData;
        };

        this.setUserTarget = function (value) {
            data.userTarget = value;
            $rootScope.$broadcast('setUserTarget', data.userTarget);
        }

        this.setUserSource = function (value) {
            data.userSource = value;
            $rootScope.$broadcast('setUserSource', data.userSource);
        }

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

        this.checkIfUriForSourcesExist = function () {
            return uriForSourcesExist;
        };
        this.checkSources = function () {
            $rootScope.$broadcast("checkSources");
        };

        this.createVoid = function () {
            $rootScope.$broadcast('needData', data);
            $rootScope.$broadcast('StartLoader');

            return $http({method: 'POST', url: outputURL, data: data}).
                error(function (data, status) {
                    turtleData = "Error in creating void.";
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

        this.createVoidAndDownload = function () {

            $rootScope.$broadcast('needData', data);
            $.ajax({
                type: 'POST',
                url: outputURL,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function () {
                    $rootScope.$broadcast('SuccessDownload');
                },
                error: function (status) {
                    $rootScope.$broadcast('FailedDownload', status);
                },
                async: false
            });
            return true;

        };

    });
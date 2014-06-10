'use strict';

/* Services */
var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function ($resource) {
        return $resource('https://beta.openphacts.org/1.3/sources?app_id=b9eff02c&app_key=3f9a38bd5bcf831b79d40e04dfe99338&_format=json');
    });

var URLPreface = "";// "/voidEditor"; // to be changed between dev and prod

var voidUploadService = angular.module('voidUploadService', [])
    .service('uploadVoidData', function ($rootScope, $http) {
         var URL = URLPreface+  '/rest/void/uploadVoid';
        this.process = function (file) {
            $http.post(URL, file, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (data) {
                    if (data.error == undefined || data.error == null){
                         console.log("upload Success==> "+ data );
                         $rootScope.$broadcast('SuccessUpload', data);
                    }else {
                        $rootScope.$broadcast('POSTFailedUpload', data.error);
                    }
            })
            .error(function (data, status) {
                   var message = "Error in upload of void data - please contact support." ;//+ "=> " + data ;
                   $rootScope.$broadcast('POSTFailedUpload', message)
            });
        }
    });

var ORCIDService = angular.module('ORCIDService', [])
    .service('ORCIDService', function ($rootScope, $http) {

        this.callORCIDEndpoint = function (id) {
            var URL =  'http://pub.orcid.org/' + id + '/orcid-bio';
            $.ajax({
                type: 'GET',
                url: URL,
                headers: {
                    "Accept":"application/orcid+json"
                },
                success: function (data) {
                    $rootScope.$broadcast('SuccessORCIDData', data);
                },
                error: function (status) {
                    console.log("ORCID SERVICE ERROR + status => " + status);
                    var er = "Could not retrieve information from your ORCID." ;
                    $rootScope.$broadcast('FailORCIDData', er);
                }
            });
        }
    });

//will return statistics on the data
var dataUploadService = angular.module('userDataUploadService', [])
    .service('uploadUserData', function ($rootScope, $http) {
        var URL;
        URL = URLPreface+ '/rest/void/uploadData';
        this.process = function (file) {
            $http.post(URL, file, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (data) {
                    if (data.error == undefined || data.error == null){
                        console.log("upload Success==> " );
                        console.log(data);
                        $rootScope.$broadcast('SuccessUploadUserData', data);
                        $rootScope.$broadcast('SuccessStatisticsUserDataUniqueSubjects', data);
                        $rootScope.$broadcast('SuccessStatisticsUserDataUniqueObjects', data);
                        $rootScope.$broadcast('SuccessStatisticsUserDataTotalTriples', data);
                    } else{
                        $rootScope.$broadcast('POSTFailedDataUpload', data.error);
                    }
            })
            .error(function (data, status) {
                 var message = "Error in upload User Data.";// + "=> " + data ;
                  $rootScope.$broadcast('POSTFailedDataUpload', message)
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
        outputURL = URLPreface+'/rest/void/output';

        data.sources = [];

        // it does three different calls to the server in order to get a faster result back
        // than waiting for all three to finish
        this.querySparqlEndPoint = function(endpoint){
            var  URLSub , URLObj, URLTriples;

            URLSub = URLPreface+ '/rest/void/sparqlStatsSubject';
            URLObj = URLPreface+ '/rest/void/sparqlStatsObject';
            URLTriples = URLPreface+ '/rest/void/sparqlStatsTotalTriples';

            $http({method: 'POST', url: URLTriples, data: endpoint}).
                error(function (data, status) {
                    var message = "Error for total number of triples query run on your dataset." ;
                    $rootScope.$broadcast('StatsFailed', message)
                }).
                success(function (data) {
                    $rootScope.$broadcast('SuccessStatisticsUserDataTotalTriples', data);
                });

            $http({method: 'POST', url: URLSub, data: endpoint}).
                error(function (data, status) {
                    var message = "Error in stats for unique subjects in your dataset."  ;
                    $rootScope.$broadcast('StatsFailed', message)
                }).
                success(function (data) {
                    $rootScope.$broadcast('SuccessStatisticsUserDataUniqueSubjects', data);
                });

            $http({method: 'POST', url: URLObj, data: endpoint}).
                error(function (data, status) {
                    var message = "Error in stats for number of unique objects in your dataset." ;
                    $rootScope.$broadcast('StatsFailed', message)
                }).
                success(function (data) {
                    $rootScope.$broadcast('SuccessStatisticsUserDataUniqueObjects', data);
                });
        }

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

        this.setSourceData = function (value) {
            data.sources = value;
            $rootScope.$broadcast('DataSourcesChanged', data.sources);
        };

        this.getSourceData = function () {
            return data.sources;
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
'use strict';

/* Services -- Singletons */

/**
 * @function JsonService
 * @memberOf voidEditor.editorApp.jsonService
 * @description Service to return all Open PHACTS Data sources through its API.
 */
var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function ($resource) {
        return $resource('https://beta.openphacts.org/1.3/sources?app_id=b9eff02c&app_key=3f9a38bd5bcf831b79d40e04dfe99338&_format=json');
    });

var URLPreface = "" ;

/**
 * @function uploadVoidData
 * @memberOf voidEditor.editorApp.voidUploadService
 * @description Service to allow the upload of VoID files to the server.
 */
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

/**
 * @function ORCIDService
 * @memberOf voidEditor.editorApp.ORCIDService
 * @description Service to allow the retrieval of ORCID infomation for an individual.
 */
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

/**
 * @function ContributorORCIDService
 * @memberOf voidEditor.editorApp.ContributorORCIDService
 * @description Service to allow the retrieval of ORCID infomation for an contributor.
 */
var ContributorORCIDService = angular.module('ContributorORCIDService', [])
    .service('ContributorORCIDService', function ($rootScope, $http) {

        this.callORCIDEndpointContributor = function (id) {
            var URL =  'http://pub.orcid.org/' + id + '/orcid-bio';
            $.ajax({
                type: 'GET',
                url: URL,
                headers: {
                    "Accept":"application/orcid+json"
                },
                success: function (data) {
                    $rootScope.$broadcast('SuccessORCIDDataContributor', data);
                },
                error: function (status) {
                    console.log("ORCID SERVICE ERROR + status => " + status);
                    var er = "Could not retrieve information from your ORCID." ;
                    $rootScope.$broadcast('FailORCIDData', er);
                }
            });
        }
    });

/**
 * @function uploadUserData
 * @memberOf voidEditor.editorApp.userDataUploadService
 * @description Service to allow the upload of VoID files to the server, will return statistics on the data.
 */
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
/**
 * @function voidData
 * @memberOf voidEditor.editorApp.voidDataService
 * @description Service to allow does the majority of the calls and work for the creation and processing of the VoID.
 */
var voidDataService = angular.module('voidDataService', [])
    .service('voidData', function ($rootScope, $http, $window) {
        var turtleData, fileLocation, data, uriForSourcesExist, outputURL;
        turtleData = "Loading...";
        fileLocation = "";
        data = {};
        uriForSourcesExist = "passed";
        outputURL = URLPreface+'/rest/void/output';

        data.sources = [];
        data.contributors = [];

        /**
         * @function querySparqlEndPoint
         * @description Queries SPARQL endpoint. Does three different calls to the server in order to get a faster result back.
         * @param endpoint
         */
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
        /**
         * @function setTurtle
         * @param {JSON} - value All the new information retrieved for the user.
         */
        this.setTurtle = function (value) {
            turtleData = value;
            $rootScope.$broadcast('TurtleChanged', turtleData);
        };

        /**
         * @function getTurtle
         * @description  Allow a controller to retrieve latest user data.
         * @returns {string}
         */
        this.getTurtle = function () {
            return turtleData;
        };

        /**
         * @function setUriForSourcesExist
         * @description Setting if the URI of sources exist.
         * @param {} value
         */
        this.setUriForSourcesExist = function (value) {
            uriForSourcesExist = value;
        };
        /**
         * @function setData
         * @description Setting the data object in order to pass information to a separate constructor when needed.
         * @param value
         */
        this.setData = function (value) {
            data = value;
            $rootScope.$broadcast('DataChanged', data);
        };
        /**
         * @function getData
         * @returns {JSON} All information that the user has entered.
         */
        this.getData = function () {
            return data;
        };
        /**
         * @function checkSources
         * @description Broadcasts a message to main controller to ensure all the correct sources are encapsulated.
         */
        this.checkSources = function () {
            $rootScope.$broadcast("checkSources");
        };
        /**
         * @function checkIfUriForSourcesExist
         * @returns {string} Value if URI of a source exists.
         */
        this.checkIfUriForSourcesExist = function () {
            return uriForSourcesExist;
        };
        /**
         * @function createVoid
         * @description Sends a message to the backend to create the VoID for the Modal.
         * @returns {String}  VoID Dataset Description
         */
        this.createVoid = function () {
            console.log("CREATE VoID service before broadcast");
            $rootScope.$broadcast('needData', data);
            $rootScope.$broadcast('StartLoader');
            console.log(data);
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
        /**
         * @function setSourceData
         * @description Sets the incorporated datasources variable and broadcasts a global message of 'DataSourcesChanged'.
         * @param {JSON} value - A JSON Object containing all the incorporated datasources the user has selected.
         */
        this.setSourceData = function (value) {
            data.sources = value;
            console.log("In setSourceData!");
            $rootScope.$broadcast('DataSourcesChanged', data.sources);
        };
        /**
         * @function setContributorData
         * @description Sets the contributors variable and broadcasts a global message of 'ContributorsChanged'.
         * @param {JSON} value - JSON Object of contributors and all their information.
         */
        this.setContributorData = function (value){
            data.contributors = value;
            $rootScope.$broadcast('ContributorsChanged', data.contributors);
        }
        /**
         * @function getSourceData
         * @returns {JSON} JSON Object containing all the information of the incorporated sources.
         */
        this.getSourceData = function () {
            console.log("In GETSourceData!");
            return data.sources;
        };
        /**
         * @function createVoidAndDownload
         * @description Send message to the backend to create VoID and allow the download of it by broadcasting 'SuccessDownload'.
         * @returns {boolean} Informing the method has ended.
         */
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
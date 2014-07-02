'use strict';

/* Services - Singletons*/
/**
 * @function JsonService
 * @memberOf linksetCreator.linksetApp.jsonService
 * @description Service to return all Open PHACTS Data sources through its API.
 */
var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function ($resource) {
        return $resource('https://beta.openphacts.org/1.3/sources?app_id=b9eff02c&app_key=3f9a38bd5bcf831b79d40e04dfe99338&_format=json');
    });

var URLPreface = "" ;//"/voidEditor"; // to be changed between dev and prod
/**
 * @function ORCIDService
 * @memberOf linksetCreator.linksetApp.ORCIDService
 * @description Service to allow the retrieval of ORCID infomation for an individual.
 */
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
/**
 * @function ContributorORCIDService
 * @memberOf linksetCreator.linksetApp.ContributorORCIDService
 * @description Service to allow the retrieval of ORCID infomation for an contributor.
 */
var ContributorORCIDService = angular.module('ContributorORCIDService', [])
    .service('ContributorORCIDService', function ($rootScope) {

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
 * @function voidData
 * @memberOf linksetCreator.linksetApp.voidDataService
 * @description Service to allow does the majority of the calls and work for the creation and processing of the VoID.
 */
var voidDataService = angular.module('voidDataService', [])
    .service('voidData', function ($rootScope, $http, $window) {
        var turtleData, fileLocation, data, uriForSourcesExist, outputURL;
        turtleData = "Loading...";
        fileLocation = "";
        data = {};
        uriForSourcesExist = "passed";
        outputURL = URLPreface + '/rest/linkset/output';
        data.contributors = [];

        /**
         * @function setTurtle
         * @param value - All the new information retrieved for the user.
         */
        this.setTurtle = function (value) {
            turtleData = value;
            $rootScope.$broadcast('TurtleChanged', turtleData);
        };

        /**
         * @function setSourceData
         * @description Sets the sources
         * @deprecated
         * @param value
         */
        this.setSourceData = function (value) {
            data.sources = value;
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
        };

        /**
         * @function getTurtle
         * @description  Allow a controller to retrieve latest user data.
         * @returns {string} VoID Turtle.
         */
        this.getTurtle  = function () {
            return turtleData;
        };

        /**
         * @function setUserTarget
         * @description Sets the local variable of the user target selection and broadcasts the "setUserTarget" message.
         * @param value The selection of the user target dataset.
         */
        this.setUserTarget = function (value) {
            data.userTarget = value;
            $rootScope.$broadcast('setUserTarget', data.userTarget);
        }

        /**
         * @function setUserSource
         * @description Sets the local variable of the user source selection and broadcasts the "setUserSource" message.
         * @param value The selection of the user source dataset.
         */
        this.setUserSource = function (value) {
            data.userSource = value;
            $rootScope.$broadcast('setUserSource', data.userSource);
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
         * @param (JSON ) value - All the data the user has set.
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
         * @function checkIfUriForSourcesExist
         * @returns {string} Value if URI of a source exists.
         */
        this.checkIfUriForSourcesExist = function () {
            return uriForSourcesExist;
        };
        /**
         * @function checkSources
         * @description Broadcasts a message to main controller to ensure all the correct sources are encapsulated.
         */
        this.checkSources = function () {
            $rootScope.$broadcast("checkSources");
        };
        /**
         * @function createVoid
         * @description Sends a message to the backend to create the VoID for the Modal.
         * @returns {String}  VoID Dataset Description
         */
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
'use strict';

/**
 * @author Lefteris Tatakis
 * @class voidEditor.editorApp.editorAppControllers
 */
var editorAppControllers = angular.module('editorAppControllers', ['jsonService', 'voidDataService', 'voidUploadService', 'ORCIDService',
                                'userDataUploadService','modalControllers' ,'ContributorORCIDService']);
/**
 *  @description Main controller that instantiate all the information needed by the UI / VoID creation backend.
 *  @memberOf  voidEditor.editorApp.editorAppControllers
 *  @class  voidEditor.editorApp.editorAppControllers.editorCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 *  @param {Service} uploadUserData - Allows users to upload data to the server.
 *  @param {Service} ORCIDService - Service that communicates with the ORCID API.
 */
editorAppControllers.controller('editorCtrl', [  '$scope', '$rootScope', 'voidData', 'uploadUserData', 'ORCIDService',
    function ($scope, $rootScope, voidData, uploadUserData , ORCIDService) {
        $scope.title = 'VoID Editor';
        $scope.mustFieldPerPage = [];
        $rootScope.disabledExport = false;
        $rootScope.data = {};
        $rootScope.turtle = "Loading...";
        $rootScope.showOther = false;
        $rootScope.data.datePublish = 1;
        $rootScope.data.monthPublish = 1;
        $rootScope.data.yearPublish = 2014;
        $rootScope.fileLocation = "";
        $rootScope.data.description = "";
        $rootScope.data.title = "";
        $rootScope.data.publisher = "";
        $rootScope.data.webpage = "";
     //  $rootScope.data.sparqlEndpoint = "";
        $rootScope.data.sources = [];
        $rootScope.data.distributions = [];
        $rootScope.data.contributors = [];
        $rootScope.quantity = 6;
        $rootScope.data.updateFrequency = "Annual";
        $rootScope.postFinished = false;
        $rootScope.data.licence = "http://creativecommons.org/licenses/by-sa/3.0/";
        $rootScope.alerts = [];
        $rootScope.mustFields = [];
        $rootScope.isCollapsed = false;
        $rootScope.isCollapsedDistributions = false;
        $rootScope.showLoader = false;
        $rootScope.isCollapsedContributor = false;
        $rootScope.uploadErrorMessages = "";
        $rootScope.noURI = -1;
        $rootScope.noVersion = -1;
        $rootScope.noWebpage = -1;
        $rootScope.noURLDistribution =-1;
        $rootScope.noDescription = -1;
        $rootScope.data.totalNumberOfTriples= "";
        $rootScope.data.numberOfUniqueSubjects="";
        $rootScope.data.numberOfUniqueObjects ="";
        $rootScope.haveStatsFinished = 1;
        $rootScope.data.ORCID = "";
//        $rootScope.data.datasetType = "RDF";
        $rootScope.doYouHaveOrcidValue = true;

        var ua = window.navigator.userAgent;
        $rootScope.msie = ua.indexOf ( ".NET" );
        $rootScope.finalHeader = "Almost there...";
        $rootScope.LinkToDownloadDataQuestion = "Where could we download your Data from?*";
        $rootScope.LinkToDownloadDataHelp = "Where could we download the data from if we required to. " +
            "This information is required and must be URL.";
        /**
         * @description This message is sent by the services when the information from the ORCID API has been retrieved.
         */
        $rootScope.$on('SuccessORCIDData', function (event, ORCIDJSON) {
            console.log(ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"]);
            var details = ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"];
            $rootScope.data.givenName =details["given-names"].value;
            $rootScope.data.familyName =details["family-name"].value;
            $rootScope.removeAlert("FailORCIDData");
        });

        /**
         * @description This message is sent by the service which uploads data for statistical analysis.
         */
        $rootScope.$on('SuccessUploadUserData', function (event, uploadResult) {
            $rootScope.showLoader = false;
            console.log("SuccessUploadUserData");
            $rootScope.removeAlert("postFailedDataUpload");
        });
        /**
         * @description Do when : the statistics on total number of triples is finished.
         */
        $rootScope.$on('SuccessStatisticsUserDataTotalTriples', function (event, stats) {
            console.log("SuccessStatisticsUserDataTotalTriples");
            console.log(stats);
            if (stats.data != undefined ){
                $rootScope.data.totalNumberOfTriples= stats.data.totalNumberOfTriples;
            } else {
                $rootScope.data.totalNumberOfTriples= stats.totalNumberOfTriples;
            }
            console.log( $rootScope.data.totalNumberOfTriples);
            $rootScope.haveStatsFinished = 1;
            $rootScope.showLoader = false;
        });
        /**
         * @description Do when : the statistics on unique subjects is finished.
         */
        $rootScope.$on('SuccessStatisticsUserDataUniqueSubjects', function (event, stats) {
            console.log("SuccessStatisticsUserDataUniqueSubjects");
            console.log(stats);
            if (stats.data != undefined ){
                $rootScope.data.numberOfUniqueSubjects=stats.data.numberOfUniqueSubjects ;
            } else {
                $rootScope.data.numberOfUniqueSubjects=stats.numberOfUniqueSubjects ;
            }
            console.log( $rootScope.data.numberOfUniqueSubjects);
            $rootScope.haveStatsFinished = 1;
            $rootScope.showLoader = false;
        });
        /**
         * @description Do when : the statistics on unique objects is finished.
         */
        $rootScope.$on('SuccessStatisticsUserDataUniqueObjects', function (event, stats) {
            console.log("SuccessStatisticsUserDataUniqueObjects");
            console.log(stats);
            if (stats.data != undefined ){
                $rootScope.data.numberOfUniqueObjects =stats.data.numberOfUniqueObjects  ;
            } else {
                $rootScope.data.numberOfUniqueObjects =stats.numberOfUniqueObjects  ;
            }
            console.log( $rootScope.data.numberOfUniqueObjects);
            $rootScope.haveStatsFinished = 1;
            $rootScope.showLoader = false;

        });
        /**
         * @description When the RDF data the user tried to upload failed.
         */
        $rootScope.$on('POSTFailedDataUpload', function (event, message) {
            $rootScope.showLoader = false;
            console.log("POSTFailedDataUpload =>" + message);
            $rootScope.alerts.push({ id: "postFailedDataUpload", type: 'error', msg: 'We were not able to upload your RDF file. '+ message });

        });

        /**
         * @description When the ORCID API call fails - create error.
         */
        $rootScope.$on('FailORCIDData', function (event, message) {
            console.log("FailORCIDData =>" + message);
            $rootScope.alerts.push({ id: "FailORCIDData", type: 'error', msg: message });

        });
        /**
         * @description When it is not possible to do the stats throw error to user.
         */
        $rootScope.$on('StatsFailed', function (event, message) {
            console.log("StatsFailed! ==> " + message);
            $rootScope.showLoader = false;
            $rootScope.haveStatsFinished = 1; // if they failed well - no reason to restrict user
            $rootScope.alerts.push({ id: "statsFailed", type: 'warning', msg: 'We were not able to complete all statistical analysis. ' + message });

        });

        /**
         * @description When some other controller changes data used.
         */
        $rootScope.$on('DataChanged', function (event, x) {
            $rootScope.data = x;
        });
        /**
         * @description The services request the most recent version of the data.
         */
        $rootScope.$on('needData', function (event) {
            voidData.setData($rootScope.data);
        });
        /**
         * @description Download failed. Check services URLPreface.
         */
        $rootScope.$on("FailedDownload", function (ev, status) {
            $rootScope.alerts.push({ type: 'error', msg: 'Failed to download void.' });
        });
        /**
         * @description Fields that need to be filled in by the user.
         */
        $rootScope.$on("changedMustFields", function (ev, data) {
            $rootScope.mustFields = data;
        });
        /**
         * @deprecated
         */
        $rootScope.$on('TurtleChanged', function (event, x) {
            $rootScope.turtle = x;
            $rootScope.showLoader = false;
        });

        /**
         * The user changed the sources he/she has provided.
         */
        $rootScope.$on('DataSourcesChanged', function (event, x) {
            $rootScope.data.sources = x;
        });

        /**
         * @description When the services require the most resent information about the contributors.
         */
        $rootScope.$on('getContributors', function (event) {
            $rootScope.$broadcast('sendContributors' ,  $rootScope.data.contributors);
        });

        /**
         * @description When the services or another controller change the contributors make sure they are updated here.
         */
        $rootScope.$on('ContributorsChanged', function (event, x) {
            $rootScope.data.contributors = x;
            console.log( $rootScope.data.contributors);
        });


        $rootScope.$on('getDistributions', function (event) {
            console.log("Got in get Distributions what do i do?!?!?");
            //$rootScope.$broadcast('sendDistributions' ,  $rootScope.data.distributions);
        });

        /**
         * @description When the services or another controller change the contributors make sure they are updated here.
         */
        $rootScope.$on('DistributionsChanged', function (event, x) {
            $rootScope.data.distributions = x;
            console.log( $rootScope.data.distributions);
        });

        /**
         * @description Starts loader gif - at start of page, when void is created or upload of data is done.
         */
        $rootScope.$on('StartLoader', function (event) {
            $rootScope.showLoader = true;
        });
        /**
         * @description When user has been able to download the data - show a friendly congratz.
         */
        $rootScope.$on('SuccessDownload', function (event) {
            $rootScope.showLoader = false;
            $rootScope.alerts.push({ type: 'success', msg: 'Well done! You successfully downloaded your void.ttl! - If download does not start, please make sure you allow popups.' });
        });
        /**
         * @description When the services say the VoID has been uploaded successfully notify the user and change all fields of the UI.
         */
        $rootScope.$on('SuccessUpload', function (event, uploadResult) {
            $rootScope.data = uploadResult;
            $rootScope.showLoader = false;
            $rootScope.$broadcast('ChangeInSourcesFromUpload', $rootScope.data.sources);
            $rootScope.$broadcast('ChangeInDistributionsFromUpload', $rootScope.data.distributions);
            $rootScope.uploadErrorMessages ="<h4 class='h4Success'>Upload was successful!</h4>";
        });
        /**
         * @description When uploading the VoID to the server and something goes wrong. (format , server , ..)
         */
        $rootScope.$on('POSTFailedUpload', function (event, message) {
            $rootScope.showLoader = false;
            var returnString = "";
            if (returnString == "") returnString += "<h4 class='h4NeededFields'>Upload Errors</h4>";
            returnString +=( "<p class='neededFields'>"+message+"</p>");
            returnString +=( "<p class='neededFields'> Failed to upload the VoiD file you provided!</p>");
            returnString +=( "<p class='neededFields'> Please be aware you must only upload VoID generated by the editor!</p>");
            $rootScope.uploadErrorMessages =returnString;
            $rootScope.showLoader = false;
        });
        /**
         * @description Checking that the information of the sources meets all critiria.
         */
        $rootScope.$on('checkSources', function (event) {
            var result;
            $rootScope.checkSources();

            if ($rootScope.noURI != -1) result = $rootScope.addAlert("URI")
            else if ($rootScope.noVersion != -1) $rootScope.addAlert("versionSource");
            else if ($rootScope.showOther == true && ( $rootScope.data.licence.indexOf("://") == -1)) {
                result = $rootScope.addAlert("licence");
            }
            else if ($rootScope.noWebpage != -1) result=$rootScope.addAlert("webpageSource");
            else if ($rootScope.noDescription != -1) result=$rootScope.addAlert("webpageSource");
            else result = "passed";

            voidData.setUriForSourcesExist(result);
        });

        $rootScope.$on('checkDistributions', function (event) {
            var result;
            $rootScope.checkDistributions();

            if ($rootScope.noURLDistribution != -1) result = $rootScope.addAlert("URLDistributions")

            else result = "passed";

            voidData.setUriForSourcesExist(result);
        });

        /**
         * @function closeAlert
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @description Closes an alert displayed on screen.
         * @param {int} index - Index of alert to be removed.
         */
        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };
        /**
         * @function otherLicence
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @description When the user chooses to describe a licence that is not provided.
         * @param {String} val
         */
        $rootScope.otherLicence = function (val) {
            if (val == "other") {
                $rootScope.data.licence = "";
                $rootScope.showOther = true;
            } else {
                $rootScope.showOther = false;
            }
        };

        /**
         * @function letUserUploadData
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @description User is uploading RDF data for statistical analysis.
         * @param {Array} files - An array of inputstreams to be used by the server.
         */
        $rootScope.letUserUploadData = function (files) {
            var data = new FormData();
            $rootScope.uploadErrorMessages = "";
            $rootScope.showLoader = true;
            data.append('file', files[0]);//first file
            uploadUserData.process(data);
        };

        /**
         * @function callORCIDEndpoint
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @description is the information provided is the correct length for an ORCID ID, if so call ORCID API.
         */
        $rootScope.callORCIDEndpoint = function() {
            if ( $rootScope.data.ORCID !=undefined&&  $rootScope.data.ORCID.length >= 16 )
            {
                var tmp =  $rootScope.data.ORCID.replace(/-/g, '');
                if (tmp.length>=16){
                    ORCIDService.callORCIDEndpoint($rootScope.data.ORCID);
                }
            }
        }
        /**
         * @function callSparqlEndpoint
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @description Queries Sparql Endpoint for statistical analysis.
         */
        //TODO
        $rootScope.callSparqlEndpoint = function() {
            if ( $rootScope.data.sparqlEndpoint !=undefined&&  $rootScope.data.sparqlEndpoint.indexOf("://") != -1)
            {
                console.log("got in callSparqlEndpoint");
                $rootScope.haveStatsFinished = -1;
                voidData.querySparqlEndPoint($rootScope.data);
            }
        }

        /**
         * @function checkMustFieldsOnPreviousPage
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @description Checks what fields that are required are not filled.
         * @param index The page to have its fields checked.
         */
        $rootScope.checkMustFieldsOnPreviousPage = function (index) {
            if (index >= 0 && index < $rootScope.mustFields.length) {
                for (var i = 0; i < $rootScope.mustFields.length; i++) {
                    if ($rootScope.mustFields[i].index == index) {
                        for (var j = 0; j < $rootScope.mustFields[i].mustFields.length; j++) {
                            var mustFieldsToCheck = $rootScope.mustFields[i].mustFields[j];
                            if (mustFieldsToCheck == "title" && ( $rootScope.data.title.length < 2)) {
                                if ($rootScope.checkIfAlertNeedsAdding("title")) $rootScope.addAlert("title");
                            } else if (mustFieldsToCheck == "title" && $rootScope.data.title.length > 2) {
                                $rootScope.removeAlert("title");
                            }
                            if (mustFieldsToCheck == "description" && $rootScope.data.description.length < 5) {
                                if ($rootScope.checkIfAlertNeedsAdding("description")) $rootScope.addAlert("description");
                            } else if (mustFieldsToCheck == "description" && $rootScope.data.description.length > 5) {
                                $rootScope.removeAlert("description");
                            }
                            if (mustFieldsToCheck == "publisher" && $rootScope.data.publisher.indexOf("://") == -1) {
                                if ($rootScope.checkIfAlertNeedsAdding("publisher")) $rootScope.addAlert("publisher");
                            } else if (mustFieldsToCheck == "publisher" && $rootScope.data.publisher.indexOf("://") >= 0) {
                                $rootScope.removeAlert("publisher");
                            }
                            if (mustFieldsToCheck == "webpage" && $rootScope.data.webpage.indexOf("://") == -1) {
                                if ($rootScope.checkIfAlertNeedsAdding("webpage"))$rootScope.addAlert("webpage");
                            } else if (mustFieldsToCheck == "webpage" && $rootScope.data.webpage.indexOf("://") >= 0 ) {
                                $rootScope.removeAlert("webpage");
                            }
                            if (mustFieldsToCheck == "distributions" && $rootScope.data.distributions.length < 1) {
                                if ($rootScope.checkIfAlertNeedsAdding("distributions")) $rootScope.addAlert("distributions");
                            } else if (mustFieldsToCheck == "distributions" && $rootScope.data.distributions.length >= 1){
                                $rootScope.removeAlert("distributions");
                            }
                        }
                    }//if
                }//for
            }//if
        };
        /**
         * @function checkIfAlertNeedsAdding
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @description Checks if the alert required to be added, is already there.
         * @param id2Check ID of the error.
         * @returns {boolean} If alert already exists are not.
         */
        $rootScope.checkIfAlertNeedsAdding = function (id2Check){
            var addAlert = true;
            for (var k = 0; k < $rootScope.alerts.length; k++) {
                if ($rootScope.alerts[k].id == id2Check ) addAlert = false;
            }
            return addAlert;
        };
        /**
         * @function removeAlert
         * @description Removes an alert by its given ID.
         * @param id2Remove ID of alert to remove.
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         */
        $rootScope.removeAlert =function(id2Remove){
            for (var k = 0; k < $rootScope.alerts.length; k++) {
                if ($rootScope.alerts[k].id == id2Remove)$rootScope.alerts.splice(k, 1);
            }
        };


        /**
         * @function fieldsToAdd
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @description In the final page of the UI display to the user once more what info is needed.
         * @returns {string} HTML code to be added on the last slide to show user information that is needed.
         */
        $rootScope.fieldsToAdd = function () {
            var returnString = "",
                header = "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";

            $rootScope.checkSources ();
            $rootScope.checkDistributions();

            if ($rootScope.data.title == "") {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'>Title of your dataset in \"Core Info\"</p>";
            }
            if ($rootScope.data.description == "") {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'>Description for your dataset in \"Core Info\"</p>";
            }
            if ($rootScope.data.publisher == "") {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'>Publishing institution in \"Core Info\"</p>";
            }
            if ($rootScope.data.webpage == "") {
                if (returnString == "") returnString +=header;
                returnString += "<p class='neededFields'>Webpage of documentation in \"Core Info\" </p>";
            }
            if ($rootScope.data.distributions.length < 1) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> Provide at least one distribution at \"Distribution Info\" </p> ";
            }

            if ($rootScope.noURLDistribution != -1) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> A URL for the distribution you cited in \"Distribution Info \" </p> ";
            }
            if ($rootScope.showOther == true && ( $rootScope.data.licence.indexOf("http") == -1)) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> A URI for the licence you choose in \"Core Info\" </p> ";
            }
            if ($rootScope.noURI != -1) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> A URI for the source you cited in \"Sources \" </p> ";
            }
            if ($rootScope.noVersion != -1) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> A version number for the source you cited in \"Sources \" </p> ";
            }
            if ($rootScope.noWebpage != -1) {
                if (returnString == "") returnString +=header;
                returnString += "<p class='neededFields'> A webpage for the source you cited in \"Sources \" </p> ";
            }
            if ($rootScope.noDescription != -1) {
                if (returnString == "") returnString +=header;
                returnString += "<p class='neededFields'> A description for the source you cited in \"Sources \" </p> ";
            }

            if (returnString == ""){
                 $rootScope.disabledExport = false
                 $rootScope.finalHeader = "Congratulations you now have a dataset description!";
            } else{
                $rootScope.finalHeader = "You have almost created a dataset description...";
                $rootScope.disabledExport = true
            };

            if ($rootScope.haveStatsFinished == -1) {
                if (returnString == "") returnString +=header;
                $rootScope.showLoader = true;
                returnString += "<p class='neededFields'> Statistical analysis of you data is being done, if you wanted this included please wait </p> ";
            }

            return returnString;
        };
        /**
         * @function checkSources
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         */
        $rootScope.checkSources =function(){
            $rootScope.noURI = -1;
            $rootScope.noVersion = -1;
            $rootScope.noWebpage = -1;
            $rootScope.noDescription = -1;
            if ($rootScope.data.sources != undefined ){
                for (var i = 0; i < $rootScope.data.sources.length; i++) {
                    if ($rootScope.data.sources[i].URI == undefined
                        || $rootScope.data.sources[i].URI == ""
                        || $rootScope.data.sources[i].URI.indexOf("://") == -1) $rootScope.noURI = i;

                    if ($rootScope.data.sources[i].version == "") $rootScope.noVersion = i;

                    if ($rootScope.data.sources[i].webpage == undefined
                        || $rootScope.data.sources[i].webpage == ""
                        || $rootScope.data.sources[i].webpage.indexOf("://") == -1) $rootScope.noWebpage = i;

                    if ($rootScope.data.sources[i].description == "") $rootScope.noDescription = i;
                }
            }
        };


        $rootScope.checkDistributions =function(){
            $rootScope.noURLDistribution = -1;
            if ($rootScope.data.distributions != undefined ){
                for (var i = 0; i < $rootScope.data.distributions.length; i++) {
                    if ($rootScope.data.distributions[i].URL == undefined
                        || $rootScope.data.distributions[i].URL == ""
                        || $rootScope.data.distributions[i].URL.indexOf("://") == -1) $rootScope.noURLDistribution = i;
                }
            }
        };

        /**
         * @function addAlert
         * @description Given the ID add the appropriate Alert / Error .
         * @param id2Add ID of alert to be added.
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCtrl
         * @returns {string}
         */
        $rootScope.addAlert = function(id2Add){
            switch(id2Add) {
                case "URI":
                    $rootScope.alerts.push({ id: "URI", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the source you cited! Please provide this information.' });
                    break;
                case "licence":
                    $rootScope.alerts.push({ id: "licence", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the licence you choose! Please provide this information.' });
                    break;
                case "versionSource":
                    $rootScope.alerts.push({ id: "versionSource", type: 'error', msg: 'Ooops! You forgot to gives us a version for the source you cited! Please provide this information.' });
                    break;
                case "webpageSource":
                    $rootScope.alerts.push({ id: "webpageSource", type: 'error', msg: 'Ooops! You forgot to gives us a webpage for source you cited! Please provide this information.' });
                    break;
                case "descriptionSource":
                    $rootScope.alerts.push({ id: "descriptionSource", type: 'error', msg: 'Ooops! You forgot to gives us a description for source you cited! Please provide this information.' });
                    break;
                case "title":
                    $rootScope.alerts.push({ id: "title", type: 'error', msg: 'Ooops! You forgot to gives us a title for your dataset! Please provide this information.' });
                    break;
                case "description":
                    $rootScope.alerts.push({ id: "description", type: 'error', msg: 'Ooops! You forgot to gives us a description! Please provide this information.' });
                    break;
                case "publisher":
                    $rootScope.alerts.push({ id: "publisher", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the publisher you choose! Please provide this information.' });
                    break;
                case "webpage":
                    $rootScope.alerts.push({ id: "webpage", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the webpage of your documentation! Please provide this information.' });
                    break;
                case "distributions":
                    $rootScope.alerts.push({ id: "distributions", type: 'error', msg: 'Ooops! You forgot to gives us a distribution of your dataset! Please provide this information.' });
                    break;
                case "URLDistributions":
                    $rootScope.alerts.push({ id: "URLDistributions", type: 'error', msg: 'Ooops! You forgot to gives us a URL for one of the distributions you provided! Please provide this additional information.' });
                    break;
            }
            return "failed";
        }
    }]);

/**
 *  @description Controller responsible for making the service calls for the creation and the download of the VoID.
 *  @memberOf  voidEditor.editorApp.editorAppControllers
 *  @class  voidEditor.editorApp.editorAppControllers.editorFormCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 *  @param {http} $http - Allows http connections.
 */
editorAppControllers.controller('editorFormCtrl', ['$rootScope' , '$scope', '$http', 'voidData',
    function ($rootScope, $scope, $http, voidData) {
        /**
         * @function createVoid
         * @description Calls the service to create  VoID for Modal.
         */
        $rootScope.createVoid = function () {
            voidData.createVoid();
        };

        /**
         * @function downloadFile
         * @description Calls service to create VoID for download.
         */
        $rootScope.downloadFile = function () {
            voidData.createVoidAndDownload();
            window.open('/rest/void/file');
        };
    }]);

/**
 *  @description Controller responsible for the contributor addition functionality.
 *  @memberOf  voidEditor.editorApp.editorAppControllers
 *  @class  voidEditor.editorApp.editorAppControllers.editorContributorsCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 *  @param {Service} ContributorORCIDService - Makes calls to ORCID Api to retrieve information of the contributors.
 */
editorAppControllers.controller('editorContributorsCtrl', ['$rootScope' , '$scope', 'voidData', 'ContributorORCIDService',
    function ($rootScope, $scope , voidData ,ContributorORCIDService) {
        $scope.contributors = $rootScope.data.contributors;
        $scope.orcidCheck = 0;

        if ( $scope.contributors.length == 0 ){
            $scope.contributors.push({name : "New" , surname : "Contributor" , orcid:"", email:"-" , id:0, author:false ,curator:false, contributor:true});
        }

        $rootScope.$on('sendContributors', function (event , x ) {
            console.log("retrieve contributors " );
            console.log(x);
            $scope.contributors = x;
        });

        /**
         * @function callORCIDEndpointContributor
         * @memberOf voidEditor.editorApp.editorAppControllers.editorContributorsCtrl
         * @description Calling ORCID Api to retrieve info for each contributor.
         * @param value
         */
        $scope.callORCIDEndpointContributor = function(value) {
            console.log(angular.element(value).scope().$index);
            var index = angular.element(value).scope().$index;

            if (   $scope.contributors[index].orcid !=undefined&&    $scope.contributors[index].orcid.length >= 16 )
            {
                $scope.orcidCheck =  index;
                var tmp =   $scope.contributors[index].orcid.replace(/-/g, '');
                if (tmp.length>=16){
                    ContributorORCIDService.callORCIDEndpointContributor(  $scope.contributors[index].orcid);
                }
            }
        }

        $rootScope.$on('SuccessORCIDDataContributor', function (event, ORCIDJSON) {
            console.log(ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"]);
            var details = ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"];
            $scope.contributors[ $scope.orcidCheck].name =details["given-names"].value;
            $scope.contributors[ $scope.orcidCheck].surname =details["family-name"].value;
            $scope.save();
            $scope.$apply();
        });

        /**
         * @function add
         * @memberOf voidEditor.editorApp.editorAppControllers.editorContributorsCtrl
         * @description Add annother contributor to the list.
         */
        $scope.add = function () {
            if ($scope.contributors == undefined ) $scope.contributors = [];
            if ($scope.contributors.length>0 )
                $scope.contributors.push({name : "" , surname : "" , orcid:"", email:"-" ,
                        id:( $scope.contributors[$scope.contributors.length -1].id +1) , author:false ,curator:false, contributor:true});
            else $scope.contributors.push({name : "" , surname : "" , orcid:"", email:"-" , id:0, author:false ,curator:false, contributor:true });
            voidData.setContributorData($scope.contributors);
        };

        /**
         * @function save
         * @memberOf voidEditor.editorApp.editorAppControllers.editorContributorsCtrl
         * @description Save the contributors the user has provided.
         */
        $scope.save= function(){
            voidData.setContributorData($scope.contributors);
        }

        /**
         * @function removeContributor
         * @memberOf voidEditor.editorApp.editorAppControllers.editorContributorsCtrl
         * @description Remove the selected contributor.
         * @param id
         */
        $scope.removeContributor = function (id) {
            var found = false;
            console.log("removeContributor - " + $scope.contributors.length);
            var i = 0;
            while (i < $scope.contributors.length && !found) {
                if ($scope.contributors[i].id == id ) found = true;
                else i++;
            }
            if (found) {
                $scope.contributors.splice(i, 1);
                voidData.setContributorData($scope.contributors);
            }
        };

    }]);


/**
 *  @description Allows user to upload a VoID file so it can be updated.
 *  @memberOf  voidEditor.editorApp.editorAppControllers
 *  @class  voidEditor.editorApp.editorAppControllers.editorUploadCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {http} $http - Allows http connections.
 *  @param {Service} uploadVoidData - Allows the user to upload VoID data to the server.
 */
editorAppControllers.controller('editorUploadCtrl', ['$rootScope' , '$scope', '$http', 'uploadVoidData',
    function ($rootScope, $scope, $http, uploadVoidData) {
        $rootScope.uploadVoid = function (files) {
            var data = new FormData();
            $rootScope.showLoader = true;
            data.append('file', files[0]);//first file
            uploadVoidData.process(data);
        };
    }]);

/**
 *  @description The controller which fills the carousel with the appropriate pages.
 *  @memberOf  voidEditor.editorApp.editorAppControllers
 *  @class  voidEditor.editorApp.editorAppControllers.editorCarouselCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 */
editorAppControllers.controller('editorCarouselCtrl', ['$scope', '$rootScope',
    function CarouselCtrl($scope, $rootScope) {
        $scope.interval = -1;
        $rootScope.dynamicProgress = 0;
        $rootScope.dynamicProgressStep = 0;
        $scope.wrap = false;
        $rootScope.mustFields = [];

        var slides = $scope.slides = [];
        /**
         * @memberOf voidEditor.editorApp.editorAppControllers.editorCarouselCtrl
         * @param i Index of the slide to be added
         * @param title The title to be displayed for that slide.
         * @param mustFields What fields in that slide are necessary.
         */
        $scope.addSlide = function (i, title, mustFields) {
            var temp;
            if (i != 0)   temp = "partials/datasets/page" + i + ".html";
            else  temp = "partials/datasets/page.html";

            var percentageOfChange = (100 / 6 ) - 0.0001;
            $rootScope.dynamicProgressStep = percentageOfChange;
            $rootScope.mustFields.push({'index': i, 'mustFields': mustFields });
            $rootScope.$broadcast("changedMustFields", $rootScope.mustFields);
            slides.push({'page': temp, 'index': i, 'progress': (i + 1) * percentageOfChange % 100, 'title': title });
        };
        /**
         * Slides to add - (ID , "Title" , [Fields that must be filled])
         */
        $scope.addSlide(0, "User Info", []);
        $scope.addSlide(1, "Core Info", ["title" , "description", "publisher", "webpage" ]);
        $scope.addSlide(2, "Distribution Info", [ "distributions"]);
        $scope.addSlide(3, "Versioning", []);
        $scope.addSlide(4, "Sources", []);
        $scope.addSlide(5, "Export RDF", []);

        $scope.changeProgressBar = function (change) {
            $rootScope.dynamicProgress = change;
        };

    }
]);

/**
 *  @description Controller which manages the selection, addition and removal of incorporated sources in the dataset description.
 *  @memberOf  voidEditor.editorApp.editorAppControllers
 *  @class  voidEditor.editorApp.editorAppControllers.sourceCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} JsonService - Downloads the OPS sources for the Open PHACTS API.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 */
editorAppControllers.controller('sourceCtrl', [ '$rootScope', '$scope', 'JsonService', 'voidData',
    function ($rootScope, $scope, JsonService, voidData) {
        $scope.userSources = [];
        $scope.selected = undefined;
        $scope.titles = [];
        $scope.aboutOfTitles = [];
        $scope.descriptionsOfTitles = [];
        $scope.sources = [];
        $scope.showInputURI = false;

        /**
         * @function noTitleFilter
         * @memberOf voidEditor.editorApp.editorAppControllers.sourceCtrl
         * @param item A Source object.
         * @returns {boolean} If title is String.
         */
        $scope.noTitleFilter = function (item) {
            return typeof item.title == 'string';
        };
        /**
         * @function extractTitlesOfSources
         * @memberOf voidEditor.editorApp.editorAppControllers.sourceCtrl
         * @description Extract titles of the sources from the OPS JSON.
         */
        $scope.extractTitlesOfSources = function () {
            for (var i = 0; i < $scope.sources.length; i++) {
                $scope.titles.push($scope.sources[i].title);
                $scope.aboutOfTitles.push($scope.sources[i]._about);
                $scope.descriptionsOfTitles.push($scope.sources[i].description);
            }
        };
        /**
         * @function JsonService.get
         * @memberOf voidEditor.editorApp.editorAppControllers.sourceCtrl
         * @description Retrievs all source information from OPS.
         */
        JsonService.get(function (data) {
            $scope.sources = data.result.primaryTopic.subset;
            $scope.extractTitlesOfSources();
        });

        /**
         * @function addToSelected
         * @memberOf voidEditor.editorApp.editorAppControllers.sourceCtrl
         * @description Add a source to the users cited sources.
         * @param {String} value
         */
        $scope.addToSelected = function (value) {
            var found = 0;
            if ($scope.userSources == undefined ) $scope.userSources = [];

            for (var i = 0; i < $scope.userSources.length; i++) {
                if ($scope.userSources[i].title == value) found = 1;
            }

            if (!found && value != undefined && value != "") {

                var foundURI = -1;
                for (var i = 0; i < $scope.titles.length; i++) {
                    if ($scope.titles[i] == value) foundURI = i;
                }
                var _about =value ;
                if (foundURI != -1) {
                    _about = $scope.aboutOfTitles[foundURI];
                    $scope.userSources.push({"title": value, "type": "RDF", "URI": _about, "version": "", "webpage": _about, "description":  $scope.descriptionsOfTitles[foundURI], "noURI": false });
                } else {
                    $scope.showInputURI = true;
                    $scope.userSources.push({"title": value, "type": "RDF", "URI": "", "version": "", "webpage": "", "description": "", "noURI": true });
                }
                voidData.setSourceData($scope.userSources);
            }
        };

        /**
         * @function removeSelected
         * @memberOf voidEditor.editorApp.editorAppControllers.sourceCtrl
         * @param {String} value The title to be removed.
         */
        $scope.removeSelected = function (value) {
            var found = false;
            var i = 0;
            while (i < $scope.userSources.length && !found) {
                if ($scope.userSources[i].title == value) found = true;
                else i++;
            }
            if (found) {
                $scope.userSources.splice(i, 1);
                voidData.setSourceData($scope.userSources);
            }
        };

        $rootScope.$on('ChangeInSourcesFromUpload', function (event, sources) {
            $scope.userSources = sources;
        })
    }]);


editorAppControllers.controller('distributionCtrl', [ '$rootScope', '$scope', 'voidData',
    function ($rootScope, $scope, voidData) {
        $scope.selected = undefined;
        $scope.userDistributions = [];
        $scope.distributions = [{"name":"RDF" },
                                {"name":"Datadump" },
                                {"name":"CSV" },
                                {"name":"SDF" },
                                {"name":"TSV" },
                                {"name":"JSON-LD" },
                                {"name":"XML" }];


        $scope.addToSelected = function (value) {
            var found = 0;
            if ($scope.userDistributions == undefined ) $scope.userDistributions = [];

            for (var i = 0; i < $scope.userDistributions.length; i++) {
                if ($scope.userDistributions[i].name == value) found = 1;
            }

            if (!found && value != undefined && value != "" && value!="RDF") {
                $scope.userDistributions.push({"name": value, "URL": "", "version": "-" , "isRDF": false, "sparqlEndpoint":"---" });
                voidData.setDistributionData($scope.userDistributions);
            }else if (!found && value != undefined && value != "" ){
                $scope.userDistributions.push({"name": value, "URL": "", "version": "-" , "isRDF": true, "sparqlEndpoint":"---" });
                voidData.setDistributionData($scope.userDistributions);
            }
        };

        $scope.removeSelected = function (value) {
            var found = false;
            var i = 0;
            while (i < $scope.userDistributions.length && !found) {
                if ($scope.userDistributions[i].name == value) found = true;
                else i++;
            }
            if (found) {
                $scope.userDistributions.splice(i, 1);
                voidData.setDistributionData($scope.userDistributions);
            }
        };

       $rootScope.$on('ChangeInDistributionsFromUpload', function (event, distr) {
            $scope.userDistributions = distr;
        })
    }]);


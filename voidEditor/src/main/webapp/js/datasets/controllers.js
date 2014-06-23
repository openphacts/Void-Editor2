'use strict';

/**
 *  @class voidEditor.editorAppControllers
 */
var editorAppControllers = angular.module('editorAppControllers', ['jsonService', 'voidDataService', 'voidUploadService', 'ORCIDService',
                                'userDataUploadService','modalControllers' ,'ContributorORCIDService']);
/**
 *  @function
 *  @description Main controller that instanciate all the information needed by the UI / VoID creation backend.
 *  @class voidEditor.editorAppControllers.editorCtrl
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
        $rootScope.data.sparqlEndpoint = "";
        $rootScope.data.sources = [];
        $rootScope.data.contributors = [];
        $rootScope.quantity = 6;
        $rootScope.data.updateFrequency = "Annual";
        $rootScope.postFinished = false;
        $rootScope.data.licence = "http://creativecommons.org/licenses/by-sa/3.0/";
        $rootScope.alerts = [];
        $rootScope.data.downloadFrom = "";
        $rootScope.mustFields = [];
        $rootScope.isCollapsed = false;
        $rootScope.showLoader = false;
        $rootScope.isCollapsedContributor = false;
        $rootScope.uploadErrorMessages = "";
        $rootScope.noURI = -1;
        $rootScope.noVersion = -1;
        $rootScope.noWebpage = -1;
        $rootScope.noDescription = -1;
        $rootScope.data.totalNumberOfTriples= "";
        $rootScope.data.numberOfUniqueSubjects="";
        $rootScope.data.numberOfUniqueObjects ="";
        $rootScope.haveStatsFinished = 1;
        $rootScope.data.ORCID = "";
        $rootScope.data.datasetType = "RDF";
        $rootScope.doYouHaveOrcidValue = true;

        var ua = window.navigator.userAgent;
        $rootScope.msie = ua.indexOf ( ".NET" );
        $rootScope.finalHeader = "Almost there...";
        $rootScope.LinkToDownloadDataQuestion = "Where could we download your RDF from?*";
        $rootScope.LinkToDownloadDataHelp = "Where could we download the data from if we required to. This information is required and must be URL.";

        $rootScope.$on('SuccessORCIDData', function (event, ORCIDJSON) {
            console.log(ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"]);
            var details = ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"];
            $rootScope.data.givenName =details["given-names"].value;
            $rootScope.data.familyName =details["family-name"].value;
            $rootScope.removeAlert("FailORCIDData");
        });

        $rootScope.$on('SuccessUploadUserData', function (event, uploadResult) {
            $rootScope.showLoader = false;
            console.log("SuccessUploadUserData");
            $rootScope.removeAlert("postFailedDataUpload");
        });

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

        $rootScope.$on('POSTFailedDataUpload', function (event, message) {
            $rootScope.showLoader = false;
            console.log("POSTFailedDataUpload =>" + message);
            $rootScope.alerts.push({ id: "postFailedDataUpload", type: 'error', msg: 'We were not able to upload your RDF file. '+ message });

        });

        $rootScope.$on('FailORCIDData', function (event, message) {
            console.log("FailORCIDData =>" + message);
            $rootScope.alerts.push({ id: "FailORCIDData", type: 'error', msg: message });

        });

        $rootScope.$on('StatsFailed', function (event, message) {
            console.log("StatsFailed! ==> " + message);
            $rootScope.showLoader = false;
            $rootScope.haveStatsFinished = 1; // if they failed well - no reason to restrict user
            $rootScope.alerts.push({ id: "statsFailed", type: 'warning', msg: 'We were not able to complete all statistical analysis. ' + message });

        });

        $rootScope.$on('DataChanged', function (event, x) {
            $rootScope.data = x;
        });

        $rootScope.$on('needData', function (event) {
            voidData.setData($rootScope.data);
        });

        $rootScope.$on("FailedDownload", function (ev, status) {
            $rootScope.alerts.push({ type: 'error', msg: 'Failed to download void.' });
        });

        $rootScope.$on("changedMustFields", function (ev, data) {
            $rootScope.mustFields = data;
        });

        $rootScope.$on('TurtleChanged', function (event, x) {
            $rootScope.turtle = x;
            $rootScope.showLoader = false;
        });

        $rootScope.$on('DataSourcesChanged', function (event, x) {
            $rootScope.data.sources = x;
        });

        $rootScope.$on('getContributors', function (event) {
            $rootScope.$broadcast('sendContributors' ,  $rootScope.data.contributors);
        });

        $rootScope.$on('ContributorsChanged', function (event, x) {
            $rootScope.data.contributors = x;
            console.log( $rootScope.data.contributors);
        });

        $rootScope.$on('StartLoader', function (event) {
            $rootScope.showLoader = true;
        });

        $rootScope.$on('SuccessDownload', function (event) {
            $rootScope.showLoader = false;
            $rootScope.alerts.push({ type: 'success', msg: 'Well done! You successfully downloaded your void.ttl! - If download does not start, please make sure you allow popups.' });
        });

        $rootScope.$on('SuccessUpload', function (event, uploadResult) {
            $rootScope.data = uploadResult;
            $rootScope.showLoader = false;
            $rootScope.$broadcast('ChangeInSourcesFromUpload', $rootScope.data.sources);
            $rootScope.uploadErrorMessages ="<h4 class='h4Success'>Upload was successful!</h4>";
        });

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

        $rootScope.$on('checkSources', function (event) {
            var result;
            $rootScope.checkSources ();

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

        /**
         * @function
         * @description Closes an alert displayed on screen.
         * @param index
         */
        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };
        /**
         * @function
         * @description When the user chooses to describe a licence that is not provided.
         * @param val
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
         * @function
         * @description User is uploading RDF data for statistical analysis.
         * @param files
         */
        $rootScope.letUserUploadData = function (files) {
            var data = new FormData();
            $rootScope.uploadErrorMessages = "";
            $rootScope.showLoader = true;
            data.append('file', files[0]);//first file
            uploadUserData.process(data);
        };

        /**
         * @function
         * @description Checks is the information provided is the correct length for an ORCID ID, if so call ORCID API.
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
         * @function
         * @description Queries Sparql Endpoint for statistical analysis.
         */
        $rootScope.callSparqlEndpoint = function() {
            if ( $rootScope.data.sparqlEndpoint !=undefined&&  $rootScope.data.sparqlEndpoint.indexOf("://") != -1)
            {
                console.log("got in callSparqlEndpoint");
                $rootScope.haveStatsFinished = -1;
                voidData.querySparqlEndPoint($rootScope.data);
            }
        }

        /**
         * @function
         * @description Changes the questions displayed to the user depending if the dataset provided is RDF or Not.
         */
        $rootScope.changeQuestionForDownloadData= function(){
            console.log($rootScope.data.datasetType);
            if ($rootScope.data.datasetType == "RDF"){
                $rootScope.LinkToDownloadDataQuestion = "Where could we download your RDF from?*";
                $rootScope.LinkToDownloadDataHelp = "Where could we download the data from if we required to. " +
                    "This information is required and must be URL.";
            }else{
                $rootScope.LinkToDownloadDataQuestion = "Dataset distribution description for your dataset:*";
                $rootScope.LinkToDownloadDataHelp = "Where could we find the dataset distribution description, if we required to." +
                    " This information is required and must be URL.";
            }
            $rootScope.removeAlert("downloadFrom");
        }

        /**
         * @function
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
                            if (mustFieldsToCheck == "downloadFrom" && $rootScope.data.downloadFrom.indexOf("://") == -1) {
                                if ($rootScope.checkIfAlertNeedsAdding("downloadFrom")) $rootScope.addAlert("downloadFrom");
                            } else if (mustFieldsToCheck == "downloadFrom" && $rootScope.data.downloadFrom.indexOf("://") >= -1){
                                $rootScope.removeAlert("downloadFrom");
                            }
                        }
                    }//if
                }//for
            }//if
        };
        /**
         * @function
         * @description Checks if the alert required to be added, is already there.
         * @param id2Check ID of the error.
         * @returns {boolean}
         */
        $rootScope.checkIfAlertNeedsAdding = function (id2Check){
            var addAlert = true;
            for (var k = 0; k < $rootScope.alerts.length; k++) {
                if ($rootScope.alerts[k].id == id2Check ) addAlert = false;
            }
            return addAlert;
        };
        /**
         * @function
         * @description Removes an alert by its given ID.
         * @param id2Remove
         */
        $rootScope.removeAlert =function(id2Remove){
            for (var k = 0; k < $rootScope.alerts.length; k++) {
                if ($rootScope.alerts[k].id == id2Remove)$rootScope.alerts.splice(k, 1);
            }
        };


        /**
         * @function
         * @description In the final page of the UI display to the user once more what info is needed.
         * @returns {string}
         */
        $rootScope.fieldsToAdd = function () {
            var returnString = "",
                header = "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";

            $rootScope.checkSources ();
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
                returnString += "<p class='neededFields'>Publishing institution in \"Publishing Info\"</p>";
            }
            if ($rootScope.data.webpage == "") {
                if (returnString == "") returnString +=header;
                returnString += "<p class='neededFields'>Webpage of documentation in \"Publishing Info\" </p>";
            }
            if ($rootScope.data.downloadFrom == "") {
                if (returnString == "") returnString += header;
                if ($rootScope.data.datasetType == "RDF") {
                    returnString += "<p class='neededFields'> RDF download link in \"Publishing Info\" </p> ";
                }else{
                    returnString += "<p class='neededFields'> Dataset distribution description in \"Publishing Info\" </p> ";
                }
            }
            if ($rootScope.showOther == true && ( $rootScope.data.licence.indexOf("http") == -1)) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> A URI for the licence you choose in \"Publishing Info\" </p> ";
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
         * @function
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
        }
        /**
         * @function
         * @description Given the ID add the appropriate Alert / Error .
         * @param id2Add
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
                case "downloadFrom":
                    if ($rootScope.data.datasetType == "RDF") {
                        $rootScope.alerts.push({ id: "downloadFrom", type: 'error', msg: 'Ooops! You forgot to gives us a URL to download your RDF data from! Please provide this information.' });
                    }else{
                        $rootScope.alerts.push({ id: "downloadFrom", type: 'error', msg: 'Ooops! You forgot to gives us a dataset distribution description! Please provide this information.' });
                    }
                    break;
            }
            return "failed";
        }
    }]);
/**
 *  @class voidEditor.editorAppControllers.editorFormCtrl
 */
editorAppControllers.controller('editorFormCtrl', ['$rootScope' , '$scope', '$http', 'voidData',
    function ($rootScope, $scope, $http, voidData) {
        /**
         * @function
         * @description Calls the service to create  VoID for Modal.
         */
        $rootScope.createVoid = function () {
            voidData.createVoid();
        };

        /**
         * @function
         * @description Calls service to create VoID for download.
         */
        $rootScope.downloadFile = function () {
            voidData.createVoidAndDownload();
            window.open('/rest/void/file');
        };
    }]);

/**
 *  @class voidEditor.editorAppControllers.editorContributorsCtrl
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
         * @function
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
         * @function
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
         * @function
         * @description Save the contributors the user has provided.
         */
        $scope.save= function(){
            voidData.setContributorData($scope.contributors);
        }

        /**
         * @function
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
 * @description Allows user to upload a VoID file so it can be updated.
 * @class voidEditor.editorAppControllers.editorUploadCtrl
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
 * @description The controller which fills the carousel with the appropriate pages.
 * @class voidEditor.editorAppControllers.editorCarouselCtrl
 */
editorAppControllers.controller('editorCarouselCtrl', ['$scope', '$rootScope',
    function CarouselCtrl($scope, $rootScope) {
        $scope.interval = -1;
        $rootScope.dynamicProgress = 0;
        $rootScope.dynamicProgressStep = 0;
        $scope.wrap = false;
        $rootScope.mustFields = [];

        var slides = $scope.slides = [];
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
        $scope.addSlide(1, "Core Info", ["title" , "description"]);
        $scope.addSlide(2, "Publishing Info", ["publisher", "webpage" , "downloadFrom"]);
        $scope.addSlide(3, "Versioning", []);
        $scope.addSlide(4, "Sources", []);
        $scope.addSlide(5, "Export RDF", []);

        $scope.changeProgressBar = function (change) {
            $rootScope.dynamicProgress = change;
        };

    }
]);
/**
 *  @class voidEditor.editorAppControllers.sourceCtrl
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
         * @function
         * @param item
         * @returns {boolean}
         */
        $scope.noTitleFilter = function (item) {
            return typeof item.title == 'string';
        };
        /**
         * @function
         * @description Extract titles of the sources from the OPS JSON.
         */
        $scope.extractTitlesOfSources = function () {
            for (var i = 0; i < $scope.sources.length; i++) {
                $scope.titles.push($scope.sources[i].title);
                $scope.aboutOfTitles.push($scope.sources[i]._about);
                $scope.descriptionsOfTitles.push($scope.sources[i].description);
            }
        };

        JsonService.get(function (data) {
            $scope.sources = data.result.primaryTopic.subset;
            $scope.extractTitlesOfSources();
        });

        /**
         * @function
         * @description Add a source to the users cited sources.
         * @param value
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
         * @function
         * @param value
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



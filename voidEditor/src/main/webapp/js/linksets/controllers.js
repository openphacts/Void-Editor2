'use strict';

/**
 * @author Lefteris Tatakis
 * @class linksetCreator.linksetApp.linksetAppControllers
 */
var linksetAppControllers = angular.module('linksetAppControllers', ['jsonService', 'voidDataService',  'ORCIDService',
                               'modalControllers' ]);
/**
 *  @description Main controller that instantiate all the information needed by the UI / VoID creation backend.
 *  @memberOf  linksetCreator.linksetApp.linksetAppControllers
 *  @class  linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 *  @param {Service} ORCIDService - Service that communicates with the ORCID API.
 */
linksetAppControllers.controller('linksetCtrl', [  '$scope', '$rootScope', 'voidData', 'ORCIDService',
    function ($scope, $rootScope, voidData , ORCIDService) {
        $scope.title = 'Linkset Creator';
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
        $rootScope.quantity = 6;
        $rootScope.postFinished = false;
        $rootScope.data.licence = "http://creativecommons.org/licenses/by-sa/3.0/";
        $rootScope.alerts = [];
        $rootScope.data.downloadFrom = "";
        $rootScope.mustFields = [];
        $rootScope.showLoader = false;
        $rootScope.uploadErrorMessages = "";
        $rootScope.noURI = -1;
        $rootScope.sources = [];
        $rootScope.noVersion = -1;
        $rootScope.noWebpage = -1;
        $rootScope.noDescription = -1;
        $rootScope.haveStatsFinished = 1;
        $rootScope.data.ORCID = "";
        $rootScope.data.assertionMethod = "http://purl.obolibrary.org/obo/ECO_0000218";
        $rootScope.doYouHaveOrcidValue = true;
        var ua = window.navigator.userAgent;
        $rootScope.msie = ua.indexOf ( ".NET" );
        $rootScope.finalHeader = "Almost there...";
        $rootScope.data.userSource = {};
        $rootScope.data.userTarget = {};
        $rootScope.data.subjectDatatype = "http://semanticscience.org/resource/SIO_010299";
        $rootScope.data.targetDatatype = "http://semanticscience.org/resource/SIO_010035";
        $rootScope.data.relationship = "http://www.w3.org/2004/02/skos/core#closeMatch";
        $rootScope.data.justification = "http://semanticscience.org/resource/CHEMINF_000059";
        /**
         * @function otherLicence
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
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
         * @function callORCIDEndpoint
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
         * @description Is the information provided is the correct length for an ORCID ID? If yes, call ORCID API.
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
         * @description This message is sent by the services when the information from the ORCID API has been retrieved.
         */
        $rootScope.$on('SuccessORCIDData', function (event, ORCIDJSON) {
            console.log("SuccessORCIDData");
            console.log(ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"]);
            var details = ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"];
            $rootScope.data.givenName =details["given-names"].value;
            $rootScope.data.familyName =details["family-name"].value;
            $rootScope.removeAlert("FailORCIDData");
        });
        /**
         * @description When the ORCID API call fails - create error.
         */
        $rootScope.$on('FailORCIDData', function (event, message) {
            console.log("FailORCIDData =>" + message);
            $rootScope.alerts.push({ id: "FailORCIDData", type: 'error', msg: message });

        });
        /**
         * @description When some other controller changes data used.
         */
        $rootScope.$on('DataChanged', function (event, x) {
            $rootScope.data = x;
        });
        /**
         * @description When the user changes the selection of his linkset source - update information here.
         */
        $rootScope.$on('setUserSource', function (event, x) {
            $rootScope.data.userSource  = x;
            console.log("setUserSource ");
            console.log($rootScope.data.userSource);
        });
        /**
         * @description When user changes the selection of his linkset target - update the information here.
         */
        $rootScope.$on('setUserTarget', function (event, x) {
            $rootScope.data.userTarget= x;
            console.log("setUserTarget ");
            console.log($rootScope.data.userTarget );
        });
        /**
         * @description The services request the most recent version of the data.
         */
        $rootScope.$on('needData', function (event) {
            console.log($rootScope.data);
            console.log("NeedData");
            voidData.setData($rootScope.data);
        });
        /**
         * @function closeAlert
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
         * @description Closes an alert displayed on screen.
         * @param {int} index - Index of alert to be removed.
         */
        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };
        /**
         * @description Download failed. Check services URLPreface.
         */
        $rootScope.$on("FailedDownload", function (ev, status) {
            $rootScope.alerts.push({ type: 'error', msg: 'Failed to download void.' });
        })
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
            $rootScope.sources = x;
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

        // called by carousel creator in the index.html of the website
        /**
         * @function checkMustFieldsOnPreviousPage
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
         * @description Checks what fields that are required are not filled.
         * @param index The page to have its fields checked.
         */
        $rootScope.checkMustFieldsOnPreviousPage = function (index) {
            if (index >= 0 && index < $rootScope.mustFields.length) {
                console.log("Got in checkMustFieldsOnPreviousPage ==>" + index);
                for (var i = 0; i < $rootScope.mustFields.length; i++) {
                    if ($rootScope.mustFields[i].index == index) {
                        for (var j = 0; j < $rootScope.mustFields[i].mustFields.length; j++) {
                            var mustFieldsToCheck = $rootScope.mustFields[i].mustFields[j];
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
                            if (mustFieldsToCheck == "downloadFrom" && $rootScope.data.downloadFrom.indexOf("://") == -1) {
                                if ($rootScope.checkIfAlertNeedsAdding("downloadFrom")) $rootScope.addAlert("downloadFrom");
                            } else if (mustFieldsToCheck == "downloadFrom" && $rootScope.data.downloadFrom.indexOf("://") >= -1){
                                $rootScope.removeAlert("downloadFrom");
                            }
                            if (mustFieldsToCheck == "userSource" && Object.keys($rootScope.data.userSource).length ===0) {
                                if ($rootScope.checkIfAlertNeedsAdding("userSource")) $rootScope.addAlert("userSource");
                            } else if (mustFieldsToCheck == "userSource" && Object.keys($rootScope.data.userSource).length >0){
                                $rootScope.removeAlert("userSource");
                            }
                            if (mustFieldsToCheck == "userTarget" &&  Object.keys($rootScope.data.userTarget).length ===0) {
                                if ($rootScope.checkIfAlertNeedsAdding("userTarget")) $rootScope.addAlert("userTarget");
                            } else if (mustFieldsToCheck == "userTarget" && Object.keys($rootScope.data.userTarget).length>0){
                                $rootScope.removeAlert("userTarget");
                            }

                        }
                    }//if
                }//for
            }//if
        };
        /**
         * @function checkIfAlertNeedsAdding
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
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
        }
        /**
         * @function removeAlert
         * @description Removes an alert by its given ID.
         * @param id2Remove ID of alert to remove.
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
         */
        $rootScope.removeAlert =function(id2Remove){
            for (var k = 0; k < $rootScope.alerts.length; k++) {
                if ($rootScope.alerts[k].id == id2Remove)$rootScope.alerts.splice(k, 1);
            }
        }

        $rootScope.$on('checkSources', function (event) {
            var result;
            $rootScope.checkSources ();

            if ($rootScope.noURI != -1) result = $rootScope.addAlert("URI")
            else if ($rootScope.noVersion != -1) $rootScope.addAlert("versionSource");
            else if ($rootScope.showOther == true && ( $rootScope.data.licence.indexOf("://") == -1)) {
                result = $rootScope.addAlert("licence");
            }
            else result = "passed";

            voidData.setUriForSourcesExist(result);
        });
        /**
         * @function fieldsToAdd
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
         * @description In the final page of the UI display to the user once more what info is needed.
         * @returns {string} HTML code to be added on the last slide to show user information that is needed.
         */
        $rootScope.fieldsToAdd = function () {
            var returnString = "",
                header = "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";

            $rootScope.checkSources ();
            if ($rootScope.data.description == "") {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'>Description for your Linkset in \"Core Info\"</p>";
            }
            if ($rootScope.data.publisher == "") {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'>Publishing institution in \"Publishing Info\"</p>";
            }
            if ($rootScope.data.downloadFrom == "") {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> RDF download link in \"Publishing Info\" </p> ";
            }
            if ($rootScope.showOther == true && ( $rootScope.data.licence.indexOf("http") == -1)) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> A URI for the licence you choose in \"Publishing Info\" </p> ";
            }
            if ($rootScope.noURI != -1) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'> A URI for the source you cited in \"Sources \" </p> ";
            }

            if (Object.keys($rootScope.data.userSource).length ===0) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'>The Source Dataset of your Linkset \"Source/Target\"</p>";
            }

            if (Object.keys($rootScope.data.userTarget).length ===0) {
                if (returnString == "") returnString += header;
                returnString += "<p class='neededFields'>The Target Dataset of your Linkset \" Source/Target \"</p>";
            }


            if (returnString == ""){
                 $rootScope.disabledExport = false
                 $rootScope.finalHeader = "Congratulations you now have a Linkset description!";
            } else{
                $rootScope.finalHeader = "You have almost created a Linkset description...";
                $rootScope.disabledExport = true
            };
            return returnString;
        };
        /**
         * @function checkSources
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
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
         * @function addAlert
         * @description Given the ID add the appropriate Alert / Error .
         * @param id2Add ID of alert to be added.
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCtrl
         * @returns {string}
         */
        $rootScope.addAlert = function(id2Add){
            switch(id2Add) {
                case "licence":
                    $rootScope.alerts.push({ id: "licence", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the licence you choose! Please provide this information.' });
                    break;
                case "description":
                    $rootScope.alerts.push({ id: "description", type: 'error', msg: 'Ooops! You forgot to gives us a Linkset description! Please provide this information.' });
                    break;
                case "publisher":
                    $rootScope.alerts.push({ id: "publisher", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the publisher you choose! Please provide this information.' });
                    break;
                case "downloadFrom":
                    $rootScope.alerts.push({ id: "downloadFrom", type: 'error', msg: 'Ooops! You forgot to gives us a URL to download your RDF from! Please provide this information.' });
                    break;
                case "userSource":
                    $rootScope.alerts.push({ id: "userSource", type: 'error', msg: 'Ooops! You forgot to gives us the Source Dataset of your Linkset! Please provide this information.' });
                    break;
                case "userTarget":
                    $rootScope.alerts.push({ id: "userTarget", type: 'error', msg: 'Ooops! You forgot to gives us the Target Dataset of your Linkset! Please provide this information.' });
                    break;
            }
            return "failed";
        }
    }]);

/**
 *  @description Controller responsible for making the service calls for the creation and the download of the VoID.
 *  @memberOf  linksetCreator.linksetApp.linksetAppControllers
 *  @class  linksetCreator.linksetApp.linksetAppControllers.linksetFormCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 *  @param {http} $http - Allows http connections.
 */
linksetAppControllers.controller('linksetFormCtrl', ['$rootScope' , '$scope', '$http', 'voidData',
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
            window.open('/rest/linkset/file');
        };
    }]);


// This needs cleaning up - and to use json file to determine structure/ number of page
/**
 *  @description The controller which fills the carousel with the appropriate pages.
 *  @memberOf  linksetCreator.linksetApp.linksetAppControllers
 *  @class  linksetCreator.linksetApp.linksetAppControllers.linksetCarouselCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 */
linksetAppControllers.controller('linksetCarouselCtrl', ['$scope', '$rootScope',
    function CarouselCtrl($scope, $rootScope) {
        $scope.interval = -1;
        $rootScope.dynamicProgress = 0;
        $rootScope.dynamicProgressStep = 0;
        $scope.wrap = false;
        $rootScope.mustFields = [];

        var slides = $scope.slides = [];
        /**
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.linksetCarouselCtrl
         * @param i Index of the slide to be added
         * @param title The title to be displayed for that slide.
         * @param mustFields What fields in that slide are necessary.
         */
        $scope.addSlide = function (i, title, mustFields) {
            var temp;
            if (i != 0)   temp = "partials/linksets/page" + i + ".html";
            else  temp = "partials/linksets/page.html";

            var percentageOfChange = (100 / 6 ) - 0.0001;
            $rootScope.dynamicProgressStep = percentageOfChange;
            $rootScope.mustFields.push({'index': i, 'mustFields': mustFields });
            $rootScope.$broadcast("changedMustFields", $rootScope.mustFields);
            slides.push({'page': temp, 'index': i, 'progress': (i + 1) * percentageOfChange % 100, 'title': title });
        };

        $scope.addSlide(0, "User Info", []);
        $scope.addSlide(1, "Core Info", [ "description"]);
        $scope.addSlide(2, "Publishing Info", ["publisher",  "downloadFrom"]);
       // $scope.addSlide(3, "Versioning", []);
        $scope.addSlide(3, "Source / Target", ["userSource" ,"userTarget"]);
        $scope.addSlide(4, "Link Info", []);
        $scope.addSlide(5, "Export RDF", []);

        $scope.changeProgressBar = function (change) {
            $rootScope.dynamicProgress = change;
        };

    }
]);
/**
 *  @description Controller which manages the selection of target and source of the linkset.
 *  @memberOf  linksetCreator.linksetApp.linksetAppControllers
 *  @class  linksetCreator.linksetApp.linksetAppControllers.sourceCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} JsonService - Downloads the OPS sources for the Open PHACTS API.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 */
linksetAppControllers.controller('sourceCtrl', [ '$rootScope', '$scope', 'JsonService', 'voidData',
    function ($rootScope, $scope, JsonService, voidData) {
        $scope.userSource = {};
        $scope.userTarget = {};
        $scope.sourceID = "";
        $scope.subSourceID = "";
        $scope.targetID = "";

        $scope.titles = [];
        $scope.aboutOfTitles = [];
        $scope.descriptionsOfTitles = [];
        $scope.sources = [];
        $scope.subSources = [];
        $scope.subTargets = [];
        $scope.isSource = true;
        $scope.isTarget = true;
        $scope.userTargetIndex = null;
        $scope.userSourceIndex = null;
        /**
         * @function noTitleFilter
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.sourceCtrl
         * @param item A Source object.
         * @returns {boolean} If title is String.
         */
        $scope.noTitleFilter = function (item) {
            return typeof item.title == 'string';
        };
        /**
         * @function extractTitlesOfSources
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.sourceCtrl
         * @description Extract titles of the sources from the OPS JSON.
         */
        $scope.extractTitlesOfSources = function () {
            for (var i = 0; i < $scope.sources.length; i++) {
                if ($scope.sources[i].title != undefined){
                    $scope.titles.push($scope.sources[i].title);
                    $scope.aboutOfTitles.push($scope.sources[i]._about);
                    $scope.descriptionsOfTitles.push($scope.sources[i].description);
                }else{
                    $scope.sources.splice(i, 1);
                }
            }
        };
        /**
         * @function JsonService.get
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.sourceCtrl
         * @description Retrievs all source information from OPS.
         */
        JsonService.get(function (data) {
            $scope.sources = data.result.primaryTopic.subset;
            $scope.extractTitlesOfSources();
        });
        /**
         * @function updateSelection
         *  @memberOf linksetCreator.linksetApp.linksetAppControllers.sourceCtrl
         * @param value - Value to be added.
         * @param from - Source or Target
         */
        $scope.updateSelection = function(value, from){
            if(from =="source") {
                voidData.setUserSource(value);
            }else{
                voidData.setUserTarget(value);
            }
        }
        /**
         * @function selectOption
         * @memberOf linksetCreator.linksetApp.linksetAppControllers.sourceCtrl
         * @param value - Value selected from option.
         * @param from -  Source or Target.
         */
        $scope.selectOption = function(value, from){
            var found = -1;
            for (var i = 0; i < $scope.sources.length; i++) {
                if ($scope.sources[i]._about == value) found = i;
            }

            if (found != -1 && value!= undefined && value != "") {
                var tmpID ;
                var changePrefix = "";
                var initPrefix = "";
                if (from == "source") {
                    tmpID = $scope.sourceID;
                    changePrefix = "div#";
                    initPrefix = "#";
                    $scope.subSources = [];
                }else {
                    initPrefix = "#100";
                    tmpID = $scope.targetID;
                    changePrefix = "div#100";
                    $scope.subTargets = [];
                }

                if (("div" +tmpID) == initPrefix+ $scope.sources[found].$$hashKey &&
                    ($scope.userTargetIndex != null || $scope.userTargetIndex !=null)){

                }else {
                    $(tmpID).change(
                        function () {
                            $("div" + tmpID + ">.accordion-heading").css('background-color', "white");
                            $("div" + tmpID + ">.accordion-heading>a").css('color', "black");
                        }
                    ).change();

                    $(initPrefix + $scope.sources[found].$$hashKey).change(
                        function () {
                            $(changePrefix + $scope.sources[found].$$hashKey + ">.accordion-heading").css('background-color', "#149bdf");
                            $(changePrefix + $scope.sources[found].$$hashKey + ">.accordion-heading>a").css('color', "#f5f5f5");
                        }
                    ).change();


                    if ($scope.sources[found].subset != null || $scope.sources[found].subset != undefined) {
                        for (var i = 0; i < $scope.sources[found].subset.length; i++) {
                            if ($scope.sources[found].subset[i].title != undefined) {
                                if (from == "source") {
                                    $scope.subSources.push($scope.sources[found].subset[i]);
                                } else {
                                    $scope.subTargets.push($scope.sources[found].subset[i]);
                                }
                            }
                        }
                    }

                    if (from == "source") {
                        $scope.sourceID = "#" + $scope.sources[found].$$hashKey;
                        if ($scope.subSources.length > 0) {
                            $scope.isSource = true;
                        } else {
                            $scope.isSource = false;
                            $scope.userSource = {"title": $scope.titles[found], "type": "RDF", "URI": value,
                                "webpage": $scope.sources[found].webpage, "description": $scope.descriptionsOfTitles[found] };
                            voidData.setUserSource($scope.userSource);
                        }
                    } else {
                        $scope.targetID = "#100" + $scope.sources[found].$$hashKey;
                        if ($scope.subTargets.length > 0) {
                            $scope.isTarget = true;
                        } else {
                            $scope.isTarget = false;
                            $scope.userTarget = {"title": $scope.titles[found], "type": "RDF", "URI": value,
                                "webpage": $scope.sources[found].webpage, "description": $scope.descriptionsOfTitles[found] };
                            voidData.setUserTarget($scope.userTarget);
                        }
                    }
                }

            }
        }

        $rootScope.$on('ChangeInSourcesFromUpload', function (event, sources) {
            $scope.userSources = sources;
        });
    }]);



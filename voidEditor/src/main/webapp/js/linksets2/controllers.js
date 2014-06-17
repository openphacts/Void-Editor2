'use strict';

/* Controllers */
var linksetAppControllers = angular.module('linksetAppControllers', ['jsonService', 'voidDataService',  'ORCIDService',
                               'modalControllers' ]);

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

        $rootScope.otherLicence = function (val) {
            if (val == "other") {
                $rootScope.data.licence = "";
                $rootScope.showOther = true;
            } else {
                $rootScope.showOther = false;
            }
        };

        $rootScope.callORCIDEndpoint = function() {
            if ( $rootScope.data.ORCID !=undefined&&  $rootScope.data.ORCID.length >= 16 )
            {
                var tmp =  $rootScope.data.ORCID.replace(/-/g, '');
                if (tmp.length>=16){
                    ORCIDService.callORCIDEndpoint($rootScope.data.ORCID);
                }
            }
        }

        $rootScope.$on('SuccessORCIDData', function (event, ORCIDJSON) {
            console.log("SuccessORCIDData");
            console.log(ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"]);
            var details = ORCIDJSON["orcid-profile"]["orcid-bio"]["personal-details"];
            $rootScope.data.givenName =details["given-names"].value;
            $rootScope.data.familyName =details["family-name"].value;
            $rootScope.removeAlert("FailORCIDData");
        });
        $rootScope.$on('FailORCIDData', function (event, message) {
            console.log("FailORCIDData =>" + message);
            $rootScope.alerts.push({ id: "FailORCIDData", type: 'error', msg: message });

        });

        $rootScope.$on('DataChanged', function (event, x) {
            $rootScope.data = x;
        });

        $rootScope.$on('setUserSource', function (event, x) {
            $rootScope.data.userSource  = x;
            console.log("setUserSource ");
            console.log($rootScope.data.userSource);
        });

        $rootScope.$on('setUserTarget', function (event, x) {
            $rootScope.data.userTarget= x;
            console.log("setUserTarget ");
            console.log($rootScope.data.userTarget );
        });

        $rootScope.$on('needData', function (event) {
            console.log($rootScope.data);
            console.log("NeedData");
            voidData.setData($rootScope.data);
        });

        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };

        $rootScope.$on("FailedDownload", function (ev, status) {
            $rootScope.alerts.push({ type: 'error', msg: 'Failed to download void.' });
        })

        $rootScope.$on("changedMustFields", function (ev, data) {
            $rootScope.mustFields = data;
        });

        $rootScope.$on('TurtleChanged', function (event, x) {
            $rootScope.turtle = x;
            $rootScope.showLoader = false;
        });

        $rootScope.$on('DataSourcesChanged', function (event, x) {
            $rootScope.sources = x;
        });

        $rootScope.$on('StartLoader', function (event) {
            $rootScope.showLoader = true;
        });

        $rootScope.$on('SuccessDownload', function (event) {
            $rootScope.showLoader = false;
            $rootScope.alerts.push({ type: 'success', msg: 'Well done! You successfully downloaded your void.ttl! - If download does not start, please make sure you allow popups.' });
        });

        // called by carousel creator in the index.html of the website
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

        $rootScope.checkIfAlertNeedsAdding = function (id2Check){
            var addAlert = true;
            for (var k = 0; k < $rootScope.alerts.length; k++) {
                if ($rootScope.alerts[k].id == id2Check ) addAlert = false;
            }
            return addAlert;
        }

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

linksetAppControllers.controller('linksetFormCtrl', ['$rootScope' , '$scope', '$http', 'voidData',
    function ($rootScope, $scope, $http, voidData) {

        $rootScope.createVoid = function () {
            voidData.createVoid();
        };

        $rootScope.downloadFile = function () {
            voidData.createVoidAndDownload();
            window.open('/rest/linkset/file');
        };
    }]);


// This needs cleaning up - and to use json file to determine structure/ number of page
linksetAppControllers.controller('linksetCarouselCtrl', ['$scope', '$rootScope',
    function CarouselCtrl($scope, $rootScope) {
        $scope.interval = -1;
        $rootScope.dynamicProgress = 0;
        $rootScope.dynamicProgressStep = 0;
        $scope.wrap = false;
        $rootScope.mustFields = [];

        var slides = $scope.slides = [];
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

        $scope.noTitleFilter = function (item) {
            return typeof item.title == 'string';
        };

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

        JsonService.get(function (data) {
            $scope.sources = data.result.primaryTopic.subset;
            $scope.extractTitlesOfSources();
        });

        $scope.updateSelection = function(value, from){
            if(from =="source") {
                voidData.setUserSource(value);
            }else{
                voidData.setUserTarget(value);
            }
        }

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



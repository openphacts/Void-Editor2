'use strict';

/* Controllers */
var linksetAppControllers = angular.module('linksetAppControllers', ['jsonService', 'voidDataService',  'ORCIDService',
                               'modalControllers' ]);

linksetAppControllers.controller('linksetCtrl', [  '$scope', '$rootScope', 'voidData', 'ORCIDService',
    function ($scope, $rootScope, voidData, uploadUserData , ORCIDService) {
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
        $rootScope.haveStatsFinished = 1;
        $rootScope.data.ORCID = "";
        $rootScope.doYouHaveOrcidValue = true;
        var ua = window.navigator.userAgent;
        $rootScope.msie = ua.indexOf ( ".NET" );
        $rootScope.finalHeader = "Almost there...";

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

        $rootScope.$on('needData', function (event) {
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


        $rootScope.checkMustFieldsOnPreviousPage = function (index) {
            if (index >= 0 && index < $rootScope.mustFields.length) {
//                console.log("got in if statement");
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
            else if ($rootScope.noWebpage != -1) result=$rootScope.addAlert("webpageSource");
            else if ($rootScope.noDescription != -1) result=$rootScope.addAlert("webpageSource");
            else result = "passed";

            voidData.setUriForSourcesExist(result);
        });

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
                    $rootScope.alerts.push({ id: "downloadFrom", type: 'error', msg: 'Ooops! You forgot to gives us a URL to download your RDF data from! Please provide this information.' });
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
            if (i != 0)   temp = "partials/linkset/page" + i + ".html";
            else  temp = "partials/linkset/page.html";

            var percentageOfChange = (100 / 4 ) - 0.0001;
            $rootScope.dynamicProgressStep = percentageOfChange;
            $rootScope.mustFields.push({'index': i, 'mustFields': mustFields });
            $rootScope.$broadcast("changedMustFields", $rootScope.mustFields);
            slides.push({'page': temp, 'index': i, 'progress': (i + 1) * percentageOfChange % 100, 'title': title });
        };

        $scope.addSlide(0, "User Info", []);
        $scope.addSlide(1, "Core Info", ["title" , "description"]);
        $scope.addSlide(2, "Publishing Info", ["publisher", "webpage" , "downloadFrom"]);
       // $scope.addSlide(3, "Versioning", []);
       // $scope.addSlide(3, "Sources", []);
        $scope.addSlide(3, "Export RDF", []);

        $scope.changeProgressBar = function (change) {
            $rootScope.dynamicProgress = change;
        };

    }
]);

linksetAppControllers.controller('sourceCtrl', [ '$rootScope', '$scope', 'JsonService', 'voidData',
    function ($rootScope, $scope, JsonService, voidData) {
        $scope.userSources = [];
        $scope.selected = undefined;
        $scope.titles = [];
        $scope.aboutOfTitles = [];
        $scope.descriptionsOfTitles = [];
        $scope.sources = [];
        $scope.showInputURI = false;

        $scope.noTitleFilter = function (item) {
            return typeof item.title == 'string';
        };

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



'use strict';

/* Controllers */

var editorAppControllers = angular.module('editorAppControllers', ['jsonService' , 'voidDataService' , 'modalControllers']);

editorAppControllers.controller('editorCtrl', [  '$scope','$rootScope' , 'voidData',
    function ( $scope, $rootScope, voidData) {
        $scope.title = 'VoID Editor';
        $scope.mustFieldPerPage = [];
        $rootScope.disabledExport = false;
        $rootScope.data = {};
        $rootScope.turtle = "Loading...";
        $rootScope.showOther = false;
        $rootScope.data.datePublish = 1;
        $rootScope.data.monthPublish = 1;
        $rootScope.data.yearPublish = 2013;
        $rootScope.fileLocation = "";
        $rootScope.data.description= "";
        $rootScope.data.title = "";
        $rootScope.data.publisher = "";
        $rootScope.data.webpage = "";
        $rootScope.data.sources = [];
        $rootScope.data.updateFrequency = "Annual";
        $rootScope.postFinished = false;
        $rootScope.data.licence = "http://creativecommons.org/licenses/by-sa/3.0/";
        $rootScope.alerts = [];
        $rootScope.data.downloadFrom= "";
        $rootScope.mustFields = [];
        $rootScope.isCollapsed = false;

        $rootScope.$on('TurtleChanged', function (event, x) {
            $rootScope.turtle = x;
        });

        $rootScope.$on('DataSourcesChanged', function (event, x) {
            $rootScope.data.sources = x;
        });

        $rootScope.otherLicence = function (val) {
            if (val == "other") {
                $rootScope.data.licence = "";
                $rootScope.showOther = true;
            } else {
                $rootScope.showOther = false;
            }
        }

        $rootScope.$on('DataChanged', function (event, x) {
            $rootScope.data = x;
        });

        $rootScope.$on('needData', function (event, x) {
            voidData.setData($rootScope.data);
        });

        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };

        $rootScope.$on("changedMustFields", function(ev, data){
            $rootScope.mustFields = data;
        })

        $rootScope.checkMustFieldsOnPreviousPage =  function (index) {
            if (index >= 0 && index <  $rootScope.mustFields.length )
            {

                for (var i = 0; i < $rootScope.mustFields.length; i++) {
                    if ($rootScope.mustFields[i].index == index){
                        for (var j = 0 ; j < $rootScope.mustFields[i].mustFields.length ; j++)
                        {
                            var mustFieldsToCheck = $rootScope.mustFields[i].mustFields[j];
                            if (mustFieldsToCheck == "title" && ( $rootScope.data.description.length < 2) ) {
                                var addAlert = true;
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "title") addAlert = false;
                                }
                                if (addAlert == true ) $rootScope.alerts.push({ id:"title" ,type: 'error', msg: 'Ooops! You forgot to gives us a title for your dataset! Please provide this information.' });
                            } else  if (mustFieldsToCheck == "title" && ( $rootScope.data.description.length > 2) ){
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "title")$rootScope.alerts.splice(k, 1);
                                }
                            }
                            if (mustFieldsToCheck == "description" && ( $rootScope.data.description.length < 5)) {
                                var addAlert = true;
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "description") addAlert = false;
                                }
                                if (addAlert == true ) $rootScope.alerts.push({ id:"description",type: 'error', msg: 'Ooops! You forgot to gives us a description! Please provide this information.' });
                            } else  if (mustFieldsToCheck ==  "description" && ( $rootScope.data.description.length > 5) ){
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "description")$rootScope.alerts.splice(k, 1);
                                }
                            }
                            if (mustFieldsToCheck == "publisher" && ( $rootScope.data.publisher.indexOf("http") == -1)) {
                                var addAlert = true;
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "publisher") addAlert = false;
                                }
                                if (addAlert == true ) $rootScope.alerts.push({ id:"publisher", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the publisher you choose! Please provide this information.' });
                            }else  if (mustFieldsToCheck ==  "publisher" && ( $rootScope.data.publisher.indexOf("http") >= 0) ){
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "publisher")$rootScope.alerts.splice(k, 1);
                                }
                            }
                            if (mustFieldsToCheck == "webpage" && ( $rootScope.data.webpage.indexOf("http") == -1)) {
                                var addAlert = true;
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "webpage") addAlert = false;
                                }
                                if (addAlert == true ) $rootScope.alerts.push({ id:"webpage", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the webpage of your documentation! Please provide this information.' });
                            }else  if (mustFieldsToCheck ==  "webpage" && ( $rootScope.data.webpage.indexOf("http") >= 0 ) ){
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "webpage")$rootScope.alerts.splice(k, 1);
                                }
                            }
                            if (mustFieldsToCheck == "downloadFrom" && ( $rootScope.data.downloadFrom.indexOf("http") == -1)) {
                                var addAlert = true;
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "downloadFrom") addAlert = false;
                                }
                                if (addAlert == true ) $rootScope.alerts.push({ id:"downloadFrom" , type: 'error', msg: 'Ooops! You forgot to gives us a URL to download your RDF data from! Please provide this information.' });
                            }else  if (mustFieldsToCheck ==  "downloadFrom" && ( $rootScope.data.downloadFrom.length > 2) ){
                                for(var k = 0 ; k < $rootScope.alerts.length ; k++ ){
                                    if ($rootScope.alerts[k].id == "downloadFrom")$rootScope.alerts.splice(k, 1);
                                }
                            }
                        }
                    }

                }
            }
        };

        $rootScope.$on('checkSources', function (event) {
            var noURI = -1,
                noVersion=-1,
                noWebpage =-1,
                noDescription = -1;
            var result;
            for (var i = 0; i < $rootScope.data.sources.length; i++) {
                if ($rootScope.data.sources[i].URI == "") noURI = i;
                if ($rootScope.data.sources[i].version == "") noVersion = i;
                if ($rootScope.data.sources[i].webpage == "") noWebpage = i;
                if ($rootScope.data.sources[i].description == "") noDescription = i;
            }
            if (noURI != -1) {
                $rootScope.alerts.push({ id:"URI" , type: 'error', msg: 'Ooops! You forgot to gives us a URI for the source you cited! Please provide this information.' });
                result = "failed";
            }else if (noVersion != -1) {
                $rootScope.alerts.push({ id:"versionSource", type: 'error', msg: 'Ooops! You forgot to gives us a version for the source you cited! Please provide this information.' });
                result = "failed";
            }else if ($rootScope.showOther == true && ( $rootScope.data.licence.indexOf("http") == -1)) {
                $rootScope.alerts.push({ id:"licence", type: 'error', msg: 'Ooops! You forgot to gives us a URI for the licence you choose! Please provide this information.' });
                result = "failed";
            }else if ( noWebpage != -1) {
                $rootScope.alerts.push({ id:"webpageSource", type: 'error', msg: 'Ooops! You forgot to gives us a URL for source you cited! Please provide this information.' });
                result = "failed";
            } else if ( noDescription != -1) {
                $rootScope.alerts.push({ id:"descriptionSource", type: 'error', msg: 'Ooops! You forgot to gives us a description for source you cited! Please provide this information.' });
                result = "failed";
            } else {
                result = "passed";
            }
            voidData.setUriForSourcesExist(result);
        });

        $rootScope.$on('SuccessDownload', function (event) {
            $rootScope.alerts.push({ type: 'success', msg: 'Well done! You successfully downloaded your void.ttl! - If download does not start, please make sure you allow popups.' });
        });

        $rootScope.fieldsToAdd = function(){
            var returnString = "";

            if ( $rootScope.data.title == "") {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString+="<p class='neededFields'>Title of your dataset in \"Core Info\"</p>";
            }
            if ( $rootScope.data.description== "") {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString+="<p class='neededFields'>Description for your dataset in \"Core Info\"</p>";
            }
            if ($rootScope.data.publisher== "") {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString+= "<p class='neededFields'>Publishing institution in \"Publishing Info\"</p>";
            }
            if ( $rootScope.data.webpage == "") {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString+= "<p class='neededFields'>Webpage of documentation in \"Publishing Info\" </p>";
            }
            if ($rootScope.data.downloadFrom == "") {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString +="<p class='neededFields'> RDF download link in \"Publishing Info\" </p> ";
            }
            if ($rootScope.showOther == true && ( $rootScope.data.licence.indexOf("http") == -1)) {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString +="<p class='neededFields'> A URI for the licence you choose in \"Publishing Info\" </p> ";
            }

            var noURI = -1;
            var noVersion =-1;
            var noWebpage =-1;
            var noDescription = -1;
            for (var i = 0; i < $rootScope.data.sources.length; i++) {
                if ($rootScope.data.sources[i].URI == "") noURI = i;
                if ($rootScope.data.sources[i].version == "") noVersion = i;
                if ($rootScope.data.sources[i].webpage == "") noWebpage = i;
                if ($rootScope.data.sources[i].description == "") noDescription = i;
            }
            if (noURI != -1) {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString +="<p class='neededFields'> A URI for the source you cited in \"Sources \" </p> ";
            }
            if (noVersion != -1) {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString +="<p class='neededFields'> A version number for the source you cited in \"Sources \" </p> ";
            }
            if (noWebpage != -1) {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString +="<p class='neededFields'> A webpage for the source you cited in \"Sources \" </p> ";
            }
            if (noDescription != -1) {
                if (returnString =="") returnString += "<h4 class='h4NeededFields'>Please fill in the following fields</h4>";
                returnString +="<p class='neededFields'> A description for the source you cited in \"Sources \" </p> ";
            }

            if (returnString == "")  $rootScope.disabledExport = false;
            else $rootScope.disabledExport = true;

            return returnString ;
        }
    }]);

editorAppControllers.controller('editorFormCtrl', ['$rootScope' , '$scope', '$http', 'voidData',
    function ($rootScope, $scope,  $http, voidData) {

        $rootScope.createVoid = function () {
            console.log("** Create Void");
            voidData.createVoid();
        }

        $rootScope.downloadFile = function () {
            voidData.createVoidAndDownload();
            console.log("Going to open window");
            window.open('/rest/void/file');
            $rootScope.$broadcast('SuccessDownload');
        };
    }]);

// This needs cleaning up - and to use json file to determine structure/ number of page
editorAppControllers.controller('editorCarouselCtrl', ['$scope', '$rootScope',
    function CarouselCtrl($scope, $rootScope) {
        $scope.interval = -1;
        $rootScope.dynamicProgress = 0;
        $rootScope.dynamicProgressStep = 0;
        $scope.wrap = false;

        var slides = $scope.slides = [];
        $scope.addSlide = function (i, title, mustFields) {
            var temp;
            if (i != 0)   temp = "partials/page" + i + ".html";
            else  temp = "partials/page.html";
            var percentageOfChange = (100 / 6 ) - 0.0001;
            $rootScope.dynamicProgressStep = percentageOfChange;
            $rootScope.mustFields.push({'index' : i ,  'mustFields': mustFields });
            $rootScope.$broadcast("changedMustFields" , $rootScope.mustFields);
            slides.push({'page': temp, 'index': i, 'progress': (i + 1) * percentageOfChange % 100, 'title': title });
        };
        $scope.addSlide(0, "User Info" ,[]);
        $scope.addSlide(1, "Core Info" ,["title" , "description"]);
        $scope.addSlide(2, "Publishing Info" ,["publisher", "webpage" , "downloadFrom"]);
        $scope.addSlide(3, "Versioning",[]);
        $scope.addSlide(4, "Sources",[]);
        $scope.addSlide(5, "Export RDF",[]);

        $scope.changeProgressBar = function (change) {
            $rootScope.dynamicProgress = change;
        }

    }
]);

editorAppControllers.controller('sourceCtrl', [ '$scope', 'JsonService', 'voidData',
    function ($scope, JsonService, voidData) {
        $scope.userSources = [];
        $scope.selected = undefined;
        $scope.titles = [];
        $scope.aboutOfTitles = [];
        $scope.sources = [];
        $scope.showInputURI = false;

        $scope.noTitleFilter = function (item) {
            return typeof item.title == 'string';
        };

        $scope.extractTitlesOfSources = function () {
            for (var i = 0; i < $scope.sources.length; i++) {
                $scope.titles.push($scope.sources[i].title);
                $scope.aboutOfTitles.push($scope.sources[i]._about);
            }
        }

        JsonService.get(function (data) {
            $scope.sources = data.result.primaryTopic.subset;
            $scope.extractTitlesOfSources();
        });

        $scope.addToSelected = function (value) {
            var found = 0;
            for (var i = 0; i < $scope.userSources.length; i++) {
                if ($scope.userSources[i].title == value) found = 1;
            }

            if (!found && value != undefined && value != "") {

                var foundURI = -1;
                for (var i = 0; i < $scope.titles.length; i++) {
                    if ($scope.titles[i] == value) foundURI = i;
                }
                var _about = value;
                if (foundURI != -1) {
                    _about = $scope.aboutOfTitles[foundURI];
                    $scope.userSources.push({"title": value, "type": "RDF", "URI": _about, "version": "" ,  "webpage" :_about, "description" : "N/A",  "noURI": false });
                } else {
                    $scope.showInputURI = true;
                    $scope.userSources.push({"title": value, "type": "RDF", "URI": "",  "version" : "", "webpage" : "" , "description" :"" ,"noURI": true });
                }
                voidData.setSourceData($scope.userSources);
            }
        }


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

        }
    }]);



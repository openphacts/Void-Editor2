'use strict';

/* Controllers */

var editorAppControllers = angular.module('editorAppControllers', ['jsonService' , 'voidDataService' , 'modalControllers']);

editorAppControllers.controller('editorCtrl', [  '$scope','$rootScope' , 'voidData',
    function ( $scope, $rootScope, voidData) {
        $scope.title = 'VoID Editor';
        $rootScope.data = {};
        $rootScope.turtle = "Loading...";
        $rootScope.showOther = false;
        $rootScope.data.datePublish = 1;
        $rootScope.data.monthPublish = 1;
        $rootScope.data.yearPublish = 2013;
        $rootScope.fileLocation = "";
        $rootScope.data.sources = [];
        $rootScope.data.updateFrequency = "Annual";
        $rootScope.postFinished = false;
        $rootScope.data.licence = "http://creativecommons.org/licenses/by-sa/3.0/";
        $rootScope.alerts = [];

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

        $rootScope.$on('checkSources', function (event) {
            var noURI = -1;
            var result;
            for (var i = 0; i < $rootScope.data.sources.length; i++) {
                if ($rootScope.data.sources[i].URI == "") noURI = i;
            }
            if (noURI != -1) {
                $rootScope.alerts.push({ type: 'error', msg: 'Ooops! You forgot to gives us a URI for the source you cited! Please provide this information.' });
                result = "failed";
            } else if ($rootScope.showOther == true && ( $rootScope.data.licence.indexOf("http") == -1)) {
                $rootScope.alerts.push({ type: 'error', msg: 'Ooops! You forgot to gives us a URI for the licence you choose! Please provide this information.' });
                result = "failed";
            } else {
                result = "passed";
            }
            voidData.setUriForSourcesExist(result);
        });

        $rootScope.$on('SuccessDownload', function (event) {
            $rootScope.alerts.push({ type: 'success', msg: 'Well done! You successfully downloaded your void.ttl!' });
        });

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
            window.open('/voidEditor/rest/void/file');
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
        $scope.addSlide = function (i, title) {
            var temp;
            if (i != 0)   temp = "partials/page" + i + ".html";
            else  temp = "partials/page.html";
            var percentageOfChange = (100 / 6 ) - 0.0001;
            $rootScope.dynamicProgressStep = percentageOfChange;
            slides.push({'page': temp, 'index': i, 'progress': (i + 1) * percentageOfChange % 100, 'title': title });
        };
        $scope.addSlide(0, "User Info");
        $scope.addSlide(1, "Core Info");
        $scope.addSlide(2, "Publishing info");
        $scope.addSlide(3, "Versioning");
        $scope.addSlide(4, "Sources");
        //$scope.addSlide(4, "Sources");
        //$scope.addSlide('4-2', "Sources");
        $scope.addSlide(5, "Export RDF");

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
                    $scope.userSources.push({"title": value, "type": "RDF", "URI": _about, "noURI": false });
                } else {
                    $scope.showInputURI = true;
                    $scope.userSources.push({"title": value, "type": "RDF", "URI": "", "noURI": true});
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



'use strict';

/* Controllers */

var editorAppControllers = angular.module('editorAppControllers', ['jsonService' , 'voidDataService']);

editorAppControllers.controller('editorCtrl', ['$rootScope' ,'$scope',
  function($scope ){
    $scope.title = 'VoID Editor';

}]);

editorAppControllers.controller('editorFormCtrl', ['$rootScope' ,'$scope', '$http', 'voidData',
    function($scope, $rootScope ,$http, voidData ){
		$rootScope.data = {};
	    $rootScope.turtle = "Loading...";
        $rootScope.data.datePublish  =1;
        $rootScope.data.monthPublish =1;
        $rootScope.data.yearPublish  =2013;
        $rootScope.fileLocation = "";
        $rootScope.data.sources = [];
        $rootScope.postFinished = false;

        $rootScope.$on('TurtleChanged', function(event, x) {
        	$rootScope.turtle = x;
        }); 
        
        $rootScope.$on('DataChanged', function(event, x) {
        	$rootScope.data = x;
        }); 
        
        $rootScope.$on('DataSourcesChanged', function(event, x) {
        	$rootScope.data.sources = x;
        }); 
        
        $rootScope.$on('needData', function(event, x) {
        	voidData.setData($rootScope.data);
        }); 
        
        $rootScope.createVoid = function (){
        	console.log("** Create Void");
        	voidData.createVoid();
        }
        
        $rootScope.downloadFile = function(){
        	voidData.createVoidAndDownload();
        	console.log("Going to open window");
            window.open('/voidEditor/rest/void/file');
        };
    }]);

// This needs cleaning up - and to use json file to determine structure/ number of page
editorAppControllers.controller('editorCarouselCtrl', ['$scope',  '$rootScope',
    function CarouselCtrl($scope, $rootScope) {
        $scope.interval = -1;
        $rootScope.dynamicProgress = 0;
        $scope.wrap = false;

        var slides = $scope.slides = [];
        $scope.addSlide = function(i) {
            var temp;
            if ( i !=0)   temp = "partials/page" +i+".html";
            else  temp = "partials/page.html";
            slides.push({'page': temp , 'index': i , 'progress': i*19.99 % 100});
        };
        $scope.addSlide(0);
        $scope.addSlide(1);
        $scope.addSlide(2);
        $scope.addSlide(3);
        $scope.addSlide(4);
        $scope.addSlide(5);

        $scope.changeProgressBar= function(change){
            $rootScope.dynamicProgress = change ;
        }

        $scope.setActive = function(idx) {
            $scope.slides[idx].active=true;
        }
    }
]);

editorAppControllers.controller('sourceCtrl',[ '$scope','JsonService', 'voidData',
    function($scope, JsonService , voidData) {
        $scope.userSources = [];
        $scope.selected = undefined;
        $scope.titles = [];
        $scope.aboutOfTitles = [];
        $scope.sources = [];

        $scope.noTitleFilter = function(item) {
            return typeof item.title == 'string';
        };

        $scope.extractTitlesOfSources = function (){
            for (var i =0 ; i < $scope.sources.length ; i++){
                $scope.titles.push(  $scope.sources[i].title );
                $scope.aboutOfTitles.push(  $scope.sources[i]._about );
            }
        }

        JsonService.get(function(data){
            $scope.sources = data.result.primaryTopic.subset;
            $scope.extractTitlesOfSources();
        });

        $scope.addToSelected = function(value){
            var found = 0;
            for (var i = 0 ; i < $scope.userSources.length; i++)
            {
                if ($scope.userSources[i].title == value ) found =1;
            }

            if ( !found && value != undefined &&  value != ""){

                var foundURI = -1;
                for (var i = 0 ; i < $scope.titles.length; i++)
                {
                    if ($scope.titles[i] == value ) foundURI =i;
                }

                var _about = value;
                if (foundURI != -1 ) _about =  $scope.aboutOfTitles[foundURI];

                $scope.userSources.push({"title":value , "type": "RDF" , "URI" : _about});
                voidData.setSourceData($scope.userSources);
            }
        }


        $scope.removeSelected = function(value){
            var found = false;
            var i = 0;
            while ( i < $scope.userSources.length && !found )
            {
                if ($scope.userSources[i].title == value ) found = true;
                else i++;
            }
            if (found) {
                $scope.userSources.splice(i,1);
                voidData.setSourceData($scope.userSources);
            }

        }
    }]);


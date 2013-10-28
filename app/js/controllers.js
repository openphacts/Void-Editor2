'use strict';

/* Controllers */

var editorAppControllers = angular.module('editorAppControllers', ['jsonService']);

editorAppControllers.controller('editorCtrl', ['$rootScope' ,'$scope',
  function($scope ){
    $scope.title = 'VoID Editor';

}]);

editorAppControllers.controller('editorFormCtrl', ['$rootScope' ,'$scope',
    function($scope ){
        $scope.data = {};

    }]);


editorAppControllers.controller('editorCarouselCtrl', ['$scope',  '$rootScope',
    function CarouselCtrl($scope, $rootScope) {
        $scope.interval = -1;
        $rootScope.dynamicProgress = 0;
        $scope.wrap = false;

        var slides = $scope.slides = [];
        $scope.addSlide = function(i) {
            var temp;
            if ( i !=0)   temp = "/app/partials/page" +i+".html";
            else  temp = "/app/partials/page.html";
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

      /* This needs to change and become auto complete */
editorAppControllers.controller('sourceCtrl',[ '$scope','JsonService',
    function($scope, JsonService) {
        $scope.userSources = [];
        $scope.selected = undefined;
        $scope.titles = [];
        $scope.sources = [];

        $scope.noTitleFilter = function(item) {
            return typeof item.title == 'string';
        };

        $scope.extractTitlesOfSources = function (){

            for (var i =0 ; i < $scope.sources.length ; i++){
                $scope.titles.push(  $scope.sources[i].title );
                // Not going to the sub sets because Christine said they where linksets
            }
            console.log($scope.titles);
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
            if ( !found && value != undefined &&  value != "") $scope.userSources.push({"title":value});
        }


        $scope.removeSelected = function(value){
            var found = false;
            var i = 0;
            while ( i < $scope.userSources.length && !found )
            {
                if ($scope.userSources[i].title == value ) found = true;
                else i++;
            }
            console.log(i);
            if (found) $scope.userSources.splice(i,1);

        }
    }]);


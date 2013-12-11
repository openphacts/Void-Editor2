'use strict';

//angular.module('app', ['ui.bootstrap']);
// http://angular-ui.github.io/bootstrap/

var modalControllers = angular.module('modalControllers', ['voidDataService']);

modalControllers.controller('ModalExportCtrl', ['$scope', '$rootScope' ,'$modal','voidData',
        function ($scope, $rootScope, $modal , voidData) {
            $scope.open = function () {

                console.log("Going to open modal!!");
                voidData.checkSources();
                var result = voidData.checkIfUriForSourcesExist();
                if (result == "passed"){
                    $modal.open({
                        templateUrl: 'myModalContent.html',
                        controller: "ModalInstanceCtrl"
                    });
                }
            };
        }]);

modalControllers.controller('ModalInstanceCtrl', ['$rootScope' ,'$scope', '$modalInstance', 'voidData',
       function ( $rootScope ,$scope, $modalInstance , voidData) {
           $scope.data = voidData.createVoid();

           $scope.$on('TurtleChanged', function(event, x) {
               console.log("turtle data of modal changed.");
               $scope.data = x;
               console.log("TurtleChanged in modal");
           });

           $scope.closeModal = function () {
               $modalInstance.dismiss('cancel');
           };
 }]);


modalControllers.controller('ModalAboutCtrl', ['$scope', '$rootScope' ,'$modal',
    function ($scope, $rootScope, $modal ) {
        $scope.open = function () {
                $modal.open({
                    templateUrl: 'myModalContentAbout.html',
                    controller: "ModalInstanceAboutCtrl"
                });
        };
    }]);

modalControllers.controller('ModalInstanceAboutCtrl', ['$rootScope' ,'$scope', '$modalInstance',
    function ( $rootScope ,$scope, $modalInstance ) {

        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
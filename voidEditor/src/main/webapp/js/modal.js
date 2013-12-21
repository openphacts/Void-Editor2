'use strict';

//angular.module('app', ['ui.bootstrap']);
// http://angular-ui.github.io/bootstrap/

var modalControllers = angular.module('modalControllers', ['voidDataService']);

// modal of Under the hood
modalControllers.controller('ModalExportCtrl', ['$scope', '$rootScope' , '$modal', 'voidData',
    function ($scope, $rootScope, $modal, voidData) {
        $scope.open = function () {
            console.log("Going to open modal!!");
            voidData.checkSources();
            var result = voidData.checkIfUriForSourcesExist();
            if (result == "passed") {
                $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: "ModalInstanceCtrl"
                });
            }
        };
    }]);

modalControllers.controller('ModalInstanceCtrl', ['$rootScope' , '$scope', '$modalInstance', 'voidData',
    function ($rootScope, $scope, $modalInstance, voidData) {
        $scope.data = voidData.createVoid();

        $scope.$on('TurtleChanged', function (event, x) {
            $scope.data = x;
        });

        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

// Modal which manages about pop up

modalControllers.controller('ModalAboutCtrl', ['$scope', '$rootScope' , '$modal',
    function ($scope, $rootScope, $modal) {
        $scope.open = function () {
            $modal.open({
                templateUrl: 'myModalContentAbout.html',
                controller: "ModalInstanceAboutCtrl"
            });
        };
    }]);

modalControllers.controller('ModalInstanceAboutCtrl', ['$rootScope' , '$scope', '$modalInstance',
    function ($rootScope, $scope, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

//modal which manager import
modalControllers.controller('ModalImportCtrl', ['$scope', '$rootScope' , '$modal',
    function ($scope, $rootScope, $modal) {
        $scope.open = function () {
            $modal.open({
                templateUrl: 'myModalImport.html',
                controller: "ModalInstanceImportCtrl"
            });
        };
    }]);

modalControllers.controller('ModalInstanceImportCtrl', ['$rootScope' , '$scope', '$modalInstance',
    function ($rootScope, $scope, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

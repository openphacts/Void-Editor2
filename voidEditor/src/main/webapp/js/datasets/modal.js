'use strict';

/**
 * @description All the Modal that are created here are based on : http://angular-ui.github.io/bootstrap/
 * @class angular_module.modalControllers
 */
var modalControllers = angular.module('modalControllers', ['voidDataService']);

/**
 * @class angular_module.modalControllers.ModalExportCtrl
 * @description Modal for Under the hood.
 * @function
 */
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
/**
 * @class angular_module.modalControllers.ModalInstanceCtrl
 * @function
 */
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
/**
 * @class angular_module.modalControllers.ModalAboutCtrl
 * @description Modal which manages about pop up.
 * @function
 */
modalControllers.controller('ModalAboutCtrl', ['$scope', '$rootScope' , '$modal',
    function ($scope, $rootScope, $modal) {
        $scope.open = function () {
            $modal.open({
                templateUrl: 'myModalContentAbout.html',
                controller: "ModalInstanceAboutCtrl"
            });
        };
    }]);

/**
 * @class angular_module.modalControllers.ModalInstanceAboutCtrl
 * @function
 */
modalControllers.controller('ModalInstanceAboutCtrl', ['$rootScope' , '$scope', '$modalInstance',
    function ($rootScope, $scope, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
/**
 * @class angular_module.modalControllers.ModalContributorsCtrl
 * @description Modal for adding more than one contributor.
 * @function
 */
modalControllers.controller('ModalContributorsCtrl', ['$scope', '$rootScope' , '$modal',
    function ($scope, $rootScope, $modal) {
        $scope.open = function () {
            $modal.open({
                templateUrl: 'myModalContentContributors.html',
                controller: "ModalInstanceContributorsCtrl"
            });
            $rootScope.$broadcast('getContributors');
        };
    }]);
/**
 * @function
 * @class angular_module.modalControllers.ModalInstanceContributorsCtrl
 */
modalControllers.controller('ModalInstanceContributorsCtrl', ['$rootScope' , '$scope', '$modalInstance',
    function ($rootScope, $scope, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
/**
 * @class angular_module.modalControllers.ModalImportCtrl
 * @description Modal which manages import.
 * @function
 */
modalControllers.controller('ModalImportCtrl', ['$scope', '$rootScope' , '$modal',
    function ($scope, $rootScope, $modal) {
        $scope.open = function () {
            $modal.open({
                templateUrl: 'myModalImport.html',
                controller: "ModalInstanceImportCtrl"
            });
        };
    }]);
/**
 * @function
 * @class angular_module.modalControllers.ModalInstanceImportCtrl
 */
modalControllers.controller('ModalInstanceImportCtrl', ['$rootScope' , '$scope', '$modalInstance',
    function ($rootScope, $scope, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

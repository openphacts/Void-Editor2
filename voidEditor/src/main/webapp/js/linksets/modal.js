'use strict';

//angular.module('app', ['ui.bootstrap']);
// http://angular-ui.github.io/bootstrap/
/**
 * @description All the Modal that are created here are based on : http://angular-ui.github.io/bootstrap/
 * @author Lefteris Tatakis
 * @class linksetCreator.linksetApp.modalControllers
 */
var modalControllers = angular.module('modalControllers', ['voidDataService']);

/**
 *  @description  Modal for Under the hood.
 *  @memberOf  linksetCreator.linksetApp.modalControllers
 *  @class linksetCreator.linksetApp.modalControllers.ModalExportCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 *  @param {$modal} $modal - The Angularjs JS handler for modals.
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
 *  @description  Modal for Under the hood.
 *  @memberOf  linksetCreator.linksetApp.modalControllers
 *  @class linksetCreator.linksetApp.modalControllers.ModalInstanceCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {Service} voidData - Service to handle the creation and retrieval of the VoID.
 *  @param {modalInstance} $modalInstance - The Angularjs JS handler for children of modal instances.
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
 *  @description  Modal which manages "about" pop up.
 *  @memberOf  linksetCreator.linksetApp.modalControllers
 *  @class linksetCreator.linksetApp.modalControllers.ModalAboutCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {$modal} $modal - The Angularjs JS handler for modals.
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
 *  @description   "About" functionality.
 *  @memberOf  linksetCreator.linksetApp.modalControllers
 *  @class linksetCreator.linksetApp.modalControllers.ModalInstanceAboutCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {modalInstance} $modalInstance - The Angularjs JS handler for children of modal instances.
 */
modalControllers.controller('ModalInstanceAboutCtrl', ['$rootScope' , '$scope', '$modalInstance',
    function ($rootScope, $scope, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

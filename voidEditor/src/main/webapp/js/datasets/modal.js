'use strict';

/**
 * @description All the Modal that are created here are based on : http://angular-ui.github.io/bootstrap/
 * @author Lefteris Tatakis
 * @class voidEditor.editorApp.modalControllers
 */
var modalControllers = angular.module('modalControllers', ['voidDataService']);

/**
 *  @description  Modal for Under the hood.
 *  @memberOf  voidEditor.editorApp.modalControllers
 *  @class voidEditor.editorApp.modalControllers.ModalExportCtrl
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
            voidData.checkDistributions();
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
 *  @memberOf  voidEditor.editorApp.modalControllers
 *  @class voidEditor.editorApp.modalControllers.ModalInstanceCtrl
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
 *  @memberOf  voidEditor.editorApp.modalControllers
 *  @class voidEditor.editorApp.modalControllers.ModalAboutCtrl
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
 *  @memberOf  voidEditor.editorApp.modalControllers
 *  @class voidEditor.editorApp.modalControllers.ModalInstanceAboutCtrl
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

/**
 *  @description Modal for adding more than one contributor.
 *  @memberOf  voidEditor.editorApp.modalControllers
 *  @class voidEditor.editorApp.modalControllers.ModalContributorsCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {$modal} $modal - The Angularjs JS handler for modals.
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
 *  @description   Contributor functionality.
 *  @memberOf  voidEditor.editorApp.modalControllers
 *  @class voidEditor.editorApp.modalControllers.ModalInstanceContributorsCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {modalInstance} $modalInstance - The Angularjs JS handler for children of modal instances.
 */
modalControllers.controller('ModalInstanceContributorsCtrl', ['$rootScope' , '$scope', '$modalInstance',
    function ($rootScope, $scope, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

/**
 *  @description Modal which manages import.
 *  @memberOf  voidEditor.editorApp.modalControllers
 *  @class voidEditor.editorApp.modalControllers.ModalImportCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {$modal} $modal - The Angularjs JS handler for modals.
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
 *  @description   Import functionality.
 *  @memberOf  voidEditor.editorApp.modalControllers
 *  @class voidEditor.editorApp.modalControllers.ModalInstanceImportCtrl
 *  @author Lefteris Tatakis
 *  @function
 *  @param {scope} $scope - The scope in which this controller operates.
 *  @param {rootScope} $rootScope - The parent of all the existing scopes.
 *  @param {modalInstance} $modalInstance - The Angularjs JS handler for children of modal instances.
 */
modalControllers.controller('ModalInstanceImportCtrl', ['$rootScope' , '$scope', '$modalInstance',
    function ($rootScope, $scope, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

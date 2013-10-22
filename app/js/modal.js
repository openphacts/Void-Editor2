'use strict';

//angular.module('app', ['ui.bootstrap']);
// http://angular-ui.github.io/bootstrap/

var ModalExportCtrl = function ($scope, $modal, $log) {
    $scope.open = function () {

        $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl
        });
    };

};

var ModalInstanceCtrl = function ($scope, $modalInstance) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
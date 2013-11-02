'use strict';

//angular.module('app', ['ui.bootstrap']);
// http://angular-ui.github.io/bootstrap/

var ModalExportCtrl = function ($scope, $rootScope, $modal, $log) {
    $scope.open = function () {

        $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl
        });
    };


};

var ModalInstanceCtrl = function ($scope, $rootScope , $modalInstance , voidData) {
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.data = voidData.createVoid();
    
    $scope.$on('TurtleChanged', function(event, x) {
    	 $scope.data = x;
    	console.log("TurtleChanged in modal");
    });
};
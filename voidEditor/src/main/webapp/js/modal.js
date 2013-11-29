'use strict';

//angular.module('app', ['ui.bootstrap']);
// http://angular-ui.github.io/bootstrap/

var ModalExportCtrl = function ($scope, $rootScope, $modal, $log) {

    $scope.open = function () {
        console.log("Going to open modal!!");
        $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl
        });
    };
};

var ModalInstanceCtrl = function ($scope, $rootScope , $modalInstance , voidData) {
    console.log("Going to load data in instance --- > data!!");
    $scope.data = voidData.createVoid();
    
    $scope.$on('TurtleChanged', function(event, x) {
        console.log("turtle data of modal changed.");
    	 $scope.data = x;
    	console.log("TurtleChanged in modal");
    });

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
};
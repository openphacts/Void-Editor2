/**
 * Created by Lefteris on 24/06/2014.
 */
function DropdownCtrl($scope) {
    $scope.items = [];
    $scope.items.push( {"name":"VoID Editor" , "link":"documents/js/dataset/voidEditor.html "});
    $scope.items.push( {"name":"Linkset Creator", "link":"documents/js/linkset/linksetCreator.html "});


    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
}
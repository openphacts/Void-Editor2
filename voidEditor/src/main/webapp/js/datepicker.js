'use strict';


var dateControllers = angular.module('dateControllers', []);

dateControllers.controller('DatepickerCtrl', ['$scope', '$rootScope' ,
    function ($scope, $rootScope) {
        $scope.dates = [];
        for (var i = 1; i <= 31; i++) {
            $scope.dates.push({"name": i});
        }
        $scope.dates.push({"name": "N/A"});

        $scope.months = [
            {"name": "Jan", "num": 1},
            {"name": "Feb", "num": 2},
            {"name": "Mar", "num": 3},
            {"name": "Apr", "num": 4},
            {"name": "May", "num": 5},
            {"name": "Jun", "num": 6},
            {"name": "Jul", "num": 7},
            {"name": "Aug", "num": 8},
            {"name": "Sep", "num": 9},
            {"name": "Nov", "num": 11},
            {"name": "Dec", "num": 12},
            {"name": "N/A", "num": 1}
        ];

        $scope.years = [
            {"name": "2013"},
            {"name": "2012"},
            {"name": "2011"},
            {"name": "2011"},
            {"name": "2010"},
            {"name": "2009"},
            {"name": "2008"},
            {"name": "2007"}
        ];

        $scope.checkDates = function (tmpYear, tmpMonth) {
            var checkDate;

            if ((tmpMonth) < 10) {
                checkDate = moment(tmpYear + "-0" + (tmpMonth), "YYYY-MM").daysInMonth();
            } else {
                checkDate = moment(tmpYear + "-" + tmpMonth, "YYYY-MM").daysInMonth();
            }
            if (checkDate != ($scope.dates.length + 1 )) {
                console.log($scope.dates.length);
                $scope.dates = [];
                for (var i = 1; i <= checkDate; i++) {
                    $scope.dates.push({"name": i});
                }
                $scope.dates.push({"name": "N/A"});
            }
        }
    }]);
'use strict';
// from http://angular-ui.github.io/bootstrap/

/* Removed functions which I do not use */
var DatepickerCtrl = function ($scope ,$rootScope) {
    $scope.dates =[];
    for (var i = 1 ; i <= 31 ; i++){
        $scope.dates.push({"name": i});
    }
    $scope.dates.push({"name": "N/A"});

   $scope.months = [  {"name" : "Jan"} , {"name" : "Feb"} , {"name" : "Mar"} , {"name" : "Apr"},
       {"name" : "May"}, {"name" : "Jun"}, {"name" : "Jul"}, {"name" : "Aug"}, {"name" : "Sep"},
       {"name" : "Oct"}, {"name" : "Nov"}, {"name" : "Dec"}, {"name":"N/A"} ];

   $scope.years = [  {"name" : "2013"} , {"name" : "2012"} ,
                        {"name" : "2011"} , {"name" : "2011"},
                      {"name" : "2010"} , {"name" : "2009"} ,
                        {"name" : "2008"} , {"name" : "2007"}];

   $scope.checkDates = function (tmpYear , tmpMonth ) {
        var found = 0, checkDate;
        console.log("Got in check Dates");
        for (var i = 0 ; i < $scope.months.length; i++)
        {
             if ($scope.months[i].name == tmpMonth ) found =1;
        }
        // found index is i +1
       if ( (i+1) < 10){
           checkDate = moment(tmpYear+"-0"+(i+1), "YYYY-MM").daysInMonth();
       }else{
           checkDate = moment(tmpYear+"-"+(i+1), "YYYY-MM").daysInMonth();
       }
        if (checkDate != ($scope.dates.length +1 )){ // +2 coz of bug in initial length (?)
            console.log($scope.dates.length);
           $scope.dates =[];
           for (var i = 1 ; i <= checkDate ; i++){
               $scope.dates.push({"name": i});
           }
           $scope.dates.push({"name": "N/A"});
            console.log(checkDate);
        }
   }
};
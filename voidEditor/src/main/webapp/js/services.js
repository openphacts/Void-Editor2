'use strict';

/* Services */
var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function($resource) {
        return $resource('res/datasources.json');
    });


var voidDataService = angular.module('voidDataService', [])
.service('voidData', function($rootScope , $http) {
     var turtleData = "";
	 var data = "";
	    	this.setTurtle = function(value) {
	    		turtleData = value;
                $rootScope.$broadcast('TurtleChanged', turtleData);
            }; 
            this.getTurtle = function() {
	    		return turtleData;
            };
            
            this.setData = function(value) {
            	data = value;
                $rootScope.$broadcast('DataChanged', data);
            }; 
            this.getData = function() {
	    		return data;
            };
    
            this.createVoid = function (){
            	
            	$rootScope.$broadcast('needData', data);
            	
    	       	$http({method: 'POST', url: '/voidEditor/rest/void' , data: data}).
    	       	  success(function(data, status, headers, config) {
    	       		  	turtleData =  data;
    	       		  	$rootScope.$broadcast('TurtleChanged', turtleData);
    	       	  }).
    	       	  error(function(data, status, headers, config) {
    	       		  console.log("Error in creating void - Status: " + status + "   data=>" + data);
    	       	  });
    	       	
    	       	return turtleData;
            };
});
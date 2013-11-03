'use strict';

/* Services */
var jsonService = angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function($resource) {
        return $resource('res/datasources.json');
    });


var voidDataService = angular.module('voidDataService', [])
.service('voidData', function($rootScope , $http , $window) {
     var turtleData = "";
	 var data = {};
	 data.sources = [];
	 var fileLocation ="";
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
            	
    	       	$http({method: 'POST', url: '/voidEditor/rest/void/output' , data: data}).
    	       	  success(function(data, status, headers, config) {
    	       		  	turtleData =  data;
    	       		  	$rootScope.$broadcast('TurtleChanged', turtleData);
    	       	  }).
    	       	  error(function(data, status, headers, config) {
    	       		  console.log("Error in creating void - Status: " + status + "   data=>" + data);
    	       	  });
    	       	
    	       	return turtleData;
            };

            this.setSourceData = function(value) {
                data.sources = value;
                console.log("====");
                console.log( data.sources);
                $rootScope.$broadcast('DataSourcesChanged',  data.sources);
            };

            this.getSourceData = function() {
                return data.sources;
            };
           
            this.createVoidAndDownload = function (){
            	
            	$rootScope.$broadcast('needData', data);
            	
    	       	$http({method: 'POST', url: '/voidEditor/rest/void/output' , data: data}).
    	       	  success(function(data, status, headers, config) {
    	       		  	turtleData =  data;
    	       		  	$rootScope.$broadcast('TurtleChanged', turtleData);
    	       		  	//$window.open("/voidEditor/rest/void/file");
    	       		  	var link = document.createElement('a');
			    	       	  angular.element(link).attr('href', "/voidEditor/rest/void/file");
			    	       	    // Pretty much only works in chrome
			    	    link.click();
    	       	  }).
    	       	  error(function(data, status, headers, config) {
    	       		  console.log("Error in creating void - Status: " + status + "   data=>" + data);
    	       	  });
    	       	
    	       	return turtleData;
            };
            
});
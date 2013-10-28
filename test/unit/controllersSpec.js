'use strict';
//beforeEach(module('editorAppControllers'));
//beforeEach(module('ui.bootstrap'));

/* jasmine specs for controllers go here */
describe('editorApp', function(){
    var scope, rootScope, ctrl, $httpBackend;

    beforeEach(module('editorApp'));
    beforeEach(module('editorAppControllers'));
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('jsonService'));

  describe('editorCtrl', function(){

      beforeEach(inject(function( _$httpBackend_, $rootScope, $controller) {
          $httpBackend = _$httpBackend_;
          scope = $rootScope.$new();
          ctrl = $controller('editorCtrl', {$scope: scope});
      }));

      it('test', function() {
        expect(scope.title).toBe("VoID Editor");
      });
  });


  describe('editorCarouselCtrl', function(){

      beforeEach(inject(function( _$httpBackend_, $rootScope, $controller) {
          $httpBackend = _$httpBackend_;
          scope = $rootScope.$new();
          ctrl = $controller('editorCarouselCtrl', {$scope: scope , $rootScope :$rootScope });
      }));

    it('should create "slides" array with more than 4 elements in',function() {
         expect(scope.slides.length).toBeGreaterThan(4);
    });

    it('should have index 0 for the first item and html page : page.html',function() {
        expect(scope.slides[0].page).toEqual("/app/partials/page.html");
        expect(scope.slides[0].index).toEqual(0);
    });

    it('should set the default value of dynamicProgress model to 0',function() {
         expect(scope.dynamicProgress).toBe(0);
    });

    it('should change the default value of dynamicProgress model to 10', function() {
        scope.changeProgressBar(10);
        expect(scope.dynamicProgress).toBe(10);
    });

   });

    describe('editorFormCtrl', function(){

        beforeEach(inject(function( _$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            ctrl = $controller('editorFormCtrl', {$scope: scope , $rootScope :$rootScope });
        }));

    });


    describe('sourceCtrl', function(){
        var mockedFactory;
        beforeEach(module('jsonService', function($provide) {
            mockedFactory = {
                get: function(){
                    return true; // not sure how to add a dummy data set to factory.
                }
            };
            $provide.value('JsonService', mockedFactory);
        }));

        beforeEach(inject(function( _$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            ctrl = $controller('sourceCtrl', {$scope: scope , JsonService : mockedFactory });
        }));

        it('Checking if extracting titles works correctly', function() {
           scope.extractTitlesOfSources();
           expect(scope.titles.length).toEqual(0);
        });

        it('Checking if titles checking works', function() {
            expect(scope.noTitleFilter({title: "string"})).toBe(true);
        });

        it('Checking if adding element in sources works', function() {
            var tmpLength = scope.userSources.length ;
            scope.addToSelected("valueNew");
            var tmpLengthNew = scope.userSources.length ;
            expect(tmpLength < tmpLengthNew).toBe(true);
        });

        it('Checking if removing element in sources works', function() {
            scope.addToSelected("valueNew");
            var tmpLength = scope.userSources.length ;
            scope.removeSelected("valueNew");
            var tmpLengthNew = scope.userSources.length ;
            expect(tmpLength > tmpLengthNew).toBe(true);
        });

    });

});

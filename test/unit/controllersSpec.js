'use strict';
//beforeEach(module('editorAppControllers'));
//beforeEach(module('ui.bootstrap'));

/* jasmine specs for controllers go here */
describe('editorApp', function(){
    var scope, rootScope, ctrl, $httpBackend;

    beforeEach(module('editorApp'));
    beforeEach(module('editorAppControllers'));
    beforeEach(module('ui.bootstrap'));

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
});

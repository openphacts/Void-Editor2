'use strict';

/* Code for modal is property of http://angular-ui.github.io/bootstrap/
 * Hence not providing tests */

 describe('editorApp', function() {
     var scope, rootScope, ctrl, $httpBackend, mockedVoidData;

     beforeEach(module('editorApp'));
     beforeEach(module('editorAppControllers'));
     beforeEach(module('ui.bootstrap'));
     beforeEach(module('jsonService'));
     beforeEach(module('voidDataService'));
     beforeEach(module('voidDataService', function($provide) {
         mockedVoidData = {
             setTurtle: jasmine.createSpy(),
             getTurtle: jasmine.createSpy(),
             setData: jasmine.createSpy(),
             getData: jasmine.createSpy(),
             setUriForSourcesExist: jasmine.createSpy(),
             checkIfUriForSourcesExist: function () {return "failed";},
             createVoid: jasmine.createSpy(),
             setSourceData:jasmine.createSpy(),
             deleteFile: jasmine.createSpy(),
             checkSources: jasmine.createSpy(),
             createVoidAndDownload: jasmine.createSpy()
         };
         $provide.value('voidData', mockedVoidData);
     }));

     describe('ModalExportCtrl', function () {

         beforeEach(inject(function (_$httpBackend_,  $rootScope, $controller , $modal) {
             $httpBackend =  _$httpBackend_;
             scope = $rootScope.$new();
             rootScope = $rootScope.$new();
             ctrl = $controller('ModalExportCtrl', { $scope: scope , $rootScope : $rootScope , $modal : $modal,  voidData: mockedVoidData });
         }));


         it('should call check sources in voidData', function () {
             scope.open();
             expect(mockedVoidData.checkSources).toHaveBeenCalled();
         });


     });

     /* Cant test does to need to provide modal instance Provider
     *  The main functionality of th ecode is not mine and also the code that exists in this ctrl is tested
     *  else where also.

     describe('ModalInstanceCtrl', function () {
         beforeEach(inject(function (_$httpBackend_,  $rootScope, $controller , $modalInstance) {
             $httpBackend =  _$httpBackend_;
             scope = $rootScope.$new();
             rootScope = $rootScope.$new();
             ctrl = $controller('ModalInstanceCtrl', {$rootScope : $rootScope , $scope: scope ,  $modalInstance : $modalInstance,  voidData: mockedVoidData });
         }));

         it('should call createVoid in voidData', function () {
             expect(mockedVoidData.createVoid).toHaveBeenCalled();
         });

     });
      */
 });
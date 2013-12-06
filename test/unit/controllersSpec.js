'use strict';
//beforeEach(module('editorAppControllers'));
//beforeEach(module('ui.bootstrap'));

/* jasmine specs for controllers go here */
describe('editorApp', function () {
    var scope, rootScope, ctrl, $httpBackend , mockedVoidData;

    beforeEach(module('editorApp'));
    beforeEach(module('editorAppControllers'));
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('jsonService'));
    beforeEach(module('voidDataService'));

    describe('editorCtrl', function () {

        beforeEach(module('voidDataService', function($provide) {
            mockedVoidData = {
                setTurtle: jasmine.createSpy(),
                getTurtle: jasmine.createSpy(),
                setData: jasmine.createSpy(),
                getData: jasmine.createSpy(),
                setUriForSourcesExist: jasmine.createSpy(),
                createVoid: jasmine.createSpy(),
                setSourceData:jasmine.createSpy(),
                deleteFile: jasmine.createSpy(),
                checkSources: jasmine.createSpy(),
                createVoidAndDownload: jasmine.createSpy()
            };
            $provide.value('voidData', mockedVoidData);
        }));

        beforeEach(inject(function (_$httpBackend_,  $rootScope, $controller) {
            $httpBackend =  _$httpBackend_;
            scope = $rootScope.$new();
            rootScope = $rootScope.$new();
            ctrl = $controller('editorCtrl', {  $scope: scope,  $rootScope : $rootScope ,voidData: mockedVoidData });
        }));

        it('testTitle', function () {
            expect(scope.title).toBe("VoID Editor");
        });

        it('make sure initial turtle value ok', function () {
            expect(rootScope.turtle).toBe("Loading...");
        });

        it('make sure initial error array is empty', function () {
            expect(rootScope.alerts.length).toBe(0);
        });

        it('make sure sources are initial 0', function () {
            expect(rootScope.data.sources.length).toBe(0);
        });


        it('make sure I provide an initial licence - by checking it has http:// at lets in', function () {
            expect(rootScope.data.licence).toContain("http://");
        });


        it('make sure I provide an initial updateFrequency', function () {
            expect(rootScope.data.updateFrequency.length > 0).toBe(true);
        });

        it('make sure rootScope.showOther is initially false', function () {
            expect(rootScope.showOther).toBe(false);
        });

        it('make sure rootScope.postFinished is initially false', function () {
            expect(rootScope.postFinished).toBe(false);
        });

        it('checking otherLicence works correctly', function () {
            rootScope.otherLicence("other");
            expect(rootScope.showOther).toBe(true);
            expect(rootScope.data.licence == "").toBe(true);
        });

        it('make sure closeAlert works', function () {
            rootScope.alerts.push({ type: 'error', msg: 'Teeeest'});
            rootScope.closeAlert(rootScope.alerts.length - 1)
            expect(rootScope.alerts.length == 0).toBe(true);
        });
    });


    describe('editorCarouselCtrl', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            rootScope = $rootScope.$new();
            ctrl = $controller('editorCarouselCtrl', {$scope: scope, $rootScope: $rootScope });
        }));

        it('should create "slides" array with more than 4 elements in', function () {
            expect(scope.slides.length).toBeGreaterThan(4);
        });

        it('should have index 0 for the first item and html page : page.html', function () {
            expect(scope.slides[0].page).toEqual("partials/page.html");
            expect(scope.slides[0].index).toEqual(0);
        });

        it('should set the default value of dynamicProgress model to 0', function () {
            expect(rootScope.dynamicProgress).toBe(0);
        });

        it('should set the default value of dynamicProgressStep model to 0', function () {
            expect(rootScope.dynamicProgressStep).toBeGreaterThan(0);
        });

        it('should set the default value of wrap model false', function () {
            expect(scope.wrap).toBe(false);
        });

        it('should change the default value of dynamicProgress model to 10', function () {
            scope.changeProgressBar(10);
            expect(scope.dynamicProgress).toBe(10);
        });

        it('make sure the last slide titles is Export RDF', function () {
            expect(scope.slides[scope.slides.length -1].title).toContain("Export");
        });

    });

    describe('editorFormCtrl', function () {
        beforeEach(module('voidDataService', function($provide) {
            mockedVoidData = {
                setTurtle: jasmine.createSpy(),
                getTurtle: jasmine.createSpy(),
                setData: jasmine.createSpy(),
                getData: jasmine.createSpy(),
                setUriForSourcesExist: jasmine.createSpy(),
                createVoid: jasmine.createSpy(),
                setSourceData:jasmine.createSpy(),
                deleteFile: jasmine.createSpy(),
                checkSources: jasmine.createSpy(),
                createVoidAndDownload: jasmine.createSpy()
            };
            $provide.value('voidData', mockedVoidData);
        }));


        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            rootScope = $rootScope.$new();
            ctrl = $controller('editorFormCtrl', {$rootScope : $rootScope , $scope: scope ,   $http: $httpBackend ,  voidData: mockedVoidData });
        }));
        // Create Void

        it('called createVoid - should call createVoid of voidData ', function () {
            rootScope.createVoid();
            expect(mockedVoidData.createVoid).toHaveBeenCalled();
        });

        // Download File
        it('called downloadFile - should call createVoidAndDownload of voidData ', function () {
            rootScope.downloadFile();
            expect(mockedVoidData.createVoidAndDownload).toHaveBeenCalled();
        });

    });


    describe('sourceCtrl', function () {
        var mockedFactory;
        beforeEach(module('jsonService', function ($provide) {
            mockedFactory = {
                get: function () {
                    return true; // not sure how to add a dummy data set to factory.
                }
            };
            $provide.value('JsonService', mockedFactory);
        }));

        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            ctrl = $controller('sourceCtrl', {$scope: scope, JsonService: mockedFactory });
        }));

        it('Checking if extracting titles works correctly', function () {
            scope.extractTitlesOfSources();
            expect(scope.titles.length).toEqual(0);
        });

        it('Checking if titles checking works', function () {
            expect(scope.noTitleFilter({title: "string"})).toBe(true);
        });

        it('Checking if adding element in sources works', function () {
            var tmpLength = scope.userSources.length;
            scope.addToSelected("valueNew");
            var tmpLengthNew = scope.userSources.length;
            expect(tmpLength < tmpLengthNew).toBe(true);
        });

        it('Checking if removing element in sources works', function () {
            scope.addToSelected("valueNew");
            var tmpLength = scope.userSources.length;
            scope.removeSelected("valueNew");
            var tmpLengthNew = scope.userSources.length;
            expect(tmpLength > tmpLengthNew).toBe(true);
        });

    });

});

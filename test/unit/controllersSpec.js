'use strict';
//beforeEach(module('editorAppControllers'));
//beforeEach(module('ui.bootstrap'));

/* jasmine specs for controllers go here */
describe('editorApp', function () {
    var scope, rootScope, ctrl, $httpBackend , mockedVoidData, mockedUploadUserData;

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
                createVoidAndDownload: jasmine.createSpy(),
                querySparqlEndPoint:jasmine.createSpy()
            };
            $provide.value('voidData', mockedVoidData);
        }));

        beforeEach(module('userDataUploadService', function($provide) {
            mockedUploadUserData = {
                process : jasmine.createSpy()
            };
            $provide.value('uploadUserData', mockedUploadUserData);
        }));

        beforeEach(inject(function (_$httpBackend_,  $rootScope, $controller) {
            $httpBackend =  _$httpBackend_;
            scope = $rootScope.$new();
            rootScope = $rootScope.$new();
            ctrl = $controller('editorCtrl', {  $scope: scope,  $rootScope : $rootScope ,voidData: mockedVoidData , uploadUserData: mockedUploadUserData});
        }));

        it('testTitle', function () {
            expect(scope.title).toBe("VoID Editor");
        });

        it('make sure initial disabledExport value ok', function () {
            expect(rootScope.disabledExport).toBe(false);
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

        it('checking otherLicence works correctly - 2', function () {
            rootScope.otherLicence("test");
            expect(rootScope.showOther).toBe(false);
        });

        it('makes sure closeAlert works', function () {
            rootScope.alerts.push({ type: 'error', msg: 'Teeeest'});
            rootScope.closeAlert(rootScope.alerts.length - 1);
            expect(rootScope.alerts.length == 0).toBe(true);
        });

        it('makes sure checkIfAlertExists works', function () {
            rootScope.alerts.push({ id:"test", type: 'error', msg: 'Teeeest'});
            expect( rootScope.checkIfAlertNeedsAdding("test")).toBe(false);
        });

        it('makes sure removeAlert works', function () {
            rootScope.alerts.push({ id:"test", type: 'error', msg: 'Teeeest'});
            rootScope.removeAlert("test");
            expect( rootScope.checkIfAlertNeedsAdding("test")).toBe(true);
        });

        it('makes sure fieldsToAdd works', function () {
            var result = rootScope.fieldsToAdd();
            expect(result.length > 0 ).toBe(true);
        });

        it('makes sure fieldsToAdd contains h4', function () {
            var result = rootScope.fieldsToAdd();
            expect(result.indexOf("<h4")> -1 ).toBe(true);
        });

        it('makes adds the correct alert-addAlert - 1 ', function () {
            rootScope.addAlert("URI");
            expect( rootScope.checkIfAlertNeedsAdding("URI") ).toBe(false);
        });

        it('makes adds the correct alert-addAlert - 2 ', function () {
            rootScope.addAlert("downloadFrom");
            expect( rootScope.checkIfAlertNeedsAdding("downloadFrom") ).toBe(false);
        });

        //Not working because mustFields cannot be modified externally
//        it('checkMustFieldsOnPreviousPage - adds errors', function () {
//            rootScope.mustFields = [{'index': 0, 'mustFields': ["publisher"] }];
//            rootScope.checkMustFieldsOnPreviousPage(0);
//            expect(  rootScope.checkIfAlertNeedsAdding("publisher") ).toBe(false);
//        });

        it('should call process of uploadVoidData when going to upload a file to server ', function () {
            var mockFile = ["1" , "2"];
            rootScope.letUserUploadData(mockFile);
            expect(mockedUploadUserData.process).toHaveBeenCalled();
        });

        it('should call process of  voidData.querySparqlEndPoint when going to query sparql endpoint ', function () {
            rootScope.data.sparqlEndpoint = "http://test";
            rootScope.callSparqlEndpoint();
            expect(mockedVoidData.querySparqlEndPoint).toHaveBeenCalled();
        });

        it('should fail to call process of  voidData.querySparqlEndPoint when going to query sparql endpoint ', function () {
            rootScope.data.sparqlEndpoint = "boom!";
            rootScope.callSparqlEndpoint();
            expect(mockedVoidData.querySparqlEndPoint).not.toHaveBeenCalled();
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

        it('should add at least 2 mustFields', function () {
            expect(rootScope.mustFields.length).toBeGreaterThan(1);
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

    describe('editorUploadCtrl', function () {
        beforeEach(module('voidUploadService', function($provide) {
            mockedVoidData = {
                process: jasmine.createSpy()
            };
            $provide.value('uploadVoidData', mockedVoidData);
        }));


        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            rootScope = $rootScope.$new();
            ctrl = $controller('editorUploadCtrl', {$rootScope : $rootScope , $scope: scope ,   $http: $httpBackend ,  uploadVoidData: mockedVoidData });
        }));
        // Create Void

        it('should call process of uploadVoidData when going to upload a file to server ', function () {
            var mockFile = ["1" , "2"];
            rootScope.uploadVoid(mockFile);
            expect(mockedVoidData.process).toHaveBeenCalled();
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

    describe('contibutorCtrl', function () {
        var mockContributorORCIDService ;

        beforeEach(module('voidDataService', function($provide) {
            mockedVoidData = {
                createVoidAndDownload: jasmine.createSpy(),
                setContributorData: jasmine.createSpy()
            };
            $provide.value('voidData', mockedVoidData);
        }));


        beforeEach(module('ContributorORCIDService', function($provide) {
            mockContributorORCIDService = {
                callORCIDEndpointContributor: jasmine.createSpy()
            };
            $provide.value('ContributorORCIDService', mockContributorORCIDService);
        }));

        beforeEach(inject(function ( $rootScope, $controller) {
            scope = $rootScope.$new();

            rootScope = $rootScope.$new();
            ctrl = $controller('editorContributorsCtrl', {$rootScope : $rootScope , $scope: scope ,  voidData: mockedVoidData , ContributorORCIDService : mockContributorORCIDService });
        }));

//          issue with contributors having a dependency on the rootscope. Creating issues.
//        it('Checking contributors lenght >=0', function () {
//            console.log(scope.contributors);
//            expect(scope.contributors.length).toBeGreaterThan(-1);
//        });
//
//        it('Checking if orcid check start at 0', function () {
//            expect(scope.orcidCheck).toEqual(0);
//        });
//
//
//        it('Checking if on save void data is called', function () {
//            scope.save();
//            expect(mockedVoidData.setContributorData).toHaveBeenCalled();
//        });
//
//        it('Checking if on add void data is called', function () {
//            scope.add();
//            expect(mockedVoidData.setContributorData).toHaveBeenCalled();
//        });


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
            ctrl = $controller('sourceCtrl', {$scope: scope, JsonService: mockedFactory, voidData: mockedVoidData});
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
            expect(mockedVoidData.setSourceData).toHaveBeenCalled();
        });

        it('Checking if removing element in sources works', function () {
            scope.addToSelected("valueNew");
            var tmpLength = scope.userSources.length;
            scope.removeSelected("valueNew");
            var tmpLengthNew = scope.userSources.length;
            expect(tmpLength > tmpLengthNew).toBe(true);
            expect(mockedVoidData.setSourceData).toHaveBeenCalled();
        });

    });

});

'use strict';

/* Code for date picker is property of http://angular-ui.github.io/bootstrap/
 * Hence not providing tests */
    describe('dateControllers', function() {
        var scope, rootScope, ctrl, $httpBackend;

        beforeEach(module('editorApp'));
        beforeEach(module('editorAppControllers'));
        beforeEach(module('ui.bootstrap'));
        beforeEach(module('jsonService'));
        beforeEach(module('voidDataService'));

        describe('DatepickerCtrl', function () {
            beforeEach(inject(function (_$httpBackend_,  $rootScope, $controller) {
                $httpBackend =  _$httpBackend_;
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                ctrl = $controller('DatepickerCtrl', { $scope: scope , $rootScope : $rootScope });
            }));

            it('should have dates array > 20 ', function () {
                expect(scope.dates.length > 20).toBe(true);
            });

            it('should have in array months first item Jan with month 1 ', function () {
                expect(scope.months[0].name ).toBe("Jan");
                expect(scope.months[0].num ).toBe(1);
            });

            it('should have in array years should be have length > 5 ', function () {
                expect(scope.years.length > 5).toBe(true);
            });

          /*  it('should have check Feb 2013 and say it had 28 days + 1 (N/A) ', function () {
                scope.checkDates("2013" , 2);
                expect(scope.dates.length == 29).toBe(true);
            });
            */
        });
    });

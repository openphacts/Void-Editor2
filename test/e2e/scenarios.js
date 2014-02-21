'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('VoID editor App', function() {

    beforeEach(function() {
        browser().navigateTo('/voidEditor/src/main/webapp/index.html');
    });

    it('should throw errors if you nagivate to the publishing page and havent filled all fields', function () {

        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right again").click();
        input('data.publisher').enter('http://d');
        expect(element("div.custom_carousel.ng-scope div#title.myAlert.alert", "counting errors").count()).toBe(1);
    });

    it('should throw errors disappear if you fill fields of title and description', function () {
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right again").click();
        input('data.publisher').enter('http://test');
        expect(element('span.ng-scope.ng-binding').text()).not().toContain('Ooops');
        element('a.carousel-control.left', "click left").click();
        input('data.title').enter('A Title');
        input('data.description').enter('A description');
        input('data.URI').enter('http://test');
        expect(element('span.ng-scope.ng-binding')).not().toBeDefined();
    });

    it('should show sources are added', function () {
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        //should have arrived at sources
        element('li#ChemSpider Dataset.thumbnail.ng-scope.ng-binding.span', "click on glyph").click();
        expect(repeater('ul#selectedSources li').count()).toEqual(1);
    });

    it('should throw error if you try to view "under the hood" without a version', function () {
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        //should have arrived at sources
        element('li#ChemSpider Dataset.thumbnail.ng-scope.ng-binding.span', "click on glyph").click();
        expect(repeater('ul#selectedSources li').count()).toEqual(1);
        element('button#underTheHood').click();
        expect(element('span.ng-scope.ng-binding').text()).toContain('Ooops! You forgot to gives us a version for the source you cited!');
    });

    it('should try to go to export without filing any fields and fail', function () {
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        element('a.carousel-control.right', "click right").click();
        expect(element("button#exportVoidButton")).toBeDisabled();
    });


});

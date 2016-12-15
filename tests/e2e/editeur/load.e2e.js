var mockAPI = require('../../mocked-backend');
var utils = require('../../utils');

describe('loading', function() {
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.addMockModule('httpBackendMock', mockAPI.httpBackendMock);

        browser.get('http://crunchmail-toothpaste.local/local/#/');
    });

    it('App loaded', function() {
        expect(element(by.css('.container')).isPresent()).toBe(true);
    });

    it('Listing template loaded', function() {
        var templateName = element.all(by.css('.is-active .list-tpl')).all(by.css('.tpl-name'));

        expect(templateName.getText()).toEqual(['Test Template 1', 'Test Template 2']);
    });

    it('Template loaded', function() {
        utils.waitUntilReady(element(by.css('v-page.is-active')));
        element(by.css('v-page.is-active .list-tpl li:first-child > div')).click().then(function() {
            utils.waitUntilReady(element(by.css('.tpl-preview.active a')));
            element(by.css('.tpl-preview.active a')).click().then(function() {
                expect(element(by.css('.firstInclude .crunchBlock')).isPresent()).toBe(true);
            });
        });
    });
});

var mockAPI = require('../../mocked-backend');
var utils = require('../../utils');

describe('Test container : ', function() {
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.addMockModule('httpBackendMock', mockAPI.httpBackendMock);
        browser.get(browser.baseUrl + 'editeur/aHR0cDovL211bmNoLmxvY2FsL3YxL3RlbXBsYXRlLXN0b3JlL2RvY3VtZW50cy8xLw==/template');

        firstContainer = element.all(by.css('.type-container')).get(0);

        utils.waitUntilReady(firstContainer);

        browser.actions().mouseMove(firstContainer).perform();

        utils.waitUntilReady(element(by.css('.type-container .container-menu-element')));
    });

    afterEach(function() {
        browser.removeMockModule('httpBackendMock');
    });

    it('Delete', function() {
        element(by.css('.type-container .container-menu-element .icon-trashcan')).click().then(function() {
            utils.waitUntilReady(element(by.css('.ngdialog')));
            element(by.css('.ngdialog button[type="submit"]')).click().then(function() {
                expect(element(by.css('.firstInclude .crunchBlock')).isPresent()).toBe(false);
            });
        });
    });

    it('Duplicate', function() {
        element(by.css('.type-container .container-menu-element .icon-queue')).click().then(function() {
            expect(element.all(by.css('.firstInclude > ul > li')).count()).toBe(4);
        });
    });

    it('Show settings', function() {
        element(by.css('.type-container .container-menu-element .icon-settings')).click().then(function() {
            expect(element(by.css('.wysiwygContainer.active')).isPresent()).toBe(true);
        });
    });

});

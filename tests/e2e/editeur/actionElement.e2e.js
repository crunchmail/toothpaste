var mockAPI = require('../../mocked-backend');
var utils = require('../../utils');

describe('Test element', function() {
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.addMockModule('httpBackendMock', mockAPI.httpBackendMock);
        browser.get(browser.baseUrl + 'editeur/aHR0cDovL211bmNoLmxvY2FsL3YxL3RlbXBsYXRlLXN0b3JlL2RvY3VtZW50cy8xLw==/template');

        firstElement = element.all(by.css('.type-item')).get(0);

        utils.waitUntilReady(firstElement);

        browser.actions().mouseMove(firstElement).perform();

        utils.waitUntilReady(element(by.css('.type-item:first-child .menu-type-item')));
    });

    afterEach(function() {
        browser.removeMockModule('httpBackendMock');
    });

    it('Delete', function() {
        var countElements = 0;
        element.all(by.css('.type-item')).count().then(function(count) {
            countElements = count;
            firstElement.all(by.css('.menu-type-item .icon-trashcan')).click().then(function() {
                expect(element.all(by.css('.type-item')).count()).toBe(count - 1);
            });
        });
    });

    it('Duplicate', function() {
        var countElements = 0;
        element.all(by.css('.type-item')).count().then(function(count) {
            countElements = count;
            firstElement.all(by.css('.menu-type-item .icon-queue')).click().then(function() {
                expect(element.all(by.css('.type-item')).count()).toBe(count + 1);
            });
        });
    });
});

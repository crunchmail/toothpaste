var mockAPI = require('../../mocked-backend');
var utils = require('../../utils');

describe('Test wysiwyg container : ', function() {
    var firstContainer;
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

    it('Align left', function() {
        element(by.css('.type-container .container-menu-element .icon-settings')).click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active')));
            element(by.css('.wysiwygContainer.active .icon-format-align-left')).click().then(function() {
                expect(firstContainer.all(by.tagName("div")).getAttribute("class")).toMatch(/crunchTal/);
            });
        });
    });

    it('Align center', function() {
        element(by.css('.type-container .container-menu-element .icon-settings')).click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active')));
            element(by.css('.wysiwygContainer.active .icon-format-align-center')).click().then(function() {
                expect(firstContainer.all(by.tagName("div")).getAttribute("class")).toMatch(/crunchTac/);
            });
        });
    });
    //
    it('Align right', function() {
        element(by.css('.type-container .container-menu-element .icon-settings')).click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active')));
            element(by.css('.wysiwygContainer.active .icon-format-align-right')).click().then(function() {
                expect(firstContainer.all(by.tagName("div")).getAttribute("class")).toMatch(/crunchTar/);
            });
        });
    });
    //
    it('Fit', function() {
        element(by.css('.type-container .container-menu-element .icon-settings')).click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active')));
            element(by.css('.wysiwygContainer.active .form-wysiwyg > input + label')).click().then(function() {
                expect(firstContainer.all(by.tagName("div")).getAttribute("class")).toMatch(/crunchFitBlock/);
            });
        });

    });

    it('Show colorPicker', function() {
        element(by.css('.type-container .container-menu-element .icon-settings')).click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active')));
            element(by.css('.wysiwygContainer.active .form-wysiwyg .color-picker-input')).click().then(function() {
                expect(element(by.css('.wysiwygContainer.active .form-wysiwyg .color-picker-panel')).isDisplayed()).toBe(true);
            });
        });
    });

    it('Change backgroundColor', function() {
        element(by.css('.type-container .container-menu-element .icon-settings')).click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active')));
            element(by.css('.wysiwygContainer.active .form-wysiwyg .color-picker-input')).clear().sendKeys("#444444");
            expect(element(by.css('.type-container > div')).getAttribute("style")).toEqual("background-color: rgb(68, 68, 68);");
        });
    });
});

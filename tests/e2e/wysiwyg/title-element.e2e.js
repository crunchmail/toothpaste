var mockAPI = require('../../mocked-backend');
var utils = require('../../utils');

describe('Test wysiwyg element title : ', function() {
    var firstContainer;
    var titleElement;
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.addMockModule('httpBackendMock', mockAPI.httpBackendMock);
        browser.get(browser.baseUrl + 'editeur/aHR0cDovL211bmNoLmxvY2FsL3YxL3RlbXBsYXRlLXN0b3JlL2RvY3VtZW50cy8xLw==/template');
        titleElement = element(by.css('.crunchTitle:first-child'));

        utils.waitUntilReady(titleElement);
    });

    afterEach(function() {
        browser.removeMockModule('httpBackendMock');
    });

    it("Font size", function() {
        titleElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-font-size')));
            element(by.css('.wysiwygContainer.active .icon-font-size')).click().then(function() {
                utils.waitUntilReady(element(by.css('.modalColor .fontSizeInput')));
                element(by.css('.modalColor .fontSizeInput')).clear().sendKeys("40");
                expect(titleElement.getAttribute("style")).toEqual("font-size: 40px;");
            });
        });
    });

    it("Font family", function() {
        titleElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-font-family')));
            element(by.css('.wysiwygContainer.active .icon-font-family')).click().then(function() {
                utils.waitUntilReady(element(by.css('.ngdialog-content .customSelect')));
                element(by.css('.ngdialog-content .customSelect')).click().then(function() {
                    element(by.css('.ngdialog-content .form-font-family option:nth-child(2)')).click().then(function() {
                        expect(titleElement.getAttribute("style")).toEqual("font-family: Georgia;");
                    });
                });
            });
        });
    });

    it("Color text", function() {
        titleElement.click().then(function() {
            utils.selectText('.crunchTitle:first-child');
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-color')));
            element(by.css('.wysiwygContainer.active .icon-color')).click().then(function() {
                utils.waitUntilReady(element(by.css('.modalColor .color-picker-input')));
                element(by.css('.modalColor .color-picker-input')).clear().sendKeys("#FF0000");
                element(by.css('.modalColor .btnModal')).click().then(function() {
                    expect(element(by.css('.crunchTitle:first-child font')).isPresent()).toBe(true);
                });
            });
        });
    });

    it("Align left", function() {
        titleElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-text-align-left')));
            element(by.css('.wysiwygContainer.active .icon-text-align-left')).click().then(function() {
                expect(titleElement.getAttribute("style")).toEqual("text-align: left;");
            });
        });
    });

    it("Align center", function() {
        titleElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-text-align-center')));
            element(by.css('.wysiwygContainer.active .icon-text-align-center')).click().then(function() {
                expect(titleElement.getAttribute("style")).toEqual("text-align: center;");
            });
        });
    });

    it("Align right", function() {
        titleElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-text-align-right')));
            element(by.css('.wysiwygContainer.active .icon-text-align-right')).click().then(function() {
                expect(titleElement.getAttribute("style")).toEqual("text-align: right;");
            });
        });
    });

    it("removeFormat", function() {
        utils.setAttr('.crunchTitle:first-child', "style", "text-align: center;");
        titleElement.click().then(function() {
            utils.selectText('.crunchTitle:first-child');
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-removeFormat')));
            element(by.css('.wysiwygContainer.active .icon-removeFormat')).click().then(function() {
                element(by.css('.wysiwygContainer.active .icon-removeFormat')).click().then(function() {
                    expect(titleElement.getAttribute("style")).toEqual('');
                });
            });
        });
    });
});

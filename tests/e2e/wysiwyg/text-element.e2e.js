var mockAPI = require('../../mocked-backend');
var utils = require('../../utils');

describe('Test wysiwyg element text : ', function() {
    var firstContainer;
    var titleElement;
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.addMockModule('httpBackendMock', mockAPI.httpBackendMock);
        browser.get(browser.baseUrl + 'editeur/aHR0cDovL211bmNoLmxvY2FsL3YxL3RlbXBsYXRlLXN0b3JlL2RvY3VtZW50cy8xLw==/template');

        textElement = element(by.css('.crunchText:first-child'));

        utils.waitUntilReady(textElement);
    });

    afterEach(function() {
        browser.removeMockModule('httpBackendMock');
    });

    it("Font size", function() {
        textElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-font-size')));
            element(by.css('.wysiwygContainer.active .icon-font-size')).click().then(function() {
                utils.waitUntilReady(element(by.css('.modalColor .fontSizeInput')));
                element(by.css('.modalColor .fontSizeInput')).clear().sendKeys("18");
                expect(textElement.getAttribute("style")).toEqual("font-size: 18px;");
            });
        });
    });

    it("Font family", function() {
        textElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-font-family')));
            element(by.css('.wysiwygContainer.active .icon-font-family')).click().then(function() {
                utils.waitUntilReady(element(by.css('.ngdialog-content .customSelect')));
                element(by.css('.ngdialog-content .customSelect')).click().then(function() {
                    element(by.css('.ngdialog-content .form-font-family option:nth-child(2)')).click().then(function() {
                        expect(textElement.getAttribute("style")).toEqual("font-family: Georgia;");
                    });
                });
            });
        });
    });

    it("Color text", function() {
        textElement.click().then(function() {
            utils.selectText('.crunchText:first-child');
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-color')));
            element(by.css('.wysiwygContainer.active .icon-color')).click().then(function() {
                utils.waitUntilReady(element(by.css('.modalColor .color-picker-input')));
                element(by.css('.modalColor .color-picker-input')).clear().sendKeys("#FF0000");
                element(by.css('.modalColor .btnModal')).click().then(function() {
                    expect(element(by.css('.crunchText:first-child font')).isPresent()).toBe(true);
                });
            });
        });
    });

    it("Align left", function() {
        textElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-text-align-left')));
            element(by.css('.wysiwygContainer.active .icon-text-align-left')).click().then(function() {
                expect(textElement.getAttribute("style")).toEqual("text-align: left;");
            });
        });
    });

    it("Align center", function() {
        textElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-text-align-center')));
            element(by.css('.wysiwygContainer.active .icon-text-align-center')).click().then(function() {
                expect(textElement.getAttribute("style")).toEqual("text-align: center;");
            });
        });
    });

    it("Align right", function() {
        textElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-text-align-right')));
            element(by.css('.wysiwygContainer.active .icon-text-align-right')).click().then(function() {
                expect(textElement.getAttribute("style")).toEqual("text-align: right;");
            });
        });
    });

    it("Bold", function() {
        textElement.click().then(function() {
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-bold')));
            utils.selectText('.crunchText:first-child');
            element(by.css('.wysiwygContainer.active .icon-bold')).click().then(function() {
                element(by.css('.wysiwygContainer.active .icon-bold')).click().then(function() {
                    expect(element(by.css('.crunchText:first-child b')).isPresent()).toBe(true);
                });
            });
        });
    });

    it("Italic", function() {
        textElement.click().then(function() {
            utils.selectText('.crunchText:first-child');
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-italic')));
            element(by.css('.wysiwygContainer.active .icon-italic')).click().then(function() {
                element(by.css('.wysiwygContainer.active .icon-italic')).click().then(function() {
                    expect(element(by.css('.crunchText:first-child i')).isPresent()).toBe(true);
                });
            });
        });
    });

    it("Underline", function() {
        textElement.click().then(function() {
            utils.selectText('.crunchText:first-child');
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-underline')));
            element(by.css('.wysiwygContainer.active .icon-underline')).click().then(function() {
                element(by.css('.wysiwygContainer.active .icon-underline')).click().then(function() {
                    expect(element(by.css('.crunchText:first-child u')).isPresent()).toBe(true);
                });
            });
        });
    });

    it("removeFormat", function() {
        utils.setAttr('.crunchTitle:first-child', "style", "text-align: center;");
        textElement.click().then(function() {
            utils.selectText('.crunchText:first-child');
            utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-removeFormat')));
            element(by.css('.wysiwygContainer.active .icon-removeFormat')).click().then(function() {
                element(by.css('.wysiwygContainer.active .icon-removeFormat')).click().then(function() {
                    expect(textElement.getAttribute("style")).toEqual('');
                });
            });
        });
    });

    // it("Add link", function() {
    //     textElement.click().then(function() {
    //         utils.selectText('.crunchText:first-child');
    //         utils.waitUntilReady(element(by.css('.wysiwygContainer.active .icon-link')));
    //         element(by.css('.wysiwygContainer.active .icon-link')).click().then(function() {
    //             utils.waitUntilReady(element(by.css('.linkModal input')));
    //             element(by.css('.linkModal input')).clear().sendKeys("http://crunchmail.net/");
    //             utils.selectText('.crunchText:first-child');
    //             browser.pause(2000);
    //             element(by.css('.linkModal .btnModal')).click().then(function() {
    //                 browser.pause();
    //                 // element(by.css('.linkModal .btnModal')).click().then(function() {
    //                 //     browser.pause();
    //                 //     //expect(element(by.css('.crunchText:first-child a')).isPresent()).toBe(true);
    //                 // });
    //                 //expect(element(by.css('.crunchText:first-child a')).isPresent()).toBe(true);
    //             });
    //             // element(by.css('.wysiwygContainer.active .icon-link')).click().then(function() {
    //             //     utils.waitUntilReady(element(by.css('.linkModal input')));
    //             //     element(by.css('.linkModal input')).clear().sendKeys("http://crunchmail.net/");
    //             //     browser.pause();
    //             //     // element(by.css('.linkModal .btnModal')).click().then(function() {
    //             //     //     browser.pause();
    //             //     //     expect(element(by.css('.crunchText:first-child a')).isPresent()).toBe(true);
    //             //     // });
    //             // });
    //         });
    //     });
    // });
});

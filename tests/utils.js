exports.waitUntilReady = function(elm) {
    browser.wait(function () {
        return elm.isPresent();
    });
    browser.wait(function () {
        return elm.isDisplayed();
    });
};

exports.selectText = function(elm) {
    browser.executeScript(function(el) {
        console.log(el);
        var range = document.createRange();
        range.selectNode(document.body.querySelector(el));

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        return sel;
    }, elm);
};

exports.setAttr = function(elm, attr, value) {
    browser.executeScript(function(el, attr, value) {
        document.body.querySelector(el).setAttribute(attr, value);
    }, elm, attr, value);
};

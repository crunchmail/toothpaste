exports.config = {
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    capabilities: {
        'browserName': 'chrome'
    },
    // multiCapabilities: [{
    //   'browserName': 'chrome'
    // }, {
    //   'browserName': 'firefox'
    // }],
    framework: 'jasmine',
    baseUrl: 'http://localhost:4000/local/#/',
};

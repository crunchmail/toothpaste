var bootstrapToothpaste = (function () {

    /**
     * Default settings
     */
    var settings = {
        "iframeId": "",
        "apiUrl": "http://127.0.0.1.8000/",
        "token": "",
        "idMessage": ""
    };

    /**
     * @param {Object} custom_settings Passing integration settings
     */
    var _initSettings = function(custom_settings) {
        for (var option in settings) {
            if (settings.hasOwnProperty(option)) {
                settings[option] = custom_settings.hasOwnProperty(option) ? custom_settings[option] : settings[option];
            }
        }
    };

    /**
     * @param {Object} event Data received from Toothpaste postMessage
     */
    var _postMessageListener = function(event) {
        var iframe = document.getElementById(settings.iframeId);
        if(event.data !== "") {
            var response = JSON.parse(event.data);
            if(response.source === "Toothpaste") {
                var content = response.content;
                if(content.hasOwnProperty("close") && content.close) {
                    iframe.style.display = "none";
                }
            }else {
                console.warn("not good source");
            }
        }
    };

    /**
     * Setup postMessage listener
     */
    var _setupListener = function() {
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, _postMessageListener, false);
    };

    /**
     * Init iframe url
     */
    var _initIframeUrl = function() {

        /**
         * Get path
         */
        var bootstrapRoot = '';
        /**
         * Get all script tag
         */
        var allScripts = document.getElementsByTagName('script');
        var re = /^(.*)toothpaste_bootstrap\.(min\.)*js(.*)/;
        [].forEach.call(allScripts, function (tag) {
            var src = tag.getAttribute('src');
            var match = re.exec(src);
            if (match) {
                // Found a base url to use
                bootstrapRoot = match[1];
            }
        });

        var iframe = document.getElementById(settings.iframeId);
        var urlIframe = bootstrapRoot + "../#/?r=" + (new Date()).getTime() + "&apiUrl=" + settings.apiUrl + "&token=" + settings.token;
        if(settings.idMessage !== "") {
            urlIframe += "&idMessage" + settings.idMessage;
        }
        iframe.src = urlIframe;
    };

    /**
     * Init bootstrap toothpaste
     * @param {Object} custom_settings customer settings
     */
    var init = function(custom_settings) {
        /**
         * Init Listener postMessage
         */
        _setupListener();
        /**
         * Get customer settings and merge in default
         */
        _initSettings(custom_settings);
        /**
         * Launch Toothpaste
         */
        _initIframeUrl();
    };

    return {
        init: init
    };
})();

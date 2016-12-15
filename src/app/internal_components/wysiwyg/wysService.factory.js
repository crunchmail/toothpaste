/**
 * @ngdoc service
 * @name wysiwyg.factory:wysService
 * @restrict E
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires https://docs.angularjs.org/api/ng/service/$http
 * @description
 * Utils functions to wysiwyg
 */
(function () {
    'use strict';

    var factory = function(_, $log, $rootScope, ngDialog, globalFunction) {
        return {
            /**
             * @ngdoc property
             * @propertyOf wysiwyg.factory:wysService
             * @description
             * Init wysiwyg element configuration
             */
            title: ["font-size", "font-family", "color", "removeFormat", "text-align-left", "text-align-center", "text-align-right"],
            button: ["align-left", "align-center", "align-right", "button"],
            img: ["align-left", "align-center", "align-right", "img"],
            text: ["font-size", "link", "font-family", "unlink", "color", "bold", "italic", "underline", "text-align-left", "text-align-center", "text-align-right", "removeFormat"],
            header: ["text-align-left", "text-align-center", "text-align-right", "font-size", "font-family", "header"],
            footer: ["text-align-left", "text-align-center", "text-align-right", "font-size", "font-family", "footer"],
            savedSelection: null,
            allState: ["bold", "italic", "underline"],
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name action
             * @param {String} name Passing element name
             * @param {Object} el Passing element
             * @param {Node} targetEvent Node element
             * @param {Function} callback A callback function
             * @description
             * For each action apply some effects
             */
            action: function(name, el, targetEvent, callback) {
                switch(name){
                    case 'link':
                        this.linkModal(el, false, callback);
                    break;
                    case 'unlink':
                        document.execCommand("unlink", false, false);
                        callback();
                    break;
                    case "text-align-left":
                        this.applyStyle('textAlign', 'left', el, callback);
                    break;
                    case "align-left":
                        this.applyStyle('marginLeft', 'inherit', el, callback);
                        this.applyStyle('marginRight', 'auto', el, callback);
                    break;
                    case "align-center":
                        this.applyStyle('marginLeft', 'auto', el, callback);
                        this.applyStyle('marginRight', 'auto', el, callback);
                    break;
                    case "align-right":
                        this.applyStyle('marginRight', 'inherit', el, callback);
                        this.applyStyle('marginLeft', 'auto', el, callback);
                    break;
                    case "text-align-center":
                        this.applyStyle('textAlign', 'center', el, callback);
                    break;
                    case "text-align-right":
                        this.applyStyle('textAlign', 'right', el, callback);
                    break;
                    case "removeFormat":
                        document.execCommand("removeFormat", false, "");
                        callback();
                    break;
                    default:
                        if(this.savedSelection) {
                            if(name !== "bgColor") {
                                document.execCommand(name);
                                //targetEvent.toggleClass("active");
                                callback();
                            }
                        }else {
                            alert('Merci de sélectionner du texte');
                        }
                    break;
                }
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name checkState
             * @param {String} id DOM element id
             * @description
             * Check state element and add class
             */
            checkState: function(id) {
                var state = [
                    {
                        "search": "bold",
                        "icon": "bold"
                    },
                    {
                        "search": "underline",
                        "icon": "underline"
                    },
                    {
                        "search": "italic",
                        "icon": "italic"
                    },
                    {
                        "search": "justifyLeft",
                        "icon": "text-align-left"
                    },
                    {
                        "search": "justifyCenter",
                        "icon": "text-align-center"
                    },
                    {
                        "search": "justifyRight",
                        "icon": "text-align-right"
                    }
                ];
                //var state = ["bold", "underline", "italic", "justifyLeft", "justifyCenter", "justifyRight"];
                var node = this.getSelectedNode();
                for(var s = 0; s < state.length; s++) {
                    if(document.queryCommandState(state[s].search)) {
                        if(!_.isNull(document.querySelector("#wys-" + id + " .icon-" + state[s].icon))) {
                            document.querySelector("#wys-" + id + " .icon-" + state[s].icon).classList.add("active");
                        }
                        //
                    }
                }
                if(node.tagName === "A") {
                    document.querySelector("#wys-" + id + " .icon-link").classList.add("active");
                }
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name configParser
             * @param {Object} config Wysiwyg configuration
             * @param {Node} el Passing DOM element
             * @description
             * Parsing wysiwyg configuration and return a array with default button and special
             */
            configParser: function(config, el) {
                var arr = [];
                var that = this;
                _.forOwn(config, function(v, k) {
                    /*
                     * Create object
                     */
                    var item = {
                        "name": config[k],
                        "icon": "icon-" + config[k],
                        "element": el,
                        "type": "default"
                    };

                    /*
                     * apply type and initValue
                     */
                    if(config[k] === "bgColor") {
                        //item.type = "form";
                        /*
                         * Get background color element
                         */
                        var buttonBgColor = that.getRgbColor(getComputedStyle(el).backgroundColor);
                        if(!_.isNull(buttonBgColor)) {
                            item.initVal = globalFunction.rgbToHex(buttonBgColor.r, buttonBgColor.g, buttonBgColor.b);
                        }
                    }
                    else if (config[k] === "img"){
                        item.type = "img";
                    }
                    else if (config[k] === "imgFooter"){
                        item.type = "imgFooter";
                    }
                    else if (config[k] === "header"){
                        item.type = "header";
                    }
                    else if (config[k] === "footer"){
                        item.type = "footer";
                    }
                    else if (config[k] === "button"){
                        item.type = "button";
                    }
                    else if (config[k] === "link"){
                        item.type = "link";
                    }
                    arr.push(item);
                });
                var arrSplited = _.groupBy(arr, function(item) {
                    if(item.type === "default") {
                        return "default";
                    }else {
                        return "special";
                    }
                });
                return arrSplited;
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name getRgbColor
             * @param {String} rgb Rgb background color
             * @description
             * Convert a rgb color in an object with red, green and blue color
             */
            getRgbColor: function(rgb) {
                var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
                var match = matchColors.exec(rgb);
                if (match !== null) {
                    return {
                        r: match[1],
                        g: match[2],
                        b: match[3]
                    };
                }else {
                    return null;
                }
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name hexToRgb
             * @param {String} hex Hexadecimal color
             * @description
             * Convert a hexadecimal color and return a object with red, green and blue color
             */
            hexToRgb: function(hex) {
                // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name getSelectedNode
             * @description
             * Get node
             */
            getSelectedNode: function() {
                if (document.selection) {
                    return document.selection.createRange().parentElement();
                }
                else
                {
                	var selection = window.getSelection();
                	if (selection.rangeCount > 0) {
                        return selection.getRangeAt(0).startContainer.parentNode;
                    }
                }
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name hideAllToolbars
             * @description
             * Hide all wysiwyg Toolbar
             */
            hideAllToolbars: function() {
                var wysiwygToolbar = document.querySelectorAll(".wysiwygContainer");
                angular.forEach(wysiwygToolbar, function(el) {
                    el.classList.remove("active");
                });
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name hideAllToolbars
             * @param {String} element Passing element to insert
             * @description
             * Insert a html element
             */
            insertElement: function(element) {
                var docFragment = document.createDocumentFragment();

                //add a new line
                var newEle = document.createTextNode('\n');
                docFragment.appendChild(newEle);

                //add the br, or p, or something else
                newEle = document.createElement(element);
                docFragment.appendChild(newEle);

                //make the br replace selection
                var range = window.getSelection().getRangeAt(0);
                range.deleteContents();
                range.insertNode(docFragment);

                //create a new range
                range = document.createRange();
                range.setStartAfter(newEle);
                range.collapse(true);

                //make the cursor there
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                return false;
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name saveSelection
             * @param {Node} containerEl Passing container element
             * @description
             * Save selection
             * http://stackoverflow.com/questions/17678843/cant-restore-selection-after-html-modify-even-if-its-the-same-html
             * http://jsfiddle.net/timdown/gEhjZ/4/
             */
            saveSelection: function(containerEl) {
                if(window.getSelection && document.createRange) {
                    var doc = containerEl.ownerDocument, win = doc.defaultView;
                    var range = win.getSelection().getRangeAt(0);
                    var preSelectionRange = range.cloneRange();
                    preSelectionRange.selectNodeContents(containerEl);
                    preSelectionRange.setEnd(range.startContainer, range.startOffset);
                    var start = preSelectionRange.toString().length;

                    return {
                        start: start,
                        end: start + range.toString().length
                    };
                }else if(document.selection) {
                    var doc2 = containerEl.ownerDocument, win2 = doc2.defaultView || doc2.parentWindow;
                    var selectedTextRange = doc2.selection.createRange();
                    var preSelectionTextRange = doc2.body.createTextRange();
                    preSelectionTextRange.moveToElementText(containerEl);
                    preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
                    var start2 = preSelectionTextRange.text.length;

                    return {
                        start: start2,
                        end: start2 + selectedTextRange.text.length
                    };
                }

            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name restoreSelection
             * @param {Node} containerEl Passing container element
             * @param {Object} savedSel Saved element
             * @description
             * Restore the save selection
             */
            restoreSelection: function(containerEl, savedSel) {
                $log.debug("containerEl");
                $log.debug(containerEl);
                if(window.getSelection && document.createRange) {
                    var doc = containerEl.ownerDocument, win = doc.defaultView;
                    var charIndex = 0, range = doc.createRange();
                    range.setStart(containerEl, 0);
                    range.collapse(true);
                    var nodeStack = [containerEl], node, foundStart = false, stop = false;
                    while (!stop && (node = nodeStack.pop())) {
                        if (node.nodeType === 3) {
                            var nextCharIndex = charIndex + node.length;
                            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                                range.setStart(node, savedSel.start - charIndex);
                                foundStart = true;
                            }
                            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                                range.setEnd(node, savedSel.end - charIndex);
                                stop = true;
                            }
                            charIndex = nextCharIndex;
                        } else {
                            var i = node.childNodes.length;
                            while (i--) {
                                nodeStack.push(node.childNodes[i]);
                            }
                        }
                    }

                    var sel = win.getSelection();
                    sel.removeAllRanges();
                    $log.debug("test");
                    $log.debug("range");
                    $log.debug(range);
                    sel.addRange(range);
                }else if (document.selection) {
                    var doc2 = containerEl.ownerDocument, win2 = doc2.defaultView || doc2.parentWindow;
                    var textRange = doc2.body.createTextRange();
                    textRange.moveToElementText(containerEl);
                    textRange.collapse(true);
                    textRange.moveEnd("character", savedSel.end);
                    textRange.moveStart("character", savedSel.start);
                    textRange.select();
                }
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name applyStyle
             * @param {String} style Style to apply
             * @param {String} value Value to passed
             * @param {Node} el DOM element
             * @param {Function} callback Callback function
             * @description
             * Apply style on element and update object
             */
            applyStyle: function(style, value, el, callback) {
                el.style[style] = value;
                callback(el.innerHTML);
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name linkModal
             * @param {Node} el DOM element
             * @param {Boolean} isButton if it's a button
             * @param {Function} callback Callback function
             * @description
             * Show a modal to edit link
             */
            linkModal: function(el, isButton, callback) {
                return ngDialog.openConfirm({
                    plain: true,
                    className: 'ngdialog-top-bar',
                    template: '<cm-link-modal callback-fct="callbackFct()" on-success="closeThisDialog()" el="el" is-button="isButton"></cm-link-modal>',
                    controller: function($scope) {
                        $scope.el = el;
                        $scope.isButton = isButton;
                        $scope.callbackFct = function() {
                            if(isButton) {
                                callback(angular.element($scope.el).find('a')[0].outerHTML);
                            }else {
                                callback($scope.el.innerHTML);
                            }
                        };
                    }
                });
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name colorModal
             * @param {Node} el DOM element
             * @param {Function} callback Callback function
             * @param {String} color Passing color
             * @description
             * Show a modal to edit color
             */
            colorModal: function(el, callback, color) {
                return ngDialog.openConfirm({
                    plain: true,
                    className: 'ngdialog-top-bar',
                    template: '<cm-color-modal callback-fct="callbackFct()" on-success="closeThisDialog()" color="color" el="el"></cm-color-modal>',
                    controller: function($scope) {
                        $scope.el = el;
                        $scope.color = color;
                        $scope.callbackFct = function() {
                            callback($scope.el.innerHTML);
                        };
                    }
                });
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name fontSizeModal
             * @param {Object} el DOM element
             * @param {String} initVal init value
             * @param {Function} callback callback Function
             * @description
             * Show a modal to edit font size
             */
            fontSizeModal: function(el, initVal, callback) {
                return ngDialog.openConfirm({
                    plain: true,
                    className: 'ngdialog-top-bar',
                    template: '<cm-font-size-modal callback-fct="callbackFct()" on-success="closeThisDialog()" el="el"></cm-font-size-modal>',
                    controller: function($scope) {
                        $scope.el = el;
                        $scope.callbackFct = function() {
                            $log.debug("callback font size");
                            callback($scope.el.innerHTML);
                        };
                    }
                });
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name bgColorModal
             * @param {Object} el DOM element
             * @param {Function} callback callback Function
             * @description
             * Show a modal to edit background color
             */
            bgColorModal: function(el, callback) {
                return ngDialog.openConfirm({
                    plain: true,
                    className: 'ngdialog-top-bar',
                    template: '<cm-wysiwyg-bg-color el="el" callback="callbackFct()"></cm-wysiwyg-bg-color>',
                    controller: function($scope) {
                        $scope.el = el;
                        //$scope.bgColor =
                        $scope.callbackFct = function() {
                            callback($scope.el.innerHTML);
                        };
                    }
                });
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name selectModal
             * @param {Object} el DOM element
             * @param {Function} callback callback Function
             * @description
             * Show a modal to edit font size
             */
            selectModal: function(el, callback) {
                return ngDialog.openConfirm({
                    plain: true,
                    className: 'ngdialog-top-bar',
                    template: '<cm-wysiwyg-select callback="callbackFct()" el="el"></cm-wysiwyg-select>',
                    controller: function($scope) {
                        $scope.el = el;
                        $scope.callbackFct = function() {
                            callback($scope.el.innerHTML);
                        };
                    }
                });
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name destroy
             * @description
             * Remove all wysiwyg container
             */
            destroy: function() {
                var wysEls = document.querySelectorAll('.wysiwygContainer');
                angular.forEach(wysEls, function(el) {
                    el.parentNode.removeChild(el);
                });
            },
            /**
             * @ngdoc function
             * @methodOf wysiwyg.factory:wysService
             * @name destroy
             * @param  {Object} node    DOM node
             * @param  {String} tagname HTML tagName
             * @return {Object}         Parent node
             * @description
             * Get parent by tag name
             * https://gist.github.com/ludder/4045263
             */
            getParentByTagName: function(node, tagname) {
                var parent;
                if (node === null || tagname === '') return;
                parent  = node.parentNode;
                tagname = tagname.toUpperCase();

                while (parent.tagName !== "HTML") {
                    if (parent.tagName === tagname) {
                        return parent;
                    }
                    parent = parent.parentNode;
                }
                return parent;
            }
        };
    };

    module.exports = factory;
}());

/**
 * @ngdoc service
 * @name editeur.factory:editeurService
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$http
 * @requires _factory.factory:globalFunction
 * @requires appSettings
 * @requires likeastore.github.io/ngDialog
 * @description
 * Utils function for Toothpaste editor
 */
(function () {
  'use strict';

  var factory = function($log, $rootScope, $http, _, globalFunction, uploadStore, appSettings,
                         apiTplStore, moment, apiMessage, wysService, ngDialog) {
    return {
        /**
         * @ngdoc property
         * @propertyOf editeur.factory:editeurService
         * @name getContainerBlocks
         * @description
         * Basic containers, 1, 2 and 3 columns
         */
        getContainerBlocks: [
            {
                "is_container":true,
                "id": globalFunction.generateUUID(),
                "tplContainer":"listNoDrop",
                "classContainer":"crunchWFull",
                "type":"container",
                "divClass":"crunchBlock",
                "widthTable":"540",
                "divPadding":"20",
                "icon":"https://cdn.crunchmail.net/assets/editor/t/blocks/icon-1col.svg",
                "columns":[[]]
            },
            {
                "is_container":true,
                "id": globalFunction.generateUUID(),
                "tplContainer":"listNoDrop",
                "classContainer":"crunchWFull",
                "divClass":"crunch2Col crunchCol crunchBlock",
                "widthTable":"540",
                "divPadding":"20",
                "icon":"https://cdn.crunchmail.net/assets/editor/t/blocks/icon-2col.svg",
                "type":"container",
                "columns":[[],[]]
            },
            {
                "is_container":true,
                "id": globalFunction.generateUUID(),
                "tplContainer":"listNoDrop",
                "classContainer":"crunchWFull",
                "divClass":"crunch3Col crunchCol crunchBlock",
                "widthTable":"540",
                "divPadding":"20",
                "icon":"https://cdn.crunchmail.net/assets/editor/t/blocks/icon-3col.svg",
                "type":"container",
                "columns":[[],[],[]]
            }
        ],
        /**
         * @ngdoc property
         * @propertyOf editeur.factory:editeurService
         * @name nameColor
         * @description
         * Array with multiple css color name
         */
        nameColor: ["lightgreen", "gold", "springgreen", "dodgerblue", "darkorange", "orchid", "tomato", "oldlace", "thistle", "salmon", "aquamarine", "burlywood", "moccassin", "lightcoral", "gainsboro", "orange", "sandybrown", "springgreen", "lightpink", "whitesmoke", "lightyellow", "lightblue", "lavender", "navajowhite", "silver", "red", "lime", "lightcyan"],
        /**
         * @ngdoc property
         * @propertyOf editeur.factory:editeurService
         * @name header
         * @description
         * Header block object
         */
        header: {
            "type":"placeholder",
            "subtype": "header",
            "headerText": "Le message s'affiche mal ?",
            "headerLinkText": "Visualisez-le dans votre navigateur.",
            "reverseHeader": false,
            "showHeader": true,
            "preHeaderText": ""
        },
        /**
         * @ngdoc property
         * @propertyOf editeur.factory:editeurService
         * @name footer
         * @description
         * Footer block object
         */
        footer: {
            "type":"placeholder",
            "subtype": "footer",
            "reverseFooter": false,
            "footerLinkText": "Se désinscrire",
            "footerLinkCustom": false,
            "footerLinkCustomHtml": [],
            "footerText": " pour ne plus recevoir ces emails",
            "footerLogo": false,
            "footerLogoHtml": {
                "html": "<img src=\"http://placehold.it/200x100\" alt=\"\" />"
            },
            "footerExplanation": ""
        },
        /**
         * @ngdoc property
         * @propertyOf editeur.factory:editeurService
         * @name getElementsBlocks
         * @description
         * Elements: h1, h2, h3, p, ul, newsletter button and img
         */
        getElementsBlocks: [
            {
                "type": "item",
                "id": globalFunction.generateUUID(),
                "html": "<h1 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h1>",
                "tdClass": "",
                "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-title1.svg",
                "editor_conf": "title"
            },
            {
                "type": "item",
                "id": globalFunction.generateUUID(),
                "html": "<h2 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h2>",
                "tdClass": "",
                "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-title2.svg",
                "editor_conf": "title"
            },
            {
                "type": "item",
                "id": globalFunction.generateUUID(),
                "html": "<h3 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h3>",
                "tdClass": "",
                "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-title3.svg",
                "editor_conf": "title"
            },
            {
                "id": globalFunction.generateUUID(),
                "type": "item",
                "html": "<p class=\"crunchText crunchElement\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum accusamus laborum laboriosam consequuntur, enim nihil, rerum necessitatibus voluptates facilis ipsam iste incidunt eius quae atque hic perferendis itaque ad soluta.</p>",
                "tdClass": "",
                "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-text.svg",
                "editor_conf": "text"
            },
            {
                "type": "item",
                "id": globalFunction.generateUUID(),
                "html": "<ul class=\"crunchList crunchElement\"><li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li><li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li><li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li><li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li></ul>",
                "tdClass": "",
                "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-list.svg",
                "editor_conf": "text"
            },
            {
                "type": "item",
                "id": globalFunction.generateUUID(),
                "html": "<table class=\"crunchButton crunchElement\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td><a class=\"crunchLink\" href=\"\">Button</a></td></tr></tbody></table>",
                "tdClass": "",
                "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-button.svg",
                "editor_conf": "button"
            },
            {
                "type": "item",
                "id": globalFunction.generateUUID(),
                "html": "<img src=\"http://placehold.it/600x250\" />",
                "tdClass": "",
                "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-image.svg",
                "editor_conf": "img"
            }
        ],
        /**
         * @ngdoc property
         * @propertyOf editeur.factory:editeurService
         * @name fontFamily
         * @description
         * Newsletter font family safe
         */
        fontFamily: [
            {
                "name"  : "Arial",
                "value" : "Arial"
            },
            {
                "name"  : "Georgia",
                "value" : "Georgia"
            },
            {
                "name"  : "Arial Black",
                "value" : "Arial Black"
            },
            {
                "name"  : "Tahoma",
                "value" : "Tahoma"
            },
            {
                "name"  : "Trebuchet MS",
                "value" : "Trebuchet MS"
            },
            {
                "name"  : "Verdana",
                "value" : "Verdana"
            },
            {
                "name"  : "Times New Roman",
                "value" : "Times New Roman"
            }
        ],
        messageUrl: null,
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name cloneModelDoc
         * @description
         * Clone the document model
         * @param {Object} ctrl Passing appEditeur controller
         * @param {Object} tplJson Template object with all container/element
         */
        cloneModelDoc: function(ctrl, tplJson) {
            var clone = _.clone(ctrl.documentModel);
            delete clone.isDirty;
            delete clone.type;
            delete clone.empty;
            delete clone.color_set_is_dirty;

            clone.is_public = false;
            clone.color_set = null;
            clone.content = tplJson;

            clone.style_set_content = ctrl.lessTplStyle;
            return clone;
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name createDoc
         * @description
         * Create a new API document
         * @param {Object} ctrl Passing appEditeur controller
         * @param {Object} tplJson Template object with all container/element
         */
        createDoc: function(ctrl, tplJson) {
            var cloneTpl = this.cloneModelDoc(ctrl, tplJson);
            /*
             * Set template name
             */
            if(appSettings.nameTemp !== "") {
                cloneTpl.name = appSettings.nameTemp;
            }else {
                cloneTpl.name = "Template-" + moment().format('DD_MM_YYYY_HH_mm_ss');
            }
            /*
             * Set a empty thumbnail
             */

            cloneTpl.thumbnail = "";
            cloneTpl.is_template = false;

            /*
             * Call API to create template
             */

            return apiTplStore.createTpl(cloneTpl);
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name updateDoc
         * @description
         * Update a API document
         * @param {Object} ctrl Passing appEditeur controller
         * @param {Object} tplJson Template object with all container/element
         * @param {String} docUrl API document url
         */
        updateDoc: function(ctrl, tplJson, docUrl) {
            var cloneTpl = this.cloneModelDoc(ctrl, tplJson);

            cloneTpl.thumbnail = "";
            cloneTpl.is_template = false;

            return apiTplStore.updateTpl(docUrl, cloneTpl);
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name createPrivTpl
         * @description
         * Create private document
         * @param {Object} ctrl Passing appEditeur controller
         * @param {Object} tplJson Template object with all container/element
         */
        createPrivTpl: function(ctrl, tplJson) {
            var main = this;
            return ngDialog.openConfirm({
                plain: true,
                template: '<cm-dialog-name-priv-tpl></cm-dialog-name-priv-tpl>'
            }).then(function(name) {
                var cloneTpl = main.cloneModelDoc(ctrl, tplJson);

                delete cloneTpl.message;
                delete cloneTpl.url;

                cloneTpl.name = name;
                ctrl.privateTplName = name;
                cloneTpl.is_template = true;

                return apiTplStore.createTpl(cloneTpl);
            }, function() {
                return false;
            });
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name updatePrivTpl
         * @description
         * Update private document
         * @param {Object} ctrl Passing appEditeur controller
         * @param {Object} tplJson Template object with all container/element
         */
        updatePrivTpl: function(ctrl, tplJson) {
            var cloneTpl = this.cloneModelDoc(ctrl, tplJson);

            delete cloneTpl.message;
            delete cloneTpl.url;

            cloneTpl.name = ctrl.privateTplName;
            cloneTpl.is_template = true;

            return apiTplStore.updateTpl(ctrl.privateUrl, cloneTpl);
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name screenshot
         * @description
         * Create a screenshot
         * @param {Node} tpl Html element to make a screnshot
         * @param {String} docUrl document API url
         * @param {String} thumbnailUrl thumbnail API url
         * @param {Function} callback Callback function execute after the promise success
         */
        screenshot: function(tpl, docUrl, thumbnailUrl, callback) {
            $log.debug(tpl);
            var heightTpl = tpl.offsetHeight;
            var main = this;
            return html2canvas(tpl, {
                useCORS: true,
                height: heightTpl,
                background: "#FFF"
            }).then(function(canvas) {
                var extra_canvas = document.createElement("canvas");
                extra_canvas.setAttribute('width', 600 + 110);
                extra_canvas.setAttribute('height', heightTpl);
                var ctx = extra_canvas.getContext('2d');
                ctx.drawImage(canvas,
                    55 - ((canvas.width - 600) / 2), 0,
                    canvas.width, heightTpl);
                var imgToPost = extra_canvas.toDataURL("image/png");
                var blobImg = uploadStore.dataURItoBlob(imgToPost);

                if(!_.isNull(thumbnailUrl) && !_.isUndefined(thumbnailUrl)) {
                    main.deleteThumbnail(thumbnailUrl).then(function() {
                        uploadStore.postThumbnail(blobImg, docUrl).then(callback);
                    });
                }else {
                    uploadStore.postThumbnail(blobImg, docUrl).then(callback);
                }

            });
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name deleteThumbnail
         * @description
         * Delete a thumbnail
         * @param {String} url thumbnail API url
         */
        deleteThumbnail: function(url) {
            return $http.delete(url);
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name updateMessage
         * @description
         * Update message html
         * @param {Object} ctrl Passing document model
         * @param {Object} tplJson template object with all elements/containers
         */
        updateMessage: function(ctrl, tplJson) {
            var htmlMessage = this.createHtmlMessage(tplJson);
            var html = {
                "html": htmlMessage,
                "properties": {}
            };
            return apiMessage.updateMessage(ctrl.documentModel.message, html);
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name matchPropertiesAndColor
         * @description
         * Create a object with colors and properties
         * @param {Object} colors Colors object
         * @param {Object} properties Properties object
         */
        matchPropertiesAndColor: function(colors, properties) {
            var colorDesc = {};
            _.forOwn(colors, function(v, k) {
                colorDesc[k] = {
                    "color": colors[k]
                };
                if(properties[k] !== undefined) {
                    colorDesc[k].description = properties[k];
                }else {
                    colorDesc[k].description = null;
                }
            });
            return colorDesc;

        },
        /**
         * @ngdoc property
         * @propertyOf editeur.factory:editeurService
         * @name fontFamily
         * @description
         * Newsletter font family safe
         */
        defaultStyleSet: {
            "content": "body {}",
            "properties": {
                "secondary_color0": "Couleur de fond",
                "default": "True",
                "secondary_color2": "Couleur des titres",
                "name": "Defaut",
                "secondary_color1": "Couleur de fond des blocs",
                "primary_color": "Couleur des boutons + fond de blocs spéciaux + liens",
                "secondary_color3": "Couleur non utilisée",
                "secondary_color4": "Couleur du texte"
            }
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name getToothpickCss
         * @description
         * Get Toothpick file and return it
         * @param {String} name toothpick Name to get
         */
        getToothpickCss: function(name) {
            var that = this;
            return $http.get("css/lib/toothpick."+ name +".css").then(function(result) {
                /*
                * Remove Comments
                */
                var cleanData = that.cleanComments(result.data);
                return cleanData;
            });
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name cleanComments
         * @description
         * Clean comments in data
         * @param {String} data String data to clean comment
         */
        cleanComments: function(data) {
            var regexp = /\/\*(?:(?!\*\/)[\s\S])*\*\//g;
            data = data.replace(regexp, '');
            return data;
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name cleanCmWysiwyg
         * @description
         * Clean cm-wysiwg tag
         * @param {String} data clean cm-wysiwg
         */
        cleanCmWysiwyg: function(data) {
            var firstPart = /<\s*cm-wysiwyg.*?>/g;
            var lastPart = /<\s*\/\s*cm-wysiwyg\s*.*?>/g;
            data = data.replace(firstPart, '');
            data = data.replace(lastPart, '');

            return data;
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name cleanHtml
         * @description
         * Clean html ng-attributes, and html comment
         * @param {String} data Html
         */
        cleanHtml: function(data) {
            var regexp = /<!--(.*?)-->/g;
            data = data.replace(regexp, '');
            var regexpNg = /(ng-\w+-\w+="(.|\n)*?"|ng-\w+="(.|\n)*?"|ng-(\w+-\w+)|ng-(\w+))/g;
            data = data.replace(regexpNg, '');

            return data;
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name getToothpickLess
         * @description
         * Get Toothpick file less and return it
         * @param {String} name toothpick Name to get
         */
        getToothpickLess: function(name) {
            var that = this;
            return $http.get("css/lib/toothpick."+ name +".less").then(function(result) {
                /*
                * Remove Comments
                */
                var cleanData = that.cleanComments(result.data);
                return cleanData;
            });
        },
        /**
         * @ngdoc function
         * @methodOf editeur.factory:editeurService
         * @name generateFinalBlock
         * @description
         * Return the block html
         * @param {Object} element Block element
         * @param {Number} nbrCol Columns container number
         */
        generateFinalBlock: function(element, nbrCol) {
          /*
           * Access to DOM element
           */
          var DOMContElement = document.getElementById(element.id);
          var widthContElement = DOMContElement.offsetWidth;

          if(widthContElement > 650) {
              widthContElement = "650px";
          }

          /*
           * Set background color to outlook
           */
          var bgColor = getComputedStyle(DOMContElement).backgroundColor;
          var objColor = wysService.getRgbColor(bgColor);
          var hexBgColor = "";
          if(!_.isNull(objColor)) {
              hexBgColor = globalFunction.rgbToHex(objColor.r, objColor.g, objColor.b);
          }
          var block = "<!--[if (gte mso 9)|(IE)]><table cellpadding=\"0\" bgcolor=\"" + hexBgColor + "\" cellspacing=\"0\" width=\"100%\" align=\"center\"><tr><td><![endif]-->";
            block += "<div id=\"" + element.id + "\" class=\"" + element.divClass + "\"";
            if(_.has(element, "style")) {
                block += " style=\"" + element.style + "\"";
            }
            block += " >";

              block += "<table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"" + element.classContainer + "\" width=\"100%\">"+
                "<tr>"+
                  "<td>"+
                    "<!--[if (gte mso 9)|(IE)]><table cellpadding=\"0\" cellspacing=\"0\" width=\"" + widthContElement + "\" align=\"center\" style=\"table-layout: fixed;\"><tr><![endif]-->";
                        //Loop nbr columns
                        for(var c = 0; c < nbrCol; c++) {
                            var blockHtml = element.columns[c];
                            var DOMElement = document.getElementById(blockHtml.id);
                            var wysEls = document.querySelectorAll("#" + blockHtml.id + " .wys-element");
                            for(var e = 0; e < wysEls.length; e++) {
                                if(wysEls[e].tagName === "IMG") {
                                    var widthImg = wysEls[e].offsetWidth;
                                    var heightImg = wysEls[e].offsetHeight;
                                    wysEls[e].setAttribute("width", widthImg);
                                    wysEls[e].setAttribute("height", heightImg);
                                    blockHtml[e].html = wysEls[e].outerHTML;
                                }
                                else if(wysEls[e].children.length > 0 && wysEls[e].children[0].tagName === "IMG") {
                                    var widthImgChild = wysEls[e].children[0].offsetWidth;
                                    var heightImgChild = wysEls[e].children[0].offsetHeight;
                                    wysEls[e].children[0].setAttribute("width", widthImgChild);
                                    wysEls[e].children[0].setAttribute("height", heightImgChild);
                                    blockHtml[e].html = wysEls[e].outerHTML;
                                }
                            }
                            var widthElement = DOMElement.offsetWidth;
                            var paddingElement = getComputedStyle(DOMElement).paddingLeft.split("px");
                            block += "<!--[if (gte mso 9)|(IE)]><td valign=\"top\" width=\"" + widthElement + "\" style=\"padding: " + paddingElement[0] +"px;\"><![endif]-->";
                            if(!_.has(element, "cellClasses")) {
                                block += "<div style=\"width:" + (widthElement - paddingElement[0] * 2) + "px\">";
                            }else {
                                if(!_.isNull(element.cellClasses[c])) {
                                    block += "<div class=\"" + element.cellClasses[c] + "\" style=\"width:" + (widthElement - paddingElement[0] * 2) + "px\">";
                                }else {
                                    block += "<div style=\"width:" + (widthElement - paddingElement[0] * 2) + "px\">";
                                }
                            }

                            for(var b = 0; b < blockHtml.length; b++) {
                                var regExpData = /data(-\w+)+(="\w+")/g;
                                var regExpContentEditable = /contenteditable="\w*"/g;
                                if(_.has(blockHtml[b], "html")) {
                                    var htmlBlockWithoutDataAttr = blockHtml[b].html.replace(regExpData, "");
                                    var htmlBlockWithoutContentEditable = htmlBlockWithoutDataAttr.replace(regExpContentEditable, "");
                                    block += htmlBlockWithoutContentEditable;
                                }else {
                                    // Keep empty block
                                    block += "";
                                }
                            }
                          block += "</div>"+
                                     "<!--[if (gte mso 9)|(IE)]></td><![endif]-->";
                        }

            block += "<!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->"+
                  "</td>"+
                "</tr>"+
              "</table>"+
            "</div>"+
            "<!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->";
            return block;
      },
      /**
       * @ngdoc function
       * @methodOf editeur.factory:editeurService
       * @name createHtmlMessage
       * @description
       * Create the final html to send
       * @param {Object} jsonLayout template object with element/container
       * @param {Boolean} preview Boolean if it's a preview or not
       */
      createHtmlMessage: function(jsonLayout, preview) {
          var cloneCodeJson = _.clone(jsonLayout);
          var messageHeader = document.querySelector('.messageHeader');
          var messageFooter = document.querySelector('.messageFooter');
          var messageHeaderClean = null;
          if(!_.isNull(messageHeader)) {
              messageHeaderClean = this.cleanHtml(messageHeader.outerHTML);
          }
          var messageFooterClean = this.cleanHtml(messageFooter.outerHTML);
          var messageFooterCleanCM = this.cleanCmWysiwyg(messageFooterClean);
          /*
           * Remove header and footer
           */
          cloneCodeJson.shift();
          cloneCodeJson.pop();
          var htmlMessage = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">"+
          "<html>"+
            "<head>"+
                "<meta charset=\"utf-8\">"+
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"+
                "<meta http-equiv=\"x-UA-Compatible\" content=\"IE=edge\">"+
                "<style>" + $rootScope.toothpickGlobal + "</style>"+
                "<style>" + $rootScope.styleTpl + "</style>"+
                "<style data-premailer=\"ignore\">" + $rootScope.toothpickRwd + "</style>"+
                "</head>"+
                "<body>";
                /*
                 * Message
                 */
                htmlMessage += "<table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"crunchGlobalWrapper\" width=\"100%\">"+
                    "<tr>"+
                        "<td>"+
                            "<table class=\"crunchWrapper crunchWFull\" align=\"center\" width=\"100%\">";
                            if(!_.isNull(messageHeaderClean)) {
                                htmlMessage +=
                                    "<tr>"+
                                        "<td><!--[if (gte mso 9)|(IE)]><table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"table-layout: fixed;\"><tr><td style=\"padding:15px;\"><![endif]-->";
                                    htmlMessage += messageHeaderClean + "<!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr>";
                            }
                            htmlMessage += "<tr>"+
                                    "<td>";
                                        for(var j=0; j < cloneCodeJson.length; j++) {
                                            var columnsLenght = cloneCodeJson[j].columns.length;
                                            htmlMessage += this.generateFinalBlock(cloneCodeJson[j], columnsLenght);
                                        }
                     htmlMessage += "</td>"+
                                "</tr>"+
                            "</table>"+
                        "</td>"+
                    "</tr>"+
                    "<tr>";
                    var paddingFooter = getComputedStyle(messageFooter).paddingLeft;
                htmlMessage +=
                    "<td><!--[if (gte mso 9)|(IE)]><table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"table-layout: fixed;\"><tr><td style=\"padding:15px;\"><![endif]-->" + messageFooterCleanCM + "<!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td>"+
                    "</tr>"+
                "</table>";
          if(preview) {
                htmlMessage += "<script>var links = document.querySelectorAll('a');Array.prototype.forEach.call(links, function(el, i){el.addEventListener(\"click\", function(e) {e.preventDefault();})});</script>";
          }
          htmlMessage += "</body>"+"</html>";
          //$log.debug(htmlMessage);
        return htmlMessage;
      }
    };
  };

  module.exports = factory;
}());

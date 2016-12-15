exports.httpBackendMock = function() {
    angular.module('httpBackendMock', ['ngMockE2E'])
    .run(function($httpBackend, appSettings) {
        console.log("httpBackendMock");
        $httpBackend.whenPOST(
            "http://munch.local/api-token-refresh",
            {
                'token': "xxx"
            }
        ).respond(200, [
            {
                'token': "xxx"
            }
        ]);

        $httpBackend.whenGET(/(?:.\/|)lang\/.*/).passThrough();
        $httpBackend.whenGET(/(?:.\/|)views\/.*/).passThrough();
        $httpBackend.whenGET(/css\/.*/).passThrough();

        $httpBackend.whenGET(
            "http://munch.local/v1/users/1/"
        ).respond(200, [
            {
                "url": "http://munch.local/v1/users/1/",
                "identifier": "admin@example.com",
                "type": "human",
                "groups": [
                    "users"
                ],
                "api_key": "xxx",
                "_links": {
                    "regen_api_key": {
                        "href": "http://munch.local/v1/users/1/regen_api_key/"
                    }
                }
            }
        ]);

        $httpBackend.whenGET(
            "http://munch.local/v1/profile/"
        ).respond(200,
            {
                "_links": {
                   "user": {
                       "href": "http://munch.local/v1/users/1/"
                   }
               }
            }
        );

        $httpBackend.whenGET(
            "http://munch.local/v1/template-store/blocks/"
        ).respond(200,
            {
                "count": 1,
                "next": null,
                "previous": null,
                "page_count": 1,
                "results": [
                    {
                        "url": "http://munch.local/v1/template-store/blocks/2/",
                        "html": "<div>test</div>",
                        "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-1colBlock.svg",
                        "editor_config": {
                            "content": {}
                        },
                        "css_classes": [
                            ".crunchBlock"
                        ],
                        "tags": [
                            "container"
                        ],
                        "is_container": true,
                        "parent_block": "http://munch.local/v1/template-store/blocks/1/"
                    }]
            }
        );

        $httpBackend.whenGET(
            "http://munch.local/v1/template-store/documents/?is_template=True"
        ).respond(200,
            {
                "count": 2,
                "next": null,
                "previous": null,
                "page_count": 1,
                "results": [
                    {
                        "url": "http://munch.local/v1/template-store/documents/1/",
                        "name": "Test Template 1",
                        "creation_date": "2016-03-09T11:15:35.200084Z",
                        "edit_date": "2016-03-09T11:15:35.200114Z",
                        "pub_date": null,
                        "is_template": true,
                        "is_public": true,
                        "properties": {},
                        "color_set": "http://munch.local/v1/template-store/colorsets/1/",
                        "color_set_content": {},
                        "color_set_is_dirty": false,
                        "style_set": "http://munch.local/v1/template-store/stylesets/1/",
                        "style_set_content": "",
                        "style_set_is_dirty": true,
                        "html": "",
                        "content": [{
                            "is_container": true,
                            "id": "id_13eb2f1b-f9c9-d560-ce90-1cb93baabbc8",
                            "tplContainer": "listNoDrop",
                            "classContainer": "crunchWFull",
                            "type": "container",
                            "divClass": "crunchBlock",
                            "widthTable": 550,
                            "divPadding": "10",
                            "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-1col.svg",
                            "columns": [
                                [{
                                    "id": "id_2dca9b11-5938-89a6-2721-618d42b7f7c8",
                                    "type": "item",
                                    "html": "<h1 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h1>",
                                    "editor_conf": "title"
                                }, {
                                    "id": "id_d4d24f2d-28b6-3a74-d1b0-270fd6181204",
                                    "type": "item",
                                    "html": "<p class=\"crunchText crunchElement\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum accusamus laborum laboriosam consequuntur, enim nihil, rerum necessitatibus voluptates facilis ipsam iste incidunt eius quae atque hic perferendis itaque ad soluta.</p>",
                                    "editor_conf": "text"
                                }, {
                                    "id": "id_163421f7-2d30-2cac-1ef0-63e54f5c19ce",
                                    "type": "item",
                                    "html": "<img src=\"http://placehold.it/600x250\" />",
                                    "editor_conf": "img"
                                }, {
                                    "id": "id_3e557325-dc86-621b-0d96-1c389b9cd7bb",
                                    "type": "item",
                                    "html": "<table class=\"crunchButton crunchElement\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td><a class=\"crunchLink\" href=\"\">Button</a></td></tr></tbody></table>",
                                    "editor_conf": "button"
                                }]
                            ]
                        }],
                        "thumbnail": ""
                    },
                    {
                        "url": "http://munch.local/v1/template-store/documents/2/",
                        "name": "Test Template 2",
                        "creation_date": "2016-03-09T11:15:35.200084Z",
                        "edit_date": "2016-03-09T11:15:35.200114Z",
                        "pub_date": null,
                        "is_template": true,
                        "is_public": true,
                        "properties": {},
                        "color_set": "http://munch.local/v1/template-store/colorsets/2/",
                        "color_set_content": {},
                        "color_set_is_dirty": false,
                        "style_set": "http://munch.local/v1/template-store/stylesets/2/",
                        "style_set_content": "",
                        "style_set_is_dirty": true,
                        "html": "",
                        "content": [{
                            "is_container": true,
                            "id": "id_13eb2f1b-f9c9-d560-ce90-1cb93baabbc8",
                            "tplContainer": "listNoDrop",
                            "classContainer": "crunchWFull",
                            "type": "container",
                            "divClass": "crunchBlock",
                            "widthTable": 550,
                            "divPadding": "10",
                            "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-1col.svg",
                            "columns": [
                                [{
                                    "id": "id_2dca9b11-5938-89a6-2721-618d42b7f7c8",
                                    "type": "item",
                                    "html": "<h1 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h1>",
                                    "editor_conf": "title"
                                }, {
                                    "id": "id_d4d24f2d-28b6-3a74-d1b0-270fd6181204",
                                    "type": "item",
                                    "html": "<p class=\"crunchText crunchElement\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum accusamus laborum laboriosam consequuntur, enim nihil, rerum necessitatibus voluptates facilis ipsam iste incidunt eius quae atque hic perferendis itaque ad soluta.</p>",
                                    "editor_conf": "text"
                                }, {
                                    "id": "id_163421f7-2d30-2cac-1ef0-63e54f5c19ce",
                                    "type": "item",
                                    "html": "<img src=\"http://placehold.it/600x250\" />",
                                    "editor_conf": "img"
                                }, {
                                    "id": "id_3e557325-dc86-621b-0d96-1c389b9cd7bb",
                                    "type": "item",
                                    "html": "<table class=\"crunchButton crunchElement\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td><a class=\"crunchLink\" href=\"\">Button</a></td></tr></tbody></table>",
                                    "editor_conf": "button"
                                }]
                            ]
                        }],
                        "thumbnail": ""
                    }
                ]
            }
        );

        $httpBackend.whenGET(
            "http://munch.local/v1/template-store/documents/1/"
        ).respond(200, {
            "url": "http://munch.local/v1/template-store/documents/1/",
            "name": "Test Template 1",
            "creation_date": "2016-03-09T11:15:35.200084Z",
            "edit_date": "2016-03-09T11:15:35.200114Z",
            "pub_date": null,
            "is_template": true,
            "is_public": true,
            "properties": {},
            "color_set": "http://munch.local/v1/template-store/colorsets/1/",
            "color_set_content": {},
            "color_set_is_dirty": false,
            "style_set": "http://munch.local/v1/template-store/stylesets/1/",
            "style_set_content": "",
            "style_set_is_dirty": true,
            "html": "",
            "content": [{
                "is_container": true,
                "id": "id_13eb2f1b-f9c9-d560-ce90-1cb93baabbc8",
                "tplContainer": "listNoDrop",
                "classContainer": "crunchWFull",
                "type": "container",
                "divClass": "crunchBlock",
                "widthTable": 550,
                "divPadding": "10",
                "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-1col.svg",
                "columns": [
                    [{
                        "id": "id_2dca9b11-5938-89a6-2721-618d42b7f7c8",
                        "type": "item",
                        "html": "<h1 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h1>",
                        "editor_conf": "title"
                    }, {
                        "id": "id_d4d24f2d-28b6-3a74-d1b0-270fd6181204",
                        "type": "item",
                        "html": "<p class=\"crunchText crunchElement\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum accusamus laborum laboriosam consequuntur, enim nihil, rerum necessitatibus voluptates facilis ipsam iste incidunt eius quae atque hic perferendis itaque ad soluta.</p>",
                        "editor_conf": "text"
                    }, {
                        "id": "id_163421f7-2d30-2cac-1ef0-63e54f5c19ce",
                        "type": "item",
                        "html": "<img src=\"http://placehold.it/600x250\" />",
                        "editor_conf": "img"
                    }, {
                        "id": "id_3e557325-dc86-621b-0d96-1c389b9cd7bb",
                        "type": "item",
                        "html": "<table class=\"crunchButton crunchElement\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td><a class=\"crunchLink\" href=\"\">Button</a></td></tr></tbody></table>",
                        "editor_conf": "button"
                    }]
                ]
            }],
            "thumbnail": ""
        });

        $httpBackend.whenGET(
            "http://munch.local/v1/template-store/colorsets/"
        ).respond(200, {
            "count": 2,
            "next": null,
            "previous": null,
            "page_count": 1,
            "results": [
                {
                    "url": "http://munch.local/v1/template-store/colorsets/1/",
                    "colors": {
                        "secondary_color3": "#303030",
                        "secondary_color2": "#666",
                        "secondary_color0": "#EEE",
                        "secondary_color4": "#666",
                        "secondary_color1": "#FFF",
                        "primary_color": "#333"
                    },
                    "properties": {
                        "name": "Defaut",
                    },
                    "name": null,
                    "is_public": false
                },
                {
                    "url": "http://munch.local/v1/template-store/colorsets/2/",
                    "colors": {
                        "secondary_color3": "#303030",
                        "secondary_color2": "#666",
                        "secondary_color0": "#EEE",
                        "secondary_color4": "#666",
                        "secondary_color1": "#FFF",
                        "primary_color": "#333"
                    },
                    "properties": {
                        "name": "Defaut",
                    },
                    "name": null,
                    "is_public": false
                }
            ]
        });

        $httpBackend.whenGET(
            "http://munch.local/v1/template-store/colorsets/1/"
        ).respond(200, {
            "url": "http://munch.local/v1/template-store/colorsets/1/",
            "colors": {
                "secondary_color3": "#303030",
                "secondary_color2": "#666",
                "secondary_color0": "#EEE",
                "secondary_color4": "#666",
                "secondary_color1": "#FFF",
                "primary_color": "#333"
            },
            "properties": {
                "name": "Defaut",
                "default": "True"
            },
            "name": null,
            "is_public": false
        });

        $httpBackend.whenGET(
            "http://munch.local/v1/template-store/stylesets/1/"
        ).respond(200, {
            "url": "http://munch.local/v1/template-store/stylesets/1/",
            "content": "@marginBlock: 30px;\r\n@_marginBlock_name: \"Spaces beetween blocks\";\r\n@_marginBlock_type: \"range\";\r\n@_marginBlock_min: 0;\r\n@_marginBlock_max: 50;\r\n\r\n.crunchGlobalWrapper { background: @secondary_color0; }\r\n.crunchBlock { Margin-bottom: @marginBlock; }\r\n.crunchTitle{ text-transform: uppercase; }\r\n.crunchBlockNoBg div { padding: 0; }",
            "css_classes": [
                "crunchBlock",
            ],
            "properties": {
                "secondary_color3": "Couleur non utilisée",
                "secondary_color2": "Couleur des titres",
                "secondary_color0": "Couleur de fond",
                "secondary_color1": "Couleur de fond des blocs",
                "name": "Style 1",
                "secondary_color4": "Couleur du texte",
                "primary_color": "Couleur des boutons + fond de blocs spéciaux + liens"
            },
            "_links": {
                "blocks": {
                    "href": "http://munch.local/v1/template-store/stylesets/1/blocks/"
                }
            },
            "name": "Style 1",
            "description": "",
            "is_public": true,
            "thumbnail": "http://cdn.crunchmail.net/assets/editor/t/templates/basic/thumbnail.png"
        });
    });
};

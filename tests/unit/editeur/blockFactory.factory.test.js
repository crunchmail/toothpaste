describe('Testing Block Factory', function() {
    var mockedBlockFactory,
        mockedSingleBlock,
        blockFactory,
        actionStack,
        globalFunction;

    /*
     * Load module Editeur
     */
    beforeEach(function() {
        angular.mock.module('appConfig');
        angular.mock.module('toothpaste.editeur', function($provide) {
             actionStack = [];
             globalFunction = {};

             $provide.value('actionStack', actionStack);
             $provide.value('globalFunction', globalFunction);

             mockedBlockFactory = [
                 {
                     "$$hashKey": "object:1",
                     "type": "item",
                     "html": "<h1 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h1>",
                     "tdClass": "",
                     "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-title1.svg",
                     "editor_conf": "title"
                 },
                 {
                     "$$hashKey": "object:2",
                     "type": "item",
                     "html": "<h1 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h1>",
                     "tdClass": "",
                     "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-title1.svg",
                     "editor_conf": "title"
                 }
             ];

             mockedSingleBlock = {
                 "$$hashKey": "object:1",
                 "type": "item",
                 "html": "<h1 class=\"crunchTitle crunchElement\">Donec ullamcorper nulla metus</h1>",
                 "tdClass": "",
                 "icon": "https://cdn.crunchmail.net/assets/editor/t/blocks/icon-title1.svg",
                 "editor_conf": "title"
             };

         });
         angular.mock.inject(function(_blockFactory_) {
             blockFactory = _blockFactory_;
         });
    });

    afterEach(function() {
        actionStack = [];
    });

    /*
     * Test delete block
     */
    it('Delete block', function() {
        blockFactory.deleteElement(mockedSingleBlock, mockedBlockFactory, false);
        expect(mockedBlockFactory.length).toEqual(1);
    });

    /*
     * Test duplicate block
     */
    it('Duplicate block', function() {
        blockFactory.duplicate(mockedSingleBlock, mockedBlockFactory, 0);
        expect(mockedBlockFactory.length).toEqual(3);
    });


});

var Toolbar = {

    // show toolbar on top of the boundingNode
    show: function(boundingNode, editAction){
        // recreation is required for WordPress editor switch visual/text mode!
        Toolbar.hide();

        // create new toolbar object
        var toolbar = editor.dom.create('div', {
            'id': 'EnlighterToolbar',
            'data-mce-bogus': '1',
            'contenteditable': false
        });

        var button = editor.dom.create('div', {
            'class': 'editicon',
            'data-mce-bogus': '1',
            'contenteditable': false
        });
        toolbar.appendChild(button);

        // display the settings dialog on click
        editor.dom.bind(toolbar, 'mousedown', function (e) {
            e.stopPropagation();
            editAction();
        });

        // add toolbar to editor area
        editor.getBody().appendChild(toolbar);

        // get bounding content rect for absolute positioning
        var rect = editor.dom.getRect(boundingNode);

        // show toolbar and set position
        editor.dom.setStyles(toolbar, {
            top: rect.y,
            left: rect.x,
            width: rect.w
        });
    },

    // remove the codeblock edit toolbar
    hide: function(){
        var tb = editor.dom.get('EnlighterToolbar');
        if (tb) {
            editor.dom.remove(tb);
        }
    }
};
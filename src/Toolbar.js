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

        // ----- Edit Button -----
        // code edit button
        var editButton = editor.dom.create('div', {
            'class': 'editicon',
            'data-mce-bogus': '1',
            'contenteditable': false
        });
        toolbar.appendChild(editButton);

        // display the settings dialog on click
        editor.dom.bind(editButton, 'mousedown', function (e) {
            e.stopPropagation();
            editAction();
        });

        // ----- Delete Button -----

        // code delete button
        var deleteButton = editor.dom.create('div', {
            'class': 'deleteicon',
            'data-mce-bogus': '1',
            'contenteditable': false
        });
        toolbar.appendChild(deleteButton);

        // display the settings dialog on click
        editor.dom.bind(deleteButton, 'mousedown', function (e) {
            e.stopPropagation();
            console.log("DELETE NODE");

            // show confirm dialog
            editor.windowManager.confirm('Do you want to delete the current codeblock?', function(e){
                e && boundingNode.remove();
            });
        });

        // ----- Toolbar alignment -----

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
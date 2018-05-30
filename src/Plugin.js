(function(){
    'use strict';

    // fetch console object
    var _console = window.console || {};
    var _log_error = (_console.error ? _console.error.bind(_console) : null) || function () {};

    // check for global EnlighterJS config availability
    if (typeof EnlighterJS_EditorConfig == 'undefined'){
        // show error message
        _log_error('No EnlighterJS Config found');

        // terminate plugin loading
        return;
    }

    // check for tinymce availability
    if (typeof tinymce == 'undefined'){
        // show error message
        _log_error('TinyMCE not loaded');

        // terminate plugin loading
        return;
    }

    // shortcuts
    var _tinymce = tinymce;
    var _enlighterjs_config = EnlighterJS_EditorConfig;

    var plugin = function (editor, url) {

        //=require Util.js

        // generate language list values
        var _languageList = toSelectList(_enlighterjs_config.languages);

        // generate theme values
        var _themeList = toSelectList(_enlighterjs_config.themes);

        // EnlighterJS Editor Plugin
        //=require Dialog.js
        //=require Toolbar.js

        // Load Views
        //=require views/*.js

        // Load Modules
        //=require CodeInsert.js
        //=require CodeEdit.js

        // is a enlighter node (pre element) selected/focused ?
        var enlighterNodeActive = false;

        // listen on editor paste events
        editor.on('PastePreProcess', function (e) {
            // paste event within an enlighter codeblock ?
            if (enlighterNodeActive) {
                // stop further event processing
                e.stopPropagation();

                // remove outer pre tags
                // avoids the creation of additional pre sections within the editor pane when pasting into an active section
                e.content = e.content
                    .replace(/^\s*<pre(.*?)>([\s\S]+)<\/pre>\s*$/gi, '$2')

                    // keep linebreaks
                    .replace(/\n/g, '<BR/>')

                    // keep indentation
                    .replace(/ /g, '&nbsp;')

                    // drop wysiwyg paste formats
                    .replace(/<span(.*?)>/g, '')
                    .replace(/<\/span>/g, '');
            }
        });

        // enlighter settings button (menubar)
        var editMenuButton = null;

        // listen on NodeChange Event to show/hide the toolbar
        editor.on('NodeChange', function (e) {
            e.stopPropagation();

            // get current node
            var node = editor.selection.getNode();

            // show hide codeblock toolbar
            if (isEnlighterCodeblock(node)) {
                Toolbar.show(node, codeEditAction);
                enlighterNodeActive = true;
            } else {
                Toolbar.hide();
                enlighterNodeActive = false;
            }

            // show hide edit menu button
            if (editMenuButton) {
                if (isEnlighterCode(node)) {
                    editMenuButton.disabled(false);
                } else {
                    editMenuButton.disabled(true);
                }
            }
        });

        // Add Code Insert Button to toolbar
        editor.addButton('EnlighterInsert', {
            title : 'Code Insert',
            image : url + '/code-insert-icon.png',

            onclick: codeInsertAction
        });

        // Add Code Edit Button to toolbar
        editor.addButton('EnlighterEdit', {
            title: 'Code Settings',
            disabled: true,
            image: url + '/code-edit-icon.png',

            // store menu button instance
            onPostRender: function () {
                editMenuButton = this;
            },

            onclick: codeEditAction
        });

        // Additional Plugins
        //=require TabIndent.js
    };

    // register plugin
    _tinymce.PluginManager.add('enlighterjs', plugin);

// initialization Wrapper
})();
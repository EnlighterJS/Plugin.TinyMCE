/*! EnlighterJS TinyMCE Plugin 3.1.0 | The MIT License (X11) | http://enlighterjs.org */
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

        // is the given node a enlighter codeblock ?
        var isEnlighterCodeblock = function (node){
            // enlighter element ?
            return (node.nodeName == 'PRE' && editor.dom.hasClass(node, 'EnlighterJSRAW'));
        };
        
        // is the given node a enlighter inline codeblock ?
        var isEnlighterInlineCode = function (node){
            // enlighter element ?
            return (node.nodeName == 'CODE' && editor.dom.hasClass(node, 'EnlighterJSRAW'));
        };
        
        // is the given node a enlighter inline block ?
        var isEnlighterCode = function(node){
            // enlighter element ?
            return ((node.nodeName == 'CODE' || node.nodeName == 'PRE' ) && editor.dom.hasClass(node, 'EnlighterJSRAW'));
        };
        
        // generate key/value list from object for TinyMCE select-box
        var toSelectList = (function(input){
            // base entry
            var list = [{
                text: 'Default (Global-Settings)',
                value: null
            }];
        
            _tinymce.each(input, function (value, key) {
                list.push({
                    text: key,
                    value: key.toLowerCase()
                });
            });
        
            return list;
        });

        // generate language list values
        var _languageList = toSelectList(_enlighterjs_config.languages);

        // generate theme values
        var _themeList = toSelectList(_enlighterjs_config.themes);

        // EnlighterJS Editor Plugin
        var Dialog = {
            open: function(view, cb){
                // add submit callback
                view.onsubmit = cb;
        
                // Open new editor window / overlay form
                editor.windowManager.open(view);
            }
        };
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

        // Load Views
        var code_edit_dialog = function(settings, inlineMode){
            return {
                title : 'Enlighter Code Settings',
                minWidth : 700,
                body : [
                    {
                        type : 'listbox',
                        name : 'language',
                        label : 'Language',
                        values : _languageList,
                        value: settings.language,
                        style: 'direction: ltr; text-align: left'
                    },
                    {
                        type : 'listbox',
                        name : 'theme',
                        label : 'Theme',
                        values : _themeList,
                        value: settings.theme,
                        style: 'direction: ltr; text-align: left'
                    },
                    {
                        type : 'checkbox',
                        name : 'linenums',
                        label : 'Show Linenumbers',
                        checked: settings.linenumbers,
                        disabled: inlineMode
                    },
                    {
                        type : 'textbox',
                        name : 'highlight',
                        label : 'Point out Lines (e.g. 1,2-6,9)',
                        multiline : false,
                        value: settings.highlight,
                        disabled: inlineMode,
                        style: 'direction: ltr; text-align: left'
                    },
                    {
                        type : 'textbox',
                        name : 'offset',
                        label : 'Linennumber offset (e.g. 5)',
                        multiline : false,
                        value : settings.lineoffset,
                        disabled: inlineMode,
                        style: 'direction: ltr; text-align: left'
                    },
                    {
                        type : 'textbox',
                        name : 'group',
                        label : 'Codegroup Identifier',
                        multiline : false,
                        value : settings.group,
                        disabled: inlineMode,
                        style: 'direction: ltr; text-align: left'
                    },
                    {
                        type : 'textbox',
                        name : 'title',
                        label : 'Codegroup Title',
                        multiline : false,
                        value : settings.title,
                        disabled: inlineMode,
                        style: 'direction: ltr; text-align: left'
                    }
                ]
            }
        };
                var code_insert_dialog = function () {
            return {
                title: 'Enlighter Code Insert',
                minWidth: 700,
                body: [
                    {
                        type: 'listbox',
                        name: 'lang',
                        label: 'Language',
                        values: _languageList,
                        style: 'direction: ltr; text-align: left'
                    },
                    {
                        type: 'listbox',
                        name: 'mode',
                        label: 'Mode',
                        values: [
                            {text: 'Block-Code', value: 'block'},
                            {text: 'Inline-Code', value: 'inline'}
                        ],
                        value: 'block',
                        style: 'direction: ltr; text-align: left'
                    },
                    {
                        type: 'checkbox',
                        name: 'indentation',
                        label: 'Left-Align Indentation',
                        checked: (_enlighterjs_config.config.indent > 0),
                        disabled: (_enlighterjs_config.config.indent < 0)
                    },
                    {
                        type: 'checkbox',
                        name: 'addspaces',
                        label: 'Surround with spaces',
                        checked: false,
                        disabled: false
                    },
                    {
                        type: 'textbox',
                        name: 'code',
                        label: 'Sourcecode',
                        multiline: true,
                        minHeight: 200,
                        style: 'direction: ltr; text-align: left'
                    }
                ]
            }
        };

        // Load Modules
        var codeInsertAction = function(){
        
            Dialog.open(code_insert_dialog(), function(e){
                // get code - replace windows style linebreaks
                var code = e.data.code.replace(/\r\n/gmi, '\n');
        
                // inline or block code ?
                var tag = (e.data.mode == 'inline' ? 'code' : 'pre');
        
                // modify code indent
                if (e.data.mode == 'block' && e.data.indentation){
                    // match all tabs
                    code = code.replace(/^(\t*)/gim, function(match, p1, offset, string){
                        // replace n tabs with n*newIndent spaces
                        return (new Array(_enlighterjs_config.config.indent * p1.length + 1)).join(' ');
                    });
        
                    var minIndentation = 99999;
        
                    // get minimal indentation
                    var lines = code.split('\n');
                    for (var i=0;i<lines.length;i++){
                        var l = lines[i];
        
                        // non-empty line ?
                        if (l.replace(/\s*/, '').length > 0){
                            var k = l.match(/^( *)/gmi);
        
                            // indentation found ?
                            if (k && k.length == 1){
                                minIndentation = Math.min(k[0].length, minIndentation);
        
                                // no identation offset dectected
                            }else{
                                minIndentation = 0;
                                break;
                            }
                        }
                    }
        
                    // remove indent ?
                    if (minIndentation > 0 && minIndentation < 99999){
                        var pattern = new RegExp('^( ){' + minIndentation + '}', 'gmi');
                        code = code.replace(pattern, '');
                    }
                }
        
                // entities encoding
                code = _tinymce.html.Entities.encodeAllRaw(code);
        
                // surround with spaces ?
                var sp = (e.data.addspaces ? '&nbsp;' : '');
        
                // Insert codeblock into editors current position when the window form is "submitted"
                editor.insertContent(sp + '<' + tag + ' class="EnlighterJSRAW" data-enlighter-language="' + e.data.lang + '">' + code + '</' + tag + '>' + sp + '<p></p>');
            });
        };
        // set the enlighter settings of the current node
        var setCodeblockSettings = function(settings) {
        
            // get current node
            var node = editor.selection.getNode();
        
            // enlighter element ?
            if (!isEnlighterCode(node)) {
                return;
            }
        
            // helper function
            var setAttb = (function (name) {
                if (settings[name]) {
                    node.setAttribute('data-enlighter-' + name, settings[name]);
                } else {
                    node.removeAttribute('data-enlighter-' + name);
                }
            });
        
            // language attribute available ?
            setAttb('language');
        
            // theme attribute available ?
            setAttb('theme');
        
            // highlight attribute available ?
            setAttb('highlight');
        
            // linenumber offset attribute available ?
            setAttb('lineoffset');
        
            // codegroup title set ?
            setAttb('group');
            setAttb('title');
        
            // show linenumbers
            if (settings.linenumbers == _enlighterjs_config.config.linenumbers) {
                // default value
                node.removeAttribute('data-enlighter-linenumbers');
            } else {
                // user set value
                node.setAttribute('data-enlighter-linenumbers', (settings.linenumbers ? 'true' : 'false'));
            }
        };
        
        // get the enlighter settings of the current selected node
        var getCodeblockSettings = function () {
        
            // get current node
            var node = editor.selection.getNode();
        
            // enlighter element ?
            if (!isEnlighterCode(node)) {
                return {};
            }
        
            // get linenumber attribute (null: not set | true/false)
            var ln = node.getAttribute('data-enlighter-linenumbers');
        
            // generate config
            return {
                language: node.getAttribute('data-enlighter-language'),
                linenumbers: (ln == null ? _enlighterjs_config.config.linenumbers : (ln == 'true')),
                highlight: node.getAttribute('data-enlighter-highlight'),
                lineoffset: node.getAttribute('data-enlighter-lineoffset'),
                theme: node.getAttribute('data-enlighter-theme'),
                group: node.getAttribute('data-enlighter-group'),
                title: node.getAttribute('data-enlighter-title')
            };
        };
        
        var codeEditAction = (function(){
        
            // get the current node settings
            var settings = getCodeblockSettings();
        
            // inline mode ?
            var inlineMode = isEnlighterInlineCode(editor.selection.getNode());
        
            // open new oberlay window
            Dialog.open(code_edit_dialog(settings, inlineMode), function(e){
        
                // apply the enlighter specific node attributes to the current selected node
                setCodeblockSettings({
                    language: e.data.language,
                    linenumbers: e.data.linenums,
                    highlight: e.data.highlight,
                    lineoffset: e.data.offset,
                    theme: e.data.theme,
                    title: e.data.title,
                    group: e.data.group
                });
            });
        });
        //=require CodeInsert.js

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
            title : 'Enlighter Code Insert',
            image : url + '/code-insert-icon.png',

            onclick: codeInsertAction
        });

        // Add Code Edit Button to toolbar
        editor.addButton('EnlighterEdit', {
            title: 'Enlighter Code Settings',
            disabled: true,
            image: url + '/code-edit-icon.png',

            // store menu button instance
            onPostRender: function () {
                editMenuButton = this;
            },

            onclick: codeEditAction
        });
    };


    // register plugin
    _tinymce.PluginManager.add('enlighterjs', plugin);

// initialization Wrapper
})();
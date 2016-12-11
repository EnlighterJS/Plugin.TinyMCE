// set the enlighter settings of the current node
var setCodeblockSettings = function(settings) {

    // get current node
    var node = editor.selection.getNode();

    // enlighter element ?
    if (!isEnlighterCode(node)) {
        return;
    }

    // get current mode
    var currentMode = isEnlighterInlineCode(editor.selection.getNode()) ? 'inline' : 'block';

    // node change block<>inline ?
    if (settings.mode != currentMode){
        // create new node
        var newElement = editor.dom.create((settings.mode == 'block' ? 'pre' : 'code'), {
            'class': 'EnlighterJSRAW'
        });

        // replace
        editor.dom.replace(newElement, node, true);
        node = newElement;
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
var getCodeblockSettings = function (inlineMode) {

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
        title: node.getAttribute('data-enlighter-title'),
        mode: inlineMode ? 'inline' : 'block'
    };
};

var codeEditAction = (function(){
    // inline mode ?
    var inlineMode = isEnlighterInlineCode(editor.selection.getNode());

    // get the current node settings
    var settings = getCodeblockSettings(inlineMode);

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
            group: e.data.group,
            mode: e.data.mode
        });
    });
});
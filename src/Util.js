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
var toSelectList = (function(input, defaultEntry){
    // base entry
    var list = [];

    // add default entry ?
    if (defaultEntry !== null){
        list.push({
            text: 'Standard (' + defaultEntry + ')',
            value: null
        });
    }

    // add key/value pairs
    _tinymce.each(input, function (value, key) {
        list.push({
            text: value,
            value: key
        });
    });

    return list;
});
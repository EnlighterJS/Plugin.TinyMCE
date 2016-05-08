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
// generate indentation
var numTabIndent = _enlighterjs_config.config.indent;
var tabindent = (numTabIndent > 0 ? (new Array(numTabIndent+1)).join(' ') : null);

// tab indentation within codeblocks enabled ?
if (_enlighterjs_config.config.tabIndentation === true && tabindent !== null){

    // cancel default tab action
    editor.on('KeyUp', function(e){
        // active node ?
        if (!enlighterNodeActive){
            return;
        }

        if (e.keyCode === 9 && !e.ctrlKey && !e.altKey && !e.metaKey){
            e.preventDefault();
        }
    });

    // handle tab key events
    editor.on('KeyPress KeyDown', function(e){
        // active node ?
        if (!enlighterNodeActive){
            return;
        }

        // another button pressed ?
        if (e.keyCode !== 9 || e.ctrlKey || e.altKey || e.metaKey || e.isDefaultPrevented()){
            return;
        }
        e.preventDefault();

        // get internal w3c compliant range object
        var rng = editor.selection.getRng(true);

        // pure cursor without selection ? just add indent
        if (rng.startOffset === rng.endOffset && !e.shiftKey){
            // insert indentation
            editor.insertContent(tabindent.replace(/\s/g, '&nbsp;'));

        // selection - extract lines
        }else{
            // get selected node (text container)
            var node = editor.selection.getNode();

            // extract original text
            var nodeContent = node.textContent;

            // count num lines
            var startLine = nodeContent.substring(0, rng.startOffset).split('\n').length-1;
            var stopLine = nodeContent.substring(0, rng.endOffset).split('\n').length-1;

            // count block size for selection (total lines)
            var startBlockOffset = nodeContent.substring(0, rng.startOffset).lastIndexOf('\n') + 1;

            // split into lines
            var lines = nodeContent.split('\n');

            // new blocksize (for selection)
            var blocksize = 0;

            // reverse mode ? remove indentation of selection
            if (e.shiftKey){

                // remove indentation
                for (var i=startLine;i<=stopLine;i++){
                    // count num spaces
                    var numSpaces = lines[i].replace(/^(\s*).*?$/, '$1').length;

                    // only delete whitespaces
                    var deleteSpaces = Math.min(numSpaces, numTabIndent);

                    // remove leading indentation
                    var newLine = lines[i].substr(deleteSpaces);
                    lines[i] = newLine;

                    // count + linebreak
                    blocksize += newLine.length + 1;
                }
            
            // normal mode
            }else{

                // inject indentation
                for (var i=startLine;i<=stopLine;i++){
                    var newLine = tabindent + lines[i];
                    lines[i] = newLine;

                    // count + linebreak
                    blocksize += newLine.length + 1;
                }
            }

            // modify content
            node.textContent = lines.join('\n');

            // new selection range
            rng.setStart(node.firstChild, startBlockOffset);
            rng.setEnd(node.firstChild, startBlockOffset + blocksize - 1);
            editor.selection.setRng(rng);
        }
    });
}

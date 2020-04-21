var code_edit_dialog = function(settings, inlineMode){
    return {
        title : 'Code Settings - EnlighterJS Syntax Highlighter',
        minWidth : 700,
        body : [
            {
                type: 'listbox',
                name: 'mode',
                label: 'Mode',
                values: [
                    {text: 'Block-Code', value: 'block'},
                    {text: 'Inline-Code', value: 'inline'}
                ],
                value: settings.mode,
                style: 'direction: ltr; text-align: left'
            },
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
                label : 'Show line numbers',
                checked: settings.linenumbers,
                disabled: inlineMode
            },
            {
                type : 'textbox',
                name : 'offset',
                label : 'Line number offset',
                multiline : false,
                value : settings.lineoffset,
                disabled: inlineMode,
                style: 'direction: ltr; text-align: left'
            },
            {
                type : 'textbox',
                name : 'highlight',
                label : 'Highlight lines (e.g. 1,2-6,9)',
                multiline : false,
                value: settings.highlight,
                disabled: inlineMode,
                style: 'direction: ltr; text-align: left'
            },
            {
                type : 'textbox',
                name : 'group',
                label : 'Codegroup identifier',
                multiline : false,
                value : settings.group,
                disabled: inlineMode,
                style: 'direction: ltr; text-align: left'
            },
            {
                type : 'textbox',
                name : 'title',
                label : 'Codegroup title',
                multiline : false,
                value : settings.title,
                disabled: inlineMode,
                style: 'direction: ltr; text-align: left'
            }
        ]
    }
};
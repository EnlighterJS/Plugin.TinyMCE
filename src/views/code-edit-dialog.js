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
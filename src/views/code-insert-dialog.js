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
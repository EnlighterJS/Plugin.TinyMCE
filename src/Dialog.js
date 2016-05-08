var Dialog = {
    open: function(view, cb){
        // add submit callback
        view.onsubmit = cb;

        // Open new editor window / overlay form
        editor.windowManager.open(view);
    }
};
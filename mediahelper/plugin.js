CKEDITOR.plugins.add( 'mediahelper', {

    icons: 'mediahelper',

    init: function( editor ) {

        var self = this;

        CKEDITOR.dialog.add( 'MediaHelperDialog', function (editor) {

            return {

                title: 'Media Helper',
                minWidth: 400,
                minHeight: 200,

                contents: [

                    // Definition of the Youtube tab
                    {
                        id: 'tab-youtube',
                        label: 'Youtube',
                        elements: [
                            {
                                type: 'text',
                                id: 'youtube-url',
                                label: 'URL',
                                'autofocus': 'autofocus'
                            }
                        ]
                    },

                    // Definition of the Vimeo tab
                    {
                        id: 'tab-vimeo',
                        label: 'Vimeo',
                        elements: [
                            {
                                type: 'text',
                                id: 'vimeo-url',
                                label: 'URL',
                                'autofocus': 'autofocus'
                            }
                        ]
                    },


                    // Definition of the embed tab
                    {
                        id: 'tab-embed',
                        label: 'Embed',

                        elements: [
                            {
                                type: 'textarea',
                                id: 'embedcode',
                                label: 'Paste embed code',
                                'autofocus': 'autofocus'
                            }
                        ]
                    }
                ],

                onOk: function () {
                    var div = editor.document.createElement('div');
                    div.setHtml(this.getContentElement('tab-embed', 'embedcode').getValue());
                    editor.insertElement(div);
                }

            }

        });

        editor.addCommand( 'mediahelper', new CKEDITOR.dialogCommand( 'MediaHelperDialog', {
            allowedContent: 'iframe[*]'
        } ) );

        editor.ui.addButton( 'MediaHelper', {

            label: 'Media Helper',
            command: 'mediahelper',
            toolbar: 'insert'

        });

    }

});

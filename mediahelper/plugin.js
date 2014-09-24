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

                    // Frame for settings
                    {
                        id: 'frame',
                        label: 'Settings',
                        elements: [

                            // URL
                            {
                                type: 'text',
                                id: 'url',
                                label: 'Video URL',
                                'autofocus': 'autofocus'
                            },

                            // Width
                            {
                                type: 'text',
                                id: 'width',
                                label: 'Width (pixels)'
                            },

                            // Height
                            {
                                type: 'text',
                                id: 'height',
                                label: 'Height (pixels)'
                            },

                            // Autoplay
                            {
                                type: 'checkbox',
                                id: 'autoplay',
                                label: 'Autoplay mode'
                            },

                            // Responsive
                            {
                                type: 'checkbox',
                                id: 'responsive',
                                'default': 'checked',
                                label: 'Responsive mode'
                            },

                            // Embed code
                            {
                                type: 'textarea',
                                id: 'embedcode',
                                label: 'Paste embed code (will ignore other settings)'
                            }

                        // End frame elements
                        ]
                    }

                // End contents
                ],

                onOk: function () {

                    var embedElement = null,
                        embedElementContent = null,
                        embedCode = this.getValueOf('frame', 'embedcode'),
                        responsive = this.getValueOf('frame', 'responsive'),
                        url = this.getValueOf('frame', 'url');

                    // If embed code is put in, and the element does not require responsive mode
                    if (embedCode && !responsive) {
                        editor.insertHtml(embedCode);
                    }

                    else {

                        var contentProps = {
                            styles: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }
                        };

                        // If embedCode is set, use that in an empty div
                        if (embedCode) {
                            embedElementContent = editor.document.createElement('div', contentProps);
                            embedElementContent.setHtml(embedCode);
                        } 

                        // Else check value of url fields
                        else if (url) {

                            var width = this.getValueOf('frame', 'width') || 640,
                                height = this.getValueOf('frame', 'height') || 360,
                                autoplay = this.getValueOf('frame', 'autoplay'),
                                type = null,
                                attributes = [];

                            // Find type
                            window.wat = url;
                            // Youtube
                            if ( url.match(/.*youtu.*/i) ) {
                                type = 'Youtube';
                            }

                            // Vimeo
                            else if ( url.match(/.*vimeo.*/i) ) {
                                type = 'Vimeo';
                            }

                            switch (type) {
                                default:
                                case 'Youtube':
                                    url = '//www.youtube.com/embed/cqBKMGuZC6I';
                                    if (autoplay) {
                                        attributes.push('autoplay=1');
                                    }
                                    break;

                                case 'Vimeo':
                                    url = '//player.vimeo.com/video/106839392';
                                    if (autoplay) {
                                        attributes.push('autoplay=1');
                                    }
                                    break;
                            }

                            // Create element
                            contentProps.attributes = {
                                src: url + ( attributes.length ? '?' + attributes.join('&amp;') : '' ),
                                width: parseInt( width ),
                                height: parseInt( height ),
                                frameborder: 0,
                                allowfullscreen: ''
                            };
                            embedElementContent = editor.document.createElement('iframe', contentProps);
                        }

                        // Could not determine type
                        else {
                            alert('Input is not valid');
                            return false;
                        }

                        // Add defining class to element content
                        embedElementContent.addClass( 'media-element-content' );

                        // If responsive, put embed content into container
                        if (responsive) {
                            embedElement = editor.document.createElement('div',
                                {
                                    attributes: {
                                        'class': 'media-element'
                                    },
                                    styles: {
                                        position: 'relative',
                                        'padding-bottom': '56.25%', /* 16:9 */
                                        'padding-top': '25px',
                                        height: 0
                                    }
                                }
                            );
                            embedElementContent.appendTo( embedElement );
                        }

                        // Else set embed element to content
                        else {
                            embedElement = embedElementContent;
                        }

                        // Append embedElement to editor
                        editor.insertElement( embedElement );

                    }

                    return true;
                }

            }

        });

        editor.addCommand( 'mediahelper', new CKEDITOR.dialogCommand( 'MediaHelperDialog', {
            allowedContent: 'div[*],iframe[*],object[*]'
        } ) );

        editor.ui.addButton( 'MediaHelper', {

            label: 'Media Helper',
            command: 'mediahelper',
            toolbar: 'insert'

        });

    }

});

/**
*   This addon for CKEditor will enable the user to add (responsive) media elements.
*   The engine within this addon has knowledge of Youtube and Vimeo specific embedding, but is also lenient
*   towards custom embedding.
*
*   @author Jacob Overgaard <http://jovergaard.me>
*   @version 0.2.1
*   @updated 2014-09-25
*/

CKEDITOR.plugins.add( 'mediahelper', {

    icons: 'mediahelper',

    lang: [ 'en', 'da', 'nb', 'sv' ],

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
                                label: editor.lang.mediahelper.label.url,
                                'autofocus': 'autofocus'
                            },

                            // Width
                            {
                                type: 'text',
                                id: 'width',
                                'default': 640,
                                label: editor.lang.mediahelper.label.width,
                                validate: function () {
                                    var value = parseInt(this.getValue());
                                    if (!value || value === 0) {
                                        alert( editor.lang.mediahelper.error.width );
                                        return false;
                                    }
                                }
                            },

                            // Height
                            {
                                type: 'text',
                                id: 'height',
                                'default': 360,
                                label: editor.lang.mediahelper.label.height,
                                validate: function () {
                                    var value = parseInt(this.getValue());
                                    if (!value || value === 0) {
                                        alert( editor.lang.mediahelper.error.height );
                                        return false;
                                    }
                                }
                            },

                            // Autoplay
                            {
                                type: 'checkbox',
                                id: 'autoplay',
                                label: editor.lang.mediahelper.label.autoplay
                            },

                            // Responsive
                            {
                                type: 'checkbox',
                                id: 'responsive',
                                'default': 'checked',
                                label: editor.lang.mediahelper.label.responsive
                            },

                            // Embed code
                            {
                                type: 'textarea',
                                id: 'embedcode',
                                label: editor.lang.mediahelper.label.embedcode
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

                        var contentProps = {};

                        if (responsive) {
                            contentProps.styles = {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            };
                        }

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
                                videoId = null,
                                attributes = [];

                            // Youtube
                            videoId = url.match(/(\.be\/|v[=\/])([\w\-]{11,})/i);
                            if ( videoId ) {
                                url = '//www.youtube.com/embed/' + videoId[2];
                                if (autoplay) {
                                    attributes.push('autoplay=1');
                                }
                            }

                            // Vimeo
                            videoId = url.match(/vimeo\.com(\/video|\/channels\/.*?)?\/(\d+)/i);
                            if ( videoId ) {
                                url = '//player.vimeo.com/video/' + videoId[2];
                                if (autoplay) {
                                    attributes.push('autoplay=1');
                                }
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
                            alert(editor.lang.mediahelper.error.input);
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
                            embedElementContent.addClass( 'media-element' );
                            embedElement = embedElementContent;
                        }

                        // Append embedElement to editor
                        editor.insertElement( embedElement );

                    }

                    return true;
                }

            }

        });
        
        // Command to open dialog
        editor.addCommand( 'mediahelper', new CKEDITOR.dialogCommand( 'MediaHelperDialog', {
            allowedContent: 'div[*],iframe[!width,!height,!src,!frameborder,!allowfullscreen],object[*]'
        } ) );

        // Toolbar Button
        editor.ui.addButton( 'MediaHelper', {

            label: 'Media Helper',
            command: 'mediahelper',
            toolbar: 'insert'

        });

    }

});

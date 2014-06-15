define([
    'views/modals/uploadModal',
    'hbs!tmpl/modals/uploadJamtrackHeader'
],
function( UploadModal, headerTpl ) {
    'use strict';

    /* Return a ItemView class definition */
    var UploadShredView = UploadModal.extend({
        renderMoreStuff : function () {
            this.$('[data-reg="head"]').html(headerTpl);
        },

        serializeData : function () {
            return {
                title:'The title for this Jamtrack',
                desc: 'Add a little description, saying how to jam with this track',
                tags : 'Add tags that describes the track. For example C-minor scale, tapping, G-minor7 etc.',
                upload: 'Upload With Soundcloud'
            };
        },

        uploadComplete : function () { this.__closeClicked(); },

        __thirdPartyUploadClicked : function () {
            alert('Sorry, this feature is not yet ready ;(');
        },

        __uploadFormSubmitted : function(e) {
            e.preventDefault();

            this.model.set({
                title : this.$('#shred-title').val(),
                description : this.$('#shred-description').val(),
                tags : this.shredTagsAC.getKeys()
            }, {validate : true});


            if (this.model.validationError) {
                return alert('Invalid input' );
            }

            if ( this.uploadComponent.fileAdded() ) {
                Shredr.baseController.exec(this.model, 'save', {
                    success : this.saveShredMetaSuccess.bind(this)
                });
            } else {
                return alert('File not added' );
            }
        }

    });

    return UploadShredView;
});

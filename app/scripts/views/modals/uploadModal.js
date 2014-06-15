/**
* Base class for uploadModals (shreds and jamtracks).
* This used to be the shredsModal, but got merged into
* this baseclass. Haven't bothered to change some of the
* names, hence all the shred references
*/
define([
'backbone',
'views/modals/baseModalLayout',
'components/uploadComponent',
'components/autocompleteComponent',
'components/youtubeComponent',
'views/workspace/createShredTabs',
'hbs!tmpl/modals/uploadView',
'autocomplete'
],
function(
    Backbone,
    BaseModalLayout,
    UploadComponent,
    AutocompleteComponent,
    YoutubeComponent,
    CreateShredTabsView,
    tpl ) {
    'use strict';

    /* Return a ItemView class definition */
    var UploadShredView = BaseModalLayout.extend({

        initialize: function(options) {
            BaseModalLayout.prototype.initialize.apply(this, arguments);
            this.listenTo(Shredr.vent, 'shred:save:success', this.uploadComplete);
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-evt="youtube"]'  	: '__thirdPartyUploadClicked',
            'click [data-evt="save"]' 		: '__uploadFormSubmitted',
            'click [data-evt="addTabs"]'  	: '__addTabsClicked',
            'click [data-evt="type"] a' 	  : '__typeClicked'
        }),

        // onRender: function() {
        //     BaseModalLayout.prototype.onRender.apply(this);
        // },

        regions : { tabs : '[data-reg="tabs"]' },

        onShow : function () {
            BaseModalLayout.prototype.onShow.apply(this, arguments);

            this.ui.body.html(tpl(this.serializeData()));
            this.renderMoreStuff();
            this.renderUpload();
            this.renderAutocompletes();
        },

        renderMoreStuff : function () {},

        renderUpload : function () {
            setTimeout( function () {
                try {
                    this.uploadComponent = new UploadComponent({
                        fileUpload : true,
                        fileDrop : true,
                        region : new Backbone.Marionette.Region({ el : this.$('[data-reg="upload"]')})
                    }).show();
                    this.listenTo(this.uploadComponent, 'file:upload:success', this.uploadComplete);
                } catch(e) {
                    console.log('error: ' + e);
                    this.renderUpload.call(this);
                }
            }.bind(this), 20);
        },

        renderAutocompletes : function () {
            this.shredTagsAC = new AutocompleteComponent({
                $el : this.$('[data-event="shred-tags-input"]'),
                $tagsRegion : this.$('[data-region="shred-tags"]'),
                source : 'shreds',
                allowNewKeys : true
            });

            this.gearTagsAC = new AutocompleteComponent({
                $el : this.$('[data-event="gear-tags-input"]'),
                $tagsRegion : this.$('[data-region="gear-tags"]'),
                source : 'gear',
                allowNewKeys : true
            });
        },

        saveShredMetaSuccess : function (res) {
            this.uploadComponent.trigger('file:upload', this.model.getUploadUrl());
        },

        // EVENTS

        __typeClicked : function (e) {
            e.preventDefault();
            var $curr = $(e.currentTarget);
            var val = $curr.text();
            this.$('.active').removeClass('active');
            $curr.addClass('active');
        },

        __thirdPartyUploadClicked : function () {
            this.$('[data-reg="orLocal"]').fadeOut('fast');
            this.youtubeComponent = new YoutubeComponent({
                model : this.model,
                region : new Backbone.Marionette.Region({ el : this.$('[data-reg="youtube"]')})
            }).show();
        },

        __uploadFormSubmitted : function(e) {
            e.preventDefault();
            var title = this.$('#shred-title').val(),
            desc = this.$('#shred-description').val(),
            type = this.$('.active').text();


            this.model.set({
                title : title,
                description : desc,
                shredTags : this.shredTagsAC.getKeys(),
                gearTags : this.gearTagsAC.getKeys(),
                jamtrackTag : this.jamtrackTagsAC ? this.jamtrackTagsAC.getKeys() : null,
                type : type
            }, {validate : true});


            if (this.model.validationError) {
                return alert('Invalid input');
            }

            // either upload to youtube
            if ( this.youtubeComponent ) {
                this.youtubeComponent.uploadFormSubmitted();

            // Or locally
            } else {
                if ( this.uploadComponent.fileAdded() ) {
                    Shredr.baseController.exec(this.model, 'save', {
                        success : this.saveShredMetaSuccess.bind(this)
                    });
                }else {
                    console.log('File not added' ); return false;
                }
            }
        },

        __addTabsClicked : function () {
            this.$('[data-reg="main"]').fadeOut('fast');
            var view = new CreateShredTabsView({model : this.model});
            this.tabs.show(view);
            this.tabs.$el.fadeIn('fast');
            this.listenTo(view, 'tabs:save:clicked', this.hideTabsRegion);
        },

        hideTabsRegion : function () {
            this.tabs.close();
            this.tabs.$el.hide();
            this.$('[data-reg="main"]').fadeIn('fast');
        },

        uploadComplete : function () {
            var url = '/#shred/' + this.model.get('_id');
            this.__closeClicked();
            Shredr.navigate(url, {trigger : true});
        }
    });

    return UploadShredView;
});

/* globals $ */
define([
'backbone',

'models/Scale',
'collections/ScalesCollection',

'views/workspace/tabs',
'views/workspace/scalePreview',

'hbs!tmpl/workspace/scalesTheory',
'hbs!tmpl/workspace/scalesTheoryAddScale'
],
function( Backbone, Scale, ScalesCollection, TabsEditor,
    ScalePreviewView, tmpl, scaleAddTpl ) {
    'use strict';

    /* Return a Layout class definition */
    return Backbone.Marionette.ItemView.extend({

        template : tmpl,

        initialize : function () {
            this.collection = new ScalesCollection();
            this.listenTo(this.collection, 'reset', this.render);
            this.collection.fetch({reset:true});
        },

        ui : {
            scaleRegion : '[data-region="scale"]'
        },

        serializeData : function () {
            return {
                collection : this.collection.toJSON()
            };
        },

        events : {
            'click [data-event="scale"]' : '__scaleClicked',
            'click [data-event="add"]' : '__addBtnClicked',
            'click [data-event="scale-done-btn"]' : '__addScaleDoneClicked'
        },

        onRender : function () {
            if ( this.collection.length > 0 ) {
                // Collection is now fetched.
                // Set the first model in the collection to this.model
                this.model = this.collection.at(0);
                this.listenToOnce(this.model, 'change', this.renderScalePreview);
                this.model.fetch();
            }
        },

        scaleSaveSuccess : function (scale) {
            this.swapScaleRegion();
        },

        scaleSaveError : function (err) {},

        swapScaleRegion : function (changeToCreate, model) {

            // remove scale region from DOM
            this.ui.scaleRegion.fadeOut('fast', function () {
                this.ui.scaleRegion.children().remove();

                // add either create or preview view
                if ( changeToCreate ) {
                    this.ui.scaleRegion.append(scaleAddTpl());
                    this.tabsEditor = new TabsEditor();
                    this.$('[data-region="tabsArea"]')
                    .append(this.tabsEditor.render().el);
                } else {
                    if ( !this.scalePreviewView ) {
                        this.scalePreviewView = new ScalePreviewView();
                    }
                    this.scalePreviewView.model = model;
                    this.ui.scaleRegion.append(
                        this.scalePreviewView.render().el
                    );
                }

                this.ui.scaleRegion.fadeIn('fast');
            }.bind(this));
        },

        renderScalePreview : function (model) {
            this.swapScaleRegion(false, model);
        },

        // events

        __scaleClicked : function (e) {
            var index = $(e.currentTarget).attr('data-model');
            this.model = this.collection.at(parseInt(index, 10));
            if ( this.model.hasChanged() === false ) {
                this.listenToOnce(this.model, 'change', this.renderScalePreview);
                this.model.fetch();
            } else {
                this.renderScalePreview(this.model);
            }
        },

        __addBtnClicked : function () {
            this.swapScaleRegion(true);
            // this.ui.scaleRegion.fadeOut('fast', function () {
            //     this.ui.scaleRegion.children().remove();
            //     this.ui.scaleRegion.append(scaleAddTpl());
            //     this.ui.scaleRegion.fadeIn('fast');
            //     this.tabsEditor = new TabsEditor();
            //     this.$('[data-region="tabsArea"]')
            //     .append(this.tabsEditor.render().el);
            // }.bind(this));
        },

        __addScaleDoneClicked : function () {
            var tabs = this.tabsEditor.getTabs();
            var model = new Scale({
                tabs : tabs,
                title : this.$('#title').val(),
                description : this.$('#description').val(),
                tabsKey : this.$('#key').val()
            });
            model.save({}, {
                success : this.scaleSaveSuccess.bind(this),
                error : this.scaleSaveError.bind(this)
            });
        }
    });
});

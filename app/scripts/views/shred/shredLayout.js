// TODO: avoid doing render on basecontroller.exec.success

/* global define */
define([
    'backbone',
    'components/videoPlayerComponent',
    'components/commentComponent',
    'components/tabsComponent',
    'components/rateComponent',
    'collections/commentsCollection',
    'collections/shredsCollection',
    'hbs!tmpl/shred/shredLayout'
],
function (
    Backbone,
    PlayerComponent,
    CommentComponent,
    TabsComponent,
    RateComponent,
    CommentCollection,
    ShredsCollection,
    Tpl
){
'use strict';
var ShredLayout = Backbone.Marionette.Layout.extend({
    template : Tpl,

    initialize : function () {

        Shredr.baseController.exec( new ShredsCollection({populate : 'user'}), 'fetch',
            {
                event : 'shreds:fetch',
                success : function (shreds, response, options) {
                    Shredr.setCollection(shreds);
                    this.collection = shreds;

                    if ( !response.fake ) { this.render(); }
                }.bind(this),
                type : 'collection'
            }
        );
    },

    events : {
        'click [data-evt="thmb-click"]' : '__playClicked'
    },

    onRender : function () {
        this.renderComments();
        this.renderTabs();
        this.renderPlayer();
        this.renderRating();
    },

    serializeData : function () {
        var data = {m : this.model.toJSON()};
        if ( this.collection ) {
            data.things = this.collection.toJSON()
        }
        return data;
    },

    renderPlayer : function () {
        this.playerComponent = new PlayerComponent({
            region : new Backbone.Marionette.Region({
                el : this.$('[data-reg="player"]'),
            }),
            model : this.model
        }).show();
    },

    renderComments : function () {
        this.commentComponent = new CommentComponent({
            region : new Backbone.Marionette.Region({
                el : this.$('[data-reg="comments"]'),
            }),
            type : 'shreds',
            _id : this.model.get('_id'),
            collection : new CommentCollection(this.model.get('comments'))
        }).show();
    },

    renderRating : function () {
        this.rateComponent = new RateComponent({
            region : new Backbone.Marionette.Region({
                el : this.$('[data-reg="rate"]'),
            }),
            model : this.model
        }).show();
    },

    renderTabs : function () {
        this.tabsComponent = new TabsComponent({
            model : this.model,
            disabled : true,
            region : new Backbone.Marionette.Region({el : this.$('[data-reg="tabs"]')})
        }).show();
    },

    __playClicked : function (e) {
        var id = $(e.currentTarget).attr('data-model');
        Shredr.navigate('/#shred/' + id, {trigger : true});
    },

});

return ShredLayout;
});
/*

define([
    'backbone',
    'hbs!tmpl/workspace/tabs_tmpl',
    'views/workspace/tabs'
    ],
    function( Backbone, TabsTmpl, TabsEditor ) {
        'use strict';


        return Backbone.Marionette.ItemView.extend({
            className : 'sr-background over-fs-2',

            template: TabsTmpl,


            ui: {
                tabs : '[data-region="leTabs"]'
            },

            events : {
                'click [data-event="play-tabs"]' : '__playTabsClicked',
                'click [data-event="keyboard-clicked"]' : '__keyboardClicked',
                'click [data-event="save-tabs-btn"]' : '__saveTabslLicked'
            },

            onRender : function () {
                this.tabsView = new TabsEditor({
                    model : this.model,
                    template : 'create_shred_tabs_tmpl'
                });
                this.ui.tabs.append(this.tabsView.render().el);
                this.renderKeyboard();
            },

            renderKeyboard : function () {
                this.$("use").mousedown(this.startNote);
                this.$("use").mouseup(this.stopNote);
                this.$("#playAll").click(this.playAll);
            },

            __playTabsClicked : function () {
                this.tabsView.playTabs();
            },

            __keyboardClicked : function () {
                if(this.keyboardVis) {
                    this.$('.keyboard').animate({'left' : '-2000px'}, 'fast');
                    this.keyboardVis = false;
                } else {
                    this.$('.keyboard').animate({'left' : '56px'}, 'fast');
                    this.keyboardVis = true;
                }
            },

            __saveTabslLicked : function () {
                var tabs = this.tabsView.getTabs();
                this.model.set({tabs : tabs});
                Shredr.vent.trigger('nav:logo:rotate');
            }
        });

    });

*/

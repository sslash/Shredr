// TODO: avoid doing render on basecontroller.exec.success

/* global define */
define([
    'backbone',
    'components/videoPlayerComponent',
    'components/commentComponent',
    'components/tabsComponent',
    'components/rateComponent',
    'components/categoryPickerComponent',
    'collections/commentsCollection',
    'collections/shredsCollection',
    'hbs!tmpl/shred/shredDetailLayout'
],
function (
    Backbone,
    PlayerComponent,
    CommentComponent,
    TabsComponent,
    RateComponent,
    CategoryPickerComponent,
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

    ui : {
        catContent : '*[data-reg="cat-content"]'
    },

    events : {
        'click [data-evt="thmb-click"]' : '__playClicked',
        'click [data-evt="promote"]'    : '__promoteClicked'
    },

    onRender : function () {
        this.renderComments();
        this.renderTabs();
        this.renderPlayer();
        this.renderRating();
        this.renderCategoryPicker();
        this.bindUIElements();
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

    renderCategoryPicker : function () {
        this.categoryPickerComponent = new CategoryPickerComponent({
            categories : ['About', 'Promote', 'Hide'],
            region : new Backbone.Marionette.Region({el : this.$('[data-reg="cats"]')})
        }).show();
        this.listenTo(this.categoryPickerComponent, 'category:clicked', this.categoryChanged);
    },

    categoryChanged : function (category) {
        this.ui.catContent.find('.active').hide().removeClass('active');
        this.ui.catContent.find('[data-mod="' + category + '"]').show().addClass('active');
    },

    __playClicked : function (e) {
        var id = $(e.currentTarget).attr('data-model');
        Shredr.navigate('/#shred/' + id, {trigger : true});
    },

    __promoteClicked : function () {
        var body = this.$('#promote-body').val();
        this.model.promote(body);
        this.listenTo(this.model, 'shred:promoted', function() {
            alert('Shred was promoted!');
        });
    }

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

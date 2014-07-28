// TODO VERIFY SHRED COMMENTS WORK
/* global define */
define([
    'backbone',
    'collections/feedCollection',
    'hbs!tmpl/stage/feedView',
    'hbs!tmpl/stage/feedLINView',
    'hbs!tmpl/stage/feedItemView',
    'hbs!tmpl/stage/feedNewShredView',
    'hbs!tmpl/stage/feedNewUserView',
    'hbs!tmpl/stage/feedNewBattleView',
    'hbs!tmpl/stage/feedNewPromotionView',
    'hbs!tmpl/stage/feedNewCommentView',
    'hbs!tmpl/stage/feedEmptyView'
],
function (
    Backbone,
    FeedCollection,
    Tpl,
    linTpl,
    itemTpl,
    newShredTpl,
    newUserTpl,
    newBattleTpl,
    newPromotionTpl,
    newCommentTpl,
    emptyTpl
){
'use strict';

var ItemView = Backbone.Marionette.ItemView.extend({
    template : itemTpl,
    className : 'le-feed',
    feedTpl : {
        newUser : newUserTpl,
        newShred : newShredTpl,
        newBattle : newBattleTpl,
        newPromotion : newPromotionTpl,
        newShredComment : newCommentTpl
    },

    onRender : function () {
        var template = this.feedTpl[this.model.get('type')];
        this.$('[data-reg="feed-inner"]').html(template(this.serializeData()));
    },

    serializeData : function () {
        var model = this.model.toJSON();
        _.extend(model, {
            user : (typeof model.user === 'string') ?
                model.referenceObj[model.user] : model.user
        });
        return model;
    }
});

var NoChildsView = Backbone.Marionette.ItemView.extend({
    template : emptyTpl
});


var CollectionView = Backbone.Marionette.CollectionView.extend({
    itemView : ItemView,
    emptyView: NoChildsView
});

var FeedView = Backbone.Marionette.Layout.extend({

    initialize : function () {
        if (Shredr.user.get('feed')) {
            this.feedCollection = new FeedCollection(Shredr.user.get('feed'));
        }
    },

    regions : {
        'feeds' : '[data-reg="feed"]'
    },

    events : {
        'click [data-event="login"]' : '__loginClicked'
    },

    serializeData : function () {
        return Shredr.user.toJSON();
    },

    onRender : function () {
        if (this.feedCollection) {
            var view = new CollectionView({collection : this.feedCollection});
            this.feeds.show(view);
        }
    },

    getTemplate : function () {
        if ( Shredr.authController.isLoggedIn() ) {
            return linTpl;
        } else {
            return Tpl;
        }
    },

    __loginClicked : function () {
        Shredr.vent.trigger('loginModal:show');
    }
});

return FeedView;
});

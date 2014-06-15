/* global require */
define([
    'backbone',
    'views/globals/navRegionView',
    'views/globals/navRegionLINView',
    'views/globals/kickerRegionView',
    'views/modals/loginModalView',
    'views/globals/flashRegionView'
],
function (
    Backbone,
    NavRegionView,
    NavRegionLINView,
    KickerRegionView,
    LoginModalView,
    FlashRegionView
){
'use strict';
var BaseController = Backbone.Marionette.Controller.extend({

    exec : function (modelOrCollection, action, options) {
        options = options || {};

        if (options.event) {
            Shredr.vent.trigger(options.event, modelOrCollection);
        }

        var config = {
            reset : options.reset,
            success : function (modelOrColl, response, opts) {
                if ( options.event ) {
                    Shredr.vent.trigger(options.event + ':success', modelOrColl,
                    response, opts);
                }

                if ( options.success ) {
                    options.success.call(null, modelOrColl, response, opts);
                }
            },
            error : function (modelOrColl, response, opts) {

                // parse the error message
                var errors = JSON.parse(response.responseText).error.errors;
                var msgs = Object.keys(errors).map(function(key) {
                    return errors[key].message;
                });

                modelOrColl.trigger(action + ':fail:post', modelOrColl, msgs);
            }
        };

        if ( action === 'save' ) {
            modelOrCollection[action](options.attrs, config);
        } else if (action === 'delete' ) {
            modelOrCollection.sync ('delete', modelOrCollection, conf);
        } else {
            // only fetch if client render (changed in renderMainRegion)
            if (Shredr.cliRender) {
                modelOrCollection[action](config);

            // Models lives on the Shredr object, no need to fetch..
            } else {
                // need to test this...
                if ( options.type === 'model') {
                    config.success(Shredr.model, {fake : true});
                }
                else {
                    config.success(Shredr.collection, {fake : true})
                }
            }
        }
    },


    initialize : function (options) {
        this.renderGlobalViews();
        this.flashRegionView = new FlashRegionView();
        Shredr.flashRegion.show(this.flashRegionView);
        this.listenTo(Shredr.vent, 'loginModal:show', this.showLoginModal);
        this.listenTo(Shredr.vent, 'modal:close', this.closeModal);
    },

    renderGlobalViews : function () {
        if ( Shredr.authController.isLoggedIn() ) {
            this.navRegionView = new NavRegionLINView();
        } else {
            this.navRegionView = new NavRegionView();
        }

        Shredr.navRegion.show(this.navRegionView);
        Shredr.kickerRegion.show(new KickerRegionView());
    },

    renderMainRegion : function (View, opts, category) {
        if ( Shredr.cliRender ) {
            console.log('cli render');
            Shredr.mainRegion.show(new View(opts));
        } else {
            console.log('server render');

            // TODO: need serverRender:ture??
            var view = new View(
                _.extend({}, opts, {el : $('[data-region="landing"]'), serverRender : true})
            );
            Shredr.mainRegion.attachView(view);
            view.onRender();

            Shredr.cliRender = true;
        }

        Shredr.vent.trigger('mainRegion:preRender', category);
    },

    showLoginModal : function () {
        var opts = {classes : 'modal-short form-dark'};
        this.showModal(new LoginModalView(opts));
    },

    showModal : function (view, opts) {
        this.flashRegionView.toggleOverlay(opts);
        Shredr.modalRegion.show(view);
    },

    closeModal : function (opts) {
        this.flashRegionView.toggleOverlay(opts);
        Shredr.modalRegion.close();
    },

    renderPage : function () {
        this.renderGlobalViews();
        if ( Shredr.kickerRegion.currentView ) {
            Shredr.kickerRegion.currentView.render();
        }
    }

});

return BaseController;
});

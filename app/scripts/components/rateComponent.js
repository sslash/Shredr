define([
'components/component',
'models/comment',
'hbs!tmpl/components/rateView',
],
function( Component, Comment, Tpl ) {
    'use strict';

    var RateView = Backbone.Marionette.ItemView.extend({
        template : Tpl,
        ui : {
            logos : '.logos .logo-xsmall',

            // imgs
            index0 : '[data-i="0"]',
            index1 : '[data-i="1"]',
            index2 : '[data-i="2"]',
            index3 : '[data-i="3"]',
            index4 : '[data-i="4"]',
            index5 : '[data-i="5"]',
            index6 : '[data-i="6"]',
            index7 : '[data-i="7"]',
            index8 : '[data-i="8"]',
            index9 : '[data-i="9"]',

            rating : '[data-mod="rating"]',
            rateVal : '[data-mod="rateVal"]',

            viewers : '[data-mod="viewers"]',
        },

        initialize : function () {
            this.listenTo(this.model, 'change:rating', this.ratingChanged);
            this.listenTo(this.model, 'change:views', this.viewsChanged);
        },

        serializeData : function () {
            return {
                rating : this.model.getRating(),
                views : this.model.getNumberOfViewers()
            }
        },

        events : {
            'mouseenter .logos .logo-sm' : '__logoEntered',
            'mouseleave .logos'		  : '__logoExit',
            'click .logos .logo-sm'      : '__rateClicked'
        },

        ratingChanged : function(model) {
            this.colorLogos(this.currRateVal-1, '/img/icons/logo_sml_grey.png');
            this.ui.rateVal.text(this.model.get('rateValue'));
        },

        viewsChanged : function () {
            this.ui.viewers.text(this.model.getNumberOfViewers());
        },

        colorLogos : function(index, img) {

			for (var i = 0; i <= index; i ++ ) {
				var $logo = this.ui['index'+i];
				$logo.attr('src', img );
			}

			for ( var i = index +1; i < 10; i++ ) {
				var $logo = this.ui['index'+i];
				$logo.attr('src', '/img/icons/logo_sml_white.png');
			}
		},

        __logoExit : function(e) {
            if ( !this.model.get('userHasRated') ) {
                this.ui.logos.attr('src', '/img/icons/logo_sml_white.png');
            } else {
                this.colorLogos(this.rateVal-1, '/img/icons/logo_sml_grey.png');
            }
        },

		__rateClicked : function() {
			this.rateVal = this.currRateVal;
            this.trigger('shred:rate', this.rateVal);
		},

        __logoEntered : function(e) {
			var $curr = $(e.currentTarget);
			var index = parseInt($curr.attr('data-i'), 10);
			this.currRateVal = index + 1;
			this.ui.rating.text(this.currRateVal + '/10');
			this.colorLogos(index, '/img/icons/logo_sml-black.png');
		}
    });

    return Component.extend({

        initialize: function(options) {
            Component.prototype.initialize.call(this, options);
            this.view = new RateView({model : this.model})
            this.listenTo(this.view, 'shred:rate', this.rateSubmitted);
        },

        rateSubmitted : function (rateVal) {
            this.model.rate(rateVal);
        },

        saveSuccess : function (comment, battle) {
            this.collection.add(battle.comments[battle.comments.length-1]);
        }
    });
});

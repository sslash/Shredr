/* global require */
define([
'backbone',
'views/modals/baseModalLayout',
'hbs!tmpl/badges/baseBadge',
'hbs!tmpl/badges/theNovice'
],
function (
    Backbone,
    BaseModalLayout,
    tpl,
    theNoviceTpl
){
    'use strict';
    var BaseBadge = BaseModalLayout.extend({

        initialize : function (opts) {
            BaseModalLayout.prototype.initialize.apply(this, arguments);
            switch(opts.tpl) {
                case 'theNovice' : this.tpl = theNoviceTpl; break;
                default : this.tpl = tpl; break;
            }
        },

        onRender : function () {
            BaseModalLayout.prototype.onRender.apply(this, arguments);
            this.ui.body.html(this.tpl(this.model.toJSON()));
            this.ui.body.addClass('le-wrap back-img brd-dark')
            .css('background', 'url(' + this.model.get('background') + ') 50% 50%');
        }
    });

    return BaseBadge;
});

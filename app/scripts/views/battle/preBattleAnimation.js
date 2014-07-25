/* global define */
define([
    'backbone',
    'libs/utils',
    'hbs!tmpl/battle/preBattleAnimation',
    'hbs!tmpl/battle/preCompletedBattleAnimation',
],
function (
    Backbone,
    utils,
    tpl,
    completeTpl
){
'use strict';
var PreBattleAnimation = Backbone.Marionette.ItemView.extend({
    className : 'battle-anim',
    template : tpl,

    getTemplate : function () {
        if ( this.model.get('completed') === true ) {
            return completeTpl;
        } else {
            return tpl;
        }
    },

    onShow : function () {
        // pull in
        setTimeout(function() {
            this.$('.pull-left').addClass('pull-left-after');
            this.$('.pull-right').addClass('pull-right-after');
        }.bind(this).bind(200));

        // pull out and trigger close event in baseController
        setTimeout(function() {
            utils.execTransition(this.$el[0],
                function () {
                    this.$('.pull-left-after').removeClass('pull-left-after');
                    this.$('.pull-right-after').removeClass('pull-right-after');
                }.bind(this),
                function () { this.trigger('preBattleAnimation:done'); }.bind(this)
            );
        }.bind(this), 2000);
    }
});

return PreBattleAnimation;
});

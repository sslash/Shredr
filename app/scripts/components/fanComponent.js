define([
    'backbone',
    'components/component',
    'hbs!tmpl/components/fanComponent',

    ],
    function( Backbone, Component, Tpl ) {
        'use strict';

        var View = Backbone.Marionette.ItemView.extend({
            template : Tpl,

            events : {'click [data-evt="fan"]' : '__fanClicked'},

            __fanClicked : function () {
                if (!this.isFan) {
                    Shredr.user.addFan(this.model.get('_id'));
                    this.listenTo(Shredr.vent, 'user:addFan:success', this.onFaneeAdded);
                }
            },

            onFaneeAdded : function (res) {
                Shredr.updateUser(res);
                this.render();
            },

            setFaneeRelationship : function () {                
                this.isFan = Shredr.user.isFanOf(this.model.get('_id'));
                if ( this.isFan ) {
                    var $btn = this.$('[data-evt="fan"]');
                    $btn.addClass('btn-info')
                    .find('span').removeClass('ion-person-add')
                    .addClass('ion-checkmark-round');
                }
            },

            onRender : function () {
                console.log('rendering!');
                this.setFaneeRelationship();
            }

        });


        return Component.extend({

            initialize: function(options) {
                Component.prototype.initialize.call(this, options);
                this.view = new View({model : this.model});
            }
        });
    });

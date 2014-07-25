define([
    'components/component',
    'models/comment',
    'hbs!tmpl/components/commentListView',
    'hbs!tmpl/components/commentItemView',
    ],
    function( Component, Comment, listTmpl, itemTmpl ) {
        'use strict';

        var ItemView = Backbone.Marionette.ItemView.extend({
            template : itemTmpl
        });

        var ListView = Backbone.Marionette.CompositeView.extend({
            template : listTmpl,
            itemView : ItemView,
            itemViewContainer: '[data-reg="comments"]',

            events : {
                'click [data-evt="add"]' : '__formSubmitted'
            },

            __formSubmitted : function (e) {
                e.preventDefault();
                this.trigger('form:submitted', this.$('textarea').val());
            }
        });

        return Component.extend({

            initialize: function(options) {
                Component.prototype.initialize.call(this, options);
                this.collection = options.collection;
                this.view = new ListView({collection : this.collection});
                this.type = options.type;
                this._id = options._id;
                this.listenTo(this.view, 'form:submitted', this.formSubmitted);
                this.listenTo(Shredr.vent, 'comment:save:success', this.saveSuccess);
            },

            formSubmitted : function (body) {
                if (!body.length) { return; }
                var comment = new Comment({
                    type : this.type,
                    body : body,
                    _id : this._id
                });

                Shredr.baseController.exec(comment, 'save', { event : 'comment:save' });
            },

            saveSuccess : function (comment, res) {
                this.collection.add(comment);
            }
        });
    });

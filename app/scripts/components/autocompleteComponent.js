/**
* Receives an input field and a container to put selected keys
* Stores selected values in an array. Either receives a list of keys,
* or a tagsList type which it uses to fetch a list of keys
*/
define([
    'components/component',
    'models/tagList',
    'autocomplete'
    ],
    function( Component, TagList ) {
        'use strict';

        return Component.extend({
            initialize : function (options) {
                this.$el = options.$el;
                this.$tagsRegion = options.$tagsRegion;
                this.selectedKeys = [];
                this.maxLimit = options.maxLimit || -1;
                this.allowNewKeys = options.allowNewKeys;

                // url
                if ( typeof options.source === 'string' ) {
                    this.keys = []; // fetch now, son.
                    this.tagsList = new TagList({type : options.source });
                    this.tagsList.fetch({success : function() {
                        this.keys = this.tagsList.getTagsByType();
                        this.startAutocomplete();
                    }.bind(this)});
                }
                // array of autocomplete keys
                else {
                    this.keys = options.source;
                    this.startAutocomplete();
                }

            },

            onClose : function () { this.$el.off('keypress'); },

            startAutocomplete : function () {
                this.$el.autocomplete({
                    source : this.keys,
                    select: this.__sourceSelected.bind(this)
                });

                this.$el.on('keypress', this.__keypressTags.bind(this));
            },

            getKeys : function () {
                return this.selectedKeys;
            },

            pushTag : function (value) {
                // only support limits of 1 atm
                if (this.maxLimit === 1) {
                    this.selectedKeys = value;
                    this.$tagsRegion.empty();
                } else {
                    this.selectedKeys.push(value);
                }
                var html = '<span class="small tags">' + value + '</span>';
                this.$tagsRegion.append(html);
                this.$el.val('');
                return false;
            },

            __keypressTags : function (e) {
                if ( e.keyCode === 13 ) {
                    e.preventDefault();
                    if ( this.allowNewKeys ) {
                        var $curr = $(e.currentTarget);
                        this.pushTag($curr.val());
                    }
                }
            },

            __sourceSelected : function(event, ui, val) {
                this.pushTag(ui.item.label);
            }
        });
    });

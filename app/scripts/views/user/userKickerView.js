/* global define */
define([
    'backbone',
    'hbs!tmpl/user/userKickerView'
],
function (
    Backbone,
    Tpl
){
'use strict';
var UserKickerView = Backbone.Marionette.ItemView.extend({
    template : Tpl,
    className : 'container txt-center'
});

return UserKickerView;
});

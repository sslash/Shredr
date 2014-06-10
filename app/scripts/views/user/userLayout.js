/* global define */
define([
    'backbone',
    'hbs!tmpl/user/userLayout'
],
function (
    Backbone,
    Tpl
){
'use strict';
var UserLayout = Backbone.Marionette.Layout.extend({
    template : Tpl,

    onRender : function () {}
});

return UserLayout;
});

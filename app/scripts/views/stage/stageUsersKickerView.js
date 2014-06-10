/* global define */
define([
    'backbone',
    'hbs!tmpl/stage/stageUsersKickerView'
],
function (
    Backbone,
    Tpl
){
'use strict';
var StageShredsKickerView = Backbone.Marionette.ItemView.extend({
    template : Tpl
});

return StageShredsKickerView;
});

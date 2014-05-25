/* global define */
define([
'backbone',
'views/stage/stageShredsKickerView',
'views/stage/stageShredsLayout',
'views/shred/shredLayout',
'models/shred'
],
function (
    Backbone,
    StageShredsKickerView,
    StageShredsLayout,
    ShredLayout,
    Shred
){
    'use strict';
    var ShredsController = Backbone.Marionette.Controller.extend({

        showStageShreds : function () {
            Shredr.baseController.renderMainRegion(StageShredsLayout, {collection : Shredr.collection}, 'shreds');
            Shredr.vent.trigger('shred:stage:render', Shredr.collection);
        },

        showShred : function (id) {
            // create a shredlayout
            // fetch the shred with exec
            Shredr.baseController.exec( new Shred({id : id}), 'fetch',
                {
                    event : 'shred:fetch',
                    success : function (shred, response, options) {
                        Shredr.baseController.renderMainRegion(ShredLayout, {model : shred});
                        Shredr.model = shred;
                    }
                }
            );

        }
    });

    return ShredsController;
});

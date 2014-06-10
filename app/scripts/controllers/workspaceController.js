/* global define */
define([
'backbone',
'views/workspace/workspaceLayout'
],
function (
    Backbone,
    WorkspaceLayout
){
    'use strict';
    var WorkspaceController = Backbone.Marionette.Controller.extend({

        show : function () {
            Shredr.baseController.renderMainRegion(WorkspaceLayout, {});
            // Shredr.vent.trigger('workspace:layout:render');
        }
    });

    return WorkspaceController;
});

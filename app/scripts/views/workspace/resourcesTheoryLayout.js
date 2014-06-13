/* globals $ */
define([
'backbone',
'views/workspace/resourcesScalesLayout',
'hbs!tmpl/workspace/resourcesTheoryPreview',
],
function(
    Backbone,
    ResourcesScalesLayout,
    prevTpl
) {
    'use strict';
    return ResourcesScalesLayout.extend({
        onRender : function () {
            this.ui.preview.html(prevTpl);
            this.ui.preview.fadeIn();
            this.ui.tabs.hide();
        }
    });
});

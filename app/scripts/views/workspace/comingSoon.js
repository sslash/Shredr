/* globals $ */
define([
'backbone',

'views/workspace/scalesTheory',
'hbs!tmpl/workspace/comingSoon'
],
function( Backbone, ScalesTheoryView, tmpl ) {
    'use strict';

    /* Return a Layout class definition */
    return ScalesTheoryView.extend({
        template : tmpl,

        ui : {},

        onRender : function () {},

        serializeData : function () {}
    });
});

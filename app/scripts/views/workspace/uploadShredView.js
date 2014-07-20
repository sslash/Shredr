define([
	'views/modals/uploadModal',
	'components/categoryPickerComponent',
	'hbs!tmpl/workspace/uploadShredHeader',
	'hbs!tmpl/workspace/uploadShredFormFields'
],
function( UploadModal, CategoryPickerComponent, headerTpl, fieldsTpl ) {
	'use strict';

	/* Return a ItemView class definition */
	var UploadShredView = UploadModal.extend({
		renderMoreStuff : function () {
			this.$('[data-reg="head"]').html(headerTpl);
			this.$('[data-reg="left-content"]').append(fieldsTpl);
			this.renderTypes();
		},

		renderTypes : function () {
			this.catPicker = new CategoryPickerComponent({
				categories : ['Lick', 'Tutorial', 'Cover','Gear-review','Other'],
				region : new Backbone.Marionette.Region({el : this.$('[data-reg="cats"]')})
			}).show();
		},

		getCurrentType : function() {
			return this.catPicker.getCurrentType();
		},

		serializeData : function () {
			return {
				title:'The title for this Shredr video',
				desc: 'Add a little description or story, if you\'d like, to this shred. What was the inspiration, what do you play etc.',
				tags : 'Add tags for that describes the shred. For example C-minor scale, tapping, G-minor7 etc.',
				upload: 'Upload With YouTube'
			}
		}
	});

	return UploadShredView;
});

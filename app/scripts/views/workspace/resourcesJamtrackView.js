define([
	'backbone',
	'collections/jamtrackCollection',
	'models/jamtrack',
	'views/modals/uploadJamtrackView',
	'views/globals/playAudioView',
	// 'components/uploadComponent',
	// 'views/modal/okMessageModal',
	// 'hbs!tmpl/workspace/addJamtrack_tmpl',
	// 'hbs!tmpl/workspace/jamtrack_tmpl',
	// 'hbs!tmpl/workspace/jamtrack_detail_tmpl',
	'hbs!tmpl/workspace/resourcesJamtrackView',
],
function(
	Backbone,
	JamtrackCollection,
	Jamtrack,
	UploadJamtrackView,
	PlayAudioView,
	tpl ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: tpl,

		initialize : function () {
			this.collection = new JamtrackCollection();
			this.listenTo(this.collection, 'reset', this.render);
			Shredr.baseController.exec(this.collection, 'fetch', {reset : true});
			this.tags = [];
			this.listenTo(Shredr.vent, 'resources:addBtn:clicked', this.addClicked);
		},

		onClose : function () {
			this.playAudioView.close();
		},

		onRender : function () {
			this.playAudioView = new PlayAudioView();
			this.$el.append(this.playAudioView.render().el);
		},

		events : {
			'click [data-evt="play"]' : '__playClicked'
			// 'click [data-event="add"]' : '__addBtnClicked',
			// 'keypress [data-event="tags-input"]' : '__keypressTags',
			// 'click [data-event="done-btn"]' : '__doneBtnClicked',
			// 'click [data-event="row-sel"]' : '__jamtrackSelected',
			// 'click [data-event="play"]' : '__playClicked'
		},

		addClicked : function (btnTxt) {
			if ( btnTxt !== 'Add Jamtrack') { return; }
			var uploadView = new UploadJamtrackView({
				model : new Jamtrack(),
				classes : 'modal-huge modal-tall form-dark'
			});
			Shredr.baseController.showModal(uploadView);
		},

		serializeData : function () {
			return {
				things : this.collection.toJSON()
			};
		},


		//
		// ui : {
		// 	editableRegion : '[data-region="editable"]'
		// },
		//
		// serializeData : function () {
		// 	return {
		// 		collection : this.collection.toJSON()
		// 	};
		// },
		//
		// onRender : function () {
		// 	if( this.collection.models.length > 0 ) {
		// 		this.model = this.collection.at(0);
		// 		this.viewModel();
		// 	}
		// },
		//
		// // TODO: move autocomplete into separate component
		// pushTag : function (ui, input, value) {
		// 	this.tags.push(value);
		// 	var html = '<span class="font-xsmall tags">' + value + '</span>';
		// 	ui.append(html);
		// 	input.val('');
		// 	return false;
		// },
		//
		// jamtrackSaveSuccess : function(jamtrack) {
		// 	this.listenToOnce(this.uploadComponent, 'file:upload:success', this.fileUploaded);
		// 	this.uploadComponent.trigger('file:upload', this.model.getUploadUrl());
		// },
		//
		// // show list view and show ok message modal
		// fileUploaded : function (res) {
		// 	Shredr.vent.trigger('nav:logo:rotate');
		// 	this.collection.add(this.model);
		// 	this.viewModel();
		// 	var modal = new MsgModalView({
		// 		message : 'Jamtrack was uploaded successfully!'
		// 	});
		// 	Shredr.vent.trigger('modal:show', modal);
		// },
		//
		// viewModel : function () {
		// 	this.model.fetch({
		// 		success : function () {
		// 			this.renderRightSideView(false, this.model.toJSON());
		// 		}.bind(this)
		// 	});
		// },
		//
		// renderRightSideView : function (addView, model) {
		// 	this.ui.editableRegion.fadeOut('fast', function () {
		// 		this.ui.editableRegion.children().remove();
		//
		// 		if ( addView ) {
		// 			// create a new model
		// 			this.model = new Jamtrack();
		// 			this.ui.editableRegion.append(addJamtrackTmpl());
		// 			// render autocomplete
		// 			this.ui.tagsArea = this.$('[data-region="tags"]');
		// 			this.ui.tags = this.$('#tags');
		// 			this.ui.tags.autocomplete({
		// 				source : this.autocompleteTags,
		// 				select: this.__tagSelected.bind(this)
		// 			});
		//
		// 			// render upload component
		// 			this.uploadComponent = new UploadComponent({
		// 				fileUpload : true,
		// 				fileDrop : true,
		// 				el : '[data-region="upload"]'
		// 			});
		// 			this.uploadComponent.show();
		// 		} else {
		// 			this.ui.editableRegion.append(detailTmpl({
		// 				jamtrack : model
		// 			}));
		// 		}
		//
		// 		this.ui.editableRegion.fadeIn('fast');
		// 	}.bind(this));
		// },
		//
		// __doneBtnClicked : function (e) {
		// 	e.preventDefault();
		// 	if (!this.uploadComponent.fileAdded()) {return false;}
		// 	this.model.set({
		// 		title : this.$('#title').val(),
		// 		description : this.$('#description').val(),
		// 		tags : this.tags
		// 	});
		// 	this.model.save({}, {
		// 		success : this.jamtrackSaveSuccess.bind(this)
		// 	});
		// },
		//
		// __jamtrackSelected : function (e) {
		// 	var index = $(e.currentTarget).attr('data-index');
		// 	this.model = this.collection.at(parseInt(index, 10));
		// 	this.viewModel();
		// },
		//
		//
		// __addBtnClicked : function (addView) {
		// 	this.renderRightSideView(true);
		// },
		//
		// __keypressTags : function (e) {
		// 	if ( e.keyCode === 13 ) {
		// 		var $curr = $(e.currentTarget);
		// 		this.pushTag(this.ui.tagsArea, this.ui.tags, $curr.val());
		// 	}
		// },
		//
		// __tagSelected : function(event, ui, val) {
		// 	this.pushTag(this.ui.tagsArea, this.ui.tags, ui.item.label);
		// },
		//
		__playClicked : function (e) {
			var model = this.collection.get($(e.currentTarget).attr('data-mod'));
			this.playAudioView.playJamtrack(model);
		}
		//
		// autocompleteTags : [
		// 	'C-minor',
		// 	'Indie-rock',
		// 	'A-major',
		// 	'C-harmonics',
		// 	'C-major'
		// ]
	});

});

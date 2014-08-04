define([
    'components/component',
    'hbs!tmpl/components/uploadComponent',
    'autocomplete',
    'fileupload'
    ],
    function( Component, tmpl ) {
        'use strict';

        var View = Backbone.Marionette.ItemView.extend({
            template : tmpl,

            initialize : function (opts) {
                this.extraClasses = opts.classes;
                this.url = opts.url;
                // this.listenTo(this, 'file:changed:success', this.createThumb);
            },

            initFileupload : function () {
                var data = {
                    battlee : this.model.get('_id'),
                    battler : Shredr.user.get('_id'),
                    jamtrackId : '53d20eb4bd50f187d339b524',
                    rounds : 3,
                    dayLimit : 1,
                    statemenet : 'Hello statemenet yolo'
                };

                var dat = this;
                this.$('#fileupload').fileupload({
                    dataType: 'json',
                    url : this.url,
                    formData: data,
                    add: function (e, data) {
                        data.context = $('<button class="btn btn-niz"/>').text('Upload')
                        .appendTo(dat.$('form'))
                        .click(function () {
                            data.context = $('<p/>').text('Uploading...').replaceAll($(this));
                            data.submit();
                        });
                    },
                    done: function (e, data) {
                        console.log('holaer')
                        if( !data.result.files ) return;
                        $.each(data.result.files, function (index, file) {
                            $('<p/>').text(file.name).appendTo(document.body);
                        });
                    },
                    progressall: function (e, data) {
                        console.log('swag')
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .bar').css(
                            'width',
                            progress + '%'
                        );
                    }
                });
            },

            // events : {
            //     'change #file-upload' : '__fileChanged'
            // },

            createThumb : function(file) {
                var reader = new FileReader();
                var that = this;

                // Closure to capture the file information.
                // creates an html string containing the thumbnail view
                // and appends it to the DOM instead of the droppable section
                reader.onload = (function(theFile) {
                    return function(e) {
                        var thumbHtml;
                        if ( file.type.match('video.*') ) {
                            thumbHtml = '<video class="video-thumb" data-model="upload-vid" controls>' +
                            '<source src="' + e.target.result + '"</source></video>';

                        } else if (file.type.match('audio.*')) {
                            return;

                        } else if (file.type.match('image.*')) {
                            thumbHtml = '<img class="img-md brd" data-model="upload-vid" src=' + e.target.result + '>';
                        }

                        that.renderThumb(thumbHtml, e);
                    };

                })(file);

                // Read in the file as a data URL.
                reader.readAsDataURL(file);
            },

            renderThumb : function (thumbHtml, e) {
                var $container = this.$('[data-reg="droppable"]');
                $container.children().remove();
                $container.removeClass('upload-box');

                $container.append(thumbHtml);
                this.trigger('file:changed:thumb:created', e.target.result);
            },

            onRender : function () {
              this.$('[data-reg="droppable"]').addClass(this.extraClasses);
            },

            __fileChanged : function (e) {
                this.trigger('file:changed', e);
            }
        });

        return Component.extend({

            initialize: function(opts) {
                opts = opts || {};
                Component.prototype.initialize.call(this, opts);
                this.view = new View({
                    model : opts.model,
                    url : opts.url,
                    classes : opts.classes
                });
                // this.listenTo(this.view, 'file:changed', this.__fileUploadBtnClicked);
                // this.listenTo(this.region, 'show', this.initDropListeners);
                // this.listenTo(this, 'file:upload', this.upload);
                // this.listenTo(this.view, 'file:changed:thumb:created', this.thumbCreated);
            },

            __fileUploadBtnClicked : function (e) {
                var files = e.target.files;
                if (files.length > 0) {
                    this.file = files[0];
                }

                this.view.trigger('file:changed:success', this.file);
            },

            thumbCreated : function (src) {
                this.trigger('file:changed:thumb:created', src);
            },

            initDropListeners : function() {
                var dropZone = document.getElementById('file-drop');
                dropZone.addEventListener('dragover', this.__fileDragover, false);
                dropZone.addEventListener('dragleave', this.__fileLeave, false);
                dropZone.addEventListener('dragenter', this.__fileEnter, false);
                dropZone.addEventListener('drop', this.__fileDropped.bind(this), false);
            },

            __fileDragover : function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            },

            __fileLeave : function(evt) {
                var $target = $(evt.currentTarget);
                $target.removeClass('highlight')
            },

            __fileEnter : function(evt) {
                var $target = $(evt.currentTarget);
                if ( !$target.hasClass('highlight')) {
                    $target.addClass('highlight')
                }
            },

            __fileDropped : function(evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var files = evt.dataTransfer.files; // FileList object.
                if ( files.length < 1 ) { return false; }
                this.file = files[0];
                this.view.trigger('file:changed:success', this.file);
            },

            // API

            show : function () {
                this.region.show(this.view);
                this.view.initFileupload();
                return this;
            },

            fileAdded : function () {
                return !!this.file;
            },

            upload : function (url) {
                var formData = new FormData();
                formData.append('file', this.file );
                var that = this;

                $.ajax({
                    url : url,
                    type : 'POST',
                    // Form data
                    data : formData,
                    xhr : function() { // custom xhr
                        return $.ajaxSettings.xhr();
                    },
                    success : function(res) {
                        console.log('done sending!');
                        that.trigger('file:upload:success', res);
                    },
                    error : function(res) {
                        console.log('error occured: ' + res);
                    },
                    //Options to tell JQuery not to process data or worry about content-type
                    cache : false,
                    contentType : false,
                    processData : false
                });
            }
        });
    });

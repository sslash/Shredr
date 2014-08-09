define([
    'components/component',
    'hbs!tmpl/components/uploadComponent',
    'autocomplete',
    'fileupload',
    'jquery.fileupload-video'
    ],
    function( Component, tmpl ) {
        'use strict';

        var View = Backbone.Marionette.ItemView.extend({
            template : tmpl,

            initialize : function (opts) {
                this.extraClasses = opts.classes;
                this.addFn = opts.addFn;
                // this.listenTo(this, 'file:changed:success', this.createThumb);
            },

            initFileupload : function () {
                // var data = {
                //     battlee : this.model.get('_id'),
                //     battler : Shredr.user.get('_id'),
                //     jamtrackId : '53d20eb4bd50f187d339b524',
                //     rounds : 3,
                //     dayLimit : 1,
                //     statemenet : 'Hello statemenet yolo'
                // };

                var dat = this;

        // var url = window.location.hostname + '/uploads',

        // var uploadButton = $('<button/>')
        //     .addClass('btn btn-primary')
        //     .prop('disabled', true)
        //     .text('Processing...')
        //     .on('click', function () {
        //         var $this = $(this),
        //             data = $this.data();
        //         $this
        //             .off('click')
        //             .text('Abort')
        //             .on('click', function () {
        //                 $this.remove();
        //                 data.abort();
        //             });
        //         data.submit().always(function () {
        //             $this.remove();
        //         });
        //     });
            this.$('#fileupload').fileupload({
                url: this.model.url(),
                dataType: 'json',
                autoUpload: false,
                //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize: 5000000, // 5 MB
                // Enable image resizing, except for Android and Opera,
                // which actually support image resizing, but fail to
                // send Blob objects via XHR requests:
                disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
                previewMaxWidth: 100,
                previewMaxHeight: 100,
                previewCrop: true
            })
            .on('fileuploadadd', this.addFn)
            .on('fileuploadprocessalways', function (e, data) {
                var index = data.index,
                file = data.files[index];
                if (file.preview) {
                    dat.trigger('file:changed:thumb:created', file.preview.src);
                }
                if (file.error) {
                    node
                    .append('<br>')
                    .append($('<span class="text-danger"/>').text(file.error));
                }
                // if (index + 1 === data.files.length) {
                //     data.context.find('button')
                //     .text('Upload')
                //     .prop('disabled', !!data.files.error);
                // }
            }).on('fileuploadprogressall', function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log('espa3 ' + progress + '%');
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            }).on('fileuploaddone', function (e, data) {
                console.log('espa43')
                dat.model.trigger('sync');
                // $.each(data.result.files, function (index, file) {
                //     if (file.url) {
                //         var link = $('<a>')
                //         .attr('target', '_blank')
                //         .prop('href', file.url);
                //         $(data.context.children()[index])
                //         .wrap(link);
                //     } else if (file.error) {
                //         var error = $('<span class="text-danger"/>').text(file.error);
                //         $(data.context.children()[index])
                //         .append('<br>')
                //         .append(error);
                //     }
                // });
            }).on('fileuploadfail', function (e, data) {
                $.each(data.files, function (index, file) {
                    var error = $('<span class="text-danger"/>').text('File upload failed.');
                    $(data.context.children()[index])
                    .append('<br>')
                    .append(error);
                });
            }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');

            },

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
            },

            onClose : function () {
                this.$('#fileupload').fileupload('destroy');
            }
        });

        return Component.extend({

            initialize: function(opts) {
                opts = opts || {};
                Component.prototype.initialize.call(this, opts);
                this.view = new View({
                    model : opts.model,
                    classes : opts.classes,
                    addFn : opts.addFn
                });
                // this.listenTo(this.view, 'file:changed', this.__fileUploadBtnClicked);
                // this.listenTo(this.region, 'show', this.initDropListeners);
                // this.listenTo(this, 'file:upload', this.upload);
                this.listenTo(this.view, 'file:changed:thumb:created', this.thumbCreated);
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

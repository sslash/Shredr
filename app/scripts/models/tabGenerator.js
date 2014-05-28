  // TODO: possible bug on: when a note is entered
// and some combination of key up/down/left/right
// is pressed, it stores wrong data
 define([
  'underscore',
  'jquery',
  'libs/tabPlayer'
  ],
  function(_,$, tabPlayer) {

	var TabGenerator = function(options) {

		this.init = function() {
            this.cursorIdSel = '#tabs-cursor';
            this.tabInput = options.input || this.find(this.cursorIdSel);

            if (!this.tabInput){
                throw "Could not find tab input";
            }
            this.currentRow = 1;
            this.appendRowFn = options.appendRowFn || function () {};
            this.paintedRows = options.paintedRows || 1;
            this.rowGap = options.drawMultiRow || false;
            this.notes = that.options.notes || $('.notes');
            this.bendBtn = that.options.bendBtn || $('#bendBtn');
            this.tabs = that.options.tabs || [];
            this.tabsIndex = 0;			/* current Y */
            this.tabsStringIndex = 0;	/* current string */
            this.intervall = 4;			/* current rest */
            this.noteLength = 1;			/* current rest, TODO: switch intervall to this */
            this.bars = 0;				/* current bar / space */
            this.noteDiv = "#crotchet";	/* Current interval image */
            this.note_color = "white";
            this.tabInputClone = this.tabInput.clone();

            // Listeners
            this.tabInput.on('keyup', $.proxy(that.__keypressed, that));
            this.notes.on('click', $.proxy(that.__noteChangeClicked, that));
            this.bendBtn.on('click', $.proxy(that.__bendBtnClicked, that));
            this.on('click', this.__tabsAreaClicked.bind(this));

            if ( !!this.tabs.length ) {
                this.waitAndRenderExistingTabs();
            }
		};

        this.getTabInput = function() {
            var fret = this.tabInput.val();
            fret = parseInt(fret, 10);
            fret = isNaN(fret) ? -1 : fret;
            return fret;
        };

		this.getTabs = function() {
            this.tabs.length = 0;
            var tabs = this.tabs;
            $('*[data-index]').filter(function(i, el) {return !!el.value })
            .map(function(i,el) {
                //if ( !tabs[el.])
                var $el = $(el);
                var is = $el.attr('data-index').split(',');
                var index = is[0],
                    string = is[1];
                var rest = $el.attr('data-interval');

                if ( !tabs[index] ) {
                    tabs[index] = {};
                    tabs[index].rest = rest;
                    tabs[index].stringz = {};
                }

                tabs[index].stringz[string] = el.value;
            });

			return {
				tempo: "125",
				// tabs: this.tabs
                tabs : tabs
			};
		};

        this.playTabs = function () {
            tabPlayer.playTabs(this.getTabs());
        };

		this.getNextMoveWidth = function() {
			return this.width() / (this.intervall*4);
		};

		// this.createNoteObject = function(fret,tabsIndex,tabsStringIndex) {
		// 	var parsedFret = parseInt(fret, 10);
		// 	parsedFret = isNaN(parsedFret) ? -1 : parsedFret;
        //
		// 	if ( !this.tabs[tabsIndex] ){
		// 		this.tabs[tabsIndex] = {};
		// 	}
        //
		// 	this.tabs[tabsIndex].rest = this.intervall;
		// 	if (!this.tabs[tabsIndex].stringz) {
		// 		this.tabs[tabsIndex].stringz = {};
		// 	}
        //
		// 	// add the fret at the given string
		// 	this.tabs[tabsIndex].stringz[tabsStringIndex] = parsedFret;
        //     console.log('t: ' + JSON.stringify(this.tabs))
		// 	return parsedFret;
		// };

		this.moveBarForward = function() {
			var fret = this.getTabInput();
			this.tabsIndex ++;
			this.bars += 1/this.intervall;

			// at the end
			if ( this.bars !== 4){
				var intervallWidthPx = this.getNextMoveWidth();
				this.tabInput.css({ left: "+=" + intervallWidthPx + "px"}, 1);
			}
			return fret;
		};

		this.moveBarBackwards = function() {
            if ( this.tabsIndex === 0 ) { return ''; }
            var fret = this.getTabInput();
            //fret = this.createNoteObject(fret, this.tabsIndex, this.tabsStringIndex);

			var intervallWidthPx = this.getNextMoveWidth();
			this.tabInput.css({ left: "-=" + intervallWidthPx + "px"}, 1);
			this.tabsIndex --;
			this.bars -= 1/this.intervall;
			return fret;
		};

		this.moveBarDownOrUpwards = function(dir) {

            /* Height between strings. - 2: duno why */
			var height = Math.floor(this.height() / 6) - 2;

            if (dir === 'up'){
                // dont move on edge cases
                if ( this.tabsStringIndex === 0 ) { return ''; }

                this.tabInput.css({ top: "-=" + height}, 1);
                this.tabsStringIndex --;
            } else {
                // dont move on edge cases
                if ( this.tabsStringIndex === 5 ) { return ''; }

                this.tabInput.css({ top: "+=" + height}, 1);
                this.tabsStringIndex ++;
            }

			return this.getTabInput();
		};

        this.__tabsAreaClicked = function (e) {
            this.tabInput.focus();
        };

		this.__bendBtnClicked = function(e) {
			if (!this.currDecorators){
				this.currDecorators = {};
			}
			this.currDecorators.bend = true;
		};

		this.__keypressed = function(e) {
			var key = e.keyCode;
			var fret = "";
            var tabIndex = this.tabsIndex, stringIndex = this.tabsStringIndex;
            var inputStartPos = this.tabInput.position();
            switch(key){
                case 13: // enter
                    fret = this.moveBarForward();
                    break;

                case 39: // right
                    fret = this.moveBarForward();
                    break;

                case 37: // left
                    fret = this.moveBarBackwards();
                    break;

                case 38: // up
                    fret = this.moveBarDownOrUpwards('up');
                    break;

                case 40: // down
                    fret = this.moveBarDownOrUpwards('down');
                    break;
                default:
                    return;
            }
			if ( fret === -1 || fret === '-1' ) { fret = 'r'; }


            // if current pos dont exist, draw number.
            var sel = '[data-index="' + tabIndex + ',' + stringIndex + '"]';
            var $existingInput = $(sel);
             var $value = $("<input type='text' class='tabs-cursor note' " +
                 "data-index='" + tabIndex + "," + stringIndex + "' style='color:"
                 + this.note_color + ";' value='" + fret + "' autocomplete='off' " +
                 "maxlength='2' data-interval='" + this.noteLength + "'>");
             $value.offset(inputStartPos);
             this.tabInput.before($value);
             this.tabInput.val("");

            // if new pos exists, capture it
            sel = '[data-index="' + this.tabsIndex + ',' + this.tabsStringIndex + '"]';
            $existingInput = $(sel);
            if ( $existingInput.length > 0 ) {
                this.tabInput.remove();
                this.tabInput = $existingInput;
                this.tabInput.focus();
                this.tabInput.removeClass('note');
                this.tabInput.attr('id', this.cursorIdSel);
                this.tabInput.on('keyup', this.__keypressed.bind(this));
            }

			if (this.currDecorators){
				var img = $("<img src='img/notes/arrow_white.png' class='bendImg'>");
				img.offset($(label).position());
				label.after(img);
				this.currDecorators = null;
			}

			if ( this.bars === 4 ) {
				this.clearAndIterateBars();
			}
		};

        this.waitUntilLoaded = function (cb) {
            loop.apply(this);

            function loop () {
                if ( this.width() === 0 ) {
                    setTimeout(loop.bind(this), 30);
                } else {
                    cb.call(this);
                }
            }
        },

        this.waitAndRenderExistingTabs = function () {
            this.waitUntilLoaded(this.renderExisitingTabs);
        },

        this.renderExisitingTabs = function () {
            var prevLeft = 0,
				topOffset = -18;
            this.barsIndex = 0;
			this.tabswidth = this.width() - 24; // 24 is left and right margin
			this.tabsHeight = (this.height()/6 -2.5); // img is set to 85px. -2 just works...

			var prevRest = this.tabs[0].rest * 2; // Start from 32 px left margin

			for (var barsCounter = 0; (this.barsIndex < this.tabs.length); this.barsIndex++ ){
				var tab = this.tabs[this.barsIndex];
				barsCounter += 1/tab.rest;

				prevLeft = Math.round(( this.tabswidth / (prevRest*4)) + prevLeft);
				prevRest = tab.rest;

				Object.keys(tab.stringz).forEach(function(le_string) {
					//var le_string = Object.keys(obj)[0];
					//var label = $("<label class='note' title='" +tab.rest + "'>" + obj[le_string] + "</label>");
					var label = $("<label class='note' title='" +tab.rest + "'>" + tab.stringz[le_string] + "</label>");

					// first 9 = top offset. Multiplier 10 = offset between lines
					var top = this.tabsHeight +10 + (le_string*this.tabsHeight) + topOffset;
					label.css({
						'top': (top + 'px'),
						'left': (prevLeft + "px")
					});
					this.append(label);
				}.bind(this));

				if( barsCounter % 4 === 0 ) {
					//this.appendNoteImg();
					prevLeft = 0;
					// topOffset += rect.height -18; // -18 just works...
                    this.clearAndIterateBars()
				}
			}
        };

  // TODO: change intervall numbers to equal noteLength, and remove noteLength!
		this.__noteChangeClicked = function(e) {
			var divId = e.currentTarget.id;
			switch (true) {
				case /^semibreve$/.test(divId):
					this.intervall = 1;
          this.noteLength = 4;
					this.note_color = "red";
					break;
				case /^minim$/.test(divId):
					this.intervall = 2;
          this.noteLength = 2;
					this.note_color = "blue";
					break;
				case /^crotchet$/.test(divId):
					this.intervall = 4;
          this.noteLength = 1;
					this.note_color = "white";
					break;
				case /^quaver$/.test(divId):
					this.intervall = 8;
          this.noteLength = 0.5;
					this.note_color = "yellow";
					break;
				case /^semiquaver$/.test(divId):
					this.intervall = 16;
          this.noteLength = 0.25;
					this.note_color = "purple";
					break;
				case /^demisemiquaver$/.test(divId):
					this.intervall = 32;
          this.noteLength = 0.125;
					this.note_color = "green";
					break;
				case /^hemidemisemiquaver$/.test(divId):
					this.intervall = 64;
          this.noteLength = 0.0625;
					this.note_color = "brown";
					break;
			}
			$(this.noteDiv).removeClass("selected");
			this.noteDiv = "#" + divId;
			$(this.noteDiv).addClass("selected");
            this.tabInput.focus();
		};

		this.clearAndIterateBars = function() {
            // vertical UI
            if ( this.rowGap ) {
                this.currentRow ++;
                if ( this.currentRow > this.paintedRows ) {
                    this.appendNewRow();
                }
                //var oldTop = this.tabInput.css('top').replace(/px$/, '');
                // oldTop = parseInt(oldTop, 10);
                // var top = this.height() + oldTop + this.rowGap + 'px';
                // this.tabInput.css('top', top);

            // horizontal UI
            } else {
                $('.note').remove();
            }

			this.paintTabInputField();
			this.bars = 0;
		};

        this.appendNewRow = function () {
            this.appendRowFn();
        };

		this.paintTabInputField = function() {
			var intervallWidthPx = this.getNextMoveWidth();
			// Set tab-input start location
			this.tabInput.css('left', ((intervallWidthPx / 2) + "px"));
		};

		var that = this;
		this.options = options;
		this.init();
		return this;
	};


	$.fn.tabGenerator = TabGenerator;

    return $;
});

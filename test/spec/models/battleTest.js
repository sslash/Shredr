(function() {
    'use strict';

    var root = this;

    root.define([ 'models/battle'], function(Battle) {

        describe('Battle', function () {

            it('should exist', function () {
                expect( Battle ).to.exist;
            });
        });

    });

}).call( this );

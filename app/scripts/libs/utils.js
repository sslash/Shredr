define([], function() {

    function getTransitionEvent () {
        var el = document.createElement('fakeelement');
        var t;
        var transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd',
          'MsTransition':'msTransitionEnd'
      };

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    return {
        execTransition : function (el, cbBefore, cbAfter, ctx) {
            var transDone = function () {
                el.removeEventListener(transDone);
                cbAfter();
            }.bind(ctx);

            cbBefore.apply(ctx);

            var transitionEvent = getTransitionEvent();
            if ( transitionEvent ) {
                el.addEventListener( transitionEvent, transDone );
            } else {
                cbAfter.apply(ctx);
            }
        },

        execFadeOutIn : function (el, inHtml, cb) {
            el.fadeOut('fast', function() {
                el.html(inHtml);
                el.fadeIn('fast', function() {
                    if ( cb ) { cb(); }
                });
            })
        }
    };
});

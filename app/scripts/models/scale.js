define([
    'backbone'
],
function( Backbone ) {
    'use strict';

    /* Return a model class definition */
    return Backbone.Model.extend({
        urlRoot : 'api/scales/',
        initialize: function() {
            if ( this.get('_id') ) {
                this.id = this.get('_id');
            }
        },

        defaults: {
            title : '',
            description : '',
            "tabs" : {
                "tempo" : "125",
                "tabs" : [
                {
                	// this is the correct data structure
                	"rest" : 4,
                	"stringz" : {
                		"0" : 9,
                		"1" : 14,
                		"2" : 14,
                		"3" : 12,
                		"4" : 14,
                		"5" : 14,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"0" : 12,
                		"1" : 14,
                		"2" : 14
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"0" : 15,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"2" : 11
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"5" : 1,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"4" : 10,
                	}
                },
                {
                	// this is the correct data structure
                	"rest" : 4,
                	"stringz" : {
                		"0" : 12,
                		"1" : 14,
                		"2" : 14,
                		"3" : 12,
                		"4" : 14,
                		"5" : 14,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"0" : 12,
                		"1" : 14,
                		"2" : 14
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"0" : 15,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"2" : 11
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"5" : 1,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"4" : 10,
                	}
                },
                {
                	// this is the correct data structure
                	"rest" : 4,
                	"stringz" : {
                		"0" : 12,
                		"1" : 14,
                		"2" : 14,
                		"3" : 12,
                		"4" : 14,
                		"5" : 14,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"0" : 12,
                		"1" : 14,
                		"2" : 14
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"0" : 15,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"2" : 11
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"5" : 1,
                	}
                },
                {
                	"rest" : 4,
                	"stringz" : {
                		"4" : 10,
                	}
                }
                ],
            },
            tabsKey : 'C'
        }
    });
});

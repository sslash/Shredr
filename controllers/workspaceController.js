var mongoose = require('mongoose'),
    BaseController = require("./baseController");

module.exports = BaseController.extend({

    show : function (req,res) {
        module.exports.render(req, res, {
            tpl : 'workspace/workspaceLayout'
        });
    }
});

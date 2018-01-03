//Entry point for the app
//Require everything needed, all will be public

jQuery = require('jquery');
Backbone = require('backbone');
Backbone.$ = jQuery;

Handlebars = require('handlebars');
_ = require('underscore');
d3 = require('d3');
d3_save_svg = require('d3-save-svg');

//Require the App so that it could called
DesPlot = require('./js/main');

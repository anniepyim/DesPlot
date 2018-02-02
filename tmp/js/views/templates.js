var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["Templates"] = this["Templates"] || {};

this["Templates"]["DesPlot"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"scatterplot\" class=\"col-md-9\"></div>\n\n<div id=\"barchart\" class=\"col-md-3\"></div>\n\n<div id=\"scheatmap\" class=\"col-md-12\"></div>\n<!--\n<div class=\"col-md-12\">\n    Log2FC greater than: <input type=\"text\" id=\"up\" size=\"4\">\n    Log2FC smaller than: <input type=\"text\" id=\"down\" size=\"4\">\n    <button class=\"btn btn-default\"  onclick=\"saveTextAsFile()\" style=\"float: right;\"><strong>Download Data</strong></button>\n</div>\n-->";
},"useData":true});

this["Templates"]["DesPlot_tooltip"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "<br>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id = \"wrapUp\">\n	<div class=\"col-md-12 title\">"
    + alias4(((helper = (helper = helpers.gene || (depth0 != null ? depth0.gene : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene","hash":{},"data":data}) : helper)))
    + "</div>\n\n	<div class=\"col-md-12 process\">"
    + alias4(((helper = (helper = helpers.process || (depth0 != null ? depth0.process : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"process","hash":{},"data":data}) : helper)))
    + "</div>\n\n	<div class=\"col-md-12 function\">"
    + alias4(((helper = (helper = helpers.gene_function || (depth0 != null ? depth0.gene_function : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_function","hash":{},"data":data}) : helper)))
    + "</div>\n\n	<div class=\"col-md-6 miniTitle\">\n	    Log2 FC\n	</div>\n	                \n	<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers.log2 || (depth0 != null ? depth0.log2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"log2","hash":{},"data":data}) : helper)))
    + "</div>\n\n	<div class=\"col-md-6 miniTitle\">\n	    Pvalue\n	</div>\n	                \n	<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers.pvalue || (depth0 != null ? depth0.pvalue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pvalue","hash":{},"data":data}) : helper)))
    + "</div>\n\n	<div class=\"col-md-12 miniTitle\">\n	    mutation\n	</div>\n</div>                \n<div class=\"col-md-12 mutation\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.mutation : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>\n";
},"useData":true});

if (typeof exports === 'object' && exports) {module.exports = this["Templates"];}
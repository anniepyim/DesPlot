var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["Templates"] = this["Templates"] || {};

this["Templates"]["DesPlot"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"scatterplot\" class=\"col-md-9\"></div>\n\n<div id=\"barchart\" class=\"col-md-3\"></div>\n\n<div id=\"scheatmap\" class=\"col-md-12\"></div>\n<!--\n<div class=\"col-md-12\">\n    Log2FC greater than: <input type=\"text\" id=\"up\" size=\"4\">\n    Log2FC smaller than: <input type=\"text\" id=\"down\" size=\"4\">\n    <button class=\"btn btn-default\"  onclick=\"saveTextAsFile()\" style=\"float: right;\"><strong>Download Data</strong></button>\n</div>\n-->";
},"useData":true});

this["Templates"]["DesPlot_tooltip"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"row infos\">\n<div class=\"col-md-5 miniTitle greyish\">\n    chr\n</div>                \n<div class=\"col-md-7 info\">"
    + container.escapeExpression(((helper = (helper = helpers.chr || (depth0 != null ? depth0.chr : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"chr","hash":{},"data":data}) : helper)))
    + "</div>\n</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"row infos\">\n<div class=\"col-md-5 miniTitle greyish\">\n    "
    + alias4(((helper = (helper = helpers.geneID_a1_name || (depth0 != null ? depth0.geneID_a1_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"geneID_a1_name","hash":{},"data":data}) : helper)))
    + "\n</div>                \n<div class=\"col-md-7 info\">"
    + alias4(((helper = (helper = helpers.geneID_a1 || (depth0 != null ? depth0.geneID_a1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"geneID_a1","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"row infos\">\n<div class=\"col-md-5 miniTitle greyish\">\n    "
    + alias4(((helper = (helper = helpers.geneID_a2_name || (depth0 != null ? depth0.geneID_a2_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"geneID_a2_name","hash":{},"data":data}) : helper)))
    + "\n</div>                \n<div class=\"col-md-7 info\">"
    + alias4(((helper = (helper = helpers.geneID_a2 || (depth0 != null ? depth0.geneID_a2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"geneID_a2","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"row infos\">\n\n<div class=\"col-md-5 miniTitle greyish\">\n    "
    + alias4(((helper = (helper = helpers.geneID_a3_name || (depth0 != null ? depth0.geneID_a3_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"geneID_a3_name","hash":{},"data":data}) : helper)))
    + "\n</div>                \n<div class=\"col-md-7 info\">"
    + alias4(((helper = (helper = helpers.geneID_a3 || (depth0 != null ? depth0.geneID_a3 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"geneID_a3","hash":{},"data":data}) : helper)))
    + "</div>\n</div>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "    "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "<br>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"col-md-12 title\">"
    + alias4(((helper = (helper = helpers.geneID || (depth0 != null ? depth0.geneID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"geneID","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 gene_name greyish\">("
    + alias4(((helper = (helper = helpers.gene_name || (depth0 != null ? depth0.gene_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_name","hash":{},"data":data}) : helper)))
    + ")</div>\n\n<div class=\"col-md-12 process\">"
    + alias4(((helper = (helper = helpers.process || (depth0 != null ? depth0.process : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"process","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div class=\"col-md-12 function greyish\">"
    + alias4(((helper = (helper = helpers.gene_function || (depth0 != null ? depth0.gene_function : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_function","hash":{},"data":data}) : helper)))
    + "</div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.chr : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.geneID_a1 : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.geneID_a2 : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.geneID_a3 : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n<div class=\"col-md-12 miniTitle sample\">"
    + alias4(((helper = (helper = helpers.sampleID || (depth0 != null ? depth0.sampleID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sampleID","hash":{},"data":data}) : helper)))
    + "</div>\n\n<div id=\"wrapUp\">  \n\n<div class=\"row infos\">\n<div class=\"col-md-6 miniTitle\">\n    Log2 FC\n</div>\n   \n<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers.log2 || (depth0 != null ? depth0.log2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"log2","hash":{},"data":data}) : helper)))
    + "</div>\n</div>\n\n<div class=\"row infos\">\n<div class=\"col-md-6 miniTitle\">\n    Pvalue\n</div>\n                \n<div class=\"col-md-6 info\">"
    + alias4(((helper = (helper = helpers.pvalue || (depth0 != null ? depth0.pvalue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pvalue","hash":{},"data":data}) : helper)))
    + "</div>\n</div>\n\n</div>\n<div class=\"col-md-12 miniTitle\">\n    mutation\n</div>\n               \n<div class=\"col-md-12 mutation\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.mutation : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>\n";
},"useData":true});

if (typeof exports === 'object' && exports) {module.exports = this["Templates"];}
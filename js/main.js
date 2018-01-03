var DesPlot = {};
//var colorbrewer = require('colorbrewer');
var BC = require('./svgs/barchart.js');
var mainframe = require('./views/mainframe.js');
mainframe = new mainframe();

DesPlot.init = function(json,parameter,svg,pyScript,onError){ 
    
    if (jQuery.isEmptyObject(json)) onError(new Error('Please add samples!'));
    if (json.length > 6) onError(new Error('No more than 6 samples!'));
    
    var sccolor = ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"];

    var bccolor = d3.scale.ordinal()
    .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#f781bf", "#fbb4ae", "#b3cde3", "#ffed6f", "#decbe4", "#fed9a6"]);
    
    jQuery.ajax({
        url: pyScript, 
        data: parameter,
        type: "POST",
        dataType: "json",    
        success: function (data) {
            
            var el = document.getElementById( svg );
            while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
            mainframe.setElement('#'+svg).renderDesPlot();
            
            BC.init(data,sccolor,bccolor);


            d3.select('#btnSave').on('click', function() {
              var configsc = {
                filename: 'scatterplot',
              };
              var configbc = {
                filename: 'barchart',
              };
              var confighm = {
                filename: 'heatmap',
              };
              d3_save_svg.save(d3.select('#scatterplotsvg').node(), configsc);
              d3_save_svg.save(d3.select('#barchartsvg').node(), configbc);
              d3_save_svg.save(d3.select('#heatmapsvg').node(), confighm);
            });

        },
        error: function(e){
            onError(e);
        }
    });
    
};

//Export as App so it could be App.init could be called
module.exports = DesPlot;
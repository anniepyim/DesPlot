var DesPlot = {};
//var colorbrewer = require('colorbrewer');
var BC = require('./svgs/barchart.js');
var mainframe = require('./views/mainframe.js');
mainframe = new mainframe();

DesPlot.init = function(svg,onError){ 
    
    // if (jQuery.isEmptyObject(json)) onError(new Error('Please add samples!'));
    // if (json.length > 6) onError(new Error('No more than 6 samples!'));
    
    var sccolor = ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"];

    var bccolor = d3.scale.ordinal()
    .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#f781bf", "#fbb4ae", "#b3cde3", "#ffed6f", "#decbe4", "#fed9a6"]);
    
    //If data for querying SQL database exist, the following code is replaced by an ajax call that calls a python script, which connects to the database and return required data.

    d3.json("./data/data.json", function(error,data){

        if (error) onError(new Error(error));

        var el = document.getElementById( svg );
        while (el.hasChildNodes()) {el.removeChild(el.firstChild);}
        mainframe.setElement('#'+svg).renderDesPlot();

        BC.init(data,sccolor,bccolor);        
    });
    
};

//Export as App so it could be App.init could be called
module.exports = DesPlot;
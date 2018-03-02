var SP = require('./scatterplot.js');
var heatmap = require('./heatmap.js');

var BC = function (obj) {
    if (obj instanceof BC) return obj;
    if (!(this instanceof BC)) return new BC(obj);
    this.BCwrapped = obj;
};

var newdata;

BC.init = function (jsondata,colorrange,color) {
    
    var BARmargin = {top: 20, right: 0, bottom: 0, left: 0},
    svgHeight = 600,
    svgWidth = 300,
    BARwidth = svgWidth - BARmargin.left - BARmargin.right,
    BARheight = svgHeight - BARmargin.top - BARmargin.bottom;

    // create svg for bar chart.
    
    var resp = d3.select("#barchart")
        .append('div')
        .attr("id", "barchartsvgdiv")
        .attr('class', 'svg-container'); //container class to make it responsive
    

    var BARsvg = resp
        .append("svg")
        .attr("id", "barchartsvg")
        .attr('class', 'canvas svg-content-responsive')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', [0, 0, svgWidth, svgHeight].join(' '))
        .append("g")
        .attr("transform", "translate(" + BARmargin.left + "," + BARmargin.top + ")");
        
    var nested_data = d3.nest()
    .key(function(d) { return d.process; })
    .entries(jsondata);
    
    var barH = BARheight/(nested_data.length);
    
    newdata=[];
    
    jsondata.forEach(function (d) {
        if (!isNaN(parseFloat(d.log2)) && isFinite(d.log2))  newdata.push(d);
    });
    
    sampledata = d3.nest()
        .key(function (d) {
            return d.sampleID;
        })
        .entries(newdata);
    
    var genedata = d3.nest()
        .key(function (d) {
            return d.gene;
        })
        .entries(newdata);
    
    genedata.forEach(function(d){
        d.gene = d.key;
        d.process = d.values[0].process;
    });
    
    var data = d3.nest()
        .key(function (d) {
            return d.process;
        })
        .entries(genedata);
    
    data.forEach(function (d) {
        d.process = d.key;
        d.count = d.values.length;
    });
    
    
    data.sort(function(a,b) { return +b.count - +a.count; });
    
    var xmax = Math.abs(d3.max(data, function (d) {
        return d.count;
    }));
    
    var x = d3.scale.linear()
    .range([0, BARwidth])
    .domain([0,xmax]);

  var bar = BARsvg.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barH + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.count); })
      .attr("height", barH - 1)
      .style("fill", function (d) {
            return color(d.process);
        })
      .on("click", click);
    
    bar.append("text")
      .attr("x", 0)
      .attr("y", barH / 2)
      .attr("dy", ".35em")
      .style("font-size", 14)
      .style("font-family", 'Montserrat, Arial')
      .text(function(d) { return d.process+" ("+d.count+")"; })
      .on("click", click);
    
    SP.init(jsondata, data[0].process, color(data[0].process),colorrange);
    heatmap.init(jsondata, data[0].process,colorrange);
    
    function click(d) {
        SP.update(jsondata, d.process, color(d.process),colorrange);
        d3.select("#heatmapsvg").remove();
        heatmap.processData(jsondata, d.process,colorrange);
    }

    saveTextAsFile = function(){
        
            var result = "";
            var up = 1.5,
                down = -1.5;

            var upgenes = [], downgenes = [], mutation=[], others=[];

            jsondata.sort(function(x, y){
                return d3.ascending(x.gene, y.gene);
            });

            jsondata.sort(function(x, y){
                return d3.ascending(x.process, y.process);
            });

            jsondata.sort(function(x, y){
                return d3.ascending(x.sampleID, y.sampleID);
            });

            console.log(jsondata)

            jsondata.forEach(function(d){
                console.log(d)
                if (d.mutation !== "") mutation.push (d);
                if (d.log2 >= up) upgenes.push(d);
                else if (d.log2 <= down) downgenes.push(d);
                else if (d.mutation == "") others.push(d);
            });

            // mutation.sort(function(x, y){
            //     return d3.ascending(x.sampleID, y.sampleID);
            // });

            // upgenes.sort(function(x, y){
            //     return d3.ascending(x.sampleID, y.sampleID);
            // });

            // downgenes.sort(function(x, y){
            //     return d3.ascending(x.sampleID, y.sampleID);
            // });

            // others.sort(function(x, y){
            //     return d3.ascending(x.sampleID, y.sampleID);
            // });

            result += "Results\n";
            result += "----------------------------\n\n";
            result += "UP-REGULATED GENES (Log2 Fold Change > 1.5):\n\n";
            result += "SAMPLE NAME\tGENE NAME\tPROCESS\tLOG2FOLD\tP-VALUE\n";
            upgenes.forEach(function(d){
                result += d.sampleID+"\t"+d.gene+"\t"+d.process+"\t"+d.log2+"\t"+d.pvalue+"\n";
            });
            result += "----------------------------\n\n";
            result += "DOWN-REGULATED GENES (Log2 Fold Change < -1.5):\n\n";
            result += "SAMPLE NAME\tGENE NAME\tPROCESS\tLOG2FOLD\tP-VALUE\n";
            downgenes.forEach(function(d){
                result += d.sampleID+"\t"+d.gene+"\t"+d.process+"\t"+d.log2+"\t"+d.pvalue+"\n";
            });
            result += "----------------------------\n\n";
            result += "MUTATED GENES:\n\n";
            result += "SAMPLE NAME\tGENE NAME\tCHROMOSOME\tPROCESS\tVARIANT DESCRIPTION\n";
            mutation.forEach(function(d){
                result += d.sampleID+"\t"+d.gene+"\t"+d.process+"\t"+d.log2+"\t"+d.pvalue+"\t"+d.mutation+"\n";
            });
            result += "----------------------------\n\n";
            result += "OTHER GENES:\n\n";
            result += "SAMPLE NAME\tGENE NAME\tPROCESS\tLOG2FOLD\tP-VALUE\n";
            others.forEach(function(d){
                result += d.sampleID+"\t"+d.gene+"\t"+d.process+"\t"+d.log2+"\t"+d.pvalue+"\n";
            });
            result += "----------------------------\n";
            result += "----------------------------\n\n";
                
            var textToWrite = result;
                var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
                var fileNameToSaveAs = "Mito_variants.txt";
                var downloadLink = document.createElement("a");
                downloadLink.download = fileNameToSaveAs;
                window.URL = window.URL || window.webkitURL;
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = destroyClickedElement;
                document.body.appendChild(downloadLink);
                downloadLink.click();
        };

    $("#downloadText").click(saveTextAsFile);

};



	function destroyClickedElement(event)
	{
		// remove the link from the DOM
    		document.body.removeChild(event.target);
	}


	/*saveAsSvg = function()
 	{
 	
		var svg = d3.selectAll('#heatmapsvg');
        	var html ='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="'+svg.attr('width')+'" height="'+svg.attr('height')+'">' +svg.node().innerHTML +'</svg>';
    		var blob = new Blob([html], { type: "image/svg+xml;charset=utf-8" });
		var domUrl = self.URL || self.webkitURL || self;
            	var blobUrl = domUrl.createObjectURL(blob);
		var l = document.createElement("a");
        	l.download = 'Mito_network.svg';
		window.URL = window.URL || window.webkitURL;
		l.href = window.URL.createObjectURL(blob);
		document.body.appendChild(l);
        	l.click();
      
    html2canvas($('#barchartsvg'), 
    {
      onrendered: function (canvas) {
        var a = document.createElement('a');
        // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'somefilename.jpg';
        a.click();
      }
    });
	
	};*/



module.exports = BC;

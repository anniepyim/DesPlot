var tipTemplate = require('../views/templates').DesPlot_tooltip;

var SPmargin = {top: 20, right: 0, bottom: 30, left: 30},
    svgWidth = 900,
    svgHeight = 550,
    SPwidth = svgWidth - SPmargin.left - SPmargin.right, 
    SPheight = svgHeight - SPmargin.top - SPmargin.bottom;

var SPsvg;

var x = d3.scale.ordinal()
    .rangeRoundPoints([0, SPwidth], 1);

var y = d3.scale.linear()
    .range([SPheight, 0]);
    
var yMax = 2,
	yMin = -2;

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var yzoom = d3.behavior.zoom()
    .y(y);

var colorScale = d3.scale.linear();
    //.interpolate(d3.interpolateHsl);

var mutatedcolor = "#6baed6",
	highlightcolor = "#f768a1",
	highlightradius = 6.5,
	mycolors = "";

var clickEvent = {target: null, holdClick: false};

var finaldata;

var SP = function (obj) {
    if (obj instanceof SP) return obj;
    if (!(this instanceof SP)) return new SP(obj);
    this.SPwrapped = obj;
};

var rjsondata, rnfunc, rncolor,rcolorrange;

SP.drawaxis = function () {

    SPsvg.append("g")
        .attr("id","x-axis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + SPheight + ")")
        .append("text")
        .attr("class", "label")
        .attr("x", SPwidth)
        .attr("y", -6)
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("font-family", 'Montserrat, Arial')
        .text("Sample");

    SPsvg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("font-family", 'Montserrat, Arial')
        .text("Log2 Fold change");

    SPsvg.select(".x.axis")
        .style("font-size", 14)
        .style("font-family", 'Montserrat, Arial');

    SPsvg.select(".y.axis")
        .style("font-size", 14)
        .style("font-family", 'Montserrat, Arial');

    SPsvg.append("rect")
        .attr("class", "SPrect")
        .attr("x", SPwidth - 250)
        .attr("width", 18)
        .attr("height", 18);

    SPsvg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", SPwidth)
      .attr("height", SPheight);
    
    SPsvg.append("g")
          .attr("class", "scatter")
          .attr("clip-path", "url(#clip)");

    SPsvg.append("text")
        .attr("class", "SPtitle")
        .attr("transform", "translate(" + (SPwidth - 220) + ",13)")
        .style("font-size", 14)
        .style("font-family", 'Montserrat, Arial');
  
    SPsvg.append("svg:rect")
          .attr("class", "zoom y box")
          .attr("width", SPmargin.left)
          .attr("height", SPheight)
          .attr("transform", "translate(" + -SPmargin.left + "," + 0 + ")")
          .style("visibility", "hidden")
          .attr("pointer-events", "all")
          .call(yzoom);
    
    SPsvg.append("text")
        .attr("class","resetAxis")
        .attr("transform","translate(30,0)")
        .style("fill","#66b3ff")
        .style("cursor","pointer")
        .style("text-decoration","underline")
        .style("font-weight","bold")
        .style("font-size", 14)
        .style("font-family", 'Montserrat, Arial')
        .text("Reset Axis")
        .on("click", resetAxis);

};

SP.update = function (jsondata, nfunc, ncolor,colorrange) {
    
    var data = [];
    
    mycolors = colorrange;
    
    rjsondata = jsondata;
    rnfunc = nfunc;
    rncolor = ncolor;
    rcolorrange = colorrange;

    jsondata.forEach(function (d) {
        if (d.process == nfunc && !isNaN(parseFloat(d.log2)) && isFinite(d.log2)) {
            data.push(d);
        }
    });

    data.forEach(function (d) {
        d.log2 = +d.log2;
    });

    // Copy-on-write since tweens are evaluated after a delay
    data = data.sort(function(a, b) { return d3.ascending(a.sampleID_index, b.sampleID_index); });

    x.domain(data.map(function (d) {
        return d.sampleID;
    }));

    var ymin = Math.abs(d3.min(data, function (d) {
        return d.log2;
    }));
    var ymax = Math.abs(d3.max(data, function (d) {
        return d.log2;
    }));
    var yabs = Math.max(ymin, ymax);
    if (yabs < yMax) yabs = yMax;
    y.domain([yabs * -1, yabs]);
    //y.domain([-5,5])

    SPsvg.selectAll("text.SPtitle").text(nfunc);
    SPsvg.selectAll("rect.SPrect").style("fill", ncolor);

    SPsvg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    SPsvg.select(".x.axis")
        .call(xAxis);
    

    colorScale.domain([yabs * -1, 0,yabs])
        .range([mycolors[0], mycolors[5],mycolors[10]]);

     var nodedata = data.map(function (d) {
            return {
                x: x(d.sampleID), 
                y: y(d.log2),
                y2: d.log2,
                r: 3.5,
                log2: d3.format(".3f")(d.log2),
                pvalue: d3.format(".3f")(d.pvalue),
                sample: d.sampleID,
                process: d.process,
                gene_function: d.gene_function,
                gene: d.gene,
                mutation: d.mutation.split(';')
            };
        });
    
    function updateNodes(zoom){
        
        var gs = SPsvg.select("g.scatter");
        
        var nodes = gs.selectAll("circle.node")
            .data(nodedata);
        
        var norm = d3.random.normal(0, 1.5);
        var iterations = 0;

        function collide(node) {
            var r = node.r + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = node.r + quad.point.r;
                    if (l < r)
                        node.x += norm();
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        }

        while (iterations++ < 100) {
            var q = d3.geom.quadtree(nodedata);

            for (var i = 0; i < nodedata.length; i++)
                q.visit(collide(nodedata[i]));
        }

        nodes.enter().append("circle")
            .attr("class", "node")
            .attr("r", function (d) {
                return (d.mutation[0] !== "" && d.mutation[0] !== "0 mutation(s)") ? highlightradius : d.r;
            })
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return y(d.y2);
            })
            .style("fill", function (d) {
                return (d.mutation[0] !== "" && d.mutation[0] !== "0 mutation(s)") ? mutatedcolor : d.log2 > yMax ? mycolors[10] : d.log2 < yMin ? mycolors[0]: colorScale(d.log2);
            })
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .on('mouseover', SP.onMouseOverNode)
            .on('mouseout', SP.onMouseOut)
            .on('click',SP.onMouseClick);
        
        if (zoom){
            
            nodes.attr("cx", function(d) {
                return d.x;
            })
                .attr("cy", function(d) {
                return y(d.y2);
                
            });  
        }else{
            
            nodes.transition()
                .duration(1000)
                .attr("r", function (d) {
                    return (d.mutation[0] !== "" && d.mutation[0] !== "0 mutation(s)") ? highlightradius : d.r;
                })
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return y(d.y2);
                })
                .style("fill", function (d) {
                    return (d.mutation[0] !== "" && d.mutation[0] !== "0 mutation(s)") ? mutatedcolor : d.log2 > yMax ? mycolors[10] : d.log2 < yMin ? mycolors[0]: colorScale(d.log2);
                });
            
        }
        
        nodes.exit()
            .transition(1000)
            .attr("r", 0)
            .remove();
    }
    
    draw(false);
    
    function zoom_update() {
        yzoom = d3.behavior.zoom()
            .y(y)
            .on("zoom", function(){draw(true);});

        SPsvg.select('rect.zoom.xy.box').call(yzoom);
        SPsvg.select('rect.zoom.y.box').call(yzoom);
    }

    function draw(zoom) {
        SPsvg.select(".y.axis").call(yAxis);

        updateNodes(zoom);
        zoom_update();
    }

    function reset(event){
        if (event.target.getAttribute('class') != "node" && !event.target.getAttribute('class').includes("cell")){
            
            //Clear tooltip
            $('#rowtip1').empty();
            
            highlight("");

            d3.selectAll("circle.node").on('mouseout', SP.onMouseOut);
            d3.selectAll("circle.node").on('mouseover', SP.onMouseOverNode);

            d3.selectAll("rect.cell").on('mouseout', SP.onMouseOut);
            d3.selectAll("rect.cell").on('mouseover', SP.onMouseOverNode);
        }

    }

    $("#scatterplot").click(function(event){
        reset(event);        
    });

    $("#barchart").click(function(event){
        reset(event);        
    });

    $("#scheatmap").click(function(event){
        reset(event);        
    });
};

var resetAxis = function(){
    
    SP.update(rjsondata, rnfunc, rncolor,rcolorrange);
};

SP.onMouseOut = function(node){
    
    if(clickEvent.holdClick) return;
    
    //Clear tooltip
    $('#rowtip1').empty();
    
    highlight("");
};


SP.onMouseOverNode = function(node){
    
    highlight("");
    //Clear tooltip
    $('#rowtip1').empty();

    if(clickEvent.holdClick) return;
    
    //Init tooltip if hover over gene
    if(!_.isUndefined(node.gene))
        $('#rowtip1').append(tipTemplate(node));
    
    highlight(node.gene);

};

SP.onMouseClick = function(node){
    
    highlight("");
    //Clear tooltip
    $('#rowtip1').empty();

    if(clickEvent.holdClick) return;
    
    //Init tooltip if hover over gene
    if(!_.isUndefined(node.gene))
        $('#rowtip1').append(tipTemplate(node));
    
    highlight(node.gene);

    //d3.select(this).on("mouseout", null);
    d3.selectAll("circle.node").on("mouseout", null);
    d3.selectAll("circle.node").on('mouseover', null);

    d3.selectAll("rect.cell").on("mouseout", null);
    d3.selectAll("rect.cell").on('mouseover', null);

};

var highlight = function(target){
    
    SPsvg.selectAll("circle.node")
        .transition()
        .duration(500)
        .style("fill", function (d) {
			return d.gene == target? highlightcolor : (d.mutation[0] !== "" && d.mutation[0] !== "0 mutation(s)") ? mutatedcolor : d.log2 > yMax ? mycolors[10] : d.log2 < yMin ? mycolors[0]: colorScale(d.log2);
        })
        .attr("r", function (d) {
            return d.gene == target ? highlightradius : (d.mutation[0] !== "" && d.mutation[0] !== "0 mutation(s)") ? highlightradius : d.r;
        });
    
};


SP.init = function (jsondata,process,processColor,colorrange) {
    
    var resp = d3.select("#scatterplot")
        .append('div')
        .attr("id", "scatterplotsvgdiv")
        .attr('class', 'svg-container'); //container class to make it responsive
    
    SPsvg = resp
    .append("svg")
    .attr("id", "scatterplotsvg")
    .attr('class', 'canvas svg-content-responsive')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', [0, 0, svgWidth, svgHeight].join(' '))
    .append("g")
    .attr("transform", "translate(" + SPmargin.left + "," + SPmargin.top + ")");
    
    SP.drawaxis();
    SP.update(jsondata, process, processColor,colorrange);
};



if (typeof define === "function" && define.amd) {
    define(SP);
} else if (typeof module === "object" && module.exports) {
    module.exports = SP;
} else {
    this.SP = SP;
}

var SP = require('./scatterplot.js');

var heatmap = function (obj) {
    if (obj instanceof heatmap) return obj;
    if (!(this instanceof heatmap)) return new heatmap(obj);
    this.heatmapwrapped = obj;
};

var yMax = 2,
	yMin = -2;

heatmap.processData = function (jsondata, nfunc,colorrange) {
    
    var newdata = [];

    jsondata.forEach(function (d) {
        if (d.process == nfunc && !isNaN(parseFloat(d.log2)) && isFinite(d.log2)) {
            newdata.push(d);
        }
    });
    
    
    //create map for gene and sample data
    var genedata = d3.nest()
        .key(function (d) {
            return d.gene;
        })
        .entries(newdata);

    
    var sampledata = d3.nest()
        .key(function (d) {
            return d.sampleID;
        })
        .entries(newdata);
    

    var id = 1;
    var genemap = {};
    var genelist = [];
    genedata.forEach(function (d) {
        genemap[d.key] = id;
        genelist.push(d.key);
        id += 1;
    });
    
    
    id = 1;
    var samplemap = {};
    var samplelist = [];
    sampledata.forEach(function (d) {
        samplemap[d.key] = id;
        samplelist.push(d.key);
        id += 1;
    });
    
    outdata = [];

    newdata.forEach(function (d) {
        outdata.push({
            rowidx: samplemap[d.sampleID], 
            colidx: genemap[d.gene], 
            log2: d3.format(".3f")(d.log2), 
            pvalue: d3.format(".3f")(d.pvalue), 
            sample: d.sampleID, 
            gene: d.gene, 
            process: d.process, 
            gene_function: d.gene_function, 
            mutation: d.mutation.split(',')
        });
    });
    
    
    heatmap.draw(outdata, samplelist, genelist,colorrange);
};

heatmap.draw = function (jsondata, samplelist, genelist,mycolors) {

    
    jsondata.forEach(function (d) {
        d.rowidx = +d.rowidx;
        d.colidx = +d.colidx;
        d.log2 = +d.log2;
    });

    
    var HMmargin = {top: 60, right: 0, bottom: 50, left: 70},
        svgWidth = 1200,
        svgHeight = 500,
        HMwidth = svgWidth - HMmargin.left - HMmargin.right, 
        HMheight = svgHeight - HMmargin.top - HMmargin.bottom,
        gridheight = HMheight / samplelist.length, 
        gridwidth = HMwidth / genelist.length, 
        legendElementWidth = HMwidth / 11;
    
    var resp = d3.select("#heatmap")
        .append('div')
        .attr("id", "heatmapsvg")
        .attr('class', 'svg-container'); //container class to make it responsive

    var svg = resp
        .append("svg")
        .attr('class', 'canvas svg-content-responsive')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', [0, 0, svgWidth, svgHeight].join(' '))
        .append("g")
        .attr("transform", "translate(" + HMmargin.left + "," + HMmargin.top + ")");
    
    var rowSortOrder = false,
        colSortOrder = false,
        row_number = samplelist.length,
        col_number = genelist.length;
    
    var ymin = Math.abs(d3.min(jsondata, function (d) {
        return d.log2;
    }));
    var ymax = Math.abs(d3.max(jsondata, function (d) {
        return d.log2;
    }));
    var yabs = Math.max(ymin, ymax);
    if (yabs < yMax) yabs = yMax;

    var colorScale = d3.scale.quantile()
        .domain([yabs * -1, 0, yabs])
        .range(mycolors);

    var rowLabels = svg.append("g").selectAll(".rowLabel")
        .data(samplelist)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * gridheight;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridheight / 1.5 + ")")
        .attr("class", function (d, i) {
            return "rowLabel r" + i;
        })
        .on("mouseover", function (d) {
            d3.select(this).classed("text-hover", true);
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("text-hover", false);
        })
        .on("click", function (d, i) {
            rowSortOrder = !rowSortOrder;
            sortbylabel("r", i, rowSortOrder); //d3.select("#order").property("selectedIndex", 4).node().focus();
        });

    var colLabels = svg.append("g").selectAll(".colLabel")
        .data(genelist)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * gridwidth;
        })
        .style("text-anchor", "left")
        .attr("transform", "translate(" + gridwidth / 2 + ", -6 ) rotate (-90)")
        .attr("class", function (d, i) {
            return "colLabel c" + i;
        })
        .on("mouseover", function (d) {
            d3.select(this).classed("text-hover", true);
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("text-hover", false);
        })
        .on("click", function (d, i) {
            colSortOrder = !colSortOrder;
            sortbylabel("c", i, colSortOrder); //d3.select("#order").property("selectedIndex", 4).node().focus();
        });

    var cells = svg.append("g").selectAll(".cell")
        .data(jsondata, function (d) {
            return d.rowidx + ':' + d.colidx;
        });

    //cells.append("title");

    cells.enter().append("rect")
        .attr("x", function (d) {
            return (d.colidx - 1) * gridwidth;
        })
        .attr("y", function (d) {
            return (d.rowidx - 1) * gridheight;
        })
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("class", function (d) {
            return "cell cr" + (d.rowidx - 1) + " cc" + (d.colidx - 1);
        })
        .attr("width", gridwidth)
        .attr("height", gridheight)
        .style("fill", mycolors[5])
        .on('mouseover', SP.onMouseOverNode)
        .on('mouseout', SP.onMouseOut);

    cells.transition().duration(1000)
        .style("fill", function (d) {
            return d.log2 > yMax ? mycolors[10] : d.log2 < yMin ? mycolors[0]: colorScale(d.log2);
        });

    cells.select("title").text(function (d) {
        return d.log2;
    });

    cells.exit().remove();

    var legend = svg.append("g").selectAll(".legend")
        .data(["<-2","-2","0","0","0","0","0","0","0","2",">2"]);

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function (d, i) {
            return legendElementWidth * i;
        })
        .attr("y", HMheight + 15)
        .attr("width", legendElementWidth)
        .attr("height", 10)
        .style("fill", function (d, i) {
            return mycolors[i];
        });

    legend.append("text")
        .attr("class", "mono")
        .text(function (d, i) {
            return (i === 0 || i === 1 || i === 5 || i === 9 || i === 10) ? d : "";
        })
        .attr("x", function (d, i) {
            return legendElementWidth * i + legendElementWidth / 2;
        })
        .attr("y", HMheight + 40);

    legend.exit().remove();

    function sortbylabel(rORc, i, sortOrder) {

        var t = svg.transition().duration(3000);
        var log2r = [];
        var sorted; // sorted is zero-based index
        var idx = 1;
        var newnew = [];
        
        
        d3.selectAll(".c" + rORc + i)
            .filter(function (ce) {
                newnew.push(ce);
            });
        
        if (rORc == "c"){
            newnew.sort(function(a,b) { return d3.ascending(a.rowidx, b.rowidx);});
        }

        
        newnew.forEach(function(d){
            if (rORc == "r"){
                while(d.colidx !== idx){
                    log2r.push(-100);
                    idx = idx+1;
                }
            }else{
                while(d.rowidx !== idx){
                    log2r.push(-100);
                    idx = idx+1;    
                }
            }
            log2r.push(d.log2);
            idx = idx+1;
        });
        
        if (rORc == "r"){
            while(idx < genelist.length+1){
                log2r.push(-100);
                idx = idx+1;
            }     
        }else{
            while(idx < samplelist.length+1){
                log2r.push(-100);
                idx = idx+1;
            }            
        }

        
        
        if (rORc == "r") { // sort log2ratio of a gene
            sorted = d3.range(col_number).sort(function (a, b) {
                if (sortOrder) {
                    return log2r[a] - log2r[b];
                } else {
                    return log2r[b] - log2r[a];
                }
            });
            t.selectAll(".cell")
                .attr("x", function (d) {
                    return sorted.indexOf(d.colidx - 1) * gridwidth;
                });
            t.selectAll(".colLabel")
                .attr("y", function (d, i) {
                    return sorted.indexOf(i) * gridwidth;
                });
        } else { // sort log2ratio of a contrast
            sorted = d3.range(row_number).sort(function (a, b) {
                if (sortOrder) {
                    return log2r[b] - log2r[a];
                } else {
                    return log2r[a] - log2r[b];
                }
            });
            t.selectAll(".cell")
                .attr("y", function (d) {
                    return sorted.indexOf(d.rowidx - 1) * gridheight;
                });
            t.selectAll(".rowLabel")
                .attr("y", function (d, i) {
                    return sorted.indexOf(i) * gridheight;
                });
        }
    }

};

heatmap.init = function (jsondata,process,colorrange) {
    heatmap.processData(jsondata,process,colorrange);
};

if (typeof define === "function" && define.amd) {
    define(heatmap);
} else if (typeof module === "object" && module.exports) {
    module.exports = heatmap;
} else {
    this.heatmap = heatmap;
}

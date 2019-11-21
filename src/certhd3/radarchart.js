// Creates a radar chart
// Code structure is according to https://bost.ocks.org/mike/chart/

function radarChart() {
    let width = 600,
        height = 400,
        radius = 150,
        axisInnerPad = 20,
        axisOuterPad = 30,
        textPad = 20,
        legendWidth = 180,
        legendPad = 10,
        idFun = (d, i) => i;

    let showAxisLabels = true,
        showLegend = true;

    let axes = [];
    
    let svgWidth = showLegend ? width + legendWidth : width;

    function chart(selection) {
        selection.each((data, i, nodes) => {

            let container = d3.select(nodes[i]);

            // create svg if it does not exist
            let svgEnter = container.selectAll("svg")
                .data([data])
                .enter()
                .append("svg");
            
            let svg = container.selectAll("svg")
                .attr("width", svgWidth)
                .attr("height", height); 
                
            let mainAreaEnter = svg.selectAll(".chartContainer")
                .data([data])
                .enter()
                .append("g")
                .attr("class", "chartContainer");
               
            let mainArea = svg.selectAll(".chartContainer")
                .attr("transform", "translate(" + 0 + "," + 0 + ")");   

                
            // Data process
            // ---------------------------------------------------------

            var dataInput = data;

            var arr = [];
            if (axes.length>0)
                var axisKeys = axes;
            else
                var axisKeys = Object.keys(dataInput[0]);

            for (var i=0; i<dataInput.length; i++){
                arr.push([]);
                for (var j=0; j<axisKeys.length; j++){
                    arr[i].push({
                        axisTitle: axisKeys[j],
                        value: dataInput[i][axisKeys[j]]
                    });
                }
            }
           
            data = arr;

            var values = [];
            for (var i=0; i<data.length; i++){
                for (var j=0; j<axisKeys.length; j++){
                    values.push(data[i][j].value);
                }
            } 
            var maxValue = d3.max(values);

            // Scales
            // ---------------------------------------------------------
            
            let angleScale = d3.scaleBand()
                .domain(data[0].map(d => d.axisTitle))
                .range([0, 2 * Math.PI]);
            
            let valScale = d3.scaleLinear()
                .domain([0, maxValue])
                .range([axisInnerPad, radius - axisOuterPad]);
                
            function colorScale(d){
                var color = d3.schemeCategory10;
                return color[d];         
            }    

            // Utility functions
            // ---------------------------------------------------------

            function axisXFun(d, pad) {
                return width / 2 + (radius + pad) * Math.cos(angleScale(d.axisTitle));
            }

            function axisYFun(d, pad) {
                return height / 2 + (radius + pad) * Math.sin(angleScale(d.axisTitle));
            }
            

            // Axes
            // ---------------------------------------------------------

            var axisLines = mainArea.selectAll(".axisLine"); 
            
            axisLines
                .data(data[0])
                .enter()
                .append("line")
                    .attr("class", "axisLine");

            var selectionAxisLines = svg
                .selectAll(".axisLine").data(data[0])
                .attr("class", "axisLine")    
                    .attr("x1", width / 2)
                    .attr("y1", height / 2)
                    .attr("x2", d => axisXFun(d, 0))
                    .attr("y2", d => axisYFun(d, 0))
                    .attr("stroke", "darkgray");

            selectionAxisLines.exit().remove();                
            
            
            // Axis labels
            // ---------------------------------------------------------
            
            if (showAxisLabels) {

                var labels = mainArea.selectAll(".label"); 
            
                labels
                    .data(data[0])
                    .enter()
                    .append("text")
                        .attr("class", "label");

                var selectionLabels = svg
                    .selectAll(".label").data(data[0])
                        .attr("class", "label")    
                        .attr("x", d => axisXFun(d, textPad))
                        .attr("y", d => axisYFun(d, textPad))
                        .text(d => d.axisTitle)
                        .attr("text-anchor", d => {
                            let angle = angleScale(d.axisTitle) * 180 / Math.PI;
                            if (angle < 45)
                                return "start";
                            else if (angle < 135)
                                return "middle";
                            else if (angle < 225)
                                return "end";
                            else if (angle < 315)
                                return "middle";
                            else
                                return "start";
                        })
                        .attr("dominant-baseline", d => {
                            let angle = angleScale(d.axisTitle) * 180 / Math.PI;
                            if (angle < 45)
                                return "central";
                            else if (angle < 135)
                                return "hanging";
                            else if (angle < 225)
                                return "central";
                            else if (angle < 315)
                                return "baseline";
                            else
                                return "central";
                        });

                    selectionLabels.exit().remove();     

            }
               

            // Line contour
            // ---------------------------------------------------------

            var lineGen;
            var line;    
            var selectionLine;

            lineGen = d3.lineRadial()
            .angle(d => angleScale(d.axisTitle) + Math.PI / 2)
            .radius(d => valScale(d.value))
            //.curve(d3.curveCatmullRom.alpha(0.5));

            line = mainArea.selectAll(".radarLine"); 
                
            line
                .data(data)
                .enter()
                .append("path")
                .datum(d => [...d, d[0]])
                    .attr("class", "radarLine");

            selectionLine = svg
                .selectAll(".radarLine")
                    .datum(d => [...d, d[0]])
                    .attr("class", "radarLine")    
                    .attr("d", lineGen)
                    .attr("transform", `translate(${width / 2} ${height / 2})`)
                    .attr("stroke", (d,i) => colorScale(i))
                    .attr("fill", "transparent");

            selectionLine.data(data).exit().remove();

            // Legend
            // ---------------------------------------------------------

            if (showLegend) {

                var legend = mainArea.selectAll(".legend"); 
                
                legend
                    .data([data])
                    .enter()
                    .append("g")
                        .attr("class", "legend");

                var selectionLegend = svg
                    .selectAll(".legend").data([data])
                        .attr("class", "legend")
                        .attr("transform", `translate(${width} 0)`);

                selectionLegend.data([data]).exit().remove();     

                var rectLegend = selectionLegend.selectAll(".rectLegend"); 
                
                rectLegend
                    .data([data])
                    .enter()
                    .append("rect")
                        .attr("class", "rectLegend");

                var selectionRectLegend = svg
                    .selectAll(".rectLegend").data([data])
                        .attr("class", "rectLegend")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", legendWidth)
                        .attr("height", 20 * data.length + legendPad)
                        .attr("stroke", "gray")
                        .attr("fill", "white");

                selectionRectLegend.data([data]).exit().remove();         

                var legendMark = selectionLegend.selectAll(".legendMark"); 
                
                legendMark
                    .data(data)
                    .enter()
                    .append("rect")
                        .attr("class", "legendMark");

                var selectionlegendMark = svg
                    .selectAll(".legendMark").data(data)
                        .attr("class", "legendMark")
                        .attr("x", 10)
                        .attr("y", (d, i) => legendPad + i * 20)
                        .attr("width", 10)
                        .attr("height", 10)
                        .attr("fill", (d, i) => colorScale(i));

                selectionlegendMark.exit().remove();     

                var markLabel = selectionLegend.selectAll(".markLabel"); 
                
                markLabel
                    .data(data)
                    .enter()
                    .append("text")
                        .attr("class", "markLabel");

                var selectionMarkLabel = svg
                    .selectAll(".markLabel").data(dataInput)
                        .attr("class", "markLabel")
                        .attr("x", 30)
                        .attr("y", (d, i) => legendPad + 3 + i * 20)
                        .text(idFun)
                        .attr("dominant-baseline", "central");

                selectionMarkLabel.exit().remove(); 

            }
        });
    }

    chart.width = function(value) {
		if (!arguments.length) return width;
        width = value;
        svgWidth = showLegend ? width + legendWidth : width;
		return chart;
    }
    
    chart.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return chart;
    }
    
    chart.radius = function(value) {
		if (!arguments.length) return radius;
        radius = value;
		return chart;
    }

    chart.axisInnerPad = function(value) {
		if (!arguments.length) return axisInnerPad;
		axisInnerPad = value;
		return chart;
    }

    chart.axisOuterPad = function(value) {
		if (!arguments.length) return axisOuterPad;
		axisOuterPad = value;
		return chart;
    }

    chart.textPad = function(value) {
		if (!arguments.length) return textPad;
		textPad = value;
		return chart;
    }

    chart.legendWidth = function(value) {
		if (!arguments.length) return legendWidth;
		legendWidth = value;
		return chart;
    }

    chart.legendPad = function(value) {
		if (!arguments.length) return legendPad;
		legendPad = value;
		return chart;
    }

    chart.showAxisLabels = function(value) {
		if (!arguments.length) return showAxisLabels;
		showAxisLabels = value;
		return chart;
    }

    chart.showLegend = function(value) {
		if (!arguments.length) return showLegend;
        showLegend = value;
        svgWidth = showLegend ? width + legendWidth : width;
		return chart;
    }

    chart.axes = function(value) {
		if (!arguments.length) return axes;
		axes = value;
		return chart;
    }

    chart.idFun = function(value) {
		if (!arguments.length) return idFun;
		idFun = value;
		return chart;
    }
    
    return chart;
}
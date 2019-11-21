// Creates a scatterplot.
// Code structure is according to https://bost.ocks.org/mike/chart/

function scatterplot() {
    // default parameter values
    let width = 500,
        height = 500,
        leftPad = 30,
        topPad = 5,
        bottomPad = 30,
        pointRadius = 5,
        xAttr = "x",
        yAttr = "y";
    
    let onclick = (d, i, nodes) => {};

    function chart(selection) {
        selection.each((data, i, nodes) => {
            
            // initialization
            // ---------------------------------------------------

            let container = d3.select(nodes[i]);

            // create svg if it does not exist
            let svgEnter = container.selectAll("svg")
                .data([data])
                .enter()
                .append("svg");
            
            let svg = container.selectAll("svg")
                .attr("width", width + leftPad)
                .attr("height", height + topPad + bottomPad)

            let mainAreaEnter = svgEnter
                .append("g")
                    .attr("class", "mainArea")            
            let mainArea = svg.select(".mainArea")
                .attr("transform", `translate(${leftPad} ${topPad})`)


            // scales
            // ------------------------------------------------------

            let xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d[xAttr]))
                .range([0, width]);
            
            let yScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d[yAttr]))
                .range([height, 0]);
            

            // points
            // ------------------------------------------------------

            let pointsEnter = mainArea.selectAll(".point")
                .data(data)
                .enter()
                .append("circle")
                    .attr("class", "point")
            
            let points = mainArea.selectAll(".point")
                .data(data)
                    .attr("cx", d => xScale(d[xAttr]))
                    .attr("cy", d => yScale(d[yAttr]))
                    .attr("r", pointRadius)
                    .attr("fill", "steelblue")
                    .on("click", (d, i, nodes) => {
                        d3.selectAll(".point")
                            .attr("stroke", "none");
                        d3.select(nodes[i])
                            .attr("stroke", "black");
                        onclick(d, i, nodes);
                    });
            
            let pointsExit = mainArea.selectAll(".point")
                .data(data)
                .exit()
                .remove();
            
            
            // axes
            // ------------------------------------------------------

            let bottomAxisEnter = svgEnter
                .append("g")
                    .attr("class", "bottomAxis")
            
            let bottomAxis = svg.select(".bottomAxis")
                .attr("transform", `translate(${leftPad}, ${topPad + height})`)
                .call(d3.axisBottom(xScale));
            
            let leftAxisEnter = svgEnter
                .append("g")
                    .attr("class", "leftAxis")
            
            let leftAxis = svg.select(".leftAxis")
                .attr("transform", `translate(${leftPad}, ${topPad})`)
                .call(d3.axisLeft(yScale));
        });
    }

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    }

    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    }

    chart.leftPad = function (value) {
        if (!arguments.length) return leftPad;
        leftPad = value;
        return chart;
    }

    chart.topPad = function (value) {
        if (!arguments.length) return topPad;
        topPad = value;
        return chart;
    }

    chart.bottomPad = function (value) {
        if (!arguments.length) return bottomPad;
        bottomPad = value;
        return chart;
    }

    chart.pointRadius = function (value) {
        if (!arguments.length) return pointRadius;
        pointRadius = value;
        return chart;
    }

    chart.xAttr = function (value) {
        if (!arguments.length) return xAttr;
        xAttr = value;
        return chart;
    }

    chart.yAttr = function (value) {
        if (!arguments.length) return yAttr;
        yAttr = value;
        return chart;
    }

    chart.onclick = function (value) {
        if (!arguments.length) return onclick;
        onclick = value;
        return chart;
    }

    return chart;
}

function forceDirectedGraph() {
    // properties
    let width = 500,
        height = 500,
        chargeStrength = -100,
        linkDistance = 50,
        minNodeRadius = 5,
        maxNodeRadius = 10,
        colorRange = d3.schemeCategory10,
        labelPadX = 7,
        labelPadY = -7;
    
    // accessors
    let nodeId = (d, i) => i,
        sizeAttr = null,
        colorAttr = d => "1",
        textAttr = d => "",
        thicknessAttr = d => "";

    function chart(selection) {
        selection.each((data, i, nodes) => {
            let container = d3.select(nodes[i]);

            // initialize
            // --------------------------------------------------------

            let svgEnter = container.selectAll("svg")
                .data([data])
                .enter()
                .append("svg")
                    .attr("width", width)
                    .attr("height", height);
            
            let svg = container.select("svg");

            var zoom_handler = d3.zoom()
                .on("zoom", zoom_actions);

            zoom_handler(svg);

            function zoom_actions(){
                g.attr("transform", d3.event.transform)
                sizeScale.range([
                    minNodeRadius / d3.event.transform.k,
                    maxNodeRadius / d3.event.transform.k
                ]);
                thicknessScale.range([
                    0 / d3.event.transform.k,
                    4 / d3.event.transform.k
                ]);
                g.selectAll(".node")
                    .attr("r", d => {
                        if (typeof(sizeAttr) == "function") {
                            return sizeScale(sizeAttr(d));
                        }
                        else {
                            return minNodeRadius / d3.event.transform.k;
                        }
                    })
                g.selectAll(".link")
                    .attr("stroke-width", d => thicknessScale(thicknessAttr(d)));
            } 

            let gEnter = svg.selectAll("svg")
                .data([data])
                .enter()
                .append("g")
                    .attr("class", "graph"); 

            let g = svg.selectAll(".graph")
                .attr("class", "graph");

            let gExit = svg.selectAll(".graph")
                .data([data])
                .exit()
                .remove();

            // merge new data with old ones, in order to maintain previous node positions
            // TODO: Make it more efficient (?)
            let oldNodeData = g.selectAll(".node").data();
            data.nodes = data.nodes.map(d => {
                let existing = oldNodeData.find(v => nodeId(v) == nodeId(d));
                if (existing) {
                    return existing;
                }
                else {
                    return d;
                }
            });

            // let oldEdgeData = svg.selectAll(".link").data();
            // console.log(oldEdgeData);


            // setup force simulation
            // ---------------------------------------------------------

            let forceSim = d3.forceSimulation()
                .force("charge", d3.forceManyBody())
                .force("link", d3.forceLink())
                .force("center", d3.forceCenter(width / 2, height / 2))
                .on("tick", () => {
                    g.selectAll(".node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y);

                    g.selectAll(".nodeLabel")
                        .attr("x", d => d.x + labelPadX)
                        .attr("y", d => d.y + labelPadY);

                    g.selectAll(".link")
                        .attr("x1", d => d.source.x)
                        .attr("x2", d => d.target.x)
                        .attr("y1", d => d.source.y)
                        .attr("y2", d => d.target.y);
                });
            
            forceSim.alpha(0);
            forceSim.alphaDecay(0.02);
            forceSim.velocityDecay(0.2);
            forceSim.nodes(data.nodes)
            forceSim.force("charge")
                .strength(chargeStrength);
            forceSim.force("link")
                .id(nodeId)
                .distance(linkDistance)
                .links(data.edges);
            
            
            // scales
            // ---------------------------------------------------
            
            let sizeScale = d3.scaleSqrt()
                .domain([1, d3.max(data.nodes, sizeAttr)])
                .range([minNodeRadius, maxNodeRadius]);
            
            let colorScale = d3.scaleOrdinal()
                .domain(data.nodes.map(colorAttr))
                .range(colorRange);

            let thicknessScale = d3.scaleLinear()
                .domain([0, d3.max(data.edges, thicknessAttr)])
                .range([0, 4]);
            
            
            // links
            // ----------------------------------------------------

            let graphLinksEnter = g.selectAll(".link")
                .data(data.edges)
                .enter()
                .append("line")
                    .attr("class", "link")
                .each(() => {
                    // restart the simulation on data enter
                    forceSim.alpha(1);
                });
            
            let graphLinks = g.selectAll(".link")
                .data(data.edges)
                .attr("stroke", "lightgray")
                .attr("stroke-width", d => thicknessScale(thicknessAttr(d)));
            
            let graphLinksExit = g.selectAll(".link")
                .data(data.edges)
                .exit()
                .each(() => {
                    // restart the simulation on data exit
                    forceSim.alpha(1);
                })
                .remove();
            
            // nodes
            // -----------------------------------------------------

            let graphNodesEnter = g.selectAll(".node")
                .data(data.nodes, nodeId)
                .enter()
                .append("circle")
                    .attr("class", "node")
                .each(() => {
                    // restart the simulation on data enter
                    forceSim.alpha(1);
                });
            
            let graphNodes = g.selectAll(".node")
                .data(data.nodes, nodeId)
                .attr("r", d => typeof(sizeAttr) == "function" ? sizeScale(sizeAttr(d)) : minNodeRadius)
                .attr("fill", d => colorScale(colorAttr(d)));
            
            let graphNodesExit = g.selectAll(".node")
                .data(data.nodes, nodeId)
                .exit()
                .each(() => {
                    // restart the simulation on data exit
                    forceSim.alpha(1);
                })
                .remove();
            
            
            // node labels
            // -----------------------------------------------------

            let graphNodeLabelsEnter = g.selectAll(".nodeLabel")
                .data(data.nodes, nodeId)
                .enter()
                .append("text")
                    .attr("class", "nodeLabel");
            
            let graphNodeLabels = g.selectAll(".nodeLabel")
                .data(data.nodes, nodeId)
                .text(d => textAttr(d));
            
            let graphNodeLabelsExit = g.selectAll(".nodeLabel")
                .data(data.nodes, nodeId)
                .exit()
                .remove();

            // set starting zoom level
            let zoomOrder = Math.round(3 * Math.log10(data.nodes.length) - 2);
            let zoomScale = Math.exp((-zoomOrder + 1) * 0.5);
            zoom_handler.scaleTo(svg, zoomScale);
        });
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    }

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    }

    chart.chargeStrength = function(value) {
        if (!arguments.length) return chargeStrength;
        chargeStrength = value;
        return chart;
    }

    chart.linkDistance = function(value) {
        if (!arguments.length) return linkDistance;
        linkDistance = value;
        return chart;
    }

    chart.minNodeRadius = function(value) {
        if (!arguments.length) return minNodeRadius;
        minNodeRadius = value;
        return chart;
    }

    chart.maxNodeRadius = function(value) {
        if (!arguments.length) return maxNodeRadius;
        maxNodeRadius = value;
        return chart;
    }

    chart.colorRange = function(value) {
        if (!arguments.length) return colorRange;
        colorRange = value;
        return chart;
    }

    chart.labelPadX = function(value) {
        if (!arguments.length) return labelPadX;
        labelPadX = value;
        return chart;
    }

    chart.labelPadY = function(value) {
        if (!arguments.length) return labelPadY;
        labelPadY = value;
        return chart;
    }

    chart.nodeId = function(value) {
        if (!arguments.length) return nodeId;
        nodeId = value;
        return chart;
    }

    chart.sizeAttr = function(value) {
        if (!arguments.length) return sizeAttr;
        sizeAttr = value;
        return chart;
    }

    chart.colorAttr = function(value) {
        if (!arguments.length) return colorAttr;
        colorAttr = value;
        return chart;
    }

    chart.textAttr = function(value) {
        if (!arguments.length) return textAttr;
        textAttr = value;
        return chart;
    }

    chart.thicknessAttr = function(value) {
        if (!arguments.length) return thicknessAttr;
        thicknessAttr = value;
        return chart;
    }

    return chart;
}
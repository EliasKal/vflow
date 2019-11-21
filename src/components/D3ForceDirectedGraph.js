function D3ForceDirectedGraph(containerID){
    Component.call(this);

    // component specification
    this.name = "D3ForceDirectedGraph";
    this.desc = "Produces a D3 force-directed graph of the input data.";
    this.inputDesc = {
        nodeId: {type: "function", desc: "The function for node id.", default: d => d.id}, // must be first
        data: {type: "array", desc: "The input data.", default: {}},
        width: {type: "number", desc: "The width.", default: 500},
        height: {type: "number", desc: "The height.", default: 500},
        chargeStrength: {type: "number", desc: "The charge strength.", default: -100},
        linkDistance: {type: "number", desc: "The link distance.", default: 50},
        minNodeRadius: {type: "number", desc: "The minimum node radius.", default: 5},
        maxNodeRadius: {type: "number", desc: "The maximum node radius.", default: 10},
        colorRange: {type: "d3.schemeCategory", desc: "The color range.", default: d3.schemeCategory10},
        labelPadX: {type: "number", desc: "The label pad for X-axis.", default: 7},
        labelPadY: {type: "number", desc: "The label pad for Y-axis.", default:-7},
        sizeAttr: {type: "function", desc: "The function for size attribute.", default: null},
        colorAttr: {type: "function", desc: "The function for color attribute.", default: d => "1"},
        textAttr: {type: "function", desc: "The function for text attribute.", default: d => ""},
        thicknessAttr: {type: "function", desc: "The function for thickness attribute.", default: d => ""}
    };
    this.outputDesc = {};
    this.init();

    rxjs.combineLatest(
        this.inputs["data"],
        this.inputs["width"],
        this.inputs["height"],
        this.inputs["chargeStrength"],
        this.inputs["linkDistance"],
        this.inputs["minNodeRadius"],
        this.inputs["maxNodeRadius"],
        this.inputs["colorRange"],
        this.inputs["labelPadX"],
        this.inputs["labelPadY"],
        this.inputs["nodeId"],
        this.inputs["sizeAttr"],
        this.inputs["colorAttr"],
        this.inputs["textAttr"],
        this.inputs["thicknessAttr"]
    ).subscribe(([
        data,
        width,
        height,
        chargeStrength,
        linkDistance,
        minNodeRadius,
        maxNodeRadius,
        colorRange,
        labelPadX,
        labelPadY,
        nodeId,
        sizeAttr,
        colorAttr,
        textAttr,
        thicknessAttr
    ]) => {

        if (data) {

            if (Array.isArray(data.nodes) == false){
                this.warn("'data.nodes' must be an array.");
                return;
            }

            if (data.nodes.length == 0){ 
                this.warn("'data.nodes' is empty.");
                return;
            }    

            if (Array.isArray(data.edges) == false){
                this.warn("'data.edges' must be an array.");
                return;
            } 

            let chartFun = forceDirectedGraph()
                .width(width)
                .height(height)
                .chargeStrength(chargeStrength)
                .linkDistance(linkDistance)
                .minNodeRadius(minNodeRadius)
                .maxNodeRadius(maxNodeRadius)
                .colorRange(colorRange)
                .labelPadX(labelPadX)
                .labelPadY(labelPadY)
                .nodeId(nodeId)
                .sizeAttr(sizeAttr)
                .colorAttr(colorAttr)
                .textAttr(textAttr)
                .thicknessAttr(thicknessAttr);

            d3.select("#" + containerID)
                .datum(data)
                .call(chartFun);    
        }

    });
}
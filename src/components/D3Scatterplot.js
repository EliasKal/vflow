function D3Scatterplot(containerID, width=300, height=300) {
    Component.call(this);

    // component specification
    this.name = "D3Scatterplot";
    this.desc = "Produces a scatterplot of the input data.";
    this.inputDesc = {
        data: { type: "array", desc: "The input data.", default: [] },
        xAttr: { type: "string", desc: "The name of the attribute to use for the x-axis.", default: "x" },
        yAttr: { type: "string", desc: "The name of the attribute to use for the y-axis.", default: "y" },
        // colorAttr: { type: "string", desc: "The name of the attribute to use for the color of the items." },
        // sizeAttr: { type: "string", desc: "The name of the attribute to use for the size of the items." }
    };
    this.outputDesc = {
        clicked: { type: "object", desc: "The data of the clicked item." },
        clickedIndex: { type: "number", desc: "The index of the clicked item." }
    };
    this.init();


    // functionalities

    rxjs.combineLatest(
        this.inputs["data"],
        this.inputs["xAttr"],
        this.inputs["yAttr"],
        // this.inputs["colorAttr"],
        // this.inputs["sizeAttr"]
    ).subscribe(([
        data,
        xAttr,
        yAttr,
        // colorAttr,
        // sizeAttr
    ]) => {
        let chart = scatterplot()
            .width(width)
            .height(height)
            .xAttr(xAttr)
            .yAttr(yAttr)
            .onclick((d, i, nodes) => {
                this.output("clicked", d);
                this.output("clickedIndex", i);
            });
        
        d3.select("#" + containerID)
            .datum(data)
            .call(chart);
    });
}

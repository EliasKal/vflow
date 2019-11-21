function D3RadarChart(containerID){
    Component.call(this);

    // component specification
    this.name = "D3Radarchart";
    this.desc = "Produces a D3 radar chart of the input data.";
    this.inputDesc = {
        data: { type: "array", desc: "The input data." },
        width: { type: "number", desc: "The width.", default: 600 },
        height: { type: "number", desc: "The height." , default: 400 },
        radius: { type: "number", desc: "The radius.", default: 150 },
        axisInnerPad: { type: "number", desc: "The axis inner pad.", default: 20 },
        axisOuterPad: { type: "number", desc: "The axis outer pad.", default: 30 },
        textPad: { type: "number", desc: "The text pad.", default: 20 },
        legendWidth: { type: "number", desc: "The legend width.", default: 180 },
        legendPad: { type: "number", desc: "The legend pad.", default: 10 },
        showAxisLabels: { type: "boolean", desc: "If axis labels are shown.", default: true },
        showLegend: { type: "boolean", desc: "If legend is shown.", default: true },
        axes: { type: "array", desc: "The axes.", default: [] },
        idFun: { type: "function", desc: "This function returns the text to show as legend label.", default: (d,i)=>i }
    };
    this.outputDesc = {};
    this.init();

    rxjs.combineLatest(
        this.inputs["data"],
        this.inputs["width"],
        this.inputs["height"],
        this.inputs["radius"],
        this.inputs["axisInnerPad"],
        this.inputs["axisOuterPad"],
        this.inputs["textPad"],
        this.inputs["legendWidth"],
        this.inputs["legendPad"],
        this.inputs["showAxisLabels"],
        this.inputs["showLegend"],
        this.inputs["axes"],
        this.inputs["idFun"]
    ).subscribe(([
        data,
        width,
        height,
        radius,
        axisInnerPad,
        axisOuterPad,
        textPad,
        legendWidth,
        legendPad,
        showAxisLabels,
        showLegend,
        axes,
        idFun
    ]) => {

        if (data) {

            if (!Array.isArray(data)) {
                this.warn("'data' must be an array.");
                return;
            }

            if (data.length == 0) {
                this.warn("there are no data");
                return;
            }

            let chartFun = radarChart()
                .width(width)
                .height(height)
                .radius(radius)
                .axisInnerPad(axisInnerPad)
                .axisOuterPad(axisOuterPad)
                .textPad(textPad)
                .legendWidth(legendWidth)
                .legendPad(legendPad)
                .showAxisLabels(showAxisLabels)
                .showLegend(showLegend)
                .axes(axes)
                .idFun(idFun);

            d3.select("#" + containerID)
                .datum(data)
                .call(chartFun);    
        }

    });
}
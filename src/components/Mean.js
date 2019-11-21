function Mean() {
    Component.call(this);

    // component specification
    this.name = "Mean";
    this.desc = "Compute the mean value of a data column (attribute).";
    this.inputDesc = {
        data: {type: "array", desc: "The input data.", default: []},
        attr: {type: "string", desc: "The name of the desired column (attribute).", default: ""}
    };
    this.outputDesc = {
        out: {type: "number", desc: "The computed mean value."}
    };
    this.init();


    // functionalities

    rxjs.combineLatest(
        this.inputs["data"],
        this.inputs["attr"]
    ).subscribe(([data, attr]) => {
        if (!Array.isArray(data)) {
            this.warn("'data' must be an array.");
            return;
        }
        if (typeof(attr) != "string") {
            this.warn("'attr' must be a string.");
            return;
        }
        
        let res = d3.mean(data, d => d[attr]);
        if (!isNaN(res)) {
            this.output("out", res);
        }
    });
}

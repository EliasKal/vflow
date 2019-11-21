function Transformation(transform) {
    Component.call(this);

    // component specification
    this.name = "Transformation";
    this.desc = "Transforms its input using the function argument.";
    this.inputDesc = {
        input: {type: "any", desc: "The input value.", default: {}},
    };
    this.outputDesc = {
        out: {type: "any", desc: "The transformed value."}
    };
    this.init();


    // functionalities

    this.inputs["input"].subscribe(input => {
        let res = null;
        try {
            res = transform(input);
        }
        catch (err) {
            this.warn("[JS ERROR] " + err.message);
            return;
        }
        this.output("out", res);
    });
}

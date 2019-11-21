function Combination(inputDesc) {
    Component.call(this);

    // component specification
    this.name = "Combination";
    this.desc = "Combines its inputs in an object.";
    if (Array.isArray(inputDesc)) {
        this.inputDesc = {};
        inputDesc.forEach(inputName => {
            this.inputDesc[inputName] = {
                type: "any",
                desc: `The '${inputName}' input.`,
                default: {}
            };
        });
    }
    else {
        this.inputDesc = inputDesc;
    }    
    this.outputDesc = {
        out: {type: "object", desc: "The combined output object."}
    };
    this.init();


    // functionalities

    rxjs.combineLatest(Object.values(this.inputs)).subscribe(res => {
        let obj = {};
        let keys = Object.keys(this.inputs);
        for (let i = 0; i < res.length; i++) {
            obj[keys[i]] = res[i];
        }
        this.output("out", obj);
    });
}

function Value(value) {
    Component.call(this);

    // component specification
    this.name = "Value";
    this.desc = "Sends a value to its output stream.";
    this.inputDesc = {};
    this.outputDesc = {
        out: {type: "object", desc: "The value."}
    };
    this.init();


    // functionalities
    
    this.output("out", value);
}

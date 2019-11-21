function DSVParser() {
    Component.call(this);

    // component specification
    this.name = "DSVParser";
    this.desc = "Converts a DSV (Delimiter-Separated Values) file to JSON.";
    this.inputDesc = {
        txt: {type: "string", desc: "The input DSV string.", default: ""},
        delim: {type: "string", desc: "The delimiter used.", default: ","}
    };
    this.outputDesc = {
        out: {type: "object", desc: "The parsed JSON object."}
    };
    this.init();


    // functionalities

    rxjs.combineLatest(
        this.inputs["txt"],
        this.inputs["delim"]
    ).subscribe(([txt, delim]) => {
        if (txt == null) {
            this.warn("'txt' input is null.");
            return;
        }
        if (delim == null) {
            this.warn("'delim' input is null.");
            return;
        }
        let dsvParser = d3.dsvFormat(delim);
        let output = dsvParser.parse(txt, row => {
            let obj = {...row};
            for (key in obj) {
                if (!isNaN(obj[key])) {
                    obj[key] = +obj[key];
                }
            }
            return obj;
        });
        this.output("out", output);
    });
}

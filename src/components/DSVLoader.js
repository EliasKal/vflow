function DSVLoader() {
    Component.call(this);

    // component specification
    this.name = "DSVLoader";
    this.desc = "Loads a DSV (Delimiter-Separated Values) file into a JSON object.";
    this.inputDesc = {
        filename: {type: "string", desc: "The input filename.", default: null},
        delim: {type: "string", desc: "The delimiter used.", default: null}
    };
    this.outputDesc = {
        out: {type: "object", desc: "The parsed JSON object."}
    };
    this.init();


    // functionalities

    rxjs.combineLatest(
        this.inputs["filename"],
        this.inputs["delim"]
    ).subscribe(([filename, delim]) => {
        if (filename == null) {
            this.warn("'filename' input is null.");
            return;
        }
        if (delim == null) {
            this.warn("'delim' input is null.");
            return;
        }

        d3.dsv(delim, filename, row => {
            let obj = {...row};
            for (key in obj) {
                if (!isNaN(obj[key])) {
                    obj[key] = +obj[key];
                }
            }
            return obj;
        }).then(data => {
            this.output("out", data);
        });
    });
}

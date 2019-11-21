function AnalyticsRESTCall() {
    Component.call(this);

    // component specification
    this.name = "AnalyticsRESTCall";
    this.desc = "Calls an analytics REST service from CERTH's data analytics server.";
    this.inputDesc = {
        url: {type: "string", desc: "The URL of the REST service.", default: ""},
        data: {type: "array", desc: "The data to analyze.", default: []},
        options: {type: "object", desc: "The service options.", default: {}}
    };
    this.outputDesc = {
        response: {type: "object", desc: "The service's response."}
    };
    this.init();

    
    // functionalities


    rxjs.combineLatest(
        this.inputs["url"],
        this.inputs["data"],
        this.inputs["options"]
    ).subscribe(([url, data, options]) => {        
        if (!url || !(typeof(url) == "string")) {
            this.warn("'url' input is not correct.");
            return;
        }
        if (!data || !Array.isArray(data) || data.length <= 0) {
            this.warn("'data' input is empty.");
            return;
        }
        if (!options || !(typeof(options) == "object")) {
            this.warn("'options' input is null.");
            return;
        }
        
        let fetchOptions = {};
        fetchOptions.method = "POST";
        fetchOptions.headers = {"Content-Type": "application/json"};
        fetchOptions.body = JSON.stringify({
            data: data,
            options: options
        });

        fetch(url, fetchOptions).then(response => {
            return response.json();
        }).then(output => {
            this.output("response", output);
        });
    });



    // // VFLOW STYLE:
    // // -----------------------------------------------------

    // let serviceInput = new vf.Combination(["data", "options"])
    //     .input("data", this.inputs["data"])
    //     .input("options", this.inputs["options"]);
    
    // let serviceCall = new vf.RESTCall()
    //     .input("url", this.inputs["url"])
    //     .input("method", "POST")
    //     .input("headers", {"Content-Type": "application/json"})
    //     .input("body", serviceInput.outputs["out"]);
    
    // this.output("response", serviceCall.outputs["response"]);

    

    // // OLD STYLE:
    // // -----------------------------------------------------
    
    // let serviceInput = new vf.Combination({
    //     data: {type: "array", desc: "The service's data.", default: []},
    //     options: {type: "object", desc: "The service's options.", default: {}}
    // });
    // let serviceCall = new vf.RESTCall();
    
    // // setup HTTP parameters
    // serviceCall.input("method", "POST");
    // serviceCall.input("headers", {"Content-Type": "application/json"});

    // // connect sub-components
    // vf.link(this.inputs["url"], serviceCall.inputs["url"]);
    // vf.link(this.inputs["data"], serviceInput.inputs["data"]);
    // vf.link(this.inputs["options"], serviceInput.inputs["options"]);
    // vf.link(serviceInput.outputs["out"], serviceCall.inputs["body"]);
    // vf.link(serviceCall.outputs["response"], this.outputs["response"]);
}
function RESTCall() {
    Component.call(this);

    // component specification
    this.name = "RESTCall";
    this.desc = "Calls a REST service.";
    this.inputDesc = {
        url: {type: "string", desc: "The URL of the REST service.", default: ""},
        method: {type: "string", desc: "The HTTP method to use (e.g. GET, POST).", default: ""},
        headers: {type: "object", desc: "The HTTP headers to use.", default: {"Content-Type": "application/json"}},
        body: {type: "object", desc: "The body of the call, as a JSON object.", default: {}}
    };
    this.outputDesc = {
        response: {type: "object", desc: "The service's response."}
    };
    this.init();


    // functionalities

    rxjs.combineLatest(
        this.inputs["url"],
        this.inputs["method"],
        this.inputs["headers"],
        this.inputs["body"]
    ).subscribe(([url, method, headers, body]) => {        
        if (url == "") {
            this.warn("'url' input is null.");
            return;
        }
        if (method == "") {
            this.warn("'method' input is null.");
            return;
        }
        
        let fetchOptions = {};
        fetchOptions.method = method;
        if (headers) {
            fetchOptions.headers = headers;
        }
        if (body) {
            fetchOptions.body = JSON.stringify(body);
        }

        fetch(url, fetchOptions).then(response => {
            let contentTypes = response.headers.get("content-type");
            if (contentTypes.indexOf("application/json") != -1) {
                return response.json();
            }
            else {
                return response.text();
            }
        }).then(output => {
            this.output("response", output);
        });
    });
}
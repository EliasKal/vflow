function Component() {
    // initialize input and output streams
    this.init = function() {
        this.inputs = {};
        for (key in this.inputDesc) {
            let defVal = this.inputDesc[key].default;
            if (typeof(defVal) === "undefined") {
                this.warn(`No default value provided for input '${key}'.`);
            }
            this.inputs[key] = new rxjs.BehaviorSubject(defVal);
            this.inputs[key]._vfcomponent = this;
            this.inputs[key]._vfname = key;
            this.inputs[key]._affected = [];
        }
        this.outputs = {};
        for (key in this.outputDesc) {
            this.outputs[key] = new rxjs.BehaviorSubject();
            this.outputs[key]._vfcomponent = this;
            this.outputs[key]._vfname = key;
            this.outputs[key]._affected = [];
        }
        // this.affected = {};
        // for (key in this.outputDesc) {
        //     this.affected[key] = [];
        // }
    }

    // // set an input of a component to a value or to a stream
    // this.input = function(name, value, transform = d => d) {
    //     if (value instanceof rxjs.BehaviorSubject) {
    //         value._vfcomponent.affected[value._vfname].push(this);
    //         value.subscribe(d => {
    //             if (typeof(d) === "undefined") {
    //                 return;
    //             }
    //             let res = null;
    //             try {
    //                 res = transform(d);
    //             }
    //             catch (err) {
    //                 this.warn("[JS ERROR] " + err.message);
    //                 return;
    //             }
    //             this.inputs[name].next(res);
    //         });
    //     }
    //     else {
    //         let res = null;
    //         try {
    //             res = transform(value);
    //         }
    //         catch (err) {
    //             this.warn("[JS ERROR] " + err.message);
    //             return;
    //         }
    //         this.inputs[name].next(res);
    //     }
    //     return this;
    // }

    // set an input of a component to a value or to a stream
    this.input = function(name, value, transform = d => d) {
        if (value instanceof rxjs.BehaviorSubject) {
            // value._vfcomponent.affected[value._vfname].push(this);
            value._affected.push(this);
            value.subscribe(d => {
                if (typeof(d) === "undefined") {
                    return;
                }
                let res = null;
                try {
                    res = transform(d);
                }
                catch (err) {
                    this.warn("[JS ERROR] " + err.message);
                    return;
                }
                this.inputs[name].next(res);
            });
        }
        else {
            let res = null;
            try {
                res = transform(value);
            }
            catch (err) {
                this.warn("[JS ERROR] " + err.message);
                return;
            }
            this.inputs[name].next(res);
        }
        return this;
    }

    // set an output of a component to a value or to a stream
    this.output = function(name, value, transform = d => d) {
        if (value instanceof rxjs.BehaviorSubject) {
            value._affected.push(this);
            value.subscribe(d => {
                if (typeof(d) === "undefined") {
                    return;
                }
                let res = null;
                try {
                    res = transform(d);
                }
                catch (err) {
                    this.warn("[JS ERROR] " + err.message);
                    return;
                }
                this.outputs[name].next(res);
            });
        }
        else {
            let res = null;
            try {
                res = transform(value);
            }
            catch (err) {
                this.warn("[JS ERROR] " + err.message);
                return;
            }
            this.outputs[name].next(res);
        }
        return this;
    }

    // display a warning on the console
    this.warn = function(msg) {
        console.warn(`[${this.name}]`, msg);
    }

    // log an output of a component on the console
    this.log = function(outName) {
        this.outputs[outName].subscribe(d => {
            if (typeof(d) === "undefined") {
                return;
            }
            console.log(`[${this.name}:${outName}]`, d)
        });
        return this;
    }
}


// Links one stream to another
function link(fromStream, toStream, transform = d => d) {
    if (Array.isArray(toStream)) {
        toStream.forEach(toStreamElem => {
            fromStream.subscribe(d => toStreamElem.next(transform(d)));
        });
    }
    else {
        fromStream.subscribe(d => toStream.next(transform(d)));
    }
}

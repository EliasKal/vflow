function HTMLSlider(containerID) {
    Component.call(this);

    // component specification
    this.name = "HTMLSlider";
    this.desc = "Renders a slider.";
    this.inputDesc = {
        range: {type: "array", desc: "The range covered by the slider.", default: []},
        initialValue: {type: "number", desc: "The initial selected value in the slider.", default: 0}
    };
    this.outputDesc = {
        value: {type: "number", desc: "The selected value in the slider."}
    };
    this.init();


    // functionalities

    rxjs.combineLatest(
        this.inputs["range"], 
        this.inputs["initialValue"]
    ).subscribe(([
        range, 
        initialValue
    ]) => {
        
        if (!Array.isArray(range)) {
            this.warn("'range' must be an array.");
            return;
        }

        if (isNaN(initialValue)) {
            this.warn("'initialValue' must be a number.");
        }    

        let container = document.getElementById(containerID);
        if (!container) {
            this.warn(`DOM element with ID '${containerID}' does not exist.`);
            return;
        }
        
        // render element
        let elemID = `${containerID}_elem`;
        document.getElementById(containerID).innerHTML = `
                    <input type="range" min="${range[0]}" max="${range[1]}" value="${initialValue}" class="slider" id="${elemID}">
                `;
        let renderElem = document.getElementById(elemID);

        // setup outputs
        this.output("value", initialValue);
        renderElem.addEventListener('input', (event) => {
            this.output("value", parseInt(event.target.value));
        });
    });
}
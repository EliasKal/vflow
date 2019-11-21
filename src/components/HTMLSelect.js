function HTMLSelect(containerID) {
    Component.call(this);

    // component specification
    this.name = "HTMLSelect";
    this.desc = "Renders a select box.";
    this.inputDesc = {
        data: {type: "array", desc: "The list of options to show.", default: []}
    };
    this.outputDesc = {
        selected: {type: "string", desc: "The selected value."}
    };
    this.init();


    // functionalities

    this.inputs["data"].subscribe(data => {
        if (!Array.isArray(data)) {
            this.warn("'data' must be an array.");
            return;
        }

        let container = document.getElementById(containerID);
        if (!container) {
            this.warn(`DOM element with ID '${containerID}' does not exist.`);
            return;
        }
        
        // render element
        let elemID = `${containerID}_elem`;
        document.getElementById(containerID).innerHTML = `
            <select id="${elemID}">
                ${data.map(opt => `<option value=${opt}>${opt}</option>`)}
            </select>
        `;
        let selectElem = document.getElementById(elemID);

        // setup outputs
        this.output("selected", data[0]);
        selectElem.addEventListener('change', (event) => {
            this.output("selected", event.target.value);
        });
    });
}
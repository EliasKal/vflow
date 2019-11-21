function HTMLMultiSelect(containerID) {
    Component.call(this);

    // component specification
    this.name = "HTMLMultiSelect";
    this.desc = "Renders a multi select box.";
    this.inputDesc = {
        data: {type: "array", desc: "The list of options to show.", default: []}
    };
    this.outputDesc = {
        selected: {type: "array", desc: "The selected values."}
    };
    this.init();


    // functionalities

    this.inputs["data"].subscribe(data => {
        if (!Array.isArray(data)) {
            this.warn("'data' must be an array.");
            return;
        }

        // if the new data are the same as the current, do nothing (to avoid re-rendering the options).
        if (arraysEqual(this.data, data)) {
            return;
        }

        this.data = data;

        let container = document.getElementById(containerID);
        if (!container) {
            this.warn(`DOM element with ID '${containerID}' does not exist.`);
            return;
        }
        
        // render element
        let elemID = `${containerID}_elem`;
        document.getElementById(containerID).innerHTML = `
            <select multiple size="10" id="${elemID}">
                ${data.map(opt => `<option value=${opt}>${opt}</option>`)}
            </select>
        `;
        let selectElem = document.getElementById(elemID);

        // setup outputs
        this.output("selected", data[0]);
        selectElem.addEventListener('change', (event) => {
            let options = new Array(selectElem.options.length);
            for (let i = 0; i < options.length; i++) {
                options[i] = selectElem.options[i];
            }
            let selectedVals = options
                .filter(opt => opt.selected)
                .map(opt => opt.value);
            this.output("selected", selectedVals);
        });
    });

    function arraysEqual(arr1, arr2) {
        if ((!arr1) || (!arr2)) {
            return false;
        }
        if (arr1.length != arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }
}
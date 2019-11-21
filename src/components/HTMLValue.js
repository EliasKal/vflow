function HTMLValue(containerID) {
    Component.call(this);

    // component specification
    this.name = "HTMLValue";
    this.desc = "Renders a value in the page.";
    this.inputDesc = {
        value: {type: "any", desc: "The value to show.", default: ""}
    };
    this.outputDesc = {};
    this.init();


    // functionalities

    this.inputs["value"].subscribe(value => {
        let container = document.getElementById(containerID);
        if (!container) {
            this.warn(`DOM element with ID '${containerID}' does not exist.`);
            return;
        }
        
        // render element
        document.getElementById(containerID).innerHTML = value.toString();
    });
}
function Datatable(containerID, scrollX=false, scrollY=false, rowSelection=true) { //container ID
    var _this = this;
    Component.call(_this);

    // component specification
    _this.name = "Datatable";
    _this.desc = "Produces a table with the input data.";
    _this.inputDesc = {
        data: { type: "array of objects", desc: "The input data.", default: []}
    };
    _this.outputDesc = {
        selectedItems: { type: "array", desc: "The indexes of the selected items." },
        selectedItemsData: { type: "array of objects", desc: "The data of the selected items." }
    };
    _this.init();

   
    
    rxjs.combineLatest(_this.inputs["data"]).subscribe(([data]) => {

        if (Array.isArray(data) == false)
            return;

        if (data) {
          
            if (!containerID) {
                this.warn(`DOM element with ID '${containerID}' does not exist.`);
                return;
            }
        
            let elemID = `${containerID}_elem`;
            document.getElementById(containerID).innerHTML = `<table id="${elemID}" class="display" width="100%"></table>`;
        
            var dataSet = [];
            var fields = [];
        
            for (record of data) {
                var keys = Object.keys(record);
                for (key of keys) {
                    if (!fields.includes(key)) {
                        fields.push(key);
                    }
                }
            }
            var columns = fields.map(d => ({title: d}));
        
            for (var i = 0; i < data.length; i++) {
                dataSet.push([]);
        
                for (var j = 0; j < columns.length; j++) {
                    var fieldName = columns[j].title;
                    if (data[i][fieldName]) {
                        dataSet[i].push(data[i][fieldName]);
                    }
                    else {
                        dataSet[i].push(null);
                    }
                }
            }
        
            if ( $.fn.dataTable.isDataTable( "#" + elemID ) ) {
                datatable = $("#" + elemID).DataTable();
                datatable.destroy();
                document.getElementById(elemID).innerHTML = "";
            }
        
            if (data.length == 0) {
                return;
            }

            var options = {
                data: dataSet,
                columns: columns,
                scrollX: scrollX,
                scrollY: scrollY,
                scrollCollapse: true,
                select: false
            };

            if (rowSelection)
                options.select = {
                    style: 'os',
                    items: 'row'
                };
        
            var datatable = $("#" + elemID).DataTable(options);

            if (scrollX != false) 
                $('#' + containerID + '_elem_wrapper.dataTables_wrapper').css('width', scrollX);  

            window.dispatchEvent(new Event('resize')); // fixes bug with headers

            $('#' + containerID).on('click', 'tr', function () {
                if (rowSelection){
                    var rowsSelected = datatable.rows('.selected');
                    var selectedItems = rowsSelected[0];
                    _this.output("selectedItems", selectedItems);

                    var selectedItemsData = [];
                    for (var i = 0; i < data.length; i++) {
                        if (selectedItems.indexOf(i) >= 0)
                            selectedItemsData.push(data[i]);
                    }
                    _this.output("selectedItemsData", selectedItemsData);
                }
            });      
                    
        }
    });

}
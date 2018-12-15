//  JQuery: 
$(document).ready(function(){
    $("#btnCreate").click(function(){
        window.alert("ready to create.");
        //window.location.href = "/db/create";
    });

    $("#btnExport").click(function(){
        window.alert("ready to export.");
        //window.location.href = "/db/export/?";
    });

    $("#btnRemove").click(function(){
        if (window.confirm("Notice: This action is in risk.\r\nPlease confirm if you really want to remove all files?")) {
            window.alert("ready to remove.");
            //window.location.href = "/db/remove/?";
        }
    });
});
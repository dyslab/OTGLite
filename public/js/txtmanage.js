//  JQuery: 
$(document).ready(function(){
    $("#btnExport").click(function(){
        //window.alert("ready to export.");
        window.location.href = "/txt/export";
    });

    $("#btnRemove").click(function(){
        if (window.confirm("Notice: This action is in risk.\r\nPlease confirm if you really want to remove all files?")) {
            //window.alert("ready to remove.");
            window.location.href = "/txt/remove";
        }
    });
});
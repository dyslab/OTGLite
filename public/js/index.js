//  JQuery: 
$(document).ready(function(){
    // Get the base link of "http://...".
    function getBaseLink(link) {
        var tmpLinkArr = link.split(/\//);
        return tmpLinkArr.slice(0,3).join("/");
    }

    // TXT version: Grab online txt.
    function grabee(link, saveto, counter, number) {
        if (counter<=number) {
            // Ajax POST method
            $.get("/otg/"+saveto+"/240", { link: link }, function(json) {
                res = JSON.parse(json);
                if (res.errcode === 0) {
                    if (saveto === "txt") 
                        $("#taOtgRes").val(">>> file [" + res.filename + "] saved.\r\n" + $("#taOtgRes").val());
                    else
                        $("#taOtgRes").val(">>> database record [" + res.filename + "] saved.\r\n" + $("#taOtgRes").val());
                    $("#taOtgRes").val("=== ready to process next link [" + res.nextlink + "] ===\r\n" + $("#taOtgRes").val());
                    grabee(getBaseLink(link) + res.nextlink, saveto, counter+1, number);
                }
                else {
                    $("#taOtgRes").val(">>> Finish.\r\n>>> process failed. (Note: It may be the last chapter.)\r\n>>> errcode = " + res.errcode + ", Abort!\r\n" + $("#taOtgRes").val());
                }
            });
        }
        else {
            $("#taOtgRes").val(">>> Finish.\r\n>>> congratulations! fetched " + (counter-1) + " files successfully.\r\n" + $("#taOtgRes").val());
        }
    }
    
    $("#btnOtg").click(function(){
        $("#taOtgRes").val(">>> grabee go...");
        grabee($("#txtOtg").val(), $("#opSaveTo").val(), 1, $("#maxPages").val());
    });
});
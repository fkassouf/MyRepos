$(document).ajaxStart(function () {
    $.LoadingOverlay("show", {
        image: "~/images/Eclipse-2s-200px.gif"

    });
});
$(document).ajaxStop(function () {
    $.LoadingOverlay("hide");
});



$(function () {
  
    switch (PageIndex) {

        case '0':
            $('#liVoting a').addClass('active');
            $('#liBulkVoting a').removeClass('active');
            $('#liResults a').removeClass('active');
            break;
        case '1':
            $('#liVoting a').removeClass('active');
            $('#liBulkVoting a').addClass('active');
            $('#liResults a').removeClass('active');
            break;
        case '2':
            $('#liVoting a').removeClass('active');
            $('#liBulkVoting a').removeClass('active');
            $('#liResults a').addClass('active');
            break;
    }

            
        
    });

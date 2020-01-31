$(document).ajaxStart(function () {
    $.LoadingOverlay("show", {
        image: "/images/Eclipse-2s-200px.gif"

    });
});
$(document).ajaxStop(function () {
    $.LoadingOverlay("hide");
});
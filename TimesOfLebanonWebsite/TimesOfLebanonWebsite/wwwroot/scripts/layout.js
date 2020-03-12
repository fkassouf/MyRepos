$(document).ready(function () {
    RenderMenu();
});

$(document).ajaxStart(function () {
    $.LoadingOverlay("show", {
        image: "/img/Pulse.gif",
        imageAnimation: false
    });
});
$(document).ajaxStop(function () {
    $.LoadingOverlay("hide");
});


function RenderMenu() {
    $.ajax({
        url: '/home/GetCategories',
        type: 'Get',
        processData: false,
        contentType: false,
        success: function (data, textStatus, xhr) {
            let arr = data;

            let ul = $('#ulMenu');
            ul.append('<li class="active"><a href="/">الرئيسية</a></li>');


            let footerWidget = $('#divFooterWidget');
            let htmlFooter = '';


            htmlFooter += '<div class="col-12 col-sm-6 col-lg-4">';
            htmlFooter += '<div class="footer-widget-area mt-80">';
            htmlFooter += '<div class="footer-logo">';    
            htmlFooter += '<a href="index.html"><img src="/img/core-img/Times_Logo2 3.png" alt=""></a>';
            htmlFooter += '</div>';
            htmlFooter += '<ul class="list">';
            htmlFooter += '<li><a href="mailto:contact@youremail.com">contact@timesoflebanon.com</a></li>';
            htmlFooter += '<li><a href="tel:+4352782883884">+43 5278 2883 884</a></li>';
            htmlFooter += '<li><a href="http://www.timesoflebanon.com">www.timesoflebanon.com</a></li>';
            htmlFooter += '</ul>';
            htmlFooter += '</div>';
            htmlFooter += '</div>';

            

            $.each(arr, function (key, value) {
                //alert(key + ": " + value);
                
                ul.append('<li><a href="#' + value.name + '">' + value.nameAR + '</a></li>');

               
                htmlFooter += '<div class="col-12 col-sm-6 col-lg-1">';
                htmlFooter += '<div class="footer-widget-area mt-80">';
                htmlFooter += '<h4 class="widget-title"></h4>';  
                htmlFooter += '<ul class="list">';
                htmlFooter += '<li><a href="#">' + value.nameAR + '</a></li>';
                htmlFooter += '</div>';
                htmlFooter += '</div>';          
                       
                    
            });

            
            footerWidget.html(htmlFooter);



        },
        error: function (xhr, textStatus, errorThrown) {
            alert('Error occuried: Contact your system administrator');
        }
    });
}
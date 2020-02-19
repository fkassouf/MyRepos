var allNewsArr = new Array();

$(document).ready(function () {
    $('.demo1').easyTicker({
        direction: 'up',
        visible: 3,
        interval: 2500,
        controls: {
            up: '.btnUp',
            down: '.btnDown',
            toggle: '.btnToggle'
        }
    });
    moment.locale('ar');

    moment.updateLocale('ar', {
        months: [
            "كانون الثاني", "شباط", "اذار", "نيسان", "ايار", "حزيران", "تموز",
            "آب", "ايلول", "تشرين الاول", "تشرين الثاني", "كانون الاول"
        ]
    });

    GetTodayNews();
    

   
    
    
});


function toggleNews(sender) {
    if ($(sender).hasClass("fa fa-pause btnToggle")) {
        $(sender).removeClass("fa fa-pause btnToggle");
        $(sender).addClass("fa fa-play btnToggle");
    }
    else {
        $(sender).removeClass("fa fa-play btnToggle");
        $(sender).addClass("fa fa-pause btnToggle");
    }
}

function GetTodayNews() {
    let html = "";
    html += '<ul>';
    let ulBreakingNewsTicker = $('ulBreakingNewsTicker');
    let displayBreakingNews = false;
    $.ajax({
        url: '/home/GetTodayNews',
        type: 'Get',
        processData: false,
        contentType: false,
        success: function (data, textStatus, xhr) {
            let arr = data;
            allNewsArr = data;
            let ulLatestNews = $('#ulLatestNews');
            for (let i = 0; i < arr.length; i++) {

                let news = arr[i];
                
                if (i == 0) {
                    $('#imgFirstPost').prop('src', news.photo);
                    $('#imgFirstPost').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#imgFirstPost').parent().prop('target', '_blank');
                    
                    $('#lnkFirstPostCategory').text(news.categoryNameAR);
                    $('#lnkFirstPostDate').text(moment(news.creationDate).startOf('minute').fromNow());
                    $('#lnkFirstPostTitle').text(news.title);
                    $('#lnkFirstPostTitle').parent().prop('href', '/subindex');
                    $('#lnkFirstPostTitle').parent().prop('target', '_blank');
                    let subject = news.subject;
                    if (subject.length > 500) {
                        $('#divFirstPostSubject').html(subject.substring(0, 499) + "...<br><a class='post-catagory' style='cursor:pointer' href='/subindex?id='" + btoa(news.id) + ">أقرأ المزيد</a>");
                    }
                    else {
                        $('#divFirstPostSubject').text(subject);
                    }
                }

                else if (i == 1) {
                    $('#imgSecondPost').prop('src', news.photo);
                    $('#imgSecondPost').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#imgSecondPost').parent().prop('target', '_blank');

                    $('#lnkSecondPostCategory').text(news.categoryNameAR);
                    $('#lnkSecondPostDate').text(moment(news.creationDate).startOf('minute').fromNow());
                    $('#lnkSecondPostTitle').text(news.title);
                    $('#lnkSecondPostTitle').parent().prop('href', '/subindex');
                    $('#lnkSecondPostTitle').parent().prop('target', '_blank');
                    let subject = news.subject;
                    if (subject.length > 500) {
                        $('#divSecondPostSubject').html(subject.substring(0, 499) + "...<br><a class='post-catagory' style='cursor:pointer' href='/subindex?id='" + btoa(news.id) + ">أقرأ المزيد</a>");
                    }
                    else {
                        $('#divSecondPostSubject').text(subject);
                    }
                }


                else if (i == 2) {
                    $('#imgThirdPost').prop('src', news.photo);
                    $('#imgThirdPost').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#imgThirdPost').parent().prop('target', '_blank');
                    $('#lnkThirdPostCategory').text(news.categoryNameAR);
                    $('#lnkThirdPostDate').text(moment(news.creationDate).startOf('minute').fromNow());
                    $('#lnkThirdPostTitle').text(news.title);
                    $('#lnkThirdPostTitle').parent().prop('href', '/subindex');
                    $('#lnkThirdPostTitle').parent().prop('target', '_blank');
                    let subject = news.subject;
                    if (subject.length > 500) {
                        $('#divThirdPostSubject').html(subject.substring(0, 499) + "...<br><a class='post-catagory' style='cursor:pointer' href='/subindex?id='" + btoa(news.id) + ">أقرأ المزيد</a>");
                    }
                    else {
                        $('#divThirdPostSubject').text(subject);
                    }
                }

                /**Breaking news**/
                
                if (news.isBreaking) {
                    displayBreakingNews = true;

                    
                  
                    html += '<li><a href="#">' + news.title + '</a></li>';
                    
                    
                }

                if (news.photo != null) {
                    ulLatestNews.append('<li><img src="' + news.photo + '" style="padding-left:5px;"><a href="" class="post-title">' + news.title + '</a><br><label>' + moment(news.creationDate).startOf('minute').fromNow()+'</label></li>');
                }
                else {
                    ulLatestNews.append('<li><a href="" class="post-title">' + news.title + '</a><br><label>' + moment(news.creationDate).startOf('minute').fromNow() +'</label></li>');
                }
                
            }

            if (displayBreakingNews) {
                $('#divTickerArea').css('display', 'block');
                html += '</ul>';
                $("#breakingNewsTicker").html(html);

                // :: 2.0 Newsticker Active Code
                $.simpleTicker($("#breakingNewsTicker"), {
                    speed: 1000,
                    delay: 3000,
                    easing: 'swing',
                    effectType: 'roll'
                });
            }

            

        },
        error: function (xhr, textStatus, errorThrown) {
            alert('Error occuried: Contact your system administrator');
        }
    });
}
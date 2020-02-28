var allNewsArr = new Array();

$(document).ready(function () {
    $('.demo1').easyTicker({
        direction: 'up',
        visible: 4,
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
                    if (news.photo !== null)
                        $('#imgFirstPost').prop('src', news.photo);
                    else
                        $('#imgFirstPost').prop('src', '/img/empty_news.png');

                    $('#imgFirstPost').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#imgFirstPost').parent().prop('target', '_blank');
                    
                    $('#lnkFirstPostCategory').text(news.categoryNameAR);
                    $('#lnkFirstPostDate').text(moment(news.creationDate).startOf('minute').fromNow());
                    $('#lnkFirstPostTitle').text(news.title);
                    $('#lnkFirstPostTitle').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#lnkFirstPostTitle').parent().prop('target', '_blank');
                    let subject = news.subject;
                    if (subject.length > 500) {
                        $('#divFirstPostSubject').html(subject.substring(0, 499) + " . . . <a target='_blank' class='btn btn-success' style='cursor:pointer' href='/subindex?id=" + btoa(news.id) + "'>أقرأ المزيد</a>");
                    }
                    else {
                        $('#divFirstPostSubject').html(subject);
                    }
                }

                else if (i == 1) {
                    
                    if (news.photo !== null)
                        $('#imgSecondPost').prop('src', news.photo);
                    else
                        $('#imgSecondPost').prop('src', '/img/empty_news.png');

                    $('#imgSecondPost').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#imgSecondPost').parent().prop('target', '_blank');

                    $('#lnkSecondPostCategory').text(news.categoryNameAR);
                    $('#lnkSecondPostDate').text(moment(news.creationDate).startOf('minute').fromNow());
                    $('#lnkSecondPostTitle').text(news.title);
                    $('#lnkSecondPostTitle').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#lnkSecondPostTitle').parent().prop('target', '_blank');
                    let subject = news.subject;
                    if (subject.length > 300) {
                        $('#divSecondPostSubject').html(subject.substring(0, 299) + "...<br><a target='_blank' class='btn btn-success' style='cursor:pointer' href='/subindex?id=" + btoa(news.id) + "'>أقرأ المزيد</a>");
                    }
                    else {
                        $('#divSecondPostSubject').html(subject);
                    }
                }


                else if (i == 2) {
                    if (news.photo !== null)
                        $('#imgThirdPost').prop('src', news.photo);
                    else
                        $('#imgThirdPost').prop('src', '/img/empty_news.png');
                    $('#imgThirdPost').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#imgThirdPost').parent().prop('target', '_blank');
                    $('#lnkThirdPostCategory').text(news.categoryNameAR);
                    $('#lnkThirdPostDate').text(moment(news.creationDate).startOf('minute').fromNow());
                    $('#lnkThirdPostTitle').text(news.title);
                    $('#lnkThirdPostTitle').parent().prop('href', '/subindex?id=' + btoa(news.id));
                    $('#lnkThirdPostTitle').parent().prop('target', '_blank');
                    let subject = news.subject;
                    if (subject.length > 300) {
                        $('#divThirdPostSubject').html(subject.substring(0, 299) + "...<br><a target='_blank' class='btn btn-success' style='cursor:pointer' href='/subindex?id=" + btoa(news.id) + "'>أقرأ المزيد</a>");
                    }
                    else {
                        $('#divThirdPostSubject').html(subject);
                    }
                }

                /**Breaking news**/
                
                if (news.isBreaking) {
                    displayBreakingNews = true;

                    
                  
                    html += '<li><a target="_blank" href="/subindex?id=' + btoa(news.id) + '">' + news.title + '</a></li>';
                    
                    
                }

                if (news.photo != null) {
                    ulLatestNews.append('<li><img src="' + news.photo + '" style="padding-left:5px;"><a target="_blank" href="/subindex?id=' + btoa(news.id) + '" class="post-title">' + news.title + '</a><br><label>' + moment(news.creationDate).startOf('minute').fromNow()+'</label></li>');
                }
                else {
                    ulLatestNews.append('<li><img src="/img/empty_news.png" style="padding-left:5px;"><a target="_blank" href="/subindex?id=' + btoa(news.id) + '" class="post-title">' + news.title + '</a><br><label>' + moment(news.creationDate).startOf('minute').fromNow() +'</label></li>');
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



            loadLocalNews(arr);
            loadInternationalNews(arr);

        },
        error: function (xhr, textStatus, errorThrown) {
            alert('Error occuried: Contact your system administrator');
        }
    });
}


function loadLocalNews(arr) {
    let html = '';
    $.each(arr, function (i, item) {

        /*local news*/
        if (item.categoryId === 1) {
            html += '<div class="col-12 col-lg-4">';
            html += '<div class="single-blog-post">';
            html += '<div class="post-thumb">';
            html += '<a target="_blank" href="/subindex?id=' + btoa(item.id) + '">';
            if (item.photo != null)
                html += '<img src="' + item.photo + '" alt=""></a>';
            else
                html += '<img src="/img/empty_news.png" alt=""></a>';
            html += '</div>';
            html += '<div class="post-data">';
            html += '<a target="_blank" href="/subindex?id=' + btoa(item.id) + '" class="post-title">';
            html += '<h6>' + item.title + '</h6>';
            html += '</a>';
            html += '<div class="post-meta">';
            html += '<div class="post-date">' + moment(item.creationDate).format('LLLL')+'</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
    });

    $('#divLocalNews').html(html);
}


function loadInternationalNews(arr) {
    let html = '';
    $.each(arr, function (i, item) {

        /*local news*/
        if (item.categoryId === 5) {
            html += '<div class="single-blog-post style-2">';
            html += '<div class="post-thumb">';
            html += '<a target="_blank" href="/subindex?id=' + btoa(item.id) + '">';
            if (item.photo != null)
                html += '<img src="' + item.photo + '" alt=""></a>';
            else
                html += '<img src="/img/empty_news.png" alt=""></a>';
            html += '</div>';
            html += '<div class="post-data">';
            html += '<a target="_blank" href="/subindex?id=' + btoa(item.id) + '" class="post-title">';
            html += '<h6>' + item.title + '</h6>';
            html += '</a>';
            html += '<div class="post-meta">';
            html += '<div class="post-date">' + moment(item.creationDate).format('LLLL') + '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
    });
   
    $('#divInternationalNews').append(html);
}
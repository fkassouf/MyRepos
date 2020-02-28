var id;
$(function () {
    

    GetTodayNews();

    moment.locale('ar');

    moment.updateLocale('ar', {
        months: [
            "كانون الثاني", "شباط", "اذار", "نيسان", "ايار", "حزيران", "تموز",
            "آب", "ايلول", "تشرين الاول", "تشرين الثاني", "كانون الاول"
        ]
    });


    id = atob(encodedId);
    getNewsById(id);
});

function getNewsById(id) {
    var nameFormDataHere = new FormData();
    nameFormDataHere.append("Id", id);
    $.ajax({
        url: '/home/GetNewsById',
        type: "POST",
        processData: false,
        contentType: false,
        data: nameFormDataHere,

        success: function (data, textStatus, xhr) {


            $('#pCategory').text(data.categoryNameAR);
            $('#postDate').text(moment(data.creationDate).format('LLLL'));
            $('#hTitle').text(data.title);
            if (data.photo !== null)
                $('#imgPost').prop('src', data.photo);
            else
                $('#imgPost').prop('src', '/img/empty_news.png');
            $('#pSubject').text(data.subject);
        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert('Error');
        }
    });
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

            for (let i = 0; i < arr.length; i++) {
                let news = arr[i];

                /**Breaking news**/

                if (news.isBreaking) {
                    displayBreakingNews = true;



                    html += '<li><a href="#">' + news.title + '</a></li>';


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
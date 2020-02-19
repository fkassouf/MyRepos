var id;
$(function () {

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
            $('#postDate').text(moment(data.creationDate).startOf('minute').fromNow());
            $('#hTitle').text(data.title);
            $('#imgPost').prop('src', data.photo);
            $('#pSubject').text(data.subject);
        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert('Error');
        }
    });
}
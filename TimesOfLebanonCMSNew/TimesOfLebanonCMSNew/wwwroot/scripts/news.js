



$(document).ready(function () {
    getNewsRecords();
    $("#btnSearch").click(function (event) {
        event.preventDefault();
        getNewsRecords();
    });


    moment.locale('ar');

    moment.updateLocale('ar', {
        months: [
            "كانون الثاني", "شباط", "اذار", "نيسان", "ايار", "حزيران", "تموز",
            "آب", "ايلول", "تشرين الاول", "تشرين الثاني", "كانون الاول"
        ]
    });
});


function loadThumbnail(sender) {

    
    const viewer = new Viewer(sender, {
        
    });

    
    $(sender).viewer({
    });

}


function getNewsRecords() {
  
           
    table = $("#tblNews").DataTable({
        "order": [[3, "desc"]],
        "responsive": true,
        "serverSide": true,
        "processing": true,
        "searching": false,
        "destroy": true,
        "paging": true,
        "responsive": true,
        "pageLength": 100,
        "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
        "ajax": {
            "url": "/home/GetNewsRecords",
            "type": "Post",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "error": function (xhr, ajaxOptions, thrownError) {
                $.alert({ title: '', content: xhr });
            },
            "data": function (f) {
                f.hello = "world";
                return JSON.stringify({ parameters: f });
            }
        },
        "aoColumns": [
            { "data": "title", "name": "title", "className": "text-right", "width": "20%" },
            { "data": "subject", "name": "subject", "className": "text-right", "width" : "30%" },
            { "data": "categoryNameAR", "name": "categoryNameAR", "className": "text-right" },
            {
                "data": "creationDate", "name": "creationDate", "className": "text-right", "render": function (data) {
                    return moment(data).format('LLLL');
                }
            },
            {
                "data": null, "name": "isBreaking", "className": "text-right", "render": function (data) {
                    if (data.isBreaking) {
                        return "<i class='fas fa-check'></i>";
                    }
                    else {
                        return "";
                    }
                }
            },
            { "data": "statusName", "name": "statusName", "className": "text-right" },
            {
                "data": null, "name": "colImg", "className": "text-center", "orderable": false, "searchable": false, "render": function (data) {
                    if (data.photo != null) {
                        return "<img style='cursor:pointer' src='" + data.photo + "' class='img-fluid img-thumbnail' onclick='loadThumbnail(this)' />";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                "data": null, "name": "colEdit", "className": "text-right", "orderable": false, "searchable": false, "render": function (data) {

                    let src = "/home/newsmanagement?mode=edit&id=" + data.id;
                    return "<a title='تعديل' class='link' href='" + src + "'><i class='fas fa-edit'></i></a>";
                }
            },
                    
        ]
    });

    $('#tblNews').on('xhr.dt', function (e, settings, json) {
       
        if (json.d) {
            
            var data = json.d;
            json.d = undefined;
            $.extend(json, data);


        }
    });
        
}



function showImage2(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgThumb2').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
} 



function showImage3(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgThumb3').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
} 



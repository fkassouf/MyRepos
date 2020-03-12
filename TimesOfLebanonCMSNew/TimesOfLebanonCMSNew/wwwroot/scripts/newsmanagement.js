var hasPhoto = false;
var hasVideo = false;

$(document).ready(function () {
    $('#txtSubject').trumbowyg({
        lang: 'ar'
    });
    getCategories();
    

    $("#btnSaveNews").click(function (event) {
        event.preventDefault();
        SaveNews();
    });

    jQuery.validator.addMethod("RequiredInput", function (value, element) {

        return (value != "")
    }, "Required Field");

    jQuery.validator.addMethod("NumberInput", function (value, element) {

        return (!Number.isInteger(value))
    }, "Number Field");

    jQuery.validator.addMethod("RequiredSelect", function (value, element) {

        return (value != "0" && value != "" && value != null)
    }, "Required Selection");




    $("#frmNewsManagement").validate({
        rules: {
            ddlCategory: {
                RequiredSelect: true

            },
            ddlStatus: {
                RequiredSelect: true

            },

            txtTitle: {
                RequiredInput: true

            },
            txtSubject: {
                RequiredInput: true

            }


           

        }
    });


});


function getNews(id) {
    var nameFormDataHere = new FormData();
    nameFormDataHere.append("Id", id);
    $.ajax({
        url: '/home/GetNewsById',
        type: 'Post',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {
            
            $("#txtTitle").val(data.title);
            $("#ddlCategory").val(data.categoryId);
            $("#ddlStatus").val(data.statusId);
            $('#txtSubject').trumbowyg('destroy');
            $("#txtSubject").val(data.subject);
            $('#txtSubject').trumbowyg({
                lang: 'ar'
            });
            $("#chkBreaking").prop('checked', data.isBreaking);
            if (data.photo != null) {
                hasPhoto = true;
                $("#btnChooseImg").css("display", "none");
                $("#imgThumb1").prop("src", data.photo);
                $("#btnRemoveImgPreview").css("display", "block");
            }
            else {
                hasPhoto = false;
                $("#btnChooseImg").css("display", "block");
                $("#imgThumb1").prop("src", null);
                $("#btnRemoveImgPreview").css("display", "none");
            }

            if (data.videoPath != null && data.videoPath != 'undefined' && data.videoPath != undefined) {
                hasVideo = true;
                $("#btnChooseVideo").css("display", "none");
                $('#vPreview').prop("src", data.videoPath.replace("~",""));
                $('#vPreview').parent()[0].load();
                $("video").css("display", "block");
                $("#btnRemoveVideoPreview").css("display", "block");
            }
            else {
                hasVideo = false;
                $("#btnChooseVideo").css("display", "block");
                $('#vPreview').prop("src", null);
                $('#vPreview').parent()[0].load();
                $("video").css("display", "none");
                $("#btnRemoveVideoPreview").css("display", "none");
            }
           
            
        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert('Contact your system administrator');
        }
    });
}


function removeImgPreview() {

    if (mode == "edit" && hasPhoto) {
        $.confirm({
            title: 'Are you sure you want to delete this image?',
            content: 'Warning : once confirmed you will not be able to restore this image!',
            buttons: {
                confirm: {
                    text: 'CONFIRM',
                    btnClass: 'btn-green',
                    action: function(){
                        var nameFormDataHere = new FormData();
                        nameFormDataHere.append("Id", id);

                        $.ajax({
                            url: '/home/DeletePhoto',
                            type: 'POST',
                            data: nameFormDataHere,
                            processData: false,
                            contentType: false,
                            success: function (data, textStatus, xhr) {
                                if (data) {
                                    $.alert('Photo has been deleted');
                                    getNews(id);
                                    
                                }
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                $.alert('Contact your system administrator');
                            }
                        });
                    }
                },
                cancel: {
                    text: 'CANCEL',
                    btnClass: 'btn-red',
                    action: function () {
                        
                    }
                }
                
            }
        });
    }
    else {
        $("#btnChooseImg").css("display", "block");
        $('#imgThumb1').prop('src', '');
        $('#img1').val(null);
        $("#btnRemoveImgPreview").css("display", "none");
    }
}


function showVideo(input) {
    if (input.files[0].size <= 5000000) {
        var $source = $('#vPreview');
        $source[0].src = URL.createObjectURL(input.files[0]);
        $source.parent()[0].load();
        $("video").css("display", "block");
        $("#btnRemoveVideoPreview").css("display", "block");
    }
    else {
        $.alert({
            title: 'Error',
            content: 'Video Size Exceeded the Max Length allowed 5 MB'
        });
        //removeImgPreview();
    }
}

function resetForm() {
    $("#txtTitle").val('');
    $("#ddlCategory").val(0);
    $("#ddlStatus").val(0);
    $("#txtSubject").val('');
    $("#chkBreaking").prop('checked', false);
    hasPhoto = false;
    $("#btnChooseImg").css("display", "block");
    $("#imgThumb1").prop("src", null);
    $("#btnRemoveImgPreview").css("display", "none");
    $("#img1").val('');
    hasVideo = false;
    $("#btnChooseVideo").css("display", "block");
    $('#vPreview').prop("src", null);
    $('#vPreview').parent()[0].load();
    $("video").css("display", "none");
    $("#btnRemoveVideoPreview").css("display", "none");
}


function removeVideoPreview() {

    if (mode == "edit" && hasVideo) {
        $.confirm({
            title: 'Are you sure you want to delete this video?',
            content: 'Warning : once confirmed you will not be able to restore this video!',
            buttons: {
                confirm: {
                    text: 'CONFIRM',
                    btnClass: 'btn-green',
                    action: function () {
                        var videoPath = $('#vPreview').prop("src");

                        var nameFormDataHere = new FormData();
                        nameFormDataHere.append("Id", id);
                        nameFormDataHere.append("VideoPath", decodeURIComponent(videoPath));
                        $.ajax({
                            url: '/home/DeleteVideo',
                            type: 'POST',
                            data: nameFormDataHere,
                            processData: false,
                            contentType: false,
                            success: function (data, textStatus, xhr) {
                                if (data) {
                                    $.alert('Video has been deleted');
                                    
                                    getNews(id);
                                }
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                $.alert('Contact your system administrator');
                            }
                        });
                    }
                },
                cancel: {
                    text: 'CANCEL',
                    btnClass: 'btn-red',
                    action: function () {

                    }
                }

            }
        });
    }
    else {
        var $source = $('#vPreview');
        $source[0].src = null;
        $source.parent()[0].load();
        $('#fileUploadVideo').val(null);
        $("video").css("display", "none");
        $("#btnRemoveVideoPreview").css("display", "none");
    }
}

function showImage1(input) {
    
    if (input.files && input.files[0]) {
        if (input.files[0].size <= 70000) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imgThumb1').attr('src', e.target.result);

            }
            reader.readAsDataURL(input.files[0]);
            $("#btnRemoveImgPreview").css("display", "block");


        }
        else {
            $.alert({
                title: 'Error',
                content: 'Image Size Exceeded the Max Length allowed 70 KB'
            });
            //removeImgPreview();
        }
    }
} 







function showError(message) {
    $.alert({
        title: 'Error',
        content: message,
        rtl: false,
        closeIcon: true,
        buttons: {
            
            cancel: {
                text: 'Ok',
                action: function () {
                }
            }
        }
    });
}

function getCategories() {
    $.ajax({
        url: '/home/GetCategories',
        type: 'Get',
        processData: false,
        contentType: false,
        success: function (data, textStatus, xhr) {
            let arr = data;
            let html = "";
            let $select = $("#ddlCategory");
            $select.find('option').remove();
            html += '<option value="0"></option>';
            for (let i = 0; i < arr.length; i++) {
                html += '<option value="' + arr[i].id + '"+>' + arr[i].name + '</option>';
            }

            $select.append(html);

            getStatuses();
            
        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert('Contact your system administrator');
        }
    });
}


function getStatuses() {
    $.ajax({
        url: '/home/GetStatuses',
        type: 'Get',
        processData: false,
        contentType: false,
        success: function (data, textStatus, xhr) {
            let arr = data;
            let html = "";
            let $select = $("#ddlStatus");
            $select.find('option').remove();
            html += '<option value="0"></option>';
            for (let i = 0; i < arr.length; i++) {
                html += '<option value="' + arr[i].id + '"+>' + arr[i].name + '</option>';
            }

            $select.append(html);
            
            if (mode == 'edit') {
                var objNews = getNews(id);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert('Contact your system administrator');
        }
    });
}


function SaveNews() {
    var nameFormDataHere = new FormData();

    if ($("#frmNewsManagement").valid()) {
        if ($("#fileUploadVideo").prop("files") && $("#fileUploadVideo").prop("files")[0]) {
            
            var file = $("#fileUploadVideo").prop("files")[0];
            if (file.size > 5000000) {
                $.alert({
                    title: 'Error',
                    content: 'Video Size Exceeded the Max Length allowed 5 MB'
                });
            }
            else {

                
                var files = $("#fileUploadVideo").prop("files");
                var formData = new FormData();
                for (var i = 0; i != files.length; i++) {
                    formData.append("files", files[i]);
                }
                $.ajax({
                    url: '/home/UploadVideo',
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    data: formData,
                                      
                    success: function (data, textStatus, xhr) {
                        if (data) {
                            nameFormDataHere.append("VideoPath", "~/media/videos/" + files[0].name)
                            manageImage(nameFormDataHere);
                        }
                        else {
                            $.alert('Error occuried while trying to upload video');
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $.alert('Error: Contact your system administrator');
                    }
                });

            }
        }
        else {
            manageImage(nameFormDataHere);
        }

        

        
    }

    function manageImage(nameFormDataHere) {
        //alert($("#img1").prop("files") && $("#img1").prop("files")[0]);
        if ($("#img1").prop("files") && $("#img1").prop("files")[0]) {
            //nameFormDataHere.Photo = $("#img1").prop("files")[0];
            var file = $("#img1").prop("files")[0];
            if (file.size > 70000) {
                $.alert({
                    title: 'Error',
                    content: 'Image Size Exceeded the Max Length allowed 70 KB'
                });
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    nameFormDataHere.append("Photo", e.target.result);
                    nameFormDataHere.append("PhotoName", $("#img1").prop("files")[0].name);
                    continueSave(nameFormDataHere);
                }
                reader.readAsDataURL($("#img1").prop("files")[0]);



            }
        }
        else {
            continueSave(nameFormDataHere);
        }
    }


    function continueSave(nameFormDataHere, videoPath) {
       
        nameFormDataHere.append("Mode", mode);
        nameFormDataHere.append("Id", id);
        nameFormDataHere.append("VideoPath", videoPath);
        nameFormDataHere.append("Title", $("#txtTitle").val());
        nameFormDataHere.append("Subject", $("#txtSubject").val());
        nameFormDataHere.append("StatusId", $("#ddlStatus").val());
        nameFormDataHere.append("CategoryId", $("#ddlCategory").val());
        nameFormDataHere.append("IsBreaking", $("#chkBreaking").prop("checked"));
        
        $.ajax({
            url: '/home/SaveNews',
            type: 'POST',
            processData: false,
            contentType: false,
            data: nameFormDataHere,
            success: function (data, textStatus, xhr) {
                if (mode == "add") {
                    resetForm();
                }
                else {
                    window.location.reload();
                }

                
            },
            error: function (xhr, textStatus, errorThrown) {
                $.alert('Error: Contact your system administrator');
            }
        });



    }
}
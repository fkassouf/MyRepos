$(document).ready(function () {
    
    switch (ViewData) {
       
        case 'Dashboard':
            $('#liDashboard a').addClass('active');
            $('#liNews a').removeClass('active');
            $('#liUsers a').removeClass('active');
            break;
        case 'News':
            $('#liDashboard a').removeClass('active');
            $('#liNews a').addClass('active');
            $('#liUsers a').removeClass('active');
            break;
        case 'News Management':
            $('#liDashboard a').removeClass('active');
            $('#liNews a').addClass('active');
            $('#liUsers a').removeClass('active');
            break;
        case "Users":
            $('#liDashboard a').removeClass('active');
            $('#liNews a').removeClass('active');
            $('#liUsers a').addClass('active');
            break;
    }


    $("#btnSaveChangePassword").click(function (event) {
        
        event.preventDefault();
        var valid = $("#frmChangePassword").valid();

        if (valid) {
            var oldPassword = $("#txtOldPassword").val();
            var newPassword = $("#txtNewPassword").val();
            var confirmPassword = $("#txtConfirmPassword").val();
            console.log(newPassword);

            ChangeUserPassword(oldPassword, newPassword, confirmPassword);
        }

        
            
       
    });
    
});

$(document).ajaxStart(function () {
    $.LoadingOverlay("show", {
        image: "/images/9.gif"

    });
         });
         $(document).ajaxStop(function () {
             $.LoadingOverlay("hide");
});


function ChangeUserPassword(OldPassword, NewPassword, ConfirmPassword) {
    var nameFormDataHere = new FormData();
    var lblChangePassMessage = $("#lblChangePassMessage");
    nameFormDataHere.append("OldPassword", OldPassword);
    nameFormDataHere.append("NewPassword", NewPassword);
    nameFormDataHere.append("ConfirmPassword", ConfirmPassword);
    $.ajax({
        url: '/home/ChangeUserPassword',
        type: "POST",
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        
        success: function (data, textStatus, xhr) {

            $("#txtOldPassword").val('');
            $("#txtNewPassword").val('');
            $("#txtConfirmPassword").val('');
            lblChangePassMessage.addClass("text-success");
            if (data == "true") {

                lblChangePassMessage.addClass("text-success");
                lblChangePassMessage.text('Password changed ! please logout and login again using your new password');
            }
            else {
                lblChangePassMessage.addClass("text-danger");
                lblChangePassMessage.text(data);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            lblChangePassMessage.addClass("text-danger");
            lblChangePassMessage.text('Error');
        }
    });
}
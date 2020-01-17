var table;
var CurrentUser;
$(document).ready(function () {
    LoadUsers();
});

function resetUserModal() {
    $("#txtUserName").val("");
    $("#txtUserName").prop("disabled", false);
    $("#txtPassword").val("");
    $("#txtPassword").prop("disabled", false);
    $("#txtCPassword").val("");
    $("#txtCPassword").prop("disabled", false);
    $("#txtFullName").val("");
    $("#chkActive").prop("checked", true);
}

function LoadUsers() {
    var colSetPasswordVisible = false;
    if (userName == "ADMIN") {
        colSetPasswordVisible = true;
    }

    $("#btnAddUser").click(function () {
        $("#hdnUserModal").val("add");
        $("#modalUserHeader").text("Add");
        resetUserModal();
    });

    $("#btnSaveUser").click(function (event) {
        event.preventDefault();
        var valid = $("#frmUser").valid();
        if (valid) {
            if ($("#txtPassword").val() != $("#txtCPassword").val()) {
                $("#lblUserError").addClass("text-danger");
                $("#lblUserError").text("Error: Passwords do not match!");
            }
            else {
                if ($("#hdnUserModal").val() == "add") {
                    AddUser();
                }
                else {
                    UpdateUser();
                }
            }
        }
    });

    $.ajax({
        url: '/home/GetUsersList',
        type: 'Get',
        dataType: 'json',
       
        success: function (data, textStatus, xhr) {
           
            table = $("#tblUsers").DataTable({
                "order": [[0, "asc"]],
                "responsive": true,
                "destroy": true,
                "data": data,
                "aoColumns": [
                    { "data": "username", "name": "username" },
                    { "data": "fullName", "name": "fullName" },
                    {
                        "data": null, "name": "active", "searchable": false, "orderable": false, "render": function (data) {
                            if (data.active) {
                                return "<i class='fas fa-check'></i>";
                            }
                            else {
                                return "";
                            }
                        }
                    },
                    {
                        "data": null, "name": "colSetPassword", "visibile": colSetPasswordVisible, "orderable": false, "searchable": false, "render": function (data) {
                            return "<a class='btn btn-default' data-toggle='modal' data-target='#modalSetPassword' onclick='setPassword(" + data.userId + ", \"" + data.username +"\")'>Set Password</a>";
                        }
                    },
                    {
                        "data": null, "name": "colEdit", "visibile": colSetPasswordVisible, "orderable": false, "searchable": false, "render": function (data) {
                            return "<a data-toggle='modal' data-target='#modalUser' onclick='doEdit(" + data.userId+")'><i class='fas fa-edit'>Edit</a>";
                        }
                    }
                    ]
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
        }
    });  
}


function setPassword(userId, userName) {
    
    $("#lblSetUserPasswordError").removeClass("text-danger");
    $("#lblSetUserPasswordError").text("");
    $("#txtSetPassword").text("");
    $("#modalSetUserPasswordHeader").text(userName);
    $("#hdnSetUserPasswordId").val(userId);
    $("#btnSaveUserPassword").click(function (event) {
        event.preventDefault();
        savePassword();
    });
}


function savePassword() {
    if ($("#frmSetUserPassword").valid()) {


        var nameFormDataHere = new FormData();
        var password = $("#txtSetPassword").val();
        nameFormDataHere.append("UserId", $("#hdnSetUserPasswordId").val());
        nameFormDataHere.append("Username", $("#modalSetUserPasswordHeader").text());
        nameFormDataHere.append("Password", password);

        $.ajax({
            url: '/home/SetPassword',
            type: 'POST',
            processData: false,
            contentType: false,
            data: nameFormDataHere,
            success: function (data, textStatus, xhr) {

                $("#modalSetPassword").modal("hide");
                LoadUsers();
                
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#lblSetUserPasswordError").addClass("text-danger");
                $("#lblSetUserPasswordError").text("System Error");
            }
        });
    }
}

function doEdit(userId) {
    
    $("#hdnUserModal").val("edit");
    $("#modalUserHeader").text("Edit");
     
    
    $.ajax({
        url: '/home/GetUser?UserId=' + userId,
        type: 'Get',
        contentType: "json",
        
        success: function (data, textStatus, xhr) {
            CurrentUser = data;
            FillForm(data);

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#lblUserError").addClass("text-danger");
            $("#lblUserError").text("System Error");
        }
    });
}


function FillForm(user) {
    $("#txtUserName").val(user.username);
    $("#txtUserName").prop("disabled", true);
    $("#txtPassword").val(user.password);
    $("#txtPassword").prop("disabled", true);
    $("#txtCPassword").val(user.password);
    $("#txtCPassword").prop("disabled", true);
    $("#txtFullName").val(user.fullName);
    $("#chkActive").prop("checked", user.active);
}

function AddUser() {

    var FullName = $("#txtFullName").val();
    var Username = $("#txtUserName").val();
    var Password = $("#txtPassword").val();
    var Active = $("#chkActive").prop("checked");

    var nameFormDataHere = new FormData();
    
    nameFormDataHere.append("FullName", FullName);
    nameFormDataHere.append("Username", Username);
    nameFormDataHere.append("Password", Password);
    nameFormDataHere.append("Active", Active);
    $.ajax({
        url: '/home/InsertUser',
        type: 'POST',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {
            if (data == "-69") {
                $("#lblUserError").addClass("text-danger");
                $("#lblUserError").text("Error: Username already exists!");
            }
            else {
                $("#modalUser").modal("hide");
                LoadUsers();
            }
                
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#lblUserError").addClass("text-danger");
            $("#lblUserError").text("System Error");
        }
    });
}



function UpdateUser() {

    var FullName = $("#txtFullName").val();
    var Username = $("#txtUserName").val();
    var Password = $("#txtPassword").val();
    var Active = $("#chkActive").prop("checked");

    var nameFormDataHere = new FormData();

    nameFormDataHere.append("UserId", CurrentUser.userId);
    nameFormDataHere.append("FullName", FullName);
    nameFormDataHere.append("Username", Username);
    nameFormDataHere.append("Password", Password);
    nameFormDataHere.append("Active", Active);
    $.ajax({
        url: '/home/UpdateUser',
        type: 'POST',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {
            $("#modalUser").modal("hide");
            LoadUsers();

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#lblUserError").addClass("text-danger");
            $("#lblUserError").text("System Error");
        }
    });
}
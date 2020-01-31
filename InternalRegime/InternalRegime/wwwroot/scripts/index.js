$(document).ready(function () {
    loadItems();
});

function Vote(itemId, agree) {
    var nameFormDataHere = new FormData();

    nameFormDataHere.append("ItemId", itemId);
    nameFormDataHere.append("Voted", agree);
    $.ajax({
        url: '/home/Vote',
        type: 'Post',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {

            loadItems();
            
        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert({ title: 'Error', content: 'Contact your system administrator' });
        }
    });
    
}

function loadItems() {


    var arrVotings = [];
    var nameFormDataHere = new FormData();
    nameFormDataHere.append("MemberID", MemberId);
    $.ajax({
        url: '/home/GetVotings',
        type: 'Post',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {

            arrVotings = data;



            $.ajax({
                url: '/home/GetItemList',
                type: 'GET',
                processData: false,
                contentType: false,

                success: function (data, textStatus, xhr) {

                    

                    let $divItems = $('#divItems');
                    let html = '';


                    var checked = -1;


                    $.each(data, function (i, item) {

                        checked = -1;

                        $.each(arrVotings, function (j, voting) {

                            if (voting.itemId === item.id) {
                                //console.log(item.id);
                                checked = 0;
                                if (voting.voted) {
                                    checked = 1;
                                }

                            }
                        });
                        
                        
                        
                        
                        if (i % 4 === 0) {
                            html += '<div class="row">';
                        }

                        html += '<section class="col-lg-3">';
                        html += '<div class="card card-default">';

                        html += '<div class="card-header">';
                        html += '<div class="card-title">';
                        html += '<h5 class="text text-primary">البند الاساسي</h5>';
                        html += item.primaryItem;
                        html += '</div>';
                        html += '</div>';
                        html += '<div class="card-body">';
                        html += '<h5 class="text text-warning">التعديل المقترح</h5>';
                        html += item.modifiedItem;
                        html += '</div>';
                        html += '<div class="card-footer">';
                        /*check*/
                        html += '<div class="form-group clearfix">';
                        html += 'موافق';
                        html += '<div class="icheck-success d-inline">';
                        if (checked == 1) {
                            html += '<input type="checkbox" checked disabled id="checkboxAgree-' + item.id + '">';
                        }
                        else {
                            html += '<input type="checkbox" onclick="Vote(' + item.id +',true);" id="checkboxAgree-' + item.id + '">';
                        }
                        html += '<label for="checkboxAgree-' + item.id + '"></label>';
                        html += '</div>';
                        html += '</div>';
                        /*check*/

                        /*uncheck*/
                        html += '<div class="form-group clearfix">';
                        html += 'غير موافق';
                        html += '<div class="icheck-danger d-inline">';
                        if (checked == 0) {
                            html += '<input type="checkbox" disabled checked id="checkboxDisagree-' + item.id + '">';
                        }
                        else {
                            html += '<input type="checkbox" onclick="Vote(' + item.id +',false);" id="checkboxDisagree-' + item.id + '">';
                        }
                        
                        html += '<label for="checkboxDisagree-' + item.id + '"></label>';
                        html += '</div>';
                        html += '</div>';
                        /*uncheck*/
                        html += '</div>';
                        html += '</div>';
                        html += '</section>';

                        if ((i + 1) % 4 === 0) {
                            html += '</div>';
                        }
                    });

                    $divItems.html(html);





                },
                error: function (xhr, textStatus, errorThrown) {
                    $.alert({ title: 'Error', content: 'Contact your system administrator' });
                }
            });

        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert({ title: 'Error', content: 'Contact your system administrator' });
        }
        
    });



    

}
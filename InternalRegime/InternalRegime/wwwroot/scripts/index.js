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

            //console.log(arrVotings);

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
                        
                        
                        
                        
                        if (i % 3 === 0) {
                            html += '<div class="row">';
                        }

                        html += '<section class="col-lg-12">';
                        html += '<div class="form-group">';
                        html += '<div class="card card-default">';

                        html += '<div class="card-header">';
                        html += '<div class="card-title">';
                        html += '<h5 class="text text-default">' + item.title + ' <a class="btn btn-info" onclick="readMoreLess(this, '+item.id+')" data-toggle="collapse" data-target="#cardBody' + item.id +'" id="myBtn'+item.id+'">Read More</a></h5>';
                        
                        html += '</div>';
                        html += '</div>';
                        html += '<div class="card-body collapse" id="cardBody' + item.id +'">';
                        html += '<h5 class="text text-primary">البند الاساسي</h5>';
                        html += '<div>' + item.primaryItem + '</div>';
                        html += '<hr>';
                        html += '<h5 class="text text-warning">التعديل المقترح</h5>';
                        html += item.modifiedItem;
                        html += '</div>';
                        html += '<div class="card-footer">';

                        html += '<div class="row">';
                        
                        /*check*/
                        html += '<div class="col">';
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
                        html += '</div>';
                        /*check*/

                        /*uncheck*/
                        html += '<div class="col">';
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
                        html += '</div>';
                        /*uncheck*/

                        html += '</div>';
                        

                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</section>';

                        if ((i + 1) % 3 === 0) {
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



function readMoreLess(sender, id) {
    var $card = $('#cardBody' + id);
    if ($card.hasClass('show'))
    {
        $(sender).html('Read More');
    }
    else {
        $(sender).html('Read Less');
    }
}
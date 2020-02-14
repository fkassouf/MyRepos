var table;

$(function () {

    $('#ddlItem').change(function () {
        getItemDetails($(this).val());
        getMembersByUnit($('#ddlCouncil').val(), $(this).val());
    });

    $('#ddlCouncil').change(function () {
        getMembersByUnit($(this).val(), $('#ddlItem').val());
    });

    getUnits();
    getItems();
});

function getItems() {
    $.ajax({
        url:'/home/GetItemList',
        type: 'GET',
        processData: false,
        contentType: false,

        success: function (data, textStatus, xhr) {
                       
            let $select = $('#ddlItem');
            $select.find('option')
                .remove()
                .end();

            $select.append('<option value="0"></option>');
            $.each(data, function (i, item) {
                $select.append('<option value="' + item.id + '">' + item.title + '</option>');
                
            });
                       
        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert({ title: 'Error', content: 'Contact your system administrator' });
        }
    });
}


function getUnits() {
    var nameFormDataHere = new FormData();
    nameFormDataHere.append("UnitTypeId", 15);
    $.ajax({
        url: '/home/GetUnits',
        type: 'Post',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {

            let $select = $('#ddlCouncil');
            $select.find('option')
                .remove()
                .end();

            $select.append('<option value="0"></option>');
            $.each(data, function (i, item) {
                $select.append('<option value="' + item.unitId + '">' + item.name + '</option>');

            });

        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert({ title: 'Error', content: 'Contact your system administrator' });
        }
    });
}


function getItemDetails(id) {
    var nameFormDataHere = new FormData();
    nameFormDataHere.append("ID", id);
    $.ajax({
        url: '/home/GetItemById',
        type: 'Post',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {

            if (data == null) {
                showDetails(false);
            }
            else {
                showDetails(true);
                $('#divOriginalItem').html(data.primaryItem);
                //$('#divModifiedItem').html(data.modifiedItem);

                /**All Voted */
                var html = '';
                html += '<div class="col">';
                html += '<div class="form-group clearfix">';
                html += 'الكل موافق';
                html += '<div class="icheck-success d-inline">';
                if (data.allVotedYes) {
                    html += '<input type="checkbox" checked disabled id="checkboxAgree-' + data.id + '">';
                }
                else {
                    html += '<input type="checkbox" onclick="voteAll(' + data.id + ', this, true);" id="checkboxAgree-' + data.id + '">';
                }
                html += '<label for="checkboxAgree-' + data.id + '"></label>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col">';
                html += '<div class="form-group clearfix">';
                html += 'الكل غير موافق';
                html += '<div class="icheck-danger d-inline">';
                if (data.allVotedNo) {
                    html += '<input type="checkbox" disabled checked id="checkboxDisagree-' + data.id + '">';
                }
                else {
                    html += '<input type="checkbox" onclick="voteAll(' + data.id + ', this, false);" id="checkboxDisagree-' + data.id + '">';
                }

                html += '<label for="checkboxDisagree-' + data.id + '"></label>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col">';
                html += '<div class="form-group clearfix">';
                html += '<a class="btn btn-warning" onclick="resetVotes(' + data.id + ', this);" id="btnReset-' + data.id + '">الغاء جميع الاصوات</a>';
                html += '</div>';
                html += '</div>';
                $divAllVoted = $('#divAllVoted');
                $divAllVoted.html(html);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert({ title: 'Error', content: 'Contact your system administrator' });
        }
    });
}


function resetVotes(id) {
    $.confirm({
        title: 'الرجاء تأكيد الخيار',
        content: 'هل انت متأكد انك تريد الغاء جميع الاصوات واعادة التصويت على هذا البند؟ ',
        buttons: {

            Cancel: {
                text: 'كلا',
                btnClass: 'btn-red',

                action: function () {
                    
                }
            },

            Yes: {
                text: 'نعم',
                btnClass: 'btn-blue',

                action: function () {
                    var nameFormDataHere = new FormData();

                    nameFormDataHere.append("ItemId", id);
                    
                    $.ajax({
                        url: '/home/ClearVoteAll',
                        type: 'Post',
                        processData: false,
                        contentType: false,
                        data: nameFormDataHere,
                        success: function (data, textStatus, xhr) {

                            getItemDetails(id);
                            getMembersByUnit($('#ddlCouncil').val(), id);

                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $.alert({ title: 'Error', content: 'Contact your system administrator' });
                        }
                    });
                }
            }

        }
    });
}

function showDetails(b) {
    if(b)
        $('#cardDetails').css('display', 'block');
    else
        $('#cardDetails').css('display', 'none');
}

function showMembers(b) {
    if (b)
        $('#cardMembers').css('display', 'block');
    else
        $('#cardMembers').css('display', 'none');
}


function voteAll(id, sender, agree) {

    var message;

    var $checkbox = $(sender);
    if ($checkbox.prop('id').indexOf('Disagree') > 0) {
        message = 'هل انت متأكد انك تريد الغاء جميع الاصوات على هذا البند؟';
    }
    else {
        message = 'هل انت متأكد ان الجميع موافق على التصويت على هذا البند؟';
    }

    $.confirm({
        title: 'الرجاء تأكيد الخيار',
        content: message,
        buttons: {

            Cancel: {
                text: 'كلا',
                btnClass: 'btn-red',

                action: function () {
                    $checkbox.prop('checked', !$checkbox.prop('checked'));
                }
            },

            Yes: {
                text: 'نعم',
                btnClass: 'btn-blue',

                action: function () {
                    var nameFormDataHere = new FormData();

                    nameFormDataHere.append("ItemId", id);
                    nameFormDataHere.append("Voted", agree);
                    $.ajax({
                        url: '/home/VoteAll',
                        type: 'Post',
                        processData: false,
                        contentType: false,
                        data: nameFormDataHere,
                        success: function (data, textStatus, xhr) {

                            getItemDetails(id);
                            getMembersByUnit($('#ddlCouncil').val(), id);

                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $.alert({ title: 'Error', content: 'Contact your system administrator' });
                        }
                    });
                }
            }
            
        }
    });
    
}



function getMembersByUnit(id, itemId) {
    
    var nameFormDataHere = new FormData();
    nameFormDataHere.append("UnitId", id);
    nameFormDataHere.append("ItemId", itemId);
    $.ajax({
        url: '/home/GetMembersByUnit',
        type: 'Post',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {

            if (data == null || data.length == 0) {
                showMembers(false);
            }
            else {
                showMembers(true);
                table = $('#tblMembers').DataTable({
                    responsive: true,
                    searching: false,
                    ordering: false,
                    showDetails: false,
                    paging: false,
                    destroy : true,
                    data: data,
                    columns: [
                        { data: 'fullName', name: 'fullName', orderable: false, searchable: false },
                        {
                            data: null, name: 'Agree', orderable: false, searchable: false, render: function (data) {
                                var html = '<div class="icheck-success d-inline">';
                                if (data.agree) {
                                    html += '<input type="checkbox" checked disabled id="checkboxAgree-' + data.id + '">';
                                }
                                else {
                                    html += '<input type="checkbox" onclick="Vote(' + data.id + ',' + $("#ddlItem").val() +',true);" id="checkboxAgree-' + data.id + '">';
                                }
                                html += '<label for="checkboxAgree-' + data.id + '"></label>';
                                html += '</div>';
                                return html;
                            }
                        },
                        {
                            data: null, name: 'Disagree', orderable: false, searchable: false, render: function (data) {
                                var html = '<div class="icheck-danger d-inline">';
                                if (data.disagree) {
                                    html += '<input type="checkbox" checked disabled id="checkboxDisAgree-' + data.id + '">';
                                }
                                else {
                                    html += '<input type="checkbox" onclick="Vote(' + data.id + ',' + $("#ddlItem").val() + ',false);" id="checkboxDisAgree-' + data.id + '">';
                                }
                                html += '<label for="checkboxDisAgree-' + data.id + '"></label>';
                                html += '</div>';
                                return html;
                            }
                        }
                    ]
                });
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert({ title: 'Error', content: 'Contact your system administrator' });
        }
    });
}



function Vote(sessionMemberId, itemId, agree) {
    var nameFormDataHere = new FormData();

    nameFormDataHere.append("MemberSessionId", sessionMemberId);
    nameFormDataHere.append("ItemId", itemId);
    nameFormDataHere.append("Voted", agree);
    $.ajax({
        url: '/home/BulkVote',
        type: 'Post',
        processData: false,
        contentType: false,
        data: nameFormDataHere,
        success: function (data, textStatus, xhr) {

            
            getMembersByUnit($('#ddlCouncil').val(), itemId);
            

        },
        error: function (xhr, textStatus, errorThrown) {
            $.alert({ title: 'Error', content: 'Contact your system administrator' });
        }
    });

}

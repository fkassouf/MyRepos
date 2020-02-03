function getResultData() {
    $.ajax({
        url: '/home/GetResultsDataSet',
        type: 'GET',
        processData: false,
        contentType: false,
        success: successResultDataCallBack,
        error : errorCallBack
    });
}


function errorCallBack(err) {
    $.alert('Error Occured');
}

function successResultDataCallBack(returnData) {
    // the main process have to be here

    let main = returnData;

    let arrLabels = [];
    let arrAgree = [];
    let arrDisagree = [];

    let arrAgreeColors = [];
    let arrDisagreeColors = [];


    $.each(main, function (i, item) {
        arrLabels.push(item.title);
        arrAgree.push(item.agreeVotes);
        arrDisagree.push(item.disagreeVotes);
        arrAgreeColors.push(item.agreeColor);
        arrDisagreeColors.push(item.disagreeColor);

    });


    let ch = new Chart(document.getElementById('bar-canvas1'), {
        type: 'bar',
        data: {
            labels: arrLabels,
            datasets: [
                {
                    label: 'موافق',
                    data: arrAgree,
                    backgroundColor: arrAgreeColors
                },
                {
                    label: 'غير موافق',
                    data: arrDisagree,
                    backgroundColor: arrDisagreeColors
                }
            ]
        },
        options: {
            defaultFontSize : 18,
            legend: {
                display: true,
                labels: {
                    fontSize : 18
                },
                scales: { scaleLabel: { fontSize: 18 } }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                labels: {
                    render: 'value'
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 18
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 18
                    }
                }]
            }
        }
    });
}


$(function () {

    
    getResultData();
   
    setInterval('getResultData()', 10000);
    
});




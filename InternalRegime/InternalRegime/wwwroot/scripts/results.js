var total = 0;

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
    let arrOneThird = [];
    let arrTwoThird = [];
    let arrLabels = [];
    let arrAgree = [];
    let arrDisagree = [];

    let arrAgreeColors = [];
    let arrDisagreeColors = [];

    if (main.length > 0) {
        total = main[0].total;
        $('#lblTotalVotes').text('عدد الاعضاء : ' + main[0].total);
    }
    
    $.each(main, function (i, item) {
        
        arrLabels.push(item.title);
        arrAgree.push(item.agreeVotes);
        arrDisagree.push(item.disagreeVotes);
        arrAgreeColors.push(item.agreeColor);
        arrDisagreeColors.push(item.disagreeColor);

        arrTwoThird.push(total * 2 / 3);
        arrOneThird.push(total / 3);

    });

    

    let ch = new Chart(document.getElementById('bar-canvas1'), {
        type: 'bar',
        
        data: {
            labels: arrLabels,
            datasets: [
                
                {
                    type: 'line',
                    label: '',
                    borderColor: '#007bff',
                    borderWidth: 1,
                    fill: false,
                    data: arrTwoThird
                },
                {
                    type : 'bar',
                    label: 'موافق',
                    data: arrAgree,
                    backgroundColor: arrAgreeColors
                },
                {
                    type: 'bar',
                    label: 'غير موافق',
                    data: arrDisagree,
                    backgroundColor: arrDisagreeColors
                }
            ]
        },
        options: {
            defaultFontSize: 20,
            defaultFontColor: '#000000',
            legend: {
                display: false
               
            },
            legendCallback: function (chart) {
                var text = [];
                text.push('<ul class="list-inline">');
                text.push('<li><div class="legendValue"><span style="background-color:#b5eec2">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
                text.push('<span class="label" style="margin-right: 5px; margin-left: 20px;">موافق</span>');
               
                text.push('<span style="background-color:#dc3545">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
                text.push('<span class="label" style="margin-right: 5px; margin-left: 20px;">غير موافق</span>');
               
                text.push('<span style="background-color:#28a745">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
                text.push('<span class="label" style="margin-right: 5px; margin-left: 20px;">صدق عليه</span>');
               
                

                text.push('</div></li>');

                
                text.push('</ul>');
                
                return text.join('');
                
            },
            animation: {
                onComplete: function () {
                   
                    var chartInstance = this.chart;
                    var ctx = chartInstance.ctx;
                    ctx.textAlign = "right";
                    ctx.fillStyle = "#fff";
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                labels: {
                    render: function (data) {
                        
                        if (data.dataset.type == 'line') {
                            return '';
                        }
                        else {
                            if (data.value > 0) {
                                return data.value;
                            }
                            else {
                                return '';
                            }
                        }
                    },

                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 20,
                        beginAtZero: false,
                        stepSize: 100,
                        max: total
                        
                        
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: false,
                        fontSize: 20
                        
                        
                        
                        
                    }
                }]
            }
        }
    });

    $('#legend').html('');
    $('#legend').prepend(ch.generateLegend());
}


$(function () {

    
    getResultData();
    
    setInterval('getResultData()', 10000);
    
});




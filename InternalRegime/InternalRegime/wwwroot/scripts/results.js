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
        type: 'horizontalBar',
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
            defaultFontSize: 20,
            defaultFontColor: '#000000',
            legend: {
                display: false
               
            },
            legendCallback: function (chart) {
                var text = [];
                text.push('<ul class="list-inline">');
                text.push('<li><div class="legendValue"><span style="background-color:#a5cae8b0">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
                text.push('<span class="label" style="margin-right: 5px; margin-left: 20px;">موافق</span>');
               
                text.push('<span style="background-color:#bfb391b0">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
                text.push('<span class="label" style="margin-right: 5px; margin-left: 20px;">غير موافق</span>');
               
                text.push('<span style="background-color:#007bff">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
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
                    render: 'value'
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 20
                       
                        
                        
                       
                    }
                }],
                xAxes: [{
                    ticks: {
                       
                        fontSize: 20
                        
                        
                        
                    }
                }]
            }
        }
    });


    $('#legend').prepend(ch.generateLegend());
}


$(function () {

    
    getResultData();
   
    setInterval('getResultData()', 100000);
    
});




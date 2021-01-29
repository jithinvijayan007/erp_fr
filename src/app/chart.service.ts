import { Injectable, ViewChild, QueryList, ViewChildren } from '@angular/core';
// import 'chart.piecelabel.js';
import { BaseChartDirective } from 'ng2-charts/charts/charts';
import { ServerService } from './server.service';
import { log } from 'util';
import { TitleCasePipe } from '@angular/common';

@Injectable()
export class ChartService  {

  @ViewChildren(BaseChartDirective) myChart: QueryList<BaseChartDirective>;

  constructor(private serviceObject: ServerService,
    private titlecasePipe: TitleCasePipe) { 
    this.listColor();
  }
  lstData=[];
  salesColor;
  enquiryColor;
  pieColor=[];
  
  listColor(){
    this.serviceObject.getData("adminsettings/save_settings_api/").subscribe(
      result => {
        if(result['data'])
        this.lstData = result['data'];
        for(let item of this.lstData){
          // if(item['vchr_value'][0]!=""){
            // console.log(item['bln_enabled'],item,"item check");

            if(item['bln_enabled']){

              if(item['vchr_value'][0]!=null && item['vchr_code']=="SALES_COLOUR"){
              
                this.salesColor=item['vchr_value'][0];              
                for(let key of Object.keys(this.barSalesChartColor[1]))
                {
                  this.barSalesChartColor[1][key]=this.salesColor;
                }
  
              }
              else if(item['vchr_value'][0]==null && item['vchr_code']=="SALES_COLOUR"){
  
                for(let key of Object.keys(this.barSalesChartColor[1]))
                {
                  this.barSalesChartColor[1][key]=this.salescolor;
                }
              }

            }
            else if(!item['bln_enabled'] && item['vchr_code']=="SALES_COLOUR"){

              for(let key of Object.keys(this.barSalesChartColor[1]))
              {
                this.barSalesChartColor[1][key]=this.salescolor;
              }
            }

           

        if(item['bln_enabled']){

          if(item['vchr_value'][0]!=null && item['vchr_code']=="ENQUIRY_COLOUR"){

            this.enquiryColor=item['vchr_value'][0];
            for(let key of Object.keys(this.barChartColor[0])){
              this.barChartColor[0][key]=this.enquiryColor;                
            }

            for(let key of Object.keys(this.barSalesChartColor[0])){
              this.barSalesChartColor[0][key]=this.enquiryColor;
            }

          }
          else if(item['vchr_value'][0]==null && item['vchr_code']=="ENQUIRY_COLOUR"){
            for(let key of Object.keys(this.barChartColor[0])){
              this.barChartColor[0][key]=this.enquirycolor;                
            }

            for(let key of Object.keys(this.barSalesChartColor[0])){
              this.barSalesChartColor[0][key]=this.enquirycolor;
            }
          }
        }
        else if(!item['bln_enabled'] && item['vchr_code']=="ENQUIRY_COLOUR"){
          for(let key of Object.keys(this.barChartColor[0])){
            this.barChartColor[0][key]=this.enquirycolor;                
          }

          for(let key of Object.keys(this.barSalesChartColor[0])){
            this.barSalesChartColor[0][key]=this.enquirycolor;
          }
        }
         
          // }

          if(item['bln_enabled']){
            if(item['vchr_value'][0]!=null && item['vchr_code']=="PIE_CHART_COLOURS"){

              this.pieColor=item['vchr_value'];
              this.pieChartColors[0]['backgroundColor']=this.pieColor;
            }
            else if(item['vchr_value'][0]==null && item['vchr_code']=="PIE_CHART_COLOURS"){
              // console.log("no pie color");
              
             this.pieChartColors[0]['backgroundColor']=this.backgroundcolor;
              

            }
          }
          else if(!item['bln_enabled'] && item['vchr_code']=="PIE_CHART_COLOURS"){

            this.pieChartColors[0]['backgroundColor']=this.backgroundcolor;
            
          }
        


          
        }
       
      },
      error => {
        alert(error);
      }
    );
  }


  //************************* barchart colors ************************////
  public barChartColor: Array<any> = [
    {
      // backgroundColor: '#6d78ad',
      backgroundColor: '#0d8ec1',
      borderColor: '#0d8ec1',
      pointBackgroundColor: '#0d8ec1',
      pointBorderColor: '#0d8ec1',
      pointHoverBackgroundColor: '#0d8ec1',
      pointHoverBorderColor: '#0d8ec1',
    }
  ];

  //************************* piechart colors ************************////
  public pieChartColors: Array<any> = [
    {
      backgroundColor: [
        '#01c0c8',
        '#2ecc71',
        '#fb9678',
        '#799fb9',
        '#7e81cb',
        '#cf8595',
        '#9ea720',
        '#bd988b',
        '#008080',
        '#ff99cc',
        '#99ccff',
        '#00ffff',
        '#fba82c',
        '#b0b1a1',
        '#b156b1',
        '#cd3b42',
        '#4188cf',
        '#c18ff4',
        '#866668',
        '#757081',
        '#f4d03f',
      ],
      pointHoverBorderColor: '#5290e9'
    }
  ];
  public salescolor='#77a7fb';
  public enquirycolor='#0d8ec1';

  public backgroundcolor=[
    '#01c0c8',
    '#2ecc71',
    '#fb9678',
    '#799fb9',
    '#7e81cb',
    '#cf8595',
    '#9ea720',
    '#bd988b',
    '#008080',
    '#ff99cc',
    '#99ccff',
    '#00ffff',
    '#fba82c',
    '#b0b1a1',
    '#b156b1',
    '#cd3b42',
    '#4188cf',
    '#c18ff4',
    '#866668',
    '#757081',
    '#f4d03f',
  ]


  // ************************ Donut Piechart colorrs ******************** ////
  public donutChartColors: Array<any> = [
    {
    backgroundColor: [
      '#01c0c8',
      '#2ecc71',
      '#fb9678',
      '#799fb9',
      '#7e81cb',
      '#cf8595',
      '#9ea720',
      '#bd988b',
      '#008080',
      '#ff99cc',
      '#99ccff',
      '#00ffff',
      '#fba82c',
      '#b0b1a1',
      '#b156b1',
      '#cd3b42',
      '#4188cf',
      '#c18ff4',
      '#866668',
      '#757081',
      '#f4d03f',
    ],
    pointHoverBorderColor: '#5290e9'
  }
  ];


  //************************* Sales barchart colors ************************////
  public barSalesChartColor: Array<any> = [
    {
      backgroundColor: '#0d8ec1',
      borderColor: '#0d8ec1',
      pointBackgroundColor: '#0d8ec1',
      pointBorderColor: '#0d8ec1',
      pointHoverBackgroundColor: '#0d8ec1',
      pointHoverBorderColor: '#0d8ec1'
    },
    {
      backgroundColor: '#77a7fb',
      borderColor: '#77a7fb',
      pointBackgroundColor: '#77a7fb',
      pointBorderColor: '#77a7fb',
      pointHoverBackgroundColor: '#77a7fb',
      pointHoverBorderColor: '#77a7fb',
    },
  ];  

  // ************************ Sales Piechart colorrs ******************** ////
  public pieSalesChartColors: Array<any> = [
    {
      backgroundColor: [
        '#01c0c8',
        '#2ecc71',
        '#fb9678',
        '#799fb9',
        '#7e81cb',
        '#cf8595',
        '#9ea720',
        '#bd988b',
        '#008080',
        '#ff99cc',
        '#99ccff',
        '#00ffff',
        '#fba82c',
        '#b0b1a1',
        '#b156b1',
        '#cd3b42',
        '#4188cf',
        '#c18ff4',
        '#866668',
        '#757081',
        '#f4d03f',
      ],
      pointHoverBorderColor: '#5290e9'
    }
  ];

  // ************************ Sales donutchart colors ******************** ////
  public donutSalesChartColors: Array<any> = [
    {
      backgroundColor: [
        '#9fc2e6',
        '#71b37c',
      ],
}
];

  //************************* Stacked barchart colors ************************////
  public stackedbarChartColor: Array<any> = [
    {
      backgroundColor: '#71b37c',
      borderColor: '#71b37c',
      pointBackgroundColor: '#71b37c',
      pointBorderColor: '#71b37c',
      pointHoverBackgroundColor: '#71b37c',
      pointHoverBorderColor: '#71b37c'
    },
    {
      backgroundColor: '#9fc2e6',
      borderColor: '#9fc2e6',
      pointBackgroundColor: '#9fc2e6',
      pointBorderColor: '#9fc2e6',
      pointHoverBackgroundColor: '#9fc2e6',
      pointHoverBorderColor: '#9fc2e6'
    },
  ];


  // ************************ Turnover bar charts **********************

  

  //************************* piechart font color ************************////

  public fontColor = [
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
    'white',
  ]
  // PIE CHART start here
  public pieOptions: any = {
    title: {
      display: false,
      text: 'ALL'
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false }, pieceLabel: {
      render: 'percentage',
      fontColor: 'white',
    }
  }
  public pieChartLabels =[ 'Shafeer', 'Anshid', 'Nisam', 'Sudheesh', 'Joel']
  public pieChartData =[ 20, 20, 15, 33, 22]
  public pieChartType = 'pie';

  // PIE CHART end here


// DONUT CHART start here
public donutOptions: any = {
  title: {
    display: false,
    text: 'ALL'
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: { display: false },
}
public donutChartLabels =[ 'Shafeer', 'Anshid', 'Nisam', 'Sudheesh', 'Joel']
public donutChartData =[ 20, 20, 15, 33, 22]
public donutChartType = 'doughnut';
// DONUT CHART end here

  generalizeBarChartOptions(label, data, type, tooltipss){
  if (type === 'bar') {

    const barOptions: any = {
      scaleShowVerticalLines: false,
      maxBarThickness: 1,
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
        text: 'ALL'
    },
      tooltips: {
        callbacks: {
          title: (q) => {
            const ind = q[0]['index']
            return label[Number(ind)]
          },
          label: (q) => {
            const ind = q['index']
            return label[ind] + ': ' + data[ind]      
          }
        },
      },
      scales: {
        yAxes: [{
        ticks: {
        beginAtZero: true
        }
        }],
        xAxes: [{
          maxBarThickness: 16,
          categoryPercentage: 0.2,
          barPercentage: 16,
                  gridLines: {
                    offsetGridLines: true
                },
                  ticks: {
                          autoSkip: false,
                         }
               }]
        },
        legend: { 
          display: false,
         }
        
    };
    return barOptions;
    // const barOptions: any = {
    //   title: {
    //     display: false,
    //     text: 'ALL'
    //   },
    //   responsive: true,
    //   maintainAspectRatio: false,
    //   legend: { display: false },
    //   scales: {
    //     yAxes: [
    //       {
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }
    //     ],
    //     xAxes: [
    //       {
    //         // maxBarThickness: 15,
    //         // categorySpacing: 0,
    //         categoryPercentage: 1.0,
    //         barPercentage: 1.0,
    //         barThickness:8,
    //         gridLines: {
    //           offsetGridLines: true
    //         },
    //         ticks: {
    //           autoSkip: false
    //         }
    //       }
    //     ]
    //   },
    //   tooltips: {
    //     callbacks: {
    //       title: (q) => {
            
    //         const ind = q[0]['index']
    //         return label[Number(ind)]

    //       },
    //       label: (q) => {
    //         const ind = q['index']
    //         return label[ind] + ': ' + data[ind]
    //       }
    //     },
    //   },
    // }
    // return barOptions;
  }

  else if (type === 'grouped_bar') {
    const barOptions: any = {
      scaleShowVerticalLines: false,
        barPercentage: 2.0,
        maxBarThickness: 1,
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: ''
        },
        scales: {
          yAxes: [
            {
              // stacked:true,
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              // stacked:true,
              maxBarThickness: 15,
              // categoryPercentage: 0.4,
              // barPercentage: 1.0,
              gridLines: {
                offsetGridLines: true
              },
              ticks: {
                autoSkip: false
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            title: q => {
  
              // let datsetindex1 = q[0]['datasetIndex']
              const ind = q[0]['index'];
              
              return label[Number(ind)];
              // return false
            },
            label: q => {
              const datsetindex = q['datasetIndex'];
              const temp = data[datsetindex]['data'];
              const ind = q['index'];
              
              if (datsetindex == 1) {
                return tooltipss[1] + ' : ' + temp[ind];
              }
               else {
                return tooltipss[0] + ' : ' + temp[ind];
              }
              // return this.subcategoryOriginalLabels[Number(ind)] + ':' + temp[ind];
            }
          }
        },
        legend: {
          display: true,
          fullWidth: false,
          labels: {
            boxWidth: 12,
          },
          position: 'top',
        }
    };

    return barOptions;
  }
else if (type === 'stacked_bar') {
  const barOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    // responsive: false,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          // stacked: true,
          ticks: {
            beginAtZero: true,
            stepValues: 10
          }
        }
      ],
      xAxes: [
        {
          stacked: true,
          maxBarThickness: 20,
          // categoryPercentage : 0.2,
          gridLines: {
            offsetGridLines: true
          },
          ticks: {
            autoSkip: false
          }
        }
      ]
    },
    legend: { display: true,
            fullWidth: false,
            labels: {
            boxWidth: 10,
                   },
             position: 'top', },
    title: {
      display: false,
      text: 'ALL'
    },
    tooltips: {
      callbacks: {
        title: q => {
          const datsetindex = q[0]['datasetIndex'];
          // const ind = q[0]['index'];

          // return this.barChartLabelsBackup[Number(ind)];
          return data[Number(datsetindex)]['label'];
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = data[datsetindex]['data'];
          const ind = q['index'];
          // if (datsetindex) { return 'Sales:' + temp[ind]; } else { return 'Enquiry:' + temp[ind]; }
          return label[Number(ind)] + ':' + temp[ind];
        }
      }
    }
  };

  return barOptions;
}
}

// BAR CHART start here
getbarchartOptions(label,data) {

  const barOptions: any = {
  title: {
    display: false,
    text: 'ALL'
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: { display: false },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ],
    xAxes: [
      {
        maxBarThickness: 15,
        categoryPercentage: 0.4,
        barPercentage: 1.0,
        gridLines: {
          offsetGridLines: true
        },
        ticks: {
          autoSkip: false
        }
      }
    ]
  },
  tooltips: {
    callbacks: {
      title: (q) => {
        const ind = q[0]['index']
        return label[Number(ind)]
      },
      label: (q) => {
        const index = q['index']
        return label[index] +': '+data[index]
      }
    },
  },
}
return barOptions;
}
public barChartLabels =[ 'Shafeer', 'Anshid', 'Nisam', 'Sudheesh', 'Joel']
public barChartData =[ 20, 20, 15, 33, 22]
public barChartType = 'bar';
// BAR CHART end here

// Sales PIE CHART start here
public salespieOptions: any = {
  title: {
    display: false,
    text: 'ALL'
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: { display: false },
}
public salespieChartLabels =[ 'Shafeer', 'Anshid', 'Nisam', 'Sudheesh', 'Joel']
public salespieChartData =[ 20, 20, 15, 33, 22]
public salespieChartType = 'pie';
// Sales DONUT CHART start here
public salesdonutOptions: any = {
  title: {
    display: false,
    text: 'ALL'
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: { display: false },
}
public salesdonutChartLabels =[ 'Sudheesh', 'Joel']
public salesdonutChartData =[ 20, 33]
public salesdonutChartType = 'doughnut';
// Sales DONUT CHART end here

// Sales BAR CHART start here
public salesbarOptions: any = {
  title: {
    display: false,
    text: 'ALL'
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: true,
    fullWidth: false,
    labels: {
      boxWidth: 10,
    },
    position: 'top',
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ],
    xAxes: [
      {
        maxBarThickness: 15,
        categoryPercentage: 0.4,
        barPercentage: 1.0,
        gridLines: {
          offsetGridLines: true
        },
        ticks: {
          autoSkip: false
        }
      }
    ]
  },
  tooltips: {
    callbacks: {
      title: (q) => {
        const ind = q[0]['index']
        return this.barChartLabels[Number(ind)]
      },
      label: (q) => {
        const index = q['index']
        return this.barChartLabels[index] +': '+this.barChartData[index]
      }
    },
  },
}
public salesbarChartLabels =[ 'Shafeer', 'Anshid', 'Nisam', 'Sudheesh', 'Joel']
public salesbarChartData= [
  { data:  [8, 10, 5, 3, 12], label: 'Customer' },
  { data:[24, 20, 35, 33, 22], label: 'Sale' },  ];
public salesbarChartType = 'bar';
// Sales BAR CHART end here

// Stacked BAR CHART start here
public stackedbarOptions: any = {
  title: {
    display: false,
    text: 'ALL'
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: true,
    fullWidth: false,
    labels: {
      boxWidth: 10,
    },
    position: 'top',
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ],
    xAxes: [
      {
        stacked: true,
        maxBarThickness: 15,
        categoryPercentage: 0.4,
        barPercentage: 1.0,
        gridLines: {
          offsetGridLines: true
        },
        ticks: {
          autoSkip: false
        }
      }
    ]
  },
  tooltips: {
    callbacks: {
      title: (q) => {
        const ind = q[0]['index']
        return this.barChartLabels[Number(ind)]
      },
      label: (q) => {
        const index = q['index']
        return this.barChartLabels[index] +': '+this.barChartData[index]
      }
    },
  },
}
public stackedbarChartLabels =[ 'Shafeer', 'Anshid', 'Nisam', 'Sudheesh', 'Joel']
public stackedbarChartData= [
  { data:  [8, 10, 5, 3, 12], label: 'Customer' },
  { data:[24, 20, 35, 33, 22], label: 'Sale' },  ];
  public stackedbarChartType = 'bar';
  // Stacked BAR CHART end here


  //*********For highchart**********


  // Grouped (two) Bar chart

  setHighBarchartOptions(dctBarChart) {
    /*
    chartName - Heading of chart
    label - List of Labels on X-axis 
    data - List of Dictionary with name, values keys for 2 bars
    xTitle - 
    */
  let type='column';

  if(dctBarChart.type){
    type='bar';
  }

  let tempLabels=dctBarChart.label;

  const barChart1Options = {
    chart: {
      type: type,
    },
    title: {
      text: '',
    },
    subtitle: {
      // text: 'All'
    },
    xAxis: {
      categories:this.formatLabel(dctBarChart.label)
      ,
      crosshair: false,
      title: {
        text: dctBarChart.titles['xTitle']
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: dctBarChart.titles['yTitle']
      }
    },
    legend: {
      layout: 'vertical',
      backgroundColor: '#FFFFFF',
      align: 'left',
      verticalAlign: 'top',
      x: 100,
      y: 70,
      floating: true,
      shadow: true
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: '#0000008f',
      borderWidth: 0,
      style: {

        fontFamily: 'comic sans ms',
        color: 'white',
        opacity: 1,

      },
      formatter: function() {
        let labelIndex=this.points[0].point.index;
        return '<span style="font-size:10px">'
        +tempLabels[labelIndex]+
        '</span><table><tr><td>'+this.points[0].series.name+': <b>'+this.points[0].y+'</b></td></tr><tr><td>'+this.points[1].series.name+': <b>'+this.points[1].y+'</b></td></tr><br/>';
               
      }
      
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        pointWidth: 15

      },
      series: {

          // shadow: true,
          point: {
            events: {}
          }
      }
    },
    series: [
      
      {

      name: dctBarChart.data[0].name,
      data: dctBarChart.data[0].values,
            
        
      type: 'column',
      color: {
        linearGradient: {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 1
        },
        stops: [
          [0, '#4481eb'],
          [1, '#04befe']
        ]
      }
    },
    {
      name: dctBarChart.data[1].name,
      data:dctBarChart.data[1].values,
       

      type: 'column',
      color: {
        linearGradient: {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 1
        },
        stops: [
          [0, '#84fab0'],
          [1, '#a1dd70']
        ]
      }
    },
  ],
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
  }
  };

  return barChart1Options;

}




// For single bar chart

 setSingleBarchartOptions(dctBarChart) {

  /*
  chartName - Heading of chart
  label - List of Labels on X-axis 
  data - Dictionary with name, values keys for 2 bars
  titles - x & y axis titles
  */

 let type='column';
  
  if(dctBarChart.type){
    type='bar';
  }


let tempLabels=dctBarChart.label;
const singleChart1Options =  {
    chart: {
        type: type,       
    },
    
    title: {
        text: ''
    },
    subtitle: {
    },
    xAxis: {
        title: {
          text: dctBarChart.xTitle
        },
        categories: this.formatLabel(dctBarChart.label),
        crosshair: false
    },
    yAxis: {
        min: 0,
        title: {
            text: dctBarChart.yTitle
        }
    },
    tooltip: {
        formatter: function() {
          let labelIndex=this.points[0].point.index;
          return '<span style="font-size:10px">'
          +tempLabels[labelIndex]+
          '</span><table><tr><td>'+this.points[0].series.name+': <b>'+this.points[0].y+'</b></td></tr><br/>';
                
        },
        // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        // footerFormat: '</table>',
        shared: true,
        useHTML: true,
        backgroundColor: '#0000008f',
        borderWidth: 0,
        style: {
         
           fontFamily: 'comic sans ms',
           color:'white',
           opacity: 1,
          
       }
       },
    plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
              pointWidth: 15

            },
            series: {
              shadow: true,
              point: {
                events: {}
              }
            }
    },
    series: [{
        name: dctBarChart.data.name,
        data: dctBarChart.data.values,
        type : 'column',
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, '#4481eb'],
            [1, '#04befe']
          ]
        }
  
    }],
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
  }
  }

return singleChart1Options;

}

setNegativeBarchart(dctData){

  let tempLabels=dctData.label;


  let type='column';

  if(dctData.type){
    type='bar';
  }

  if(dctData.tooltips){ //If have different tooltips
    tempLabels=dctData.tooltips;
  }

  const chartOptions= {
      chart: {
          type: type
      },
      title: {
          text: dctData['chartName']
      },
      xAxis: {
          title: {
            text: dctData.xTitle
          },
          categories:this.formatLabel(dctData['label'])
      },
      yAxis: {
        title: {
          text: dctData.yTitle
        },
      },
      credits: {
          enabled: false
      },
      tooltip: {
        formatter: function() {
          let labelIndex=this.points[0].point.index;
          return '<span style="font-size:10px">'
          +tempLabels[labelIndex]+
          '</span><table><tr><td>'+this.points[0].series.name+': <b>'+this.points[0].y+'</b></td></tr><br/>';
                
        },
        shared: true,
        useHTML: true,
        backgroundColor: '#0000008f',
        borderWidth: 0,
        style: {
         
           fontFamily: 'comic sans ms',
           color:'white',
           opacity: 1,
          
       }
       },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          pointWidth: 15

        },
        bar: {
          pointPadding: 0.2,
          borderWidth: 0,
          pointWidth: 15

        },
        series: {
          shadow: true,
          point: {
            events: {}
          }
        }
      },
      series: [
       {
          name: dctData['data']['name'],
          data: dctData['data']['values']
      }],
      exporting: {
        enabled: false
    }
  }
  return chartOptions;
}

// Spline chart

setHighSplineChart(dctSplineChart){

  let tempLabels=dctSplineChart.label;


  const splineChart1Options =
  {
    chart:{
      type: 'spline' ,
      
     
    },
    title:{
      text: dctSplineChart.chartName,       
    },
    subtitle:{
             },
    xAxis: {
            categories: this.formatLabel(dctSplineChart.label),
            title: {
                text: dctSplineChart.xTitle
            },
    },
    yAxis: {
            title: {
                text: dctSplineChart.yTitle
            },
    },
    tooltip: {
      formatter: function() {
        let labelIndex=this.points[0].point.index;
        return '<span style="font-size:10px">'
        +tempLabels[labelIndex]+
        '</span><table><tr><td>'+this.points[0].series.name+': <b>'+this.points[0].y+'</b></td></tr><br/>';
              
      },
      shared: true,
      useHTML: true,
      backgroundColor: '#0000008f',
      borderWidth: 0,
      style: {
       
         fontFamily: 'comic sans ms',
         color:'white',
         opacity: 1,
        
     }
     },
    plotOptions: {
            spline: {
              marker: {
                fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: null
              }
            },
            series: {
              shadow: true,
              point: {
                events: {}
              }
            }
    },
    credits: {
            enabled: false
    },
    series: dctSplineChart.data,
    exporting: {
      enabled: false
  }

  }
  return splineChart1Options;
}

// Line chart

setHighLineChart(dctLineChart){
  

  const lineChart1Options =
  {
    chart:{
      type: 'line' ,
      // backgroundColor: {
      //   linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
      //   stops: [
      //       [0, 'rgb(255, 255, 255)'],
      //       [1, 'rgb(200, 200, 255)']
      //   ]
      // },
     
    },
    title:{
      text: dctLineChart.chartName,       
    },
    subtitle:{
             },
    xAxis: {
            categories: dctLineChart.label,
            title: {
                text: dctLineChart.xTitle
            },
    },
    yAxis: {
            title: {
                text: dctLineChart.yTitle
            },
    },
    tooltip: {
            crosshairs: true,
            shared: true
    },
    plotOptions: {
            line: {
              marker: {
                fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: null
              }
            },
            series: {
              point: {
                events: {}
              }
            }
    },
    credits: {
            enabled: false
    },
    series: [
            {
                name: dctLineChart.data[0].name,
                marker: {
                  symbol: 'circle'
                },
                data: dctLineChart.data[0].values,
                type: 'line',
                
            },
            // {
            //     name: dctLineChart.data.name,
            //     marker: {
            //       symbol: 'circle'
            //     },
            //     data: dctLineChart.data.values,
            //     type : 'line',
            //     color: {
            //       linearGradient: {
            //         x1: 0,
            //         x2: 0,
            //         y1: 0,
            //         y2: 1
            //       },
            //       stops: [
            //         [0, '#43e97b'],
            //         [1, '#38f9d7']
            //       ]
            //     }
            // }
    ],
    exporting: {
      enabled: false
  }

  }
  return lineChart1Options;
}

// Area Spline chart

setHighAreaSplineChart(dctAreaChart){

  const areaChart1Options =
  {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: dctAreaChart.chartName
    },
    
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
       
    },
    xAxis: {
        categories: dctAreaChart.label,
        title: {
          text: dctAreaChart.xTitle
        },
        plotBands: [{ // visualize the weekend
            from: 4.5,
            to: 6.5,
            // color: 'rgba(68, 170, 213, .2)'
        }]
    },
    yAxis: {
        title: {
            text: dctAreaChart.yTitle
        }
    },
    tooltip: {
        shared: true,
        valueSuffix: ' units'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        areaspline: {
            fillOpacity: 0.5
        },
        series: {
          point: {
            events: {}
          }
        }
    },
    series: [{
        name: dctAreaChart.data[0].name,
        data: dctAreaChart.data[0].values,
        type: 'areaspline',
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, '#fad0c4'],
            [1, '#ffd1ff']
          ]
        }
        }, {
            name: dctAreaChart.data[1].name,
            data: dctAreaChart.data[1].values,
            type: 'areaspline'
          }],
          exporting: {
            enabled: false
        }
    
  }
  return areaChart1Options;
}


// Pie chart

setHighPieChart(dctPieChart){

  const pieChart1Options = {

  chart: {
      
      type: 'pie',
      
  },

  title: {
      text: dctPieChart.chartName
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    series: {
      point: {
        events: {}
      }
    }
  },
  exporting: {
    enabled: false
},
  series: [{
      name:'value',
      type: 'pie',
      allowPointSelect: true,
      keys: ['name', 'y', 'selected', 'sliced'],
      data: dctPieChart.data,
      showInLegend: true,
      point: {
        events: {
          // click: (event) => this.pieChart1Clicked(event)
        
        }
      }
      
  }],
  
}

return pieChart1Options;
}

formatLabel(labels){
      labels = labels.map(obj => {
      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      obj = this.titlecasePipe.transform(obj);
      return obj;
      });
      return labels;
}

setHighBubbleChart(dctBubbleChart){

// Bubble  chart
const bubbleChart1Options= {

  chart: {
    type: 'bubble',
    zoomType: 'xy',
    plotBorderWidth: 1,
  },
  title: {
    text: ''
  },
  credits: {
    enabled: false
  },
  legend: {
    enabled: true
  },
  xAxis: {
    gridLineWidth: 1,
    lineWidth: 0,
    tickWidth: 0,
  },
  yAxis: {
    title: {
      text: ''
    }
  },
  plotOptions: {
    series: {
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        }
    }
},
// tooltip: {
//   useHTML: true,
//   headerFormat: '<b>{series.name}</b><br>',
//   pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
//       '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
//       '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
//       '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
//   footerFormat: '</table>',
//   followPointer: true
// },
series: [

   {
    name: dctBubbleChart.data.name,
    type: 'bubble',
    data: [ dctBubbleChart.data.values ],
  }
 
 ],
 exporting: {
  enabled: false
}
}

return bubbleChart1Options;

}
// stack barchart (highchart)
setStackBarChart(tempData){

    const options = {   
      chart: {
         type: 'column'
      },
      title: {
         text: ''
      },
      // subtitle : {
      //    text: 'Source: Wikipedia.org'  
      // },
      legend : {
         layout: 'vertical',
         align: 'left',
         verticalAlign: 'top',
         x: 250,
         y: 100,
         floating: true,
         borderWidth: 1,
        
         backgroundColor: ('#FFFFFF'), shadow: true
      },
      xAxis:{
         categories:tempData.label, title: {
            text: null
         } 
      },
      yAxis : {
         min: 0,
         title: {
            text: '',
            // align: 'high'
         },

      },
      plotOptions : {
         column: {
            dataLabels: {
               enabled: true
            }
         },
        //  series: {
        //     stacking: 'normal'
        //  }
         series: {
          stacking: 'normal',
          // shadow: true,
          point: {
            events: {}
          }
      }
      },
      credits:{
         enabled: false
      },
      exporting: {
        enabled: false
    },
       series: tempData.data
      // [
      //    {
      //       name: 'Year 1900',
      //       data: [133, 156, 947, 408, 6]
      //    }, 
      //   //  {
      //   //     name: 'Year 2008',
      //   //     data: [973, 914, 4054, 732, 34]      
      //   //  }
      // ]
   };
   return options;
  }


}





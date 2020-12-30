import { Component, AfterViewInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import * as c3 from 'c3';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';

declare var require: any;

const data: any = require('./data.json');

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements AfterViewInit {
  public config: PerfectScrollbarConfigInterface = {};

  constructor() { }

  lineChart: Chart = {
    type: 'Line',
    data: data['Line'],
    options: {
      low: 0,
      high: 48,
      showArea: true,
      fullWidth: true,
      axisY: {
        onlyInteger: true,
        scaleMinSpace: 40,
        offset: 20,
        labelInterpolationFnc: function (value) {
          return (value / 10) + 'k';
        }
      },
    }
  };

  lineChart2: Chart = {
    type: 'Line',
    data: data['Line2'],
    options: {
      low: 0,
      high: 48,
      showArea: true,
      fullWidth: true,
      axisY: {
        onlyInteger: true,
        scaleMinSpace: 40,
        offset: 0,
        labelInterpolationFnc: function (value) {
          return (value / 10) + 'k';
        }
      },
      chartPadding: {
        right: 0,
        left: 0
      },
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 2
      }),
    }
  };

  lineChart3: Chart = {
    type: 'Line',
    data: data['Line3'],
    options: {
      low: -10,
      high: 42,
      showArea: true,
      fullWidth: true,
      axisY: {
        onlyInteger: true,
        scaleMinSpace: 40,
        offset: 0,
        labelInterpolationFnc: function (value) {
          return (value / 10) + 'k';
        }
      },
      chartPadding: {
        right: 0,
        left: 0
      },
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 2
      }),
    }
  };

  // lineChart
  public lineChartData: Array<any> = [
    { data: [12, 19, 3, 5], label: 'Sale %' }
  ];
  public lineChartLabels: Array<any> = [
    '2012', '2013', '2014', '2015'
  ];
  public lineChartOptions: any = {
    elements: {
      point: {
        radius: 2
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    tooltips: {
      enabled: true,
      intersect: false,
      titleMarginBottom: 1,
      bodySpacing: 1,
      yPadding: 2,

    },

    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false
        }
      }]
    },
    legend: {
      display: false,
      labels: {
        fontColor: 'rgb(255, 99, 132)'
      }
    }
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: '#8b5edd',
      borderWidth: 2,
      pointBorderWidth: 2,
      pointBackgroundColor: '#8b5edd',
      pointHoverBackgroundColor: '#8b5edd',
      pointHoverBorderColor: '#8b5edd'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  // linechart 2
  public lineChartData1: Array<any> = [
    { data: [3, 8, 2, 3, 2, 5, 9, 6], label: 'A' },
    { data: [7, 6, 5, 8, 6, 7, 5, 9], label: 'B' }
  ];
  public lineChartLabels1: Array<any> = [
    1, 2, 3, 4, 5, 6, 7, 8
  ];
  public lineChartOptions1: any = {
    elements: {
      point: {
        radius: 1
      }
    },
    tooltips: {
      enabled: true,
      intersect: false,
      titleMarginBottom: 1,
      bodySpacing: 1,
      yPadding: 2,

    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false
        }
      }]
    },
    layout: {
      padding: {
        left: -10,
        right: 0,
        top: 0,
        bottom: -10
      }
    },
    legend: {
      display: false,
      labels: {
        fontColor: 'rgb(255, 99, 132)'
      }
    }
  };
  public lineChartColors1: Array<any> = [
    {
      borderColor: '#6495ed',
      borderWidth: 1,
      backgroundColor: 'rgb(19,126,255)',
      pointBackgroundColor: '#6495ed',
    },
    {
      borderColor: '#e9ecef',
      borderWidth: 1,
      backgroundColor: 'rgb(233,236,239)',
      pointBackgroundColor: '#e9ecef',
    }
  ];
  public lineChartLegend1 = true;
  public lineChartType1 = 'line';

  ngAfterViewInit() {
    const chart1 = c3.generate({
      bindto: '.yearlyvisit',
      data: {
        columns: [
          ['Email', 45],
          ['Website', 15],
          ['Mobile', 27],
          ['Other', 18],
        ],

        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        title: 'Yearly Visit',
        width: 35,

      },

      legend: {
        hide: false
        // or hide: 'data1'
        // or hide: ['data1', 'data2']
      },
      color: {
        pattern: ['#8b5edd', '#5ac146', '#6495ed', '#eceff1']
      }
    });

    const chart2 = c3.generate({
      bindto: '.monthlyvisit',
      data: {
        columns: [
          ['Conversation', 85],
          ['other', 15],
        ],

        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        title: 'Monthly Visit',
        width: 10,

      },
      padding: {
        top: 10,
        bottom: -20

        ,
      },
      legend: {
        hide: true
        // or hide: 'data1'
        // or hide: ['data1', 'data2']
      },
      color: {
        pattern: ['#6495ed', '#eceff1']
      }
    });

    const chart3 = c3.generate({
      bindto: '#campaign',
      data: {
        columns: [
          ['Un-opened', 35],
          ['Clicked', 15],
          ['Open', 10],
          ['Bounced', 18],
        ],

        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        width: 20,
      },

      legend: {
        hide: true
      },
      color: {
        pattern: ['#6495ed', '#8b5edd', '#5ac146', '#eceff1']
      }
    });

    const chart4 = c3.generate({
      bindto: '#visit-stats',
      data: {
        columns: [
          ['Site A', 0, 15, 15, 38, 8, 40, 20, 100, 70],
          ['Site B', 0, 35, 30, 60, 20, 80, 50, 180, 150]
        ],
        type: 'area-spline',
        groups: [['Site A', 'Site B']]
      },
      axis: {
        y: {
          show: true,
          tick: {
            count: 0,
            outer: false
          }
        },
        x: {
          show: true
        }
      },
      padding: {
        top: 20,
        right: 10,
        bottom: 0,
        left: 30
      },
      point: {
        r: 2
      },
      legend: {
        hide: true
      },
      color: {
        pattern: ['#6495ed', '#afb5c1']
      }
    });

    (<any>$('#sales3')).sparkline([6, 10, 9, 11, 9, 10, 12], {
      type: 'bar',
      height: '55',
      barWidth: '4',
      width: '100%',
      resize: true,
      barSpacing: '11',
      barColor: '#5ac146'
    });
  }
}

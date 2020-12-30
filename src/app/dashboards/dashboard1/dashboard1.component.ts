import { Component, AfterViewInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import * as c3 from 'c3';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import * as shape from 'd3-shape';
import * as d3 from 'd3';
import { single } from './data';
// import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';

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
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements AfterViewInit {
    public config: PerfectScrollbarConfigInterface = {};

    single: any[];
    dateData: any[];
    dateDataWithRange: any[];
    range = false;
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    tooltipDisabled = false;
    xAxisLabel = 'Region';
    showYAxisLabel = true;
    yAxisLabel = 'Sales';
    showGridLines = true;
    innerPadding = 0;
    autoScale = true;
    timeline = false;
    barPadding = 5;
    groupPadding = 0;
    roundDomains = false;
    maxRadius = 10;
    minRadius = 3;
    view = '';
    showLabels = true;
    explodeSlices = false;
    doughnut = false;
    arcWidth = 0.25;
    rangeFillOpacity = 0.15;

    colorScheme = {
        domain: ['#4fc3f7', '#fb8c00', '#7460ee', '#fa5838', '#5ac146', '#6495ed']
    };
    schemeType = 'ordinal';

    constructor() {
        Object.assign(this, {
            single
        });
    }

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
            }
        }
    };

    ngAfterViewInit() {
        // ==============================================================
        // campaign
        // ==============================================================
        const chart1 = c3.generate({
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
                width: 15,
            },

            legend: {
                hide: true
            },
            color: {
                pattern: ['#6495ed', '#8b5edd', '#5ac146', '#eceff1']
            }
        });

        // ==============================================================
        // weather
        // ==============================================================
        const chart2 = c3.generate({
            bindto: '.weather-report',
            data: {
                columns: [
                    ['Day 1', 21, 15, 30, 45, 15]
                ],
                type: 'area-spline'
            },
            axis: {
                y: {
                    show: false,
                    tick: {
                        count: 0,
                        outer: false
                    }
                },
                x: {
                    show: false,
                }
            },
            padding: {
                top: 0,
                right: -8,
                bottom: -28,
                left: -8,
            },
            point: {
                r: 2,
            },
            legend: {
                hide: true
            },
            color: {
                pattern: ['#5ac146']
            }

        });

        (<any>$('#earnings')).sparkline([6, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9], {
            type: 'bar',
            height: '40',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '8',
            barColor: '#6495ed'
        });
    }
}

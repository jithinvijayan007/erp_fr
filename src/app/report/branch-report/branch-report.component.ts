import { SnotifyService } from 'ng-snotify';

import { Component, OnInit, ViewChild , ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {ServerService} from 'src/app/server.service';
import { SharedService } from '../../layouts/shared-service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog  } from '@angular/material/dialog';
import * as moment from 'moment';
import { TypeaheadService } from 'src/app/typeahead.service';
import { ChartService } from '../../chart.service';
import 'chart.piecelabel.js';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-branch-report',
  templateUrl: './branch-report.component.html',
  styleUrls: ['./branch-report.component.scss']
})
export class BranchReportComponent implements OnInit {
  selectedOption: any = '';
  selectedFromDate;
  selectedToDate;

  // chip list
  @ViewChild('idBranch') idBranch: ElementRef;
  statusSelected = [];
  lstBranches = [];
  searchBranch: FormControl = new FormControl();
  branchCode = '';
  branchName = '';
  selectedBranch = [];
  branchId: number;

  selectedEnquirytoDisplayInChart = '-All'

  lstBranchArray = [];
  lstCompanyBranches = [];
  dctEnquiryDetails = [];
  displayedColumns = ['date', 'enqno', 'branch' ,  'staff', 'customer', 'mobile' , 'service' , 'status' ];
  dataSource = new MatTableDataSource(this.dctEnquiryDetails)

  // bar chart colors
  public barChartColor: Array<any> = this.chartservice.barChartColor;
  // pie chart colors
  public pieChartColors: Array<any> = this.chartservice.pieChartColors;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


blnDataLoaded = false;

// employee wise pie chart data

public pieStatusLabels: string[] = [];
public pieStatusData: number[] = [];
public empPieChartType = 'pie';


// service wise pie chart data
public pieServiceLabels: string[] = [];
public pieServiceData: number[] = [];
public pieChartType = 'pie';

  // ng models used
  strSelectedOption;
  datFromDate;
  datToDate;

dctReportData: any = [];
public pieStatusOptions: any = {
  title: {
    display: false,
    text: 'ALL'
} ,
responsive: true,
maintainAspectRatio: false,
legend: { display: false }
}
  public pieServiceOptions: any = {
    title: {
      display: false,
      text: 'ALL'
  } ,
  responsive: true,
  maintainAspectRatio: false,
  legend: { display: false }
 }
  datToDateMin;
  pageTitle = 'Bar Chart';
  public barChartOptions: any = {
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
          // let datsetindex1 = q[0]['datasetIndex']
          // const ind = q[0]['index']
          // return this.barChartLabelsCopy[Number(ind)];
          return false
        },
        label: (q) => {
          const datsetindex = q['datasetIndex']
          const temp = this.barChartData[datsetindex]['data'];
          const ind = q['index']
          // if (datsetindex) { return 'Sales:' + temp[ind]; } else { return 'Enquiry:' + temp[ind]; }
          return this.barChartLabelsCopy[Number(ind)] + ':' + temp[ind];
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
        maxBarThickness: 20,
                // categoryPercentage : 0.2,
                gridLines: {
                  offsetGridLines: true
              },
                ticks: {
                        autoSkip: false,
                       }
             }]
      },
      legend: { display: false ,
      position : 'bottom'
    }

  };



  lstAvailabeSelections = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom']
  public form: FormGroup;

  barChartLabels = [];
  barChartLabelsCopy = [];

  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [
    {data: [], label: 'Enquiries'},
  ];


    constructor(private serverService: ServerService,
      public dialog: MatDialog,
      private _sharedService: SharedService,
      public router: Router ,
      private fb: FormBuilder,
      private typeaheadObject: TypeaheadService,
      private snotifyService: SnotifyService,
      private chartservice:ChartService) {
      this._sharedService.emitChange(this.pageTitle);
    }

    ngOnInit() {
      this.chartservice.listColor();

      if (!localStorage.getItem('Tokeniser')) {
        this.router.navigate(['/user/sign-in']);
      }
      this.form = this.fb.group(
        {
          fdate: [null, Validators.compose([Validators.required])],
          tdate: [null, Validators.compose([Validators.required])],
      });

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datFromDate = moment();
      this.datToDate =  moment();
      this.showDatewiseData(this.datFromDate, this.datToDate);
      // this.showAll()
      this.searchBranch.valueChanges
       .pipe(debounceTime(400))
       .subscribe((data: string) => {
         if (data === undefined || data == null || data === '') {
         } else {
           if (data.length > 2) {
             this.lstBranches = [];
             this.typeaheadObject
               .searchBranch(data)
               .subscribe(
               (response: {
                 status: string;
                 data: Array<{
                   account: string;
                   accountId: number;
                   accountCode: string;
                 }>;
               }) => {
                 this.lstBranches.push(...response.data);

               }
               );
           }
         }
       });
    }

showDatewiseData(fdate, tdate) {
  this.blnDataLoaded = false;
  if (fdate && tdate) {
  const dctJsonData = {};
  this.selectedFromDate = fdate.format('YYYY-MM-DD');
  this.selectedToDate = tdate.format('YYYY-MM-DD');
  dctJsonData['date_from'] = this.selectedFromDate;
  dctJsonData['date_to'] = this.selectedToDate;
  dctJsonData['company_id'] = localStorage.getItem('companyId')
  dctJsonData['branch'] = this.statusSelected.map(x => x.id);
  // this.serverService.getBranchReportData(JSON.stringify(dctJsonData))
  // .subscribe(
  //   (response) => {

  //     this.dctReportData = response;
  //     this.lstCompanyBranches = response['lst_branch_data'];

  //     this.showAll();

  //   },
  //   (error) => {
  //   });

  //edited

  this.serverService.postData("enquiry/branchreport/",dctJsonData)
  .subscribe(
    (response) => {

      this.dctReportData = response;
      this.lstCompanyBranches = response['lst_branch_data'];

      this.showAll();

    },
    (error) => {
    });
  }
}


public chartClicked(e: any): void {

if (e.active.length > 0) {
  this.selectedOption = this.barChartLabelsCopy[e.active[0]._index];
  const data = this.lstCompanyBranches.filter(x => String(x.vchr_name).toLowerCase() === String(this.selectedOption).toLowerCase());
  this.selectedBranch = [];
  this.selectedBranch.push(data[0].pk_bint_id);

this.pieServiceLabels = [];
this.pieServiceData = [];
this.pieStatusLabels = [];
this.pieStatusData = [];

// assign data to servicewise
const pieData = this.dctReportData.lst_branch_wise_service_count.filter(x => String(Object.keys(x)) === String(this.selectedOption))

this.pieServiceLabels.push(...Object.keys(pieData[0][this.selectedOption]['count']));
this.pieServiceData.push(...(Object.keys(pieData[0][this.selectedOption]['count']))
.map(key => (pieData[0][this.selectedOption]['count'])[key]))

setTimeout(() => (this.pieServiceLabels = Object.assign([], this.pieServiceLabels)));
setTimeout(() => (this.pieServiceData = Object.assign([], this.pieServiceData)));
const pieDatastatus = this.dctReportData.lst_branch_wise_status_count.filter(x => String(Object.keys(x)) === String(this.selectedOption))

this.pieStatusLabels.push(...Object.keys(pieDatastatus[0][this.selectedOption]));
this.pieStatusData.push(...(Object.keys(pieDatastatus[0][this.selectedOption]))
.map(key => (pieDatastatus[0][this.selectedOption])[key]))
setTimeout(() => (this.pieStatusLabels = Object.assign([], this.pieStatusLabels)));
setTimeout(() => (this.pieStatusData = Object.assign([], this.pieStatusData)));

this.pieServiceOptions.title.text = this.selectedOption;
this.pieStatusOptions.title.text = this.selectedOption;


// assign data to table
// tslint:disable-next-line:max-line-length
const lst_branch_wise_data =  this.dctReportData.lst_enquiry_data.filter(x => String(x.branch_name).toLowerCase() === String(this.selectedOption).toLowerCase());
this.dataSource = new MatTableDataSource(lst_branch_wise_data);
this.dataSource.paginator = this.paginator;
this.dataSource.paginator.firstPage();
this.dataSource.sort = this.sort;

  }
}
public piechartClicked(e: any) {
  if (!this.selectedOption) {
    this.snotifyService.error('Select a branch in bar chart');
    return false;
  }
  if (e.active.length > 0) {
  const selectedOption = this.pieServiceLabels[e.active[0]._index];

  this.pieStatusLabels = [];
      this.pieStatusData = [];
      const piestatusDataSet = this.dctReportData.lst_branch_wise_service_count.filter(x => x[this.selectedOption])
      const labelllist = Object.keys(piestatusDataSet[0][this.selectedOption]['user_status_count_data'][selectedOption])
      const dataset = labelllist.map(x => piestatusDataSet[0][this.selectedOption]['user_status_count_data'][selectedOption][x] )
      this.pieStatusLabels.push(...labelllist);
      this.pieStatusData.push(...dataset);

      // ...(Object.keys(piestatusData[0][cus_id])).map(key => (piestatusData[0][cus_id])[key])

      setTimeout(
        () => (this.pieStatusLabels = Object.assign([], this.pieStatusLabels))
      );
      setTimeout(
        () => (this.pieStatusData = Object.assign([], this.pieStatusData))
      );
      // status joel
      const garphname =  selectedOption;
      this.pieStatusOptions.title.text = selectedOption;
    }
}
applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}
exportExcel() {
  if (this.barChartLabels.length > 0) {
  const importantStuff = window.open('', '_blank');
  const dctJsonData = {};
  dctJsonData['date_from'] = this.selectedFromDate;
  dctJsonData['date_to'] = this.selectedToDate;
  dctJsonData['company_id'] = localStorage.getItem('companyId');
    if (this.selectedBranch.length > 0) {
      dctJsonData['branch'] = this.selectedBranch;
    }
  dctJsonData['excel'] = true;
  // this.serverService
  //   .getBranchWiseData(JSON.stringify(dctJsonData))
  //   .subscribe((response) => {
  //     if (response.status === 'success') {
  //       importantStuff.location.href = response.path;
  //       // window.open(response.path, '_blank');
  //     }
  //   });

  //edited

  this.serverService
    .postData("enquiry/branchreportforpiechart/",dctJsonData)
    .subscribe((response) => {
      if (response['status'] == 1) {
        importantStuff.location.href = response['path'];
        // window.open(response.path, '_blank');
      }
    });
  }
}
showAll() {

  this.selectedOption = '';
  if (this.statusSelected.length > 0) {
    this.selectedBranch = this.statusSelected.map(x => x.id);
  } else {
    this.selectedBranch = [];
  }
  // assign data to barchart
  this.barChartLabels = [];
  this.barChartData[0].data = [];
  this.barChartLabels.push(...Object.keys(this.dctReportData.lst_branch_count_all));
  this.barChartLabelsCopy = this.barChartLabels;
  this.barChartLabels = this.barChartLabels.map(
    (obj) => {
      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    }
  );
  this.barChartData[0].data.push(...(Object.keys(this.dctReportData.lst_branch_count_all))
  .map(key => (this.dctReportData.lst_branch_count_all)[key]))
  setTimeout(() => (this.barChartLabels = Object.assign([], this.barChartLabels)));
  setTimeout(() => (this.barChartData[0].data = Object.assign([], this.barChartData[0].data)));


// assign data to servicewise
  this.pieServiceLabels = [];
  this.pieServiceData = [];
  this.pieServiceLabels.push(...Object.keys(this.dctReportData.lst_service_count_all));
  this.pieServiceData.push(...(Object.keys(this.dctReportData.lst_service_count_all))
  .map(key => (this.dctReportData.lst_service_count_all)[key]))
setTimeout(() => (this.pieServiceLabels = Object.assign([], this.pieServiceLabels)));
setTimeout(() => (this.pieServiceData = Object.assign([], this.pieServiceData)));

// assign data to statuswise
  this.pieStatusLabels = [];
  this.pieStatusData = [];
  this.pieStatusLabels.push(...Object.keys(this.dctReportData.lst_status_count_all));

  this.pieStatusData.push(...(Object.keys(this.dctReportData.lst_status_count_all))
  .map(key => (this.dctReportData.lst_status_count_all)[key]))
setTimeout(() => (this.pieStatusLabels = Object.assign([], this.pieStatusLabels)));
setTimeout(() => (this.pieStatusData = Object.assign([], this.pieStatusData)));


this.pieServiceOptions.title.text = 'All';
this.pieStatusOptions.title.text = 'All';


    this.dataSource = new MatTableDataSource(this.dctReportData.lst_enquiry_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.firstPage();
    this.dataSource.sort = this.sort;

}
addStatus (event) {
  if (this.statusSelected.filter(x => x.id === event.id).length === 0) {
    this.statusSelected.push(event);
    this.selectedBranch.push(event.id);
  }
  this.branchName = '';
  this.idBranch.nativeElement.value = '';
}
removeStatus(value) {
  const index = this.statusSelected.indexOf(value);
  const index2 = this.selectedBranch.indexOf(value.id);
if (index > -1) {
  this.statusSelected.splice(index, 1);
}
if (index2 > -1) {
  this.selectedBranch.splice(index2, 1);
}
}
}

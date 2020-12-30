import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import * as Highcharts from 'highcharts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/excel.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-list-service',
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.css']
})
export class ListServiceComponent implements OnInit {

  strUserGroup = '';

  public chosenDateRange: any = {};

  lstServiceFiltered: any = [];
  lstServiceAll: any = [];

  dctStatusWiseService: any = {};
  lstStatusChartKeys = [];
  strFilterStatus = '';
  lstStatusReportData = [];

  dctProductWiseService: any = {};
  lstProductChartKeys = [];
  strFilterProduct = '';
  lstProductReportData = [];
  blnServiced = false;
  dataSource = new MatTableDataSource([]);
  reportDataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns = [
    'date',
    'servNo',
    'branchName',
    'customerName',
    'customerNumber',
    'pexname',
    'staffName',
    'status',
    'product',
    'itemName',
    'imei',
    'change'
  ];

  displayedReportColumns = [
    'type',
    'noOfJobs'
  ]

  strListAction = '';
  intPending = 0;
  blnPrintJob = false;
  blnPrintInv = false;
  blnEmail = false;

  selectedTabLabel = '';
  tabLabel = '';
  tabIndex = 0;
  blnPending = false;
  blnAssign = false;
  blnCompleted = false;
  blnInvoice = false;

  blnChart = true;
  modalRef : any;

  lstReportTableStatusData = []
  lstReportTableProductData = []
  lstExcelData = []
  blnFc = false;

  blnShowTable = false;
  strExcelHeader = '';
  selected= {startDate: new Date(), endDate: new Date()};
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  locale = {
    format: 'DD/MM/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'DD/MM/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' to ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Apply', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom range',
    // daysOfWeek: moment.weekdaysMin(),
    // monthNames: moment.monthsShort(),
    firstDay: 1 // first day is monday
  }
  @ViewChild('tabGroup', { static: true }) private tabGroup: MatTabGroup;

  constructor(private serverService: ServerService, private router: Router, private spinner: NgxSpinnerService,
              private modalService: NgbModal, private excel: ExcelService, private datePipe: DatePipe) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

    this.strUserGroup = localStorage.getItem('group_name').toUpperCase();
    if(history.state){
      this.strListAction = history.state['strListAction'];
    }
    if(localStorage.getItem('selectedIndex')){
      this.tabIndex = parseInt(localStorage.getItem('selectedIndex'));
      console.log("selected  tab name",localStorage.getItem('selectedIndex'));
    }
    if(this.strUserGroup == 'RECEPTION'){
      this.blnFc = true;
    }
    // console.log("polisaanam   ",this.tabLabel);
    
    this.checkTabPermissions();
    // this.getEnquiry(null);
    
  }
  ngAfterViewInit(){
    // console.log("polisaanam   ",this.tabLabel);
    // console.log('index',this.tabGroup['_tabs']['_results'][this.tabIndex]['textLabel']);
    this.tabLabel =  this.tabGroup['_tabs']['_results'][this.tabIndex]['textLabel']
    this.checkListAction();
    // console.log('index',this.tabGroup._tabs.first.textLabel); 
    this.getEnquiry(null);

  }
  checkTabPermissions(){
    this.strUserGroup = localStorage.getItem('group_name').toUpperCase();
    if(this.strUserGroup == 'SERVICE ENGINEER'){
      this.blnPending = false; this.blnAssign = true; this.blnCompleted = true; this.blnServiced= true; this.blnInvoice = false;
    }else if(['CENTRAL MANAGER','ADMIN'].indexOf(this.strUserGroup) > -1){
      this.blnPending = true;this.blnAssign = true;this.blnServiced = true;this.blnCompleted = true;this.blnInvoice = true;
    }else if(this.strUserGroup == 'RECEPTION'){
      this.blnPending = true;this.blnAssign = false;this.blnCompleted = true;this.blnInvoice = true;
    }
    else if(this.strUserGroup == 'QUALITY CHECK'){
      console.log("polisaanam oooooo");
      
      this.blnPending = false;this.blnAssign = false;this.blnServiced = false;this.blnCompleted = true;this.blnInvoice = true;
    }
    else {
      this.blnPending = false;this.blnAssign = false;this.blnCompleted = false;this.blnInvoice = false;
    }
  }

  tabChanges(event){
    this.tabLabel = event['tab']['textLabel'];
    this.getEnquiry(null);
  }

  checkListAction(){
    if(this.tabLabel == 'All'){
      this.strListAction = 'VIEW'
      this.intPending = 0;this.blnPrintJob = false;this.blnPrintInv = false;this.blnEmail = false;
    }else if(this.tabLabel == 'Pending'){
      this.strListAction = 'FOLLOWUP'
      this.intPending = 1;this.blnPrintJob = true;this.blnPrintInv = false;this.blnEmail = false;
    }else if(this.tabLabel == 'Assigned'){
      this.strListAction = 'ASSIGN'
      this.intPending = 2;this.blnPrintJob = false;this.blnPrintInv = false;this.blnEmail = false;
    }
    // else if(this.tabLabel == 'Serviced'){
    //   this.strListAction = 'SERVICED'
    //   this.intPending = 3;this.blnPrintJob = true;this.blnPrintInv = false;this.blnEmail = false;}
    else if(this.tabLabel == 'Completed'){
      this.strListAction = 'COMPLETED'
      this.intPending = 4;this.blnPrintJob = false;this.blnPrintInv = false;this.blnEmail = false;
    }else if(this.tabLabel == 'Invoiced'){
      this.strListAction = 'INVOICE'
      this.intPending = 5;this.blnPrintJob = false;this.blnPrintInv = true;this.blnEmail = true;
    }
  }

  getEnquiry(event) {
    
    if(event != null){
      this.chosenDateRange['start'] = event['start'];
      this.chosenDateRange['end'] = event['end'];
    }
    this.checkListAction();
    console.log("intPending",this.intPending);
    
    let dctData = {
      
      start_date: this.datePipe.transform(this.selected['startDate'],'yyyy-MM-dd'),
      end_date: this.datePipe.transform(this.selected['endDate'],'yyyy-MM-dd'),
      int_pending: this.intPending
    //   start_date: this.chosenDateRange['start'].format('YYYY-MM-DD'),
    //   end_date: this.chosenDateRange['end'].format('YYYY-MM-DD'),
    //   int_pending: this.intPending
    }
 
    // console.log(" data o backend",dctData);
    
    this.spinner.show()
    this.serverService.postData("service/service_all_list/", dctData).subscribe( response => {
      this.spinner.hide()
      
      if(response['lst_service'][0].job){
        this.lstServiceAll = JSON.stringify(response['lst_service']);
        this.lstServiceFiltered = response['lst_service']
        this.blnChart = true;
        this.blnShowTable = true;
      }else{
        this.lstServiceAll = JSON.stringify([]);
        this.lstServiceFiltered = []
        this.blnChart = false;
        this.blnShowTable = false;
      }

      // creating table data source
      this.dataSource = new MatTableDataSource(this.lstServiceFiltered);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // status wise data
      this.dctStatusWiseService = response['orderd'];
      this.lstStatusChartKeys = Object.keys(this.dctStatusWiseService);
      this.lstStatusReportData = [];
      this.lstReportTableStatusData = [];
      this.lstStatusChartKeys.forEach(status => {
        let strName = status[0] + status.slice(1).toLowerCase()
        this.lstStatusReportData.push([strName,this.dctStatusWiseService[status]['count']])
        this.lstReportTableStatusData.push({'Type':strName,'Count':this.dctStatusWiseService[status]['count']})
      });

      // product wise data
      this.dctProductWiseService = response['product_based'];
      this.lstProductChartKeys = Object.keys(this.dctProductWiseService);
      this.lstProductReportData = [];
      this.lstReportTableProductData = [];
      this.lstProductChartKeys.forEach(product => {
        let strName = product[0] + product.slice(1).toLowerCase()
        this.lstProductReportData.push([strName,this.dctProductWiseService[product]['count']])
        this.lstReportTableProductData.push({'Type':strName,'Count':this.dctProductWiseService[product]['count']})
      });
      
      // loading chart data
      this.loadStatusChart()
      this.loadProductChart()
    }, error => {
      this.spinner.hide()
      Swal.fire('Error','something went wrong in server','error');
    });

  }

  applyStatusFilter(status){
    if (status == 'ALL'){
      this.strFilterStatus = ''
      this.lstServiceFiltered = JSON.parse(this.lstServiceAll)
      this.loadStatusChart();
    }else{
      this.strFilterStatus = status
      this.lstServiceFiltered = this.dctStatusWiseService[status]['table_list']
    }
    
    this.dataSource = new MatTableDataSource(this.lstServiceFiltered);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyProductFilter(product){
    if (product == 'ALL'){
      this.strFilterProduct = ''
      this.lstServiceFiltered = JSON.parse(this.lstServiceAll)
      this.loadProductChart();
    }else{
      this.strFilterProduct = product
      this.lstServiceFiltered = this.dctProductWiseService[product]['table_list']
    }
    
    this.dataSource = new MatTableDataSource(this.lstServiceFiltered);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  viewServiceDetails(jobId) {
    localStorage.setItem('selectedIndex',this.tabIndex.toString())
    this.router.navigateByUrl('/service-main/view-service',
        { state : {jobId: jobId, action: this.strListAction} });
  }

  // status wise chart -------------------------------------------------------------
  loadStatusChart(){

    var pieColors = (function () {
      var colors = [],base = '#d90b0b',i;
      for (i = 0; i < 10; i += 1) {
        colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
      }
      return colors;
    }());

    Highcharts.chart('status-container', {
      chart: {
        // Edit chart spacing
        spacingBottom: 5,
        spacingTop: 5,
        spacingLeft: 5,
        spacingRight: 5,
        // Explicitly tell the width and height of a chart
        width: 400,
        height: 300,
        
      },
      title: {
        text: 'Status Wise Data',
        style: {
          color: '#5c2a27b3',
          fontSize: '15px',
        },
      },
      credits: {
        enabled: false
      },
      series: [{
        name:'Enquiry',
        type: 'pie',
        allowPointSelect: true,
        data: this.lstStatusReportData,
        dataLabels: {
          enabled: true,
          style:{
            fontSize: '10px',
            color: '#949494'

          },
          distance: 8
        },
      }],
      plotOptions: {
        pie:{
          colors: pieColors,
        },
        series: {
          events: {
            click: (event) => {
              this.applyStatusFilter(event.point.name.toUpperCase())
            }
          }
        }
      },
    });
  }

  loadProductChart() {
    Highcharts.chart('product-container', {
      chart: {
        // Edit chart spacing
        spacingBottom: 15,
        spacingTop: 10,
        spacingLeft: 10,
        spacingRight: 10,
        // Explicitly tell the width and height of a chart
        width: null,
        height: 300,
      },
      title: {
        text: 'Product Wise Data',
        style: {
          color: '#5c2a27b3',
          fontSize: '15px',
        },
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '12px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'No of Enquiries'
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Enquiry',
        data: this.lstProductReportData,
        color: '#b00000',
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#fcfafa',
          align: 'right',
          format: '{point.y}',
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '8px',
            fontFamily: 'Verdana, sans-serif'
          }
        },
        type:'column',
        events: {
          click: (event) => {
            this.applyProductFilter(event.point.name.toUpperCase())
          }
        }
      }]
    });
  }

  // job sheet print -------------------------------------------------------
  printServiceDetails(jobId,blnEmail) {
    const data = { jobId: jobId, blnEmail: blnEmail };
    this.spinner.show()
    this.serverService.postData("service/service_job_slip/", data).subscribe( (response) => {
      this.spinner.hide()
      if(!blnEmail){
        if (response['status'] == 1) {
          window.open(response['file_cust_link'],'_blank')
          window.open(response['file_link'],'_blank')
        } else {
          Swal.fire({
            position: 'center',
            type: 'error',
            title: 'pdf generation failed!..',
            showConfirmButton: false,
            timer: 1500
          })
          // Swal.fire({
          //   position: "center",
          //   type: "error",
          //   text: "pdf generation failed!..",
          //   showConfirmButton: false,
          // });
        }
      }else{
        if (response['status'] == 1) {
          Swal.fire({
            position: 'center',
            type: 'success',
            title: response['data'],
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          Swal.fire({
            position: 'center',
            type: 'error',
            title: response['data'],
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    },(err)=>{
      this.spinner.hide()
    });
  }

  // invoice slip print -----------------------------------------------------------------
  printInvoiceSlip(intInvoiceId,blnEmail) {
    let dctData={intId:intInvoiceId, blnEmail: blnEmail}
    this.spinner.show()
    this.serverService.postData("service/service_invoice_slip/",dctData).subscribe((res)=>{
      this.spinner.hide()
      if(!blnEmail){
        if(res['status'] == 0){
          window.open(res['data'],'_blank');
        }else{
          Swal.fire({
            position: 'center',
            type: 'error',
            title: 'pdf generation failed!..',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        if (res['status'] == 1) {
          Swal.fire({
            position: 'center',
            type: 'success',
            title: res['data'],
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          Swal.fire({
            position: 'center',
            type: 'error',
            title: res['data'],
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
      
    },(err)=>{
      this.spinner.hide()
    })
  }

  // pop up image
  showReportData(reportData,strType) {
    this.strExcelHeader = strType
    if(strType == 'STATUS'){
      this.lstExcelData = this.lstReportTableStatusData
      this.reportDataSource =  new MatTableDataSource(this.lstReportTableStatusData);
    }else if(strType == 'PRODUCT'){
      this.lstExcelData = this.lstReportTableProductData
      this.reportDataSource =  new MatTableDataSource(this.lstReportTableProductData);
    }
    this.modalRef = this.modalService.open(reportData);
  }

  closeModal() {
    this.modalRef.close();
  }

  exportData() {

    let dataForExcel = [];

    this.lstExcelData.forEach((row: any) => {
      dataForExcel.push(Object.values(row))
    })

    let reportData = {
      title: this.strExcelHeader[0] + this.strExcelHeader.slice(1).toLowerCase() + ' Wise Report ( '+this.chosenDateRange['start'].format('YYYY-MM-DD') + ' - ' +
                  this.chosenDateRange['end'].format('YYYY-MM-DD')+' )' ,
      data: dataForExcel,
      headers: Object.keys(this.lstExcelData[0])
    }
    
    // this.excel.exportExcel(reportData);
  }

}

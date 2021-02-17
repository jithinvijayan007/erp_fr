import { Component, OnInit, ViewChild, Input,ViewContainerRef  } from '@angular/core';
import { ServerService } from '../../server.service';
import { SharedService } from '../../layouts/shared-service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { TypeaheadService } from '../../typeahead.service';
// import { SnotifyService } from 'ng-snotify';
import * as moment from 'moment';
import 'chart.piecelabel.js';

import { ToastrService } from 'ngx-toastr';

// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { log } from 'core-js/library/web/timers';
import { ChartService } from 'src/app/chart.service';
import { ThrowStmt } from '@angular/compiler';
// import * as EmailValidator from 'email-validator';
import { FormGroup } from '@angular/forms';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ReportComponent } from '../report.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-product-report-sales-mobile',
  templateUrl: './product-report-sales-mobile.component.html',
  styleUrls: ['./product-report-sales-mobile.component.scss']
})
export class ProductReportSalesMobileComponent implements OnInit {

  @Input('show-modal') showModal: boolean;
  @Input('show-modal2') showModal2: boolean;

  public barSalesChartColor: Array<any> = this.chartservice.barSalesChartColor;
  public pieChartColors: Array<any> = this.chartservice.pieChartColors;

  // public chartColors: Array<any> = [
  //   { // first color
  //     backgroundColor: 'rgba(225,10,24,0.2)'
  //     // borderColor: 'rgba(225,10,24,0.2)',
  //     // pointBackgroundColor: 'rgba(225,10,24,0.2)',
  //     // pointBorderColor: '#fff',
  //     // pointHoverBackgroundColor: '#fff',
  //     // pointHoverBorderColor: 'rgba(225,10,24,0.2)'
  //   },
  //   { // second color
  //     backgroundColor: 'rgba(225,10,24,0.2)'
  //     // borderColor: 'rgba(225,10,24,0.2)',
  //     // pointBackgroundColor: 'rgba(225,10,24,0.2)',
  //     // pointBorderColor: '#fff',
  //     // pointHoverBackgroundColor: '#fff',
  //     // pointHoverBorderColor: 'rgba(225,10,24,0.2)'
  //   }];

  showSpinner=false;

  initProduct;
  initBrand;
  initItem;
  dctTempData: any = [];

  tempProductIndex;
  tempBrandIndex;
  tempItemIndex;
  tempStaffIndex;

  lstPermission = JSON.parse(localStorage.getItem("grouppermissions"));
  blnAdd = true;
  blnView = true;
  blnEdit = true;
  blnDelete = true;
  blnDownload = true;
  type = false
  dctEnquiryDetails = [];
  public showTable = false;
  dctReportData: any = [];
  blnDataLoaded = false;
  selectedFromDate;
  selectedToDate;
  selectedOption: any = '';
  selectedOptionProduct: any = '';
  selectedOptionBrand: any = '';
  selectedOptionItem: any = '';
  activeBar = 'All'
  serviceChartLabelsCopy = [];
  brandPieChartLabelsCopy = [];
  itemPieChartLabelsCopy = [];
  staffPieChartLabelsCopy = [];
  nodata = [];
  // pdf=false;
  validationStatus=true;
  
  export:boolean=true;
  emailExport:boolean=true;
  chatExport:boolean=true;
  expJsondata=[];

  blnExported = false;
  strUrl = '';
  dctJsonData1 = {}

  exportmodal;


  showPopup=false;
  dctPopupData:any[];
  chartName;
  chartHead;
  dataSource1;
  displayedColumns1 = ['name','enquiryQty','salesQty','contribQtyPer','enquiryVal','salesVal', 'contribPer','conversionPer'];
  dataSource2;
  displayedColumns2 = ['enqQtyTot','saleQtyTot','enqValTot','saleValTot'];
  
  dct_product = {};
  dct_brand = {};
  dct_item = {};
  dct_staff = {};
  lstEnquiry=[];
  lstSale=[];
  productChartKey;
  brandChartKey;
  itemChartKey;
  staffChartKey;
  selectedProduct;
  selectedBrand;
  selectedItem;
  grandTotal;
  saleQtyTot;
  enqQtyTot;
  enqValTot;
  
  blnChartType=true;
  blnBrandChartType = true;
  blnItemChartType = true;
  blnStaffChartType = true;
  
  strGoodPoor='';
  currentPage=1;
 
  public form: FormGroup;
  chart=false;
  table=false;
  dctChartTable=[];
  email;
  chatName;
  serviceCurrentIndex = 1;
  serviceMaxIndex = 10;
  brandCurrentIndex = 1;
  brandMaxIndex = 10;
  itemCurrentIndex = 1;
  itemMaxIndex = 10;
  staffCurrentIndex = 1;
  staffMaxIndex = 10;
  dctTableData: any = [];
  typeWise = false;

  dataSource = new MatTableDataSource(this.dctTableData)
  displayedColumns = ['date', 'enqno', 'staff', 'customer', 'product' , 'brand' ];

  // salebar chart colors
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  blnActive = true;

  public productPieChartType = 'pie';
  


  public productPieOptions: any = {
    title: {
      display: false,
      text: 'ALL'
    } ,
    responsive: true,
    maintainAspectRatio: false,
     pieceLabel: {
      render: 'percentage',
      fontColor: this.chartservice.fontColor
    },
    legend: { 
      display: true,
      fullWidth: true,
      labels: {
              boxWidth: 9,
             },
      position: 'right',
    
    }
    }

  public brandPieChartLabels: string[] = [];
  public brandPieChartLabels1: string[] = [];
  
  public brandPieChartData: any[] = [
    {data: [], label: 'Enquiry'},
    {data: [], label: 'Sale'}
  ];
  public brandPieChartData1: any[] = [
    {data: [], label: 'Sale'}
  ];
  public brandPieChartType = 'bar';


  public itemPieChartLabels: string[] = [];
  public itemPieChartData: any[] = [
    {data: [], label: 'Enquiry'},
    {data: [], label: 'Sale'}
  ];
  public itemPieChartType = 'bar';

  public staffPieChartLabels: string[] = [];
  public staffPieChartLabels1: string[] = [];
  public staffPieChartData: any[] = [
    {data: [], label: 'Enquiry'},
    {data: [], label: 'Sale'}
  ];
  public staffPieChartType = 'bar';

  public serviceChartLabels: string[] = [];
  public serviceChartLabels1: string[] = [];
  public serviceChartType = 'bar';
  public serviceChartData: any[] = [
    {data: [], label: 'Enquiry'},
    {data: [], label: 'Sale'}
  ];
  public serviceChartData1: any[] = [
    // {data: [], label: 'Enquiry'},
    {data: [], label: 'Sale'}
  ];

  public serviceChartLegend = true;
  public itemChartLegend = true;
  public brandChartLegend = true;
  public staffChartLegend = true;

  strSelectedOption;
  datFromDate;
  datToDate;

  public brandPieOptions: any = {
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
          const ind = q[0]['index']
          return this.brandPieChartLabelsCopy[Number(ind)];
          // return false
        },
        label: (q) => {
          const datsetindex = q['datasetIndex']
          const temp = this.brandPieChartData[datsetindex]['data'];
          const ind = q['index']
          if (datsetindex) {
            return 'Sales:' + temp[ind];
          } else {
            return 'Enquiry:' + temp[ind];
          }

          // return this.brandPieChartLabelsCopy[Number(ind)] + ':' + temp[ind];
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
        maxBarThickness: 15,
                // categoryPercentage : 0.2,
                gridLines: {
                  offsetGridLines: true
              },
                ticks: {
                        autoSkip: false,
                       }
             }]
      },
      legend: { display: true,
                fullWidth: false,
                labels: {
                  boxWidth: 10,},
                position: 'top', }
  };

 public itemPieOptions: any = {
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
        const ind = q[0]['index']
        return this.itemPieChartLabelsCopy[Number(ind)];
        // return false
      },
      label: (q) => {
        const datsetindex = q['datasetIndex']
        const temp = this.itemPieChartData[datsetindex]['data'];
        const ind = q['index']
        if (datsetindex) {
          return 'Sales:' + temp[ind];
        } else {
          return 'Enquiry:' + temp[ind];
        }
        // return this.itemPieChartLabelsCopy[Number(ind)] + ':' + temp[ind];
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
      maxBarThickness: 15,
              // categoryPercentage : 0.2,
              gridLines: {
                offsetGridLines: true
            },
              ticks: {
                      autoSkip: false,
                     }
           }]
    },
    legend: { display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top', }

};


    pageTitle = 'Bar Chart';
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    maxBarThickness: 1,
    // categoryPercentage: 0.5,
    // barPercentage: 1.0,
    // barThickness:'flex',
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
          const ind = q[0]['index']
          return this.serviceChartLabelsCopy[Number(ind)];
          // return false
        },
        label: (q) => {
          const datsetindex = q['datasetIndex']
          const temp = this.serviceChartData[datsetindex]['data'];
          const ind = q['index']
          if (datsetindex) {
             return 'Sales:' + temp[ind];
             } else { return 'Enquiry:' + temp[ind];
             }
          // return this.serviceChartLabelsCopy[Number(ind)] + ':' + temp[ind];
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
        maxBarThickness: 15,
        // xScalePaddingRight: 2,
        // barWidth : 0.7,
        // barPercentage: 1.0,
        // categorySpacing : 1.8,
        // categoryPercentage : 1.0,
                gridLines: {
                  offsetGridLines: true,
                  // lineWidth:0.5,
                  // tickMarkLength:0.5
              },
                ticks: {
                        autoSkip: false,
                       }
             }]
      },
      legend: { display: true,
        fullWidth: false,
        labels: {
          boxWidth: 10,},
        position: 'top', }

  };

  public staffPieOptions: any = {
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
          const ind = q[0]['index']
          
          return this.staffPieChartLabelsCopy[Number(ind)];
          // return false
        },
        label: (q) => {
          const datsetindex = q['datasetIndex']
          const temp = this.staffPieChartData[datsetindex]['data'];
          const ind = q['index']
          if (datsetindex) {
            return 'Sales:' + temp[ind];
          } else {
            return 'Enquiry:' + temp[ind]; }
          // return this.staffPieChartLabelsCopy[Number(ind)] + ':' + temp[ind];
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
        maxBarThickness: 15,
                // categoryPercentage : 0.2,
                gridLines: {
                  offsetGridLines: true
              },
                ticks: {
                        autoSkip: false,
                       }
             }]
      },
      legend: { display: true,
        fullWidth: false,
        labels: {
          boxWidth: 10,},
        position: 'top', }

  };

  blnGood = true;
  blnPoor = true;

  lstBranches = [];
  searchBranch: FormControl = new FormControl();
  branchCode = '';
  branchName = '';
  selectedBranch = '';
  branchId: number;

  lstStaffs = [];
  searchStaff: FormControl = new FormControl();
  staffCode = '';
  staffName = '';
  selectedStaff = '';
  staffId: number;

  constructor(private serverService: ServerService,
    public dialog: MatDialog,
    private _sharedService: SharedService,
    public router: Router ,
    private fb: FormBuilder,
    private titlecasePipe: TitleCasePipe,
    private typeaheadObject: TypeaheadService,
    // private snotifyService: SnotifyService,
    public toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private chartservice: ChartService,
    private reportcomponent: ReportComponent,
    vcr: ViewContainerRef,
    private modalService: NgbModal) 
             
  {
   
      // this.toastr.setRootViewContainerRef(vcr);
     
    this._sharedService.emitChange(this.pageTitle);

  }

  ngOnInit() {
    
    this.strUrl = window.location.href.split('#')[1];
    this.blnExported = false;
    localStorage.setItem('chartexport','');
    // this.lstPermission.forEach((item, index, array) => {
    //   if (item["NAME"] == "PRODUCT REPORT" &&  item["PARENT"] == "SALES REPORTS") {
    //     this.blnAdd = item["ADD"];
    //     this.blnView = item["VIEW"];
    //     this.blnEdit = item["EDIT"];
    //     this.blnDelete = item["DELETE"];
    //     this.blnDownload = item["DOWNLOAD"];
    //   }
    // });
    this.chartservice.listColor();

    if (!localStorage.getItem('Tokeniser')) {
      this.router.navigate(['/user/sign-in']);
    }
    this.datFromDate = moment(new Date()).format('YYYY-MM-DD');
    this.datToDate = moment(new Date()).format('YYYY-MM-DD');
    this.showDatewiseData(this.datFromDate, this.datToDate);


    this.searchBranch.valueChanges
       .pipe(debounceTime(400))
       .subscribe((data: string) => {
         if (data === undefined) {
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

       this.searchStaff.valueChanges
       .pipe(debounceTime(400))
       .subscribe((data: string) => {
         if (data === undefined) {
         } else {
           if (data.length > 2) {
             this.lstStaffs = [];
             this.typeaheadObject
               .searchStaff(data)
               .subscribe(
               (response: {
                 status: string;
                 data: Array<{
                   account: string;
                   accountId: number;
                   accountCode: string;
                 }>;
               }) => {
                 this.lstStaffs.push(...response.data);

               }
               );
           }
         }
       });
  }
  switchChange(){
    this.showDatewiseData(this.datFromDate, this.datToDate);
  }
  tabledataFunc(){
    // let from = this.datFromDate._d;
    // let to = this.datToDate._d;
    // this.datFromDate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
    // this.datToDate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));
    if(this.showTable == true){
    const dctJsonData = {};
    dctJsonData['data'] = 'Custom';
      this.selectedFromDate = moment(new Date(this.datFromDate)).format('YYYY-MM-DD');
      // moment(new Date(this.datFromDate)).format('YYYY-MM-DD');
    // this.selectedToDate = this.datToDate.add(1, 'days').format('YYYY-MM-DD');
      this.selectedToDate = moment(new Date(this.datToDate)).format('YYYY-MM-DD');
    dctJsonData['date_from'] = this.selectedFromDate;
    dctJsonData['date_to'] = this.selectedToDate;
    dctJsonData['company_id'] = localStorage.getItem('companyId')

    if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
      this.toastr.error('Select a valid branch or clear the field');
      return false;
    } else if (this.branchName !== '') {
      dctJsonData['branch'] = this.branchId;
    }
    if (this.staffName !== undefined && this.staffName !== '' && this.selectedStaff !== this.staffName) {
      this.toastr.error('Select a valid staff or clear the field');
      return false;
    } else if (this.staffName !== '') {
      dctJsonData['staff'] = this.staffId;
    }
      this.serverService.postData('reports/serviceReport_table/',dctJsonData)
      .subscribe(
        (response) => {
          if (response['status'] === 1) {
            this.dctTableData = response['data'];
            this.dataSource = new MatTableDataSource(this.dctTableData);

            this.dataSource.paginator = this.paginator;
            this.dataSource.paginator.firstPage();
            this.dataSource.sort = this.sort;
          } else {
          this.toastr.error('No data found');
         }
        },
        (error) => {
          // this.spinnerService.hide();
          this.showSpinner=false;

        });
    }
  }




  BranchChanged(item) {

    this.branchId = item.id;
    this.selectedBranch = item.name;
  }
  StaffChanged(item) {

    this.staffId = item.intId;
    this.selectedStaff = item.strUserName;
  }

  openExport(modal){
    this.chart=false;
    this.table=false;
    this.showModal = true;
    this.exportmodal = this.modalService.open(modal,{windowClass:'exportModal',backdrop:false})
  }
  closeExport(){
    this.exportmodal.close();
    this.showModal = false;
  }
  openMail(){
    this.chart=false;
    this.table=false;
    this.email='';
    this.showModal2 = true;

  }
  closeMail(){
    this.showModal2 = false;
  }

  exportPdfExcel(fdate, tdate){

    this.blnExported = false;
    localStorage.setItem('chartexport','');
   
//     const error_list = [];
// console.log("this.chart",this.chart);
// console.log("this.table",this.table);

    if(this.chart==false&&this.table==false){

      this.toastr.error('Choose chart or table');
      this.validationStatus=false;
      return false;

    }
    else{
      this.validationStatus=true;
    }
    if(this.validationStatus){
    // let from = fdate._d;
    // let to = tdate._d;
    // fdate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
    // tdate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));

    if (fdate && tdate) {
      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = moment(new Date(fdate)).format('YYYY-MM-DD');
      this.selectedToDate = moment(new Date(tdate)).format('YYYY-MM-DD');
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['type'] = 'Sale';
      dctJsonData['show_type'] = this.type;
      dctJsonData['company_id'] = localStorage.getItem('companyId')
      dctJsonData['export_type'] = 'DOWNLOAD';
      dctJsonData['report_type']='product_report';
      dctJsonData['strGoodPoorClicked'] = this.strGoodPoor;
      dctJsonData['intCurrentPage'] = this.currentPage;
      // if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
      //   this.toastr.error('Select a valid branch or clear the field');
      //   return false;
      // } else 
      if (this.branchName !== '') {
        dctJsonData['branch'] = this.branchId;
      }
      // if (this.staffName !== undefined && this.staffName !== '' && this.selectedStaff !== this.staffName) {
      //   this.toastr.error('Select a valid staff or clear the field');
      //   return false;
      // } else
       if (this.staffName !== '') {
        dctJsonData['staff'] = this.staffId;
      }


      // if(!this.pdf && !this.excel){
      //   this.toastr.error('Select any document type option');
      //   return false;
      // }

      // else if(!this.chart && !this.table){
      //   this.toastr.error('Please select chart,table or both');
      //   return false;
      // }
      // else {

            this.showModal = false;
            dctJsonData['bln_chart'] = this.chart;
            dctJsonData['bln_table'] = this.table;

      // }

     this.spinnerService.show();
      // var chartElement = <HTMLInputElement> document.getElementById("chart");
      // var tableElement = <HTMLInputElement> document.getElementById("tableData");

      // var pdfElement = <HTMLInputElement> document.getElementById("pdf");
      // var excelElement = <HTMLInputElement> document.getElementById("excel");
      // console.log(this.excel);
      // console.log(this.pdf);
      // this.spinnerService.show();
      this.showSpinner=true;

      if(this.export){

       dctJsonData['document'] = 'excel';

        this.serverService.postData("product_report_pdf/",dctJsonData)
        .subscribe(
          (response) => {
            this.spinnerService.hide();
            this.showSpinner=false;
            this.exportmodal.close();
            this.showModal = false;

              if (response['status'] === 1) {
              

              var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = response['file'];
              a.download = 'report.xlsx';
              a.click();
              //window.URL.revokeObjectURL(this.dctReportData);
              a.remove();

              this.toastr.success('Successfully Exported');   
              
              this.blnExported = true;
              this.downloadLog(dctJsonData)
              

              this.table=false;
              this.chart=false;
              // this.pdf=null;
              // this.excel=null;
            } else {
            this.toastr.error('No data found');
           }
          },
          (error) => {
            this.spinnerService.hide();
            this.showSpinner=false;
            this.exportmodal.close();
            this.showModal = false;

          });


      }

      if(!this.export){
        dctJsonData['document'] = 'pdf';
        this.serverService.postData("product_report_pdf/",dctJsonData)
        .subscribe(
          (response) => {
            this.spinnerService.hide();
            this.showSpinner=false;
            this.exportmodal.close();
            this.showModal = false;

              if (response['status'] === 1) {
              //org
              const file_data = response['file'][0];
              const pdf = 'data:application/octet-stream;base64,' + file_data.substring(2, file_data.length - 1);
              const dlnk = document.createElement('a');
              dlnk.href = pdf;
              dlnk.download = response['file_name'][0];
              document.body.appendChild(dlnk);
              dlnk.click();
              dlnk.remove();
              this.toastr.success('Successfully Exported');   

              this.blnExported = true;
              this.downloadLog(dctJsonData)

              if(this.table && this.chart)
              {

                const file_data = response['file'][1];
                const pdf = 'data:application/octet-stream;base64,' + file_data.substring(2, file_data.length - 1);
                const dlnk = document.createElement('a');
                dlnk.href = pdf;
                dlnk.download = response['file_name'][1];
                document.body.appendChild(dlnk);
                dlnk.click();
                dlnk.remove();
              }
              // var blob = new Blob([response.file], {type: 'application/pdf'});
              // var filename = response.file_name;
              // if(window.navigator.msSaveOrOpenBlob) {
              //     window.navigator.msSaveBlob(blob, filename);
              // }
              // else{
              //     var elem = window.document.createElement('a');
              //     elem.href = window.URL.createObjectURL(blob);
              //     elem.download = filename;
              //     document.body.appendChild(elem);
              //     elem.click();
              //     document.body.removeChild(elem);
              // }

              // if (navigator.msSaveBlob) 
              // { 
              //     // IE 10+
              //     navigator.msSaveBlob(blob, filename);
              // } 
              // else
              // {
              //     var link = document.createElement('a');

              //     // Browsers that support HTML5 download attribute
              //     if (link.download !== undefined) 
              //     {
              //         var url = URL.createObjectURL(blob);
              //         link.setAttribute('href', url);
              //         link.setAttribute('download', filename);
              //         link.style.visibility = 'hidden';
              //         document.body.appendChild(link);
              //         link.click();
              //         document.body.removeChild(link);
              //     }
              // }
              this.table=false;
              this.chart=false;
              // this.pdf=null;
              // this.excel=null;

            } else {
            this.toastr.error('No data found');
           }
          },
          (error) => {
            this.spinnerService.hide();
            this.showSpinner=false;
            this.exportmodal.close();
            this.showModal = false;

          });

      }
   
      this.dctJsonData1 = dctJsonData;
    }  
  }
  }


  exportWithEmail(fdate, tdate){


    if(this.chart==false&&this.table==false){

      this.toastr.error('Choose chart or table');
      this.validationStatus=false;
      return false;

    }
    else{
      this.validationStatus=true;
    }
    if(this.validationStatus){

    // let from = fdate._d;
    // let to = tdate._d;
    // fdate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
    // tdate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));

    if (fdate && tdate) {
      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = moment(new Date(fdate)).format('YYYY-MM-DD');
      this.selectedToDate = moment(new Date(tdate)).format('YYYY-MM-DD');
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['type'] = 'Sale';
      dctJsonData['show_type'] = this.type;
      dctJsonData['company_id'] = localStorage.getItem('companyId');
      dctJsonData['export_type'] = 'MAIL';
      dctJsonData['report_type']='product_report';
      dctJsonData['strGoodPoorClicked'] = this.strGoodPoor;
      dctJsonData['intCurrentPage'] = this.currentPage;
      // if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
      //   this.toastr.error('Select a valid branch or clear the field');
      //   return false;
      // } else
       if (this.branchName !== '') {
        dctJsonData['branch'] = this.branchId;
      }
      // if (this.staffName !== undefined && this.staffName !== '' && this.selectedStaff !== this.staffName) {
      //   this.toastr.error('Select a valid staff or clear the field');
      //   return false;
      // } else 
      if (this.staffName !== '') {
        dctJsonData['staff'] = this.staffId;
      }
      

    if(!this.email){
      this.toastr.error('Enter an email address');
      return false;
    }
    else {
      const eatpos = this.email.trim().indexOf('@');
      const edotpos = this.email.trim().lastIndexOf('.');
      if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.email.length) {
        this.toastr.error("Invalid Email entered");
      return false;
      }
      else{
        dctJsonData['email'] = this.email;
      }
     
    }

   
        this.showModal2 = false;
            dctJsonData['bln_chart'] = this.chart;
            dctJsonData['bln_table'] = this.table;



      this.spinnerService.show();
      this.showSpinner=true;

    
      if(!this.emailExport){

        dctJsonData['document'] = 'pdf';

        this.serverService.postData("product_report_pdf/",dctJsonData)
        .subscribe(
          (response) => {
            this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
                this.toastr.success('Successfully Exported');   

              this.table=false;
              this.chart=false;
              // this.pdf=null;
              // this.excel=null;
              this.email=null

            } else {
              this.toastr.error('something went wrong');
             }
          },
          (error) => {
            this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

     else if(this.emailExport){
      dctJsonData['document'] = 'excel';
        this.serverService.postData("product_report_pdf/",dctJsonData)
        .subscribe(
          (response) => {
            this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
                this.toastr.success('Successfully Exported');   

              this.table=false;
              this.chart=false;
              this.email=null
              // this.pdf=null;
              // this.excel=null;
            }  else {
              this.toastr.error('something went wrong');
             }
          },
          (error) => {
            this.spinnerService.hide();
            this.showSpinner=false;

          });

      }

    }  }
      
  }

  exportWithChatName(fdate, tdate){


    if(this.chart==false&&this.table==false){

      this.toastr.error('Choose chart or table');
      this.validationStatus=false;
      return false;

    }
    else{
      this.validationStatus=true;
    }
    if(this.validationStatus){

    // let from = fdate._d;
    // let to = tdate._d;
    // fdate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
    // tdate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));

    if (fdate && tdate) {
      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = moment(new Date(fdate)).format('YYYY-MM-DD');
      this.selectedToDate = moment(new Date(tdate)).format('YYYY-MM-DD');
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['type'] = 'Sale';
      dctJsonData['show_type'] = this.type;
      dctJsonData['company_id'] = localStorage.getItem('companyId');
      dctJsonData['export_type'] = 'MAIL';
      dctJsonData['report_type']='product_report';
    
       if (this.branchName !== '') {
        dctJsonData['branch'] = this.branchId;
      }
    
      if (this.staffName !== '') {
        dctJsonData['staff'] = this.staffId;
      }
      

    if(!this.chatName){
      this.toastr.error('Enter chat name');
      return false;
    }
  
      else{
        dctJsonData['chatName'] = this.chatName;
     
     
    }

   
        this.showModal2 = false;
            dctJsonData['bln_chart'] = this.chart;
            dctJsonData['bln_table'] = this.table;

     
      this.spinnerService.show();
      this.showSpinner=true;

    
      if(!this.chatExport){

        dctJsonData['document'] = 'pdf';

        this.serverService.postData("product_report_pdf/",dctJsonData)
        .subscribe(
          (response) => {
            this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
                this.toastr.success('Successfully Exported');   

              this.table=false;
              this.chart=false;
          
              this.email=null

            } else {
              this.toastr.error('something went wrong');
             }
          },
          (error) => {
            this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

     else if(this.chatExport){
      dctJsonData['document'] = 'excel';
        this.serverService.postData("product_report_pdf/",dctJsonData)
        .subscribe(
          (response) => {
            this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
                this.toastr.success('Successfully Exported');   

              this.table=false;
              this.chart=false;
              this.email=null
        
            }  else {
              this.toastr.error('something went wrong');
             }
          },
          (error) => {
            this.spinnerService.hide();
            this.showSpinner=false;

          });

      }

    }  }
      
  }

  showDatewiseData(fdate, tdate) {
    // let from = fdate._d;
    // let to = tdate._d;
    // fdate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
    // tdate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));
    this.blnDataLoaded = false;
    if (fdate && tdate) {
    const dctJsonData = {};
    dctJsonData['data'] = 'Custom';
      this.selectedFromDate = moment(new Date(fdate)).format('YYYY-MM-DD');
    // this.selectedToDate = this.datToDate.add(1, 'days').format('YYYY-MM-DD');
      this.selectedToDate = moment(new Date(tdate)).format('YYYY-MM-DD');
    dctJsonData['date_from'] = this.selectedFromDate;
    dctJsonData['date_to'] = this.selectedToDate;
    dctJsonData['type'] = 'Sale';
    dctJsonData['show_type'] = this.type;
    // console.log(this.dct_click);
    dctJsonData['show_table'] = this.chartName;
    dctJsonData['company_id'] = localStorage.getItem('companyId')


    this.expJsondata['staff']=this.staffName;
    this.expJsondata['branch']=this.branchName;
      this.expJsondata['tmpdfdate'] = moment(new Date(fdate)).format('YYYY-MM-DD');
      this.expJsondata['tmpdtdate'] = moment(new Date(tdate)).format('YYYY-MM-DD');

    if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
      this.toastr.error('Select a valid branch or clear the field');
      return false;
    } else if (this.branchName !== '') {
      dctJsonData['branch'] = this.branchId;
      this.expJsondata['branch']=this.branchName;
    }
    if (this.staffName !== undefined && this.staffName !== '' && this.selectedStaff !== this.staffName) {
      this.toastr.error('Select a valid staff or clear the field');
      return false;
    } else if (this.staffName !== '') {
      dctJsonData['staff'] = this.staffId;
      this.expJsondata['staff']=this.staffName;
    }
    this.spinnerService.show();
    this.showSpinner=true;

    // this.serverService.getServiceReportMobile(JSON.stringify(dctJsonData))
    // .subscribe(
    //   (response) => {
    //     this.spinnerService.hide();
    //       if (response['status'] === 'success') {
    //       this.dctReportData = response['data'];
    //       this.nodata = Object.keys(this.dctReportData.service_all)

    //       if (Object.keys(this.dctReportData.service_all).length > 0) {
    //         this.showAll();
    //       }
    //     } else {
    //     this.toastr.error('No data found');
    //    }
    //   },
    //   (error) => {
    //     this.spinnerService.hide();
    //   });

     this.serverService.postData("reports/service_wise_mobile/",dctJsonData)
    .subscribe(
      (response) => {
        this.spinnerService.hide();
        this.showSpinner=false;
       
          if (response['status'] === 1) {
            if(response['data']){  
              
          this.dctReportData = response['data'];
          this.nodata = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF)

          if (Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF).length > 0) {
            this.showAll();
          }
        }
        if(response['table_data']){
          let lstData=[];
          lstData=response['table_data'];
          this.dataSource1 = new MatTableDataSource(lstData);
          
          // this.listLength = lstData.length;
          this.PaginationSort();
          this.chartName=null;
          }
        } else {
          this.nodata=[];
          this.serviceChartLabels=[];
          this.brandPieChartLabels=[];
          this.staffPieChartLabels1=[];
          this.itemPieChartLabels=[];
          this.staffPieChartLabels=[];
        // this.toastr.error('No data found');
       }
      },
      (error) => {
        this.spinnerService.hide();
        this.showSpinner=false;

      });
    }
  }

  valueIteration(modal,dctTempData){
       
    let dctTable={};
    let dctTotal={};
    let lstData=[];
    let totalData=[];
    this.grandTotal=0;
    this.saleQtyTot=0;
    this.enqQtyTot=0;
    this.enqValTot=0;

    for(var key1 in dctTempData){
      for(var key2 in dctTempData[key1]){
        
        this.grandTotal+=dctTempData[key1][key2]['SaleValue'];
        this.saleQtyTot+=dctTempData[key1][key2]['SaleQty'];
        this.enqQtyTot+=dctTempData[key1][key2]['EnquiryQty'];
        this.enqValTot+=dctTempData[key1][key2]['EnquiryValue'];  
        
       
      }
      }
      dctTotal['enqQtyTot']=this.enqQtyTot;
      dctTotal['saleQtyTot']=this.saleQtyTot;
      dctTotal['saleValTot']=this.grandTotal;
      dctTotal['enqValTot']=this.enqValTot;

      let salesValue,saleQty;
      let enquiryValue,enqQty;

      for(var key1 in dctTempData){
        for(var key2 in dctTempData[key1]){ 
          if(this.chartHead=='Staff'){
            dctTable['Name']=this.dctReportData.STAFFS[key2];
          } 
          else{
            dctTable['Name']=key2; 
          }
           
          dctTable['EnquiryQty']=dctTempData[key1][key2]['EnquiryQty'];          
          dctTable['SaleQty']=dctTempData[key1][key2]['SaleQty'];
          dctTable['EnquiryValue']=dctTempData[key1][key2]['EnquiryValue'];
          dctTable['SaleValue']=dctTempData[key1][key2]['SaleValue'];
          salesValue=dctTempData[key1][key2]['SaleValue'];
          enquiryValue=dctTempData[key1][key2]['EnquiryValue'];  
          saleQty=dctTable['SaleQty'];
          enqQty=dctTable['EnquiryQty'];

          
          if(this.grandTotal==0){
            dctTable['Contrib_per']=0;
          }
          else{
            dctTable['Contrib_per']=((salesValue/this.grandTotal)*100).toFixed(2);
          }

          if(enquiryValue==0){
            dctTable['Conversion_per']=0;
          }
          else{
          dctTable['Conversion_per']=((salesValue/enquiryValue)*100).toFixed(2);
          }

          if(this.saleQtyTot==0){
            dctTable['ContribQty_per']=0;
          }
          else{
          dctTable['ContribQty_per']=((saleQty/this.saleQtyTot)*100).toFixed(2);
          }

          
          
           lstData.push(dctTable);
          //  totalData.push(dctTotal);
           dctTable={};
          //  dctTotal={};
          //  i++;
        }
       
       
      }

      // dctTable['Name']="Grand Total";
      // dctTable['EnquiryQty']=this.enqQtyTot;
      // dctTable['SaleQty']=this.saleQtyTot;
      // dctTable['EnquiryValue']=this.enqValTot;
      // dctTable['SaleValue']=this.grandTotal;
      // dctTable['Contrib_per']=" ";
      // dctTable['Conversion_per']=" ";
      // dctTable['ContribQty_per']=" ";
      // lstData.push(dctTable);


     
      this.dataSource1= new MatTableDataSource(lstData);
      this.modalService.open(modal, { windowClass: 'exportModal' })

      this.PaginationSort();
      
      // this.dataSource2= new MatTableDataSource(totalData);

  }

  showPopupData(modal, chartHead){
  
    this.showPopup=true;
    // let   dctTempData: any = [];
    let dctTable={};
    let lstData=[];
    this.grandTotal=0;
    this.chartHead=chartHead;

    if(chartHead=='Product'){
      
      
      this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF;
      this.valueIteration(modal,this.dctTempData);   
      
      this.chartName=this.dct_product;
    }
    else if(chartHead=='Brand'){

      if(this.selectedOptionProduct==''){
        this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'];
        this.valueIteration(modal,this.dctTempData);
      }
      else{
        this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'];
        this.valueIteration(modal,this.dctTempData);
      }  

      this.chartName=this.dct_brand;
    }
    else if(chartHead=='Item'){

      if (this.selectedOptionProduct==''&&this.selectedOptionBrand==''){
        this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'];
        this.valueIteration(modal,this.dctTempData);
      }
        
      else if(this.selectedOptionProduct!=''&&this.selectedOptionBrand==''){

        this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'];
        this.valueIteration(modal,this.dctTempData);
      }
    
      else if(this.selectedOptionProduct!=''&&this.selectedOptionBrand!=''){

        this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'];
        this.valueIteration(modal,this.dctTempData);   
      }

    this.chartName=this.dct_item;
  }
    else if(chartHead=='Staff'){
   
      if (this.selectedOptionProduct==''&&this.selectedOptionBrand==''&&this.selectedOptionItem==''){
        this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'];
        
        this.valueIteration(modal,this.dctTempData);
        }
        
        else if(this.selectedOptionProduct!=''&&this.selectedOptionBrand==''&&this.selectedOptionItem==''){

          this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'];
          this.valueIteration(modal,this.dctTempData);
        }
        else if(this.selectedOptionProduct!=''&&this.selectedOptionBrand!=''&&this.selectedOptionItem==''){

          this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][1][this.initItem]['STAFFS'];
          this.valueIteration(modal,this.dctTempData);
  
        }

        else if(this.selectedOptionProduct!=''&&this.selectedOptionBrand!=''&&this.selectedOptionItem!=''){

          this.dctTempData=this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOptionItem]['STAFFS'];
          this.valueIteration(modal,this.dctTempData);
  
        }

      this.chartName=this.dct_staff;
    }
  
    this.chartHead=chartHead;
  }

  closePopup(){
    this.showPopup=false;
    }

  PaginationSort() {
    // this.dataSource1.paginator = this.paginator;
    // this.dataSource1.paginator.firstPage();
    this.dataSource1.sort = this.sort;
  }

  showAll() {

    this.initProduct=this.dctReportData.IN_IT['PRODUCTS'];
    this.initBrand=this.dctReportData.IN_IT['BRANDS'];
    this.initItem=this.dctReportData.IN_IT['ITEMS'];

    
    this.blnGood = true;
    this.blnPoor = true;
    this.strGoodPoor='NORMAL';
    this.selectedOptionProduct = '';
    this.selectedOptionBrand = '';
    this.selectedOptionItem = '';
    this.selectedOption = '';
    this.serviceCurrentIndex = 1;
    this.brandCurrentIndex = 1;
    this.itemCurrentIndex = 1;
    this.staffCurrentIndex = 1;
    this.currentPage = 1;

    this.expJsondata['product']='ALL';
    this.expJsondata['brand']='ALL';
    this.expJsondata['item']='ALL';

    // assign data to barchart

    this.productChartKey='service_all';
    let optionsArray1=[];
    this.dct_product={};
    optionsArray1.push('service_all');
    this.dct_product['service_all']=optionsArray1;
    // this.chartName=this.dct_product;

    this.serviceChartLabels = [];
    this.serviceChartLabels1 = [];

    this.serviceChartData[0].data = [];
    this.serviceChartData[0].label = 'Enquiry';
    this.serviceChartData[1].data = [];
    this.serviceChartData[1].label = 'Sale';
    this.serviceChartData1[0].data = [];

    this.serviceMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF).length;
    this.serviceChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex]));
    this.serviceChartLabelsCopy = this.serviceChartLabels;
    this.serviceChartLabels = this.serviceChartLabels.map(obj => {
      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });

    for (let page in this.dctReportData.SERVICE_BRAND_ITEM_STAFF){      
      if(page=='3'){
        break;
      }
      this.serviceChartLabels1.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[page]));
      for(let product in this.dctReportData.SERVICE_BRAND_ITEM_STAFF[page]){
       
        this.serviceChartData1[0].data.push(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[page][product]['Sale']); 
        
        
      }
    
      
    }

    this.serviceChartData[0].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex])[key]['Enquiry']))
    // this.serviceChartData[0].data.push(7,5,5,10,2,3,1,6,7,9,4,2,5,10,2,1,5,3,7,5,5,10,2,3,1,6,7,9,6,2,4,9,7,5,5,10,2,3,1);
    // this.serviceChartData[0].data.push(7,5,5,7,9,4,2,5,10,2,3,1,6,7,5,1,3);

    this.serviceChartData[1].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex])[key]['Sale']))
      
    this.shuffleMulti2(this.serviceChartLabels, this.serviceChartData[0].data,this.serviceChartData[1].data, this.serviceChartLabelsCopy);
    
    // this.serviceChartData1[0].data=this.serviceChartData[1].data;

    setTimeout(() => (this.serviceChartLabels = Object.assign([], this.serviceChartLabels)));
    setTimeout(() => (this.serviceChartData = Object.assign([], this.serviceChartData)));
    setTimeout(() => (this.serviceChartLabels1 = Object.assign([], this.serviceChartLabels1)));
    setTimeout(() => (this.serviceChartData1[0].data = Object.assign([], this.serviceChartData1[0].data)));

  // assign data to brandwise

  this.brandChartKey='brand_all';
    let optionsArray2=[];
    this.dct_brand={};
    optionsArray2.push('brand_all');
    this.dct_brand['brand_all']=optionsArray2;
    // this.chartName=this.dct_brand;

  this.brandPieChartLabels = [];
  this.brandPieChartLabels1 = [];
  this.brandPieChartData[0].data = [];
  this.brandPieChartData[0].label = 'Enquiry';
  this.brandPieChartData[1].data = [];
  this.brandPieChartData[1].label = 'Sale';
  this.brandPieChartData1[0].data = [];
  this.brandMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS']).length;
  this.brandPieChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]));
  this.brandPieChartLabelsCopy = this.brandPieChartLabels;
  this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
    if (obj.length > 7) {
      obj = obj.slice(0, 5) + '..';
    }
    // obj = this.titlecasePipe.transform(obj);
    return obj;
  });
  
  for (let item in this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS']){
    if(item=='4'){
      break;
    }
    this.brandPieChartLabels1.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][item]));
    for(let product in this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][item]){
     
      this.brandPieChartData1[0].data.push(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][item][product]['Sale']); 
      
      
    }
    
  }



  this.brandPieChartData[0].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex])[key]['Enquiry']))

  this.brandPieChartData[1].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex])[key]['Sale']))

  // this.shuffleMulti2(this.brandPieChartLabels, this.brandPieChartData[0].data,this.brandPieChartData[1].data, this.brandPieChartLabelsCopy);
  // console.log('brand',this.brandPieChartData[1].data);
  setTimeout(() => (this.brandPieChartLabels = Object.assign([], this.brandPieChartLabels)));
  setTimeout(() => (this.brandPieChartData = Object.assign([], this.brandPieChartData)));
  setTimeout(() => (this.brandPieChartLabels1 = Object.assign([], this.brandPieChartLabels1)));
  setTimeout(() => (this.brandPieChartData1 = Object.assign([], this.brandPieChartData1)));


    // assign data to itemwise

    this.itemChartKey='item_all';
    let optionsArray3=[];
    this.dct_item={};
    optionsArray3.push('item_all');
    this.dct_item['item_all']=optionsArray3;
    // this.chartName=this.dct_item;

    this.itemPieChartLabels = [];
    this.itemPieChartData[0].data = [];
    this.itemPieChartData[0].label = 'Enquiry';
    this.itemPieChartData[1].data = [];
    this.itemPieChartData[1].label = 'Sale';
    this.itemMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS']).length;
    this.itemPieChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]));
    this.itemPieChartLabelsCopy = this.itemPieChartLabels;
    this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      // obj = this.titlecasePipe.transform(obj);
      return obj;
    });
    this.itemPieChartData[0].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex])[key]['Enquiry']))

    this.itemPieChartData[1].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex])[key]['Sale']))

  setTimeout(() => (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels)));
  setTimeout(() => (this.itemPieChartData = Object.assign([], this.itemPieChartData)));

  // assign data to staffwise

  this.staffChartKey='staff_all';
  let optionsArray4=[];
  this.dct_staff={};
  optionsArray4.push('staff_all');
  this.dct_staff['staff_all']=optionsArray4;
  // this.chartName=this.dct_staff;

  this.staffPieChartLabels = [];
  this.staffPieChartLabels1 = [];
  this.staffPieChartData[0].data= [];
  this.staffPieChartData[0].label= 'Enquiry';
  this.staffPieChartData[1].data= [];
  this.staffPieChartData[1].label= 'Sale';
  this.staffMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS']).length;
  this.staffPieChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]));

  this.staffPieChartLabels= this.staffPieChartLabels.map((x)=>{
  x = this.dctReportData.STAFFS[x];
  return x;
  });
  this.staffPieChartLabelsCopy = this.staffPieChartLabels;
  this.staffPieChartLabels1 = this.staffPieChartLabels;
  // this.staffPieChartLabels = this.staffPieChartLabels.map(key => this.dctReportData.staffs[key]);
  this.staffPieChartLabels = this.staffPieChartLabels.map(obj => {
    if (obj.length > 7) {
      obj = obj.slice(0, 5) + '..';
    }
    return obj;
  });
  this.staffPieChartData[0].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex])[key]['Enquiry']))

  this.staffPieChartData[1].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex])[key]['Sale']))

setTimeout(() => (this.staffPieChartLabels = Object.assign([], this.staffPieChartLabels)));
setTimeout(() => (this.staffPieChartData = Object.assign([], this.staffPieChartData)));
setTimeout(() => (this.staffPieChartLabels1 = Object.assign([], this.staffPieChartLabels1)));


  this.brandPieOptions.title.text = this.initProduct;
  this.itemPieOptions.title.text = this.initBrand;
  this.staffPieOptions.title.text = this.initItem;
      // this.dataSource = new MatTableDataSource(this.dctReportData.lst_enquiry_data);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.paginator.firstPage();
      // this.dataSource.sort = this.sort;
      
  }

  public chartClicked(e: any): void {
    
    this.selectedOptionBrand = '';
    this.selectedOptionItem = '';
    this.selectedOption = '';
  if (e.active.length > 0) {

    this.tempProductIndex=this.serviceCurrentIndex;

    if(this.blnChartType){ //bar chart
    this.selectedOption = this.serviceChartLabelsCopy[e.active[0]._index];
    this.selectedOptionProduct = this.serviceChartLabelsCopy[e.active[0]._index];
    }
    else{ //pie chart
    this.selectedOption = this.serviceChartLabels1[e.active[0]._index];
    this.selectedOptionProduct = this.serviceChartLabels1[e.active[0]._index];
    }

    this.brandPieChartLabels = [];
    this.brandPieChartLabels1 = [];
    this.brandPieChartData[0].data = [];
    this.brandPieChartData[0].label = 'Enquiry';
    this.brandPieChartData[1].data = [];
    this.brandPieChartData[1].label = 'Sale';
    this.brandPieChartData1[0].data = [];

    this.itemPieChartLabels = [];
    this.itemPieChartData[0].data = [];
    this.itemPieChartData[0].label = 'Enquiry';
    this.itemPieChartData[1].data = [];
    this.itemPieChartData[1].label = 'Sale';

    this.staffPieChartLabels = [];
    this.staffPieChartLabels1 = [];
    this.staffPieChartData[0].data = [];
    this.staffPieChartData[0].label = 'Enquiry';
    this.staffPieChartData[1].data = [];
    this.staffPieChartData[1].label = 'Sale';

    
//assign product dictionary

    // let optionsArray4=[];
    // this.dct_product={};
    // optionsArray4.push('service_all');
    // this.dct_product['service_all']=optionsArray4;

  // assign data to brandwise

  // this.brandChartKey='service_brand';
  this.selectedProduct=this.selectedOption;
  this.expJsondata['product']=this.selectedProduct;

  // let optionsArray1=[];
  // this.dct_brand={};
  // optionsArray1.push(this.selectedOption);
  // this.dct_brand['service_brand']=optionsArray1;


  // console.log("this.dct_brand['service_brand']",this.dct_brand['service_brand']);
  
  // this.chartName=this.dct_product;

  this.brandCurrentIndex = 1;

  //**********************/
  this.brandMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS']).length;
  this.brandPieChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex]));
  this.brandPieChartLabelsCopy = this.brandPieChartLabels;
  
  this.initBrand=this.brandPieChartLabels[0];


  this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
    if (obj.length > 7) {
      obj = obj.slice(0, 5) + '..';
    }
    // obj = this.titlecasePipe.transform(obj);
    return obj;
  });

  for (let item in this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS']){
    if(item=='4'){
      break;
    }
    
    this.brandPieChartLabels1.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][item]));
    for(let product in this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][item]){
     
      this.brandPieChartData1[0].data.push(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][item][product]['Sale']); 
      
      
    }
    
  }


  this.brandPieChartData[0].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex])[key]['Enquiry']))

  this.brandPieChartData[1].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex])[key]['Sale']))


  setTimeout(() => (this.brandPieChartLabels = Object.assign([], this.brandPieChartLabels)));
  setTimeout(() => (this.brandPieChartData = Object.assign([], this.brandPieChartData)));
  setTimeout(() => (this.brandPieChartLabels1 = Object.assign([], this.brandPieChartLabels1)));
  setTimeout(() => (this.brandPieChartData1[0].data = Object.assign([], this.brandPieChartData1[0].data)));
  // assign data to itemwise

  // this.itemChartKey='service_item';
  // let optionsArray2=[];
  // this.dct_item={};
  // optionsArray2.push(this.selectedOption);
  // this.dct_item['service_item']=optionsArray2;
  // this.chartName=this.dct_item;

  // this.itemMaxIndex = Object.keys(this.dctReportData.service_item[this.selectedOption]).length;

  this.itemMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS']).length;

  this.itemCurrentIndex = 1;

  this.itemPieChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]));
  this.initItem=this.itemPieChartLabels[0];
  this.itemPieChartLabelsCopy = this.itemPieChartLabels;
  this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
    if (obj.length > 7) {
      obj = obj.slice(0, 5) + '..';
    }
    // obj = this.titlecasePipe.transform(obj);
    return obj;
  });
  this.itemPieChartData[0].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex])[key]['Enquiry']))

  this.itemPieChartData[1].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex])[key]['Sale']))

  setTimeout(() => (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels)));
  setTimeout(() => (this.itemPieChartData = Object.assign([], this.itemPieChartData)));

  // assign data to staffwise

  // this.staffChartKey='service_staff';
  // let optionsArray3=[];
  // this.dct_staff={};
  // optionsArray3.push(this.selectedOption);
  // this.dct_staff['service_staff']=optionsArray3;
  // this.chartName=this.dct_staff;

  this.staffMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS']).length;
  this.staffCurrentIndex = 1;
  this.staffPieChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]));
  this.staffPieChartLabels= this.staffPieChartLabels.map((x)=>{
    x = this.dctReportData.STAFFS[x];
    return x;
    });
  this.staffPieChartLabelsCopy = this.staffPieChartLabels;
  this.staffPieChartLabels1 = this.staffPieChartLabels;
  // this.staffPieChartLabels = this.staffPieChartLabels.map(key => this.dctReportData.staffs[key]);
  this.staffPieChartLabels = this.staffPieChartLabels.map(obj => {
    if (obj.length > 7) {
      obj = obj.slice(0, 5) + '..';
    }
    return obj;
  });
  this.staffPieChartData[0].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex])[key]['Enquiry']))

  this.staffPieChartData[1].data.push(...(Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]))
  .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex])[key]['Sale']))

  setTimeout(() => (this.staffPieChartLabels = Object.assign([], this.staffPieChartLabels)));
  setTimeout(() => (this.staffPieChartData = Object.assign([], this.staffPieChartData)));
  setTimeout(() => (this.staffPieChartLabels1 = Object.assign([], this.staffPieChartLabels1)));


  this.brandPieOptions.title.text = this.titlecasePipe.transform(this.selectedOption);
  this.itemPieOptions.title.text = this.titlecasePipe.transform(this.initBrand);
  this.staffPieOptions.title.text = this.titlecasePipe.transform(this.initItem);


  // const lst_service_wise_data = this.dctReportData.lst_enquiry_data.filter(x => String(x.vchr_service) === String(this.selectedOption));
  // this.dataSource = new MatTableDataSource(lst_service_wise_data);
  // this.dataSource.paginator = this.paginator;
  // this.dataSource.paginator.firstPage();
  // this.dataSource.sort = this.sort;

    }
  }

  public brandPieChartClicked(e: any): void {
    
    this.selectedOptionItem = '';
    this.selectedOption = '';
    if (this.selectedOptionProduct === '') {
      this.selectedOptionProduct=this.initProduct;
      this.tempProductIndex=this.serviceCurrentIndex;
    }

    // console.log("this.selectedOptionProduct",this.selectedOptionProduct);
    
  if (e.active.length > 0) {

    this.tempBrandIndex=this.brandCurrentIndex;

    if(this.blnBrandChartType){
    this.selectedOption = this.brandPieChartLabelsCopy[e.active[0]._index];
    this.selectedOptionBrand = this.brandPieChartLabelsCopy[e.active[0]._index];
    }
    else{
      this.selectedOption = this.brandPieChartLabels1[e.active[0]._index];
      this.selectedOptionBrand = this.brandPieChartLabels1[e.active[0]._index];
    }

    this.itemChartKey='service_brand_item';
    this.selectedBrand=this.selectedOption;
    this.expJsondata['brand']=this.selectedBrand;

    this.itemPieChartLabels = [];
    this.itemPieChartData[0].data = [];
    this.itemPieChartData[0].label = 'Enquiry';
    this.itemPieChartData[1].data = [];
    this.itemPieChartData[1].label = 'Sale';
    // console.log("this.tempProductIndex",this.tempProductIndex);
    // console.log("this.selectedOptionProduct",this.selectedOptionProduct);
    // console.log("this.brandCurrentIndex",this.brandCurrentIndex);
    // console.log("this.selectedOption",this.selectedOption);
    
    
    // console.log("this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex]",this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex]);
    
    this.itemMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS']).length;
    this.itemCurrentIndex = 1 ;
    this.itemPieChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex]));
    this.initItem=this.itemPieChartLabels[0];
    this.itemPieChartLabelsCopy = this.itemPieChartLabels;
    this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      // obj = this.titlecasePipe.transform(obj);
      return obj;
    });
    this.itemPieChartData[0].data.push(...(Object.keys(
      this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex])
    [key]['Enquiry']))

    this.itemPieChartData[1].data.push(...(Object.keys(
      this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex])
    [key]['Sale']))

    setTimeout(() => (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels)));
    setTimeout(() => (this.itemPieChartData = Object.assign([], this.itemPieChartData)));

    this.staffChartKey='service_brand_staff';

    this.staffPieChartLabels = [];
    this.staffPieChartLabels1 = [];
    this.staffPieChartData[0].data = [];
    this.staffPieChartData[0].label = 'Enquiry';
    this.staffPieChartData[1].data = [];
    this.staffPieChartData[1].label = 'Sale';
    this.staffMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS']).length;
    this.staffCurrentIndex = 1;
    this.staffPieChartLabels.push(...Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]));
      this.staffPieChartLabels= this.staffPieChartLabels.map((x)=>{
        x = this.dctReportData.STAFFS[x];
        return x;
        });
    this.staffPieChartLabelsCopy = this.staffPieChartLabels;
    this.staffPieChartLabels1 = this.staffPieChartLabels;
    // this.staffPieChartLabels = this.staffPieChartLabels.map(key => this.dctReportData.staffs[key]);

    this.staffPieChartLabels = this.staffPieChartLabels.map(obj => {
      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });
    this.staffPieChartData[0].data.push(...(Object.keys(
      this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex])
    [key]['Enquiry']))

    this.staffPieChartData[1].data.push(...(Object.keys(
      this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex][this.initItem]['STAFFS'][this.staffCurrentIndex])
    [key]['Sale']))

    setTimeout(() => (this.staffPieChartLabels = Object.assign([], this.staffPieChartLabels)));
    setTimeout(() => (this.staffPieChartData = Object.assign([], this.staffPieChartData)));
    setTimeout(() => (this.staffPieChartLabels1 = Object.assign([], this.staffPieChartLabels1)));

    this.itemPieOptions.title.text = this.titlecasePipe.transform(this.selectedOption);
    this.staffPieOptions.title.text = this.titlecasePipe.transform(this.initItem);

    }
  }

  public itemPieChartClicked(e: any): void {
    // console.log("$$$$$$$$$$$$",this.dctReportData);
    
    this.selectedOption = '';
    if (this.selectedOptionProduct === '' || this.selectedOptionProduct === undefined || this.selectedOptionProduct === null) {
     
      this.selectedOptionProduct = this.initProduct;
      this.tempProductIndex=this.serviceCurrentIndex;

    }
    if (this.selectedOptionBrand === '' || this.selectedOptionBrand === undefined || this.selectedOptionBrand === null) {
      
      this.selectedOptionBrand =this.initBrand;
      this.tempBrandIndex=this.brandCurrentIndex;

    }

  if (e.active.length > 0) {
    this.tempItemIndex=this.itemCurrentIndex;

    this.selectedOption = this.itemPieChartLabelsCopy[e.active[0]._index];
    this.selectedOptionItem = this.itemPieChartLabelsCopy[e.active[0]._index];
    this.staffPieChartLabelsCopy = [];
    this.staffPieChartLabels = [];
    this.staffPieChartLabels1 =[];
    this.staffPieChartData[0].data = [];
    this.staffPieChartData[0].label = 'Enquiry';
    this.staffPieChartData[1].data = [];
    this.staffPieChartData[1].label = 'Sale';

    this.staffChartKey='service_brand_item_staff';
    this.selectedItem=this.selectedOption;
    this.expJsondata['item']=this.selectedItem

    // console.log("this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]",this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]);
    // console.log('aaaaa::',this.tempProductIndex,this.selectedOptionProduct,'BRANDS',this.tempBrandIndex,this.selectedOptionBrand,'ITEMS',this.tempItemIndex,this.selectedOption,'STAFFS');
    
    this.staffMaxIndex = Object.keys(this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOption]['STAFFS']).length;
    this.staffCurrentIndex = 1;
    this.staffPieChartLabels.push(...Object.keys(
      this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOption]['STAFFS'][this.staffCurrentIndex]));
      this.staffPieChartLabels= this.staffPieChartLabels.map((x)=>{
        x = this.dctReportData.STAFFS[x];
        return x;
        });
    this.staffPieChartLabelsCopy = this.staffPieChartLabels;
    this.staffPieChartLabels1 = this.staffPieChartLabels;
    // this.staffPieChartLabels = this.staffPieChartLabels.map(key => this.dctReportData.staffs[key]);

    this.staffPieChartLabels = this.staffPieChartLabels.map(obj => {
      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });
    this.staffPieChartData[0].data.push(...(Object.keys(
      this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOption]['STAFFS'][this.staffCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOption]['STAFFS'][this.staffCurrentIndex])
    [key]['Enquiry']))

    this.staffPieChartData[1].data.push(...(Object.keys(
      this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOption]['STAFFS'][this.staffCurrentIndex]))
    .map(key => (this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOption]['STAFFS'][this.staffCurrentIndex])
    [key]['Sale']))

    setTimeout(() => (this.staffPieChartLabels = Object.assign([], this.staffPieChartLabels)));
    setTimeout(() => (this.staffPieChartData = Object.assign([], this.staffPieChartData)));
    setTimeout(() => (this.staffPieChartLabels1 = Object.assign([], this.staffPieChartLabels1)));
    this.staffPieOptions.title.text = this.titlecasePipe.transform(this.selectedOption);

    }
  }

  moveBar(type: string, direction: string) {
    if (type === 'brand') {
      if (direction === 'left') {
        if (this.brandCurrentIndex > 1) {
          this.brandCurrentIndex -= 1;
        } else {
          this.brandCurrentIndex = this.brandMaxIndex;
        }
      } else {
        if (this.brandCurrentIndex < this.brandMaxIndex) {
          this.brandCurrentIndex += 1;
        } else {
          this.brandCurrentIndex = 1;
        }
      }
     
      
      if (
      this.selectedOptionProduct === '' &&
      this.selectedOptionBrand === '' &&
      this.selectedOptionItem === '' &&
      this.selectedOption === ''
      ) {
        
        this.brandPieChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        );
        this.brandPieChartLabelsCopy = this.brandPieChartLabels;
        this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.brandPieChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(key => this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Enquiry']);
        this.brandPieChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(key => this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']);


      } else {

        this.brandPieChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex]
        );
        this.brandPieChartLabelsCopy = this.brandPieChartLabels;
        this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.brandPieChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][key]['Enquiry']
        );
        this.brandPieChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']
        );
      }


      setTimeout(
        () => (this.brandPieChartLabels = Object.assign([], this.brandPieChartLabels))
      );
      setTimeout(
        () =>
          (this.brandPieChartData[0].data = Object.assign(
            [],
            this.brandPieChartData[0].data
          ))
      );
    } else if (type === 'item') {
      if (direction === 'left') {
        if (this.itemCurrentIndex > 1) {
          this.itemCurrentIndex -= 1;
        } else {
          this.itemCurrentIndex = this.itemMaxIndex;
        }
      } else {
        if (this.itemCurrentIndex < this.itemMaxIndex) {
          this.itemCurrentIndex += 1;
        } else {
          this.itemCurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionProduct === '' &&
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
      this.itemPieChartLabels = Object.keys(
        this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      );
      this.itemPieChartLabelsCopy = this.itemPieChartLabels;
      this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
      this.itemPieChartData[0].data = Object.keys(
        this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      ).map(key => this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']);
      this.itemPieChartData[1].data = Object.keys(
        this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      ).map(key => this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']);
      } else if (
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
        this.itemPieChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemPieChartLabelsCopy = this.itemPieChartLabels;
        this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemPieChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
        );
        this.itemPieChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
        );
      } else if (
        this.selectedOptionItem === ''
      ) {
        this.itemPieChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemPieChartLabelsCopy = this.itemPieChartLabels;
        this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemPieChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
        );
        this.itemPieChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
        );
      }
      else{
        this.itemPieChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemPieChartLabelsCopy = this.itemPieChartLabels;
        this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemPieChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
        );
        this.itemPieChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
        );
      }


      setTimeout(
        () => (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[0].data = Object.assign(
            [],
            this.itemPieChartData[0].data
          ))
      );
    } else if (type === 'staff') {
      if (direction === 'left') {
        if (this.staffCurrentIndex > 1) {
          this.staffCurrentIndex -= 1;
        } else {
          this.staffCurrentIndex = this.staffMaxIndex;
        }
      } else {
        if (this.staffCurrentIndex < this.staffMaxIndex) {
          this.staffCurrentIndex += 1;
        } else {
          this.staffCurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionProduct === '' &&
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === '' &&
        this.selectedOption === ''

      ) {
      this.staffPieChartLabels = Object.keys(
        this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex]
      );
      this.staffPieChartLabels= this.staffPieChartLabels.map((x)=>{
        x = this.dctReportData.STAFFS[x];
        return x;
        });
    this.staffPieChartLabelsCopy = this.staffPieChartLabels;
      // this.staffPieChartLabelsCopy = this.staffPieChartLabels;
      this.staffPieChartLabels1 = this.staffPieChartLabels;
      this.staffPieChartLabels = this.staffPieChartLabels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
      this.staffPieChartData[0].data = Object.keys(
        this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex]
      ).map(key => this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex][key]['Enquiry']);
      this.staffPieChartData[1].data = Object.keys(
        this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex]
      ).map(key => this.dctReportData.SERVICE_BRAND_ITEM_STAFF[1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex][key]['Sale']);
      } else if (
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
        this.staffPieChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][
          this.staffCurrentIndex
          ]
        );
        this.staffPieChartLabels= this.staffPieChartLabels.map((x)=>{
          x = this.dctReportData.STAFFS[x];
          return x;
          });
      this.staffPieChartLabelsCopy = this.staffPieChartLabels;
      this.staffPieChartLabels1 = this.staffPieChartLabels;
        this.staffPieChartLabels = this.staffPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.staffPieChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex][key]['Enquiry']
        );
        this.staffPieChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex]
        ).map(
          key =>
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][1][this.initItem]['STAFFS'][
            this.staffCurrentIndex
            ][key]['Sale']
        );
      } else if (
        this.selectedOptionItem === ''
      ) {
        this.staffPieChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex]
        );
        this.staffPieChartLabels= this.staffPieChartLabels.map((x)=>{
          x = this.dctReportData.STAFFS[x];
          return x;
          });
      this.staffPieChartLabelsCopy = this.staffPieChartLabels;
      this.staffPieChartLabels1 =this.staffPieChartLabels;
        this.staffPieChartLabels = this.staffPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.staffPieChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex]
        ).map(
          key =>
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex][key]['Enquiry']
        );
        this.staffPieChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][1][this.initItem]['STAFFS'][this.staffCurrentIndex][key]['Sale']
        );
      } else if (
        this.selectedOption === ''
      ) {
        this.staffPieChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOptionItem]['STAFFS'][this.staffCurrentIndex]
        );
        this.staffPieChartLabels= this.staffPieChartLabels.map((x)=>{
          x = this.dctReportData.STAFFS[x];
          return x;
          });
      this.staffPieChartLabelsCopy = this.staffPieChartLabels;
        this.staffPieChartLabels = this.staffPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.staffPieChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOptionItem]['STAFFS'][this.staffCurrentIndex]
        ).map(
          key =>
            this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOptionItem]['STAFFS'][this.staffCurrentIndex][key]['Enquiry']
        );
        this.staffPieChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOptionItem]['STAFFS'][this.staffCurrentIndex]
        ).map(
          key =>
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.tempProductIndex][this.selectedOptionProduct]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.tempItemIndex][this.selectedOptionItem]['STAFFS'][this.staffCurrentIndex][key]['Sale']
        );
      }

      setTimeout(
        () => (this.staffPieChartLabels = Object.assign([], this.staffPieChartLabels))
      );
      setTimeout(
        () =>
          (this.staffPieChartData[0].data = Object.assign(
            [],
            this.staffPieChartData[0].data
          ))
      );
    } else if (type === 'product') {
      if (direction === 'left') {
        if (this.serviceCurrentIndex > 1) {
          this.serviceCurrentIndex -= 1;
        } else {
          this.serviceCurrentIndex = this.serviceMaxIndex;
        }
      } else {
        if (this.serviceCurrentIndex < this.serviceMaxIndex) {
          this.serviceCurrentIndex += 1;
        } else {
          this.serviceCurrentIndex = 1;
        }
      }
      this.currentPage=this.serviceCurrentIndex;
      // if (
      // this.selectedOptionProduct === '' &&
      // this.selectedOptionBrand === '' &&
      // this.selectedOptionItem === '' &&
      // this.selectedOption === ''
      // ) {

        this.serviceChartLabels = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex]
        );
        this.serviceChartLabelsCopy = this.serviceChartLabels;
        this.serviceChartLabels = this.serviceChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.serviceChartData[0].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex]
        ).map(key => this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][key]['Enquiry']);
        this.serviceChartData[1].data = Object.keys(
          this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex]
        ).map(key => this.dctReportData.SERVICE_BRAND_ITEM_STAFF[this.serviceCurrentIndex][key]['Sale']);
      // }


      setTimeout(
        () => (this.serviceChartLabels = Object.assign([], this.serviceChartLabels))
      );
      setTimeout(
        () =>
          (this.serviceChartData[0].data = Object.assign(
            [],
            this.serviceChartData[0].data
          ))
      );
    }
  }

  goodOnClick() {
    this.blnGood = false;
    this.blnPoor = true;
    this.blnActive = true;
    this.strGoodPoor='GOOD';
    this.currentPage=1;
    const dct_data =
      this.swap(this.dctReportData.SERVICE_BRAND_ITEM_STAFF, false);
    this.serviceCurrentIndex = 1;
    this.dctReportData.SERVICE_BRAND_ITEM_STAFF = dct_data;
    this.serviceChartLabels = Object.keys(
      dct_data[this.serviceCurrentIndex]
    );
    this.serviceChartLabelsCopy = this.serviceChartLabels;
    this.serviceChartLabels = this.serviceChartLabels.map(obj => {
      if (obj.length > 6) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });
    this.serviceChartData[0].data = Object.keys(
      dct_data[this.serviceCurrentIndex]
    ).map(key => dct_data[this.serviceCurrentIndex][key]['Enquiry']);
    this.serviceChartData[1].data = Object.keys(
      dct_data[this.serviceCurrentIndex]
    ).map(key => dct_data[this.serviceCurrentIndex][key]['Sale']);


  }

  poorOnClick() {
    this.blnGood = true;
    this.blnPoor = false;
    this.blnActive = false;
    this.strGoodPoor='POOR';
    this.currentPage=1;
    const dct_data =
    this.swap(this.dctReportData.SERVICE_BRAND_ITEM_STAFF, true);
    this.serviceCurrentIndex = 1;
    this.dctReportData.SERVICE_BRAND_ITEM_STAFF = dct_data;
      this.serviceChartLabels = Object.keys(
        dct_data[this.serviceCurrentIndex]
      );
      this.serviceChartLabelsCopy = this.serviceChartLabels;
      this.serviceChartLabels = this.serviceChartLabels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
      this.serviceChartData[0].data = Object.keys(
        dct_data[this.serviceCurrentIndex]
      ).map(key => dct_data[this.serviceCurrentIndex][key]['Enquiry']);
      this.serviceChartData[1].data = Object.keys(
        dct_data[this.serviceCurrentIndex]
      ).map(key => dct_data[this.serviceCurrentIndex][key]['Sale']);

  }

  swap(lst_data, reverse) {
    const keys = Object.keys(lst_data);
    const len = keys.length - 1;
    let data_dict = [];
    for(let i = len; i > -1; i--) {
      for (let data in lst_data[keys[i]]) {
        const temp = [];
        temp[0] = data;
        temp[1] = lst_data[keys[i]][data];
        data_dict.push(temp);
      }
    }
    if (reverse) {
      data_dict.sort(
        (n1, n2) => {
          return n1[1]['Sale'] < n2[1]['Sale'] ? -1 : 1;
        }
      );
    } else {
      data_dict.sort(
        (n1, n2) => {
          return n1[1]['Sale'] > n2[1]['Sale'] ? -1 : 1;
        }
      );
    }
    let out_dict = {};
    for (let i = 0; i <= len; i++) {
      const temp_data = data_dict.splice(0, 10);
      out_dict[keys[i]] = {};
      for (let data of temp_data) {
        let temp = {};
        temp[data[0]] = data[1];
        out_dict[keys[i]] = Object.assign(out_dict[keys[i]],temp);
      }
    }
    return out_dict;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  
  isArray = Array.isArray || function (value) {
    return {}.toString.call(value) !== "[object Array]" };
  shuffleMulti2(arr1, arr2,arr3,arr4) {
    let arrLength = 0;
    let argsLength = arguments.length; let rnd, tmp;
    for (var index = 0; index < argsLength; index += 1) {
      if (!this.isArray(arguments[index])) { throw new TypeError("Argument is not an array.");
    } if (index === 0) {
      arrLength = arguments[0].length;
    } if (arrLength !== arguments[index].length) {
      throw new RangeError("Array lengths do not match.");
    }
  }
  while (arrLength) {
    rnd = Math.floor(Math.random() * arrLength); arrLength -= 1;
    for (let argsIndex = 0; argsIndex < argsLength; argsIndex += 1) {
      tmp = arguments[argsIndex][arrLength];
      arguments[argsIndex][arrLength] = arguments[argsIndex][rnd];
      arguments[argsIndex][rnd] = tmp;
    }
  }
}


changeChart(){ //change to bar chart or pie chart

  if(this.blnChartType){
    this.blnChartType=false;
  }
  else{
    this.blnChartType=true;
  }
}
 
brandchangeChart(){ //change to bar chart or pie chart

  if(this.blnBrandChartType){
    this.blnBrandChartType=false;
  }
  else{
    this.blnBrandChartType=true;
  }
}
 
itemchangeChart(){ //change to bar chart or pie chart

  if(this.blnItemChartType){
    this.blnItemChartType=false;
  }
  else{
    this.blnItemChartType=true;
  }
}

staffchangeChart(){
  if(this.blnStaffChartType){
    this.blnStaffChartType=false;
  }
  else{
    this.blnStaffChartType=true;
  }

}




exportAsXLSX(chartHead: any): void {
  let dctTempData: any = [];
  console.log(this.sort);
  
  this.chartHead=chartHead;
  this.expJsondata['component']='Product_report';
  // this.expJsondata['sortname']=this.sort.active;
  // this.expJsondata['sortdirection']=this.sort.direction;

  if(chartHead=='Product'){
    
    
    this.expJsondata['charthead']='Product';
    // console.log(this.productChartKey,"Productchart Key")
    // dctTempData=this.dctReportData[this.productChartKey];
    // console.log(dctTempData,"dictTempData product wise")
    this.reportcomponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);   
    this.chartName=this.dct_product;
    
  }
  else if(chartHead=='Brand'){    
    this.expJsondata['charthead']='Brand';
      // if (this.brandChartKey=='brand_all'){
        // console.log(this.branchName,this.brandChartKey,"branchname,Brandchart Key")
      // dctTempData=this.dctReportData[this.brandChartKey];
      // console.log(dctTempData,"dctTempdata Brand wise")
      this.reportcomponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);
      
      // }
     
    // else if(this.brandChartKey=='service_brand'){
      // console.log(this.branchName,this.brandChartKey,"branchname,Brandchart Key")
      // dctTempData=this.dctReportData[this.brandChartKey][this.selectedProduct];
      // this.reportcomponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);
    // }


    this.chartName=this.dct_brand;
  }
  else if(chartHead=='Item'){
    
    this.expJsondata['charthead']='Item'
    // if (this.itemChartKey=='item_all'){
      // dctTempData=this.dctReportData[this.itemChartKey];
    
      this.reportcomponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);
      // }
      
      // else if(this.itemChartKey=='service_item'){

      //   dctTempData=this.dctReportData[this.itemChartKey][this.selectedProduct];
      //   this.reportcomponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);

    
  // }
  
  // else if(this.itemChartKey=='service_brand_item'){

  //       dctTempData=this.dctReportData[this.itemChartKey][this.selectedProduct][this.selectedBrand];
  //       this.reportcomponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);

  // }

  //this.chartName=this.dct_item;
  // if(this.exportExcel==true){
  //   this.exportAsXLSX(chartHead);
  //   this.exportExcel=false;
  // }
}
  else if(chartHead=='Staff'){
  
    this.expJsondata['charthead']='Staff'
 
    // if (this.staffChartKey=='staff_all'){
    //   dctTempData=this.dctReportData[this.staffChartKey];
    //   this.reportcomponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
    //   }
      
    //   else if(this.staffChartKey=='service_staff'){

    //     dctTempData=this.dctReportData[this.staffChartKey][this.selectedProduct];
    //     this.reportcomponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
    //   }
    //   else if(this.staffChartKey=='service_brand_staff'){

    //     dctTempData=this.dctReportData[this.staffChartKey][this.selectedProduct][this.selectedBrand];
    //     this.reportcomponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
    //   }

    //   else if(this.staffChartKey=='service_brand_item_staff'){

    //     dctTempData=this.dctReportData[this.staffChartKey][this.selectedProduct][this.selectedBrand][this.selectedItem];
        this.reportcomponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);

      // }

   // this.chartName=this.dct_staff;
  }

 //this.chartHead=chartHead;
 this.downloadLog(this.dctJsonData1)

}

downloadLog(dctJsonData){
  let chart = localStorage.getItem('chartexport');
  // excel/pdf chart table pagenumber value/quantity filters
  let dctDownloadLog  = {};
  dctDownloadLog['vchr_url'] = this.strUrl;
  dctDownloadLog['date_range'] = this.selectedFromDate +' , ' +this.selectedToDate;
  if(chart == ''){
  dctDownloadLog['vchr_chart'] = "ALL";
  }
  else{
    dctDownloadLog['vchr_chart'] = this.chartHead;
    dctJsonData['document'] = 'excel';
  }
  dctDownloadLog['vchr_filter'] = "";

  // dctJsonData['staff']=this.staffName;
  // dctJsonData['branch']=this.branchName;
  dctDownloadLog['vchr_filter'] = dctJsonData['document']
  if(chart == ''){
  if (this.chart){
    dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " chart";
  }
  if (this.table){
    dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " table";
  }
 }
  dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] +" " +this.currentPage;

  if (this.type){
    dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " value";
  }
  else{
    dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " quantity";
  }

  if(this.staffName){
    dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + this.staffName;
  }
  if(this.branchName){
    dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + this.branchName;
  }
  // if(this.brandName!=''){
  //   dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + this.brandName;
  // }
 
  // if(this.product!=''){
  //   dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " +this.product;
  // }


  
  this.serverService.postData("download_log/",dctDownloadLog)
  .subscribe(
    (response) => {
      this.spinnerService.hide();
      this.showSpinner=false;

        if (response['status'] === 1) {
      

        // var a = document.createElement('a');
        // document.body.appendChild(a);
        // a.href = response['file'];
        // a.download = 'report.xlsx';
        // a.click();
        // window.URL.revokeObjectURL(this.dctReportData);
        // a.remove();

        // this.toastr.success('Successfully Exported');   
        // this.blnExported = true;
        

        // this.table=false;
        // this.chart=false;
      
      } else {
      // this.toastr.error('No data found');
     }
    },
    (error) => {
      this.spinnerService.hide();
      this.showSpinner=false;

    });
}
}

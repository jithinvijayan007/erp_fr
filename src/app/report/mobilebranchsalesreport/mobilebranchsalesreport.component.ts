import { Component, OnInit, ViewChild, ElementRef, Input,ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/server.service';
import { SharedService } from '../../layouts/shared-service';
import { TitleCasePipe } from '@angular/common';
import * as moment from 'moment';
import { TypeaheadService } from '../../typeahead.service';
// import { SnotifyService } from 'ng-snotify';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSpinnerService } from "ngx-spinner";

import { ChartService } from 'src/app/chart.service';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
// import { ReportComponent } from '../report.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ReportComponent } from '../report.component';

import { from } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-mobilebranchsalesreport',
  templateUrl: './mobilebranchsalesreport.component.html',
  styleUrls: ['./mobilebranchsalesreport.component.scss']
})
export class MobilebranchsalesreportComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;


  showSpinner=false;

  initBranch;
  initProduct;
  initBrand;
  initItem;
  dctTempData: any = [];

  tempBranchIndex;
  tempProductIndex;
  tempBrandIndex;
  tempItemIndex;
  typeWise=false;

  
  
  displayedColumns1 = ['name','enquiryQty','salesQty','contribQtyPer','enquiryVal','salesVal', 'contribPer','conversionPer'];
  showPopup=false;
  dctPopupData:any[];
  chartName;
  chartHead;
  dataSource1;

  dct_product = {};
  dct_brand = {};
  dct_item = {};
  dct_staff = {};
  lstEnquiry=[];
  lstSale=[];
  productChartKey;
  branchChartKey
  brandChartKey;
  itemChartKey;
  staffChartKey;
  selectStaff;
  selectProduct;
  selectBranch;
  selectBrand;
  selectItem;
  grandTotal;
  saleQtyTot;
  enqQtyTot;
  enqValTot;

  blnBranchChartType = true;
  blnProductChartType = true;
  blnBrandChartType = true;
  blnItemChartType = true;

  //export excel
  expJsondata=[];



  lstPermission = JSON.parse(localStorage.getItem("group_permissions"));
  blnAdd = true;
  blnView = true;
  blnEdit = true;
  blnDelete = true;
  blnDownload = true;

  dctEnquiryDetails = [];
  public showTable = false;
  dctReportData: any = [];
  dctTableData: any = [];
  blnDataLoaded = false;
  selectedFromDate;
  selectedToDate;
  selectedOption: any = '';
  selectedOptionBranch: any = '';
  selectedOptionService: any = '';
  selectedOptionBrand: any = '';
  selectedOptionItem: any = '';
  activeBar = 'All';
  blnCheck = true;
  blnActive = true;
  nodata = [];
  chart=false;
  table=false;
  email;
  chatName;
  excel;
  export:boolean=true;
  emailExport:boolean=true;
  chatExport:boolean=true;

  strGoodPoor='';
  currentPage=1;

  blnExported = false;
  strUrl = '';
  dctJsonData1 = {}

  validationStatus=true;
  // chip list
  @ViewChild('idBranch') idBranch: ElementRef;
  @Input('show-modal') showModal: boolean;
  @Input('show-modal2') showModal2: boolean;
  

  statusSelected = [];
  lstBranches = [];
  searchBranch: FormControl = new FormControl();
  branchCode = '';
  branchName = '';
  selectedBranch = [];
  branchId: number;

  lstBranchArray = [];
  lstCompanyBranches = [];
  displayedColumns = ['date', 'enqno', 'staff', 'customer', 'product' , 'brand' , 'branch'];
  dataSource = new MatTableDataSource(this.dctEnquiryDetails);
  @ViewChild('branchModal',{static:true}) branchModal:ElementRef<any>

    // salebar chart colors
    public barSalesChartColor: Array<any> = this.chartservice.barSalesChartColor;
    // pie chart colors
    public pieChartColors: Array<any> = this.chartservice.pieChartColors;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public statusPieChartLabels: string[] = [];
  public statusPieChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public statusPieChartType = 'bar';

  public servicePieChartLabels: string[] = [];
  public servicePieChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public servicePieChartLabels1: string[] = [];
  public servicePieChartData1: any[] = [
    // { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public servicePieChartType = 'bar';

  public itemPieChartLabels: string[] = [];
  public itemPieChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public itemPieChartType = 'bar';
  public itemPieChartLegend = true;

  public brandPieChartLabels: string[] = [];
  public brandPieChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  
  public brandPieChartLabels1: string[] = [];
  public brandPieChartData1: any[] = [
    // { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];

  public brandPieChartType = 'bar';
  public brandPieChartLegend = true;

  public barChartLabels: string[] = [];
  barChartLabelsCopy = [];
  brandPieChartLabelsCopy = [];
  itemPieChartLabelsCopy = [];
  servicePieChartLabelsCopy = [];
  statusPieChartLabelsCopy = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];

  strSelectedOption;
  datFromDate;
  datToDate;
  branchCurrentIndex = 1;
  branchMaxIndex = 10;
  brandCurrentIndex = 1;
  brandMaxIndex = 10;
  itemCurrentIndex = 1;
  itemMaxIndex = 10;
  serviceCurrentIndex = 1;
  serviceMaxIndex = 10;
  statusCurrentIndex = 1;
  statusMaxIndex = 10;
  type = false

  public productPieChartType = 'pie';
  // public pieChartColors: Array<any> = this.chartservice.pieChartColors;


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

  public pieStatusOptions: any = {
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
        title: q => {
          // let datsetindex1 = q[0]['datasetIndex']
          const ind = q[0]['index'];
          return this.statusPieChartLabelsCopy[Number(ind)];
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.statusPieChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex) { return 'Sales:' + temp[ind]; } else { return 'Enquiry:' + temp[ind]; }
          // return this.statusPieChartLabelsCopy[Number(ind)] + ':' + temp[ind];
        }
      }
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
    legend: {  display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top',  }
  };
  public servicePieOptions: any = {
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
        title: q => {
          // let datsetindex1 = q[0]['datasetIndex']
          const ind = q[0]['index'];
          return this.servicePieChartLabelsCopy[Number(ind)];
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.servicePieChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex) { return 'Sales:' + temp[ind]; } else { return 'Enquiry:' + temp[ind]; }
          // return this.servicePieChartLabelsCopy[Number(ind)] + ':' + temp[ind];
        }
      }
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
    legend: {  display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top',  }
  };
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
        title: q => {
          // let datsetindex1 = q[0]['datasetIndex']
          const ind = q[0]['index'];
          return this.barChartLabelsCopy[Number(ind)];
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.barChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex) { return 'Sales:' + temp[ind]; } else { return 'Enquiry:' + temp[ind]; }
          // return this.barChartLabelsCopy[Number(ind)] + ':' + temp[ind];
        }
      }
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
    legend: {  display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top',  }
  };

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
        title: q => {
          // let datsetindex1 = q[0]['datasetIndex']
          const ind = q[0]['index'];
          return this.brandPieChartLabelsCopy[Number(ind)];
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.brandPieChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex) { return 'Sales:' + temp[ind]; } else { return 'Enquiry:' + temp[ind]; }
          // return this.brandPieChartLabelsCopy[Number(ind)] + ':' + temp[ind];
        }
      }
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
    legend: {  display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top',  }
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
        title: q => {
          // let datsetindex1 = q[0]['datasetIndex']
          const ind = q[0]['index'];
          return this.itemPieChartLabelsCopy[Number(ind)];
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.itemPieChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex) { return 'Sales:' + temp[ind]; } else { return 'Enquiry:' + temp[ind]; }
          // return this.itemPieChartLabelsCopy[Number(ind)] + ':' + temp[ind];
        }
      }
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
    legend: {  display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top',  }
  };
  isArray =
    Array.isArray ||
    function(value) {
      return {}.toString.call(value) !== '[object Array]';
    };

    blnGood = true;
    blnPoor = true;

  constructor(
    private _el: ElementRef,
    private serverService: ServerService,
    public dialog: MatDialog,
    private _sharedService: SharedService,
    public router: Router,
    private fb: FormBuilder,
    private titlecasePipe: TitleCasePipe,
    private typeaheadObject: TypeaheadService,
    // private snotifyService: SnotifyService,
    private spinnerService: NgxSpinnerService,
    private chartservice:ChartService,
    // public toastr: ToastsManager,
    private reportComponent: ReportComponent,
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
    this.lstPermission.forEach((item, index, array) => {

 if (item["NAME"] == "BRANCH REPORT" &&  item["PARENT"] == "SALES REPORTS") {
        this.blnAdd = item["ADD"];
        this.blnView = item["VIEW"];
        this.blnEdit = item["EDIT"];
        this.blnDelete = item["DELETE"];
        this.blnDownload = item["DOWNLOAD"];
      }
    });
    this.chartservice.listColor();

    if (!localStorage.getItem('Tokeniser')) {
      this.router.navigate(['/user/sign-in']);
    }
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
                  this.lstBranches = response.data;
                }
              );
          }
        }
      });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator.firstPage();
    this.datFromDate = moment();
    this.datToDate = moment();
    this.showDatewiseData(this.datFromDate, this.datToDate);
    // this.showAll();
  }
  tabledataFunc(){
    // let from = this.datFromDate._d;
    // let to = this.datToDate._d;
    // this.datFromDate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
    // this.datToDate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));
    if(this.showTable == true){
    const dctJsonData = {};
    dctJsonData['data'] = 'Custom';
    this.selectedFromDate = this.datFromDate.format('YYYY-MM-DD');
    // this.selectedToDate = this.datToDate.add(1, 'days').format('YYYY-MM-DD');
    this.selectedToDate = this.datToDate.format('YYYY-MM-DD');
    dctJsonData['date_from'] = this.selectedFromDate;
    dctJsonData['date_to'] = this.selectedToDate;
    dctJsonData['company_id'] = localStorage.getItem('companyId')
    dctJsonData['branch'] = this.statusSelected.map(x => x.id);
      this.serverService.postData('enquiry/branchReportMobileTable/',dctJsonData)
      .subscribe(
        (response) => {
          if (response['status'] === 1) {
            this.dctTableData = response['data'];
            this.dataSource = new MatTableDataSource(this.dctTableData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.paginator.firstPage();
            this.dataSource.sort = this.sort;
            console.log("asxs",this.sort);
            
            
          } else {
          // this.snotifyService.error('No data found');
          Swal.fire('Error','No data found','error')
         }
        },
        (error) => {
          // this.spinnerService.hide();
          this.showSpinner=false;

        });
    }
  }
  switchChange(){
    this.showDatewiseData(this.selectedFromDate, this.selectedToDate);
  }

  

  PaginationSort() {
    // this.dataSource1.paginator = this.paginator;
    // this.dataSource1.paginator.firstPage();
    this.dataSource1.sort = this.sort;
  }

  showDatewiseData(fdate, tdate) {
    // let from = fdate._d;
    // let to = tdate._d;
    // fdate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
    // tdate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));
    console.log(moment(new Date(fdate)).format('YYYY-MM-DD'),'xfxjuc',moment(new Date(tdate)).format('YYYY-MM-DD'));
    
    this.blnDataLoaded = false;
    if (fdate && tdate) {
      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = moment(new Date(fdate)).format('YYYY-MM-DD');
      // this.selectedToDate = this.datToDate.add(1, 'days').format('YYYY-MM-DD');
      this.selectedToDate = moment(new Date(tdate)).format('YYYY-MM-DD');
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['company_id'] = localStorage.getItem('companyId');
      dctJsonData['type'] = 'Sale';
      dctJsonData['show_type'] = this.type;
      dctJsonData['show_table'] = this.chartName;
      dctJsonData['branch'] = this.statusSelected.map(x => x.id);
      // dctJsonData['branch'] = 92;


      this.expJsondata['tmpdfdate']=this.selectedFromDate;
      this.expJsondata['tmpdtdate']=this.selectedToDate;
      this.expJsondata['product']='ALL';
      this.expJsondata['brand']='ALL';
      this.expJsondata['item']='ALL';
      // this.expJsondata['branch']=this.statusSelected.map(x => x.name);


      this.expJsondata['branch']=''
      for(let st of this.statusSelected){
        this.expJsondata['branch']=this.expJsondata['branch']+' '+st.name;
      }
      if(this.expJsondata['branch']==''){
        this.expJsondata['branch']='ALL'
      }

      // this.spinnerService.show();
      this.showSpinner=true;

      this.serverService
        .postData('enquiry/mobilebranchreport/',dctJsonData)
        .subscribe(
          response => {
            // this.spinnerService.hide();
            this.showSpinner=false;
            
            if (response['status'] == 1) {
              if(response['data']){  
            this.dctReportData = response['data'];
            
            // this.nodata = []
              this.nodata = [1]
              
            this.showAll();
            }
            if(response['table_data']){
              
              let lstData=[];
              lstData=response['table_data'];
              this.dataSource1 = new MatTableDataSource(lstData);
              
              // this.listLength = lstData.length;
              // console.log("this.dataSource1",this.dataSource1);
              this.PaginationSort();
              this.chartName=null;
              }
          }
          else{
            this.nodata = [];
          }
          
          },
          error => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          }
        );
    }
  }




  openExport(modal){
    this.chart=false;
    this.table=false;
    this.showModal = true;
    this.modalService.open(modal,{windowClass:'exportModal'})


  }
  closeExport(){
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

    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
      Swal.fire('Error','Choose chart or table','error')
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
    this.blnDataLoaded = false;
    if (fdate && tdate) {
      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = this.selectedFromDate;
      // this.selectedToDate = this.datToDate.add(1, 'days').format('YYYY-MM-DD');
      this.selectedToDate =this.selectedToDate;
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['company_id'] = localStorage.getItem('companyId');
      dctJsonData['type'] = 'Sale';
      dctJsonData['show_type'] = this.type;
      dctJsonData['branch'] = this.statusSelected.map(x => x.id);
      dctJsonData['report_type']='branch_report';
      dctJsonData['export_type'] = 'DOWNLOAD';
      dctJsonData['strGoodPoorClicked'] = this.strGoodPoor;
      dctJsonData['intCurrentPage'] = this.currentPage;
            this.showModal = false;
            dctJsonData['bln_chart'] = this.chart;
            dctJsonData['bln_table'] = this.table;

            // this.spinnerService.show();
            this.showSpinner=true;

      
      if(this.export){

        dctJsonData['document'] = 'excel';

        this.serverService.postData("branch_report_download/branch_pdf",dctJsonData)
        .subscribe(
          (response) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
              

              var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = response['file'];
              a.download = 'report.xlsx';
              a.click();
              window.URL.revokeObjectURL(this.dctReportData);
              a.remove();

              // this.snotifyService.success('Successfully Exported');  
              Swal.fire('Success','Successfully Exported','success')
 

              this.blnExported = true;
              this.downloadLog(dctJsonData)

              this.table=false;
              this.chart=false;
           
            } else {
            // this.snotifyService.error('No data found');
            Swal.fire('Error','No data found','error')

           }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

      if(!this.export){
        dctJsonData['document'] = 'pdf';
        this.serverService.postData("branch_report_download/branch_pdf",dctJsonData)
        .subscribe(
          (response) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

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
              // this.snotifyService.success('Successfully Exported');   
              Swal.fire('Success','Successfully Exported','success')

              
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
           
              this.table=false;
              this.chart=false;
          
            } else {
            // this.snotifyService.error('No data found');
            Swal.fire('Error','No data found','error')

           }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });

      }
      this.dctJsonData1 = dctJsonData;
    }
    }  
      
  }


  exportWithEmail(fdate, tdate){
    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
      Swal.fire('Error','Choose chart or table','error')

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
    this.blnDataLoaded = false;
    if (fdate && tdate) {
      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = fdate.format('YYYY-MM-DD');
      // this.selectedToDate = this.datToDate.add(1, 'days').format('YYYY-MM-DD');
      this.selectedToDate = tdate.format('YYYY-MM-DD');
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['company_id'] = localStorage.getItem('companyId');
      dctJsonData['type'] = 'Sale';
      dctJsonData['show_type'] = this.type;
      dctJsonData['branch'] = this.statusSelected.map(x => x.id);
      dctJsonData['report_type']='branch_report';
      dctJsonData['export_type'] = 'MAIL';
      dctJsonData['strGoodPoorClicked'] = this.strGoodPoor;
      dctJsonData['intCurrentPage'] = this.currentPage;

    if(!this.email){
      // this.snotifyService.error('Enter an email address');
      return false;
    }
    else {
      const eatpos = this.email.trim().indexOf('@');
      const edotpos = this.email.trim().lastIndexOf('.');
      if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.email.length) {
        // this.snotifyService.error("Invalid Email entered");
        Swal.fire('Error','Invalid Email entered','error')

      return false;
      }
      else{
        dctJsonData['email'] = this.email;
      }
     
    }

   
        this.showModal2 = false;
            dctJsonData['bln_chart'] = this.chart;
            dctJsonData['bln_table'] = this.table;



      // this.spinnerService.show();
      this.showSpinner=true;

    
      if(!this.emailExport){

        dctJsonData['document'] = 'pdf';

        this.serverService.postData("branch_report_download/branch_pdf",dctJsonData)
        .subscribe(
          (response) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
                // this.snotifyService.success('Successfully Exported');   
                Swal.fire('Success','Successfully Exported','success')


              this.table=false;
              this.chart=false;
            
              this.email=null

            } else {
              // this.snotifyService.error('something went wrong');
              Swal.fire('Error','something went wrong','error')

             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

     else if(this.emailExport){
      dctJsonData['document'] = 'excel';
        this.serverService.postData("branch_report_download/branch_pdf",dctJsonData)
        .subscribe(
          (response) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
                // this.snotifyService.success('Successfully Exported'); 
                Swal.fire('Success','Successfully Exported','success')
  

              this.table=false;
              this.chart=false;
              this.email=null
         
            }  else {
              // this.snotifyService.error('something went wrong');
              Swal.fire('Error','something went wrong','error')

             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });

      }

    }  
  }
  }

  exportWithChatName(fdate, tdate){

    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
      Swal.fire('Error','Choose chart or table','error')

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
    this.blnDataLoaded = false;
    if (fdate && tdate) {
      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = fdate.format('YYYY-MM-DD');
      // this.selectedToDate = this.datToDate.add(1, 'days').format('YYYY-MM-DD');
      this.selectedToDate = tdate.format('YYYY-MM-DD');
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['company_id'] = localStorage.getItem('companyId');
      dctJsonData['type'] = 'Sale';
      dctJsonData['show_type'] = this.type;
      dctJsonData['branch'] = this.statusSelected.map(x => x.id);
      dctJsonData['report_type']='branch_report';
      dctJsonData['export_type'] = 'CHAT';
    if(!this.chatName){
      // this.snotifyService.error('Enter chat name');
      Swal.fire('Error','Enter chat name','error')

      return false;
    }
  
      else{
        dctJsonData['chatName'] = this.chatName;   
    }

   
        this.showModal2 = false;
            dctJsonData['bln_chart'] = this.chart;
            dctJsonData['bln_table'] = this.table;

     
      // this.spinnerService.show();
      this.showSpinner=true;

    
      if(!this.chatExport){

        dctJsonData['document'] = 'pdf';

        this.serverService.postData("branch_report_download/branch_pdf",dctJsonData)
        .subscribe(
          (response) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
                // this.snotifyService.success('Successfully Exported');  
                Swal.fire('Success','Successfully Exported','success')
 

              this.table=false;
              this.chart=false;
          
              this.email=null

            } else {
              // this.snotifyService.error('something went wrong');
              Swal.fire('Error','something went wrong','error')

             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

     else if(this.chatExport){
      dctJsonData['document'] = 'excel';
        this.serverService.postData("branch_report_download/branch_pdf",dctJsonData)
        .subscribe(
          (response) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] === 1) {
                // this.snotifyService.success('Successfully Exported');  
                Swal.fire('Success','Successfully Exported','success')
 

              this.table=false;
              this.chart=false;
              this.email=null
        
            }  else {
              // this.snotifyService.error('something went wrong');
              Swal.fire('Error','something went wrong','error')

             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });

      }

    }  
  }   
  }


  shuffleMulti(arr1, arr2, arr3, arr4) {
    let arrLength = 0;
    const argsLength = arguments.length;
    let rnd, tmp;
    for (let index = 0; index < argsLength; index += 1) {
      if (!this.isArray(arguments[index])) {
        throw new TypeError('Argument is not an array.');
      }
      if (index === 0) {
        arrLength = arguments[0].length;
      }
      if (arrLength !== arguments[index].length) {
        throw new RangeError('Array lengths do not match.');
      }
    }
    while (arrLength) {
      rnd = Math.floor(Math.random() * arrLength);
      arrLength -= 1;
      for (let argsIndex = 0; argsIndex < argsLength; argsIndex += 1) {
        tmp = arguments[argsIndex][arrLength];
        arguments[argsIndex][arrLength] = arguments[argsIndex][rnd];
        arguments[argsIndex][rnd] = tmp;
      }
    }
  }
  showAll() {
    

    this.initBranch=this.dctReportData.IN_IT['BRANCHS'];
    this.initProduct=this.dctReportData.IN_IT['SERVICE'];
    this.initBrand=this.dctReportData.IN_IT['BRANDS'];
    this.initItem=this.dctReportData.IN_IT['ITEMS'];

    this.branchCurrentIndex=1;
    this.serviceCurrentIndex=1;
    this.brandCurrentIndex=1;
    this.itemCurrentIndex=1;

    this.blnGood = true;
    this.blnPoor = true;
    this.strGoodPoor='NORMAL';
    // this.branchChartKey='branch_all';

    this.selectedOption = '';
    this.selectedOptionBranch = '';
    this.selectedOptionService = '';
    this.selectedOptionBrand = '';
    this.selectedOptionItem = '';
    this.brandCurrentIndex = 1;
    this.serviceCurrentIndex = 1;
    this.brandCurrentIndex = 1;
    this.itemCurrentIndex = 1;
    this.statusCurrentIndex = 1;
    // assign data to barchart
    this.barChartLabels = [];
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.branchMaxIndex = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM).length;
    this.barChartLabels = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]
    );
    this.barChartLabelsCopy = this.barChartLabels;
    
    this.barChartLabels = this.barChartLabels.map(obj => {
      if (obj.length > 5) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });
    this.barChartData[0].data = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]
    ).map(
      key =>
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][key]['Enquiry']
    );
    this.barChartData[1].data = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]
    ).map(
      key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][key]['Sale']
    );
    this.shuffleMulti(this.barChartLabels, this.barChartData[0].data,this.barChartData[1].data, this.barChartLabelsCopy);

    setTimeout(
      () => (this.barChartLabels = Object.assign([], this.barChartLabels))
    );
    setTimeout(
      () =>
        (this.barChartData[0].data = Object.assign(
          [],
          this.barChartData[0].data
        ))
    );
    setTimeout(
      () =>
        (this.barChartData[1].data = Object.assign(
          [],
          this.barChartData[1].data
        ))
    );

    // assign data to itemwise

    // this.itemChartKey='item_all';
    this.itemPieChartLabels = [];
    this.itemPieChartData[0].data = [];
    this.itemPieChartData[1].data = [];
    this.itemMaxIndex = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS']).length;
    this.itemPieChartLabels = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
    );
    this.itemPieChartLabelsCopy = this.itemPieChartLabels;
    this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
      if (obj.length > 5) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });
    this.itemPieChartData[0].data = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
    ).map(
      key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
    );
    this.itemPieChartData[1].data = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
    ).map(
      key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
    );
    setTimeout(
      () =>
        (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels))
    );
    setTimeout(
      () =>
        (this.itemPieChartData[0].data = Object.assign(
          [],
          this.itemPieChartData[0].data
        ))
    );
    setTimeout(
      () =>
        (this.itemPieChartData[1].data = Object.assign(
          [],
          this.itemPieChartData[1].data
        ))
    );

    // assign data to brandwise
    
    // this.brandChartKey='brand_all';
    
    this.brandPieChartLabels = [];
    this.brandPieChartLabels1 = [];
    this.brandPieChartData[0].data = [];
    this.brandPieChartData[1].data = [];
    this.brandPieChartData1[0].data = [];
    this.brandMaxIndex = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS']).length;

    this.brandPieChartLabels = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]
    );
    this.brandPieChartLabelsCopy = this.brandPieChartLabels;
    this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
      if (obj.length > 5) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });

    
    for (let item in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS']){
      if(item=='4'){
        break;
      }
      this.brandPieChartLabels1.push(...Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][item]));
      for(let product in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][item]){
       
        this.brandPieChartData1[0].data.push(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][item][product]['Sale']); 
        
        
      }
      
    }    



    this.brandPieChartData[0].data = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]
    ).map(
      key =>
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Enquiry']
    );
    this.brandPieChartData[1].data = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]
    ).map(
      key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']
    );
    setTimeout(
      () =>
        (this.brandPieChartLabels = Object.assign([], this.brandPieChartLabels))
    );
    setTimeout(
      () =>
        (this.brandPieChartData[0].data = Object.assign(
          [],
          this.brandPieChartData[0].data
        ))
    );
    setTimeout(
      () =>
        (this.brandPieChartData[1].data = Object.assign(
          [],
          this.brandPieChartData[1].data
        ))
    );
    setTimeout(
      () =>
        (this.brandPieChartLabels1 = Object.assign([], this.brandPieChartLabels1))
    );
    setTimeout(
      () =>
        (this.brandPieChartData1[0].data = Object.assign(
          [],
          this.brandPieChartData1[0].data
        ))
    );

    // assign data to servicewise

    // this.productChartKey='service_all';

    this.servicePieChartLabels = [];
    this.servicePieChartLabels1 = [];
    this.servicePieChartData[0].data = [];
    this.servicePieChartData[1].data = [];
    this.servicePieChartData1[0].data = [];
    this.serviceMaxIndex = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE']).length;
    this.servicePieChartLabels = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex]);
    this.servicePieChartLabelsCopy = this.servicePieChartLabels;
    this.servicePieChartLabels = this.servicePieChartLabels.map(obj => {
      if (obj.length > 5) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });

    for (let item in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE']){
      if(item=='3'){
        break;
      }
      this.servicePieChartLabels1.push(...Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][item]));
      for(let product in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][item]){
       
        this.servicePieChartData1[0].data.push(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][item][product]['Sale']); 
        
        
      }
      
    }    

    this.servicePieChartData[0].data = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex]
    ).map(key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][key]['Enquiry']);
    this.servicePieChartData[1].data = Object.keys(
      this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex]
    ).map(key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.initBranch]['SERVICE'][this.serviceCurrentIndex][key]['Sale']);
    setTimeout(
      () =>
        (this.servicePieChartLabels = Object.assign(
          [],
          this.servicePieChartLabels
        ))
    );
    setTimeout(
      () =>
        (this.servicePieChartData[0].data = Object.assign(
          [],
          this.servicePieChartData[0].data
        ))
    );
    setTimeout(
      () =>
        (this.servicePieChartData[1].data = Object.assign(
          [],
          this.servicePieChartData[1].data
        ))
    );
    setTimeout(
      () =>
        (this.servicePieChartLabels1 = Object.assign(
          [],
          this.servicePieChartLabels1
        ))
    );
    setTimeout(
      () =>
        (this.servicePieChartData1[0].data = Object.assign(
          [],
          this.servicePieChartData1[0].data
        ))
    );

    // // assign data to statuswise
    // this.statusPieChartLabels = [];
    // this.statusPieChartData[0].data = [];
    // this.statusPieChartData[1].data = [];
    // this.statusPieChartLabels = Object.keys(this.dctReportData.status_all);
    // this.statusPieChartLabelsCopy = this.statusPieChartLabels;
    // this.statusPieChartLabels = this.statusPieChartLabels.map(obj => {
    //   if (obj.length > 5) {
    //     obj = obj.slice(0, 5) + '..';
    //   }
    //   return obj;
    // });
    // this.statusPieChartData[0].data = Object.keys(
    //   this.dctReportData.status_all
    // ).map(key => this.dctReportData.status_all[key]['Enquiry']);
    // this.statusPieChartData[1].data = Object.keys(
    //   this.dctReportData.status_all
    // ).map(key => this.dctReportData.status_all[key]['Sale']);
    // setTimeout(
    //   () =>
    //     (this.statusPieChartLabels = Object.assign(
    //       [],
    //       this.statusPieChartLabels
    //     ))
    // );
    // setTimeout(
    //   () =>
    //     (this.statusPieChartData[0].data = Object.assign([], this.statusPieChartData[0].data))
    // );
    // setTimeout(
    //   () =>
    //     (this.statusPieChartData[1].data = Object.assign([], this.statusPieChartData[1].data))
    // );

    
    this.brandPieOptions.title.text = this.initProduct;
    this.itemPieOptions.title.text = this.initBrand;
    this.servicePieOptions.title.text = this.initBranch;
    // this.pieStatusOptions.title.text = this.initItem;
  }

  public chartClicked(e: any): void {
    console.log(e)
    this.selectedOptionService = '';
    this.selectedOptionBrand = '';
    this.selectedOptionItem = '';


    if (e.active.length > 0) {
      this.tempBranchIndex=this.branchCurrentIndex;

      this.selectedOption = this.barChartLabelsCopy[e.active[0]._index];
      this.selectedOptionBranch = this.barChartLabelsCopy[e.active[0]._index];

      this.servicePieChartLabels = [];
      this.servicePieChartLabels1 = [];
      this.servicePieChartData[0].data = [];
      this.servicePieChartData[1].data = [];
      this.servicePieChartData1[0].data = [];

      this.brandPieChartLabels = [];
      this.brandPieChartLabels1 = [];
      this.brandPieChartData[0].data = [];
      this.brandPieChartData[1].data = [];
      this.brandPieChartData1[0].data = [];

      this.itemPieChartLabels = [];
      this.itemPieChartData[0].data = [];
      this.itemPieChartData[1].data = [];

      this.statusPieChartLabels = [];
      this.statusPieChartData[0].data = [];
      this.statusPieChartData[1].data = [];

      // assign data to servicewise
      // this.productChartKey='branch_service';
      this.selectBranch=this.selectedOption;
      this.expJsondata['branch']=this.selectBranch;


      this.servicePieChartLabels = [];
      this.servicePieChartLabels1 = [];
      this.servicePieChartData[0].data = [];
      this.servicePieChartData[1].data = [];
      this.servicePieChartData1[0].data = [];
      this.serviceCurrentIndex = 1;
      
      this.serviceMaxIndex = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE']
      ).length;
      this.servicePieChartLabels = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex]
      );
      
      this.initProduct=this.servicePieChartLabels[0];
      this.servicePieChartLabelsCopy = this.servicePieChartLabels;
      this.servicePieChartLabels = this.servicePieChartLabels.map(obj => {
        if (obj.length > 5) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
 
      for (let item in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE']){
        if(item=='3'){
          break;
        }
        this.servicePieChartLabels1.push(...Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][item]));
        for(let product in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][item]){
         
          this.servicePieChartData1[0].data.push(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][item][product]['Sale']); 
          
          
        }
        
      }   
   

      this.servicePieChartData[0].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][key]['Enquiry']
      );
      
      this.servicePieChartData[1].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][key]['Sale']
      );
      setTimeout(
        () =>
          (this.servicePieChartLabels = Object.assign(
            [],
            this.servicePieChartLabels
          ))
      );
      setTimeout(
        () =>
          (this.servicePieChartData[0].data = Object.assign(
            [],
            this.servicePieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.servicePieChartData[1].data = Object.assign(
            [],
            this.servicePieChartData[1].data
          ))
      );
      setTimeout(
        () =>
          (this.servicePieChartLabels1 = Object.assign(
            [],
            this.servicePieChartLabels1
          ))
      );
      setTimeout(
        () =>
          (this.servicePieChartData1[0].data = Object.assign(
            [],
            this.servicePieChartData1[0].data
          ))
      );
      
      // assign data to brandwise
      this.brandChartKey='branch_brand';
      
      this.brandPieChartLabels = [];
      this.brandPieChartLabels1 = [];
      this.brandPieChartData[0].data = [];
      this.brandPieChartData1[0].data = [];
      this.brandCurrentIndex = 1;
      this.brandMaxIndex = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS']
      ).length;
      
      this.brandPieChartLabels = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]
      );
      this.initBrand=this.brandPieChartLabels[0];
      this.brandPieChartLabelsCopy = this.brandPieChartLabels;
      this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
        if (obj.length > 5) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
  
      
      for (let item in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS']){
        if(item=='4'){
          break;
        }
        this.brandPieChartLabels1.push(...Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][item]));
        for(let product in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][item]){
         
          this.brandPieChartData1[0].data.push(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][item][product]['Sale']); 
          
          
        }
        
      }   

      this.brandPieChartData[0].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][
          this.brandCurrentIndex
        ]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][
            this.brandCurrentIndex
          ][key]['Enquiry']
      );
      this.brandPieChartData[1].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][
          this.brandCurrentIndex
        ]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][
            this.brandCurrentIndex
          ][key]['Sale']
      );
      setTimeout(
        () =>
          (this.brandPieChartLabels = Object.assign(
            [],
            this.brandPieChartLabels
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartData[0].data = Object.assign(
            [],
            this.brandPieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartData[1].data = Object.assign(
            [],
            this.brandPieChartData[1].data
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartLabels1 = Object.assign(
            [],
            this.brandPieChartLabels1
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartData1[0].data = Object.assign(
            [],
            this.brandPieChartData1[0].data
          ))
      );
      // assign data to itemwise
      // this.itemChartKey='branch_item';
      this.itemPieChartLabels = [];
      this.itemPieChartData[0].data = [];
      this.itemPieChartData[1].data = [];
      this.itemCurrentIndex = 1;
      this.itemMaxIndex = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS']
      ).length;
      this.itemPieChartLabels = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      );
      this.itemPieChartLabelsCopy = this.itemPieChartLabels;
      this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
        if (obj.length > 5) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
      this.itemPieChartData[0].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
      );
      this.itemPieChartData[1].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOption]['SERVICE'][this.serviceCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
      );
      setTimeout(
        () =>
          (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[0].data = Object.assign(
            [],
            this.itemPieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[1].data = Object.assign(
            [],
            this.itemPieChartData[1].data
          ))
      );

      // assign data to statuswise
      // this.statusPieChartLabels = [];
      // this.statusPieChartData[0].data = [];
      // this.statusPieChartData[1].data = [];
      // this.statusPieChartLabels = Object.keys(
      //   this.dctReportData.branch_status[this.selectedOption]
      // );
      // this.statusPieChartData[0].data = Object.keys(
      //   this.dctReportData.branch_status[this.selectedOption]
      // ).map(
      //   key =>
      //     this.dctReportData.branch_status[this.selectedOption][key]['Enquiry']
      // );
      // this.statusPieChartData[1].data = Object.keys(
      //   this.dctReportData.branch_status[this.selectedOption]
      // ).map(
      //   key =>
      //     this.dctReportData.branch_status[this.selectedOption][key]['Sale']
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartLabels = Object.assign(
      //       [],
      //       this.statusPieChartLabels
      //     ))
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartData[0].data = Object.assign(
      //       [],
      //       this.statusPieChartData[0].data
      //     ))
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartData[1].data = Object.assign(
      //       [],
      //       this.statusPieChartData[1].data
      //     ))
      // );

      // console.log("this.initProduct",this.initProduct);
      // console.log("this.initBrand",this.initBrand);
      // console.log("this.initItem",this.initItem);
      
      this.servicePieOptions.title.text = this.selectedOption;
      this.brandPieOptions.title.text = this.initProduct;
      this.itemPieOptions.title.text = this.initBrand;
      this.pieStatusOptions.title.text = this.initItem;
    }
  }
  public servicePieChartClicked(e: any): void {
    this.selectedOptionBrand = '';
    this.selectedOptionItem = '';


    if (this.selectedOptionBranch === '') {
      this.selectedOptionBranch =this.initBranch;
      this.tempBranchIndex=this.branchCurrentIndex;
      
      // this.snotifyService.error('Select branch before product');
    } else if (e.active.length > 0) {

      this.tempProductIndex=this.serviceCurrentIndex;

      this.selectedOption = this.servicePieChartLabelsCopy[e.active[0]._index];
      this.selectedOptionService = this.selectedOption;
      this.selectedOptionBrand = '';
      this.selectedOptionItem = '';
      // assign data to barchart
      this.brandChartKey='branch_service_brand';
      this.selectProduct=this.selectedOption;
      this.expJsondata['product']=this.selectProduct;

      this.brandPieChartLabels = [];
      this.brandPieChartLabels1 = [];
      this.brandPieChartData[0].data = [];
      this.brandPieChartData[1].data = [];
      this.brandPieChartData1[0].data = [];
      this.brandCurrentIndex = 1;
      this.brandMaxIndex = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS']
      ).length;
      this.brandPieChartLabels = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex]
      );
      this.initBrand=this.brandPieChartLabels[0];
      this.brandPieChartLabelsCopy = this.brandPieChartLabels;
      this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
        if (obj.length > 5) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
     
      for (let item in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS']){
        if(item=='4'){
          break;
        }
        this.brandPieChartLabels1.push(...Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][item]));
        for(let product in this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][item]){
         
          this.brandPieChartData1[0].data.push(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][item][product]['Sale']); 
          
          
        }
        
      }   

      this.brandPieChartData[0].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][key]['Enquiry']
      );
      this.brandPieChartData[1].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][key]['Sale']
      );
      setTimeout(
        () =>
          (this.brandPieChartLabels = Object.assign(
            [],
            this.brandPieChartLabels
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartData[0].data = Object.assign(
            [],
            this.brandPieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartData[1].data = Object.assign(
            [],
            this.brandPieChartData[1].data
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartLabels1 = Object.assign(
            [],
            this.brandPieChartLabels1
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartData1[0].data = Object.assign(
            [],
            this.brandPieChartData1[0].data
          ))
      );
      // assign data to barchart
      // this.itemChartKey='branch_service_item';

      this.itemPieChartLabels = [];
      this.itemPieChartData[0].data = [];
      this.itemPieChartData[1].data = [];
      this.itemCurrentIndex = 1;
      this.itemMaxIndex = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS']
      ).length;
      this.itemPieChartLabels = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      );
      this.itemPieChartLabelsCopy = this.itemPieChartLabels;
      this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
        if (obj.length > 5) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
      this.itemPieChartData[0].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
      );
      this.itemPieChartData[1].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOption]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
      );
      setTimeout(
        () =>
          (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[0].data = Object.assign(
            [],
            this.itemPieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[1].data = Object.assign(
            [],
            this.itemPieChartData[1].data
          ))
      );
      // assign data to statuswise
      // this.statusPieChartLabels = [];
      // this.statusPieChartData[0].data = [];
      // this.statusPieChartData[1].data = [];
      // this.statusPieChartLabels = Object.keys(
      //   this.dctReportData.branch_service_status[this.selectedOptionBranch][
      //     this.selectedOption
      //   ]
      // );
      // this.statusPieChartData[0].data = Object.keys(
      //   this.dctReportData.branch_service_status[this.selectedOptionBranch][
      //     this.selectedOption
      //   ]
      // ).map(
      //   key =>
      //     this.dctReportData.branch_service_status[this.selectedOptionBranch][
      //       this.selectedOption
      //     ][key]['Enquiry']
      // );
      // this.statusPieChartData[1].data = Object.keys(
      //   this.dctReportData.branch_service_status[this.selectedOptionBranch][
      //     this.selectedOption
      //   ]
      // ).map(
      //   key =>
      //     this.dctReportData.branch_service_status[this.selectedOptionBranch][
      //       this.selectedOption
      //     ][key]['Sale']
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartLabels = Object.assign(
      //       [],
      //       this.statusPieChartLabels
      //     ))
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartData[0].data = Object.assign(
      //       [],
      //       this.statusPieChartData[0].data
      //     ))
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartData[1].data = Object.assign(
      //       [],
      //       this.statusPieChartData[1].data
      //     ))
      // );

      this.brandPieOptions.title.text = this.selectedOption;
      this.itemPieOptions.title.text = this.initBrand;
      // this.pieStatusOptions.title.text = this.selectedOption;
    }
  }

  public brandPieChartClicked(e: any): void {
    this.selectedOptionItem = '';

    if (this.selectedOptionService === '') {

      this.selectedOptionService= this.initProduct;
      this.tempProductIndex=this.serviceCurrentIndex;

      // this.snotifyService.error('Select product before brand');
    }
    if (this.selectedOptionBranch === '') {

      this.selectedOptionBranch= this.initBranch;
      this.tempBranchIndex=this.branchCurrentIndex;

      // this.snotifyService.error('Select product before brand');
    }
    else if (e.active.length > 0) {
      this.tempBrandIndex=this.brandCurrentIndex;

      this.selectedOption = this.brandPieChartLabelsCopy[e.active[0]._index];
      this.selectedOptionBrand = this.selectedOption;
      this.selectedOptionItem = '';
      // assign data to barchart

      this.itemChartKey='branch_service_brand_item';
      this.selectBrand=this.selectedOption;
      this.expJsondata['brand']=this.selectBrand

      this.itemPieChartLabels = [];
      this.itemPieChartData[0].data = [];
      this.itemCurrentIndex = 1;
      this.itemMaxIndex = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS']
      ).length;
      this.itemPieChartLabels = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex]
      );

      this.itemPieChartLabelsCopy = this.itemPieChartLabels;
      this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
        if (obj.length > 5) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
      this.itemPieChartData[0].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
      );
      this.itemPieChartData[1].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex][this.selectedOption]['ITEMS'][this.itemCurrentIndex][key]['Sale']
      );
      setTimeout(
        () =>
          (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[0].data = Object.assign(
            [],
            this.itemPieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[1].data = Object.assign(
            [],
            this.itemPieChartData[1].data
          ))
      );
      // assign data to statuswise
      // this.statusPieChartLabels = [];
      // this.statusPieChartData[0].data = [];
      // this.statusPieChartData[1].data = [];
      // this.statusPieChartLabels = Object.keys(
      //   this.dctReportData.branch_service_brand_status[
      //     this.selectedOptionBranch
      //   ][this.selectedOptionService][this.selectedOption]
      // );
      // this.statusPieChartData[0].data = Object.keys(
      //   this.dctReportData.branch_service_brand_status[
      //     this.selectedOptionBranch
      //   ][this.selectedOptionService][this.selectedOption]
      // ).map(
      //   key =>
      //     this.dctReportData.branch_service_brand_status[
      //       this.selectedOptionBranch
      //     ][this.selectedOptionService][this.selectedOption][key]['Enquiry']
      // );
      // this.statusPieChartData[1].data = Object.keys(
      //   this.dctReportData.branch_service_brand_status[
      //     this.selectedOptionBranch
      //   ][this.selectedOptionService][this.selectedOption]
      // ).map(
      //   key =>
      //     this.dctReportData.branch_service_brand_status[
      //       this.selectedOptionBranch
      //     ][this.selectedOptionService][this.selectedOption][key]['Sale']
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartLabels = Object.assign(
      //       [],
      //       this.statusPieChartLabels
      //     ))
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartData[0].data = Object.assign(
      //       [],
      //       this.statusPieChartData[0].data
      //     ))
      // );
      // setTimeout(
      //   () =>
      //     (this.statusPieChartData[1].data = Object.assign(
      //       [],
      //       this.statusPieChartData[1].data
      //     ))
      // );

      this.itemPieOptions.title.text = this.selectedOption;
      this.pieStatusOptions.title.text = this.selectedOption;
    }
  }

  public itemPieChartClicked(e: any): void {
    if (this.selectedOptionBrand === '') {
      this.selectedOptionBrand = this.initBrand;
      this.tempBrandIndex=this.brandCurrentIndex;
      // this.snotifyService.error('Select brand before item');
    } else if (e.active.length > 0) {
      this.tempItemIndex=this.itemCurrentIndex;

      this.selectedOption = this.itemPieChartLabelsCopy[e.active[0]._index];
      this.selectedOptionItem = this.selectedOption;
      this.expJsondata['item']=this.selectedOption;
      // assign data to statuswise
      this.statusPieChartLabels = [];
      this.statusPieChartData[0].data = [];
      this.statusPieChartData[1].data = [];
      this.statusPieChartLabels = Object.keys(
        this.dctReportData.branch_service_brand_item_status[
          this.selectedOptionBranch
        ][this.selectedOptionService][this.selectedOptionBrand][
          this.selectedOption
        ]
      );
      this.statusPieChartData[0].data = Object.keys(
        this.dctReportData.branch_service_brand_item_status[
          this.selectedOptionBranch
        ][this.selectedOptionService][this.selectedOptionBrand][
          this.selectedOption
        ]
      ).map(
        key =>
          this.dctReportData.branch_service_brand_item_status[
            this.selectedOptionBranch
          ][this.selectedOptionService][this.selectedOptionBrand][
            this.selectedOption
          ][key]['Enquiry']
      );
      this.statusPieChartData[1].data = Object.keys(
        this.dctReportData.branch_service_brand_item_status[
          this.selectedOptionBranch
        ][this.selectedOptionService][this.selectedOptionBrand][
          this.selectedOption
        ]
      ).map(
        key =>
          this.dctReportData.branch_service_brand_item_status[
            this.selectedOptionBranch
          ][this.selectedOptionService][this.selectedOptionBrand][
            this.selectedOption
          ][key]['Sale']
      );
      setTimeout(
        () =>
          (this.statusPieChartLabels = Object.assign(
            [],
            this.statusPieChartLabels
          ))
      );
      setTimeout(
        () =>
          (this.statusPieChartData[0].data = Object.assign(
            [],
            this.statusPieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.statusPieChartData[1].data = Object.assign(
            [],
            this.statusPieChartData[1].data
          ))
      );

      this.pieStatusOptions.title.text = this.selectedOption;
    }
  }
  moveBar(type: string, direction: string) {
    if (type === 'brand') {``
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
        this.selectedOptionBranch === '' &&
        this.selectedOptionService === '' &&
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
        this.brandPieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        );
        this.brandPieChartLabelsCopy = this.brandPieChartLabels;
        this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.brandPieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Enquiry']
        );
        this.brandPieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']
        );
      } else if (
        this.selectedOptionService === '' &&
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
        this.brandPieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        );
        this.brandPieChartLabelsCopy = this.brandPieChartLabels;
        this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.brandPieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Enquiry']
        );
        this.brandPieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']
        );
      } else  {
        this.brandPieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex]
        );
        this.brandPieChartLabelsCopy = this.brandPieChartLabels;
        this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.brandPieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex][key]['Enquiry']
        );
        this.brandPieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex][key]['Sale']
        );
      } 
      // else if (this.selectedOptionItem === '') {
      //   this.brandPieChartLabels = Object.keys(
      //     this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][this.selectedOptionService]['BRANDS'][this.brandCurrentIndex]
      //   );
      //   this.brandPieChartLabelsCopy = this.brandPieChartLabels;
      //   this.brandPieChartLabels = this.brandPieChartLabels.map(obj => {
      //     if (obj.length > 6) {
      //       obj = obj.slice(0, 5) + '..';
      //     }
      //     return obj;
      //   });
      //   this.brandPieChartData[0].data = Object.keys(
      //     this.dctReportData.branch_service_brand[this.selectedOptionBranch][this.selectedOption][this.brandCurrentIndex]
      //   ).map(
      //     key =>
      //       this.dctReportData.branch_service_brand[this.selectedOptionBranch][this.selectedOption][this.brandCurrentIndex][key]['Enquiry']
      //   );
      //   this.brandPieChartData[1].data = Object.keys(
      //     this.dctReportData.branch_service_brand[this.selectedOptionBranch][this.selectedOption][this.brandCurrentIndex]
      //   ).map(
      //     key =>
      //       this.dctReportData.branch_service_brand[this.selectedOptionBranch][this.selectedOption][this.brandCurrentIndex][key]['Sale']
      //   );
      // }

      setTimeout(
        () =>
          (this.brandPieChartLabels = Object.assign(
            [],
            this.brandPieChartLabels
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartData[0].data = Object.assign(
            [],
            this.brandPieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.brandPieChartData[1].data = Object.assign(
            [],
            this.brandPieChartData[1].data
          ))
      );
    } else if (type === 'service') {
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
      if (
        this.selectedOptionBranch === '' &&
        this.selectedOptionService === '' &&
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
        this.servicePieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][this.serviceCurrentIndex]
        );
        this.servicePieChartLabelsCopy = this.servicePieChartLabels;
        this.servicePieChartLabels = this.servicePieChartLabels.map(obj => {
          obj = this.titlecasePipe.transform(obj);
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.servicePieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][this.serviceCurrentIndex]
        ).map(key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][this.serviceCurrentIndex][key]['Enquiry']);
        this.servicePieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][this.serviceCurrentIndex]
        ).map(key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][this.serviceCurrentIndex][key]['Sale']);
      } else {
        this.servicePieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex]
          );
        this.servicePieChartLabelsCopy = this.servicePieChartLabels;
        this.servicePieChartLabels = this.servicePieChartLabels.map(obj => {
          obj = this.titlecasePipe.transform(obj);
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.servicePieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][key]['Enquiry']
          );
        this.servicePieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.serviceCurrentIndex][key]['Sale']
          );
      }

      setTimeout(
        () => (this.servicePieChartLabels = Object.assign([], this.servicePieChartLabels))
      );
      setTimeout(
        () =>
          (this.servicePieChartData[0].data = Object.assign(
            [],
            this.servicePieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.servicePieChartData[1].data = Object.assign(
            [],
            this.servicePieChartData[1].data
          ))
      );
    } else if (type === 'branch') {
      
      if (direction === 'left') {
        if (this.branchCurrentIndex > 1) {
          this.branchCurrentIndex -= 1;
        } else {
          this.branchCurrentIndex = this.branchMaxIndex;
        }
      } else {
        if (this.branchCurrentIndex < this.branchMaxIndex) {
          this.branchCurrentIndex += 1;
        } else {
          this.branchCurrentIndex = 1;
        }
      }
      this.currentPage=this.branchCurrentIndex;
      // if (
      // this.selectedOptionBranch === '' &&
      // this.selectedOptionService === '' &&
      // this.selectedOptionBrand === '' &&
      // this.selectedOptionItem === ''
      // ) {
      this.barChartLabels = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]
              );
      this.barChartLabelsCopy = this.barChartLabels;
      this.barChartLabels = this.barChartLabels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });
      this.barChartData[0].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][key]['Enquiry']
      );
      this.barChartData[1].data = Object.keys(
        this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]
      ).map(
        key =>
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][key]['Sale']
      );

      // }

      setTimeout(
        () => (this.barChartLabels = Object.assign([], this.barChartLabels))
      );
      setTimeout(
        () =>
          (this.barChartData[0].data = Object.assign(
            [],
            this.barChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.barChartData[1].data = Object.assign(
            [],
            this.barChartData[1].data
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
        this.selectedOptionBranch === '' &&
        this.selectedOptionService === '' &&
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
        this.itemPieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemPieChartLabelsCopy = this.itemPieChartLabels;
        this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemPieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
        );
        this.itemPieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
        );
      } else if (
        this.selectedOptionService === '' &&
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
        this.itemPieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemPieChartLabelsCopy = this.itemPieChartLabels;
        this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemPieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
        );
        this.itemPieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
        );
      } else if (
        this.selectedOptionBrand === '' &&
        this.selectedOptionItem === ''
      ) {
        this.itemPieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemPieChartLabelsCopy = this.itemPieChartLabels;
        this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemPieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
        );
        this.itemPieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
        );
      } else if (this.selectedOptionItem === '') {
        this.itemPieChartLabels = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemPieChartLabelsCopy = this.itemPieChartLabels;
        this.itemPieChartLabels = this.itemPieChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemPieChartData[0].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
        );
        this.itemPieChartData[1].data = Object.keys(
          this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
        );
      }

      setTimeout(
        () =>
          (this.itemPieChartLabels = Object.assign([], this.itemPieChartLabels))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[0].data = Object.assign(
            [],
            this.itemPieChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.itemPieChartData[1].data = Object.assign(
            [],
            this.itemPieChartData[1].data
          ))
      );
    }
  }

  addStatus(event) {
    if (this.statusSelected.filter(x => x.id === event.id).length === 0) {
      this.statusSelected.push(event);
    }
    this.branchName = '';
    this.idBranch.nativeElement.value = '';
  }
  removeStatus(value) {
    const index = this.statusSelected.indexOf(value);
    if (index > -1) {
      this.statusSelected.splice(index, 1);
    }
  }

  goodOnClick() {
    this.blnGood = false;
    this.blnPoor = true;
    this.blnActive = true;
    this.strGoodPoor='GOOD';
    this.currentPage=1;
    const dct_data = this.swap(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM, false);
    this.dctReportData.BRANCH_SERVICE_BRAND_ITEM = dct_data;
    this.branchCurrentIndex = 1;
    this.barChartLabels = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]);
    this.barChartLabelsCopy = this.barChartLabels;

    this.barChartLabels = this.barChartLabels.map(obj => {
      if (obj.length > 5) {
        obj = obj.slice(0, 5) + "..";
      }
      return obj;
    });
    this.barChartData[0].data = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]).map(key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][key]["Enquiry"]);
    this.barChartData[1].data = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]).map(key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][key]["Sale"]);
    // this.shuffleMulti(this.barChartLabels, this.barChartData[0].data, this.barChartLabelsCopy);

    setTimeout(() => (this.barChartLabels = Object.assign([], this.barChartLabels)));
    setTimeout(() => (this.barChartData[0].data = Object.assign([], this.barChartData[0].data)));
    setTimeout(() => (this.barChartData[1].data = Object.assign([], this.barChartData[1].data)));

  }

  closePopup(){
    this.showPopup=false;
    }

  poorOnClick() {
    this.blnGood = true;
    this.blnPoor = false;
    this.blnActive = false;
    this.strGoodPoor='POOR';
    this.currentPage=1;
    const dct_data = this.swap(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM, true);
    this.dctReportData.BRANCH_SERVICE_BRAND_ITEM = dct_data;
    this.branchCurrentIndex = 1;
    this.barChartLabels = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]);
    this.barChartLabelsCopy = this.barChartLabels;

    this.barChartLabels = this.barChartLabels.map(obj => {
      if (obj.length > 5) {
        obj = obj.slice(0, 5) + "..";
      }
      return obj;
    });
    this.barChartData[0].data = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]).map(key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][key]["Enquiry"]);
    this.barChartData[1].data = Object.keys(this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex]).map(key => this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.branchCurrentIndex][key]["Sale"]);
    // this.shuffleMulti(this.barChartLabels, this.barChartData[0].data, this.barChartLabelsCopy);

    setTimeout(() => (this.barChartLabels = Object.assign([], this.barChartLabels)));
    setTimeout(() => (this.barChartData[0].data = Object.assign([], this.barChartData[0].data)));
    setTimeout(() => (this.barChartData[1].data = Object.assign([], this.barChartData[1].data)));

  }

  swap(lst_data, reverse) {
    const keys = Object.keys(lst_data);
    const len = keys.length - 1;
    const data_dict = [];
    for (let i = len; i > -1; i--) {
      for (const data of Object.keys(lst_data[keys[i]])) {
        const temp = [];
        temp[0] = data;
        temp[1] = lst_data[keys[i]][data];
        data_dict.push(temp);
      }
    }
    if (reverse) {
      data_dict.sort((n1, n2) => {
        return n1[1]['Sale'] < n2[1]['Sale'] ? -1 : 1;
      });
    } else {
      data_dict.sort((n1, n2) => {
        return n1[1]['Sale'] > n2[1]['Sale'] ? -1 : 1;
      });
    }
    const out_dict = {};
    for (let i = 0; i <= len; i++) {
      const temp_data = data_dict.splice(0, 10);
      out_dict[keys[i]] = {};
      for (const data of temp_data) {
        const temp = {};
        temp[data[0]] = data[1];
        out_dict[keys[i]] = Object.assign(out_dict[keys[i]], temp);
      }
    }
    return out_dict;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  showPopupData(modal,chartHead){
  
    
    this.showPopup=true;
    let   dctTempData: any = [];
    let dctTable={};
    let lstData=[];
    this.grandTotal=0;
    this.chartHead=chartHead;
  
    if(chartHead=='Branch'){
      
      this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM;
      
      this.valueIteration(modal,this.dctTempData);   
    }
    else if(chartHead=='Product'){
  
       if(this.selectedOptionBranch==''){
          this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'];
          this.valueIteration(modal,this.dctTempData);
       }
       else{
        this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'];
        this.valueIteration(modal,this.dctTempData);
       }       
  
    }
    else if(chartHead=='Brand'){ 
  
       if(this.selectedOptionBranch==''&&this.selectedOptionService==''){  
          this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'];
          this.valueIteration(modal,this.dctTempData);
       }
      else if(this.selectedOptionBranch!=''&&this.selectedOptionService==''){  
        this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'];
        this.valueIteration(modal,this.dctTempData);
      }
      else if(this.selectedOptionBranch!=''&&this.selectedOptionService!=''){  
        this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'];
        this.valueIteration(modal,this.dctTempData);
      } 
    
  
   }
    else if(chartHead=='Item'){
      if(this.selectedOptionBranch==''&&this.selectedOptionService==''&&this.selectedOptionBrand==''){  
        this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[1][this.initBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'];
        this.valueIteration(modal,this.dctTempData);
      }
      else if(this.selectedOptionBranch!=''&&this.selectedOptionService==''&&this.selectedOptionBrand==''){  
        this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'];
        this.valueIteration(modal,this.dctTempData);
      }
      else if(this.selectedOptionBranch!=''&&this.selectedOptionService!=''&&this.selectedOptionBrand==''){  
        this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][1][this.initBrand]['ITEMS'];
        this.valueIteration(modal,this.dctTempData);
      } 
      else if(this.selectedOptionBranch!=''&&this.selectedOptionService!=''&&this.selectedOptionBrand!=''){  
        this.dctTempData=this.dctReportData.BRANCH_SERVICE_BRAND_ITEM[this.tempBranchIndex][this.selectedOptionBranch]['SERVICE'][this.tempProductIndex][this.selectedOptionService]['BRANDS'][this.tempBrandIndex][this.selectedOptionBrand]['ITEMS'];
        this.valueIteration(modal,this.dctTempData);
      }
     
    }
  
    this.chartHead=chartHead;
    this.scrollToBottom();
    
  }

//   scrollToBottom(): void {
//     try {
//         this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
//     } catch(err) { }                 
// }
   
 scrollToBottom() {
  const el: HTMLDivElement = this._el.nativeElement;
  el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
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
          // if(this.chartHead=='Staff'){
          //   dctTable['Name']=this.dctReportData.staffs[key2];
          // } 
          // else{
            dctTable['Name']=key2; 
          // }
           
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
  
          if(saleQty==0){
            dctTable['ContribQty_per']=0;
          }
          else{
          dctTable['ContribQty_per']=((saleQty/this.saleQtyTot)*100).toFixed(2);
          }
  
          

           lstData.push(dctTable);
           dctTable={};
        }
       
       
      }

      
  
      this.dataSource1= new MatTableDataSource(lstData);
      this.modalService.open(modal,{windowClass:'exportModal'})
      this.PaginationSort();
      
  }

  changeBranchChart(){ //change to bar chart or pie chart

    if(this.blnBranchChartType){
      this.blnBranchChartType=false;
    }
    else{
      this.blnBranchChartType=true;
    }
  }
  changeProductChart(){ //change to bar chart or pie chart

    if(this.blnProductChartType){
      this.blnProductChartType=false;
    }
    else{
      this.blnProductChartType=true;
    }
  }
  changeBrandChart(){ //change to bar chart or pie chart

    if(this.blnBrandChartType){
      this.blnBrandChartType=false;
    }
    else{
      this.blnBrandChartType=true;
    }
  }
  changeItemChart(){ //change to bar chart or pie chart

    if(this.blnItemChartType){
      this.blnItemChartType=false;
    }
    else{
      this.blnItemChartType=true;
    }
  }
  
  

  exportAsXLSX(chartHead: any): void {
    let   dctTempData: any = [];
    this.chartHead=chartHead;
    this.expJsondata['component']='Branch_report';
    // this.expJsondata['sortname']=this.sort.active;
    // this.expJsondata['sortdirection']=this.sort.direction;
    
  
    if(chartHead=='Branch'){
      console.log("1111charthead",this.chartHead);

      
      this.expJsondata['charthead']='Branch';
      // dctTempData=this.dctReportData[this.branchChartKey];
      this.reportComponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);
    }
    else if(chartHead=='Product'){

        
        this.expJsondata['charthead']='Product'
        // if (this.productChartKey=='service_all'){
        // dctTempData=this.dctReportData[this.productChartKey];
        this.reportComponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);

        // }
       
        // else if(this.productChartKey=='branch_service'){
        //   dctTempData=this.dctReportData[this.productChartKey][this.selectBranch];
        //   this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
        // }
  
  
    }
    else if(chartHead=='Brand'){ 
  
      this.expJsondata['charthead']='Brand'
  
        // if (this.brandChartKey=='brand_all'){
        //   dctTempData=this.dctReportData[this.brandChartKey];
        //   this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
        // }
          
        //   else if(this.brandChartKey=='branch_brand'){
  
        //     dctTempData=this.dctReportData[this.brandChartKey][this.selectBranch];
            this.reportComponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);
  
        
      // }
      
      // else if(this.brandChartKey=='branch_service_brand'){
  
      //       dctTempData=this.dctReportData[this.brandChartKey][this.selectBranch][this.selectProduct];
      //       this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
  
      // }
  
   }
    else if(chartHead=='Item'){

      this.expJsondata['charthead']='Item'
      // if (this.itemChartKey=='item_all'){
      //   dctTempData=this.dctReportData[this.itemChartKey];
      //   this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
      // }
        
      //   else if(this.itemChartKey=='branch_item'){
  
      //     dctTempData=this.dctReportData[this.itemChartKey][this.selectBranch];
      //     this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
      //   }
      //   else if(this.itemChartKey=='branch_service_item'){
  
      //     dctTempData=this.dctReportData[this.itemChartKey][this.selectBranch][this.selectProduct];
      //     this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
  
      //   }
  
      //   else if(this.itemChartKey=='branch_service_brand_item'){
          
  
      //     dctTempData=this.dctReportData[this.itemChartKey][this.selectBranch][this.selectProduct][this.selectBrand];
          this.reportComponent.valueIterationExp(this.dctTempData,this.dctReportData,this.expJsondata);
  
        // }
  
    }
  
    this.chartHead=chartHead;
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
  
    // if(this.staffName){
    //   dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + this.staffName;
    // }
    let branches = ''
    if(this.statusSelected.length>0){
      this.statusSelected.forEach(element => {
        branches =  branches + " " + element.name;   
      });
      dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + branches;
    }
    // if(this.brandName!=''){
    //   dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + this.brandName;
    // }
   
    // if(this.product!=''){
    //   dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " +this.product;
    // }
  
    // statusSelected
    
    this.serverService.postData("download_log/",dctDownloadLog)
    .subscribe(
      (response) => {
        // this.spinnerService.hide();
        this.showSpinner=false;

          if (response['status'] === 1) {
        

          // var a = document.createElement('a');
          // document.body.appendChild(a);
          // a.href = response['file'];
          // a.download = 'report.xlsx';
          // a.click();
          // window.URL.revokeObjectURL(this.dctReportData);
          // a.remove();

          // this.snotifyService.success('Successfully Exported');   
          // this.blnExported = true;
          

          // this.table=false;
          // this.chart=false;
        
        } else {
        // this.snotifyService.error('No data found');
       }
      },
      (error) => {
        // this.spinnerService.hide();
        this.showSpinner=false;

      });
  }
}

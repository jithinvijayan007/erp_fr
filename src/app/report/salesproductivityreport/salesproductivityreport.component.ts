import { debounceTime } from 'rxjs/operators';
import { ServiceinvoicelistComponent } from './../../invoice/serviceinvoicelist/serviceinvoicelist.component';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Input,ViewContainerRef } from '@angular/core';
import { SharedService } from '../../layouts/shared-service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/server.service';
import { MatTableDataSource} from '@angular/material/table';
import {  MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
// import { SnotifyService } from 'ng-snotify';
import { TypeaheadService } from '../../typeahead.service';
import { log } from 'util';
import { BaseChartDirective } from 'ng2-charts/charts/charts';
import { TitleCasePipe } from '@angular/common';
import { ChartService } from 'src/app/chart.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ReportComponent } from '../report.component';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-salesproductivityreport',
  templateUrl: './salesproductivityreport.component.html',
  styleUrls: ['./salesproductivityreport.component.scss']
})
export class SalesproductivityreportComponent implements OnInit {

  // selected: {startDate: '2021-02-11', endDate: '2021-02-11'};
  // ranges: any = {
  //   'Today': [moment(), moment()],
  //   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  //   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  //   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  //   'This Month': [moment().startOf('month'), moment().endOf('month')],
  //   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  // }

  @Input('show-modal') showModal: boolean;
  @Input('show-modal2') showModal2: boolean;


  currentUserName = localStorage.getItem('username');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner=false;


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
  brandChartKey;
  itemChartKey;
  staffChartKey;
  selectStaff;
  selectProduct;
  selectBrand;
  selectItem;
  grandTotal;
  saleQtyTot;
  enqQtyTot;
  enqValTot;

  expJsondata=[];
  lstPermission = JSON.parse(localStorage.getItem("group_permissions"));
  blnAdd = true;
  blnView = true;
  blnEdit = true;
  blnDelete = true;
  blnDownload = true;
  // ng models used
  validationStatus=true;
  datFromDate;
  datToDate;
  datFromSaved;
  datToSaved;
  blnDataLoaded = false;
  selectedOption;
  blnAll = true;
  blnActive = true;
  nodata=[]
  blnGood = true;
  blnPoor = true;

  strGoodPoor='NORMAL';
  currentPage=1;

  blnChartType=true;
  blnStaffChartType= true;
  blnBrandChartType= true;
  blnItemChartType = true;
  
  selectedFromDate;
  selectedToDate;
  chart=false;
  table=false;
  email;
  chatName;
  @ViewChild('idStaff') idStaff: ElementRef;
  staffSelected = [];
  lstStaffes = [];
  searchStaff: FormControl = new FormControl();
  staffCode = '';
  staffName = '';
  selectedStaff = [];
  staffId: number;

  @ViewChild('idPromoter') idPromoter: ElementRef;
  promoterSelected = [];
  lstPromoters = [];
  searchPromoter: FormControl = new FormControl();
  promoterCode = '';
  promoterName = '';
  selectedPromoter = [];
  promoterId: number;

  // Table data
  blnChecked = false;
  displayedColumns = [];
  dataSource = new MatTableDataSource()

  export:boolean=true;
  emailExport:boolean=true;
  chatExport:boolean=true;

  @ViewChildren(BaseChartDirective) myChart: QueryList<BaseChartDirective>;

  promoter;
  lstBranches = [];
  searchBranch: FormControl = new FormControl();
  branchCode = '';
  branchName = '';
  selectedBranch = '';
  branchId: number;

  lstBrands = [];
  searchBrand: FormControl = new FormControl();
  brandName = '';
  selectedBrand = '';
  brandId: number;

  lstItems = [];
  searchItem: FormControl = new FormControl();
  itemCode = '';
  itemName = '';
  selectedItem = '';
  itemId: number;

  blnExported = false;
  strUrl = '';
  dctJsonData1 = {}


  initAssignee = '';
  initBrand = ''
  initItem = '';
  initProduct = '';


  pageTitle = 'Bar Chart';
  public form: FormGroup;
  dctReportData: any = [];
  datToDateMin;
    
  public productPieChartType = 'pie';
  public pieChartColors: Array<any> = this.chartservice.pieChartColors;

  clickedStaffIndex;
  clickedProductIndex;
  clickedBrandIndex;



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


   // salebar chart colors
   public barSalesChartColor: Array<any> = this.chartservice.barSalesChartColor;
   public barChartColors: Array<any> = [
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

  barChartLabels = [];
  barChartLabels2 = [];
  barChartLabels1 = [];
  productBarChartLabels = [];
  productBarChartLabels1 = [];
  brandBarChartLabels = [];
  brandBarChartLabels1 = [];
  itemBarChartLabels = [];
  barChartLabelsCopy = [];
  productBarChartLabelsCopy = [];
  brandBarChartLabelsCopy = [];
  itemBarChartLabelsCopy = [];
  public barChartLegend = true;

  public barChartType = 'bar';
  public barChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public productBarChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public productBarChartData1: any[] = [
    // { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public brandBarChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public brandBarChartData1: any[] = [
    // { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];
  public itemBarChartData: any[] = [
    { data: [], label: 'Enquiry' },
    { data: [], label: 'Sales' }
  ];

  lstProducts = [];
  product = '';
  searchProduct: FormControl = new FormControl();
  // brandName = '';
  selectedProduct = '';
  productId: number;
  promoterType;

  public barChartOptions: any = {
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
          return this.barChartLabelsCopy[Number(ind)];
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.barChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex == 1) {
            return 'Sales:' + temp[ind];
          }
          else {
            return 'Enquiry:' + temp[ind];
          }
          // return this.subcategoryOriginalLabels[Number(ind)] + ':' + temp[ind];
        }
      }
    },
    // legend: {
    //   display: true,
    //   fullWidth: false,
    //   labels: {
    //     boxWidth: 10,
    //   },
    //   position: 'top',
    //   onClick: (e, legendItem) => {
    //     // this.myChart.ngOnChanges({});
    //     const index = legendItem.datasetIndex;
    //     const ci = this.myChart.first.chart;
    //     const meta = ci.getDatasetMeta(index);
    //     // See controller.isDatasetVisible comment
    //     meta.hidden =
    //       meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    //     // We hid a dataset ... rerender the chart
    //     ci.update();
    //   }
    // }
    legend: { display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top', }


  };
  public productBarChartOptions: any = {
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
          if (this.product) {
            return this.product;
          }
          else{
            return this.productBarChartLabelsCopy[Number(ind)];
          }
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.productBarChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex == 1) {
            return 'Sales:' + temp[ind];
          }
          else {
            return 'Enquiry:' + temp[ind];
          }
          // return this.subcategoryOriginalLabels[Number(ind)] + ':' + temp[ind];
        }
      }
    },
    // legend: {
    //   display: true,
    //   fullWidth: false,
    //   labels: {
    //     boxWidth: 10,
    //   },
    //   position: 'top',
    //   onClick: (e, legendItem) => {
    //     // this.myChart.ngOnChanges({});
    //     const index = legendItem.datasetIndex;
    //     const ci = this.myChart.first.chart;
    //     const meta = ci.getDatasetMeta(index);
    //     // See controller.isDatasetVisible comment
    //     meta.hidden =
    //       meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    //     // We hid a dataset ... rerender the chart
    //     ci.update();
    //   }
    // }
    
    legend: { display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top', }

  };
  public brandBarChartOptions: any = {
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
          if (this.brandName) {
            return this.brandName;
          }
          else{
            return this.brandBarChartLabelsCopy[Number(ind)];
          }

          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.brandBarChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex == 1) {
            return 'Sales:' + temp[ind];
          }
          else {
            return 'Enquiry:' + temp[ind];
          }
          // return this.subcategoryOriginalLabels[Number(ind)] + ':' + temp[ind];
        }
      }
    },
    // legend: {
    //   display: true,
    //   fullWidth: false,
    //   labels: {
    //     boxWidth: 10,
    //   },
    //   position: 'top',
    //   onClick: (e, legendItem) => {
    //     // this.myChart.ngOnChanges({});
    //     const index = legendItem.datasetIndex;
    //     const ci = this.myChart.first.chart;
    //     const meta = ci.getDatasetMeta(index);
    //     // See controller.isDatasetVisible comment
    //     meta.hidden =
    //       meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    //     // We hid a dataset ... rerender the chart
    //     ci.update();
    //   }
    // }
    legend: { display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top', }

  };
  public itemBarChartOptions: any = {
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
          return this.itemBarChartLabelsCopy[Number(ind)];
          // return false
        },
        label: q => {
          const datsetindex = q['datasetIndex'];
          const temp = this.itemBarChartData[datsetindex]['data'];
          const ind = q['index'];
          if (datsetindex == 1) {
            return 'Sales:' + temp[ind];
          }
          else {
            return 'Enquiry:' + temp[ind];
          }
          // return this.subcategoryOriginalLabels[Number(ind)] + ':' + temp[ind];
        }
      }
    },
    // legend: {
    //   display: true,
    //   fullWidth: false,
    //   labels: {
    //     boxWidth: 10,
    //   },
    //   position: 'top',
    //   onClick: (e, legendItem) => {
    //     // this.myChart.ngOnChanges({});
    //     const index = legendItem.datasetIndex;
    //     const ci = this.myChart.first.chart;
    //     const meta = ci.getDatasetMeta(index);
    //     // See controller.isDatasetVisible comment
    //     meta.hidden =
    //       meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    //     // We hid a dataset ... rerender the chart
    //     ci.update();
    //   }
    // }
    
    legend: { display: true,
      fullWidth: false,
      labels: {
        boxWidth: 10,},
      position: 'top', }


  };
  selectedOptionSource: any = '';
  selectedOptionProduct: any = '';
  selectedOptionBrand: any = '';

  itemCurrentIndex = 1;
  itemMaxIndex = 5;
  sourceCurrentIndex = 1;
  sourceMaxIndex = 5;
  productCurrentIndex = 1;
  productMaxIndex = 5;
  brandCurrentIndex = 1;
  brandMaxIndex = 5;

  blnFilterOn = false;

  // lstProducts = [];
  // product = '';
  type = false

  constructor(
    private serverService: ServerService,
    private _sharedService: SharedService,
    private typeaheadObject: TypeaheadService,
    public router: Router,
    private titlecasePipe: TitleCasePipe,
    // private snotifyService: SnotifyService,
    private fb: FormBuilder,
    private chartservice: ChartService,
    // private spinnerService: NgxSpinnerService,
    // public toastr: ToastsManager,
    private reportComponent: ReportComponent,
    private modalService: NgbModal, 

    vcr: ViewContainerRef) 
             
    {
     
    // this.toastr.setRootViewContainerRef(vcr);
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.promoterType=false;
    this.promoter='staff';
    this.strUrl = window.location.href.split('#')[1];
    this.blnExported = false;
    this.lstPermission.forEach((item, index, array) => {
      if (item["NAME"] == "PRODUCTIVITY REPORT" &&  item["PARENT"] == "SALES REPORTS") {
        this.blnAdd = item["ADD"];
        this.blnView = item["VIEW"];
        this.blnEdit = item["EDIT"];
        this.blnDelete = item["DELETE"];
        this.blnDownload = item["DOWNLOAD"];
      }
    });

    this.listColor();
    // this.chartservice.listColor();
    if (!localStorage.getItem('Tokeniser')) {
      this.router.navigate(['/user/sign-in']);
    }
    this.form = this.fb.group({
      fdate: [null, Validators.compose([Validators.required])],
      tdate: [null, Validators.compose([Validators.required])]
    });

    this.datFromDate = moment(new Date(this.datFromDate)).format('YYYY-MM-DD');
    this.datToDate = moment(new Date(this.datToDate)).format('YYYY-MM-DD');
    this.showDatewiseData(this.datFromDate, this.datToDate);

    this.searchBrand.valueChanges
      .pipe(debounceTime(400))
      .subscribe((data: string) => {
        if (data === undefined) {
        } else {
          if (data.length > 1) {
            this.lstBrands = [];
            this.typeaheadObject
              .searchBrand(data,this.productId)
              .subscribe(
              (response: {
                status: string;
                data: Array<{
                  account: string;
                  accountId: number;
                }>;
              }) => {
                this.lstBrands.push(...response.data);
  
              }
              );
          } else{
            this.lstBrands = [];
          }
        }
      });
  
  
      this.searchProduct.valueChanges
      .pipe(debounceTime(400))
      .subscribe((data: string) => {
        if (data === undefined) {
        } else {
          if (data.length > 1) {
            this.lstProducts = [];
            this.typeaheadObject
              .searchProduct(data)
              .subscribe(
              (response: {
                status: string;
                data: Array<{
                  account: string;
                  accountId: number;
                }>;
              }) => {
                this.lstProducts.push(...response.data);
  
              }
              );
          } else{
            this.lstProducts = [];
          }
        }
      });

      this.searchItem.valueChanges
      .pipe(debounceTime(400))
      .subscribe((data: string) => {
        if (data === undefined) {
        } else {
          if (data.length > 1) {
            this.lstItems = [];
            this.typeaheadObject
              .searchItem(data)
              .subscribe(
              (response: {
                status: string;
                data: Array<{
                  account: string;
                  accountId: number;
                  accountCode: string;
                }>;
              }) => {
                this.lstItems.push(...response.data);

              }
              );
          } else{
            this.lstItems = [];
          }
        }
      });

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
          } else{
            this.lstBranches = [];
          }
        }
      });
    this.searchStaff.valueChanges
      .pipe(debounceTime(400))
      .subscribe((data: string) => {
        if (data === undefined) {
        } else {
          if (data.length > 2) {
            this.lstStaffes = [];
            this.typeaheadObject
              .searchStaff(data)
              .subscribe(
              (response: {
                status: string;
                data: Array<{
                  staff: string;
                  staffId: number;
                }>;
              }) => {
                this.lstStaffes.push(...response.data);

              }
              );
          } else{
            this.lstStaffes = [];
          }
        }
      });

      this.searchPromoter.valueChanges
      .pipe(debounceTime(400))
      .subscribe((data: string) => {
        if (data === undefined) {
        } else {
          if (data.length > 2) {
            this.lstPromoters = [];
            this.typeaheadObject
              .search_brand(data)
              .subscribe(
              (response: {
                status: string;
                data: Array<{
                  Promoter: string;
                  PromoterId: number;
                }>;
              }) => {
                this.lstPromoters.push(...response.data);

              }
              );
          } else{
            this.lstPromoters = [];
          }
        }
      });

      this.lstProducts = [{'value':'','Viewvalue':'All'},
                          {'value':'Mobile','Viewvalue':'Mobile'},
                          {'value':'Computer','Viewvalue':'Computer'},
                          {'value':'Tablet','Viewvalue':'Tablet'},
                          {'value':'Accessories','Viewvalue':'Accessories'}]

    }

  lstData=[];
  promoterColor='#09a32d';
  resignedColor='#d62020';
  enquiryColor='#0d8ec1';
  saleColor='#77a7fb';
  listColor(){
    this.serverService.getData("adminsettings/save_settings_api/").subscribe(
      result => {
        if(result['data'])
        this.lstData = result['data'];
        for(let item of this.lstData){
          // if(item['vchr_value'][0]!=""){

            if(item['bln_enabled']){
              if(item['vchr_value'][0]!=null && item['vchr_code']=="SALES_COLOUR"){

                this.saleColor=item['vchr_value'][0];
  
                for(let key of Object.keys(this.barChartColors[1]))
                {
                  this.barChartColors[1][key]=item['vchr_value'][0];  
                }
  
              }
              else if(item['vchr_value'][0]==null && item['vchr_code']=="SALES_COLOUR"){
                this.saleColor='#77a7fb';
                for(let key of Object.keys(this.barChartColors[1]))
                {
                  this.barChartColors[1][key]=this.saleColor;  
                }
              }
            }
            else if(!item['bln_enabled'] && item['vchr_code']=="SALES_COLOUR"){
              this.saleColor='#77a7fb';
              for(let key of Object.keys(this.barChartColors[1]))
              {
                this.barChartColors[1][key]=this.saleColor;  
              }
            }
          

            if(item['bln_enabled']){
              if(item['vchr_value'][0]!=null && item['vchr_code']=="PROMOTER_COLOR"){
                this.promoterColor=item['vchr_value'][0];
                
              }
              else if(item['vchr_value'][0]==null && item['vchr_code']=="PROMOTER_COLOR"){
                this.promoterColor='#09a32d';
              }
  
            }
            else if(!item['bln_enabled'] && item['vchr_code']=="PROMOTER_COLOR"){
              this.promoterColor='#09a32d';
            }
          

            if(item['bln_enabled']){
              if(item['vchr_value'][0]!=null && item['vchr_code']=="RESIGNED_COLOR"){
                this.resignedColor=item['vchr_value'][0];
              }
              else if(item['vchr_value'][0]==null && item['vchr_code']=="RESIGNED_COLOR"){
                this.resignedColor='#d62020';
              }
            }
            else if(!item['bln_enabled'] && item['vchr_code']=="RESIGNED_COLOR"){
              this.resignedColor='#d62020';
            }

           

        if(item['bln_enabled']){
          if(item['vchr_value'][0]!=null && item['vchr_code']=="ENQUIRY_COLOUR"){

            this.enquiryColor=item['vchr_value'][0];


            for(let key of Object.keys(this.barChartColors[0])){
              this.barChartColors[0][key]=item['vchr_value'][0];              
            }

            for(let key of Object.keys(this.barSalesChartColor[0])){
              this.barSalesChartColor[0][key]=item['vchr_value'][0]; 
            }

          }
          else if(item['vchr_value'][0]==null && item['vchr_code']=="ENQUIRY_COLOUR"){
            this.enquiryColor='#0d8ec1';

            for(let key of Object.keys(this.barChartColors[0])){
              this.barChartColors[0][key]=this.enquiryColor;              
            }

            for(let key of Object.keys(this.barSalesChartColor[0])){
              this.barSalesChartColor[0][key]=this.enquiryColor; 
            }
          }


        }
        else if(!item['bln_enabled'] && item['vchr_code']=="ENQUIRY_COLOUR"){
          this.enquiryColor='#0d8ec1';

          for(let key of Object.keys(this.barChartColors[0])){
            this.barChartColors[0][key]=this.enquiryColor;              
          }

          for(let key of Object.keys(this.barSalesChartColor[0])){
            this.barSalesChartColor[0][key]=this.enquiryColor; 
          }

        }

        
        }
       
      },
      error => {
        alert(error);
      }
    );
    console.log(this.promoterColor,'colorrr')
  }

  switchChange(){
    this.showDatewiseData(this.datFromDate, this.datToDate);
  }


  BranchChanged(item) {

    this.branchId = item.id;
    this.selectedBranch = item.name;
  }

  BrandChanged(item) {

    this.brandId = item.id;
    this.selectedBrand = item.name;
  }

  ItemChanged(item) {

    this.itemId = item.id;
    this.selectedItem = item.name;
  }

  productChanged(item) {

    this.productId = item.id;
    this.selectedProduct = item.name;
  }

  filterClick(){
    this.blnFilterOn = true;
  }
  filterClickOff(){
    this.blnFilterOn = false;
    if (this.product || this.brandId) {
      this.product = '';
      this.productId = null;
      this.selectedProduct = '';
    this.brandId = null;
    this.brandName = '';
    this.selectedBrand = '';
      // this.showDatewiseData(this.datFromDate, this.datToDate);
    }


  }

  showDatewiseData(fdate, tdate) {
    // let from = fdate._d;
    // let to = tdate._d;
    // fdate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
    // tdate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));
   
    this.datFromSaved = moment(new Date(fdate)).format('YYYY-MM-DD');
    this.datToSaved = moment(new Date(tdate)).format('YYYY-MM-DD');
    const dctJsonData = { username: this.currentUserName };
    dctJsonData['data'] = 'Custom';
    dctJsonData['date_from'] = this.datFromSaved;
    dctJsonData['date_to'] = this.datToSaved;
    dctJsonData['type'] = 'Sale';
    dctJsonData['show_type'] = this.type;
    dctJsonData['show_table'] = this.chartName;
    dctJsonData['status'] = 'BOOKED';

    this.expJsondata['tmpdfdate']=moment(new Date(fdate)).format('YYYY-MM-DD');
    this.expJsondata['tmpdtdate']=moment(new Date(tdate)).format('YYYY-MM-DD');
    this.expJsondata['brand']='ALL'
    this.expJsondata['branch']='ALL';
    this.expJsondata['product']='ALL';
    this.expJsondata['staff']='ALL';
    this.expJsondata['promoter']='ALL';

    if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
      Swal.fire('Error','Select a valid branch or clear the field','error');
      return false;
    } else if (this.branchName !== '') {
      dctJsonData['branch'] = this.branchId;
      this.expJsondata['branch']=this.branchName;
    }
    if (this.brandName !== undefined && this.brandName !== '' && this.selectedBrand !== this.brandName) {
      Swal.fire('Error','Select a valid brand or clear the field','error');
      return false;
    }else if (this.brandName !== '') {
      dctJsonData['brand'] = this.brandId;
      this.expJsondata['brand']=this.brandName;
    }
    //  if (this.itemName !== undefined && this.itemName !== '' && this.selectedItem !== this.itemName) {
    //   this.snotifyService.error('Select a valid item or clear the field');
    //   return false;
    // }else if (this.itemName !== '') {
    //   dctJsonData['item'] = this.itemId;
    // }
    if (this.product !== '') {
      dctJsonData['product'] = this.productId;
      this.expJsondata['product']=this.product;
    }else if (this.product !== undefined && this.product !== '' && this.selectedProduct !== this.product) {
      Swal.fire('Error','Select a valid product or clear the field','error');
      return false;
    }
    if (this.staffSelected.length > 0) {
      this.selectedStaff = this.staffSelected.map(x => x.id);
      dctJsonData['staffs'] = this.staffSelected;

      this.expJsondata['staff']='';
      for(let st of this.staffSelected){
        this.expJsondata['staff']=this.expJsondata['staff']+''+st.name;
      }
    }

    if(this.staffName!='' && this.staffName!=null){ // validation

      let tempLst=this.staffSelected.map(element=>{
        return element['name'];


      });
      // if(!tempLst.includes(this.staffName)){
      // Swal.fire('Error','Enter valid staff name');
      // return;
      // }
      
    }

    if (this.promoterSelected.length > 0) {
      this.selectedPromoter = this.promoterSelected.map(x => x.id);
      dctJsonData['promoters'] = this.promoterSelected;

      this.expJsondata['promoter']='';
      for(let pr of this.promoterSelected){
        this.expJsondata['promoter']=this.expJsondata['promoter']+''+pr.name;
      }
    }

    if(this.promoterName!='' && this.promoterName!=null){ // validation

      let tempLst=this.promoterSelected.map(element=>{
        return element['name'];


      });
      if(!tempLst.includes(this.promoterName)){
      Swal.fire('Error','Enter valid promoter name','error');
      return;
      }
      
    }

    // this.spinnerService.show();
    this.showSpinner=true;

    this.serverService
      .postData('productivityreport/mobile/',dctJsonData)
      .subscribe(
      response => {
        // this.spinnerService.hide();
        this.showSpinner=false;

        if (response['status'] == 1) {
          if(response['data']){  
          this.dctReportData = response['data'];
          // console.log(this.dctReportData,'data')
          this.nodata = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM)
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
        if (response['status'] === 0) {
          this.nodata = []
        }



      },
      error => {
        // this.spinnerService.hide();
        this.showSpinner=false;

      }
      );
  }

 
  PaginationSort() {
    
    // this.dataSource1.paginator = this.paginator;
    // this.dataSource1.paginator.firstPage();
    this.dataSource1.sort = this.sort;
  }


  exportPdfExcel(fdate, tdate){

    this.blnExported = false;
    localStorage.setItem('chartexport','');

    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
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
    this.datFromSaved = moment(new Date(this.datFromDate)).format('YYYY-MM-DD');
    this.datToSaved = moment(new Date(this.datToDate)).format('YYYY-MM-DD');
    const dctJsonData = { username: this.currentUserName };
    dctJsonData['data'] = 'Custom';
    dctJsonData['date_from'] = this.datFromSaved;
    dctJsonData['date_to'] = this.datToSaved;
    dctJsonData['type'] = 'Sale';
    dctJsonData['show_type'] = this.type;
    dctJsonData['status'] = 'BOOKED';
    dctJsonData['report_type']='productivity_report';
    dctJsonData['export_type'] = 'DOWNLOAD';
    dctJsonData['strGoodPoorClicked'] = this.strGoodPoor;
    dctJsonData['intCurrentPage'] = this.currentPage;
    if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
      Swal.fire('Error','Select a valid branch or clear the field','error');
      return false;
    } else if (this.branchName !== '') {
      dctJsonData['branch'] = this.branchId;
    }
    if (this.brandName !== undefined && this.brandName !== '' && this.selectedBrand !== this.brandName) {
      Swal.fire('Error','Select a valid brand or clear the field','error');
      return false;
    }else if (this.brandName !== '') {
      dctJsonData['brand'] = this.brandId;
    }
    
    if (this.product !== '') {
      dctJsonData['product'] = this.productId;
    }else if (this.product !== undefined && this.product !== '' && this.selectedProduct !== this.product) {
      Swal.fire('Error','Select a valid product or clear the field','error');
      return false;
    }
    if (this.staffSelected.length > 0) {
      this.selectedStaff = this.staffSelected.map(x => x.id);
      dctJsonData['staffs'] = this.staffSelected;
    }
    if (this.promoterSelected.length > 0) {
      this.selectedPromoter = this.promoterSelected.map(x => x.id);
      dctJsonData['promoters'] = this.promoterSelected;
    }


    this.showModal = false;
    dctJsonData['bln_chart'] = this.chart;
    dctJsonData['bln_table'] = this.table;

    // this.spinnerService.show();
    this.showSpinner=true;

      
      if(this.export){

        dctJsonData['document'] = 'excel';

        this.serverService.postData("enquiry_productivity_report_pdf/enq_productivity_pdf/",dctJsonData)
        .subscribe(
          (response) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] == 1) {
              

              var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = response['file'];
              a.download = 'report.xlsx';
              a.click();
              window.URL.revokeObjectURL(this.dctReportData);
              a.remove();

              Swal.fire('Success','Successfully Exported','success');   

              this.blnExported = true;
              this.downloadLog(dctJsonData)

              this.table=false;
              this.chart=false;
            
            } else {
            Swal.fire('Error','No data found','error');
           }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

      if(!this.export){
        dctJsonData['document'] = 'pdf';
        this.serverService.postData("enquiry_productivity_report_pdf/enq_productivity_pdf/",dctJsonData)
        .subscribe(
          (response) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

              if (response['status'] == 1) {
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


  exportWithEmail(fdate, tdate){

    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
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
    this.datFromSaved = moment(new Date(this.datFromDate)).format('YYYY-MM-DD');
    this.datToSaved = moment(new Date(this.datToDate)).format('YYYY-MM-DD');
    const dctJsonData = { username: this.currentUserName };
    dctJsonData['data'] = 'Custom';
    dctJsonData['date_from'] = this.datFromSaved;
    dctJsonData['date_to'] = this.datToSaved;
    dctJsonData['type'] = 'Sale';
    dctJsonData['show_type'] = this.type;
    dctJsonData['status'] = 'BOOKED';
    dctJsonData['report_type']='productivity_report';
    dctJsonData['export_type'] = 'MAIL';
    dctJsonData['strGoodPoorClicked'] = this.strGoodPoor;
    dctJsonData['intCurrentPage'] = this.currentPage;
    if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
      // this.snotifyService.error('Select a valid branch or clear the field');
      Swal.fire('Error','Select a valid branch or clear the field','error')

      return false;
    } else if (this.branchName !== '') {
      dctJsonData['branch'] = this.branchId;
    }
    if (this.brandName !== undefined && this.brandName !== '' && this.selectedBrand !== this.brandName) {
      // this.snotifyService.error('Select a valid brand or clear the field');
      Swal.fire('Error','Select a valid brand or clear the field','error')

      
      return false;
    }else if (this.brandName !== '') {
      dctJsonData['brand'] = this.brandId;
    }
    
    if (this.product !== '') {
      dctJsonData['product'] = this.productId;
    }else if (this.product !== undefined && this.product !== '' && this.selectedProduct !== this.product) {
      // this.snotifyService.error('Select a valid product or clear the field');
      Swal.fire('Error','Select a valid product or clear the field','error')

      return false;
    }
    if (this.staffSelected.length > 0) {
      this.selectedStaff = this.staffSelected.map(x => x.id);
      dctJsonData['staffs'] = this.staffSelected;
    }
    if (this.promoterSelected.length > 0) {
      this.selectedPromoter = this.promoterSelected.map(x => x.id);
      dctJsonData['promoters'] = this.promoterSelected;
    }
      

    if(!this.email){
      // this.snotifyService.error('Enter an email address');
      Swal.fire('Error','Enter an email address','error')

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

        this.serverService.postData("enquiry_productivity_report_pdf/enq_productivity_pdf/",dctJsonData)
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
        this.serverService.postData("enquiry_productivity_report_pdf/enq_productivity_pdf/",dctJsonData)
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



  exportWithChat(fdate, tdate){

    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
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
    this.datFromSaved = fdate.format('YYYY-MM-DD');
    this.datToSaved = tdate.format('YYYY-MM-DD');
    const dctJsonData = { username: this.currentUserName };
    dctJsonData['data'] = 'Custom';
    dctJsonData['date_from'] = this.datFromSaved;
    dctJsonData['date_to'] = this.datToSaved;
    dctJsonData['type'] = 'Sale';
    dctJsonData['show_type'] = this.type;
    dctJsonData['status'] = 'BOOKED';
    dctJsonData['report_type']='productivity_report';
    dctJsonData['export_type'] = 'CHAT';
    if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
      // this.snotifyService.error('Select a valid branch or clear the field');
         Swal.fire('Error','Select a valid branch or clear the field','error')

      return false;
    } else if (this.branchName !== '') {
      dctJsonData['branch'] = this.branchId;
    }
    if (this.brandName !== undefined && this.brandName !== '' && this.selectedBrand !== this.brandName) {
      // this.snotifyService.error('Select a valid brand or clear the field');
      Swal.fire('Error','Select a valid brand or clear the field','error')

      return false;
    }else if (this.brandName !== '') {
      dctJsonData['brand'] = this.brandId;
    }
    
    if (this.product !== '') {
      dctJsonData['product'] = this.productId;
    }else if (this.product !== undefined && this.product !== '' && this.selectedProduct !== this.product) {
      // this.snotifyService.error('Select a valid product or clear the field');
      Swal.fire('Error','Select a valid product or clear the field','error')

      return false;
    }
    if (this.staffSelected.length > 0) {
      this.selectedStaff = this.staffSelected.map(x => x.id);
      dctJsonData['staffs'] = this.staffSelected;
    }
    if (this.promoterSelected.length > 0) {
      this.selectedPromoter = this.promoterSelected.map(x => x.id);
      dctJsonData['promoters'] = this.promoterSelected;
    }
      

    if(!this.chatName){
      // this.snotifyService.error('Enter chat name');
      Swal.fire('Error','Select a valid branch or clear the field','error')

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

     

        this.serverService.postData("enquiry_productivity_report_pdf/enq_productivity_pdf/",dctJsonData)
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
              Swal.fire('Error','Something went wrong','error')

             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

     else if(this.chatExport){
        
        this.serverService.postData("reports/product_report_excel/",dctJsonData)
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
              Swal.fire('Error','Something went wrong','error')

             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });

      }

    }
      
  }

  closePopup(){
    this.showPopup=false;
    }

  showAll() {
  
    this.initAssignee=this.dctReportData.IN_IT['ASSIGNE'];
    this.initBrand=this.dctReportData.IN_IT['BRANDS'];
    this.initItem=this.dctReportData.IN_IT['ITEMS'];
    this.initProduct = this.dctReportData.IN_IT['SERVICE'];


    this.blnGood = true;
    this.blnPoor = true;
    this.selectedOption = '';
    this.selectedOptionSource = '';
    this.selectedOptionProduct = '';
    this.selectedOptionBrand = '';
    this.sourceCurrentIndex = 1;
    this.productCurrentIndex = 1;
    this.brandCurrentIndex = 1;
    this.itemCurrentIndex = 1;

    // Assign data staff wise
    this.staffChartKey='assigne_all';

    // let optionsArray1=[];
    // this.dct_product={};
    // optionsArray1.push('service_all');
    // this.dct_product['service_all']=optionsArray1;
    
    this.barChartLabels = [];
    this.barChartLabels2 = [];
    this.barChartLabels1 = [];
    this.barChartData[0].data = [];
    this.barChartData[0].label = 'Enquiry';
    this.barChartData[1].data = [];
    this.barChartData[1].label = 'Sales';
    const promoterList =JSON.parse(JSON.stringify(this.dctReportData['PROMOTER']));
    const resignedList = JSON.parse(JSON.stringify(this.dctReportData['RESIGNED']));
    this.barChartColors[0].backgroundColor = [];


    this.sourceMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM).length;
    this.barChartLabels = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex]);
    this.barChartLabelsCopy = this.barChartLabels;
    this.barChartLabels1 = this.barChartLabels;
    for(var key in this.barChartLabels){
      this.barChartLabels2[key] = this.barChartLabels[key].split("-").pop();
    }
    for(var key in promoterList){
      promoterList[key] = promoterList[key].split('-')[1];
    }
   
    this.barChartLabels2 = this.barChartLabels2.map(obj => {
      if (resignedList.indexOf(obj) > -1) {
        this.barChartColors[0].backgroundColor.push(this.resignedColor);
      } else if (promoterList.indexOf(obj) > -1) {
        this.barChartColors[0].backgroundColor.push(this.promoterColor);
      } else {
        this.barChartColors[0].backgroundColor.push(this.enquiryColor);
      }

      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      obj = this.titlecasePipe.transform(obj);

      return obj;
    });

    console.log(this.barChartColors[0].backgroundColor,'color')

    let temp = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex])
    this.barChartData[0].data = temp.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][x]['Enquiry']);

    this.barChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex]).map(
      key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][key]['Sale']
    );
    // this.shuffleMulti2(this.barChartLabels2,this.barChartData[0].data,this.barChartData[1].data, this.barChartLabelsCopy);
    this.shuffleMulti4(this.barChartLabels2, this.barChartData[0].data,this.barChartData[1].data, this.barChartLabelsCopy, this.barChartColors[0].backgroundColor);
    setTimeout(() => (this.barChartLabels2 = Object.assign([], this.barChartLabels2)));
    setTimeout(() => (this.barChartData= Object.assign([], this.barChartData)));
    setTimeout(() => (this.barChartLabels1 = Object.assign([], this.barChartLabels1)));

    // assign data productwise
    this.productChartKey='service_all';


    this.productBarChartLabels = [];
    this.productBarChartLabels1 = [];
    this.productBarChartData[0].data = [];
    this.productBarChartData[0].label = 'Enquiry';
    this.productBarChartData[1].data = [];
    this.productBarChartData[1].label = 'Sales';
    this.productBarChartData1[0].data = [];

    // if (this.product) {
      this.product = this.product.toUpperCase();
      console.log(this.dctReportData)
      this.productMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE']).length;
      this.productBarChartLabels = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex]);
      this.productBarChartLabelsCopy = this.productBarChartLabels;
      this.productBarChartLabels = this.productBarChartLabels.map(obj => {
        if (obj.length > 7) {
          obj =  obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      for (let item in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE']){
    
        this.productBarChartLabels1.push(...Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][item]));
        for(let product in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][item]){
         
          this.productBarChartData1[0].data.push(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][item][product]['Sale']); 
          
          
        }
        
      }

      let temp1 = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex])
      this.productBarChartData[0].data = temp1.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM
        [this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][x]['Enquiry']);

    this.productBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex]).map(
      key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][key]['Sale']
    );

    setTimeout(() => (this.productBarChartLabels = Object.assign([], this.productBarChartLabels)));
    setTimeout(() => (this.productBarChartData[0].data = Object.assign([], this.productBarChartData[0].data)));
    setTimeout(() => (this.productBarChartLabels1 = Object.assign([], this.productBarChartLabels1)));
    setTimeout(() => (this.productBarChartData1[0].data = Object.assign([], this.productBarChartData1[0].data)));
    this.productBarChartOptions.title.text = this.product;
    // console.log(this.productBarChartLabels1,this.productBarChartData1);
    // }
  //   else {
  //   this.productMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE']).length;
  //   this.productBarChartLabels = Object.keys(this.dctReportData.service_all[this.productCurrentIndex]);
  //   this.productBarChartLabelsCopy = this.productBarChartLabels;
  //   this.productBarChartLabels = this.productBarChartLabels.map(obj => {
  //     if (obj.length > 7) {
  //       obj = obj.slice(0, 5) + '..';
  //     }
  //     obj = this.titlecasePipe.transform(obj);
  //     return obj;
  //   });
    
  //   for (let item in this.dctReportData.service_all){
    
  //     this.productBarChartLabels1.push(...Object.keys(this.dctReportData.service_all[item]));
  //     for(let product in this.dctReportData.service_all[item]){
       
  //       this.productBarChartData1[0].data.push(this.dctReportData.service_all[item][product]['Sale']); 
        
        
  //     }
      
  //   }    

  //   let temp1 = Object.keys(this.dctReportData.service_all[this.productCurrentIndex])
  //   this.productBarChartData[0].data = temp1.map(x => this.dctReportData.service_all[this.productCurrentIndex][x]['Enquiry']);

  //   this.productBarChartData[1].data = Object.keys(this.dctReportData.service_all[this.productCurrentIndex]).map(
  //     key => this.dctReportData.service_all[this.productCurrentIndex][key]['Sale']
  //   );

  //   setTimeout(() => (this.productBarChartLabels = Object.assign([], this.productBarChartLabels)));
  //   setTimeout(() => (this.productBarChartData[0].data = Object.assign([], this.productBarChartData[0].data)));
  //   setTimeout(() => (this.productBarChartLabels1 = Object.assign([], this.productBarChartLabels1)));
  //   setTimeout(() => (this.productBarChartData1[0].data = Object.assign([], this.productBarChartData1[0].data)));
  //   this.productBarChartOptions.title.text = 'ALL';
  //   // console.log('h',this.productBarChartLabels1,this.productBarChartData1);
  // }

    // Assign data brandwise

    this.brandChartKey='brand_all';
    
    this.brandBarChartLabels = [];
    this.brandBarChartLabels1 = [];
    this.brandBarChartData[0].data = [];
    this.brandBarChartData[0].label = 'Enquiry';
    this.brandBarChartData[1].data = [];
    this.brandBarChartData[1].label = 'Sales';
    this.brandBarChartData1[0].data = [];

    // if (this.brandName) {
      this.brandMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS']).length;
      this.brandBarChartLabels = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]);
      this.brandBarChartLabelsCopy = this.brandBarChartLabels;
      this.brandBarChartLabels = this.brandBarChartLabels.map(obj => {
        if (obj.length > 7) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });
      
      for (let item in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS']){
    
        this.brandBarChartLabels1.push(...Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][item]));
        for(let product in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][item]){
         
          this.brandBarChartData1[0].data.push(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][item][product]['Sale']); 
          
          
        }
        
      }
      
      let temp2 = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex])
      this.brandBarChartData[0].data = temp2.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][x]['Enquiry']);

      this.brandBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]).map(
        key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']
      );

      setTimeout(() => (this.brandBarChartLabels = Object.assign([], this.brandBarChartLabels)));
      setTimeout(() => (this.brandBarChartData[0].data = Object.assign([], this.brandBarChartData[0].data)));
      setTimeout(() => (this.brandBarChartLabels1 = Object.assign([], this.brandBarChartLabels1)));
      setTimeout(() => (this.brandBarChartData1[0].data = Object.assign([], this.brandBarChartData1[0].data)));
      this.brandBarChartOptions.title.text = this.brandName;
    // }
    // else{
    //   this.brandMaxIndex = Object.keys(this.dctReportData.brand_all).length;
    //   this.brandBarChartLabels = Object.keys(this.dctReportData.brand_all[this.brandCurrentIndex]);
    //   this.brandBarChartLabelsCopy = this.brandBarChartLabels;
    //   this.brandBarChartLabels = this.brandBarChartLabels.map(obj => {
    //     if (obj.length > 7) {
    //       obj = obj.slice(0, 5) + '..';
    //     }
    //     obj = this.titlecasePipe.transform(obj);
    //     return obj;
    //   });
      
    //   for (let item in this.dctReportData.brand_all){
    
    //     this.brandBarChartLabels1.push(...Object.keys(this.dctReportData.brand_all[item]));
    //     for(let product in this.dctReportData.brand_all[item]){
         
    //       this.brandBarChartData1[0].data.push(this.dctReportData.brand_all[item][product]['Sale']); 
          
          
    //     }
        
    //   }
    //   // console.log('m',this.brandBarChartData1,this.brandBarChartLabels1);
    //   let temp2 = Object.keys(this.dctReportData.brand_all[this.brandCurrentIndex])
    //   this.brandBarChartData[0].data = temp2.map(x => this.dctReportData.brand_all[this.brandCurrentIndex][x]['Enquiry']);

    //   this.brandBarChartData[1].data = Object.keys(this.dctReportData.brand_all[this.brandCurrentIndex]).map(
    //     key => this.dctReportData.brand_all[this.brandCurrentIndex][key]['Sale']
    //   );

    //   setTimeout(() => (this.brandBarChartLabels = Object.assign([], this.brandBarChartLabels)));
    //   setTimeout(() => (this.brandBarChartData[0].data = Object.assign([], this.brandBarChartData[0].data)));
    //   setTimeout(() => (this.brandBarChartLabels1 = Object.assign([], this.brandBarChartLabels1)));
    //   setTimeout(() => (this.brandBarChartData1[0].data = Object.assign([], this.brandBarChartData1[0].data)));
    //   this.brandBarChartOptions.title.text = 'ALL';
    // }


    // Assign data itemwise
   this.itemChartKey='item_all';
   this.expJsondata['item']='ALL';


    this.itemBarChartLabels = [];
    this.itemBarChartData[0].data = [];
    this.itemBarChartData[0].label = 'Enquiry';
    this.itemBarChartData[1].data = [];
    this.itemBarChartData[1].label = 'Sales';

    this.itemMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS']).length;
    this.itemBarChartLabels = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]);
    this.itemBarChartLabelsCopy = this.itemBarChartLabels;
    this.itemBarChartLabels = this.itemBarChartLabels.map(obj => {
      if (obj.length > 7) {
        obj = obj.slice(0, 5) + '..';
      }
      obj = this.titlecasePipe.transform(obj);
      return obj;
    });


    let temp3 = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex])
    this.itemBarChartData[0].data = temp3.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][x]['Enquiry']);

    this.itemBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]).map(
      key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
    );

    setTimeout(() => (this.itemBarChartLabels = Object.assign([], this.itemBarChartLabels)));
    setTimeout(() => (this.itemBarChartData[0].data = Object.assign([], this.itemBarChartData[0].data)));

    // this.barChartOptions.title.text = 'ALL';

    // this.itemBarChartOptions.title.text = 'ALL';

    this.productBarChartOptions.title.text = this.initAssignee;
    this.brandBarChartOptions.title.text = this.initProduct;
    this.itemBarChartOptions.title.text = this.initBrand;

  }

  chartClicked(e: any): void {
    this.selectedOptionBrand = '';
    this.selectedOptionProduct = '';
    if (e.active.length > 0) {
      this.selectedOption = this.barChartLabelsCopy[e.active[0]._index];
      this.selectedOptionSource = this.selectedOption;
      this.clickedStaffIndex = this.sourceCurrentIndex;

      // Assign data to product barchart
      this.productChartKey='assigne_service';
      this.selectStaff=this.selectedOption;
      this.expJsondata['staff']=this.selectStaff;


      this.productBarChartLabels = [];
      this.productBarChartLabels1 = [];
      this.productBarChartData[0].data = [];
      this.productBarChartData[1].data = [];
      this.productBarChartData1[0].data = [];
      this.productCurrentIndex = 1;
      this.productMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE']).length;
      this.productBarChartLabels = Object.keys(
        this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][
        this.productCurrentIndex
        ]
      );
      
      this.initProduct = this.productBarChartLabels[0];

      this.productBarChartLabelsCopy = this.productBarChartLabels;
      this.productBarChartLabels = this.productBarChartLabels.map(obj => {
        if (obj.length > 7) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });
      
      for (let item in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE']){
    
        this.productBarChartLabels1.push(...Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][item]));
        for(let product in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][item]){
         
          this.productBarChartData1[0].data.push(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][item][product]['Sale']); 
          
          
        }
        
      }    
      

      let temp1 = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex])
      this.productBarChartData[0].data = temp1.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][x]['Enquiry']);

      this.productBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex]).map(
        key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][key]['Sale']
      );

      setTimeout(() => (this.productBarChartLabels = Object.assign([], this.productBarChartLabels)));
      setTimeout(() => (this.productBarChartData[0].data = Object.assign([], this.productBarChartData[0].data)));
      setTimeout(() => (this.productBarChartLabels1 = Object.assign([], this.productBarChartLabels1)));
      setTimeout(() => (this.productBarChartData1[0].data = Object.assign([], this.productBarChartData1[0].data)));

      // Assign data to brand barchart
      this.brandChartKey='assigne_brand';
      
      this.brandBarChartLabels = [];
      this.brandBarChartLabels1 = [];
      this.brandBarChartData[0].data = [];
      this.brandBarChartData[1].data = [];
      this.brandBarChartData1[0].data = [];
      this.brandCurrentIndex = 1;
      this.brandMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS']).length;
      this.brandBarChartLabels = Object.keys(
        this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][
        this.brandCurrentIndex
        ]
      );
      
      this.initBrand = this.brandBarChartLabels[0];

      this.brandBarChartLabelsCopy = this.brandBarChartLabels;
      this.brandBarChartLabels = this.brandBarChartLabels.map(obj => {
        if (obj.length > 7) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });
      
      for (let item in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS']){
    
        this.brandBarChartLabels1.push(...Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][item]));
        for(let product in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][item]){
         
          this.brandBarChartData1[0].data.push(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][item][product]['Sale']); 
          
          
        }
        
      }    
      

      let temp = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex])
      this.brandBarChartData[0].data = temp.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][x]['Enquiry']);

      this.brandBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]).map(
        key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']
      );

      setTimeout(() => (this.brandBarChartLabels = Object.assign([], this.brandBarChartLabels)));
      setTimeout(() => (this.brandBarChartData[0].data = Object.assign([], this.brandBarChartData[0].data)));
      setTimeout(() => (this.brandBarChartLabels1 = Object.assign([], this.brandBarChartLabels1)));
      setTimeout(() => (this.brandBarChartData1[0].data = Object.assign([], this.brandBarChartData1[0].data)));
      // Assign data to item barchart
     this.itemChartKey='assigne_item';
      
      this.itemBarChartLabels = [];
      this.itemBarChartData[0].data = [];
      this.itemBarChartData[1].data = [];
      this.itemCurrentIndex = 1;
      this.itemMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS']).length;
      this.itemBarChartLabels = Object.keys(
        this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][
        this.itemCurrentIndex
        ]
      );
      
      this.initItem = this.itemBarChartLabels[0];

      this.itemBarChartLabelsCopy = this.itemBarChartLabels;
      this.itemBarChartLabels = this.itemBarChartLabels.map(obj => {
        if (obj.length > 7) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });


      let temp2 = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex])
      this.itemBarChartData[0].data = temp2.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][x]['Enquiry']);

      this.itemBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex]).map(
        key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][this.selectedOption]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
      );

      setTimeout(() => (this.itemBarChartLabels = Object.assign([], this.itemBarChartLabels)));
      setTimeout(() => (this.itemBarChartData[0].data = Object.assign([], this.itemBarChartData[0].data)));


      this.productBarChartOptions.title.text = this.selectedOption;
      this.brandBarChartOptions.title.text = this.initProduct;
      this.itemBarChartOptions.title.text = this.initBrand;
    }
  }

  productChartClicked(e: any): void {
    this.selectedOptionBrand = '';
    if (this.selectedOptionSource == '') {
      // this.snotifyService.error('Select product before item');
      Swal.fire('Error','Select product before item','error')

      this.selectedOptionSource=this.initAssignee;
      this.clickedStaffIndex=this.sourceCurrentIndex;
    }
    else if (e.active.length > 0) {
      this.selectedOption = this.productBarChartLabelsCopy[e.active[0]._index];
      this.selectedOptionProduct = this.selectedOption;
      this.clickedProductIndex = this.productCurrentIndex;

      // Assign data to brand barchart
      this.brandChartKey='assigne_service_brand';
      this.selectProduct=this.selectedOption;
      this.expJsondata['product']=this.selectProduct

      this.brandBarChartLabels = [];
      this.brandBarChartLabels1 = [];
      this.brandBarChartData[0].data = [];
      this.brandBarChartData[1].data = [];
      this.brandBarChartData1[0].data = [];
      this.brandCurrentIndex = 1;
      this.brandMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS']).length;
      this.brandBarChartLabels = Object.keys(
        this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][
        this.brandCurrentIndex
        ]
      );
      
      this.initBrand = this.brandBarChartLabels[0];

      this.brandBarChartLabelsCopy = this.brandBarChartLabels;
      this.brandBarChartLabels = this.brandBarChartLabels.map(obj => {
        if (obj.length > 7) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });
      
      for (let item in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS']){
    
        this.brandBarChartLabels1.push(...Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][item]));
        for(let product in this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][item]){
         
          this.brandBarChartData1[0].data.push(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][item][product]['Sale']); 
          
          
        }
        
      }    

      let temp = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex])
      this.brandBarChartData[0].data = temp.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][x]['Enquiry']);

      this.brandBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex]).map(
        key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']
      );

      setTimeout(() => (this.brandBarChartLabels = Object.assign([], this.brandBarChartLabels)));
      setTimeout(() => (this.brandBarChartData[0].data = Object.assign([], this.brandBarChartData[0].data)));
      setTimeout(() => (this.brandBarChartLabels1 = Object.assign([], this.brandBarChartLabels1)));
      setTimeout(() => (this.brandBarChartData1[0].data = Object.assign([], this.brandBarChartData1[0].data)));
      // Assign data to item barchart
    this.itemChartKey='assigne_service_item';
      
      this.itemBarChartLabels = [];
      this.itemBarChartData[0].data = [];
      this.itemBarChartData[1].data = [];
      this.itemCurrentIndex = 1;
      this.itemMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS']).length;
      this.itemBarChartLabels = Object.keys(
        this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][
        this.itemCurrentIndex
        ]
      );
      this.itemBarChartLabelsCopy = this.itemBarChartLabels;
      this.itemBarChartLabels = this.itemBarChartLabels.map(obj => {
        if (obj.length > 7) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });


      let temp2 = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex])
      this.itemBarChartData[0].data = temp2.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][x]['Enquiry']);

      this.itemBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]).map(
        key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
      );

      setTimeout(() => (this.itemBarChartLabels = Object.assign([], this.itemBarChartLabels)));
      setTimeout(() => (this.itemBarChartData[0].data = Object.assign([], this.itemBarChartData[0].data)));


      this.brandBarChartOptions.title.text = this.selectedOption;
      this.itemBarChartOptions.title.text = this.initBrand;
    }
  }

  brandChartClicked(e: any): void {
    if (this.selectedOptionSource == '') {
      // this.snotifyService.error('Select product before item');
      Swal.fire('Error','Select product before item','error')

      this.selectedOptionSource=this.initAssignee;
      this.clickedStaffIndex=this.sourceCurrentIndex;
    }
    if (this.selectedOptionProduct == '') {
      // this.snotifyService.error('Select product before item');
      Swal.fire('Error','Select product before item','error')

      
      this.selectedOptionProduct=this.initProduct;
      this.clickedProductIndex=this.productCurrentIndex;
    }
    else if (e.active.length > 0) {
      this.selectedOption = this.brandBarChartLabelsCopy[e.active[0]._index];
      this.selectedOptionBrand = this.selectedOption;
      // this.selectedOption = this.selectedOption.toUpperCase();
      // Assign data to item barchart
      this.itemBarChartLabels = [];
      this.itemBarChartData[0].data = [];
      this.itemBarChartData[1].data = [];
      this.itemCurrentIndex = 1;
      this.clickedBrandIndex = this.brandCurrentIndex;

      this.itemChartKey='assigne_service_brand_item';
      this.selectBrand=this.selectedOption;
      this.expJsondata['brand']=this.selectBrand

      this.itemMaxIndex = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOptionBrand]['ITEMS']).length;
      this.itemBarChartLabels = Object.keys(
        this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOptionBrand]['ITEMS'][
        this.itemCurrentIndex
        ]
      );
      this.itemBarChartLabelsCopy = this.itemBarChartLabels;
      this.itemBarChartLabels = this.itemBarChartLabels.map(obj => {
        if (obj.length > 7) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });


      let temp2 = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex])
      this.itemBarChartData[0].data = temp2.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][x]['Enquiry']);

      this.itemBarChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]).map(
        key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][this.brandCurrentIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
      );

      setTimeout(() => (this.itemBarChartLabels = Object.assign([], this.itemBarChartLabels)));
      setTimeout(() => (this.itemBarChartData[0].data = Object.assign([], this.itemBarChartData[0].data)));


      this.itemBarChartOptions.title.text = this.selectedOption;
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
        this.selectedOptionSource === '' &&
        this.selectedOptionProduct === '' &&
        this.selectedOptionBrand === ''
      ) {
      
        this.brandBarChartData[0].data = [];
        this.brandBarChartData[1].data = [];
        this.brandBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        );
        this.brandBarChartLabelsCopy = this.brandBarChartLabels;


        /////
      
    
    
    

        /////





        this.brandBarChartLabels = this.brandBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });


        this.brandBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Enquiry']);
        this.brandBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex][this.initProduct]['BRANDS'][this.brandCurrentIndex][key]['Sale']);
      // }
      } else if (
        this.selectedOptionProduct === '' &&
        this.selectedOptionBrand === ''
      ) {
        
        this.brandBarChartData[0].data = [];
        this.brandBarChartData[1].data = [];
        this.brandBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        );
        this.brandBarChartLabelsCopy = this.brandBarChartLabels;
        this.brandBarChartLabels = this.brandBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.brandBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][this.brandCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][
            this.brandCurrentIndex
            ][key]['Enquiry']
          );
        this.brandBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][
          this.brandCurrentIndex
          ]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][
            this.brandCurrentIndex
            ][key]['Sale']
          );
      } else if (
        this.selectedOptionBrand === ''
      ) {

        this.brandBarChartData[0].data = [];
        this.brandBarChartData[1].data = [];
        this.brandBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
          this.brandCurrentIndex
          ]
        );
        this.brandBarChartLabelsCopy = this.brandBarChartLabels;
        this.brandBarChartLabels = this.brandBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.brandBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
          this.brandCurrentIndex
          ]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
            this.brandCurrentIndex
            ][key]['Enquiry']
          );
        this.brandBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
          this.brandCurrentIndex
          ]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
            this.brandCurrentIndex
            ][key]['Sale']
          );
      }


      setTimeout(
        () => (this.brandBarChartLabels = Object.assign([], this.brandBarChartLabels))
      );
      setTimeout(
        () =>
          (this.brandBarChartData[0].data = Object.assign(
            [],
            this.brandBarChartData[0].data
          ))
      );
      setTimeout(
        () =>
          (this.brandBarChartData[1].data = Object.assign(
            [],
            this.brandBarChartData[1].data
          ))
      );
    }
    else if (type === 'item') {
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
        this.selectedOptionSource === '' &&
        this.selectedOptionProduct === '' &&
        this.selectedOptionBrand === ''
      ) {
        this.itemBarChartData[0].data = [];
        this.itemBarChartData[1].data = [];
        this.itemBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemBarChartLabelsCopy = this.itemBarChartLabels;
        this.itemBarChartLabels = this.itemBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS'][
            1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS'][
          1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']);
        this.itemBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS'][
            1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS'][
          1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']);
      } else if (
        this.selectedOptionProduct === '' &&
        this.selectedOptionBrand === ''
      ) {

        this.itemBarChartData[0].data = [];
        this.itemBarChartData[1].data = [];
        this.itemBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][
            1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemBarChartLabelsCopy = this.itemBarChartLabels;
        this.itemBarChartLabels = this.itemBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][
            1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][
              1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
          );
        this.itemBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][
            1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][
              1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
          );
      } else if (
        this.selectedOptionBrand === ''
      ) {
        this.itemBarChartData[0].data = [];
        this.itemBarChartData[1].data = [];
        this.itemBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
            1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemBarChartLabelsCopy = this.itemBarChartLabels;
        this.itemBarChartLabels = this.itemBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
            1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
              1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
          );
        this.itemBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
            1][this.initBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
              1][this.initBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
          );
      }
      else {
        this.itemBarChartData[0].data = [];
        this.itemBarChartData[1].data = [];
        // this.selectedOption = this.selectedOption.toUpperCase();
        this.itemBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
            this.clickedBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        );
        this.itemBarChartLabelsCopy = this.itemBarChartLabels;
        this.itemBarChartLabels = this.itemBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.itemBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
            this.clickedBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
              this.clickedBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Enquiry']
          );
        this.itemBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
            this.clickedBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][
              this.clickedBrandIndex][this.selectedOptionBrand]['ITEMS'][this.itemCurrentIndex][key]['Sale']
          );
      }

      setTimeout(
        () => (this.itemBarChartLabels = Object.assign([], this.itemBarChartLabels))
      );
      setTimeout(
        () =>
          (this.itemBarChartData[0].data = Object.assign(
            [],
            this.itemBarChartData[0].data
          ))
      );
    }
    else if (type === 'product') {
      if (direction === 'left') {
        if (this.productCurrentIndex > 1) {
          this.productCurrentIndex -= 1;
        } else {
          this.productCurrentIndex = this.productMaxIndex;
        }
      } else {
        if (this.productCurrentIndex < this.productMaxIndex) {
          this.productCurrentIndex += 1;
        } else {
          this.productCurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionSource === '' &&
        this.selectedOptionProduct === '' &&
        this.selectedOptionBrand === ''
      ) {
   
      
        this.productBarChartData[0].data = [];
        this.productBarChartData[1].data = [];
        this.productBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex]
        );
        this.productBarChartLabelsCopy = this.productBarChartLabels;
        this.productBarChartLabels = this.productBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.productBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex]
        ).map(key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex][key]['Enquiry']);
        this.productBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex]
        ).map(key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][this.productCurrentIndex][key]['Sale']);
      } else if (
        this.selectedOptionProduct === '' &&
        this.selectedOptionBrand === ''
      ) {
        this.productBarChartData[0].data = [];
        this.productBarChartData[1].data = [];
        this.productBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex]
        );
        this.productBarChartLabelsCopy = this.productBarChartLabels;
        this.productBarChartLabels = this.productBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.productBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][key]['Enquiry']
          );
        this.productBarChartData[1].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][key]['Sale']
          );
      } else if (
        this.selectedOptionBrand === ''
      ) {
        this.productBarChartData[0].data = [];
        this.productBarChartData[1].data = [];
        this.productBarChartLabels = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex]
        );
        this.productBarChartLabelsCopy = this.productBarChartLabels;
        this.productBarChartLabels = this.productBarChartLabels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          return obj;
        });
        this.productBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][key]['Enquiry']
          );
        this.productBarChartData[0].data = Object.keys(
          this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex]
        ).map(
          key =>
            this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.productCurrentIndex][key]['Sale']
          );
      }

      setTimeout(
        () => (this.productBarChartLabels = Object.assign([], this.productBarChartLabels))
      );
      setTimeout(
        () =>
          (this.productBarChartData[0].data = Object.assign(
            [],
            this.productBarChartData[0].data
          ))
      );
    }
    else if (type === 'source') {
      if (direction === 'left') {
        if (this.sourceCurrentIndex > 1) {
          this.sourceCurrentIndex -= 1;
        } else {
          this.sourceCurrentIndex = this.sourceMaxIndex;
        }
      } else {
        if (this.sourceCurrentIndex < this.sourceMaxIndex) {
          this.sourceCurrentIndex += 1;
        } else {
          this.sourceCurrentIndex = 1;
        }
      }
      this.currentPage=this.sourceCurrentIndex;

      this.barChartData[0].data = [];
      this.barChartData[1].data = [];
      this.barChartLabels2 = [];
      const promoterList = JSON.parse(JSON.stringify(this.dctReportData['PROMOTER']))
      const resignedList = JSON.parse(JSON.stringify(this.dctReportData['RESIGNED']))
      this.barChartColors[0].backgroundColor = [];
      this.barChartLabels = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex]);
      this.barChartLabelsCopy = this.barChartLabels;
      
       for(var key in this.barChartLabels){
        this.barChartLabels2[key] = this.barChartLabels[key].split("-").pop();
      }
     
      for(var key in promoterList){
        promoterList[key] = promoterList[key].split('-')[1];
      }

      this.barChartLabels2 = this.barChartLabels2.map(obj => {
        if (resignedList.indexOf(obj) > -1) {
          this.barChartColors[0].backgroundColor.push(this.resignedColor);
        } else if (promoterList.indexOf(obj) > -1) {
          this.barChartColors[0].backgroundColor.push(this.promoterColor);
        } else {
          this.barChartColors[0].backgroundColor.push(this.enquiryColor);
        }
        if (obj.length > 7) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });




      let temp = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex])
      this.barChartData[0].data = temp.map(x => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][x]['Enquiry']);

      this.barChartData[1].data = Object.keys(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex]).map(
        key => this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.sourceCurrentIndex][key]['Sale']
      );

      setTimeout(() => (this.barChartLabels2 = Object.assign([], this.barChartLabels2)));
      setTimeout(() => (this.barChartData[0].data = Object.assign([], this.barChartData[0].data)));
    }
  }

  goodOnClick() {
    this.blnGood = false;
    this.blnPoor = true;
    this.strGoodPoor='GOOD';
    this.currentPage=1;
    const promoterList = JSON.parse(JSON.stringify(this.dctReportData['PROMOTER']));
    const resignedList = this.dctReportData['RESIGNED'];
    this.barChartColors[0].backgroundColor = [];
    //
    this.blnActive = true;
    const dct_data =
      this.swap(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM, false);

    this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM = dct_data;
    this.sourceCurrentIndex = 1;
    this.barChartLabels = Object.keys(
      dct_data[this.sourceCurrentIndex]
    );
    this.barChartLabelsCopy = this.barChartLabels;
    for(var key in this.barChartLabels){
      this.barChartLabels2[key] = this.barChartLabels[key].split("-").pop();
    }
    for(var key in promoterList){
      promoterList[key] = promoterList[key].split('-')[1];
    }
    this.barChartLabels2 = this.barChartLabels2.map(obj => {
      //
      if (resignedList.indexOf(obj) > -1) {
        this.barChartColors[0].backgroundColor.push(this.resignedColor);
      } else if (promoterList.indexOf(obj) > -1) {
        this.barChartColors[0].backgroundColor.push(this.promoterColor);
      } else {
        this.barChartColors[0].backgroundColor.push(this.enquiryColor);
      }
      //
      if (obj.length > 6) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });
    this.barChartData[0].data = Object.keys(
      dct_data[this.sourceCurrentIndex]
    ).map(key => dct_data[this.sourceCurrentIndex][key]['Enquiry']);

    this.barChartData[1].data = Object.keys(
      dct_data[this.sourceCurrentIndex]
    ).map(key => dct_data[this.sourceCurrentIndex][key]['Sale']);
  }

  poorOnClick() {
    this.blnGood = true;
    this.blnPoor = false;
    this.strGoodPoor='POOR';
    this.currentPage=1;
    const promoterList = JSON.parse(JSON.stringify(this.dctReportData['PROMOTER']));
    const resignedList = this.dctReportData['RESIGNED'];
    this.barChartColors[0].backgroundColor = [];
  
    this.blnActive = false;
    const dct_data =
      this.swap(this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM, true);
    this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM = dct_data;
    this.sourceCurrentIndex = 1;
    this.barChartLabels = Object.keys(
      dct_data[this.sourceCurrentIndex]
    );
    this.barChartLabelsCopy = this.barChartLabels;
    for(var key in this.barChartLabels){
      this.barChartLabels2[key] = this.barChartLabels[key].split("-").pop();
    }
    for(var key in promoterList){
      promoterList[key] = promoterList[key].split('-')[1];
    }
    this.barChartLabels2 = this.barChartLabels2.map(obj => {
      //
      if (resignedList.indexOf(obj) > -1) {
        this.barChartColors[0].backgroundColor.push(this.resignedColor);
      } else if (promoterList.indexOf(obj) > -1) {
        this.barChartColors[0].backgroundColor.push(this.promoterColor);
      } else {
        this.barChartColors[0].backgroundColor.push(this.enquiryColor);
      }
      //
      if (obj.length > 6) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });
    this.barChartData[0].data = Object.keys(
      dct_data[this.sourceCurrentIndex]
    ).map(key => dct_data[this.sourceCurrentIndex][key]['Enquiry']);

    this.barChartData[1].data = Object.keys(
      dct_data[this.sourceCurrentIndex]
    ).map(key => dct_data[this.sourceCurrentIndex][key]['Sale']);
  }

  swap(lst_data, reverse) {

    const keys = Object.keys(lst_data);
    const len = keys.length - 1;
    let data_dict = [];
    for (let i = len; i > -1; i--) {

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
        out_dict[keys[i]] = Object.assign(out_dict[keys[i]], temp);
      }
    }
    return out_dict;
  }

  setType(){
    this.selectedStaff=[];
    this.selectedPromoter=[];

    this.staffName = '';
    this.staffSelected=[];

    this.promoterName = '';
    this.promoterSelected=[];

    if(this.promoterType){
      this.promoterType=false;
    }
    else{
      this.promoterType=true;

    }
  }

  addStaff(event) {

    // console.log("this.selectedStaff",this.selectedStaff);
    
      if (this.selectedStaff.length > 4) {
        Swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Upto 5 Staff Only !',
          confirmButtonText: 'OK'
        });
        this.staffName = '';
        this.idStaff.nativeElement.value = '';
        return false;
      }

    if (this.staffSelected.filter(x => x.intId === event.intId).length === 0) {
      this.staffSelected.push(event);
      this.selectedStaff.push(event.intId);
    }
    this.staffName = '';
    this.idStaff.nativeElement.value = '';
  }
  removeStaff(value) {
    const index = this.staffSelected.indexOf(value);
    const index2 = this.selectedStaff.indexOf(value.intId);
    if (index > -1) {
      this.staffSelected.splice(index, 1);
    }
    if (index2 > -1) {
      this.selectedStaff.splice(index2, 1);
    }
  }

  addPromoter(event) {

    if (this.selectedPromoter.length > 4) {
      Swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Upto 5 Brand promoter Only !',
        confirmButtonText: 'OK'
      });
      this.promoterName = '';
      this.idPromoter.nativeElement.value = '';
      return false;
    }

    if (this.promoterSelected.filter(x => x.intId === event.intId).length === 0) {
      this.promoterSelected.push(event);
      this.selectedPromoter.push(event.intId);
    }
    this.promoterName = '';
    this.idPromoter.nativeElement.value = '';
  }
  removePromoter(value) {
    const index = this.promoterSelected.indexOf(value);
    const index2 = this.selectedPromoter.indexOf(value.intId);
    if (index > -1) {
      this.promoterSelected.splice(index, 1);
    }
    if (index2 > -1) {
      this.selectedPromoter.splice(index2, 1);
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




  


  // Table data
  showTable() {
    if (this.blnChecked) {
      this.displayedColumns = [
        'date',
        'num',
        'name',
        'custName',
        'service',
        'brand',
        'branch'
      ];
      // let from = this.datFromDate._d;
      // let to = this.datToDate._d;
      // this.datFromDate._d = new Date(from.getTime() + (from.getTimezoneOffset() * 60000));
      // this.datToDate._d = new Date(to.getTime() + (to.getTimezoneOffset() * 60000));
      this.datFromSaved = moment(new Date(this.datFromDate)).format('YYYY-MM-DD');
      this.datToSaved = moment(new Date(this.datToDate)).format('YYYY-MM-DD');
      const dctJsonData = { username: this.currentUserName };
      dctJsonData['data'] = 'Custom';
      dctJsonData['date_from'] = this.datFromSaved;
      dctJsonData['date_to'] = this.datToSaved;
      dctJsonData['type'] = 'SALES';
      dctJsonData['status'] = 'BOOKED';
      if (this.branchName !== undefined && this.branchName !== '' && this.selectedBranch !== this.branchName) {
        // this.snotifyService.error('Select a valid branch or clear the field');
        Swal.fire('Error','Select a valid branch or clear the field','error')

        return false;
      } else if (this.branchName !== '') {
        dctJsonData['branch'] = this.branchId;
      }
      if (this.staffSelected.length > 0) {
        this.selectedStaff = this.staffSelected.map(x => x.id);
        dctJsonData['staffs'] = this.staffSelected;
      }
      if (this.promoterSelected.length > 0) {
        this.selectedPromoter = this.promoterSelected.map(x => x.id);
        dctJsonData['promoters'] = this.promoterSelected;
      }
      this.serverService.postData('productivityreport/productivitytabledata/',dctJsonData)
        .subscribe(
        (response) => {
          if (response['status'] === 1) {
            this.dataSource = new MatTableDataSource(response['data']);
            this.dataSource.paginator = this.paginator;
            this.dataSource.paginator.firstPage();
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource = new MatTableDataSource();
            // this.snotifyService.error('No data');
            Swal.fire('Error','No data found','error')

          }
        },
        (error) => {
          // this.snotifyService.error('Error');
          Swal.fire('Error','Error','error')

        });
    }
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

// new shuffle
shuffleMulti4(arr1, arr2, arr3, arr4, arr5) {
  let arrLength = 0;
  let argsLength = arguments.length; let rnd, tmp;
  for (var index = 0; index < argsLength; index += 1) {
    if (!this.isArray(arguments[index])) {
      throw new TypeError("Argument is not an array.");
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
showPopupData(modal,chartHead){
  
  this.showPopup=true;
  let   dctTempData: any = [];
  let dctTable={};
  let lstData=[];
  this.grandTotal=0;
  this.chartHead=chartHead;
  
  

  if(chartHead=='Staff'){        
    dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM;
    this.valueIteration(modal,dctTempData); 
  
  }
  else if(chartHead=='Product'){

      if (this.productChartKey=='service_all'){        
      dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'];
      this.valueIteration(modal,dctTempData);
      }
     
    else if(this.productChartKey=='assigne_service'){
      dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'];
      this.valueIteration(modal,dctTempData);
    }


  }
  else if(chartHead=='Brand'){ 

      if (this.brandChartKey=='brand_all'){
        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS']
        this.valueIteration(modal,dctTempData);
        }
        
        else if(this.brandChartKey=='assigne_brand'){

          dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS']
          this.valueIteration(modal,dctTempData);

      
    }
    
    else if(this.brandChartKey=='assigne_service_brand'){

          dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS']
          this.valueIteration(modal,dctTempData);

    }

 }
  else if(chartHead=='Item'){
 
    if (this.itemChartKey=='item_all'){
      dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS']
      this.valueIteration(modal,dctTempData);
      }
      
      else if(this.itemChartKey=='assigne_item'){

        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS']
        this.valueIteration(modal,dctTempData);
      }
      else if(this.itemChartKey=='assigne_service_item'){

        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS']
        this.valueIteration(modal,dctTempData);

      }

      else if(this.itemChartKey=='assigne_service_brand_item'){

        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][this.clickedBrandIndex][this.selectedOptionBrand]['ITEMS']
        this.valueIteration(modal,dctTempData);

      }

  }

  this.chartHead=chartHead;
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

changeChart(){ //change to bar chart or pie chart

  if(this.blnChartType){
    this.blnChartType=false;
  }
  else{
    this.blnChartType=true;
  }
}

changeStaffChart(){ //change to bar chart or pie chart

  if(this.blnStaffChartType){
    this.blnStaffChartType=false;
  }
  else{
    this.blnStaffChartType=true;
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
  this.expJsondata['component']='Productivity';
  // this.expJsondata['sortname']=this.sort.active;
  // this.expJsondata['sortdirection']=this.sort.direction;

  if(chartHead=='Product'){
    
    this.expJsondata['charthead']='Product';



    if (this.productChartKey=='service_all'){
      
    dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'];
    this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
    }
   
  else if(this.productChartKey=='assigne_service'){
    dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'];
    this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
  }

  }
  else if(chartHead=='Brand'){
    
    this.expJsondata['charthead']='Brand';
    if (this.brandChartKey=='brand_all'){
      dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS'];
      this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
      }
      
      else if(this.brandChartKey=='assigne_brand'){

        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'];
        this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);

    
  }
  
  else if(this.brandChartKey=='assigne_service_brand'){

        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'];
        this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);

  }

  }
  else if(chartHead=='Item'){
    this.expJsondata['charthead']='Item'

    if (this.itemChartKey=='item_all'){
      dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[1][this.initAssignee]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'];
      this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
      }
      
      else if(this.itemChartKey=='assigne_item'){

        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][1][this.initProduct]['BRANDS'][1][this.initBrand]['ITEMS'];
        this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);
      }
      else if(this.itemChartKey=='assigne_service_item'){

        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][1][this.initBrand]['ITEMS'];
        this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);

      }

      else if(this.itemChartKey=='assigne_service_brand_item'){

        dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM[this.clickedStaffIndex][this.selectedOptionSource]['SERVICE'][this.clickedProductIndex][this.selectedOptionProduct]['BRANDS'][this.clickedBrandIndex][this.selectedOptionBrand]['ITEMS'];
        this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);

      }


}
  else if(chartHead=='Staff'){
    this.expJsondata['charthead']='Staff'
    
    dctTempData=this.dctReportData.ASSIGNE_SERVICE_BRAND_ITEM;
    this.reportComponent.valueIterationExp(dctTempData,this.dctReportData,this.expJsondata);

  }
  this.downloadLog(this.dctJsonData1)
}

downloadLog(dctJsonData){
  let chart = localStorage.getItem('chartexport');
  // excel/pdf chart table pagenumber value/quantity filters
  let dctDownloadLog  = {};
  dctDownloadLog['vchr_url'] = this.strUrl;
  dctDownloadLog['date_range'] = this.datFromSaved +' , ' +this.datToSaved;

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
  if(this.brandName!=''){
    dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + this.brandName;
  }
 
  if(this.product!=''){
    dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " +this.product;
  }


  
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
      Swal.fire('Error','No data found','error')

     }
    },
    (error) => {
      // this.spinnerService.hide();
      this.showSpinner=false;

    });
}
}

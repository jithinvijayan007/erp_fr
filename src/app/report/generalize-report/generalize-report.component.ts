import { Component, OnInit, ViewContainerRef, ViewChild , ElementRef,Input} from '@angular/core';
import { SharedService } from '../../layouts/shared-service';
import { ServerService } from '../../server.service';
import { FormBuilder,FormControl } from '@angular/forms';
import { TypeaheadService } from '../../typeahead.service';
// import { ToastsManager } from 'ng2-toastr';
import { ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource} from '@angular/material/table';
import {  MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ChartService } from 'src/app/chart.service';
import * as moment from 'moment';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSpinnerService } from "ngx-spinner";
import { TitleCasePipe } from '@angular/common';
import { SnotifyService } from 'ng-snotify';
import { log } from 'util';
import { ReportComponent } from '../report.component';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-generalize-report',
  templateUrl: './generalize-report.component.html',
  styleUrls: ['./generalize-report.component.scss']
})

export class GeneralizeReportComponent implements OnInit {

// chart table start here
// @ViewChild(MatSort) sort: MatSort;
@ViewChild('matSort1') matSort1: MatSort;
@ViewChild('matSort2') matSort2: MatSort;

@ViewChild(MatPaginator) paginator: MatPaginator;

showSpinner=false;
switch_change='Qty';
blnQtyShow=true

exportmodal1;



blnTemporaryHide = true;

ELEMENT_DATA = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
// displayedColumns1 = ['position', 'name', 'weight', 'symbol'];
// dataSource1 = new MatTableDataSource(this.ELEMENT_DATA);
// chart end here
  showPopupEnq=false;
  showPopupSale=false;
  grandTotal;
  saleQtyTot;
  enqQtyTot;
  enqValTot;
  chartHead;
  productChartKey;
  dctPopupData:any[];
  dataSource1;
  displayedColumns1 = ['Name','EnquiryQty','SaleQty','ContribQty_per','Conversion_per'];
  displayedColumns3 = ['Name','EnquiryQty','Contrib_per'];
  dataSource2;

  chart1Key = '';
  chart2Key = '';
  chart3Key = '';
  chart4Key = '';
  chart5Key = '';
  chart6Key = '';
  chart7Key = '';
  chart8Key = '';
  chart9Key = '';
  chart10Key = '';

  @Input('show-modal') showModal: boolean;
  @Input('show-modal2') showModal2: boolean;

  @ViewChild('idBranch') idBranch: ElementRef;
  @ViewChild('idStaff') idStaff: ElementRef;
  @ViewChild('idBrand') idBrand: ElementRef;
  @ViewChild('idProduct') idProduct: ElementRef;
  @ViewChild('idItem') idItem: ElementRef;

  startDate = (new Date()).getFullYear() - 5;
  selectedYear = new Date().getFullYear();
  year = [this.startDate];
  quarter = 'JAN-MAR';
  lstquarter = ['JAN-MAR', 'APR-JUN', 'JUL-SEPT', 'OCT-DEC'];

  dctEnquiryDetails = [];
  public showTable = false;
  dctReportData: any = [];

  dctTableData: any = [];
  dctFilter : any = [];
  blnDataLoaded = false;
  selectedFromDate;
  selectedToDate;
  type=false;
  flag=false;

  blnStaff=false;
  blnBranch=false;
  blnBrand=false;
  blnProduct=false;
  blnItem=false;

  chart=true;
  table=false;
  email;
  chatName;
  excel;
  blnChart=false;
  blnTable=false;
  validationStatus;

  strGoodPoor='NORMAL';
  currentPage=1;

  chart1_canvasWidth;
  chart2_canvasWidth;
  chart3_canvasWidth;
  chart4_canvasWidth;
  chart5_canvasWidth;
  chart6_canvasWidth;
  chart7_canvasWidth;
  chart8_canvasWidth;
  chart9_canvasWidth;
  chart10_canvasWidth;

  export:boolean=true;
  emailExport:boolean=true;
  chatExport:boolean=true;

  lstBranches = [];
  searchBranch: FormControl = new FormControl();
  branchCode = '';
  branchName = '';
  selectedBranch = [];
  branchId: number;
  statusSelected = [];

  expJsondata=[];
  strChartNumber='';
  strChartType='';

  lstStaffs = [];
  tempStaff=[];
  searchStaff: FormControl = new FormControl();
  staffCode = '';
  staffName = '';
  selectedStaff = [];
  staffId: number;
  statusStaffSelected = [];

  lstBrands = [];
  tempBrand=[];
  searchBrand: FormControl = new FormControl();
  brandCode = '';
  brandName = '';
  selectedBrand = [];
  brandId: number;
  statusBrandSelected = [];

  blnDiscount=false
  strHead='Enquiry';
  strHead2='Sale'
  lstItems = [];
  tempItem=[];
  searchItem: FormControl = new FormControl();
  itemCode = '';
  itemName = '';
  selectedItem = [];
  itemId: number;
  statusItemSelected = [];
 
  lstProducts = [];
  tempProduct=[];
  searchProduct: FormControl = new FormControl();
  productCode = '';
  productName = '';
  selectedProduct = [];
  productId: number;
  statusProductSelected = [];
 
  blnExported = false;
  strUrl = '';
  dctJsonData1 = {}


  blnGood = true;
  blnPoor = true;

  selectedOptionChart_1: any = '';
  selectedOptionChart_2: any = '';
  selectedOptionChart_3: any = '';
  selectedOptionChart_4: any = '';
  selectedOptionChart_5: any = '';
  selectedOptionChart_6: any = '';
  selectedOptionChart_7: any = '';
  selectedOptionChart_8: any = '';
  selectedOptionChart_9: any = '';
  selectedOptionChart_10: any = '';

  activeBar = 'All'
  blnActive = true;

  displayedColumns = [];
  dataSource = new MatTableDataSource(this.dctTableData)

  // bar chart colors
  public barChartColor: Array<any> = this.chartservice.barSalesChartColor;

  public firstBarChartColor: Array<any> = [];
  // pie chart colors
  public pieChartColors: Array<any> = this.chartservice.pieChartColors;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  public chart_1_Labels: string[] = [];
  public chart_1_Data: any[] = [];
  public chart_1_Type;
  public chart_1_Legend;

  public chart_2_Labels: string[] = [];
  public chart_2_Data: any[] = [];
  public chart_2_Type;
  public chart_2_Legend;

  public chart_3_Labels: string[] = [];
  public chart_3_Data: any[] = [];
  public chart_3_Type;
  public chart_3_Legend;

  public chart_4_Labels: string[] = [];
  public chart_4_Data: any[] = [];
  public chart_4_Type;
  public chart_4_Legend;

  public chart_5_Labels: string[] = [];
  public chart_5_Data: any[] = [];
  public chart_5_Type;
  public chart_5_Legend;

  public chart_6_Labels: string[] = [];
  public chart_6_Data: any[] = [];
  public chart_6_Type;
  public chart_6_Legend;

  public chart_7_Labels: string[] = [];
  public chart_7_Data: any[] = [];
  public chart_7_Type;
  public chart_7_Legend;

  public chart_8_Labels: string[] = [];
  public chart_8_Data: any[] = [];
  public chart_8_Type;
  public chart_8_Legend;

  public chart_9_Labels: string[] = [];
  public chart_9_Data: any[] = [];
  public chart_9_Type;
  public chart_9_Legend;

  public chart_10_Labels: string[] = [];
  public chart_10_Data: any[] = [];
  public chart_10_Type;
  public chart_10_Legend;


  chart_1_CurrentIndex = 1;
  chart_1_MaxIndex = 10;

  chart_2_CurrentIndex = 1;
  chart_2_MaxIndex = 10;

  chart_3_CurrentIndex = 1;
  chart_3_MaxIndex = 10;

  chart_4_CurrentIndex = 1;
  chart_4_MaxIndex = 10;

  chart_5_CurrentIndex = 1;
  chart_5_MaxIndex = 10;

  chart_6_CurrentIndex = 1;
  chart_6_MaxIndex = 10;

  chart_7_CurrentIndex = 1;
  chart_7_MaxIndex = 10;

  chart_8_CurrentIndex = 1;
  chart_8_MaxIndex = 10;

  chart_9_CurrentIndex = 1;
  chart_9_MaxIndex = 10;

  chart_10_CurrentIndex = 1;
  chart_10_MaxIndex = 10;


  chart_1 = [];

  chart_1_LabelsCopy = [];
  chart_2_LabelsCopy = [];
  chart_3_LabelsCopy = [];
  chart_4_LabelsCopy = [];
  chart_5_LabelsCopy = [];
  chart_6_LabelsCopy = [];
  chart_7_LabelsCopy = [];
  chart_8_LabelsCopy = [];
  chart_9_LabelsCopy = [];
  chart_10_LabelsCopy = [];

  lst_chart_1_labels = [];
  lst_chart_2_labels = [];
  lst_chart_3_labels = [];
  lst_chart_4_labels = [];
  lst_chart_5_labels = [];
  lst_chart_6_labels = [];
  lst_chart_7_labels = [];
  lst_chart_8_labels = [];
  lst_chart_9_labels = [];
  lst_chart_10_labels = [];

  chart_1_size;
  chart_2_size;
  chart_3_size;
  chart_4_size;
  chart_5_size;
  chart_6_size;
  chart_7_size;
  chart_8_size;
  chart_9_size;
  chart_10_size;


  strSelectedOption;
  datFromDate;
  datToDate;

  reportName = '';
  public chart_1_Options: any;
  public chart_2_Options: any;
  public chart_3_Options: any;
  pageTitle = 'Bar Chart';
  public chart_4_Options: any;
  public chart_5_Options: any;
  public chart_6_Options: any;
  public chart_7_Options: any;
  public chart_8_Options: any;
  public chart_9_Options: any;
  public chart_10_Options: any;



  dct_chartData = {};
  dct_chartNames;
  chartName;
  urlName;

  dctDays = { 'Mon': '', 'Tue': '', 'Wed': '', 'Thu': '', 'Fri': '', 'Sat': '', 'Sun': '' };
  blnShowQty = true;

  constructor(private _sharedService: SharedService,
    private serviceObject: ServerService,
    private fb: FormBuilder,
    private typeaheadObject: TypeaheadService,
    public toastr: ToastrModule,
    vcr: ViewContainerRef,
    public router: Router,
    private snotifyService: SnotifyService,
    private chartservice: ChartService,
    
    // private spinnerService: Ng4LoadingSpinnerService,
    private reportComponent: ReportComponent,
    private titlecasePipe: TitleCasePipe, 
    private modalService: NgbModal) {
    // this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

   

    if((this.router.url == '/crm/report/product_profit_report') || (this.router.url == '/crm/report/branch_profit_report') || (this.router.url == '/crm/report/territory_profit_report') || (this.router.url == '/crm/report/zone_profit_report') || (this.router.url == '/crm/report/item_profit_report') || (this.router.url == '/crm/report/price_range_profit_report') ){
      this.blnTemporaryHide = false;
   }
   else {
     this.blnTemporaryHide = true;
   }

   
    
    this.strUrl = window.location.href.split('#')[1];
    this.blnExported = false;
    localStorage.setItem('chartexport','');

    this.chart1Key = 'str_chart1';
    this.chart2Key = 'str_chart2';
    this.chart3Key = 'str_chart3';
    this.chart4Key = 'str_chart4';
    this.chart5Key = 'str_chart5';
    this.chart6Key = 'str_chart6';
    this.chart7Key = 'str_chart7';
    this.chart8Key = 'str_chart8';
    this.chart9Key = 'str_chart9';
    this.chart10Key = 'str_chart10';

    this.blnStaff=false;
    this.blnBranch=false;
    this.blnBrand=false;
    this.blnProduct=false;
    this.blnItem=false;
    // chart table
    // this.dataSource1.sort = this.sort;
    // this.dataSource1.paginator = this.paginator;
    // chart table end here

    this.chartservice.listColor();

    for (let i = this.startDate + 1; i <= (this.startDate + 5); i++) {
      this.year.push(i);

    }

    this.reportName = this.router.url.split('/')[2];
    // this.reportName = 'territoryenquiryreport';
    

    
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.setupChartDetails();
    if (this.reportName == 'branchtargetreport' || this.reportName == 'regiontargetreport' || this.reportName == 'territoryenquiryreport') {
      // this.datFromDate = this.selectedYear + '-07-01';
      // this.datToDate = this.selectedYear + '-09-30';
      this.datFromDate = moment();
      this.datToDate = moment();
      this.showDatewiseTargetData()
    }
    else {
      this.datFromDate = moment();
      this.datToDate = moment();
      this.showDatewiseData(this.datFromDate, this.datToDate);
    }


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
                  staff: string;
                  staffId: number;
                 }>;
               }) => {

                 this.lstStaffs.push(...response.data);
                 this.tempStaff.push(...response.data);
               }
               );
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
                  product: string;
                  productId: number;
                 }>;
               }) => {

                 this.lstProducts.push(...response.data);
                 this.tempProduct.push(...response.data);
               }
               );
           }


         }
       });

       
       this.searchBrand.valueChanges
       .pipe(debounceTime(400))
       .subscribe((strData: string) => {
         if (strData === undefined || strData === null) {
          //  this.productId
           this.lstBrands = [];
         } else {
           if (strData.length >= 1) {
           this.lstBrands = [];
             
             console.log( this.lstProducts," this.productId");
             
             this.serviceObject
               .postData('inventory/api_subcategory_typeahead/', {term: strData})
               .subscribe(
                (response) => {
 
                  this.lstBrands.push(...response['data']);
                  this.tempBrand.push(...response['data']);
                }
                );
 
           }
         }
       }
       );

        
       this.searchItem.valueChanges
       .pipe(debounceTime(400))
       .subscribe((strData: string) => {
         if (strData === undefined || strData === null) {
          //  this.productId
           this.lstItems = [];
          } 
          else {
            if (strData.length >= 1) {
              this.lstItems = [];
             console.log( this.lstProducts," this.productId");
             
             this.serviceObject
               .postData('inventory/item_typeahead/', {term: strData,product:this.selectedProduct,brand:this.selectedBrand})
               .subscribe(
                (response) => {
 
                  this.lstItems.push(...response['data']);
                  this.tempItem.push(...response['data']);
                }
                );
 
           }
         }
       }
       );

  }

  setupChartDetails() {
    const dctJsonData = {};
    dctJsonData['reportname'] = this.reportName;
    this.serviceObject.postData('generalize_report/get_chart_data/', dctJsonData)
      .subscribe(
        (response) => {
          if (response['status'] == 1) {
            this.dct_chartData = response['dct_details'];

            this.chartName = response['name'];
            
            this.urlName = response['url_name'];
           
            if( this.urlName=='indirect_discount_report' || this.urlName=='direct_discount_report'){
              
              this.blnDiscount=true
              this.strHead='Discount'
              console.log("discount", this.blnDiscount);
            } 
            else if (this.urlName=='branch_profit_report' || this.urlName== 'zone_profit_report' || this.urlName== 'territory_profit_report' || this.urlName== 'product_profit_report' || this.urlName== 'item_profit_report' || this.urlName== 'price_range_profit_report'){
              // this.blnQtyShow=false
              this.strHead='Profit'
              this.switch_change="Profit";
            }
            else if (this.urlName=='branch_profit_report'){
              // this.blnQtyShow=false
              this.strHead='Profit'
              this.switch_change="Profit";
            }
            else if (this.urlName=='mobilefinancevstotalsalesreport'){
              this.blnDiscount=true
              this.strHead='Finance Sales'
              this.strHead2=' Total Sales'

            }
            else if (this.urlName=='branch_wise_direct_discount_report' ||this.urlName=='branch_wise_indirect_discount_report' || this.urlName=='branch_wise_total_discount_report' ){
              this.blnDiscount=true
              this.strHead='Discount'
              this.strHead2=' Total Sales'

            }
          
            else if (this.urlName=='smartphonevsgdpsales'){
              this.blnDiscount=true
              this.strHead='SmartPhone Sales'
              this.strHead2='Gdp Sales'

            }
            else{
              this.blnDiscount=false
              this.strHead='Enquiry'
            }

            if (this.urlName == 'genderwisereport' || this.urlName == 'agewisereport' || this.urlName == 'locationwisereport' || this.urlName == 'feedbackanalysis' || this.urlName == 'reward_product_report' || this.urlName=='branch_profit_report' || this.urlName== 'zone_profit_report' || this.urlName== 'territory_profit_report' || this.urlName== 'product_profit_report' || this.urlName== 'item_profit_report' || this.urlName== 'price_range_profit_report' || this.urlName== 'status_report'){
            this.blnShowQty = false;
            }
            if(this.urlName == 'mobileaccessoriessmart'){
              this.strHead='Smartphones';
              this.strHead2='Accessories'
            }
            for (const key in this.dct_chartData) {
              if (this.dct_chartData.hasOwnProperty(key)) {
                const element = this.dct_chartData[key];
                this.displayedColumns.push(element['data']);
                if (key === '1') {

                  this.chart_1_Type = element['type'];
                  this.chart_1_size = element['size'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart1_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart1_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart1_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {

                    this.chart_1_Data = [
                      { data: [], label: element['data'] },
                    ];

                    this.chart_1_Legend = true;
                    this.firstBarChartColor = this.chartservice.barSalesChartColor;
                  }
                  else if (element['type'] == 'grouped_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_1_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];
                    this.chart_1_Legend = true;
                    this.lst_chart_1_labels = element['label'];

                    this.firstBarChartColor = this.chartservice.barSalesChartColor;
                  }
                  else if (element['type'] == 'stacked_bar') {
                    this.chart_1_Data = [
                      { data: [], label: element['label'][1] },
                      { data: [], label: element['label'][0] },
                    ];
                    this.chart_1_Legend = true;
                    this.firstBarChartColor = this.chartservice.stackedbarChartColor;
                  }
                  else {
                    this.chart_1_Data = [];
                    // this.chart_1_Type = element['type'];
                    this.chart_1_Options = this.chartservice.pieOptions;
                  }
                } else if (key === '2') {
                  this.chart_2_size = element['size'];
                  this.chart_2_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart2_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart2_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart2_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_2_Data = [
                      // { data: [], label: element['data'] },
                    ];

                    this.chart_2_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_2_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];

                    this.chart_2_Legend = true;
                    this.lst_chart_2_labels = element['label'];
                  }
                  else {
                    this.chart_2_Data = [];
                    // this.chart_2_Type = element['type'];
                    this.chart_2_Options = this.chartservice.pieOptions;
                  }
                } else if (key === '3') {
                  this.chart_3_size = element['size'];
                  this.chart_3_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart3_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart3_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart3_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_3_Data = [
                      // { data: [], label: element['data'] },
                    ];

                    this.chart_3_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_3_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];

                    this.chart_3_Legend = true;
                    this.lst_chart_3_labels = element['label'];
                  }
                  else {
                    this.chart_3_Data = [];
                    // this.chart_3_Type = element['type'];
                    this.chart_3_Options = this.chartservice.pieOptions;
                  }
                } else if (key === '4') {
                  this.chart_4_size = element['size'];
                  this.chart_4_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart4_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart4_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart4_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_4_Data = [
                      // { data: [], label: element['data'] },
                    ];

                    this.chart_4_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_4_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];

                    this.chart_4_Legend = true;
                    this.lst_chart_4_labels = element['label'];
                  }
                  else {
                    this.chart_4_Data = [];
                    // this.chart_4_Type = element['type'];
                    this.chart_4_Options = this.chartservice.pieOptions;
                  }
                } else if (key === '5') {
                  this.chart_5_size = element['size'];
                  this.chart_5_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart5_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart5_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart5_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_5_Data = [
                      // { data: [], label: element['data'] },
                    ];

                    this.chart_5_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_5_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];

                    this.chart_5_Legend = true;
                    this.lst_chart_5_labels = element['label'];
                  }
                  else {
                    this.chart_5_Data = [];
                    // this.chart_5_Type = element['type'];
                    this.chart_5_Options = this.chartservice.pieOptions;
                  }
                } else if (key === '6') {
                  this.chart_6_size = element['size'];
                  this.chart_6_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart6_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart6_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart6_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_6_Data = [
                      // { data: [], label: element['data'] },
                    ];
                    // this.chart_6_Type = element['type'];
                    this.chart_6_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_6_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];
                    this.chart_6_Legend = true;
                    this.lst_chart_6_labels = element['label'];
                  }
                  else {
                    this.chart_6_Data = [];

                    this.chart_6_Options = this.chartservice.pieOptions;
                  }
                }else if (key === '7') {
                  this.chart_7_size = element['size'];
                  this.chart_7_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart7_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart7_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart7_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_7_Data = [
                      // { data: [], label: element['data'] },
                    ];
                    // this.chart_7_Type = element['type'];
                    this.chart_7_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_7_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];
                    this.chart_7_Legend = true;
                    this.lst_chart_7_labels = element['label'];
                  }
                  else {
                    this.chart_7_Data = [];

                    this.chart_7_Options = this.chartservice.pieOptions;
                  }
                }else if (key === '8') {
                  this.chart_8_size = element['size'];
                  this.chart_8_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart8_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart8_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart8_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_8_Data = [
                      // { data: [], label: element['data'] },
                    ];
                    // this.chart_8_Type = element['type'];
                    this.chart_8_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_8_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];
                    this.chart_8_Legend = true;
                    this.lst_chart_8_labels = element['label'];
                  }
                  else {
                    this.chart_8_Data = [];

                    this.chart_8_Options = this.chartservice.pieOptions;
                  }
                }else if (key === '9') {
                  this.chart_9_size = element['size'];
                  this.chart_9_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart9_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart9_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart9_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_9_Data = [
                      // { data: [], label: element['data'] },
                    ];
                    // this.chart_9_Type = element['type'];
                    this.chart_9_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_9_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];
                    this.chart_9_Legend = true;
                    this.lst_chart_9_labels = element['label'];
                  }
                  else {
                    this.chart_9_Data = [];

                    this.chart_9_Options = this.chartservice.pieOptions;
                  }
                }else if (key === '10') {
                  this.chart_10_size = element['size'];
                  this.chart_10_Type = element['type'];

                  // if(element['size']=='col-lg-6 col-md-12'){
                  //   this.chart10_canvasWidth=485;
                  // }
                  // else if(element['size']=='col-lg-9 col-md-12'){
                  //   this.chart10_canvasWidth=750;
                  // }
                  // else if(element['size']=='col-lg-12 col-md-12'){
                  //   this.chart10_canvasWidth=990;
                  // }

                  if (element['type'] === 'bar') {
                    this.chart_10_Data = [
                      // { data: [], label: element['data'] },
                    ];
                    // this.chart_10_Type = element['type'];
                    this.chart_10_Legend = true;
                  } else if (element['type'] == 'grouped_bar' || element['type'] == 'stacked_bar') {

                    // label of first bar is the first element in the list 'data'
                    this.chart_10_Data = [
                      { data: [], label: element['label'][0] },
                      { data: [], label: element['label'][1] },
                    ];
                    this.chart_10_Legend = true;
                    this.lst_chart_10_labels = element['label'];
                  }
                  else {
                    this.chart_10_Data = [];

                    this.chart_10_Options = this.chartservice.pieOptions;
                  }
                }


              }
            }
          } else {
            this.chart_1_Labels = [];
            this.chart_2_Labels = [];
            this.chart_3_Labels = [];
            this.chart_4_Labels = [];
            this.chart_5_Labels = [];
            this.chart_6_Labels = [];
            this.chart_7_Labels = [];
            this.chart_8_Labels = [];
            this.chart_9_Labels = [];
            this.chart_10_Labels = [];
          }
        },
        (error) => {
        });
        console.log(this.blnQtyShow,"blnQtyShow");
        
  }
  showDatewiseTargetData() {

    this.blnDataLoaded = false;

    const dctJsonData = {};
    dctJsonData['data'] = 'Custom';

    if (this.quarter == 'JAN-MAR') {
      dctJsonData['date_from'] = this.selectedYear + '-01-01';
      dctJsonData['date_to'] = this.selectedYear + '-03-31';
    }
    if (this.quarter == 'APR-JUN') {
      dctJsonData['date_from'] = this.selectedYear + '-04-01';
      dctJsonData['date_to'] = this.selectedYear + '-06-30';
    }
    if (this.quarter == 'JUL-SEPT') {
      dctJsonData['date_from'] = this.selectedYear + '-07-01';
      dctJsonData['date_to'] = this.selectedYear + '-09-30';
    }
    if (this.quarter == 'OCT-DEC') {
      dctJsonData['date_from'] = this.selectedYear + '-10-01';
      dctJsonData['date_to'] = this.selectedYear + '-12-31';
    }


    dctJsonData['company_id'] = localStorage.getItem('companyId')
    dctJsonData['reportname'] = this.reportName;

    // this.spinnerService.show();
    this.showSpinner=true;
    console.log("1");

    this.serviceObject.postData('generalize_report/get_report/', dctJsonData)
      .subscribe(
        (response) => {
          // console.log(response,'sfgdgtds')
          if (response['status'] == 1) {
            // this.spinnerService.hide();
            this.showSpinner=false;


            this.dctReportData = response['data'];
            this.dct_chartNames = response['data_chart'];
            if(this.dctFilter!=null){
            this.dctFilter=response['filter'];
            this.getFilterNames();
            }
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']]).length > 0) {
              this.showAll();
            } else {
              this.chart_1_Labels = [];
              this.chart_2_Labels = [];
              this.chart_3_Labels = [];
              this.chart_4_Labels = [];
              this.chart_5_Labels = [];
              this.chart_6_Labels = [];
              this.chart_7_Labels = [];
              this.chart_8_Labels = [];
              this.chart_9_Labels = [];
              this.chart_10_Labels = [];
            }
          }
        },
        (error) => {
          // this.spinnerService.hide();
          this.showSpinner=false;

        });

  }
  okClicked(fdate, tdate){
    // this.flag=true;
    this.showDatewiseData(fdate, tdate);
  }
  switchChange(){
    if(this.type){
      if(this.urlName=='branch_wise_direct_discount_report' || this.urlName=='branch_wise_indirect_discount_report' || this.urlName=='branch_wise_total_discount_report'){
        this.switch_change="Discount";
      }
      else{
        this.switch_change="Value";
      }
    }
    else{
      this.switch_change="Quantity";
    }
    this.showDatewiseData(this.datFromDate, this.datToDate);
  }
  showDatewiseData(fdate, tdate) {

    this.blnDataLoaded = false;

    if (fdate && tdate) {
      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      // this.selectedFromDate = fdate.format('YYYY-MM-DD');
      this.selectedFromDate = moment(new Date(fdate)).format('YYYY-MM-DD');

      // this.selectedToDate = tdate.format('YYYY-MM-DD');
      this.selectedToDate = moment(new Date(tdate)).format('YYYY-MM-DD');

      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['company_id'] = localStorage.getItem('companyId')
      dctJsonData['reportname'] = this.reportName;
      
      
      dctJsonData['show_type'] = this.type;
      dctJsonData['branchselected'] = this.statusSelected.map(x => x.id);
      dctJsonData['staffsselected'] = this.statusStaffSelected.map(y => y.id);
      dctJsonData['brandsselected'] = this.statusBrandSelected.map(y => y.id);
      dctJsonData['productsselected'] = this.statusProductSelected.map(y => y.id);
      dctJsonData['itemsselected'] = this.statusItemSelected.map(y => y.id);


      // this.expJsondata['tmpdfdate']=fdate.format('DD-MM-YYYY');
      this.expJsondata['tmpdfdate']= moment(new Date(fdate)).format('YYYY-MM-DD');
      
      // this.expJsondata['tmpdtdate']=tdate.format('DD-MM-YYYY');
      this.expJsondata['tmpdtdate']= moment(new Date(tdate)).format('YYYY-MM-DD');
      this.expJsondata['branch']='ALL';
      this.expJsondata['staff']='ALL';
      this.expJsondata['brand']='ALL';
      this.expJsondata['product']='ALL';
      this.expJsondata['item']='ALL';


      // if (this.selectedBranch.length== 0&&this.selectedStaff.length== 0&&this.flag) {
      //   this.snotifyService.error('Select a valid branch or staff, clear the field');

      //   return false;
      // } else


      this.expJsondata['branch']='';
      this.expJsondata['staff']='';
      this.expJsondata['brand']='';
      this.expJsondata['product']='';
      this.expJsondata['item']='';


      for(let st of this.statusStaffSelected){
        this.expJsondata['staff']=this.expJsondata['staff']+' '+st.name;
      }

      for(let st of this.statusBrandSelected){
        this.expJsondata['brand']=this.expJsondata['brand']+' '+st.name;
      }

      for(let st of this.statusItemSelected){
        this.expJsondata['item']=this.expJsondata['item']+' '+st.name;
      }

      for(let st of this.statusProductSelected){
        this.expJsondata['product']=this.expJsondata['product']+' '+st.name;
      }

      if (this.branchName.length > 0) {

        if (this.lstBranches[0]==null) {

          // this.snotifyService.error('Select a valid branch or clear the field');
          Swal.fire('Error','Select a valid branch or clear the field');

          return false;
        }
        var branchFlag =false;
        for (var index = 0; index < this.lstBranches.length; ++index) {

          var bname = this.lstBranches[index];

          if(bname.name == this.branchName){
            branchFlag=true;
            break;
          }
         }
         if(branchFlag==false){
          // this.snotifyService.error('Select a valid branch name or clear the field');

          return false;
         }
         for(let branch of this.statusSelected){
          this.expJsondata['branch']=this.expJsondata['branch']+' '+branch.name;
        }
      }
     else if (this.selectedBranch !== null) {
        dctJsonData['branchselected'] = this.selectedBranch;
        // console.log(this.statusSelected,"branchlist")
        // this.expJsondata['branch']=this.selectedBranch;


 
      }
      else{
        dctJsonData['branchselected'] ='';
      }

      if (this.staffName.length > 0) { //check a value exist in a list of dictionary
        var staffFlag=false;
        for (var index = 0; index < this.tempStaff.length; ++index) {

          var sname = this.tempStaff[index];

          if(sname.name == this.staffName){
            staffFlag=true;
            break;
          }
         }
         if(staffFlag==false){
          // this.snotifyService.error('Select a valid staff name or clear the field');

          return false;
         }

          }
       if (this.selectedStaff !== null) {

            dctJsonData['staffsselected'] = this.selectedStaff;
          }
          else{
            dctJsonData['staffsselected'] ='';
          }


          if (this.brandName.length > 0) { //check a value exist in a list of dictionary
            var brandFlag=false;
            for (var index = 0; index < this.tempBrand.length; ++index) {
    
              var sname = this.tempBrand[index];
    
              if(sname.name == this.brandName){
                brandFlag=true;
                break;
              }
             }
             if(brandFlag==false){
              // this.snotifyService.error('Select a valid Brand name or clear the field');
    
              return false;
             }
    
              }
           if (this.selectedBrand !== null) {
    
                dctJsonData['brandsselected'] = this.selectedBrand;
              }
              else{
                dctJsonData['brandsselected'] ='';
              }



          if (this.itemName.length > 0) { //check a value exist in a list of dictionary
            var itemFlag=false;
            for (var index = 0; index < this.tempItem.length; ++index) {
    
              var sname = this.tempItem[index];
    
              if(sname.name == this.itemName){
                itemFlag=true;
                break;
              }
             }
             if(itemFlag==false){
              // this.snotifyService.error('Select a valid item name or clear the field');
    
              return false;
             }
    
              }
           if (this.selectedItem !== null) {
    
                dctJsonData['itemsselected'] = this.selectedItem;
              }
              else{
                dctJsonData['itemsselected'] ='';
              }


          if (this.productName.length > 0) { //check a value exist in a list of dictionary
            var productFlag=false;
            for (var index = 0; index < this.tempProduct.length; ++index) {
    
              var sname = this.tempProduct[index];
    
              if(sname.name == this.productName){
                productFlag=true;
                break;
              }
             }
             if(productFlag==false){
              // this.snotifyService.error('Select a valid product name or clear the field');
    
              return false;
             }
    
              }
           if (this.selectedProduct !== null) {
    
                dctJsonData['productsselected'] = this.selectedProduct;
              }
              else{
                dctJsonData['productsselected'] ='';
              }


      // this.spinnerService.show();
      this.showSpinner=true;
              console.log("2");
              
      this.serviceObject.postData('generalize_report/get_report/', dctJsonData)
        .subscribe(
          (response) => {
            if (response['status'] == 1) {
              // this.spinnerService.hide();
              this.showSpinner=false;


              this.dctReportData = response['data'];

              this.dct_chartNames = response['data_chart'];

              if(response['filter']!=null){
              this.dctFilter=response['filter'];
              
              this.getFilterNames();
              }

              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']]).length > 0) {
                this.showAll();
              } else {
                this.chart_1_Labels = [];
                this.chart_2_Labels = [];
                this.chart_3_Labels = [];
                this.chart_4_Labels = [];
                this.chart_5_Labels = [];
                this.chart_6_Labels = [];
                this.chart_7_Labels = [];
                this.chart_8_Labels = [];
                this.chart_9_Labels = [];
                this.chart_10_Labels = [];
              }
            }
            else{
              // this.spinnerService.hide();
              this.showSpinner=false;


              this.chart_1_Labels=[];
              this.chart_2_Labels=[];
              this.chart_3_Labels=[];
              this.chart_4_Labels=[];
              this.chart_5_Labels=[];
              this.chart_6_Labels=[];
              this.chart_7_Labels=[];
              this.chart_8_Labels=[];
              this.chart_9_Labels=[];
              this.chart_10_Labels=[];
            }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });
    }
  }




  showAll() {
    // if (!(this.urlName == 'zonesalesreport' || this.urlName == 'territorysalesreport' || this.urlName == 'mobiledaywisereport' || this.urlName == 'mobilesalesdaywisereport'
    // || this.urlName == 'branchenquirydaywisereport' || this.urlName == 'branchsalesdaywisereport' || this.urlName == 'genderwisereport' || this.urlName == 'agewisereport' || this.urlName == 'feedbackanalysis' || this.urlName == 'productstatusreport')) {
    //   this.goodOnClick()
    // }

    
    if (this.chart_1_Type !== 'pie' && this.chart_1_Type !== 'doughnut') {
      this.goodOnClick()
    }

    this.chart2Key = 'str_chart2';
    this.chart3Key = 'str_chart3';
    this.chart4Key = 'str_chart4';
    this.chart5Key = 'str_chart5';
    this.chart6Key = 'str_chart6';
    this.chart7Key = 'str_chart7';
    this.chart8Key = 'str_chart8';
    this.chart9Key = 'str_chart9';
    this.chart10Key = 'str_chart10';

    this.blnGood=true;
    this.blnPoor=true;
    this.strGoodPoor='NORMAL';
    this.selectedOptionChart_5 = '';
    this.selectedOptionChart_1 = '';
    this.selectedOptionChart_2 = '';
    this.selectedOptionChart_3 = '';
    this.selectedOptionChart_4 = '';
    this.selectedOptionChart_6 = '';
    this.selectedOptionChart_7 = '';
    this.selectedOptionChart_8 = '';
    this.selectedOptionChart_9 = '';
    this.selectedOptionChart_10 = '';

    this.chart_1_CurrentIndex = 1;
    // this.chart_1_MaxIndex = 10;
    this.chart_2_CurrentIndex = 1;
    // this.chart_2_MaxIndex = 10;
    this.chart_3_CurrentIndex = 1;
    // this.chart_3_MaxIndex = 10;
    this.chart_4_CurrentIndex = 1;
    // this.chart_4_MaxIndex = 10;
    this.chart_5_CurrentIndex = 1;
    // this.chart_5_MaxIndex = 10;
    this.chart_6_CurrentIndex = 1;
    this.chart_7_CurrentIndex = 1;
    this.chart_8_CurrentIndex = 1;
    this.chart_9_CurrentIndex = 1;
    this.chart_10_CurrentIndex = 1;
    // this.chart_6_MaxIndex = 10;

    // this.showDatewiseData(this.datFromDate, this.datToDate);

    this.expJsondata['chart1']="ALL";
    this.expJsondata['chart2']="ALL";
    this.expJsondata['chart3']="ALL";
    this.expJsondata['chart4']="ALL";
    this.expJsondata['chart5']="ALL";
    this.expJsondata['chart6']="ALL";
    this.expJsondata['chart7']="ALL";
    this.expJsondata['chart8']="ALL";
    this.expJsondata['chart9']="ALL";
    this.expJsondata['chart10']="ALL";


    // assign data to Chart1

    if (this.chart_1_Type === 'bar' || this.chart_1_Type === 'grouped_bar' || this.chart_1_Type === 'stacked_bar') {
      this.chart_1_Labels = [];


      if (this.statusSelected.length > 0) {
        this.selectedBranch = this.statusSelected.map(x => x.id);
      } else {
        this.selectedBranch = [];
      }
      if (this.statusStaffSelected.length > 0) {
        this.selectedStaff = this.statusStaffSelected.map(y => y.id);
      } else {
        this.selectedStaff = [];
      }

      this.chart_1_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']]).length;
      // Day wise report
      if (this.urlName === 'mobiledaywisereport' || this.urlName === 'mobilesalesdaywisereport'
        || this.urlName === 'branchenquirydaywisereport' || this.urlName === 'branchsalesdaywisereport') {
        Object.keys(
          this.dctDays
        ).map((key) => {
          if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
            this.chart_1_Labels.push(key);
          }
        });
      }
      // Day wise report
      // Product Price range report
      // else if (this.urlName === 'mobileproductpricerangereport') {
      //   const dctPriceRange = { '0-2K': '', '2K-5K': '', '5K-10K': '', '10K-15K': '', '15K-20K': '', '20K-25K': '',
      //     '25K-35K': '', '35K-50K':'', '50K+':'' };
      //   Object.keys(
      //     dctPriceRange
      //   ).map((key) => {
      //     if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
      //       this.chart_1_Labels.push(key);
      //     }
      //   });
      // }
      // Product Price range report
      else {
        this.chart_1_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]));
      }
      this.chart_1_LabelsCopy = this.chart_1_Labels;
      this.chart_1_Labels = this.chart_1_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_1_Type === 'grouped_bar') {

        this.chart_1_Data[0].data = [];
        this.chart_1_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        // Day wise report
        if (this.urlName === 'mobilesalesdaywisereport' || this.urlName === 'branchsalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
              this.chart_1_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value2'])
              this.chart_1_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Day wise report
        // Product Price range report
        // else if (this.urlName === 'mobileproductpricerangereport') {
        //   const dctPriceRange = {
        //     '0-2K': '', '2K-5K': '', '5K-10K': '', '10K-15K': '', '15K-20K': '', '20K-25K': '',
        //     '25K-35K': '', '35K-50K': '', '50K+': ''
        //   };
        //   Object.keys(
        //     dctPriceRange
        //   ).map((key) => {
        //     if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
        //       this.chart_1_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value2'])
        //       this.chart_1_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value1'])
        //     }
        //   });
        // }
        // Product Price range report
        else {
         this.chart_1_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex])[key]['Value2'])
        this.chart_1_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex])[key]['Value1'])
        }
        if (this.urlName !== 'mobilesalesdaywisereport' && this.urlName !== 'branchsalesdaywisereport') {
        this.shuffleMulti2(this.chart_1_Labels, this.chart_1_Data[0].data,this.chart_1_Data[1].data, this.chart_1_LabelsCopy);
        }

        this.chart_1_Options = this.chartservice.generalizeBarChartOptions(this.chart_1_LabelsCopy, this.chart_1_Data, this.chart_1_Type, this.lst_chart_1_labels);
        
        setTimeout(() => (this.chart_1_Labels = Object.assign([], this.chart_1_Labels)));
        setTimeout(() => (this.chart_1_Data[0] = Object.assign([], this.chart_1_Data[0])));
        setTimeout(() => (this.chart_1_Data[1] = Object.assign([], this.chart_1_Data[1])));

      }
      else if (this.chart_1_Type === 'stacked_bar') {
        this.chart_1_Data[0].data = [];
        this.chart_1_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        this.chart_1_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex])[key]['Value2'])
        this.chart_1_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex])[key]['Value1'])

          this.shuffleMulti2(this.chart_1_Labels, this.chart_1_Data[0].data,this.chart_1_Data[1].data, this.chart_1_LabelsCopy);

          this.chart_1_Options = this.chartservice.generalizeBarChartOptions(this.chart_1_LabelsCopy, this.chart_1_Data, this.chart_1_Type, this.lst_chart_1_labels);

        }
      else {
        this.chart_1_Data = [];
        // Day wise report
        if (this.urlName === 'mobiledaywisereport' || this.urlName === 'branchenquirydaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
              this.chart_1_Data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Day wise report
        else {
          this.chart_1_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex])[key]['Value1']))
        }
        //this.chart_1_Options={ maxBarThickness: 100}
        if (this.urlName !== 'mobiledaywisereport' && this.urlName !== 'branchenquirydaywisereport') {

          this.shuffleMulti(this.chart_1_Labels, this.chart_1_Data, this.chart_1_LabelsCopy);
        }



      this.chart_1_Options = this.chartservice.generalizeBarChartOptions(this.chart_1_LabelsCopy, this.chart_1_Data, this.chart_1_Type, this.lst_chart_1_labels);




        setTimeout(() => (this.chart_1_Labels = Object.assign([], this.chart_1_Labels)));
        setTimeout(() => (this.chart_1_Data = Object.assign([], this.chart_1_Data)));
      }


      // this.chart_1_Options = this.chartservice.generalizeBarChartOptions(this.chart_1_LabelsCopy, this.chart_1_Data, this.chart_1_Type, this.lst_chart_1_labels);
    } else if (this.chart_1_Type === 'pie' || this.chart_1_Type === 'doughnut') {
      this.chart_1_Labels = [];
      this.chart_1_Data = [];
      this.chart_1_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']]));
      this.chart_1_LabelsCopy = this.chart_1_Labels;
      this.chart_1_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']])[key]['Value1']))
      setTimeout(() => (this.chart_1_Labels = Object.assign([], this.chart_1_Labels)));
      setTimeout(() => (this.chart_1_Data = Object.assign([], this.chart_1_Data)));



    }

    // data to Chart 2
    if (this.chart_2_Type === 'bar' || this.chart_2_Type === 'grouped_bar' || this.chart_2_Type === 'stacked_bar') {
      this.chart_2_Labels = [];

      this.chart_2_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']]).length;
      // Day wise report
      if (this.urlName === 'territoryenquirydaywisereport' || this.urlName === 'territorysalesdaywisereport') {
        Object.keys(
          this.dctDays
        ).map((key) => {
          if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]).includes(key)) {
            this.chart_2_Labels.push(key);
          }
        });
      }
      // Day wise report
      // Product Price range report
      else if (this.urlName === 'mobileproductpricerangereport') {
        
        const dctPriceRange = { '0-2K': '', '2K-5K': '', '5K-10K': '', '10K-15K': '', '15K-20K': '', '20K-25K': '',
          '25K-35K': '', '35K-50K':'', '50K+':'' };
        Object.keys(
          dctPriceRange
        ).map((key) => {
          if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]).includes(key)) {
            this.chart_2_Labels.push(key);
          }
        });
      }
      // Product Price range report
      else {
        this.chart_2_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]));
      }
      this.chart_2_LabelsCopy = this.chart_2_Labels;
      this.chart_2_Labels = this.chart_2_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });
      if (this.chart_2_Type === 'grouped_bar' || this.chart_2_Type === 'stacked_bar') {

        this.chart_2_Data[0].data = [];
        this.chart_2_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        // Day wise report
        if (this.urlName === 'territorysalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]).includes(key)) {
              this.chart_2_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex][key]['Value2'])
              this.chart_2_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Day wise report
        // Product Price range report
        else if (this.urlName === 'mobileproductpricerangereport') {
        
          
                    
          const dctPriceRange = {
            '0-2K': '', '2K-5K': '', '5K-10K': '', '10K-15K': '', '15K-20K': '', '20K-25K': '',
            '25K-35K': '', '35K-50K': '', '50K+': ''
          };
          Object.keys(
            dctPriceRange
          ).map((key) => {
            
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]).includes(key)) {
              this.chart_2_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex][key]['Value2'])
              this.chart_2_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex][key]['Value1'])
            }
          });

          
          
        }
        // Product Price range report
        else {
         this.chart_2_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex])[key]['Value1'])

        this.chart_2_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex])[key]['Value2'])
        }

        
          this.chart_2_Options = this.chartservice.generalizeBarChartOptions(this.chart_2_LabelsCopy, this.chart_2_Data, this.chart_2_Type, this.lst_chart_2_labels);

          setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
        setTimeout(() => (this.chart_2_Data[0] = Object.assign([], this.chart_2_Data[0])));
        setTimeout(() => (this.chart_2_Data[1] = Object.assign([], this.chart_2_Data[1])));
      }
      else {
        this.chart_2_Data = [];
        // Day wise report
        if (this.urlName === 'territoryenquirydaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]).includes(key)) {
              this.chart_2_Data.push(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Day wise report
        else {
        this.chart_2_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex])[key]['Value1']))
        }
          this.chart_2_Options = this.chartservice.generalizeBarChartOptions(this.chart_2_LabelsCopy, this.chart_2_Data, this.chart_2_Type, this.lst_chart_2_labels);

          setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
        setTimeout(() => (this.chart_2_Data = Object.assign([], this.chart_2_Data)));

      }


    } else if (this.chart_2_Type === 'pie' || this.chart_2_Type === 'doughnut') {
      this.chart_2_Labels = [];
      this.chart_2_Data = [];
      this.chart_2_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']]));
      this.chart_2_LabelsCopy = this.chart_2_Labels;
      this.chart_2_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart2']])[key]['Value1']))
      setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
      setTimeout(() => (this.chart_2_Data = Object.assign([], this.chart_2_Data)));
    }


    // assign data to Chart3
    if (this.chart_3_Type === 'bar' || this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {
      this.chart_3_Labels = [];

      this.chart_3_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']]).length;
      // Day wise report
      if (this.urlName === 'zoneenquirydaywisereport' || this.urlName === 'zonesalesdaywisereport') {
        Object.keys(
          this.dctDays
        ).map((key) => {
          if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]).includes(key)) {
            this.chart_3_Labels.push(key);
          }
        });
      }
      // Day wise report
      else {
        this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]));
      }
      this.chart_3_LabelsCopy = this.chart_3_Labels;
      this.chart_3_Labels = this.chart_3_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {
        this.chart_3_Data[0].data = [];
        this.chart_3_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        // Day wise report
        if (this.urlName === 'zonesalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]).includes(key)) {
              this.chart_3_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex][key]['Value2'])
              this.chart_3_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Day wise report
        else {
        this.chart_3_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex])[key]['Value1'])

        this.chart_3_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex])[key]['Value2'])
        }
        setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
        setTimeout(() => (this.chart_3_Data[0] = Object.assign([], this.chart_3_Data[0])));
        setTimeout(() => (this.chart_3_Data[1] = Object.assign([], this.chart_3_Data[1])));
      }
      else {
        this.chart_3_Data = [];
        // Day wise report
        if (this.urlName === 'zoneenquirydaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]).includes(key)) {
              this.chart_3_Data.push(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Day wise report
        else {
        this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex])[key]['Value1']))
        }
        setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
        setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));
      }


      this.chart_3_Options = this.chartservice.generalizeBarChartOptions(this.chart_3_LabelsCopy, this.chart_3_Data, this.chart_3_Type, this.lst_chart_3_labels);
    } else if (this.chart_3_Type === 'pie' || this.chart_3_Type === 'doughnut') {
      this.chart_3_Labels = [];
      this.chart_3_Data = [];
      this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']]));
      this.chart_3_LabelsCopy = this.chart_3_Labels;
      this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart3']])[key]['Value1']))
      setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
      setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));
    }
    // assign data to Chart4
    if (this.chart_4_Type === 'bar' || this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {
      this.chart_4_Labels = [];

      this.chart_4_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']]).length;
      this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex]));
      this.chart_4_LabelsCopy = this.chart_4_Labels;
      this.chart_4_Labels = this.chart_4_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {
        this.chart_4_Data[0].data = [];
        this.chart_4_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        this.chart_4_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex])[key]['Value1'])

        this.chart_4_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex])[key]['Value2'])
        setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
        setTimeout(() => (this.chart_4_Data[0] = Object.assign([], this.chart_4_Data[0])));
        setTimeout(() => (this.chart_4_Data[1] = Object.assign([], this.chart_4_Data[1])));
      }
      else {
        this.chart_4_Data = [];
        this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex])[key]['Value1']))
        setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
        setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
      }


      this.chart_4_Options = this.chartservice.generalizeBarChartOptions(this.chart_4_LabelsCopy, this.chart_4_Data, this.chart_4_Type, this.lst_chart_4_labels);
    } else if (this.chart_4_Type === 'pie' || this.chart_4_Type === 'doughnut') {
      this.chart_4_Labels = [];
      this.chart_4_Data = [];
      this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']]));
      this.chart_4_LabelsCopy = this.chart_4_Labels;
      this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart4']])[key]['Value1']))
      setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
      setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
    }

    // assign data to chart5
    if (this.chart_5_Type === 'bar' || this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
      this.chart_5_Labels = [];

      this.chart_5_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']]).length;
      this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex]));
      this.chart_5_LabelsCopy = this.chart_5_Labels;
      this.chart_5_Labels = this.chart_5_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
        this.chart_5_Data[0].data = [];
        this.chart_5_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        this.chart_5_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex])[key]['Value1'])
        this.chart_5_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex])[key]['Value2'])

        setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
        setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
        setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));
      }
      else {
        this.chart_5_Data = [];
        this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex])[key]['Value1']))
        setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
        setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
      }




      this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data, this.chart_5_Type, this.lst_chart_5_labels);
    } else if (this.chart_5_Type === 'pie' || this.chart_5_Type === 'doughnut') {
      this.chart_5_Labels = [];
      this.chart_5_Data = [];
      this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']]));
      this.chart_5_LabelsCopy = this.chart_5_Labels;
      this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart5']])[key]['Value1']))
      setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
      setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
    }
    // assign data to chart6
    if (this.chart_6_Type === 'bar' || this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
      this.chart_6_Labels = [];

      this.chart_6_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']]).length;
      this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex]));
      this.chart_6_LabelsCopy = this.chart_6_Labels;
      this.chart_6_Labels = this.chart_6_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
        this.chart_6_Data[0].data = [];
        this.chart_6_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        this.chart_6_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex])[key]['Value1'])
        this.chart_6_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex])[key]['Value1'])

        setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
        setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
        setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));
      }
      else {
        this.chart_6_Data = [];
        this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex])[key]['Value1']))

        setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
        setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
      }


      this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data, this.chart_6_Type, this.lst_chart_6_labels);
      this.chart_6_Options.title.text = 'ALL';

    } else if (this.chart_6_Type === 'pie' || this.chart_6_Type === 'doughnut') {
      this.chart_6_Labels = [];
      this.chart_6_Data = [];
      this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']]));
      this.chart_6_LabelsCopy = this.chart_6_Labels;
      this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart6']])[key]['Value1']))
      setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
      setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));


    }

    // assign data to chart7
    if (this.chart_7_Type === 'bar' || this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
      this.chart_7_Labels = [];

      this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']]).length;
      this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex]));
      this.chart_7_LabelsCopy = this.chart_7_Labels;
      this.chart_7_Labels = this.chart_7_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
        this.chart_7_Data[0].data = [];
        this.chart_7_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        this.chart_7_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex])[key]['Value1'])
        this.chart_7_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex])[key]['Value1'])

        setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
        setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
        setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));
      }
      else {
        this.chart_7_Data = [];
        this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex])[key]['Value1']))

        setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
        setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
      }


      this.chart_7_Options = this.chartservice.generalizeBarChartOptions(this.chart_7_LabelsCopy, this.chart_7_Data, this.chart_7_Type, this.lst_chart_7_labels);
      this.chart_7_Options.title.text = 'ALL';

    } else if (this.chart_7_Type === 'pie' || this.chart_7_Type === 'doughnut') {
      this.chart_7_Labels = [];
      this.chart_7_Data = [];
      this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']]));
      this.chart_7_LabelsCopy = this.chart_7_Labels;
      this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart7']])[key]['Value1']))
      setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
      setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));


    }

    // assign data to chart8
    if (this.chart_8_Type === 'bar' || this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
      this.chart_8_Labels = [];

      this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']]).length;
      this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex]));
      this.chart_8_LabelsCopy = this.chart_8_Labels;
      this.chart_8_Labels = this.chart_8_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
        this.chart_8_Data[0].data = [];
        this.chart_8_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        this.chart_8_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex])[key]['Value1'])
        this.chart_8_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex])[key]['Value1'])

        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
        setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));
      }
      else {
        this.chart_8_Data = [];
        this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex])[key]['Value1']))

        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
      }


      this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data, this.chart_8_Type, this.lst_chart_8_labels);
      this.chart_8_Options.title.text = 'ALL';

    } else if (this.chart_8_Type === 'pie' || this.chart_8_Type === 'doughnut') {
      this.chart_8_Labels = [];
      this.chart_8_Data = [];
      this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']]));
      this.chart_8_LabelsCopy = this.chart_8_Labels;
      this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart8']])[key]['Value1']))
      setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
      setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));


    }
    // assign data to chart9
    if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
      this.chart_9_Labels = [];

      this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']]).length;
      this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex]));
      this.chart_9_LabelsCopy = this.chart_9_Labels;
      this.chart_9_Labels = this.chart_9_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Data[0].data = [];
        this.chart_9_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        this.chart_9_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex])[key]['Value1'])
        this.chart_9_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex])[key]['Value1'])

        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
        setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
      }
      else {
        this.chart_9_Data = [];
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex])[key]['Value1']))

        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
      }


      this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
      this.chart_9_Options.title.text = 'ALL';

    } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
      this.chart_9_Labels = [];
      this.chart_9_Data = [];
      this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']]));
      this.chart_9_LabelsCopy = this.chart_9_Labels;
      this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart9']])[key]['Value1']))
      setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
      setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));


    }
    // assign data to chart10
    if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
      this.chart_10_Labels = [];

      this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']]).length;
      this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex]));
      this.chart_10_LabelsCopy = this.chart_10_Labels;
      this.chart_10_Labels = this.chart_10_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Data[0].data = [];
        this.chart_10_Data[1].data = [];
        // value1 assign to first bar value2 assign to second bar
        this.chart_10_Data[0].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex])[key]['Value1'])
        this.chart_10_Data[1].data = (Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex])[key]['Value1'])

        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
        setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
      }
      else {
        this.chart_10_Data = [];
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex])[key]['Value1']))

        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
      }


      this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
      this.chart_10_Options.title.text = 'ALL';

    } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
      this.chart_10_Labels = [];
      this.chart_10_Data = [];
      this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']]));
      this.chart_10_LabelsCopy = this.chart_10_Labels;
      this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']]))
        .map(key => (this.dctReportData[this.dct_chartNames['str_chart10']])[key]['Value1']))
      setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
      setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));


    }

    //  checking whether chart5 and chart6 is empty
    if (this.chart_5_Labels.length > 0) {
      this.chart_5_Options.title.text = 'ALL';
    }
    if (this.chart_6_Labels.length > 0) {
      this.chart_6_Options.title.text = 'ALL';
    }
    if (this.chart_7_Labels.length > 0) {
      this.chart_7_Options.title.text = 'ALL';
    }
    if (this.chart_8_Labels.length > 0) {
      this.chart_8_Options.title.text = 'ALL';
    }
    if (this.chart_9_Labels.length > 0) {
      this.chart_9_Options.title.text = 'ALL';
    }
    if (this.chart_10_Labels.length > 0) {
      this.chart_10_Options.title.text = 'ALL';
    }
    this.chart_2_Options.title.text = 'ALL';
    this.chart_1_Options.title.text = 'ALL';

    if (this.chart_3_Labels.length > 0) {
      this.chart_3_Options.title.text = 'ALL';
    }
    if (this.chart_4_Labels.length > 0) {
      this.chart_4_Options.title.text = 'ALL';
    }


  }

  goodOnClick() {
    this.blnGood = false;
    this.blnPoor = true;
    this.blnActive = true;
    this.strGoodPoor='GOOD';
    this.currentPage=1;
    const dct_data = this.swap(this.dctReportData[this.dct_chartNames['str_chart1']], false);
    this.chart_1_CurrentIndex = 1;


    this.dctReportData[this.dct_chartNames['str_chart1']] = dct_data;

    this.chart_1_Labels = Object.keys(
      dct_data[this.chart_1_CurrentIndex]
    );

    this.chart_1_LabelsCopy = this.chart_1_Labels;
    this.chart_1_Labels = this.chart_1_Labels.map(obj => {
      if (obj.length > 6) {
        obj = obj.slice(0, 5) + '..';
      }
      return obj;
    });


    if(this.chart_1_Type=='bar'){

    this.chart_1_Data = Object.keys(
      dct_data[this.chart_1_CurrentIndex]
    ).map(key => dct_data[this.chart_1_CurrentIndex][key]['Value1']);


    }
    else if(this.chart_1_Type=='grouped_bar'||this.chart_1_Type=='stacked_bar'){



      this.chart_1_Data[0].data = Object.keys(
        dct_data[this.chart_1_CurrentIndex]
      ).map(key => dct_data[this.chart_1_CurrentIndex][key]['Value1']);

      this.chart_1_Data[1].data = Object.keys(
        dct_data[this.chart_1_CurrentIndex]
      ).map(key => dct_data[this.chart_1_CurrentIndex][key]['Value2']);

    }
    this.chart_1_Options = this.chartservice.generalizeBarChartOptions(this.chart_1_LabelsCopy, this.chart_1_Data, this.chart_1_Type, this.lst_chart_1_labels);
    this.chart_1_Options.title.text = 'ALL';


    setTimeout(() => (this.chart_1_Labels = Object.assign([], this.chart_1_Labels)));
    setTimeout(() => (this.chart_1_Data = Object.assign([], this.chart_1_Data)));


  }


  poorOnClick() {
    this.blnGood = true;
    this.blnPoor = false;
    this.blnActive = false;
    this.strGoodPoor='POOR';
    this.currentPage=1;
    const dct_data =
    this.swap(this.dctReportData[this.dct_chartNames['str_chart1']],true);

    this.dctReportData[this.dct_chartNames['str_chart1']] = dct_data;


    this.chart_1_CurrentIndex = 1;
      this.chart_1_Labels = Object.keys(
        dct_data[this.chart_1_CurrentIndex]
      );
      this.chart_1_LabelsCopy = this.chart_1_Labels;
      this.chart_1_Labels = this.chart_1_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        return obj;
      });



      if(this.chart_1_Type=='bar'){
    this.chart_1_Data = Object.keys(
      dct_data[this.chart_1_CurrentIndex]
    ).map(key => dct_data[this.chart_1_CurrentIndex][key]['Value1']);
    }
    else if(this.chart_1_Type=='grouped_bar'||this.chart_1_Type=='stacked_bar'){
      this.chart_1_Data[0].data = Object.keys(
        dct_data[this.chart_1_CurrentIndex]
      ).map(key => dct_data[this.chart_1_CurrentIndex][key]['Value1']);

      this.chart_1_Data[1].data = Object.keys(
        dct_data[this.chart_1_CurrentIndex]
      ).map(key => dct_data[this.chart_1_CurrentIndex][key]['Value2']);

    }
     this.chart_1_Options = this.chartservice.generalizeBarChartOptions(this.chart_1_LabelsCopy, this.chart_1_Data, this.chart_1_Type, this.lst_chart_1_labels);
    this.chart_1_Options.title.text = 'ALL';

    setTimeout(() => (this.chart_1_Labels = Object.assign([], this.chart_1_Labels)));
    setTimeout(() => (this.chart_1_Data = Object.assign([], this.chart_1_Data)));


  }

  swap(lst_data,reverse) {

    const keys = Object.keys(lst_data);
    const len = keys.length-1;
    let data_dict = [];
    for(let i = len;i>-1;i--) {
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

                if(this.chart_1_Type==='bar'){
                  return n1[1]["Value1"] < n2[1]["Value1"] ? -1 : 1;
                }
                else if(this.chart_1_Type==='grouped_bar' || this.chart_1_Type==='stacked_bar'){

                        if(this.dct_chartNames==='demand_item_report'){
                          if (n1[1]['diff'] > n2[1]['diff']) {
                            return -1
                          }else if(n1[1]['diff'] == n2[1]['diff']){
                            return n1[1]['Value1'] > n2[1]['Value1'] ? -1 : 1;
                          } else {
                            return 1;
                          }
                        }
                        else{
                          if(n1[1]['Value2']==n2[1]['Value2']){
                            return n1[1]['Value1'] < n2[1]['Value1'] ? -1 : 1;
                          }
                          else
                          return n1[1]['Value2'] < n2[1]['Value2'] ? -1 : 1;
                        }
                }

        }
      );
    } else {
      data_dict.sort(
        (n1, n2) => {
                      if(this.chart_1_Type==='bar'){
                        return n1[1]["Value1"] > n2[1]["Value1"] ? -1 : 1;
                      }
                      else if(this.chart_1_Type==='grouped_bar' || this.chart_1_Type==='stacked_bar'){
                        if(this.dct_chartNames==='demand_item_report'){
                          if (n1[1]['diff'] < n2[1]['diff']) {
                            return n1[1]['Value1'] < n2[1]['Value1'] ? -1 : 1;
                          }else{
                            return 1;
                          }
                        }
                        else{
                          if(n1[1]['Value2']==n2[1]['Value2']){
                            return n1[1]['Value1'] > n2[1]['Value1'] ? -1 : 1;
                          }
                          else
                          return n1[1]['Value2'] > n2[1]['Value2'] ? -1 : 1;
                        }
                      }
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

  isArray = Array.isArray || function (value) {
    return {}.toString.call(value) !== "[object Array]" };
    shuffleMulti(arr1, arr2, arr3) {
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
      arrLength -= 1;
      rnd = Math.floor(Math.random() * arrLength);

      for (let argsIndex = 0; argsIndex < argsLength; argsIndex += 1) {
        tmp = arguments[argsIndex][arrLength];
        arguments[argsIndex][arrLength] = arguments[argsIndex][rnd];
        arguments[argsIndex][rnd] = tmp;

      }
    }
  }

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

  public chart_1_Clicked(e: any): void {
    if (e.active.length > 0) {
      this.chart2Key = 'str_chart1_chart2';
      this.chart3Key = 'str_chart1_chart3';
      this.chart4Key = 'str_chart1_chart4';
      this.chart5Key = 'str_chart1_chart5';
      this.chart6Key = 'str_chart1_chart6';
      this.chart7Key = 'str_chart1_chart7';
      this.chart8Key = 'str_chart1_chart8';
      this.chart9Key = 'str_chart1_chart9';
      this.chart10Key = 'str_chart1_chart10';

      this.selectedOptionChart_1 = this.chart_1_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_1 = this.chart_1_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_3 = '';
      this.selectedOptionChart_4 = '';
      this.selectedOptionChart_5 = '';
      this.selectedOptionChart_6 = '';
      this.selectedOptionChart_2 = '';
      this.selectedOptionChart_7 = '';
      this.selectedOptionChart_8 = '';
      this.selectedOptionChart_9 = '';
      this.selectedOptionChart_10 = '';
      this.expJsondata['chart1']=this.selectedOptionChart_1;
      console.log(this.selectedOptionChart_1,"chart1");
      
      

      // data to Chart 2
      if (this.chart_2_Type === 'bar' || this.chart_2_Type === 'grouped_bar' || this.chart_2_Type === 'stacked_bar') {

        this.chart_2_Labels = [];

        this.chart_2_CurrentIndex = 1;
        this.chart_2_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1]).length;
        // Day wise report
        if (this.urlName === 'territoryenquirydaywisereport' || this.urlName === 'territorysalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]).includes(key)) {
              this.chart_2_Labels.push(key);
            }
          });
        }
        // Product Price range report
      else if (this.urlName === 'mobileproductpricerangereport') {
        
        const dctPriceRange = { '0-2K': '', '2K-5K': '', '5K-10K': '', '10K-15K': '', '15K-20K': '', '20K-25K': '',
          '25K-35K': '', '35K-50K':'', '50K+':'' };
        Object.keys(
          dctPriceRange
        ).map((key) => {
          if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]).includes(key)) {
            this.chart_2_Labels.push(key);
          }
        });
      }
      // Product Price range report
        // Day wise report
        else {
          this.chart_2_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]));
        }
        this.chart_2_LabelsCopy = this.chart_2_Labels;
        this.chart_2_Labels = this.chart_2_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });
        if (this.chart_2_Type === 'grouped_bar' || this.chart_2_Type === 'stacked_bar') {
          this.chart_2_Data[0].data = [];
          this.chart_2_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          // Day wise report
          if (this.urlName === 'territorysalesdaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]).includes(key)) {
                this.chart_2_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex][key]['Value2'])
                this.chart_2_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report

           // Product Price range report
        else if (this.urlName === 'mobileproductpricerangereport') {
                    
          const dctPriceRange = {
            '0-2K': '', '2K-5K': '', '5K-10K': '', '10K-15K': '', '15K-20K': '', '20K-25K': '',
            '25K-35K': '', '35K-50K': '', '50K+': ''
          };
          Object.keys(
            dctPriceRange
          ).map((key) => {
            
            
            
            
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]).includes(key)) {              
              
              this.chart_2_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex][key]['Value2'])
              this.chart_2_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex][key]['Value1'])
            }
          });

          
          
        }

          else {
          this.chart_2_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex])[key]['Value1']))
          this.chart_2_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex])[key]['Value2']))
          }
          setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
          setTimeout(() => (this.chart_2_Data[0] = Object.assign([], this.chart_2_Data[0])));
          setTimeout(() => (this.chart_2_Data[1] = Object.assign([], this.chart_2_Data[1])));

        }
        else {
          this.chart_2_Data = [];
          // Day wise report
          if (this.urlName === 'territoryenquirydaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]).includes(key)) {
                this.chart_2_Data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_2_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex])[key]['Value1']))
          }
          setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
          setTimeout(() => (this.chart_2_Data = Object.assign([], this.chart_2_Data)));
        }


        this.chart_2_Options = this.chartservice.generalizeBarChartOptions(this.chart_2_LabelsCopy, this.chart_2_Data, this.chart_2_Type, this.lst_chart_2_labels);

        // this.chart_2_Options={  switchhere
        //   maxBarThickness: 7
        // }
        this.chart_2_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_2_Type === 'pie' || this.chart_2_Type === 'doughnut') {
        this.chart_2_Labels = [];
        this.chart_2_Data = [];
        this.chart_2_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1]));
        this.chart_2_LabelsCopy = this.chart_2_Labels;
        this.chart_2_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
        setTimeout(() => (this.chart_2_Data = Object.assign([], this.chart_2_Data)));
        this.chart_2_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }
      // assign data to Chart3
      if (this.chart_3_Type === 'bar' || this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {
        this.chart_3_Labels = [];

        this.chart_3_CurrentIndex = 1;
        this.chart_3_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1]).length;
        // Day wise report
        if (this.urlName === 'zoneenquirydaywisereport' || this.urlName === 'zonesalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]).includes(key)) {
              this.chart_3_Labels.push(key);
            }
          });
        }
        // Day wise report
        else {
          this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]));
        }
        this.chart_3_LabelsCopy = this.chart_3_Labels;
        this.chart_3_Labels = this.chart_3_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {
          this.chart_3_Data[0].data = [];
          this.chart_3_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          // Day wise report
          if (this.urlName === 'zonesalesdaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex][key]['Value2'])
                this.chart_3_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_3_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex])[key]['Value1']))
          this.chart_3_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex])[key]['Value2']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data[0] = Object.assign([], this.chart_3_Data[0])));
          setTimeout(() => (this.chart_3_Data[1] = Object.assign([], this.chart_3_Data[1])));
        }
        else {
          this.chart_3_Data = [];
          // Day wise report
          if (this.urlName === 'zoneenquirydaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
            this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex])[key]['Value1']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));
        }


        this.chart_3_Options = this.chartservice.generalizeBarChartOptions(this.chart_3_LabelsCopy, this.chart_3_Data, this.chart_3_Type, this.lst_chart_3_labels);
        this.chart_3_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_3_Type === 'pie' || this.chart_3_Type === 'doughnut') {
        this.chart_3_Labels = [];
        this.chart_3_Data = [];
        this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1]));
        this.chart_3_LabelsCopy = this.chart_3_Labels;
        this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
        setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));
        this.chart_3_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }
      // assign data to Chart4
      if (this.chart_4_Type === 'bar' || this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {
        this.chart_4_Labels = [];

        this.chart_4_CurrentIndex = 1;
        this.chart_4_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1]).length;
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Labels = this.chart_4_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {
          this.chart_4_Data[0].data = [];
          this.chart_4_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_4_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex])[key]['Value1']))
          this.chart_4_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data[0] = Object.assign([], this.chart_4_Data[0])));
          setTimeout(() => (this.chart_4_Data[1] = Object.assign([], this.chart_4_Data[1])));

        }
        else {
          this.chart_4_Data = [];
          this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        }


        this.chart_4_Options = this.chartservice.generalizeBarChartOptions(this.chart_4_LabelsCopy, this.chart_4_Data, this.chart_4_Type, this.lst_chart_4_labels);
        this.chart_4_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_4_Type === 'pie' || this.chart_4_Type === 'doughnut') {
        this.chart_4_Labels = [];
        this.chart_4_Data = [];
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
        setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        this.chart_4_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }

      // assign data to chart5
      if (this.chart_5_Type === 'bar' || this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
        this.chart_5_Labels = [];

        this.chart_5_CurrentIndex = 1;
        this.chart_5_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1]).length;
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex])[key]['Value1']))
          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));

        }
        else {
          this.chart_5_Data = [];
          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        }


        this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data, this.chart_5_Type, this.lst_chart_5_labels);
        this.chart_5_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_5_Type === 'pie' || this.chart_5_Type === 'doughnut') {
        this.chart_5_Labels = [];
        this.chart_5_Data = [];
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
        setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        this.chart_5_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }
      // assign data to chart6
      if (this.chart_6_Type === 'bar' || this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
        this.chart_6_Labels = [];

        this.chart_6_CurrentIndex = 1;
        this.chart_6_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1]).length;
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex])[key]['Value1']))
          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));
        }
        else {
          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        }

        this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data, this.chart_6_Type, this.lst_chart_6_labels);
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_6_Type === 'pie' || this.chart_6_Type === 'doughnut') {
        this.chart_6_Labels = [];
        this.chart_6_Data = [];
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
        setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }

      // assign data to chart7
      if (this.chart_7_Type === 'bar' || this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
        this.chart_7_Labels = [];

        this.chart_7_CurrentIndex = 1;
        this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1]).length;
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex])[key]['Value1']))
          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));
        }
        else {
          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        }

        this.chart_7_Options = this.chartservice.generalizeBarChartOptions(this.chart_7_LabelsCopy, this.chart_7_Data, this.chart_7_Type, this.lst_chart_7_labels);
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_7_Type === 'pie' || this.chart_7_Type === 'doughnut') {
        this.chart_7_Labels = [];
        this.chart_7_Data = [];
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
        setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }

      // assign data to chart8
      if (this.chart_8_Type === 'bar' || this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
        this.chart_8_Labels = [];

        this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1]).length;
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex])[key]['Value1']))
          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));
        }
        else {
          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        }

        this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data, this.chart_8_Type, this.lst_chart_8_labels);
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_8_Type === 'pie' || this.chart_8_Type === 'doughnut') {
        this.chart_8_Labels = [];
        this.chart_8_Data = [];
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }

      // assign data to chart9
      if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Labels = [];

        this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex])[key]['Value1']))
          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
        }
        else {
          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        }

        this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
        this.chart_9_Labels = [];
        this.chart_9_Data = [];
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }

      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];

        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value1']))
          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        }
        else {
          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }

        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_1);
      }

    }
  }


  public chart_2_Clicked(e: any): void {
    // console.log("hellooo");
    
    if (this.selectedOptionChart_1 === '') {
      this.snotifyService.error('Click '+this.displayedColumns[0]+' chart before ' +this.displayedColumns[1]);
      return;
    }

    if (e.active.length > 0) {
      this.chart3Key = 'str_chart1_chart2_chart3';
      this.chart4Key = 'str_chart1_chart2_chart4';
      this.chart5Key = 'str_chart1_chart2_chart5';
      this.chart6Key = 'str_chart1_chart2_chart6';
      this.chart7Key = 'str_chart1_chart2_chart7';
      this.chart8Key = 'str_chart1_chart2_chart8';
      this.chart9Key = 'str_chart1_chart2_chart9';
      this.chart10Key = 'str_chart1_chart2_chart10';
      
      this.selectedOptionChart_2 = this.chart_2_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_2 = this.chart_2_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_3 = '';
      this.selectedOptionChart_4 = '';
      this.selectedOptionChart_5 = '';
      this.selectedOptionChart_6 = '';
      this.selectedOptionChart_7 = '';
      this.selectedOptionChart_8 = '';
      this.selectedOptionChart_9 = '';
      this.selectedOptionChart_10 = '';

      this.expJsondata['chart2']=this.selectedOptionChart_2;

      console.log(this.selectedOptionChart_2,"chart2");
      


      // assign data to Chart3
      if (this.chart_3_Type === 'bar' || this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {
        this.chart_3_Labels = [];

        this.chart_3_CurrentIndex = 1;
        this.chart_3_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']][this.selectedOptionChart_1][this.selectedOptionChart_2]).length;
        // Day wise report
        if (this.urlName === 'zoneenquirydaywisereport' || this.urlName === 'zonesalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]).includes(key)) {
              this.chart_3_Labels.push(key);
            }
          });
        }
        // Day wise report
        else {
          this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]));
        }
        this.chart_3_LabelsCopy = this.chart_3_Labels;
        this.chart_3_Labels = this.chart_3_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {
          this.chart_3_Data[0].data = [];
          this.chart_3_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          // Day wise report
          if (this.urlName === 'zonesalesdaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
              [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
                [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex][key]['Value2'])
                this.chart_3_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
                [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_3_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex])[key]['Value1']))
          this.chart_3_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex])[key]['Value2']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data[0] = Object.assign([], this.chart_3_Data[0])));
          setTimeout(() => (this.chart_3_Data[1] = Object.assign([], this.chart_3_Data[1])));
        }
        else {

          this.chart_3_Data = [];
          // Day wise report
          if (this.urlName === 'zoneenquirydaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
              [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
                [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
            this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]))
              .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
              [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex])[key]['Value1']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));

        }


        this.chart_3_Options = this.chartservice.generalizeBarChartOptions(this.chart_3_LabelsCopy, this.chart_3_Data, this.chart_3_Type, this.lst_chart_3_labels);
        this.chart_3_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);
      } else if (this.chart_3_Type === 'pie' || this.chart_3_Type === 'doughnut') {
        this.chart_3_Labels = [];
        this.chart_3_Data = [];
        this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]));
        this.chart_3_LabelsCopy = this.chart_3_Labels;
        this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2])[key]['Value1']))
        setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
        setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));
        this.chart_3_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);
      }
      // assign data to Chart4
      if (this.chart_4_Type === 'bar' || this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {
        this.chart_4_Labels = [];

        this.chart_4_CurrentIndex = 1;
        this.chart_4_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']][this.selectedOptionChart_1][this.selectedOptionChart_2]).length;
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Labels = this.chart_4_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {
          this.chart_4_Data[0].data = [];
          this.chart_4_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_4_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex])[key]['Value1']))
          this.chart_4_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data[0] = Object.assign([], this.chart_4_Data[0])));
          setTimeout(() => (this.chart_4_Data[1] = Object.assign([], this.chart_4_Data[1])));
        }
        else {

          this.chart_4_Data = [];
          this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        }


        this.chart_4_Options = this.chartservice.generalizeBarChartOptions(this.chart_4_LabelsCopy, this.chart_4_Data, this.chart_4_Type, this.lst_chart_4_labels);
        this.chart_4_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);
      } else if (this.chart_4_Type === 'pie' || this.chart_4_Type === 'doughnut') {
        this.chart_4_Labels = [];
        this.chart_4_Data = [];
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2])[key]['Value1']))
        setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
        setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        this.chart_4_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);
      }

      // assign data to chart5
      if (this.chart_5_Type === 'bar' || this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
        this.chart_5_Labels = [];

        this.chart_5_CurrentIndex = 1;
        this.chart_5_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']][this.selectedOptionChart_1][this.selectedOptionChart_2]).length;
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex])[key]['Value1']))
          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));

        }
        else {

          this.chart_5_Data = [];
          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));

        }


        this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data, this.chart_5_Type, this.lst_chart_5_labels);
        this.chart_5_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);
      } else if (this.chart_5_Type === 'pie' || this.chart_5_Type === 'doughnut') {
        this.chart_5_Labels = [];
        this.chart_5_Data = [];
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2])[key]['Value1']))
        setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
        setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        this.chart_5_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);
      }
      // assign data to chart6
      if (this.chart_6_Type === 'bar' || this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
        this.chart_6_Labels = [];

        this.chart_6_CurrentIndex = 1;
        this.chart_6_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]).length;
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex])[key]['Value1']))
          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));
        }
        else {

          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));

        }


        this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data, this.chart_6_Type, this.lst_chart_6_labels);
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      } else if (this.chart_6_Type === 'pie' || this.chart_6_Type === 'doughnut') {
        this.chart_6_Labels = [];
        this.chart_6_Data = [];
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2])[key]['Value1']))
        setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
        setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      }

      // assign data to chart7
      if (this.chart_7_Type === 'bar' || this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
        this.chart_7_Labels = [];

        this.chart_7_CurrentIndex = 1;
        this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]).length;
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex])[key]['Value1']))
          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));
        }
        else {

          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));

        }


        this.chart_7_Options = this.chartservice.generalizeBarChartOptions(this.chart_7_LabelsCopy, this.chart_7_Data, this.chart_7_Type, this.lst_chart_7_labels);
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      } else if (this.chart_7_Type === 'pie' || this.chart_7_Type === 'doughnut') {
        this.chart_7_Labels = [];
        this.chart_7_Data = [];
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2])[key]['Value1']))
        setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
        setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      }
      // assign data to chart8
      if (this.chart_8_Type === 'bar' || this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
        this.chart_8_Labels = [];

        this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]).length;
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex])[key]['Value1']))
          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));
        }
        else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));

        }


        this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data, this.chart_8_Type, this.lst_chart_8_labels);
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      } else if (this.chart_8_Type === 'pie' || this.chart_8_Type === 'doughnut') {
        this.chart_8_Labels = [];
        this.chart_8_Data = [];
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2])[key]['Value1']))
        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      }

      // assign data to chart9
      if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Labels = [];

        this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex])[key]['Value1']))
          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
        }
        else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }


        this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
        this.chart_9_Labels = [];
        this.chart_9_Data = [];
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2])[key]['Value1']))
        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      }

      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];

        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex])[key]['Value1']))
          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        }
        else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }


        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_2);

      }

    }
  }
  public chart_3_Clicked(e: any): void {

    // if (this.selectedOptionChart_1 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[0]+' chart before ' +this.displayedColumns[2]);
    //   return;
    // } else
     if (this.selectedOptionChart_2 === '') {

      this.snotifyService.error('Click '+this.displayedColumns[1]+' chart before ' +this.displayedColumns[2]);

      // this.snotifyService.error('Click second chart before third.');
      return;
    }

    if (e.active.length > 0) {
      this.chart4Key = 'str_chart1_chart2_chart3_chart4';
      this.chart5Key = 'str_chart1_chart2_chart3_chart5';
      this.chart6Key = 'str_chart1_chart2_chart3_chart6';
      this.chart7Key = 'str_chart1_chart2_chart3_chart7';
      this.chart8Key = 'str_chart1_chart2_chart3_chart8';
      this.chart9Key = 'str_chart1_chart2_chart3_chart9';
      this.chart10Key = 'str_chart1_chart2_chart3_chart10';

      this.selectedOptionChart_3 = this.chart_3_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_4 = '';
      this.selectedOptionChart_5 = '';
      this.selectedOptionChart_6 = '';
      this.selectedOptionChart_7 = '';
      this.selectedOptionChart_8 = '';
      this.selectedOptionChart_9 = '';
      this.selectedOptionChart_10 = '';

      this.expJsondata['chart3']=this.selectedOptionChart_3;
      console.log(this.selectedOptionChart_3,"chart3");

      // assign data to Chart4
      if (this.chart_4_Type === 'bar' || this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {
        this.chart_4_Labels = [];

        this.chart_4_CurrentIndex = 1;
        this.chart_4_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]).length;
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Labels = this.chart_4_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {
          this.chart_4_Data[0].data = [];
          this.chart_4_Data[1].data = [];
          this.chart_4_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex])[key]['Value1']))

          this.chart_4_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data[0] = Object.assign([], this.chart_4_Data[0])));
          setTimeout(() => (this.chart_4_Data[1] = Object.assign([], this.chart_4_Data[1])));
        }
        else {
          this.chart_4_Data = [];
          this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));

        }


        this.chart_4_Options = this.chartservice.generalizeBarChartOptions(this.chart_4_LabelsCopy, this.chart_4_Data, this.chart_4_Type, this.lst_chart_4_labels);
        this.chart_4_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);

      } else if (this.chart_4_Type === 'pie' || this.chart_4_Type === 'doughnut') {
        this.chart_4_Labels = [];
        this.chart_4_Data = [];
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3])[key]['Value1']))
        setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
        setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        this.chart_4_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);

      }

      // assign data to chart5
      if (this.chart_5_Type === 'bar' || this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
        this.chart_5_Labels = [];

        this.chart_5_CurrentIndex = 1;
        this.chart_5_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]).length;
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex])[key]['Value1']))
          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));
        }
        else {

          this.chart_5_Data = [];
          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        }


        this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data, this.chart_5_Type, this.lst_chart_5_labels);
        this.chart_5_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      } else if (this.chart_5_Type === 'pie' || this.chart_5_Type === 'doughnut') {
        this.chart_5_Labels = [];
        this.chart_5_Data = [];
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3])[key]['Value1']))
        setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
        setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        this.chart_5_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      }
      // assign data to chart6
      if (this.chart_6_Type === 'bar' || this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
        this.chart_6_Labels = [];

        this.chart_6_CurrentIndex = 1;
        this.chart_6_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]).length;
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex])[key]['Value1']))
          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));

        }
        else {

          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));

        }


        this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data, this.chart_6_Type, this.lst_chart_6_labels);
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      } else if (this.chart_6_Type === 'pie' || this.chart_6_Type === 'doughnut') {
        this.chart_6_Labels = [];
        this.chart_6_Data = [];
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3])[key]['Value1']))
        setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
        setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      }


      // assign data to chart7
      if (this.chart_7_Type === 'bar' || this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
        this.chart_7_Labels = [];

        this.chart_7_CurrentIndex = 1;
        this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]).length;
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex])[key]['Value1']))
          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));

        }
        else {

          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));

        }


        this.chart_7_Options = this.chartservice.generalizeBarChartOptions(this.chart_7_LabelsCopy, this.chart_7_Data, this.chart_7_Type, this.lst_chart_7_labels);
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      } else if (this.chart_7_Type === 'pie' || this.chart_7_Type === 'doughnut') {
        this.chart_7_Labels = [];
        this.chart_7_Data = [];
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3])[key]['Value1']))
        setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
        setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      }

      // assign data to chart8
      if (this.chart_8_Type === 'bar' || this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
        this.chart_8_Labels = [];

        this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]).length;
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex])[key]['Value1']))
          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));

        }
        else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));

        }


        this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data, this.chart_8_Type, this.lst_chart_8_labels);
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      } else if (this.chart_8_Type === 'pie' || this.chart_8_Type === 'doughnut') {
        this.chart_8_Labels = [];
        this.chart_8_Data = [];
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3])[key]['Value1']))
        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      }

      // assign data to chart9
      if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Labels = [];

        this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex])[key]['Value1']))
          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        }
        else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }


        this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
        this.chart_9_Labels = [];
        this.chart_9_Data = [];
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3])[key]['Value1']))
        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      }

      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];

        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex])[key]['Value1']))
          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        }
        else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }


        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_3);
      }

    }
  }


  public chart_4_Clicked(e: any): void {
    // if (this.selectedOptionChart_1 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[0]+' chart before ' +this.displayedColumns[1]);

    //   // this.snotifyService.error('Click first chart before second.');
    //   return;
    // } else if (this.selectedOptionChart_2 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[1]+' chart before ' +this.displayedColumns[2]);

    //   // this.snotifyService.error('Click second before third.');
    //   return;
    // } else
    if (this.selectedOptionChart_3 === '') {
      this.snotifyService.error('Click '+this.displayedColumns[2]+' chart before ' +this.displayedColumns[3]);

      // this.snotifyService.error('Click third chart before fourth.');
      return;
    }

    if (e.active.length > 0) {
      this.chart5Key = 'str_chart1_chart2_chart3_chart4_chart5';
      this.chart6Key = 'str_chart1_chart2_chart3_chart4_chart6';
      this.chart7Key = 'str_chart1_chart2_chart3_chart4_chart7';
      this.chart8Key = 'str_chart1_chart2_chart3_chart4_chart8';
      this.chart9Key = 'str_chart1_chart2_chart3_chart4_chart9';
      this.chart10Key = 'str_chart1_chart2_chart3_chart4_chart10';

      this.selectedOptionChart_4 = this.chart_4_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_5 = '';
      this.selectedOptionChart_6 = '';
      this.selectedOptionChart_7 = '';
      this.selectedOptionChart_8 = '';
      this.selectedOptionChart_9 = '';
      this.selectedOptionChart_10 = '';

      this.expJsondata['chart4']=this.selectedOptionChart_4;
      console.log(this.selectedOptionChart_4,"chart4");

      // assign data to chart5
      if (this.chart_5_Type === 'bar' || this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
        this.chart_5_Labels = [];

        this.chart_5_CurrentIndex = 1;
        this.chart_5_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]).length;
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {
          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex])[key]['Value1']))
          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));
        }
        else {

          this.chart_5_Data = [];
          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        }


        this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data, this.chart_5_Type, this.lst_chart_5_labels);
        this.chart_5_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      } else if (this.chart_5_Type === 'pie' || this.chart_5_Type === 'doughnut') {
        this.chart_5_Labels = [];
        this.chart_5_Data = [];
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4])[key]['Value1']))
        setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
        setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        this.chart_5_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      }
      // assign data to chart6
      if (this.chart_6_Type === 'bar' || this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
        this.chart_6_Labels = [];


        this.chart_6_CurrentIndex = 1;
        this.chart_6_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]).length;
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex])[key]['Value1']))
          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));
        }
        else {

          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        }


        this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data, this.chart_6_Type, this.lst_chart_6_labels);
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      } else if (this.chart_6_Type === 'pie' || this.chart_6_Type === 'doughnut') {
        this.chart_6_Labels = [];
        this.chart_6_Data = [];
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4])[key]['Value1']))
        setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
        setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      }


      // assign data to chart7
      if (this.chart_7_Type === 'bar' || this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
        this.chart_7_Labels = [];


        this.chart_7_CurrentIndex = 1;
        this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]).length;
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex])[key]['Value1']))
          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));
        }
        else {

          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        }


        this.chart_7_Options = this.chartservice.generalizeBarChartOptions(this.chart_7_LabelsCopy, this.chart_7_Data, this.chart_7_Type, this.lst_chart_7_labels);
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      } else if (this.chart_7_Type === 'pie' || this.chart_7_Type === 'doughnut') {
        this.chart_7_Labels = [];
        this.chart_7_Data = [];
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4])[key]['Value1']))
        setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
        setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      }

      // assign data to chart8
      if (this.chart_8_Type === 'bar' || this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
        this.chart_8_Labels = [];


        this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]).length;
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex])[key]['Value1']))
          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));
        }
        else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        }


        this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data, this.chart_8_Type, this.lst_chart_8_labels);
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      } else if (this.chart_8_Type === 'pie' || this.chart_8_Type === 'doughnut') {
        this.chart_8_Labels = [];
        this.chart_8_Data = [];
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4])[key]['Value1']))
        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      }

      // assign data to chart9
      if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Labels = [];


        this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex])[key]['Value1']))
          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
        }
        else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        }


        this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
        this.chart_9_Labels = [];
        this.chart_9_Data = [];
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4])[key]['Value1']))
        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      }

      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];


        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex])[key]['Value1']))
          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        }
        else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }


        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_4);
      }

    }
  }

  public chart_5_Clicked(e: any): void {
    // if (this.selectedOptionChart_1 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[0]+' chart before ' +this.displayedColumns[1]);

    //   // this.snotifyService.error('Click first chart before second.');
    //   return;
    // } else if (this.selectedOptionChart_2 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[1]+' chart before ' +this.displayedColumns[2]);

    //   // this.snotifyService.error('Click second chart before third.');
    //   return;
    // } else if (this.selectedOptionChart_3 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[2]+' chart before ' +this.displayedColumns[3]);

    //   // this.snotifyService.error('Click third chart before fourth.');
    //   return;
    // } else
    if (this.selectedOptionChart_4 === '') {
      this.snotifyService.error('Click '+this.displayedColumns[3]+' chart before ' +this.displayedColumns[4]);

      // this.snotifyService.error('Click fourth chart before fifth.');
      return;
    }

    if (e.active.length > 0) {
      this.chart6Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6';
      this.chart7Key = 'str_chart1_chart2_chart3_chart4_chart5_chart7';
      this.chart8Key = 'str_chart1_chart2_chart3_chart4_chart5_chart8';
      this.chart9Key = 'str_chart1_chart2_chart3_chart4_chart5_chart9';
      this.chart10Key = 'str_chart1_chart2_chart3_chart4_chart5_chart10';

      this.selectedOptionChart_5 = this.chart_5_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_6 = '';
      this.selectedOptionChart_7 = '';
      this.selectedOptionChart_8 = '';
      this.selectedOptionChart_9 = '';
      this.selectedOptionChart_10 = '';
      this.expJsondata['chart5']=this.selectedOptionChart_5;
      // console.log(this.selectedOptionChart_5,"chart5")
      // assign data to chart6
      if (this.chart_6_Type === 'bar' || this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
        this.chart_6_Labels = [];

        this.chart_6_CurrentIndex = 1;
        this.chart_6_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {
          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex])[key]['Value1']))

          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));
        }
        else {

          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        }


        this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data, this.chart_6_Type, this.lst_chart_6_labels);
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      } else if (this.chart_6_Type === 'pie' || this.chart_6_Type === 'doughnut') {
        this.chart_6_Labels = [];
        this.chart_6_Data = [];
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5])[key]['Value1']))
        setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
        setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        this.chart_6_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      }

      // assign data to chart7
      if (this.chart_7_Type === 'bar' || this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
        this.chart_7_Labels = [];

        this.chart_7_CurrentIndex = 1;
        this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex])[key]['Value1']))

          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));
        }
        else {

          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        }


        this.chart_7_Options = this.chartservice.generalizeBarChartOptions(this.chart_7_LabelsCopy, this.chart_7_Data, this.chart_7_Type, this.lst_chart_7_labels);
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      } else if (this.chart_7_Type === 'pie' || this.chart_7_Type === 'doughnut') {
        this.chart_7_Labels = [];
        this.chart_7_Data = [];
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5])[key]['Value1']))
        setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
        setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      }

      // assign data to chart8
      if (this.chart_8_Type === 'bar' || this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
        this.chart_8_Labels = [];

        this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));
        }
        else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        }


        this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data, this.chart_8_Type, this.lst_chart_8_labels);
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      } else if (this.chart_8_Type === 'pie' || this.chart_8_Type === 'doughnut') {
        this.chart_8_Labels = [];
        this.chart_8_Data = [];
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5])[key]['Value1']))
        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      }

      // assign data to chart9
      if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Labels = [];

        this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
        }
        else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        }


        this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
        this.chart_9_Labels = [];
        this.chart_9_Data = [];
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5])[key]['Value1']))
        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      }

      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];

        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        }
        else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }


        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_5);
      }

    }
  }


  public chart_6_Clicked(e: any): void {
    // if (this.selectedOptionChart_1 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[0]+' chart before ' +this.displayedColumns[1]);

    //   // this.snotifyService.error('Click first chart before second.');
    //   return;
    // } else if (this.selectedOptionChart_2 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[1]+' chart before ' +this.displayedColumns[2]);

    //   // this.snotifyService.error('Click second chart before third.');
    //   return;
    // } else if (this.selectedOptionChart_3 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[2]+' chart before ' +this.displayedColumns[3]);

    //   // this.snotifyService.error('Click third chart before fourth.');
    //   return;
    // } else if (this.selectedOptionChart_4 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[3]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click fourth chart before fifth.');
    //   return;
    // }else
    if (this.selectedOptionChart_5 === '') {
      this.snotifyService.error('Click '+this.displayedColumns[4]+' chart before ' +this.displayedColumns[5]);

      // this.snotifyService.error('Click fifth chart before fifth.');
      return;
    }

    if (e.active.length > 0) {
      this.chart7Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart7';
      this.chart8Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart8';
      this.chart9Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart9';
      this.chart10Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart10';
      // this.selectedOptionChart_5 = this.chart_5_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_6 = this.chart_6_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_7 = '';
      this.selectedOptionChart_8 = '';
      this.selectedOptionChart_9 = '';
      this.selectedOptionChart_10 = '';
      
      this.expJsondata['chart6']=this.selectedOptionChart_6;
      // console.log(this.selectedOptionChart_6,"chart6");


      // assign data to chart7
      if (this.chart_7_Type === 'bar' || this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
        this.chart_7_Labels = [];

        this.chart_7_CurrentIndex = 1;
        this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]).length;

        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex]));

        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {
          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex])[key]['Value1']))


          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));
        }
        else {

          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.chart_7_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        }


        this.chart_7_Options = this.chartservice.generalizeBarChartOptions(this.chart_7_LabelsCopy, this.chart_7_Data, this.chart_7_Type, this.lst_chart_7_labels);
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_6);
      } else if (this.chart_7_Type === 'pie' || this.chart_7_Type === 'doughnut') {
        this.chart_7_Labels = [];
        this.chart_7_Data = [];
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6])[key]['Value1']))
        setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
        setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        this.chart_7_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_6);
      }
      // assign data to chart8
      if (this.chart_8_Type === 'bar' || this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
        this.chart_8_Labels = [];

        this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]).length;

        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex]));

        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex])[key]['Value1']))


          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));
        }
        else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        }


        this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data, this.chart_8_Type, this.lst_chart_8_labels);
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_6);
      } else if (this.chart_8_Type === 'pie' || this.chart_8_Type === 'doughnut') {
        this.chart_8_Labels = [];
        this.chart_8_Data = [];
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6])[key]['Value1']))
        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_6);
      }
      // assign data to chart9
      if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Labels = [];

        this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]).length;

        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex]));

        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex])[key]['Value1']))


          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
        }
        else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        }


        this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_6);
      } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
        this.chart_9_Labels = [];
        this.chart_9_Data = [];
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6])[key]['Value1']))
        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_6);
      }

      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];

        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]).length;

        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex]));

        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex])[key]['Value1']))


          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        }
        else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }


        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_6);
      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_6);
      }

    }
  }

  public chart_7_Clicked(e: any): void {
    // if (this.selectedOptionChart_1 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[0]+' chart before ' +this.displayedColumns[1]);

    //   // this.snotifyService.error('Click first chart before second.');
    //   return;
    // } else if (this.selectedOptionChart_2 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[1]+' chart before ' +this.displayedColumns[2]);

    //   // this.snotifyService.error('Click second chart before third.');
    //   return;
    // } else if (this.selectedOptionChart_3 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[2]+' chart before ' +this.displayedColumns[3]);

    //   // this.snotifyService.error('Click third chart before fourth.');
    //   return;
    // } else if (this.selectedOptionChart_4 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[3]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click fourth chart before fifth.');
    //   return;
    // }else if (this.selectedOptionChart_5 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[4]+' chart before ' +this.displayedColumns[5]);

    //   // this.snotifyService.error('Click fifth chart before fifth.');
    //   return;
    // }else
    if (this.selectedOptionChart_6 === '') {
      this.snotifyService.error('Click '+this.displayedColumns[5]+' chart before ' +this.displayedColumns[6]);

      // this.snotifyService.error('Click sixth chart before fifth.');
      return;
    }

    if (e.active.length > 0) {
      this.chart8Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8';
      this.chart9Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9';
      this.chart10Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10';

      this.selectedOptionChart_7 = this.chart_7_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_8 = '';
      this.selectedOptionChart_9 = '';
      this.selectedOptionChart_10 = '';
      this.expJsondata['chart7']=this.selectedOptionChart_7;
      // console.log(this.selectedOptionChart_7,"chart7");

      // assign data to chart8
      if (this.chart_8_Type === 'bar' || this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
        this.chart_8_Labels = [];

        this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7]).length;

        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_8_CurrentIndex]));

        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {
          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_8_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_8_CurrentIndex])[key]['Value1']))


          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_8_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));
        }
        else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7]
            [this.chart_8_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        }


        this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data, this.chart_8_Type, this.lst_chart_8_labels);
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_7);
      } else if (this.chart_8_Type === 'pie' || this.chart_8_Type === 'doughnut') {
        this.chart_8_Labels = [];
        this.chart_8_Data = [];
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7])[key]['Value1']))
        setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
        setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        this.chart_8_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_7);
      }

      // assign data to chart9
      if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Labels = [];

        this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7]).length;

        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_9_CurrentIndex]));

        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_9_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_9_CurrentIndex])[key]['Value1']))


          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_9_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
        }
        else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7]
            [this.chart_9_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        }


        this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_7);
      } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
        this.chart_9_Labels = [];
        this.chart_9_Data = [];
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7])[key]['Value1']))
        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_7);
      }

      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];

        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7]).length;

        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_10_CurrentIndex]));

        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_10_CurrentIndex])[key]['Value1']))


          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        }
        else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7]
            [this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }


        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_7);
      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_7);
      }

    }
  }

  public chart_8_Clicked(e: any): void {
    // if (this.selectedOptionChart_1 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[0]+' chart before ' +this.displayedColumns[1]);

    //   // this.snotifyService.error('Click first chart before second.');
    //   return;
    // } else if (this.selectedOptionChart_2 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[1]+' chart before ' +this.displayedColumns[2]);

    //   // this.snotifyService.error('Click second chart before third.');
    //   return;
    // } else if (this.selectedOptionChart_3 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[2]+' chart before ' +this.displayedColumns[3]);

    //   // this.snotifyService.error('Click third chart before fourth.');
    //   return;
    // } else if (this.selectedOptionChart_4 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[3]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click fourth chart before fifth.');
    //   return;
    // }else if (this.selectedOptionChart_5 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[4]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click fifth chart before fifth.');
    //   return;
    // }else if (this.selectedOptionChart_6 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[5]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click sixth chart before fifth.');
    //   return;
    // }else
     if (this.selectedOptionChart_7 === '') {
      this.snotifyService.error('Click '+this.displayedColumns[6]+' chart before ' +this.displayedColumns[7]);

      // this.snotifyService.error('Click seventh chart before fifth.');
      return;
    }

    if (e.active.length > 0) {
      this.chart9Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9';
      this.chart10Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10';

      this.selectedOptionChart_8 = this.chart_8_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_9 = '';
      this.selectedOptionChart_10 = '';

      this.expJsondata['chart8']=this.selectedOptionChart_8;
      // console.log(this.selectedOptionChart_8,"chart8");

      // assign data to chart9
      if (this.chart_9_Type === 'bar' || this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
        this.chart_9_Labels = [];

        this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]).length;

        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex]));

        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {
          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex])[key]['Value1']))


          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
        }
        else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5]
            [this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8]
            [this.chart_9_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        }


        this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data, this.chart_9_Type, this.lst_chart_9_labels);
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_8);
      } else if (this.chart_9_Type === 'pie' || this.chart_9_Type === 'doughnut') {
        this.chart_9_Labels = [];
        this.chart_9_Data = [];
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8])[key]['Value1']))
        setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
        setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        this.chart_9_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_8);
      }
      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];

        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]).length;

        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex]));

        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex])[key]['Value1']))


          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        }
        else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5]
            [this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8]
            [this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }


        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_8);
      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_8);
      }

    }
  }

  public chart_9_Clicked(e: any): void {
    // if (this.selectedOptionChart_1 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[0]+' chart before ' +this.displayedColumns[1]);

    //   // this.snotifyService.error('Click first chart before second.');
    //   return;
    // } else if (this.selectedOptionChart_2 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[1]+' chart before ' +this.displayedColumns[2]);

    //   // this.snotifyService.error('Click second chart before third.');
    //   return;
    // } else if (this.selectedOptionChart_3 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[2]+' chart before ' +this.displayedColumns[3]);

    //   // this.snotifyService.error('Click third chart before fourth.');
    //   return;
    // } else if (this.selectedOptionChart_4 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[3]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click fourth chart before fifth.');
    //   return;
    // }else if (this.selectedOptionChart_5 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[4]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click fifth chart before fifth.');
    //   return;
    // }else if (this.selectedOptionChart_6 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[5]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click sixth chart before fifth.');
    //   return;
    // }else if (this.selectedOptionChart_7 === '') {
    //   this.snotifyService.error('Click '+this.displayedColumns[6]+' chart before ' +this.displayedColumns[4]);

    //   // this.snotifyService.error('Click seventh chart before fifth.');
    //   return;
    // }else
    if (this.selectedOptionChart_8 === '') {
      this.snotifyService.error('Click '+this.displayedColumns[7]+' chart before ' +this.displayedColumns[8]);

      // this.snotifyService.error('Click seventh chart before fifth.');
      return;
    }

    if (e.active.length > 0) {
      this.chart10Key = 'str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10';
      
      this.selectedOptionChart_9 = this.chart_9_LabelsCopy[e.active[0]._index];
      this.selectedOptionChart_10 = '';

      this.expJsondata['chart9']=this.selectedOptionChart_9;
      // console.log(this.selectedOptionChart_9,"chart9");

      // assign data to chart10
      if (this.chart_10_Type === 'bar' || this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
        this.chart_10_Labels = [];

        this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]).length;

        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex]));

        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {
          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];
          // value1 assign to first bar value2 assign to second bar
          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex]))
            .map(key => (
              this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex])[key]['Value1']))


          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        }
        else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5]
            [this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8]
            [this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }


        this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data, this.chart_10_Type, this.lst_chart_10_labels);
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_8);
      } else if (this.chart_10_Type === 'pie' || this.chart_10_Type === 'doughnut') {
        this.chart_10_Labels = [];
        this.chart_10_Data = [];
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]))
          .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8])[key]['Value1']))
        setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
        setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        this.chart_10_Options.title.text = this.titlecasePipe.transform(this.selectedOptionChart_8);
      }
    }
  }


  moveBar(type: string, direction: string) {
    if (type === 'chart_1') {
      if (direction === 'left') {
        if (this.chart_1_CurrentIndex > 1) {
          this.chart_1_CurrentIndex -= 1;
        } else {
          this.chart_1_CurrentIndex = this.chart_1_MaxIndex;
        }
      } else {
        if (this.chart_1_CurrentIndex < this.chart_1_MaxIndex) {
          this.chart_1_CurrentIndex += 1;
        } else {
          this.chart_1_CurrentIndex = 1;
        }
      }
      this.currentPage=this.chart_1_CurrentIndex;
      this.chart_1_Labels = [];
      // Day wise report
      if (this.urlName === 'mobiledaywisereport' || this.urlName === 'mobilesalesdaywisereport'
        || this.urlName === 'branchenquirydaywisereport' || this.urlName === 'branchsalesdaywisereport') {
        Object.keys(
          this.dctDays
        ).map((key) => {
          if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
            this.chart_1_Labels.push(key);
          }
        });
      }
      // Day wise report
      // Product Price range report
      else if (this.urlName === 'mobileproductpricerangereport') {
        const dctPriceRange = {
          '0-2K': '', '2K-5K': '', '5K-10K': '', '10K-15K': '', '15K-20K': '', '20K-25K': '',
          '25K-35K': '', '35K-50K': '', '50K+': ''
        };
        Object.keys(
          dctPriceRange
        ).map((key) => {
          if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
            this.chart_1_Labels.push(key);
          }
        });
      }
      // Product Price range report
      else {
        this.chart_1_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]));
      }
      this.chart_1_LabelsCopy = this.chart_1_Labels;
      this.chart_1_Labels = this.chart_1_Labels.map(obj => {
        if (obj.length > 6) {
          obj = obj.slice(0, 5) + '..';
        }
        obj = this.titlecasePipe.transform(obj);
        return obj;
      });

      if (this.chart_1_Type === 'grouped_bar' || this.chart_1_Type === 'stacked_bar') {
        this.chart_1_Data[0].data = [];
        this.chart_1_Data[1].data = [];

        // Day wise report
        if (this.urlName === 'mobilesalesdaywisereport' || this.urlName === 'branchsalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
              this.chart_1_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value2'])
              this.chart_1_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Day wise report
        // Product Price range report
        else if (this.urlName === 'mobileproductpricerangereport') {
          const dctPriceRange = {
            '0-2K': '', '2K-5K': '', '5K-10K': '', '10K-15K': '', '15K-20K': '', '20K-25K': '',
            '25K-35K': '', '35K-50K': '', '50K+': ''
          };
          Object.keys(
            dctPriceRange
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
              this.chart_1_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value2'])
              this.chart_1_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Product Price range report
        else {
          this.chart_1_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex])[key]['Value1']))

          this.chart_1_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex])[key]['Value2']))
        }

        console.log("this.chart_1_Data[",this.chart_1_Data);
        
        setTimeout(() => (this.chart_1_Labels = Object.assign([], this.chart_1_Labels)));
        setTimeout(() => (this.chart_1_Data[0] = Object.assign([], this.chart_1_Data[0])));
        setTimeout(() => (this.chart_1_Data[1] = Object.assign([], this.chart_1_Data[1])));

      } else {
        this.chart_1_Data = [];
        // Day wise report
        if (this.urlName === 'mobiledaywisereport' || this.urlName === 'branchenquirydaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]).includes(key)) {
              this.chart_1_Data.push(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex][key]['Value1'])
            }
          });
        }
        // Day wise report
        else {
          this.chart_1_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1']][this.chart_1_CurrentIndex])[key]['Value1']))
        }

        setTimeout(() => (this.chart_1_Labels = Object.assign([], this.chart_1_Labels)));
        setTimeout(() => (this.chart_1_Data = Object.assign([], this.chart_1_Data)));
      }


      this.chart_1_Options = this.chartservice.generalizeBarChartOptions(this.chart_1_LabelsCopy, this.chart_1_Data,this.chart_1_Type,this.lst_chart_1_labels);
      this.chart_1_Options.title.text = 'All';
    }
    else if (type === 'chart_2') {
      let selectedOption = '';
      if (direction === 'left') {
        if (this.chart_2_CurrentIndex > 1) {
          this.chart_2_CurrentIndex -= 1;
        } else {
          this.chart_2_CurrentIndex = this.chart_2_MaxIndex;
        }
      } else {
        if (this.chart_2_CurrentIndex < this.chart_2_MaxIndex) {
          this.chart_2_CurrentIndex += 1;
        } else {
          this.chart_2_CurrentIndex = 1;
        }
      }

      if (this.selectedOptionChart_1 === '' &&
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
       ) {

        this.chart_2_Labels = [];
        selectedOption = 'All';
        // Day wise report
        if (this.urlName === 'territoryenquirydaywisereport' || this.urlName === 'territorysalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]).includes(key)) {
              this.chart_2_Labels.push(key);
            }
          });
        }
        // Day wise report
        else {
          this.chart_2_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]));
        }
        this.chart_2_LabelsCopy = this.chart_2_Labels;
        this.chart_2_Labels = this.chart_2_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_2_Type === 'grouped_bar' || this.chart_2_Type === 'stacked_bar') {
          this.chart_2_Data[0].data = [];
          this.chart_2_Data[1].data = [];
          // Day wise report
          if (this.urlName === 'territorysalesdaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]).includes(key)) {
                this.chart_2_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex][key]['Value2'])
                this.chart_2_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_2_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex])[key]['Value1']))

          this.chart_2_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex])[key]['Value2']))
          }
          setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
          setTimeout(() => (this.chart_2_Data[0] = Object.assign([], this.chart_2_Data[0])));
          setTimeout(() => (this.chart_2_Data[1] = Object.assign([], this.chart_2_Data[1])));
        } else {

          this.chart_2_Data = [];
          // Day wise report
          if (this.urlName === 'territoryenquirydaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]).includes(key)) {
                this.chart_2_Data.push(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_2_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart2']][this.chart_2_CurrentIndex])[key]['Value1']))
          }
          setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
          setTimeout(() => (this.chart_2_Data = Object.assign([], this.chart_2_Data)));
        }




      }
      else {
        this.chart_2_Labels = [];
        selectedOption = this.selectedOptionChart_1;
        // Day wise report
        if (this.urlName === 'territoryenquirydaywisereport' || this.urlName === 'territorysalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]).includes(key)) {
              this.chart_2_Labels.push(key);
            }
          });
        }
        // Day wise report
        else {
        this.chart_2_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]));
        }
        this.chart_2_LabelsCopy = this.chart_2_Labels;
        this.chart_2_Labels = this.chart_2_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_2_Type === 'grouped_bar' || this.chart_2_Type === 'stacked_bar') {

          this.chart_2_Data[0].data = [];
          this.chart_2_Data[1].data = [];
          // Day wise report
          if (this.urlName === 'territorysalesdaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]).includes(key)) {
                this.chart_2_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex][key]['Value2'])
                this.chart_2_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_2_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex])[key]['Value1']))

          this.chart_2_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex])[key]['Value2']))
          }
          setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
          setTimeout(() => (this.chart_2_Data[0] = Object.assign([], this.chart_2_Data[0])));
          setTimeout(() => (this.chart_2_Data[1] = Object.assign([], this.chart_2_Data[1])));
        } else {

          this.chart_2_Data = [];
          // Day wise report
          if (this.urlName === 'territoryenquirydaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]).includes(key)) {
                this.chart_2_Data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_2_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1][this.chart_2_CurrentIndex])[key]['Value1']))
          }
          setTimeout(() => (this.chart_2_Labels = Object.assign([], this.chart_2_Labels)));
          setTimeout(() => (this.chart_2_Data = Object.assign([], this.chart_2_Data)));

        }




      }
      this.chart_2_Options = this.chartservice.generalizeBarChartOptions(this.chart_2_LabelsCopy, this.chart_2_Data, this.chart_2_Type, this.lst_chart_2_labels);
      this.chart_2_Options.title.text = this.titlecasePipe.transform(selectedOption);

    }
    else if (type === 'chart_3') {
      let selectedOption = '';
      if (direction === 'left') {
        if (this.chart_3_CurrentIndex > 1) {
          this.chart_3_CurrentIndex -= 1;
        } else {
          this.chart_3_CurrentIndex = this.chart_3_MaxIndex;
        }
      } else {
        if (this.chart_3_CurrentIndex < this.chart_3_MaxIndex) {
          this.chart_3_CurrentIndex += 1;
        } else {
          this.chart_3_CurrentIndex = 1;
        }
      }
      if (!this.selectedOptionChart_1 &&
        !this.selectedOptionChart_2 &&
        !this.selectedOptionChart_3 &&
        !this.selectedOptionChart_4 &&
        !this.selectedOptionChart_5 &&
        !this.selectedOptionChart_6 &&
        !this.selectedOptionChart_7 &&
        !this.selectedOptionChart_8 &&
        !this.selectedOptionChart_9
      ) {
        selectedOption = 'All';

        this.chart_3_Labels = [];
        // Day wise report
        if (this.urlName === 'zoneenquirydaywisereport' || this.urlName === 'zonesalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]).includes(key)) {
              this.chart_3_Labels.push(key);
            }
          });
        }
        // Day wise report
        else {
          this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]));
        }
        this.chart_3_LabelsCopy = this.chart_3_Labels;
        this.chart_3_Labels = this.chart_3_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {

          this.chart_3_Data[0].data = [];
          this.chart_3_Data[1].data = [];
          // Day wise report
          if (this.urlName === 'zonesalesdaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex][key]['Value2'])
                this.chart_3_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_3_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex])[key]['Value1']))

          this.chart_3_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex])[key]['Value2']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data[0] = Object.assign([], this.chart_3_Data[0])));
          setTimeout(() => (this.chart_3_Data[1] = Object.assign([], this.chart_3_Data[1])));
        } else {
          this.chart_3_Data = [];
          // Day wise report
          if (this.urlName === 'zoneenquirydaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data.push(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart3']][this.chart_3_CurrentIndex])[key]['Value1']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));
        }



      }
      else if (
        !this.selectedOptionChart_2 &&
        !this.selectedOptionChart_3 &&
        !this.selectedOptionChart_4 &&
        !this.selectedOptionChart_5 &&
        !this.selectedOptionChart_6 &&
        !this.selectedOptionChart_7 &&
        !this.selectedOptionChart_8 &&
        !this.selectedOptionChart_9
      ) {
        this.chart_3_Labels = [];
        selectedOption = this.selectedOptionChart_1;
        // Day wise report
        if (this.urlName === 'zoneenquirydaywisereport' || this.urlName === 'zonesalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]).includes(key)) {
              this.chart_3_Labels.push(key);
            }
          });
        }
        // Day wise report
        else {
        this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]));
        }
        this.chart_3_LabelsCopy = this.chart_3_Labels;
        this.chart_3_Labels = this.chart_3_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {

          this.chart_3_Data[0].data = [];
          this.chart_3_Data[1].data = [];
          // Day wise report
          if (this.urlName === 'zonesalesdaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex][key]['Value2'])
                this.chart_3_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_3_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex])[key]['Value1']))
          this.chart_3_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex])[key]['Value2']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data[0] = Object.assign([], this.chart_3_Data[0])));
          setTimeout(() => (this.chart_3_Data[1] = Object.assign([], this.chart_3_Data[1])));
        } else {

          this.chart_3_Data = [];
           // Day wise report
          if (this.urlName === 'zoneenquirydaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1][this.chart_3_CurrentIndex])[key]['Value1']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));
        }


        // this.chart_3_Options = this.chartservice.generalizeBarChartOptions(this.chart_3_LabelsCopy, this.chart_3_Data,this.chart_3_Type);
      }
      else {
        this.chart_3_Labels = [];
        selectedOption = this.selectedOptionChart_2;
        // Day wise report
        if (this.urlName === 'zoneenquirydaywisereport' || this.urlName === 'zonesalesdaywisereport') {
          Object.keys(
            this.dctDays
          ).map((key) => {
            if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]).includes(key)) {
              this.chart_3_Labels.push(key);
            }
          });
        }
        // Day wise report
        else {
        this.chart_3_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]));
        }
        this.chart_3_LabelsCopy = this.chart_3_Labels;
        this.chart_3_Labels = this.chart_3_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_3_Type === 'grouped_bar' || this.chart_3_Type === 'stacked_bar') {

          this.chart_3_Data[0].data = [];
          this.chart_3_Data[1].data = [];
          // Day wise report
          if (this.urlName === 'zonesalesdaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
              [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data[1].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
                [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex][key]['Value2'])
                this.chart_3_Data[0].data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
                [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_3_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex])[key]['Value1']))

          this.chart_3_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex])[key]['Value2']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data[0] = Object.assign([], this.chart_3_Data[0])));
          setTimeout(() => (this.chart_3_Data[1] = Object.assign([], this.chart_3_Data[1])));
        } else {
          this.chart_3_Data = [];
          // Day wise report
          if (this.urlName === 'zoneenquirydaywisereport') {
            Object.keys(
              this.dctDays
            ).map((key) => {
              if (Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
              [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]).includes(key)) {
                this.chart_3_Data.push(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
                [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex][key]['Value1'])
              }
            });
          }
          // Day wise report
          else {
          this.chart_3_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_3_CurrentIndex])[key]['Value1']))
          }
          setTimeout(() => (this.chart_3_Labels = Object.assign([], this.chart_3_Labels)));
          setTimeout(() => (this.chart_3_Data = Object.assign([], this.chart_3_Data)));
        }


        // this.chart_3_Options = this.chartservice.generalizeBarChartOptions(this.chart_3_LabelsCopy, this.chart_3_Data,this.chart_3_Type);
      }
        this.chart_3_Options = this.chartservice.generalizeBarChartOptions(this.chart_3_LabelsCopy, this.chart_3_Data,this.chart_3_Type,this.lst_chart_3_labels);
        this.chart_3_Options.title.text = this.titlecasePipe.transform(selectedOption);
    }

    if (type === 'chart_4') {
      let selectedOption = ''
      if (direction === 'left') {
        if (this.chart_4_CurrentIndex > 1) {
          this.chart_4_CurrentIndex -= 1;
        } else {
          this.chart_4_CurrentIndex = this.chart_4_MaxIndex;
        }
      } else {
        if (this.chart_4_CurrentIndex < this.chart_4_MaxIndex) {
          this.chart_4_CurrentIndex += 1;
        } else {
          this.chart_4_CurrentIndex = 1;
        }
      }

      if (
        !this.selectedOptionChart_1 &&
        !this.selectedOptionChart_2 &&
        !this.selectedOptionChart_3 &&
        !this.selectedOptionChart_4 &&
        !this.selectedOptionChart_5 &&
        !this.selectedOptionChart_6 &&
        !this.selectedOptionChart_7 &&
        !this.selectedOptionChart_8 &&
        !this.selectedOptionChart_9
      ) {
        selectedOption = 'All';

        this.chart_4_Labels = [];

        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Labels = this.chart_4_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {

          this.chart_4_Data[0].data = [];
          this.chart_4_Data[1].data = [];

          this.chart_4_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex])[key]['Value1']))

          this.chart_4_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data[0] = Object.assign([], this.chart_4_Data[0])));
          setTimeout(() => (this.chart_4_Data[1] = Object.assign([], this.chart_4_Data[1])));
        } else {
          this.chart_4_Data = [];
          this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart4']][this.chart_4_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        }


        // this.chart_4_Options = this.chartservice.generalizeBarChartOptions(this.chart_4_LabelsCopy, this.chart_4_Data,this.chart_4_Type);
      }
      else if (
        !this.selectedOptionChart_2 &&
        !this.selectedOptionChart_3 &&
        !this.selectedOptionChart_4 &&
        !this.selectedOptionChart_5 &&
        !this.selectedOptionChart_6 &&
        !this.selectedOptionChart_7 &&
        !this.selectedOptionChart_8 &&
        !this.selectedOptionChart_9
      ) {
        this.chart_4_Labels = [];
        selectedOption = this.selectedOptionChart_1
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Labels = this.chart_4_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {

          this.chart_4_Data[0].data = [];
          this.chart_4_Data[1].data = [];

          this.chart_4_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex])[key]['Value1']))

          this.chart_4_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data[0] = Object.assign([], this.chart_4_Data[0])));
          setTimeout(() => (this.chart_4_Data[1] = Object.assign([], this.chart_4_Data[1])));
        } else {

          this.chart_4_Data = [];
          this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1][this.chart_4_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        }


        // this.chart_4_Options = this.chartservice.generalizeBarChartOptions(this.chart_4_LabelsCopy, this.chart_4_Data,this.chart_4_Type);
      }
      else if (
        !this.selectedOptionChart_3 &&
        !this.selectedOptionChart_4 &&
        !this.selectedOptionChart_5 &&
        !this.selectedOptionChart_6 &&
        !this.selectedOptionChart_7 &&
        !this.selectedOptionChart_8 &&
        !this.selectedOptionChart_9
      ) {
        this.chart_4_Labels = [];
        selectedOption = this.selectedOptionChart_2
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Labels = this.chart_4_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {

          this.chart_4_Data[0].data = [];
          this.chart_4_Data[1].data = [];

          this.chart_4_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex])[key]['Value1']))

          this.chart_4_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data[0] = Object.assign([], this.chart_4_Data[0])));
          setTimeout(() => (this.chart_4_Data[1] = Object.assign([], this.chart_4_Data[1])));
        } else {
          this.chart_4_Data = [];
          this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_4_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        }



        // this.chart_4_Options = this.chartservice.generalizeBarChartOptions(this.chart_4_LabelsCopy, this.chart_4_Data,this.chart_4_Type);
      }
      else {
        this.chart_4_Labels = [];
        selectedOption = this.selectedOptionChart_3
        this.chart_4_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex]));
        this.chart_4_LabelsCopy = this.chart_4_Labels;
        this.chart_4_Labels = this.chart_4_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });
        if (this.chart_4_Type === 'grouped_bar' || this.chart_4_Type === 'stacked_bar') {

          this.chart_4_Data[0].data = [];
          this.chart_4_Data[1].data = [];

          this.chart_4_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex])[key]['Value1']))

          this.chart_4_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data[0] = Object.assign([], this.chart_4_Data[0])));
          setTimeout(() => (this.chart_4_Data[1] = Object.assign([], this.chart_4_Data[1])));
        } else {
          this.chart_4_Data = [];

          this.chart_4_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_4_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_4_Labels = Object.assign([], this.chart_4_Labels)));
          setTimeout(() => (this.chart_4_Data = Object.assign([], this.chart_4_Data)));
        }

      }
        this.chart_4_Options = this.chartservice.generalizeBarChartOptions(this.chart_4_LabelsCopy, this.chart_4_Data,this.chart_4_Type,this.lst_chart_4_labels);
        this.chart_4_Options.title.text = this.titlecasePipe.transform(selectedOption);
    }
    else if (type === 'chart_5') {
      let selectedOption = ''
      if (direction === 'left') {
        if (this.chart_5_CurrentIndex > 1) {
          this.chart_5_CurrentIndex -= 1;
        } else {
          this.chart_5_CurrentIndex = this.chart_5_MaxIndex;
        }
      } else {
        if (this.chart_5_CurrentIndex < this.chart_5_MaxIndex) {
          this.chart_5_CurrentIndex += 1;
        } else {
          this.chart_5_CurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionChart_1 === '' &&
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        selectedOption = 'All'
        this.chart_5_Labels = [];

        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {

          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];

          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex])[key]['Value1']))

          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));
        } else {
          this.chart_5_Data = [];

          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart5']][this.chart_5_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        }





      }
      else if (
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        this.chart_5_Labels = [];
        selectedOption = this.selectedOptionChart_1
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {

          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];

          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex])[key]['Value1']))

          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));
        } else {
          this.chart_5_Data = [];

          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1][this.chart_5_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        }



        // this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data,this.chart_5_Type);
      }
      else if (
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        this.chart_5_Labels = [];
        selectedOption = this.selectedOptionChart_2
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {

          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];

          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex])[key]['Value1']))

          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));
        }
        else {
          this.chart_5_Data = [];

          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_5_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        }


        // this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data,this.chart_5_Type);
      }
      else if (
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        this.chart_5_Labels = [];
        selectedOption = this.selectedOptionChart_3
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {

          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];

          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex])[key]['Value1']))

          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));
        } else {
          this.chart_5_Data = [];

          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_5_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        }


        // this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data,this.chart_5_Type);
      }
      else {
        this.chart_5_Labels = [];
        selectedOption = this.selectedOptionChart_4
        this.chart_5_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex]));
        this.chart_5_LabelsCopy = this.chart_5_Labels;
        this.chart_5_Labels = this.chart_5_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_5_Type === 'grouped_bar' || this.chart_5_Type === 'stacked_bar') {

          this.chart_5_Data[0].data = [];
          this.chart_5_Data[1].data = [];

          this.chart_5_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex])[key]['Value1']))

          this.chart_5_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data[0] = Object.assign([], this.chart_5_Data[0])));
          setTimeout(() => (this.chart_5_Data[1] = Object.assign([], this.chart_5_Data[1])));
        } else {
          this.chart_5_Data = [];

          this.chart_5_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_5_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_5_Labels = Object.assign([], this.chart_5_Labels)));
          setTimeout(() => (this.chart_5_Data = Object.assign([], this.chart_5_Data)));
        }


        // this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data,this.chart_5_Type);
      }
      this.chart_5_Options = this.chartservice.generalizeBarChartOptions(this.chart_5_LabelsCopy, this.chart_5_Data, this.chart_5_Type, this.lst_chart_5_labels);
      this.chart_5_Options.title.text = this.titlecasePipe.transform(selectedOption);

    }
    else if (type === 'chart_6') {
      let selectedOption = ''
      if (direction === 'left') {
        if (this.chart_6_CurrentIndex > 1) {
          this.chart_6_CurrentIndex -= 1;
        } else {
          this.chart_6_CurrentIndex = this.chart_6_MaxIndex;
        }
      } else {
        if (this.chart_6_CurrentIndex < this.chart_6_MaxIndex) {
          this.chart_6_CurrentIndex += 1;
        } else {
          this.chart_6_CurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionChart_1 === '' &&
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        selectedOption = 'All'
        this.chart_6_Labels = [];

        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {

          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];

          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex])[key]['Value1']))

          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));

        }
        else {
          this.chart_6_Data = [];

          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart6']][this.chart_6_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        }


      }
      else if (
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        this.chart_6_Labels = [];
        selectedOption = this.selectedOptionChart_1
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {

          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];

          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex])[key]['Value1']))

          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));
        } else {
          this.chart_6_Data = [];

          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1][this.chart_6_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));

        }


        // this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data,this.chart_6_Type);
      }
      else if (
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        this.chart_6_Labels = [];
        selectedOption = this.selectedOptionChart_2
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {

          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];

          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex])[key]['Value1']))

          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));

        } else {
          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_6_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));
        }


        // this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data,this.chart_6_Type);
      }
      else if (
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        this.chart_6_Labels = [];
        selectedOption = this.selectedOptionChart_3
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {

          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];

          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex])[key]['Value1']))

          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));

        } else {
          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_6_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));

        }


        // this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data,this.chart_6_Type);
      }
      else if (
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        this.chart_6_Labels = [];
        selectedOption = this.selectedOptionChart_4
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {

          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];

          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex])[key]['Value1']))

          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));

        } else {
          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_6_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));

        }


        // this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data,this.chart_6_Type);
      }
      else {

        this.chart_6_Labels = [];
        selectedOption = this.selectedOptionChart_5
        // this.chart_6_CurrentIndex = 1;
        this.chart_6_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_6_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex]));
        this.chart_6_LabelsCopy = this.chart_6_Labels;
        this.chart_6_Labels = this.chart_6_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_6_Type === 'grouped_bar' || this.chart_6_Type === 'stacked_bar') {

          this.chart_6_Data[0].data = [];
          this.chart_6_Data[1].data = [];

          this.chart_6_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex])[key]['Value1']))

          this.chart_6_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_6_Data[0] = Object.assign([], this.chart_6_Data[0])));
          setTimeout(() => (this.chart_6_Data[1] = Object.assign([], this.chart_6_Data[1])));

        } else {

          this.chart_6_Data = [];
          this.chart_6_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_6_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_6_Labels = Object.assign([], this.chart_6_Labels)));
          setTimeout(() => (this.chart_6_Data = Object.assign([], this.chart_6_Data)));

        }


        // this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data,this.chart_6_Type);
      }
        this.chart_6_Options = this.chartservice.generalizeBarChartOptions(this.chart_6_LabelsCopy, this.chart_6_Data,this.chart_6_Type,this.lst_chart_6_labels);
        this.chart_6_Options.title.text = this.titlecasePipe.transform(selectedOption);

    }
    else if (type === 'chart_7') {
      let selectedOption = ''
      if (direction === 'left') {
        if (this.chart_7_CurrentIndex > 1) {
          this.chart_7_CurrentIndex -= 1;
        } else {
          this.chart_7_CurrentIndex = this.chart_7_MaxIndex;
        }
      } else {
        if (this.chart_7_CurrentIndex < this.chart_7_MaxIndex) {
          this.chart_7_CurrentIndex += 1;
        } else {
          this.chart_7_CurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionChart_1 === '' &&
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        selectedOption = 'All'
        this.chart_7_Labels = [];

        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {

          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];

          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex])[key]['Value1']))

          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));

        }
        else {
          this.chart_7_Data = [];

          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart7']][this.chart_7_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        }
      }
      else if(
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_7_Labels = [];
        selectedOption = this.selectedOptionChart_1
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {

          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];

          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex])[key]['Value1']))

          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));
        } else {
          this.chart_7_Data = [];

          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1][this.chart_7_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));

        }
      }
      else if(
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_7_Labels = [];
        selectedOption = this.selectedOptionChart_2
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {

          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];

          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex])[key]['Value1']))

          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));

        } else {
          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_7_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));
        }
      }
      else if(
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_7_Labels = [];
        selectedOption = this.selectedOptionChart_3
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {

          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];

          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex])[key]['Value1']))

          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));

        } else {
          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_7_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));

        }
      }
      else if(
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_7_Labels = [];
        selectedOption = this.selectedOptionChart_4
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {

          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];

          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex])[key]['Value1']))

          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));

        } else {
          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_7_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));

        }
      }
      else if(
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_7_Labels = [];
        selectedOption = this.selectedOptionChart_5
        // this.chart_7_CurrentIndex = 1;
        this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {

          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];

          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex])[key]['Value1']))

          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));

        } else {

          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_7_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));

        }
      }
      else{
        this.chart_7_Labels = [];
        selectedOption = this.selectedOptionChart_6
        // this.chart_7_CurrentIndex = 1;
        this.chart_7_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]).length;
        this.chart_7_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex]));
        this.chart_7_LabelsCopy = this.chart_7_Labels;
        this.chart_7_Labels = this.chart_7_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_7_Type === 'grouped_bar' || this.chart_7_Type === 'stacked_bar') {

          this.chart_7_Data[0].data = [];
          this.chart_7_Data[1].data = [];

          this.chart_7_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex])[key]['Value1']))

          this.chart_7_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_7_Data[0] = Object.assign([], this.chart_7_Data[0])));
          setTimeout(() => (this.chart_7_Data[1] = Object.assign([], this.chart_7_Data[1])));

        } else {

          this.chart_7_Data = [];
          this.chart_7_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_7_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_7_Labels = Object.assign([], this.chart_7_Labels)));
          setTimeout(() => (this.chart_7_Data = Object.assign([], this.chart_7_Data)));

        }
      }
      this.chart_7_Options = this.chartservice.generalizeBarChartOptions(this.chart_7_LabelsCopy, this.chart_7_Data,this.chart_7_Type,this.lst_chart_7_labels);
        this.chart_7_Options.title.text = this.titlecasePipe.transform(selectedOption);
    }
    else if (type === 'chart_8') {
      let selectedOption = ''
      if (direction === 'left') {
        if (this.chart_8_CurrentIndex > 1) {
          this.chart_8_CurrentIndex -= 1;
        } else {
          this.chart_8_CurrentIndex = this.chart_8_MaxIndex;
        }
      } else {
        if (this.chart_8_CurrentIndex < this.chart_8_MaxIndex) {
          this.chart_8_CurrentIndex += 1;
        } else {
          this.chart_8_CurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionChart_1 === '' &&
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        selectedOption = 'All'
        this.chart_8_Labels = [];

        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {

          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];

          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));

        }
        else {
          this.chart_8_Data = [];

          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart8']][this.chart_8_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        }

      }
      else if(
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_8_Labels = [];
        selectedOption = this.selectedOptionChart_1
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {

          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];

          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));
        } else {
          this.chart_8_Data = [];

          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));

        }
      }
      else if(
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_8_Labels = [];
        selectedOption = this.selectedOptionChart_2
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {

          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];

          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));

        } else {
          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_8_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));
        }
      }
      else if(
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_8_Labels = [];
        selectedOption = this.selectedOptionChart_3
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {

          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];

          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));

        } else {
          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));

        }
      }
      else if(
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_8_Labels = [];
        selectedOption = this.selectedOptionChart_4
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {

          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];

          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));

        } else {
          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));

        }
      }
      else if(
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_8_Labels = [];
        selectedOption = this.selectedOptionChart_5
        // this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {

          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];

          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));

        } else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));

        }
      }
      else if(
        this.selectedOptionChart_7 === ''&&
        this.selectedOptionChart_8 === ''&&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_8_Labels = [];
        selectedOption = this.selectedOptionChart_6
        // this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]).length;
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {

          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];

          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));

        } else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));

        }
      }
      else{
        this.chart_8_Labels = [];
        selectedOption = this.selectedOptionChart_7
        // this.chart_8_CurrentIndex = 1;
        this.chart_8_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]).length;
        this.chart_8_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.chart_8_CurrentIndex]));
        this.chart_8_LabelsCopy = this.chart_8_Labels;
        this.chart_8_Labels = this.chart_8_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_8_Type === 'grouped_bar' || this.chart_8_Type === 'stacked_bar') {

          this.chart_8_Data[0].data = [];
          this.chart_8_Data[1].data = [];

          this.chart_8_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_8_CurrentIndex])[key]['Value1']))

          this.chart_8_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_8_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_8_Data[0] = Object.assign([], this.chart_8_Data[0])));
          setTimeout(() => (this.chart_8_Data[1] = Object.assign([], this.chart_8_Data[1])));

        } else {

          this.chart_8_Data = [];
          this.chart_8_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_8_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_8_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_8_Labels = Object.assign([], this.chart_8_Labels)));
          setTimeout(() => (this.chart_8_Data = Object.assign([], this.chart_8_Data)));

        }

      }

      this.chart_8_Options = this.chartservice.generalizeBarChartOptions(this.chart_8_LabelsCopy, this.chart_8_Data,this.chart_8_Type,this.lst_chart_8_labels);
      this.chart_8_Options.title.text = this.titlecasePipe.transform(selectedOption);
    }
    else if (type === 'chart_9') {
      let selectedOption = ''
      if (direction === 'left') {
        if (this.chart_9_CurrentIndex > 1) {
          this.chart_9_CurrentIndex -= 1;
        } else {
          this.chart_9_CurrentIndex = this.chart_9_MaxIndex;
        }
      } else {
        if (this.chart_9_CurrentIndex < this.chart_9_MaxIndex) {
          this.chart_9_CurrentIndex += 1;
        } else {
          this.chart_9_CurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionChart_1 === '' &&
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        selectedOption = 'All'
        this.chart_9_Labels = [];

        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        }
        else {
          this.chart_9_Data = [];

          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart9']][this.chart_9_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        }
      }
      else if(
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_9_Labels = [];
        selectedOption = this.selectedOptionChart_1
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));
        } else {
          this.chart_9_Data = [];

          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }
      }
      else if(
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_9_Labels = [];
        selectedOption = this.selectedOptionChart_2
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        } else {
          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_9_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));
        }
      }
      else if(
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_9_Labels = [];
        selectedOption = this.selectedOptionChart_3
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        } else {
          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }
      }
      else if(
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_9_Labels = [];
        selectedOption = this.selectedOptionChart_4
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        } else {
          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }
      }
      else if(
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_9_Labels = [];
        selectedOption = this.selectedOptionChart_5
        // this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        } else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }
      }
      else if(
        this.selectedOptionChart_7 === ''&&
        this.selectedOptionChart_8 === ''&&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_9_Labels = [];
        selectedOption = this.selectedOptionChart_6
        // this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        } else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }
      }
      else if(
        this.selectedOptionChart_8 === ''&&
        this.selectedOptionChart_9 === ''
      )
      {
        this.chart_9_Labels = [];
        selectedOption = this.selectedOptionChart_7
        // this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        } else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }

      }
      else{
        this.chart_9_Labels = [];
        selectedOption = this.selectedOptionChart_8
        // this.chart_9_CurrentIndex = 1;
        this.chart_9_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]).length;
        this.chart_9_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex]));
        this.chart_9_LabelsCopy = this.chart_9_Labels;
        this.chart_9_Labels = this.chart_9_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_9_Type === 'grouped_bar' || this.chart_9_Type === 'stacked_bar') {

          this.chart_9_Data[0].data = [];
          this.chart_9_Data[1].data = [];

          this.chart_9_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex])[key]['Value1']))

          this.chart_9_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_9_Data[0] = Object.assign([], this.chart_9_Data[0])));
          setTimeout(() => (this.chart_9_Data[1] = Object.assign([], this.chart_9_Data[1])));

        } else {

          this.chart_9_Data = [];
          this.chart_9_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_9_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_9_Labels = Object.assign([], this.chart_9_Labels)));
          setTimeout(() => (this.chart_9_Data = Object.assign([], this.chart_9_Data)));

        }
      }

      this.chart_9_Options = this.chartservice.generalizeBarChartOptions(this.chart_9_LabelsCopy, this.chart_9_Data,this.chart_9_Type,this.lst_chart_9_labels);
      this.chart_9_Options.title.text = this.titlecasePipe.transform(selectedOption);
    }


    else if (type === 'chart_10') {
      let selectedOption = ''
      if (direction === 'left') {
        if (this.chart_10_CurrentIndex > 1) {
          this.chart_10_CurrentIndex -= 1;
        } else {
          this.chart_10_CurrentIndex = this.chart_10_MaxIndex;
        }
      } else {
        if (this.chart_10_CurrentIndex < this.chart_10_MaxIndex) {
          this.chart_10_CurrentIndex += 1;
        } else {
          this.chart_10_CurrentIndex = 1;
        }
      }
      if (
        this.selectedOptionChart_1 === '' &&
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ) {
        selectedOption = 'All'
        this.chart_10_Labels = [];

        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        }
        else {
          this.chart_10_Data = [];

          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart10']][this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }
      }

      else if(
        this.selectedOptionChart_2 === '' &&
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_1
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        } else {
          this.chart_10_Data = [];

          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }
      }
      else if(
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_2
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value2']))

          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));
        } else {
          this.chart_10_Data = [];

          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }
      }
      else if(
        this.selectedOptionChart_3 === '' &&
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_2
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        } else {
          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.chart_10_CurrentIndex])[key]['Value1']))

          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }
      }
      else if(
        this.selectedOptionChart_4 === '' &&
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_3
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        } else {
          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }
      }
      else if(
        this.selectedOptionChart_5 === '' &&
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_4
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        } else {
          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }
      }
      else if(
        this.selectedOptionChart_6 === '' &&
        this.selectedOptionChart_7 === '' &&
        this.selectedOptionChart_8 === '' &&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_5
        // this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        } else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }
      }
      else if(
        this.selectedOptionChart_7 === ''&&
        this.selectedOptionChart_8 === ''&&
        this.selectedOptionChart_9 === ''
      ){
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_6
        // this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        } else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }
      }
      else if(
        this.selectedOptionChart_8 === ''&&
        this.selectedOptionChart_9 === ''
      )
      {
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_7
        // this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        } else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));
        }
      }
      else if(
        this.selectedOptionChart_9 === ''
      )
      {
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_8
        // this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        } else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }
      }
      else{
        this.chart_10_Labels = [];
        selectedOption = this.selectedOptionChart_9
        // this.chart_10_CurrentIndex = 1;
        this.chart_10_MaxIndex = Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9]).length;
        this.chart_10_Labels.push(...Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
        [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
        [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
        [this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9][this.chart_10_CurrentIndex]));
        this.chart_10_LabelsCopy = this.chart_10_Labels;
        this.chart_10_Labels = this.chart_10_Labels.map(obj => {
          if (obj.length > 6) {
            obj = obj.slice(0, 5) + '..';
          }
          obj = this.titlecasePipe.transform(obj);
          return obj;
        });

        if (this.chart_10_Type === 'grouped_bar' || this.chart_10_Type === 'stacked_bar') {

          this.chart_10_Data[0].data = [];
          this.chart_10_Data[1].data = [];

          this.chart_10_Data[0].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9][this.chart_10_CurrentIndex])[key]['Value1']))

          this.chart_10_Data[1].data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9][this.chart_10_CurrentIndex])[key]['Value2']))
          setTimeout(() => (this.chart_10_Data[0] = Object.assign([], this.chart_10_Data[0])));
          setTimeout(() => (this.chart_10_Data[1] = Object.assign([], this.chart_10_Data[1])));

        } else {

          this.chart_10_Data = [];
          this.chart_10_Data.push(...(Object.keys(this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
          [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
          [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
          [this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9][this.chart_10_CurrentIndex]))
            .map(key => (this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']]
            [this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3]
            [this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6]
            [this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9][this.chart_10_CurrentIndex])[key]['Value1']))
          setTimeout(() => (this.chart_10_Labels = Object.assign([], this.chart_10_Labels)));
          setTimeout(() => (this.chart_10_Data = Object.assign([], this.chart_10_Data)));

        }
      }
      this.chart_10_Options = this.chartservice.generalizeBarChartOptions(this.chart_10_LabelsCopy, this.chart_10_Data,this.chart_10_Type,this.lst_chart_10_labels);
      this.chart_10_Options.title.text = this.titlecasePipe.transform(selectedOption);

    }
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
  addStaffStatus (event) {
    if (this.statusStaffSelected.filter(y => y.id === event.id).length === 0) {
      this.statusStaffSelected.push(event);
      this.selectedStaff.push(event.id);

    }
    this.staffName = '';
    this.idStaff.nativeElement.value = '';
  }

  addProductStatus (event) {
    if (this.statusProductSelected.filter(y => y.id === event.id).length === 0) {
      this.statusProductSelected.push(event);
      this.selectedProduct.push(event.id);

    }
    this.productName = '';
    this.idProduct.nativeElement.value = '';
  }

  addBrandStatus (event) {
    if (this.statusBrandSelected.filter(y => y.id === event.id).length === 0) {
      this.statusBrandSelected.push(event);
      this.selectedBrand.push(event.id);

    }
    this.brandName = '';
    this.idBrand.nativeElement.value = '';
  }

  addItemStatus (event) {
    console.log(event,"event");
    
    if (this.statusItemSelected.filter(y => y.id === event.id).length === 0) {
      this.statusItemSelected.push(event);
      this.selectedItem.push(event.id);

    }
    this.itemName = '';
    this.idItem.nativeElement.value = '';
  }

  removeStaffStatus(value) {
    const index = this.statusStaffSelected.indexOf(value);
    const index2 = this.selectedStaff.indexOf(value.id);
  if (index > -1) {
    this.statusStaffSelected.splice(index, 1);
  }
  if (index2 > -1) {
    this.selectedStaff.splice(index2, 1);
  }
  }

  removeBrandStatus(value) {
    const index = this.statusBrandSelected.indexOf(value);
    const index2 = this.selectedBrand.indexOf(value.id);
  if (index > -1) {
    this.statusBrandSelected.splice(index, 1);
  }
  if (index2 > -1) {
    this.selectedBrand.splice(index2, 1);
  }
  }

  removeProductStatus(value) {
    const index = this.statusProductSelected.indexOf(value);
    const index2 = this.selectedProduct.indexOf(value.id);
  if (index > -1) {
    this.statusProductSelected.splice(index, 1);
  }
  if (index2 > -1) {
    this.selectedProduct.splice(index2, 1);
  }
  }
  removeItemStatus(value) {
    const index = this.statusItemSelected.indexOf(value);
    const index2 = this.selectedItem.indexOf(value.id);
  if (index > -1) {
    this.statusItemSelected.splice(index, 1);
  }
  if (index2 > -1) {
    this.selectedItem.splice(index2, 1);
  }
  }
  
  // BranchChanged(item) {

  //   this.branchId = item.id;
  //   this.selectedBranch = item.name;
  // }
  // StaffChanged(item) {

  //   this.staffId = item.id;
  //   this.selectedStaff = item.name;
  // }

  getFilterNames(){

    if(this.dctFilter['staffs'] === 'True'){
      this.blnStaff=true;
    }
    if (this.dctFilter['branch'] === 'True'){
      this.blnBranch=true;
    }
    if (this.dctFilter['brand'] === 'True'){
      this.blnBrand=true;
    }
    if (this.dctFilter['product'] === 'True'){
      this.blnProduct=true;
    }
    if (this.dctFilter['item'] === 'True'){
      this.blnItem=true;
    }
  }

  openExport(modal){
   
    this.chart=true;
    this.table=false;
    // this.showModal = true;
    this.exportmodal1 = this.modalService.open(modal,{windowClass:'exportModal1',backdrop:false})


  }
  closeExport(){
    this.showModal = false;
    this.exportmodal1.close();
  }
  openMail(){
    this.chart=true;
    this.table=false;
    this.email='';
    this.showModal2 = true;

  }
  closeMail(){
    this.showModal2 = false;
  }

  exportPdfExcel(fdate, tdate){
    
    localStorage.setItem('chartexport','');
    this.blnExported = false;

    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
      this.validationStatus=false;
      return false;

    }
    else{
      this.validationStatus=true;
    }
    if(this.validationStatus){

        const dctJsonData = {};
        dctJsonData['data'] = 'Custom';

        // this.selectedFromDate = fdate.format('YYYY-MM-DD');
        this.selectedFromDate = moment(new Date(fdate)).format('YYYY-MM-DD');

        // this.selectedToDate = tdate.format('YYYY-MM-DD');
        this.selectedToDate = moment(new Date(tdate)).format('YYYY-MM-DD');

        dctJsonData['date_from'] = this.selectedFromDate;
        dctJsonData['date_to'] = this.selectedToDate;
        dctJsonData['company_id'] = localStorage.getItem('companyId')
        dctJsonData['reportname'] = this.reportName;
        dctJsonData['show_type'] = this.type;
        dctJsonData['branchselected'] = this.statusSelected.map(x => x.id);
        dctJsonData['staffsselected'] = this.statusStaffSelected.map(y => y.id);
        dctJsonData['strGoodPoorClicked'] = this.strGoodPoor;
        dctJsonData['intCurrentPage'] = this.currentPage;
        if (this.branchName.length > 0) {

          if (
            this.lstBranches[0]==null
          ) {

            // this.snotifyService.error('Select a valid branch or clear the field');

            return false;
          }
        }
       else if (this.selectedBranch !== null) {
          dctJsonData['branchselected'] = this.selectedBranch;
        }
        else{
          dctJsonData['branchselected'] ='';
        }



        if (this.staffName.length > 0) { //check a value exist in a list of dictionary
          var staffFlag=false;
          for (var index = 0; index < this.tempStaff.length; ++index) {

            var sname = this.tempStaff[index];

            if(sname.name == this.staffName){
              staffFlag=true;
              break;
            }
           }
           if(staffFlag==false){
            // this.snotifyService.error('Select a valid staff name or clear the field');

            return false;
           }

            }
         if (this.selectedStaff !== null) {

              dctJsonData['staffsselected'] = this.selectedStaff;
            }
            else{
              dctJsonData['staffsselected'] ='';
            }


        if (this.brandName.length > 0) { //check a value exist in a list of dictionary
          var brandFlag=false;
          for (var index = 0; index < this.tempBrand.length; ++index) {

            var sname = this.tempBrand[index];

            if(sname.name == this.brandName){
              brandFlag=true;
              break;
            }
           }
           if(brandFlag==false){
            // this.snotifyService.error('Select a valid brand name or clear the field');

            return false;
           }

             }
            if (this.selectedBrand !== null) {

              dctJsonData['brandsselected'] = this.selectedBrand;
            }
            else{
              dctJsonData['brandsselected'] ='';
            }

            if (this.itemName.length > 0) { //check a value exist in a list of dictionary
              var itemFlag=false;
              for (var index = 0; index < this.tempItem.length; ++index) {
    
                var sname = this.tempItem[index];
    
                if(sname.name == this.itemName){
                  itemFlag=true;
                  break;
                }
               }
               if(itemFlag==false){
                // this.snotifyService.error('Select a valid item name or clear the field');
    
                return false;
               }
    
                 }
                if (this.selectedItem !== null) {
    
                  dctJsonData['itemsselected'] = this.selectedItem;
                }
                else{
                  dctJsonData['itemsselected'] ='';
                }
    

            if (this.productName.length > 0) { //check a value exist in a list of dictionary
              var productFlag=false;
              for (var index = 0; index < this.tempProduct.length; ++index) {
    
                var sname = this.tempProduct[index];
    
                if(sname.name == this.productName){
                  productFlag=true;
                  break;
                }
               }
               if(productFlag==false){
                // this.snotifyService.error('Select a valid product name or clear the field');
    
                return false;
               }
    
                }
             if (this.selectedProduct !== null) {
    
                  dctJsonData['productsselected'] = this.selectedProduct;
                }
                else{
                  dctJsonData['productsselected'] ='';
                }
    

            if(this.chart_1_Type=='bar'||this.chart_2_Type=='bar'||this.chart_3_Type=='bar'||this.chart_4_Type=='bar'||this.chart_5_Type=='bar'||this.chart_6_Type=='bar'||this.chart_7_Type=='bar'||this.chart_8_Type=='bar'||this.chart_9_Type=='bar'||this.chart_10_Type=='bar'){
              dctJsonData['report_type']='enquiry';
            }
            else{
              dctJsonData['report_type']='sale';
            }

            
            dctJsonData['export_type'] = 'DOWNLOAD';
            this.showModal = false;
            dctJsonData['bln_chart'] = this.chart;
            dctJsonData['bln_table'] = this.table;


            // this.spinnerService.show();
            this.showSpinner=true;

      if(this.export){

        dctJsonData['document'] = 'excel';

        this.serviceObject.postData("generalize_report_download/report_download/",dctJsonData)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
              // this.spinnerService.hide();
              this.showSpinner=false;
              this.exportmodal1.close();



              var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = response['file'];
              a.download = 'report.xlsx';
              a.click();
              window.URL.revokeObjectURL(this.dctReportData);
              a.remove();

              // this.snotifyService.success('Successfully Exported');
              
              this.blnExported = true;
              this.downloadLog(dctJsonData)


              this.table=false;
              this.chart=true;

            } else {
            // this.spinnerService.hide();
            this.showSpinner=false;


            // this.snotifyService.error('No data found');
           }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

      if(!this.export){
        dctJsonData['document'] = 'pdf';
        this.serviceObject.postData("generalize_report_download/report_download/",dctJsonData)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
                // this.spinnerService.hide();
                this.showSpinner=false;


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
              // this.spinnerService.hide();
              this.showSpinner=false;


            // this.snotifyService.error('No data found');
           }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;
            this.exportmodal1.close();

          });
        
          this.dctJsonData1 = dctJsonData;
      }

    }
    }




  exportWithEmail(fromdate, todate){

    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
      this.validationStatus=false;
      return false;

    }
    else{
      this.validationStatus=true;
    }
    if(this.validationStatus){

      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = fromdate.format('YYYY-MM-DD');
      this.selectedToDate = todate.format('YYYY-MM-DD');
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['company_id'] = localStorage.getItem('companyId')
      dctJsonData['reportname'] = this.reportName;
      dctJsonData['show_type'] = this.type;
      dctJsonData['branchselected'] = this.statusSelected.map(x => x.id);
      dctJsonData['staffsselected'] = this.statusStaffSelected.map(y => y.id);
      dctJsonData['brandsselected'] = this.statusBrandSelected.map(y => y.id);
      dctJsonData['productsselected'] = this.statusProductSelected.map(y => y.id);
      dctJsonData['itemsselected'] = this.statusItemSelected.map(y => y.id);

      dctJsonData['strGoodPoorClicked'] = this.strGoodPoor;
      dctJsonData['intCurrentPage'] = this.currentPage;
      if (this.branchName.length > 0) {

        if (
          this.lstBranches[0]==null
        ) {

          this.snotifyService.error('Select a valid branch or clear the field');

          return false;
        }
      }
     else if (this.selectedBranch !== null) {
        dctJsonData['branchselected'] = this.selectedBranch;
      }
      else{
        dctJsonData['branchselected'] ='';
      }



      if (this.staffName.length > 0) { //check a value exist in a list of dictionary
        var staffFlag=false;
        for (var index = 0; index < this.tempStaff.length; ++index) {

          var sname = this.tempStaff[index];

          if(sname.name == this.staffName){
            staffFlag=true;
            break;
          }
         }
         if(staffFlag==false){
          this.snotifyService.error('Select a valid staff name or clear the field');

          return false;
         }

          }

       if (this.selectedStaff !== null) {

            dctJsonData['staffsselected'] = this.selectedStaff;
          }
          else{
            dctJsonData['staffsselected'] ='';
          }



      if (this.brandName.length > 0) { //check a value exist in a list of dictionary
        var brandFlag=false;
        for (var index = 0; index < this.tempBrand.length; ++index) {

          var sname = this.tempBrand[index];

          if(sname.name == this.brandName){
            brandFlag=true;
            break;
          }
         }
         if(brandFlag==false){
          this.snotifyService.error('Select a valid brand name or clear the field');

          return false;
         }

          }
          
       if (this.selectedBrand !== null) {

            dctJsonData['brandsselected'] = this.selectedBrand;
          }
          else{
            dctJsonData['brandsselected'] ='';
          }



          if (this.itemName.length > 0) { //check a value exist in a list of dictionary
            var itemFlag=false;
            for (var index = 0; index < this.tempItem.length; ++index) {
    
              var sname = this.tempItem[index];
    
              if(sname.name == this.itemName){
                itemFlag=true;
                break;
              }
             }
             if(itemFlag==false){
              this.snotifyService.error('Select a valid item name or clear the field');
    
              return false;
             }
    
              }
              
           if (this.selectedItem !== null) {
    
                dctJsonData['itemsselected'] = this.selectedItem;
              }
              else{
                dctJsonData['itemsselected'] ='';
              }


      if (this.productName.length > 0) { //check a value exist in a list of dictionary
        var productFlag=false;
        for (var index = 0; index < this.tempProduct.length; ++index) {

          var sname = this.tempProduct[index];

          if(sname.name == this.productName){
            productFlag=true;
            break;
          }
         }
         if(productFlag==false){
          this.snotifyService.error('Select a valid product name or clear the field');

          return false;
         }

          }
          
       if (this.selectedProduct !== null) {

            dctJsonData['productsselected'] = this.selectedProduct;
          }
          else{
            dctJsonData['productsselected'] ='';
          }


          if(this.chart_1_Type=='bar'||this.chart_2_Type=='bar'||this.chart_3_Type=='bar'){
            dctJsonData['report_type']='enquiry';
          }
          else{
            dctJsonData['report_type']='sale';
          }

      dctJsonData['export_type'] = 'MAIL';
    if(!this.email){
      this.snotifyService.error('Enter an email address');
      return false;
    }
    else {
      const eatpos = this.email.trim().indexOf('@');
      const edotpos = this.email.trim().lastIndexOf('.');
      if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.email.length) {
        this.snotifyService.error("Invalid Email entered");
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

        this.serviceObject.postData("generalize_report_download/report_download/",dctJsonData)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
                // this.spinnerService.hide();
                this.showSpinner=false;


                this.snotifyService.success('Successfully Exported');

              this.table=false;
              this.chart=true;

              this.email=null

            } else {
              // this.spinnerService.hide();
              this.showSpinner=false;


              this.snotifyService.error('something went wrong');
             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

     else if(this.emailExport){
      dctJsonData['document'] = 'excel';
        this.serviceObject.postData("generalize_report_download/report_download/",dctJsonData)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
                // this.spinnerService.hide();
                this.showSpinner=false;


                this.snotifyService.success('Successfully Exported');

              this.table=false;
              this.chart=true;
              this.email=null

            }  else {
              // this.spinnerService.hide();
              this.showSpinner=false;


              this.snotifyService.error('something went wrong');
             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });

      }
    }
    }



  exportWithChatName(fromdate, todate){
    if(this.chart==false&&this.table==false){

      // this.toastr.error('Choose chart or table');
      this.validationStatus=false;
      return false;

    }
    else{
      this.validationStatus=true;
    }
    if(this.validationStatus){

      const dctJsonData = {};
      dctJsonData['data'] = 'Custom';
      this.selectedFromDate = fromdate.format('YYYY-MM-DD');
      this.selectedToDate = todate.format('YYYY-MM-DD');
      dctJsonData['date_from'] = this.selectedFromDate;
      dctJsonData['date_to'] = this.selectedToDate;
      dctJsonData['company_id'] = localStorage.getItem('companyId')
      dctJsonData['reportname'] = this.reportName;
      console.log(this.reportName);
      
      dctJsonData['show_type'] = this.type;
      dctJsonData['branchselected'] = this.statusSelected.map(x => x.id);
      dctJsonData['staffsselected'] = this.statusStaffSelected.map(y => y.id);
      dctJsonData['brandsselected'] = this.statusBrandSelected.map(y => y.id);
      dctJsonData['productsselected'] = this.statusProductSelected.map(y => y.id);
      dctJsonData['itemsselected'] = this.statusItemSelected.map(y => y.id);

      if (this.branchName.length > 0) {

        if (
          this.lstBranches[0]==null
        ) {

          this.snotifyService.error('Select a valid branch or clear the field');

          return false;
        }
      }
     else if (this.selectedBranch !== null) {
        dctJsonData['branchselected'] = this.selectedBranch;
      }
      else{
        dctJsonData['branchselected'] ='';
      }



      if (this.staffName.length > 0) { //check a value exist in a list of dictionary
        var staffFlag=false;
        for (var index = 0; index < this.tempStaff.length; ++index) {

          var sname = this.tempStaff[index];

          if(sname.name == this.staffName){
            staffFlag=true;
            break;
          }
         }
         if(staffFlag==false){
          this.snotifyService.error('Select a valid staff name or clear the field');

          return false;
         }

          }
       if (this.selectedStaff !== null) {

            dctJsonData['staffsselected'] = this.selectedStaff;
          }
          else{
            dctJsonData['staffsselected'] ='';
          }

          if (this.brandName.length > 0) { //check a value exist in a list of dictionary
            var brandFlag=false;
            for (var index = 0; index < this.tempBrand.length; ++index) {
    
              var sname = this.tempBrand[index];
    
              if(sname.name == this.brandName){
                brandFlag=true;
                break;
              }
             }
             if(brandFlag==false){
              this.snotifyService.error('Select a valid brand name or clear the field');
    
              return false;
             }
    
              }
           if (this.selectedBrand !== null) {
    
                dctJsonData['brandsselected'] = this.selectedBrand;
              }
              else{
                dctJsonData['brandsselected'] ='';
              }
    
    

              if (this.itemName.length > 0) { //check a value exist in a list of dictionary
                var itemFlag=false;
                for (var index = 0; index < this.tempItem.length; ++index) {
        
                  var sname = this.tempItem[index];
        
                  if(sname.name == this.itemName){
                    itemFlag=true;
                    break;
                  }
                 }
                 if(itemFlag==false){
                  this.snotifyService.error('Select a valid item name or clear the field');
        
                  return false;
                 }
        
                  }
               if (this.selectedItem !== null) {
        
                    dctJsonData['itemsselected'] = this.selectedItem;
                  }
                  else{
                    dctJsonData['itemsselected'] ='';
                  } 




              if (this.productName.length > 0) { //check a value exist in a list of dictionary
                var productFlag=false;
                for (var index = 0; index < this.tempProduct.length; ++index) {
        
                  var sname = this.tempProduct[index];
        
                  if(sname.name == this.productName){
                    productFlag=true;
                    break;
                  }
                 }
                 if(productFlag==false){
                  this.snotifyService.error('Select a valid product name or clear the field');
        
                  return false;
                 }
        
                  }
               if (this.selectedProduct !== null) {
        
                    dctJsonData['productsselected'] = this.selectedProduct;
                  }
                  else{
                    dctJsonData['productsselected'] ='';
                  }
    
                  

            if(this.chart_1_Type=='bar'||this.chart_2_Type=='bar'||this.chart_3_Type=='bar'){
              dctJsonData['report_type']='enquiry';
            }
            else{
              dctJsonData['report_type']='sale';
            }

      dctJsonData['export_type'] = 'CHAT';
    if(!this.chatName){
      this.snotifyService.error('Enter chat name');
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

        this.serviceObject.postData("generalize_report_pdf/generalize_report/",dctJsonData)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
                // this.spinnerService.hide();
                this.showSpinner=false;


                this.snotifyService.success('Successfully Exported');

              this.table=false;
              this.chart=true;

              this.email=null

            } else {
              // this.spinnerService.hide();
              this.showSpinner=false;


              this.snotifyService.error('something went wrong');
             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });


      }

     else if(this.chatExport){
      dctJsonData['document'] = 'excel';
        this.serviceObject.postData("generalize_report_pdf/generalize_report/",dctJsonData)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
                // this.spinnerService.hide();
                this.showSpinner=false;


                this.snotifyService.success('Successfully Exported');

              this.table=false;
              this.chart=true;
              this.email=null

            }  else {
              // this.spinnerService.hide();
              this.showSpinner=false;


              this.snotifyService.error('something went wrong');
             }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });

      }
    }
    }
    valueIteration(modal, dctTempData,type){
      let dctTable={};
      let dctTotal={};
      let lstData=[];
      let totalData=[];
      this.grandTotal=0;
      this.saleQtyTot=0;
      this.enqQtyTot=0;
      this.enqValTot=0;
      if (type == 'grouped_bar') {
        for(var key1 in dctTempData){
          for(var key2 in dctTempData[key1]){  
            this.grandTotal+=dctTempData[key1][key2]['Value2'];
            this.saleQtyTot+=dctTempData[key1][key2]['Value2'];
            this.enqQtyTot+=dctTempData[key1][key2]['Value1'];
            this.enqValTot+=dctTempData[key1][key2]['Value1'];  
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
              dctTable['Name']=this.dctReportData.staffs[key2];
            }else{
              dctTable['Name']=key2; 
            }
            dctTable['EnquiryQty']=dctTempData[key1][key2]['Value1'];          
            dctTable['SaleQty']=dctTempData[key1][key2]['Value2'];
            dctTable['EnquiryValue']=dctTempData[key1][key2]['Value1'];
            dctTable['SaleValue']=dctTempData[key1][key2]['Value2'];
            salesValue=dctTempData[key1][key2]['Value2'];
            enquiryValue=dctTempData[key1][key2]['Value1'];  
            saleQty=dctTable['SaleQty'];
            enqQty=dctTable['EnquiryQty'];
            if(this.grandTotal==0){
              dctTable['Contrib_per']=0;
            } else{
              dctTable['Contrib_per']=((salesValue/this.grandTotal)*100).toFixed(2);
            }
            if(enquiryValue==0){
              dctTable['Conversion_per']=0;
            } else{
              dctTable['Conversion_per']=((salesValue/enquiryValue)*100).toFixed(2);
            }
            if(this.saleQtyTot==0){
              dctTable['ContribQty_per']=0;
            } else{
              dctTable['ContribQty_per']=((saleQty/this.saleQtyTot)*100).toFixed(2);
            }     
            lstData.push(dctTable);
            dctTable={};
            }
            this.dataSource1= new MatTableDataSource(lstData);
            this.dataSource1.sort=this.matSort1;
            this.dataSource1=this.PaginationSort(this.dataSource1);
          }  
        } else if (type == 'bar') {
          for(var key1 in dctTempData){
            for(var key2 in dctTempData[key1]){
              this.grandTotal+=dctTempData[key1][key2]['Value1'];
              this.enqQtyTot+=dctTempData[key1][key2]['Value1'];
              this.enqValTot+=dctTempData[key1][key2]['Value1'];  
            }
          }
          dctTotal['enqQtyTot']=this.enqQtyTot;
          dctTotal['enqValTot']=this.enqValTot;
          let enquiryValue,enqQty;
          for(var key1 in dctTempData){
            for(var key2 in dctTempData[key1]){ 
              if(this.chartHead=='Staff'){
                dctTable['Name']=this.dctReportData.staffs[key2];
              }else{
                dctTable['Name']=key2; 
              }
              dctTable['EnquiryQty']=dctTempData[key1][key2]['Value1'];
              enquiryValue=dctTempData[key1][key2]['Value1'];
              enqQty=dctTable['EnquiryQty'];
              if(this.grandTotal==0){
                dctTable['Contrib_per']=0;
              } else{
                dctTable['Contrib_per']=((enquiryValue/this.grandTotal)*100).toFixed(2);
              }    
              lstData.push(dctTable);
              dctTable={};
              }
              this.dataSource2= new MatTableDataSource(lstData);
              this.dataSource2.sort=this.matSort2;
              this.dataSource2=this.PaginationSort(this.dataSource2);
            }  
          } else if (type == 'pie' || type === 'doughnut') {
          for(var key1 in dctTempData){
              this.grandTotal+=dctTempData[key1]['Value1'];             
              this.enqQtyTot+=dctTempData[key1]['Value1'];
              this.enqValTot+=dctTempData[key1]['Value1'];  
          }
          dctTotal['enqQtyTot']=this.enqQtyTot;
          dctTotal['enqValTot']=this.enqValTot;     
          let enquiryValue,enqQty;    
          for(var key1 in dctTempData){
            for(var key2 in dctTempData[key1]){ 
              if(this.chartHead=='Staff'){
                dctTable['Name']=this.dctReportData.staffs[key2];
              }else{
                dctTable['Name']=key1; 
              }       
              dctTable['EnquiryQty']=dctTempData[key1]['Value1'];          
              enquiryValue=dctTempData[key1]['Value1'];  
              enqQty=dctTable['EnquiryQty'];
              if(this.grandTotal==0){
                dctTable['Contrib_per']=0;
              } else{
                dctTable['Contrib_per']=((enquiryValue/this.grandTotal)*100).toFixed(2);
              }  
            }
            lstData.push(dctTable);
            dctTable={};
            }  
            this.dataSource2= new MatTableDataSource(lstData);
            this.dataSource2.sort=this.matSort2;

            this.dataSource2=this.PaginationSort(this.dataSource2);
          }   
          this.modalService.open(modal,{windowClass:'dataModal'})
        
    }

    showPopupData(modal, chartHead,chartNumber,type){
      // console.log(this.chart_1_Options.title,"title");

      
      
      if (type == 'grouped_bar') {
        this.showPopupSale = true;
        this.showPopupEnq = false;
      } else if(type == 'bar' || type == 'pie' || type === 'doughnut'){
        this.showPopupEnq = true;
        this.showPopupSale = false;
      }
      let dctTempData: any = [];
      let dctTable={};
      let lstData=[];
      this.grandTotal=0;
      this.chartHead=chartHead;
      this.strChartNumber=chartNumber;
      this.strChartType=type;
      // dctTempData=this.dctReportData[chartHead];

      if(chartNumber=='str_chart_1'){
        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1']];        
        this.valueIteration(modal, dctTempData,type);
        // this.chartName=this.dct_product;
      } else if(chartNumber=='str_chart_2'){
          if (this.chart2Key=='str_chart2'){
          dctTempData=this.dctReportData[this.dct_chartNames['str_chart2']];
          this.valueIteration(modal, dctTempData,type);
          } else if(this.chart2Key=='str_chart1_chart2'){
          dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1];
          this.valueIteration(modal, dctTempData,type);
        }
        // this.chartName=this.dct_brand;
      } else if(chartNumber=='str_chart_3'){
        if (this.chart3Key=='str_chart3'){
          dctTempData=this.dctReportData[this.dct_chartNames['str_chart3']];
          this.valueIteration(modal, dctTempData,type);
          } else if(this.chart3Key=='str_chart1_chart3'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1];
            this.valueIteration(modal, dctTempData,type);
          } else if(this.chart3Key=='str_chart1_chart2_chart3'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']][this.selectedOptionChart_1][this.selectedOptionChart_2];
            this.valueIteration(modal, dctTempData,type);
          }
      // this.chartName=this.dct_item;
    } else if(chartNumber=='str_chart_4'){
        if (this.chart4Key=='str_chart4'){
          dctTempData=this.dctReportData[this.dct_chartNames['str_chart4']];
          this.valueIteration(modal, dctTempData,type);
          } else if(this.chart4Key=='str_chart1_chart4'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1];
            this.valueIteration(modal, dctTempData,type);
          } else if(this.chart4Key=='str_chart1_chart2_chart4'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']][this.selectedOptionChart_1][this.selectedOptionChart_2];
            this.valueIteration(modal, dctTempData,type);
          } else if(this.chart4Key=='str_chart1_chart2_chart3_chart4'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
            this.valueIteration(modal, dctTempData,type);
          }
          this.valueIteration(modal, dctTempData,type);
      // this.chartName=this.dct_product;
        } else if(chartNumber=='str_chart_5'){
          if (this.chart5Key=='str_chart5'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart5']];
            this.valueIteration(modal, dctTempData,type);
          } else if(this.chart5Key=='str_chart1_chart5'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1];
            this.valueIteration(modal, dctTempData,type);
          } else if(this.chart5Key=='str_chart1_chart2_chart5'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']][this.selectedOptionChart_1][this.selectedOptionChart_2];
            this.valueIteration(modal, dctTempData,type);
          } else if(this.chart5Key=='str_chart1_chart2_chart3_chart5'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
            this.valueIteration(modal, dctTempData,type);
          } else if(this.chart5Key=='str_chart1_chart2_chart3_chart4_chart5'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
            this.valueIteration(modal, dctTempData,type); 
          } 
        this.valueIteration(modal, dctTempData,type);
        // this.chartName=this.dct_product;
          } else if(chartNumber=='str_chart_6'){ 
            if (this.chart6Key=='str_chart6'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart6']];
              this.valueIteration(modal, dctTempData,type);
            } else if(this.chart6Key=='str_chart1_chart6'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1];
              this.valueIteration(modal, dctTempData,type);
            } else if(this.chart6Key=='str_chart1_chart2_chart6'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']][this.selectedOptionChart_1][this.selectedOptionChart_2];
              this.valueIteration(modal, dctTempData,type);
            } else if(this.chart6Key=='str_chart1_chart2_chart3_chart6'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
              this.valueIteration(modal, dctTempData,type);
            } else if(this.chart6Key=='str_chart1_chart2_chart3_chart4_chart6'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
              this.valueIteration(modal, dctTempData,type); 
            } else if(this.chart6Key=='str_chart1_chart2_chart3_chart4_chart5_chart6'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
              this.valueIteration(modal, dctTempData,type); 
            }
          this.valueIteration(modal, dctTempData,type);
          // this.chartName=this.dct_product;
            } else if(chartNumber=='str_chart_7'){ 
              if (this.chart7Key=='str_chart7'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart7']];
                this.valueIteration(modal, dctTempData,type);
              } else if(this.chart7Key=='str_chart1_chart7'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1];
                this.valueIteration(modal, dctTempData,type);
              } else if(this.chart7Key=='str_chart1_chart2_chart7'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                this.valueIteration(modal, dctTempData,type);
              } else if(this.chart7Key=='str_chart1_chart2_chart3_chart7'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                this.valueIteration(modal, dctTempData,type);
              } else if(this.chart7Key=='str_chart1_chart2_chart3_chart4_chart7'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                this.valueIteration(modal, dctTempData,type); 
              } else if(this.chart7Key=='str_chart1_chart2_chart3_chart4_chart5_chart7'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                this.valueIteration(modal, dctTempData,type); 
              } else if(this.chart7Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6];
                this.valueIteration(modal, dctTempData,type); 
              }
            this.valueIteration(modal, dctTempData,type);
            // this.chartName=this.dct_product;
              } else if(chartNumber=='str_chart_8'){ 
                if (this.chart8Key=='str_chart8'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart8']];
                  this.valueIteration(modal, dctTempData,type);
                } else if(this.chart8Key=='str_chart1_chart8'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1];
                  this.valueIteration(modal, dctTempData,type);
                } else if(this.chart8Key=='str_chart1_chart2_chart8'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                  this.valueIteration(modal, dctTempData,type);
                } else if(this.chart8Key=='str_chart1_chart2_chart3_chart8'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                  this.valueIteration(modal, dctTempData,type);
                } else if(this.chart8Key=='str_chart1_chart2_chart3_chart4_chart8'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                  this.valueIteration(modal, dctTempData,type); 
                } else if(this.chart8Key=='str_chart1_chart2_chart3_chart4_chart5_chart8'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                  this.valueIteration(modal, dctTempData,type); 
                } else if(this.chart8Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart8'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6];
                  this.valueIteration(modal, dctTempData,type); 
                } else if(this.chart8Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7];
                  this.valueIteration(modal, dctTempData,type); 
                }
              this.valueIteration(modal, dctTempData,type);
              // this.chartName=this.dct_product;
                } else if(chartNumber=='str_chart_9'){ 
                  if (this.chart9Key=='str_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart9']];
                    this.valueIteration(modal, dctTempData,type);
                  } else if(this.chart9Key=='str_chart1_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1];
                    this.valueIteration(modal, dctTempData,type);
                  } else if(this.chart9Key=='str_chart1_chart2_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                    this.valueIteration(modal, dctTempData,type);
                  } else if(this.chart9Key=='str_chart1_chart2_chart3_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                    this.valueIteration(modal, dctTempData,type);
                  } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                    this.valueIteration(modal, dctTempData,type); 
                  } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart5_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                    this.valueIteration(modal, dctTempData,type); 
                  } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6];
                    this.valueIteration(modal, dctTempData,type); 
                  } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7];
                    this.valueIteration(modal, dctTempData,type); 
                  } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8];
                    this.valueIteration(modal, dctTempData,type); 
                  }
                this.valueIteration(modal, dctTempData,type);
                // this.chartName=this.dct_product;
                  } else if(chartNumber=='str_chart_10'){ 
                    if (this.chart10Key=='str_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart10']];
                      this.valueIteration(modal, dctTempData,type);
                    } else if(this.chart10Key=='str_chart1_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1];
                      this.valueIteration(modal, dctTempData,type);
                    } else if(this.chart10Key=='str_chart1_chart2_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                      this.valueIteration(modal, dctTempData,type);
                    } else if(this.chart10Key=='str_chart1_chart2_chart3_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                      this.valueIteration(modal, dctTempData,type);
                    } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                      this.valueIteration(modal, dctTempData,type); 
                    } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                      this.valueIteration(modal, dctTempData,type); 
                    } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6];
                      this.valueIteration(modal, dctTempData,type); 
                    } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7];
                      this.valueIteration(modal, dctTempData,type); 
                    } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8];
                      this.valueIteration(modal, dctTempData,type); 
                    } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9];
                      this.valueIteration(modal, dctTempData,type); 
                    }
                  this.valueIteration(modal, dctTempData,type);
                  // this.chartName=this.dct_product;
                    }
    
      this.chartHead=chartHead;
    }
    closePopup(){
      this.showPopupEnq=false;
      this.showPopupSale=false;
      }
      PaginationSort(source) {
        // source.paginator = this.paginator;
        // source.paginator.firstPage();
        // console.log(this.sort,"sort details")
        // source.sort = this.sort;
        // source.sort = this.matSort2;

        return source;
      }



      exportAsXLSX(modal){
        let type=this.strChartType;
       

        this.expJsondata['type']=this.strChartType;
        this.expJsondata['charthead']=this.chartHead;
        this.expJsondata['component']='Generelised';
        this.expJsondata['chartname']=this.chartName;
        this.expJsondata['displayedcolumns']=this.displayedColumns;
        this.expJsondata['switch_change']=this.switch_change;
        this.expJsondata['strHead']=this.strHead;
        this.expJsondata['strHead2']=this.strHead2
        
        let chartNumber=this.strChartNumber;
        // console.log(this.matSort1," matsort details");
        if (type == 'grouped_bar') {
          this.showPopupSale = true;
          this.showPopupEnq = false;
          // this.expJsondata['sortname']=this.matSort1.active;
          // this.expJsondata['sortdirection']=this.matSort1.direction;
        } else if(type == 'bar' || type == 'pie' || type === 'doughnut'){
          this.showPopupEnq = true;
          this.showPopupSale = false;
          // this.expJsondata['sortname']=this.matSort2.active;
          // this.expJsondata['sortdirection']=this.matSort2.direction;     
        }
        let dctTempData: any = [];
        let dctTable={};
        let lstData=[];
        this.grandTotal=0;
        // this.chartHead=chartHead;
        // dctTempData=this.dctReportData[chartHead];
  
        if(chartNumber=='str_chart_1'){
          dctTempData=this.dctReportData[this.dct_chartNames['str_chart1']];        
          this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
          // this.chartName=this.dct_product;
        } else if(chartNumber=='str_chart_2'){
            if (this.chart2Key=='str_chart2'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart2']];
            this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
          } else if(this.chart2Key=='str_chart1_chart2'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2']][this.selectedOptionChart_1];
            this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
          }
          // this.chartName=this.dct_brand;
        } else if(chartNumber=='str_chart_3'){
          if (this.chart3Key=='str_chart3'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart3']];
            this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
          } else if(this.chart3Key=='str_chart1_chart3'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart3']][this.selectedOptionChart_1];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            } else if(this.chart3Key=='str_chart1_chart2_chart3'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3']][this.selectedOptionChart_1][this.selectedOptionChart_2];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            }
        // this.chartName=this.dct_item;
      } else if(chartNumber=='str_chart_4'){
          if (this.chart4Key=='str_chart4'){
            dctTempData=this.dctReportData[this.dct_chartNames['str_chart4']];
            this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
          } else if(this.chart4Key=='str_chart1_chart4'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart4']][this.selectedOptionChart_1];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            } else if(this.chart4Key=='str_chart1_chart2_chart4'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart4']][this.selectedOptionChart_1][this.selectedOptionChart_2];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            } else if(this.chart4Key=='str_chart1_chart2_chart3_chart4'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            }
            this.valueIteration(modal, dctTempData,type);
        // this.chartName=this.dct_product;
          } else if(chartNumber=='str_chart_5'){
            if (this.chart5Key=='str_chart5'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart5']];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            } else if(this.chart5Key=='str_chart1_chart5'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart5']][this.selectedOptionChart_1];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            } else if(this.chart5Key=='str_chart1_chart2_chart5'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart5']][this.selectedOptionChart_1][this.selectedOptionChart_2];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            } else if(this.chart5Key=='str_chart1_chart2_chart3_chart5'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart5']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            } else if(this.chart5Key=='str_chart1_chart2_chart3_chart4_chart5'){
              dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
              this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            } 
          this.valueIteration(modal,dctTempData,type);
          // this.chartName=this.dct_product;
            } else if(chartNumber=='str_chart_6'){ 
              if (this.chart6Key=='str_chart6'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart6']];
                this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
              } else if(this.chart6Key=='str_chart1_chart6'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart6']][this.selectedOptionChart_1];
                this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
              } else if(this.chart6Key=='str_chart1_chart2_chart6'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart6']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
              } else if(this.chart6Key=='str_chart1_chart2_chart3_chart6'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart6']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
              } else if(this.chart6Key=='str_chart1_chart2_chart3_chart4_chart6'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart6']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
              } else if(this.chart6Key=='str_chart1_chart2_chart3_chart4_chart5_chart6'){
                dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
              }
            this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
            // this.chartName=this.dct_product;
              } else if(chartNumber=='str_chart_7'){ 
                if (this.chart7Key=='str_chart7'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart7']];
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                } else if(this.chart7Key=='str_chart1_chart7'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart7']][this.selectedOptionChart_1];
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                } else if(this.chart7Key=='str_chart1_chart2_chart7'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                } else if(this.chart7Key=='str_chart1_chart2_chart3_chart7'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                } else if(this.chart7Key=='str_chart1_chart2_chart3_chart4_chart7'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                } else if(this.chart7Key=='str_chart1_chart2_chart3_chart4_chart5_chart7'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                } else if(this.chart7Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7'){
                  dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6];
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                }
                this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                // this.chartName=this.dct_product;
                } else if(chartNumber=='str_chart_8'){ 
                  if (this.chart8Key=='str_chart8'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart8']];
                    this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  } else if(this.chart8Key=='str_chart1_chart8'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart8']][this.selectedOptionChart_1];
                    this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  } else if(this.chart8Key=='str_chart1_chart2_chart8'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                    this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  } else if(this.chart8Key=='str_chart1_chart2_chart3_chart8'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                    this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  } else if(this.chart8Key=='str_chart1_chart2_chart3_chart4_chart8'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                    this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  } else if(this.chart8Key=='str_chart1_chart2_chart3_chart4_chart5_chart8'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                    this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  } else if(this.chart8Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart8'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6];
                    this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  } else if(this.chart8Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8'){
                    dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7];
                    this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  }
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  // this.chartName=this.dct_product;
                  } else if(chartNumber=='str_chart_9'){ 
                    if (this.chart9Key=='str_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart9']];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    } else if(this.chart9Key=='str_chart1_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart9']][this.selectedOptionChart_1];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    } else if(this.chart9Key=='str_chart1_chart2_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    } else if(this.chart9Key=='str_chart1_chart2_chart3_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart5_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    } else if(this.chart9Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9'){
                      dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8];
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                    }
                  this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                  // this.chartName=this.dct_product;
                    } else if(chartNumber=='str_chart_10'){ 
                      if (this.chart10Key=='str_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart10']];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart10']][this.selectedOptionChart_1];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart2_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart2_chart3_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      } else if(this.chart10Key=='str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10'){
                        dctTempData=this.dctReportData[this.dct_chartNames['str_chart1_chart2_chart3_chart4_chart5_chart6_chart7_chart8_chart9_chart10']][this.selectedOptionChart_1][this.selectedOptionChart_2][this.selectedOptionChart_3][this.selectedOptionChart_4][this.selectedOptionChart_5][this.selectedOptionChart_6][this.selectedOptionChart_7][this.selectedOptionChart_8][this.selectedOptionChart_9];
                        this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      }
                      this.reportComponent.valueIterationGeneralised(dctTempData,this.dctReportData,this.expJsondata);
                      // this.chartName=this.dct_product;
                      }
      
        // this.chartHead=chartHead;
        this.downloadLog(this.dctJsonData1)
      }
      downloadLog(dctJsonData){
        let chart = localStorage.getItem('chartexport');
        // excel/pdf chart table pagenumber value/quantity filters
        let dctDownloadLog  = {};
        let branches = '';
        let staffs = '';
        let brands = '';
        let products = '';
        let items = '';

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
      
        if(this.statusStaffSelected){
          this.statusStaffSelected.forEach(element => {
           staffs = staffs + " " + element.name;            
          });
          dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + staffs;
        }

        if(this.statusBrandSelected){
          this.statusBrandSelected.forEach(element => {
           brands = brands + " " + element.name;            
          });
          dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + brands;
        }


        if(this.statusProductSelected){
          this.statusProductSelected.forEach(element => {
           products = products + " " + element.name;            
          });
          dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + products;
        }
 
        
        if(this.statusItemSelected){
          this.statusItemSelected.forEach(element => {
           items = items + " " + element.name;            
          });
          dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + items;
        }
 


        if(this.statusSelected){
          this.statusSelected.forEach(element => {
            branches = branches + " " + element.name
          });

        }
        if(this.branchName){
          dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + branches;    
        }
        // if(this.brandName!=''){
        //   dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " + this.brandName;
        // }
       
        // if(this.product!=''){
        //   dctDownloadLog['vchr_filter'] = dctDownloadLog['vchr_filter'] + " " +this.product;
        // }
      
    
        
        this.serviceObject.postData("download_log/",dctDownloadLog)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
                // this.spinnerService.hide();
                this.showSpinner=false;


    
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
              // this.spinnerService.hide();
              this.showSpinner=false;


            // this.snotifyService.error('No data found');
           }
          },
          (error) => {
            // this.spinnerService.hide();
            this.showSpinner=false;

          });
      }
}
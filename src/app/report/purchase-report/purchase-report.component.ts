import {Component, ElementRef, ViewChild,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { LocalDataSource } from 'ng2-smart-table';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { timeHours } from 'd3';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelServicesService } from "../../services/excel-services.service";
import { TitleCasePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  blnFilterOn = false;

  searchStaff: FormControl = new FormControl();
  lstStaff = []
  intStaffId;
  strStaff;
  strSelectedStaff;
  currentStaff='';
  blnBranch=false
//  chips variable
visible = true;
selectable = true;
removable = true;
addOnBlur = true;
separatorKeysCodes: number[] = [ENTER, COMMA];
flag = false;
flag1 = false;
dctData = {}
  moreFilters: string[] = [
    'Date'
  ];

  lstFiltersData: string[] = [
     'Date',
     'Purchase Number',
     'Tax Value',
     'Taxable Value',
     'Item Code',
     
    //  'Branch',
     'Vendor',
     'Staff',
     'Product',
     'Brand',
     'Item',
     'Imei/Batch'
  ];
  strDateShow = 'none';
  strInvoiceShow = 'none';
  strBranchShow = 'none';
  strBrandShow = 'none';
  strCustomerShow = 'none';
  strStaffShow = 'none';
  strProductShow = 'none';
  strItemShow = 'none';
  strImeiShow = 'none';
  strTaxShow = 'none';
  strTaxableShow = 'none';
  strItemCodeShow= 'none';

  strDateShowTot = 'none';
  strInvoiceShowTot= 'none';
  strBranchShowTot = 'none';
  strBrandShowTot = 'none';
  strCustomerShowTot = 'none';
  strStaffShowTot = 'none';
  strProductShowTot = 'none';
  strItemShowTot = 'none';
  strImeiShowTot = 'none';
  strTaxShowTot = 'none';
  strTaxableShowTot = 'none';
  strItemCodeShowTot= 'none';

  blnSmartChoice=false
  blnService =false

  lstFilterDataCopy=JSON.parse(JSON.stringify(this.lstFiltersData))
  lstFilterDataCopy1=JSON.parse(JSON.stringify(this.lstFiltersData))
 
  filteredOptions: Observable<string[]>;
  lstShowFilterOptions=[];
  coloumnFilters =[]

  lstMoreFilter = [];
  lstDisplayedColumns=['date','invoiceNo','branch','customer','staff','product','brand','item_code','item' ,'imei','tax','taxable','qty','amount'];
  lstData=[];
  dataSource;

  intTotalQty=0
  intTotalAmt=0
  intTotalTax=0
  intTotalTaxable=0

  @ViewChild('filterInput') filterInput:
   ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  searchCustomer: FormControl = new FormControl();
  lstCustomer = []
  intCustomerId;
  strCustomer;
  strSelectedCustomer;
  currentCustomer='';

  searchSupplier: FormControl = new FormControl();
  lstSupplier = []
  intSupplierId;
  strSupplier;
  strSelectedSupplier;
  currentSupplier='';



  blnMoreFilterClicked = false;
  dctCol={}
  lstPermission=JSON.parse(localStorage.group_permissions)
  blnAdd = false;
  blnEdit = false;
  blnDelete = false;
  blnView = false;
  blnDownload = false;
  searchMoreFilter: FormControl = new FormControl();
  strMoreFilter = '';

  dctExportData={datFrom:'',datTo:'',staff:'',customer:''}
  lstItems=[]
  

  lstProduct=[]
  productOptions=[]
  productConfig = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description
    search:true ,//true/false for the search functionlity defaults to false,
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Product',// text to be displayed when no item is selected defaults to Select,
    selectAll: 'true', // Should enable select all feature for multiple select items
    selectAllText: 'Select All',
    customComparator: ()=>{} ,// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo: Options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    // moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    // noResultsFound: 'No results found!' ,// text to be displayed when no items are found while searching
    // searchPlaceholder:'Search' ,// label thats displayed in search input,
    searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: true // clears search criteria when an option is selected if set to true, default is false
  }

  lstBrand=[]
  brandOptions=[]
  brandConfig = {displayKey:"name", height: '200px',search:true ,customComparator: ()=>{} ,placeholder:'Brand',searchOnKey: 'name',clearOnSelection: true }

  lstItem=[]
  // itemOptions=[]
  // itemConfig = {displayKey:"name", height: '200px',search:true ,placeholder:'Item',customComparator: ()=>{} ,searchOnKey: 'name',clearOnSelection: true}
  
  lstItemCategory=[]
  itemCategoryOptions=[]
  itemCategoryConfig = {displayKey:"name", height: '200px',search:true ,customComparator: ()=>{} ,placeholder:'Item Category',searchOnKey: 'name',clearOnSelection: true}
    
  lstItemGroup=[]
  itemGroupOptions=[]
  itemGroupConfig = {displayKey:"name", height: '200px',customComparator: ()=>{} ,search:true ,placeholder:'Item Group',searchOnKey: 'name',clearOnSelection: true  }

  lstBranch=[]
  branchOptions=[]
  branchConfig = {displayKey:"name",search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'name',clearOnSelection: true  }

  currentItem:''

  constructor(
    private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private titlecasePipe:TitleCasePipe,
    private spinnerService: NgxSpinnerService,

    private excelService: ExcelServicesService,
    public router: Router,) {
    this.source = new LocalDataSource(this.data);
      // this.filteredOptions = this.searchMoreFilter.valueChanges.pipe(
      //   startWith(null),
      //   map((data: string | null) => data ? this._filter(data) : this.lstFiltersData.slice()));
   }
   source: LocalDataSource;
   data;
   blnShowData=false;
   datTo;
   intPhone=null;
   datFrom;
   selectedFrom;
   selectedTo;
   show = '';
   searchItem: FormControl = new FormControl();
   intItemId;
   strSelectedItem = '';
   selectedDate;
   strItem='';
 
  
  ngOnInit() {


    this.datFrom = new Date()
    this.datTo = new Date();
    // this.getData()
    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Daily Sales Report") {
        this.blnAdd = item["ADD"];
        this.blnEdit= item["EDIT"];
        this.blnDelete = item["DELETE"];
        this.blnView = item["VIEW"]
        this.blnDownload = item["DOWNLOAD"]
      }
    });
    this.searchStaff.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstStaff = [];
      } else {
        if (strData.length >= 1) {
       
          this.serviceObject
            .postData('user/user_typeahead/',{terms:strData})
            .subscribe(
              (response) => {
                this.lstStaff = response['data'];
              }
            );
          }
        }
      }
    );

    this.searchCustomer.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstStaff = [];
      } else {
        if (strData.length >= 7) {
          
          this.serviceObject
            .postData('reports/customer_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCustomer = response['data'];
                
              }
            );
          }
        }
      }
    );
    this.searchItem.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItem = [];
      } else {
        if (strData.length >= 3) {
          this.serviceObject
            .postData('itemcategory/item_typeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.lstItem = response['data'];

              }
            );
        }
      }
    }
    );

    this.searchSupplier.valueChanges.debounceTime(100).subscribe(
      data=>{
      if (data === undefined || data === null) {
      } else {
    
        if (data.length > 1) {
          this.lstSupplier = [];
          this.typeaheadSupplier(data);       
        } else{
          this.lstSupplier = [];
        }
      }
    })


    this.searchMoreFilter.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData) {
          let data =this._filter(strData)
          this.flag = false;
          
          
          data.forEach(element => {
            if(this.moreFilters.includes(element)){
             
              
              this.flag = true;
              this.lstFilterDataCopy.splice(element, 1);
              this.lstShowFilterOptions = this.lstFilterDataCopy;
             
            }
          });
          if(!this.flag){
           
            
            this.lstShowFilterOptions = this._filter(strData)
          }
          
         
          

        
        
      } else {
        
        this.flag1=false;
        this.lstFiltersData.forEach(element => {
         
         
          if(this.moreFilters.includes(element)){
           
            this.flag1=true;
            
            this.lstFilterDataCopy1.splice(element, 1);
           
           
          }
        });
        if(this.flag1){
          this.lstShowFilterOptions = this.lstFilterDataCopy1;
        }
        else{
          this.lstShowFilterOptions = this.lstFiltersData;
        }
       
      }
    }
    );
   
    
  // this.hideColumnForUser()
  this.dataSource = new MatTableDataSource(
    this.lstData
  );
   
  this.getFilterData()
  }
  getFilterData(){
  // console.log("flkjfk", this.lstProduct,);
  
  this.selectedDate = moment(this.datFrom).format('YYYY-MM-DD')


      if(this.lstProduct.length>0)
      {
        let lstData=[]
        this.lstProduct.forEach(element => {
          lstData.push(element.id)
        });

        this.dctData['lstProduct'] = lstData;
      }

      if(this.lstBrand.length>0){
        let lstData=[]
        this.lstBrand.forEach(element => {
          lstData.push(element.id)
        });
        this.dctData['lstBrand'] = lstData;
      }

      if(this.lstItemCategory.length>0){
        let lstData=[]
        this.lstItemCategory.forEach(element => {
          lstData.push(element.id)
        });
        this.dctData['lstItemCategory'] = lstData;
      }

      if(this.lstItemGroup.length>0){
        let lstData=[]
        this.lstItemGroup.forEach(element => {
          lstData.push(element.id)
        });
        this.dctData['lstItemGroup'] = lstData;
      }


      if(this.lstBranch.length>0){
        let lstData=[]
        this.lstBranch.forEach(element => {
          lstData.push(element.id)
        });
        this.dctData['lstBranch'] = lstData;
      }

      this.dctData['lst_more_filter'] = ["Product", "Brand"]
      this.dctData['blnCheck']=true
      this.dctData['date'] = this.selectedDate;
      this.dctData['blnExport']=false
      
      this.spinnerService.show();
      
  
      this.serviceObject.postData('reports/daily_branch_stock_report/',this.dctData).subscribe(
        (response) => {
        this.spinnerService.hide();
        
          
            if (response.status == 1)
            {
              if(response.hasOwnProperty('bln_branch')){

                this.blnBranch=response['bln_branch']
                if(this.blnBranch)
                {
                 this.lstFiltersData.push('Branch')
                }
              }

              this.productOptions=response['dct_data']['product']
              this.brandOptions=response['dct_data']['brand']
              this.itemCategoryOptions=response['dct_data']['item_category']
              this.itemGroupOptions=response['dct_data']['item_group']
              this.branchOptions=response['dct_data']['branch']
            

            }  
            
            else if (response.status == 0) 
            {
             swal.fire('Error!',response['reason'], 'error');
            }
        },
        (error) => {   
          this.spinnerService.hide();
         swal.fire('Error!','Something went wrong!!', 'error');
        });
    // }

  }
  itemChanged(item){
    this.intItemId = item.id;
    this.strItem = item.code_name;
    this.currentItem= item.code_name;
    this.strSelectedItem = item.code_name;

  }
  itemNgModelChanged(event){
    if(this.currentItem!=this.strSelectedItem){
      this.intItemId = null;
      this.strItem = '';
    }
  }
  getData()
  {
  // console.log("flkjfk", this.lstProduct,);
    
    let dctData = {}
    let error=false
    this.dctExportData={datFrom:'',datTo:'',staff:'',customer:''}
    
    if(this.strSelectedItem){
      if (this.strSelectedItem != this.strItem|| !this.strSelectedItem)
        {
        this.toastr.error('Valid Item Name is required', 'Error!');
        this.intItemId = null
        this.strItem = ''
        this.strSelectedItem=''
        return false;
        }
     }
     if(this.strSelectedItem){
    dctData['lstItem'] = [this.intItemId];
    }

    if(this.lstProduct.length>0)
    {
      let lstData=[]
      this.lstProduct.forEach(element => {
        lstData.push(element.id)
      });

      dctData['lstProduct'] = lstData;
    }
// console.log(  dctData,"fggg");

    if(this.lstBrand.length>0){
      let lstData=[]
      this.lstBrand.forEach(element => {
        lstData.push(element.id)
      });
      dctData['lstBrand'] = lstData;
    }

    if(this.lstItemCategory.length>0){
      let lstData=[]
      this.lstItemCategory.forEach(element => {
        lstData.push(element.id)
      });
      dctData['lstItemCategory'] = lstData;
    }

    if(this.lstItemGroup.length>0){
      let lstData=[]
      this.lstItemGroup.forEach(element => {
        lstData.push(element.id)
      });
      dctData['lstItemGroup'] = lstData;
    }


    if(this.lstBranch.length>0){
      let lstData=[]
      this.lstBranch.forEach(element => {
        lstData.push(element.id)
      });
      dctData['lstBranch'] = lstData;
    }
     
      if(this.strSelectedStaff){
        if (this.strSelectedStaff != this.strStaff)
          {
          this.intStaffId = null
          this.strStaff = ''
          this.strSelectedStaff=''
          this.toastr.error('Valid Staff Name is required', 'Error!');
          error=true;
          }
      }
      if(this.strSelectedSupplier){
        if (this.strSelectedSupplier != this.strSupplier)
          {
          this.intSupplierId = null
          this.strSupplier = ''
          this.strSelectedSupplier=''
          this.toastr.error('Valid Vendor Name is required', 'Error!');
          error=true;
          }
      }
    
   
      this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
      this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
      
      if (this.datFrom > this.datTo || (!this.datFrom) || (!this.datTo) )  {
  
        swal.fire({
          position: "center",
          type: "error",
          text: "Please select correct date period",
          showConfirmButton: true,
        });
        error=true;
      }
      this.dctExportData['datFrom']= moment(this.datFrom).format('DD-MM-YYYY')
      this.dctExportData['datTo']= moment(this.datTo).format('DD-MM-YYYY')
      // this.dctExportData['int_saleable']=this.intSalable

      if(this.strStaff)
      {
        dctData['intStaffId']=this.intStaffId
        this.dctExportData['staff']=this.strStaff
      }
      if(this.strSupplier)
      {
        dctData['intSupplierId']=this.intSupplierId;
        this.dctExportData['supplier']=this.strSupplier
        
      }
       if(this.blnMoreFilterClicked){
        dctData['lst_moreFilter'] = this.moreFilters;
       }
        
      

      if(!error){
      dctData['datFrom'] = this.selectedFrom
      dctData['datTo'] = this.selectedTo
      dctData['bln_smart_choice'] = this.blnSmartChoice
      dctData['bln_service'] = this.blnService

      
      this.spinnerService.show();

      this.serviceObject.postData('reports/purchase_report/',dctData).subscribe(
        (response) => {
          this.spinnerService.hide();

            if (response.status == 1)
            {
              if(response['lst_data'].length!=0){
                // console.log(response['lst_data'].length);
                
                this.data=response['lst_data'];
                this.lstItems=response['lst_data'];
                  
    
                  this.blnShowData=true;
                  // this.data.forEach((element,index) => {
                  //   if(element.dbl_total_amount!=null){
                  //  element.dbl_total_amount = element.dbl_total_amount.toFixed(2);
                  //   }
                  // });
  
                  this.showFilterColumn()
                  this.dataSource = new MatTableDataSource(
                    this.data
                  );

                  this.dataSource.paginator = this.paginator;
                  // this.dataSource.paginator.firstPage();
                  this.dataSource.sort = this.sort;
                  this.calculateTotalAmt();
                 
                 
                
              }
              else{
                this.blnShowData=false;
                
              }
              
            }  

            
            else if (response.status == 0) 
            {
             this.blnShowData=false;
             swal.fire('Error!',response['reason'], 'error');
            }
        },
        (error) => {  
          this.spinnerService.hide();

         swal.fire('Error!','Something went wrong!!', 'error');
        });
    }

  }
  showFilterColumn(){
 
    this.strBranchShow = 'none';
    this.strBrandShow = 'none';
    this.strItemShow = 'none';
    this.strCustomerShow = 'none';
    this.strInvoiceShow = 'none';
    this.strStaffShow = 'none';
    this.strProductShow = 'none';
    this.strDateShow = 'none';
    this.strImeiShow = 'none';
    this.strTaxShow = 'none';
    this.strTaxableShow = 'none';
    this.strItemCodeShow= 'none';

    this.strBranchShowTot = 'none';
    this.strBrandShowTot = 'none';
    this.strItemShowTot = 'none';
    this.strCustomerShowTot = 'none';
    this.strInvoiceShowTot = 'none';
    this.strStaffShowTot = 'none';
    this.strProductShowTot = 'none';
    this.strDateShowTot = 'none';
    this.strImeiShowTot = 'none';
    this.strTaxShowTot = 'none';
    this.strTaxableShowTot = 'none';
    this.strItemCodeShowTot= 'none';


    if(this.data[0].vchr_customer_name){
      this.strCustomerShow = '';
    }
    if(this.data[0].vchr_staff_name){
      this.strStaffShow = '';
    }
    this.moreFilters.forEach((element,index) => {
            if(element == 'Date'){ 
             this.strDateShow = '';
            }
            if(element == 'Purchase Number'){
              this.strInvoiceShow = '';
            }
            if(element == 'Branch'){
              this.strBranchShow = '';
            }
            if(element == 'Vendor'){
              this.strCustomerShow = '';
            }
            if(element == 'Staff'){
              this.strStaffShow = '';
            }
            if(element == 'Product'){
              this.strProductShow = '';
            }
            if(element == 'Brand'){
              this.strBrandShow = '';
            }
            if(element == 'Item'){
              this.strItemShow = '';
            }
            if(element == 'Imei/Batch'){
              this.strImeiShow = '';
            }
            if(element == 'Tax Value'){
              this.strTaxShow= '';
            }
            if(element == 'Taxable Value'){
              this.strTaxableShow= '';
            }
            if(element == 'Item Code'){
              this.strItemCodeShow= '';
            }
          });
        
          if(this.moreFilters.includes('Date')){
            this.strDateShowTot=''
          }
          else if(this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strInvoiceShowTot=''
          }
          else if(this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strBranchShowTot=''
          }
          else if(this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strCustomerShowTot=''
          }
          else if(this.moreFilters.includes('Staff') && !this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strStaffShowTot=''
          }
          else if(this.moreFilters.includes('Product') && !this.moreFilters.includes('Staff') && !this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strProductShowTot=''
          }
          else if(this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Staff') && !this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strBrandShowTot=''
          }
          else if(this.moreFilters.includes('Item Code') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Staff') && !this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strItemCodeShowTot=''
          }
          else if(this.moreFilters.includes('Item') && !this.moreFilters.includes('Item Code') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Staff') && !this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strItemShowTot=''
          }
          else if(this.moreFilters.includes('Imei/Batch') && !this.moreFilters.includes('Item') && !this.moreFilters.includes('Item Code')  && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Staff') && !this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strImeiShowTot=''
          }
          else if(this.moreFilters.includes('Tax Value') && !this.moreFilters.includes('Imei/Batch') && !this.moreFilters.includes('Item') && !this.moreFilters.includes('Item Code') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Staff') && !this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strTaxShowTot=''
          }
          else if(this.moreFilters.includes('Taxable Value') && !this.moreFilters.includes('Tax Value') && !this.moreFilters.includes('Imei/Batch') && !this.moreFilters.includes('Item') && !this.moreFilters.includes('Item Code') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Staff') && !this.moreFilters.includes('Vendor') && !this.moreFilters.includes('Branch') && !this.moreFilters.includes('Purchase Number') && !this.moreFilters.includes('Date')){
            this.strTaxableShowTot=''
          }
            //   console.log(this.strBranchShowTot ,this.strBranchShow ,"strBranchShow",
            //   this.strBrandShowTot,  this.strBrandShow,"strBrandShow",
            //   this.strItemShowTot,this.strItemShow,"strItemShow",
            //   this.strCustomerShowTot,this.strCustomerShow,"strCustomerShow",
            //   this.strInvoiceShowTot,this.strInvoiceShow,"strInvoiceShow",
            //   this.strStaffShowTot,this.strStaffShow,"strStaffShow",
            //  this.strProductShowTot,  this.strProductShow,"strProductShow",
            //    this.strDateShowTot , this.strDateShow,"strDateShow",);
     }


  staffNgModelChanged(event){
    if(this.currentStaff!=this.strSelectedStaff){
      this.intStaffId = null;
      this.strStaff = '';
    }
  }
  staffChanged(item)
  {
   this.currentStaff = item.strUserName;
   this.intStaffId = item.intId;
   this.strStaff = item.strUserName;
   this.strSelectedStaff = item.strUserName;
 
 }

 customerNgModelChanged(event){
  if(this.currentCustomer!=this.strSelectedCustomer){
    this.intCustomerId = null;
    this.strCustomer = '';
  }
}
customerChanged(item)
{
 this.currentCustomer = item.name;
 this.intCustomerId = item.id;
 this.strCustomer = item.name;
 this.strSelectedCustomer = item.name;

}

supplierNgModelChanged(event){
  if(this.currentSupplier!=this.strSelectedSupplier){
    this.intSupplierId = null;
    this.strSupplier = '';
  }
}
supplierChanged(item)
{
 this.currentSupplier = item.name;
 this.intSupplierId = item.id;
 this.strSupplier = item.name;
 this.strSelectedSupplier = item.name;

}
filterClick(){
  this.blnFilterOn = true;
}
filterClickOff(){
  this.blnFilterOn = false;
  this.moreFilters = [
    'Date'
  ];

}


typeaheadSupplier(data){

  this.serviceObject.postData('purchase/supplier_typeahead/',{term:data}).subscribe(
    (response) => {
      this.lstSupplier.push(...response['data']);
    },
    (error) => {   
      swal.fire('Error!','error', 'error');
      
    });
}




remove(moreFilters: string): void {
  const index = this.moreFilters.indexOf(moreFilters);
  // if(moreFilters == 'Date'){
  //   this.toastr.error('Date is mandatory', 'Error!');
  //   return;
  // }
  // else{
    if (index >= 0) {
      this.moreFilters.splice(index, 1);
    // }
  }
}

selected(event: MatAutocompleteSelectedEvent): void {

  let flagSelected = false;
  this.moreFilters.forEach(element => {
    if(this.moreFilters.includes(event.option.viewValue)){
     
      flagSelected = true;
      return;
    }
  });

  if(!flagSelected){
  this.moreFilters.push(event.option.viewValue);
  this.filterInput.nativeElement.value = '';
  this.searchMoreFilter.setValue(null);
 }
 else {
  this.filterInput.nativeElement.value = '';
  this.searchMoreFilter.setValue(null);
  this.toastr.error('Column Already added', 'Error!');
 }
} 
private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.lstFiltersData.filter(moreFilters => moreFilters.toLowerCase().indexOf(filterValue) === 0);
}
normalSearch(){
  this.blnMoreFilterClicked = false;
  this.getData()
}
moreFilterClicked(){
  // console.log(this.moreFilters,"filter");
  if(this.moreFilters.length<=0){
    this.toastr.error('Select atleast one filter',);

  }
  else{
    this.blnMoreFilterClicked = true;
    // console.log(this.moreFilters,"data");
    
   
    this.getData()
  }

}
addMoreFilter(){
  // console.log('hi');
  
}
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    // this.dataSource.paginator.firstPage();
  }
}
calculateTotalAmt(){
  this.intTotalQty=0
  this.intTotalAmt=0
  this.intTotalTax=0
  this.intTotalTaxable=0

  // console.log( this.data,"lstDisplayedColumns");
  this.data.forEach(element => {
   this.intTotalQty=Number( element.quantity )+ Number(this.intTotalQty)
   this.intTotalAmt= Number(element.dbl_total_amount)+  Number(this.intTotalAmt)
   this.intTotalTax=Number((Number(element.tax_value)+  Number(this.intTotalTax)).toFixed(2))
   this.intTotalTaxable=Number((Number(element.dbl_taxable_value)+  Number(this.intTotalTaxable)).toFixed(2))
// console.log(element.dbl_taxable_value,this.intTotalTaxable,"dbl_taxable_value");

   
   
  });
  // console.log( this.intTotalTaxable, this.intTotalTax," this.intTotalAmt");
  // return 10
}



exportData(){
// console.log(this.lstItems,"lstItems");

  let count=1
  if(this.lstItems.length==0){
    swal.fire("Error!","No Data to Export","error");
    return false;
  }
  else{
    let lstTempData=[];
    for(let item of this.lstItems){
      let dctTable={};
      let dctTableOrder={};
      // for(let imei of item['imei']){/
        // console.log(imei,"imei");
        dctTable['Sno']=count;
    
        
        
        this.moreFilters.forEach(element => {

          if(element=='Date'){
            dctTable['Date']=item['dat_purchase'];
          }
           if(element=="Product"){
            dctTable['Product']=this.titlecasePipe.transform(item['vchr_product_name']);
            
          }
           if(element=="Item Code"){
            dctTable['Item Code']=this.titlecasePipe.transform(item['vchr_item_code']);
            
          }
          if(element=="Item"){
            dctTable['Item']=this.titlecasePipe.transform(item['vchr_item_name']);
          }

           if(element=="Brand"){
            dctTable['Brand']=this.titlecasePipe.transform(item['vchr_brand_name']);
          }

           if(element=="Staff"){
            dctTable['Staff']=this.titlecasePipe.transform(item['vchr_staff_name']);
          }

           if(element=="Vendor"){
            dctTable['Vendor']=this.titlecasePipe.transform(item['vchr_supplier_name']);
          }

           if(element=="Branch"){
            dctTable['Branch']=this.titlecasePipe.transform(item['vchr_branch_name']);
          }
          if(element=="Purchase Number"){
            dctTable['Purchase Number']=item['vchr_purchase_num'].toUpperCase();
          }
           if(element=="Imei/Batch"){
            dctTable['Imei/Batch']=item['imei_batch_number']
          }
          if(element=="Tax Value"){
            dctTable['Tax Value']=Number(item['tax_value']).toFixed(2)
          }
           if(element=="Taxable Value"){
            dctTable['Taxable Value']=item['dbl_taxable_value']
          }
          // else if(element=="Imei/Batch"){
            dctTable['Quantity']=item['quantity']
          // }
          
        });
        dctTable['Amount']=item['dbl_total_amount'];
        if (dctTable['Date']) {
          dctTableOrder['Date']= dctTable['Date']
        }
        if (dctTable['Branch']){
          dctTableOrder['Branch']= dctTable['Branch']
        }
        if (dctTable['Purchase Number']){
          dctTableOrder['Purchase Number']= dctTable['Purchase Number']
        }
        if (dctTable['Vendor']){
          dctTableOrder['Vendor']= dctTable['Vendor']
        }
        if (dctTable['Staff']){
          dctTableOrder['Staff']= dctTable['Staff']
        }
       
        if (dctTable['Imei/Batch']){
          dctTableOrder['Imei/Batch']= dctTable['Imei/Batch']
        }
        if (dctTable['Product']){
          dctTableOrder['Product']= dctTable['Product']
        }
        if(dctTable['Item Code']){
          dctTableOrder['Item Code']= dctTable['Item Code']
        }
        if (dctTable['Brand']){
          dctTableOrder['Brand']= dctTable['Brand']
        }
        if (dctTable['Item']){
          dctTableOrder['Item']= dctTable['Item']
        }
        if (dctTable['Tax Value']){
          dctTableOrder['Tax Value']= dctTable['Tax Value']
        }
        if (dctTable['Taxable Value']){
          dctTableOrder['Taxable Value']= dctTable['Taxable Value']
        }
        dctTableOrder['Quantity']= dctTable['Quantity']        

        if (dctTable['Amount']){
          dctTableOrder['Amount']= dctTable['Amount']
        }


        lstTempData.push(JSON.parse(JSON.stringify(dctTableOrder)));
        // console.log("dcttable",dctTableOrder)
        count=count+1
      // }
 
    }



let header=[];
let lstTemp=[];

lstTempData.forEach(d => {    
  let lstData=[];
  header=[];
    for(let key in d){     

        header.push(key);

      lstData.push(d[key]);
    }

    count++;
    lstTemp.push(lstData);
}
);

//footer

let lstFooter=[];

let headerIndex=0;

for(let element of header){

  let colNa=element;

    if((element=!'Taxable Value'&&element!='Tax Value')&&(headerIndex==0)){            
      lstFooter.push('Total');
    }
   
   if((colNa=='Date' ||  colNa=='Purchase Number' || colNa=='Item Code' || colNa=='Vendor' || colNa=='Staff' || colNa=='Product' || colNa=='Brand' || colNa=='Item' || colNa=='Imei/Batch')&&(headerIndex!=0)){      
      lstFooter.push('');
    }

    if((colNa=='Date' || colNa=='Purchase Number' || colNa=='Item Code' || colNa=='Vendor' || colNa=='Staff' || colNa=='Product' || colNa=='Brand' || colNa=='Item' || colNa=='Imei/Batch')&&(headerIndex==0)){      
      lstFooter.push('Total');
    }

    if(colNa=='Taxable Value'){      
      lstFooter.push(this.intTotalTaxable);
    }
    if(colNa=='Tax Value'){
      lstFooter.push(this.intTotalTax);
    }
    if(colNa=='Quantity'){
      lstFooter.push(this.intTotalQty);
    }
    if(colNa=='Amount'){
      lstFooter.push(this.intTotalAmt);
    }
 
  headerIndex++;
}


    let dct={}
    if(this.strDateShowTot==''){
      // console.log("hdfhgdfg");
      
      dct['Date']='Total'
    }


    if(this.strBranchShowTot==''){
      dct['Branch']='Total'
    }
 
    if(this.strInvoiceShowTot==''){
       dct['Purchase Number']='Total'
    }

    
    if(this.strCustomerShowTot==''){        
       dct['Vendor']='Total'
    }
 
    
    if(this.strStaffShowTot==''){        
       dct['Staff']='Total'
    }

    if(this.strImeiShowTot==''){        
        dct['Imei/Batch']='Total'
    }

    
    if(this.strProductShowTot==''){        
       dct['Product']='Total'
    }
 
    
    if(this.strBrandShowTot==''){        
        dct['Brand']='Total'
    }
 
    
    if(this.strItemShowTot==''){        
       dct['Item']='Total'
    }
   
        
    if(this.strItemCodeShowTot==''){        
      dct['Item Code']='Total'
    }
 
    
    if(this.strTaxShow==''){        
      dct['Tax Value']=this.intTotalTax
      this.dctExportData['intTotalTax']=this.intTotalTax
      
   }

   if(this.strTaxableShow==''){        
    dct['Taxable Value']=this.intTotalTaxable
    this.dctExportData['intTotalTaxable']=this.intTotalTaxable
    
   } 
    // dct['Tax Value']=this.intTotalTax
    // dct['Taxable Value']=this.intTotalTaxable
    dct['Quantity']=this.intTotalQty
    dct['Amount']=this.intTotalAmt

    lstTempData.push(JSON.parse(JSON.stringify(dct)));
    // console.log(lstTempData,this.dctExportData,"lstTempData,this.dctExportData",);
    this.dctExportData['intTotalQty']=this.intTotalQty
    this.dctExportData['intTotalAmt']=this.intTotalAmt
 
    let filters=[];

    if(this.dctExportData['staff'] && !this.dctExportData['customer']){
      filters=[];
      filters.push(["Staff:",this.dctExportData['staff'],"","",""]);
    }
    else if(!this.dctExportData['staff'] && this.dctExportData['customer']){ 
      filters=[];
      filters.push(["Vendor:",this.dctExportData['customer'],"","",""]);
    }
    else if(this.dctExportData['staff'] && this.dctExportData['customer']){ 
      filters=[];
      filters.push(["Staff:",this.dctExportData['staff'],"","Vendor:",this.dctExportData['customer']]);  
    }

    
    // console.log(this.dctExportData,'data');
    
    //dictionary to pass datas to excel service

    let dctTemp={
      title:'Purchase Report',
      fromDat:this.dctExportData['datFrom'],
      toDat:this.dctExportData['datTo'],
      filters:filters,
      header:header,
      data:lstTemp,
      footer:lstFooter
    }

    this.excelService.generateExcelJs(dctTemp);

    
    // this.excelService.exportPurchaseReportExcel(lstTempData,this.dctExportData);
  }    
}

}

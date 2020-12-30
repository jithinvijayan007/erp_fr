import { Component, OnInit,ViewChild,ElementRef,Inject} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import * as moment from 'moment' ;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css']
})
export class StockReportComponent implements OnInit {

  blnFilterOn = false;
  moreFilters: string[] = [
    'Product',
    'Brand',
    // 'Stock'
  ];
  filteredOptions: Observable<string[]>;
  lstShowFilterOptions=[];
  coloumnFilters =[]
  blnMoreFilterClicked = false;

  blnMore='normal'
  searchMoreFilter: FormControl = new FormControl();
  strMoreFilter = '';
  lstPermission=JSON.parse(localStorage.group_permissions)
  blnAdd = false;
  blnEdit = false;
  blnDelete = false;
  blnView = false;
  blnDownload = false;
  date
  selectedDate;
  intSaleable=3
  
  showModalImei
  strDateShow = 'none';
  strItemCategShow = 'none';
  strBranchShow = 'none';
  strBrandShow = 'none';
  strItemGrpShow = 'none';
  strStaffShow = 'none';
  strProductShow = 'none';
  strItemShow = 'none';
  strItemCodeShow = 'none';
  // strStockShow = 'none';
  strStockValueShow = 'none';
  strImeiShow = 'none';
  strAgeShow = 'none';
  strFirstDateShow = 'none';
  strActionShow = 'none';
  strMrpShow= 'none';
  strMopShow= 'none';
  strDpShow= 'none';
  strCpShow= 'none';

  strDateShowTot = 'none';
  strItemCategShowTot = 'none';
  strBranchShowTot = 'none';
  strBrandShowTot = 'none';
  strItemGrpShowTot = 'none';
  strStaffShowTot = 'none';
  strProductShowTot = 'none';
  strItemShowTot = 'none';
  strItemCodeShowTot = 'none';
  strStockShowTot = 'none';
  strStockValueShowTot= 'none';
  strImeiShowTot = 'none';
  strAgeShowTot = 'none';
  strFirstDateShowTot = 'none';
  strActionShowTot = 'none';

  intStockTot=0;
  intStockValueTot = 0;
  intTransistTot=0
  intTotal=0
  dctPricePermission={}
  strImeiBatch;
  searchVentor: FormControl = new FormControl();
  lstVentor = [];
  intVentorId
  strVentor = ''
  selectedVentor = ''

  @ViewChild('filterInput') filterInput:ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  lstFiltersData: string[] = [
    // 'Branch',
    'Product',
    'Brand',
    'ItemCategory',
    'ItemGroup',
    'ItemCode',
    'Item',
    // 'Stock',
    'Imei',
    'Price',

    // 'Age',
    // 'Branch Age',
    // 'First Date',

 ];
 dctData={}
  lstFilterDataCopy=JSON.parse(JSON.stringify(this.lstFiltersData))
  lstFilterDataCopy1=JSON.parse(JSON.stringify(this.lstFiltersData))

  lstMoreFilter = [];
  lstDisplayedColumns=['branch','product','brand','item_cat','item_grp','item_code','item','imei','mrp','mop','dp','cp','branch_date','first_date','stock','intransist','total','branch_age','age'];
  lstData=[];
  dataSource;
  data=[]
  blnShowData=false;
  
  // showSpinner=false;


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
  blnSaleable=false

  constructor(
    private serverService: ServerService,
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
    // private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,

  ) { }
 
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
  
    return this.lstFiltersData.filter(moreFilters => moreFilters.toLowerCase().indexOf(filterValue) === 0);
  }
    //  chips variable
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  flag = false;
  flag1 = false;
  searchItem: FormControl = new FormControl();
  intItemId;
  strSelectedItem = '';
  strItem='';

  strGroupname
  blnBranch=false
  ngOnInit() {
    this.strGroupname = localStorage.getItem("group_name")
    this.lstShowFilterOptions = this.lstFiltersData;
    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Branch Stock Report") {
        this.blnAdd = item["ADD"];
        this.blnEdit= item["EDIT"];
        this.blnDelete = item["DELETE"];
        this.blnView = item["VIEW"]
        this.blnDownload = item["DOWNLOAD"]
      }
    });
    this.searchItem.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItem = [];
      } else {
        if (strData.length >= 3) {
          this.serverService
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

     this.searchMoreFilter.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData) {
        // console.log("if");
        
          // let data =this._filter(strData)
          // this.flag = false;
          // data.forEach(element => {
          //   if(this.moreFilters.includes(element)){
          //     this.flag = true;
          //     this.lstFilterDataCopy.splice(element, 1);
          //     this.lstShowFilterOptions = this.lstFilterDataCopy;
          //   }
          // });
          // if(!this.flag){
            
            this.lstShowFilterOptions = this._filter(strData)
          // }
      } 
      // else 
      // {
      //   console.log("else");
        
      //   this.flag1=false;
      //   this.lstFiltersData.forEach(element => {
      //     if(this.moreFilters.includes(element))
      //     {
      //       this.flag1=true;
      //       this.lstFilterDataCopy1.splice(element, 1);
      //     }
      //   });
      //   if(this.flag1){
      //     this.lstShowFilterOptions = this.lstFilterDataCopy1;
      //   }
      //   else{
      //     this.lstShowFilterOptions = this.lstFiltersData;
      //   }
      // }
    }
    );
    this.dataSource = new MatTableDataSource(
      this.lstData
    );
    this.date = new Date()
    this.searchVentor.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstVentor = [];
      } else {
        if (strData.length >= 1) {
          this.serverService
            .postData('supplier/supplier_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstVentor = response['data'];
              }
            );
  
        }
      }
    }
    );
    this.getData(true)
  }
  getData(check){
    // console.log(this.lstProduct,"lstProduct");
    this.dctData = {}
    let error=false
    let removeIndex=[]
    let allData=[]
    // this.dctExportData={datFrom:'',datTo:'',staff:'',customer:''}
     
   
      //  if(this.blnMoreFilterClicked){
        this.dctData['lst_more_filter'] = this.moreFilters;
      //  }
        
      this.dctData['blnExport']=false
      

      if(!error){
      this.selectedDate = moment(this.date).format('YYYY-MM-DD')
        
      this.dctData['date'] = this.selectedDate;
      this.dctData['blnCheck'] = check

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
  
      if(this.strSelectedItem){
        this.dctData['lstItem'] = [this.intItemId];
      }

      if(this.lstBranch.length>0){
        let lstData=[]
        this.lstBranch.forEach(element => {
          lstData.push(element.id)
        });
        this.dctData['lstBranch'] = lstData;
      }
      if(this.blnMoreFilterClicked){
        if(this.moreFilters.length>4){
          this.blnMore='horiscroll'
        }
        else{
          this.blnMore='normal'
          
        }
      }

      this.dctData['int_saleable']=this.intSaleable
      

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
       if((this.selectedVentor || this.strVentor!= this.selectedVentor)){
        this.toastr.error('Valid ventor is required ','Error!'); 
        error=true
        this.intVentorId = null
        this.strVentor = ''
        this.selectedVentor=''
        return;
      }
      if(this.strImeiBatch){
        this.dctData['strImeiBatch'] = this.strImeiBatch;
      }
      if(this.intVentorId){
        this.dctData['intVentorId'] = this.intVentorId;
      }
       if(((this.intSaleable==1) || (this.intSaleable==2)) && (!this.moreFilters.includes('Imei'))){
          {
          this.toastr.error('Imei must be selected in more filter', 'Error!');
          return false;
          }
       }

      // this.dctData['intPhone'] = this.intPhone
      this.spinnerService.show();
      
  
      this.serverService.postData('reports/daily_branch_stock_report/',this.dctData).subscribe(
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
              if(response.hasOwnProperty('dct_price_perm_data')){

                this.dctPricePermission=response['dct_price_perm_data']
              }
              this.data=[]
              this.dataSource=[]
           
              // console.log(this.data,this.data.length,"list");
              // removeIndex.forEach(element => {
              //    this.data.splice(element,1)
                
              // });
            

            if(check){    
              this.productOptions=response['dct_data']['product']
              // this.productOptions.splice(0,0,'All')
              this.brandOptions=response['dct_data']['brand']
              // this.itemOptions=response['dct_data']['item']
              this.itemCategoryOptions=response['dct_data']['item_category']
              this.itemGroupOptions=response['dct_data']['item_group']
              this.branchOptions=response['dct_data']['branch']
            }
            else{
              // this.data=response['stock_data'];
              allData=response['stock_data'];
              // if(response.hasOwnProperty('bln_stock_value')){

              
              //   if(response['bln_stock_value'])
              //   {
              //    this.strStockValueShow = '';
              //   }
              //   else{
              //     this.strStockValueShow = 'none';
              //   }
              // }


              let index=0
              // console.log(allData,allData.length,"all data");
              
              allData.forEach(element => {
                if((element.int_transit==0 && element.int_qty==0) || (element.int_qty<0) ){
                  //  console.log(element,index,"element 2");
                  //  removeIndex.push(index)
                  //  this.data.splice(index,1)
                }
                else{
                  this.data.push(element)
                }
                index++

               
                

                if(element.jsn_batch_no == '[null]' || element.jsn_batch_no == '["null"]' || element.jsn_batch_no == '[""]'){
                  element.jsn_batch_no = '';
                }
              });
   
            }
            


              if(this.data.length>0){
                this.blnShowData=true;
                this.dataSource = new MatTableDataSource(this.data);
                this.calculateTotalAmt();
                
              }
              else{
                this.blnShowData=false;
              }
              this.showFilterColumn()

              // this.dataSource.paginator = this.paginator;
              // this.dataSource.paginator.firstPage();
              // this.dataSource.sort = this.sort;
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
  calculateTotalAmt(){
    this.intStockTot=0
    this.intTransistTot=0
    this.intTotal=0

    this.data.forEach(element => {
    this.intStockTot=Number( element.int_qty )+ Number(this.intStockTot)
    // this.intStockValueTot=Number( element.int_value )+ Number(this.intStockValueTot);
    this.intTransistTot= Number(element.int_transit)+  Number(this.intTransistTot)
    this.intTotal= Number(element.int_qty_transit_sum)+  Number(this.intTotal)

  
    });
    // return 10
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
  filterClick(){
    this.blnFilterOn = true;
  }

  filterClickOff(){
    this.blnFilterOn = false;
    // this.moreFilters = [
    //   'Product',
    //   'Brand',
    //   'Stock'
    // ];
  }

  remove(moreFilters: string): void {
    const index = this.moreFilters.indexOf(moreFilters);
    // if(moreFilters == 'Product'){
    //   this.toastr.error('Product is mandatory', 'Error!');
    //   return;
    // }
    // else if(moreFilters == 'Brand'){
    //   this.toastr.error('Brand is mandatory', 'Error!');
    //   return;
    // }
    // else if(moreFilters == 'Stock'){
    //   this.toastr.error('Stock is mandatory', 'Error!');
    //   return;
    // }
    // else{
      if (index >= 0) {
        this.moreFilters.splice(index, 1);
      }
    // }
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
//  console.log(this.lstFiltersData,"morefilter");
 
} 


  showFilterColumn(){
         this.strProductShow = 'none';
         this.strBrandShow = 'none';
        //  this.strStockShow = 'none';
        this.strStockValueShow = 'none';
         this.strBranchShow = 'none';
         this.strItemGrpShow = 'none';
         this.strItemShow = 'none';
         this.strItemCodeShow = 'none';
         this.strImeiShow = 'none';
         this.strItemCategShow = 'none';
         this.strAgeShow = 'none';
         this.strFirstDateShow = 'none';
         this.strActionShow = 'none';
         this.strMrpShow = 'none';
         this.strMopShow = 'none';
         this.strDpShow= 'none';
         this.strCpShow= 'none';


         this.strProductShowTot = 'none';
         this.strBrandShowTot = 'none';
         this.strStockShowTot = 'none';
         this.strStockValueShowTot = 'none';
         this.strBranchShowTot = 'none';
         this.strItemGrpShowTot = 'none';
         this.strItemShowTot = 'none';
         this.strItemCodeShowTot = 'none';
         this.strImeiShowTot = 'none';
         this.strItemCategShowTot = 'none';
         this.strAgeShowTot = 'none';
         this.strFirstDateShowTot = 'none';
         this.strActionShowTot = 'none';

         this.moreFilters.forEach((element,index) => {
           
            if(element == 'Product'){
              this.strProductShow = '';
            }
            if(element == 'Brand'){
              this.strBrandShow = '';
            }
            if(element == 'Item'){
              this.strItemShow = '';
            }
            if(element == 'ItemCategory'){
              this.strItemCategShow = '';
            }
            if(element == 'Branch'){
              this.strBranchShow = '';
            }
            if(element == 'ItemGroup'){
              this.strItemGrpShow = '';
            }

            // if(element == 'Stock'){
            //   this.strStockShow = '';
            // }
          
            if(element == 'Imei'){
              this.strImeiShow = '';
              this.strActionShow= '';
            }
            if(element == 'Age'){
              this.strAgeShow = '';
            }
            if(element == 'First Date'){
              this.strFirstDateShow = '';
            }
            if(element == 'ItemCode'){
              this.strItemCodeShow = '';
            }
            if(element == 'Price' && this.dctPricePermission['bln_mrp']){ 
              this.strMrpShow = '';
              this.strItemShow = '';
             }
             if(element == 'Price' && this.dctPricePermission['bln_mop']){ 
              this.strMopShow = '';
              this.strItemShow = '';

             }
             if(element == 'Price' && this.dctPricePermission['bln_dp']){ 
              this.strDpShow = '';
              this.strItemShow = '';

             }
             if(element == 'Price' && this.dctPricePermission['bln_cost_price']){ 
              this.strCpShow = '';
              this.strItemShow = '';
             }
          });
console.log(  this.strMrpShow,"strMrpShow",this.strMopShow,"strMopShow",this.strDpShow,"strDpShow",this.strCpShow,"strCpShow" ,this.dctPricePermission['bln_mrp'],'mrp',this.dctPricePermission['bln_mop'],'mop',this.dctPricePermission['bln_dp'],'dp',this.dctPricePermission['bln_cost_price'],'cp',"hfghfgh");

          

          if(this.moreFilters.includes('Branch')){
            this.strBranchShowTot = '';
          }
          else if(this.moreFilters.includes('Product') && !this.moreFilters.includes('Branch')){
            this.strProductShowTot = '';
          }
          else if(this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Branch')){
            this.strBrandShowTot = '';
          }
          else if(this.moreFilters.includes('ItemCategory') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Branch')){
            this.strItemCategShowTot = '';
          }
          else if(this.moreFilters.includes('ItemGroup') && !this.moreFilters.includes('ItemCategory') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Branch')){
            this.strItemGrpShowTot = '';
          }
          else if(this.moreFilters.includes('ItemCode') && !this.moreFilters.includes('ItemGroup') && !this.moreFilters.includes('ItemCategory') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Branch')){
            this.strItemCodeShowTot = '';
          }
          else if(this.moreFilters.includes('Item') && !this.moreFilters.includes('ItemCode') && !this.moreFilters.includes('ItemGroup') && !this.moreFilters.includes('ItemCategory') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Branch')){
            this.strItemShowTot = '';
          }
          else if(this.moreFilters.includes('Imei') && !this.moreFilters.includes('Item') && !this.moreFilters.includes('ItemCode') && !this.moreFilters.includes('ItemGroup') && !this.moreFilters.includes('ItemCategory') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Branch')){
            this.strImeiShowTot = '';
          }
          // else if(this.moreFilters.includes('Stock') && !this.moreFilters.includes('Imei') && this.moreFilters.includes('Item') && !this.moreFilters.includes('ItemCode') && !this.moreFilters.includes('ItemGroup') && !this.moreFilters.includes('ItemCategory') && !this.moreFilters.includes('Brand') && !this.moreFilters.includes('Product') && !this.moreFilters.includes('Branch')){
          //   this.strStockShowTot = '';
          // }


     }

  moreFilterClicked(){
    if(this.moreFilters.length<=0){
      this.toastr.error('Select atleast one filter',);
  
    }
    else{
      if(this.moreFilters.includes('Imei')){
        this.blnSaleable=true
      }
      else{
        this.blnSaleable=false
      }
    this.blnMoreFilterClicked = true;
    this.getData(false)
    }
  
  }

  normalSearch(){
    this.blnMoreFilterClicked = false;
    this.getData(false)
  }
  exportData(){
    if(this.data.length>0){
      this.dctData['blnExport']=true;
      this.dctData['tabledata']=this.data
      this.serverService.postData('reports/daily_branch_stock_report/',this.dctData).subscribe(
        (response) => {
            if (response.status == 1)
            { 
  
              var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = response['export_data'];
              a.download = 'report.xlsx';
              a.click();
              // window.URL.revokeObjectURL(this.dctReportData);
              a.remove();
                  
              // this.snotifyService.success('Successfully Exported');  
              this.toastr.success('Successfully Exported', 'Success!');
               
              // this.blnExported = true;
              // this.downloadLog(dctJsonData)
            }  
            
            else if (response.status == 0) 
            {
            //  this.blnShowData=false;
             swal.fire('Error!',response['reason'], 'error');
            }
        },
        (error) => {   
         swal.fire('Error!','Something went wrong!!', 'error');
        });
    }
    else{
      this.toastr.error('No Data Found', 'Error!');
      
    }
  }
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    // this.dataSource.paginator.firstPage();
  }
}
VentorChanged(item){   
  this.intVentorId = item.id;
  this.strVentor = item.name;
}
}

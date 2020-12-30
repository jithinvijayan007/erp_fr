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
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.css']
})
export class StockHistoryComponent implements OnInit {
  dctData={}

  lstMoreFilter = [];
  lstDisplayedColumns=['date','docno','conbranch','type','qty'];
  lstData=[];
  dataSource;
  data=[]
  blnShowData=false;

  searchBranch: FormControl = new FormControl();
  lstBranch = []
  IntBranchId;
  strBranch;
  selectedBranch;
  intStockIn=0
  intStockOut=0

  searchItem: FormControl = new FormControl();
  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();

  strProduct='';
  selectedProduct = '';
  intProductId;
  blnProduct=false;
  lst_product = [];

  blnBrand=false;
  lst_brand = [];
  strBrand='';
  intBrandId;
  selectedBrand='';

  lstItem = []
  intItemId;
  strItem='';
  selectedItem:'';
  currentItem:''
  
  strBranchShow='none'
  // showSpinner=false;
  datFrom
  datTo
  selectedTo
  selectedFrom

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  // itemOptions=[]
  // itemConfig = {displayKey:"name", height: '200px',search:true ,placeholder:'Item',customComparator: ()=>{} ,searchOnKey: 'name',clearOnSelection: true}
  
  lstItemCategory=[]
  itemCategoryOptions=[]
  itemCategoryConfig = {displayKey:"name", height: '200px',search:true ,customComparator: ()=>{} ,placeholder:'Item Category',searchOnKey: 'name',clearOnSelection: true}
    
  lstItemGroup=[]
  itemGroupOptions=[]
  itemGroupConfig = {displayKey:"name", height: '200px',customComparator: ()=>{} ,search:true ,placeholder:'Item Group',searchOnKey: 'name',clearOnSelection: true  }

  // lstBranch=[]
  branchOptions=[]
  branchConfig = {displayKey:"name",search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'name',clearOnSelection: true  }

  blnSaleable=false
  blnBranch=false
  intTotQty=0
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
 
  ngOnInit() {
    this.datFrom = new Date();
    this.datTo = new Date();

 
    this.searchItem.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
       if (strData === undefined || strData === null) {
        this.lstItem = [];
      }
      // else if(this.strProduct == ''){
      //   this.toastr.error('Select Product', 'Error!');
      //   return;
      // }
      // else if(this.strProduct != this.selectedProduct){
      //   this.toastr.error('Invalid Product', 'Error!');
      //   return;
      // }
      // else if(this.strBrand == ''){
      //   this.toastr.error('Select Brand', 'Error!');
      //   return;
      // }
      // else if(this.strBrand != this.selectedBrand){
      //   this.toastr.error('Invalid Brand', 'Error!');
      //   return;
      // }
      else if (strData === undefined || strData === null) {
        this.lstItem = [];
      } else {
        if (strData.length >= 1) {
          let dctData={}
          if(this.intProductId){
            dctData['intProductId']=this.intProductId
            // dctData['term']=strData
            
          }
          if(this.intBrandId){
            dctData['intBrandId']=this.intBrandId
            
          }
          dctData['term']=strData
          
          this.serverService
            .postData('itemcategory/item_typeahead_stock/',dctData)
            .subscribe(
              (response) => {
                this.lstItem =JSON.parse(JSON.stringify(response['data']))
            }
          );
        }
      }
    }
  ); 
  this.searchBranch.valueChanges
  .debounceTime(400)
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lstBranch = [];
    } else {
      if (strData.length >= 1) {
        this.serverService
          .postData('branch/branch_typeahead/', { term: strData })
          .subscribe(
            (response) => {
              this.lstBranch = response['data'];
             
              

            }
          );
      }
    }
  }
  ); 
    
this.searchProduct.valueChanges
.debounceTime(400)
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lst_product = [];
  } else {
    if (strData.length >= 1) {
      this.serverService
        .postData('products/product_typeahead/', { term: strData })
        .subscribe(
          (response) => {
            this.lst_product = response['data'];

          }
        );
    }
  }
}
); 

this.searchBrand.valueChanges
.debounceTime(400)
.subscribe((strData: string) => {
if (strData === undefined || strData === null) {
  this.lst_brand = [];
} else {
  if (strData.length >= 1) {
    this.serverService
      .postData('brands/brands_typeahead/', { term: strData })
      .subscribe(
        (response) => {
          this.lst_brand = response['data'];

        }
      );
  }
}
}
);

    this.dataSource = new MatTableDataSource(this.data);
    // this.date = new Date()
    this.getData()
  }
  getData(){
    this.spinnerService.show();
      
    this.serverService
    .getData('reports/stock_history/' )
    .subscribe(
      (response) => {
        this.productOptions=response['data']['product']
        // this.productOptions.splice(0,0,'All')
        this.brandOptions=response['data']['brand']
        // this.itemOptions=response['data']['item']
        this.itemCategoryOptions=response['data']['item_category']
        this.itemGroupOptions=response['data']['item_group']
        this.branchOptions=response['data']['branch']
        if(response.hasOwnProperty('bln_branch'))
        {
          this.blnBranch=response['bln_branch']
        }
      
      }
    );
  }

  itemChanged(item){
    this.intItemId = item.id;
    this.strItem = item.code_name;
    this.currentItem= item.code_name;
    this.selectedItem = item.code_name;

  }
  itemNgModelChanged(event){
    if(this.currentItem!=this.selectedItem){
      this.intItemId = null;
      this.strItem = '';
    }
  }

 

  productChanged(item){
    this.intProductId = item.id;
    this.strProduct = item.name;
     
  }

  brandChanged(item){
    this.intBrandId = item.id;
    this.strBrand = item.name;

  }

  BranchChanged(item) {
    this.IntBranchId = item.id;
    this.strBranch = item.name;
  }

  searchData(){
    
    this.dctData = {}
    let error=false
    let removeIndex=[]
    let allData=[]
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    this.intStockIn=0
    this.intStockOut=0

    if (this.selectedBranch != this.strBranch) {
      this.IntBranchId = null
      this.strBranch = ''
      if (this.selectedBranch) {
        this.toastr.error('Invalid Branch', 'Error!');
        return false;
      }
    }
    if(this.blnBranch){

      if (!this.strBranch|| this.selectedBranch != this.strBranch) {
        this.intBrandId = null
        this.strBranch = ''
        this.selectedBranch = ''
        this.toastr.error('Valid Branch Name is required', 'Error!');
        return false;
      }
      }
    if (!this.strItem|| this.selectedItem != this.strItem) {
      this.intItemId = null
      this.strItem = ''
      this.selectedItem = ''
      this.toastr.error('Valid Item Name is required', 'Error!');
      return false;
    }
   

   if(this.selectedProduct != ''){
      if(this.strProduct == ''){
        this.toastr.error('Invalid Product', 'Error!');
        return;
      }
      else if(this.strProduct != this.selectedProduct){
        this.toastr.error('Invalid Product', 'Error!');
        return;
      }
    }
    if(this.selectedBrand != ''){
      if(this.strBrand == ''){
        this.toastr.error('Invalid Brand', 'Error!');
        return;
      }
      else if(this.strBrand != this.selectedBrand){
        this.toastr.error('Invalid Brand', 'Error!');
        return;
      }
    }

    if (this.selectedFrom > this.selectedTo || (!this.selectedFrom) || (!this.selectedTo) ) 
     {
      this.toastr.error("Please select correct date period", 'Error!');
      return false;
    }

    if(!error){
      this.dctData['fromDate'] =this.selectedFrom
      this.dctData['toDate'] = this.selectedTo
      
      
      if(this.selectedItem){
        this.dctData['intItemId'] = this.intItemId;
      }
      if(this.IntBranchId){
        this.dctData['lstBranch'] = [this.IntBranchId];
      }
      this.spinnerService.show();
      
    this.serverService
    .postData('reports/stock_history/', this.dctData )
    .subscribe(
      (response) => {
        this.data = response['data'];
        this.intTotQty=0
        if(this.data.length>0){
          
          this.blnShowData=true;
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          // this.dataSource.paginator.firstPage();
          this.dataSource.sort = this.sort;
          this.data.forEach((element,index)=> {

            if(element.int_qty>0 && index!=0){
              this.intStockIn=this.intStockIn+element.int_qty
            }
            else if(element.int_qty<0 && index!=0){
              this.intStockOut=this.intStockOut+(element.int_qty * -1)
            }

            if(index!=0){
              this.intTotQty=element.int_qty+ this.intTotQty
            }

          });
        }
        else{
          this.blnShowData=false;
        }
      }
    );
  }
  }
}

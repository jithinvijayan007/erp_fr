
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stock-age-report',
  templateUrl: './stock-age-report.component.html',
  styleUrls: ['./stock-age-report.component.css']
})
export class StockAgeReportComponent implements OnInit {

  selectedBranch = '';
  lstBranch = [];
  intBranchId;
  strBranch = '';


  strProduct='';
  intProductId;
  lst_product = [];
  strSelectedProduct = '';


  lst_brand = [];
  strBrand='';
  intBrandId;
  strSelectedBrand='';

  lstItem = []
  intItemId;
  strItem;
  strSelectedItem;
  currentItem='';


  searchBranch: FormControl = new FormControl();
  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  searchItem: FormControl = new FormControl();
   
  blnShowData = false;

  displayedColumns = ['branch','product','brand', 'item','imei','batch','branchage','totalage'];
  dataSource;

  constructor(
    private serviceObject: ServerService,
    public router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.searchBranch.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstBranch = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('branch/branch_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstBranch = response['data'];
              }
            );

        }
      }
    }
    );

    
      
  this.searchProduct.valueChanges.pipe(
  debounceTime(400))
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lst_product = [];
    } else {
      if (strData.length >= 3) {
        this.serviceObject
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


 this.searchBrand.valueChanges.pipe(
debounceTime(400))
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lst_brand = [];
  } else {
    if (strData.length >= 3) {
      this.serviceObject
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
 

this.searchItem.valueChanges.pipe(
debounceTime(400))
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lstItem = [];
  } else {
    if (strData.length >= 1) {
        const pushedItems = {};
        pushedItems['term'] = strData
        this.serviceObject
        .postData('itemcategory/item_typeahead/',pushedItems)
        .subscribe(
          (response) => {
            this.lstItem = response['data'];
          }
        );
      }
    }
  }
);



  }

  BranchChanged(item){
    this.intBranchId = item.id;
    this.strBranch = item.name;
    this.selectedBranch== item.name;
  }
  productChanged(item){
    this.intProductId = item.id;
    this.strProduct = item.name;

  }

  brandChanged(item){
    this.intBrandId = item.id;
    this.strBrand = item.name;

  }
  itemChanged(item)
  {
     this.currentItem= item.code_name;
     this.intItemId = item.id;
     this.strItem = item.code_name;
     this.strSelectedItem = item.code_name;
  
 }

  SearchStock(){
    if(this.selectedBranch == ''){
      this.toastr.error('Select a valid Branch');
      return false;
      
    }
    else if(this.selectedBranch != this.strBranch){
      this.toastr.error('Select a valid Branch');
      return false;
    }
    if(this.strSelectedProduct){
      if(this.strSelectedProduct != this.strProduct){
        this.toastr.error('Select a valid Product');
         return false;
      }
    }
    if(this.strSelectedBrand){
      if(this.strSelectedBrand !=  this.strBrand){
         this.toastr.error('Select a valid Brand');
         return false;
      }
    }
    if(this.strSelectedItem){
      if(this.strSelectedItem != this.strItem){
        this.toastr.error('Select a valid Item');
        return false;

      }
    }
    
    const dctData = {}
    dctData['branchId'] = this.intBranchId;
    if(this.strSelectedProduct){
      dctData['productId'] = this.intProductId;
    }
    if(this.strSelectedBrand){
      dctData['brandId'] = this.intBrandId;
    }
    if(this.strSelectedItem){
      dctData['itemId'] = this.intItemId;
    }

    
    this.serviceObject.postData('internalstock/stock_age/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {
         this.blnShowData = true;
         this.dataSource=response['lst_data'];
        }
        else if (response.status == 0) {
          Swal.fire('Error!', response['reason'], 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
     


  }

}

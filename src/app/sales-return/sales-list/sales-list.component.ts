
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import * as moment from 'moment' ;

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {

  constructor(
    private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.source = new LocalDataSource(this.data); // create the source
   }

  ngOnInit() {
    let ToDate = new Date()
    let FromDate = new Date(ToDate.getFullYear(), ToDate.getMonth(), 1);
    this.datTo = ToDate
    this.datFrom = FromDate
    this.getData()


    this.searchProduct.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstProduct = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('products/product_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstProduct = response['data'];
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
        this.lstBrand = [];
      } else {
        if (strData.length >= 1) {
          if (!this.strProduct) {
          this.toastr.error('Product Name is required', 'Error!');
          }
          else{

            const pushedItems = {};
            if (this.strItem) {
            pushedItems['item_id'] = this.intItemId

            }
          //   if (this.strItemCategory) {
          //     pushedItems['itemCategory_id'] = this.intItemCategoryId

          //  }
          //  if (this.strItemGroup) {
          //   pushedItems['itemGroup_id'] = this.intItemGroupId

          //   }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
            this.serviceObject
            .postData('brands/brands_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstBrand = response['data'];
              }
            );
          }
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
          if (!this.strProduct) {
          this.toastr.error('Product Name is required', 'Error!');
          }

          else{
            const pushedItems = {};
            // if (this.strBrand) {
            //   pushedItems['brand_id'] = this.intBrandId

            //   }
            //   if (this.strItemCategory) {
            //     pushedItems['itemCategory_id'] = this.intItemCategoryId

            //  }
            //  if (this.strItemGroup) {
            //   pushedItems['itemGroup_id'] = this.intItemGroupId

            //   }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
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
      }
    );

    this.searchStaff.valueChanges.pipe(
      debounceTime(400))
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
  }
  source: LocalDataSource;
  data=[];
  lstKeys=[];
  blnShowData=true;
  datTo;
  intPhone=null;
  datFrom;
  selectedFrom;
  selectedTo;
  blnAdvanceFilter= false;

  searchProduct: FormControl = new FormControl();
  searchBranch: FormControl = new FormControl();
  lstProduct = []
  intProductId;
  strProduct;
  selectedProduct;

  searchBrand: FormControl = new FormControl();
  lstBrand = []
  intBrandId;
  strBrand;
  selectedBrand;

  searchItem: FormControl = new FormControl();
  lstItem = []
  intItemId;
  strItem;
  selectedItem;

  searchStaff: FormControl = new FormControl();
  lstStaff=[];
  intStaffId=null;
  strStaff='';
  selectedStaff='';

  dctData={}
  lstFilterData=[]
  index = 0
  dct_item = {}


  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},],
      position: 'right'
    },
   
    columns: {
      fk_master__dat_invoice: {
        title: 'Date',
      },
      fk_master__vchr_invoice_num: {
        title: 'Invoice No',
      },
      fk_master__fk_branch__vchr_name: {
        title: 'Branch',
      },
      fk_master__fk_customer__vchr_name: {
        title: 'Customer',
      },
      fk_master__fk_staff__first_name: {
        title: 'Staff',
      },
      fk_item__fk_product__vchr_name: {
        title: 'Product',
      },
     
    },
  };

  getData()
  {
    let dctData = {}
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    let errorPlace = false;
   
    if (this.datFrom > this.datTo) {

      swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return false;
    }
    if(this.intPhone){
      if(this.intPhone.toString().length < 10 || (this.intPhone.toString().length > 12)){
        // validationSuccess = false ;
        this.toastr.error(' Mobile No  length between 10 and 12 digit ','Error!');
        // this.contactId.nativeElement.focus();
        return false;
      }
    }
    if(this.strProduct){
      if (this.selectedProduct  != this.strProduct|| !this.selectedProduct)
      {
       this.toastr.error('Product is required', 'Error!');
       this.intProductId=null
       this.strProduct=''
       this.selectedProduct=''
       errorPlace = true;
       
       return false;
      }
     }
      if(this.strBrand){
       if (this.selectedBrand != this.strBrand|| !this.selectedBrand)
         {
         this.intBrandId = null
         this.strBrand = ''
         this.selectedBrand=''
         this.toastr.error('Valid Brand Name is required', 'Error!');
         errorPlace = true;
         return false;
         }
     }
     if(this.strItem){
       if (this.selectedItem != this.strItem|| !this.selectedItem)
         {
         this.toastr.error('Valid Item Name is required', 'Error!');
         this.intItemId = null
         this.strItem = ''
         this.selectedItem=''
         errorPlace = true;
         return false;
         }
      }
      if(this.strStaff){
       if (this.selectedStaff  != this.strStaff|| !this.selectedStaff)
       {
        this.toastr.error('Staff is required', 'Error!');
        this.intStaffId=null
        this.strStaff=''
        this.selectedStaff=''
        errorPlace = true;
        return false;
       }
     }
   
     
     
     if(this.strProduct){
     dctData['intProductId']=this.intProductId
     }
      
     if(this.strItem)
     {
       dctData['intItemId']=this.intItemId
     }
     if(this.strBrand)
     {
       dctData['intBrandId']=this.intBrandId;
     }
     if(this.strStaff)
     {
       dctData['intStaffId']=this.intStaffId;
     }

      if(!errorPlace){
     
     
        
       

    dctData['datFrom'] = this.selectedFrom
    dctData['datTo'] = this.selectedTo
    dctData['IntPhone'] = this.intPhone

    this.serviceObject.postData('salesreturn/sales_return_list/',dctData).subscribe(
      (response) => {
          if (response.status == 1)
          {
          
            this.data = response['lst_data']
            if(this.data.length>0){
              
              this.blnShowData=true;
             this.source = new LocalDataSource(this.data); 
             }
             else{
              this.blnShowData=false;
             }
          }  
          else if (response.status == 0) 
          {
           swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
    }
 
  }
  onCustomAction(event)
  {
    
    localStorage.setItem('invoiceNo',event.data.fk_master__vchr_invoice_num);
    localStorage.setItem('invoiceId',event.data.fk_master__pk_bint_id);
  localStorage.setItem('previousUrl','salesreturn/viewsales');
    
    this.router.navigate(['salesreturn/viewsales']);
  }
  changeAdvanceFilter(){
    this.blnAdvanceFilter = !this.blnAdvanceFilter;
   
     
  }
  productChanged(item)
  {
   this.intProductId = item.id;
   this.strProduct = item.name;
   this.selectedProduct = item.name;

 }
 brandChanged(item)
 {
  this.intBrandId = item.id;
  this.strBrand = item.name;
  this.selectedBrand = item.name;


}
  itemChanged(item)
  {
   this.intItemId = item.id;
   this.strItem = item.code_name;
   this.selectedItem = item.code_name;


 }
 StaffChanged(item){
  this.intStaffId = item.intId;
  this.strStaff = item.strUserName;
  
  
}



 
}

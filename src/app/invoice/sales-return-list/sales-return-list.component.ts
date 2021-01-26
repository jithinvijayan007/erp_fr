
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import swal from 'sweetalert2';
import * as moment from 'moment'
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-sales-return-list',
  templateUrl: './sales-return-list.component.html',
  styleUrls: ['./sales-return-list.component.css']
})
export class SalesReturnListComponent implements OnInit {

  blnFilterOn = false;

  searchProduct: FormControl = new FormControl();
  lstProduct = []
  intProductId;
  strProduct;
  strSelectedProduct='';
  currentProduct='';

  searchBrand: FormControl = new FormControl();
  lstBrand = []
  intBrandId;
  strBrand;
  strSelectedBrand='';
  currentBrand='';
  


  searchItem: FormControl = new FormControl();
  lstItem = []
  intItemId;
  strItem;
  strSelectedItem='';
  currentItem='';


  searchStaff: FormControl = new FormControl();
  lstStaff = []
  intStaffId;
  strStaff;
  strSelectedStaff='';
  currentStaff='';
  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]
  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source
      
  }
  previusUrl
  ngOnInit(){
    this.previusUrl = localStorage.getItem('previousUrl');

    let ToDate = new Date()
    let FromDate = new Date();
    this.datTo = ToDate
    this.datFrom = FromDate
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Sales Return List") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    if(dct_perms.VIEW==true ){
      this.lstCustom= [
        { name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},
        { name: 'downloadrecord', title: '&nbsp;&nbsp;<i class="fas fa-print"></i>'}
    ]
         
    }
    else{
      this.lstCustom= [ 
        { name: 'downloadrecord', title: '&nbsp;&nbsp;<i class="fas fa-print"></i>'}
      ]
    }
    this.settings.actions.custom = this.lstCustom



    this.searchProduct.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstProduct = [];
      } else {
        if (strData.length >= 1) {
          const pushedItems = {};
          if (this.strItem) {
            pushedItems['item_id'] = this.intItemId
            }
            if (this.strBrand) {
              pushedItems['brand_id'] = this.intBrandId
              
            }
            if (this.strStaff) {
              pushedItems['staff_id'] = this.intStaffId
            }
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
   
          // else{

            const pushedItems = {};
            if (this.strItem) {
            pushedItems['item_id'] = this.intItemId
            }
            if (this.strProduct) {
              pushedItems['product_id'] = this.intProductId
              
            }
            if (this.strStaff) {
              pushedItems['staff_id'] = this.intStaffId
            }
            pushedItems['term'] = strData
            this.serviceObject
            .postData('brands/brands_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstBrand = response['data'];
              }
            );
          // }
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
          // if (!this.strProduct) {
          // this.toastr.error('Product Name is required', 'Error!');
          // }

          // else{
            const pushedItems = {};
            if (this.strBrand) {
              pushedItems['brand_id'] = this.intBrandId

              }
              if (this.strProduct) {
                pushedItems['product_id'] = this.intProductId
                
              }
              if (this.strStaff) {
                pushedItems['staff_id'] = this.intStaffId
              }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
            this.serviceObject
            .postData('itemcategory/item_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstItem = response['data'];
              }
            );
          // }
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
          const pushedItems = {};
          if (this.strBrand) {
            pushedItems['brand_id'] = this.intBrandId

            }
            if (this.strProduct) {
              pushedItems['product_id'] = this.intProductId
            }
            if (this.strItem) {
              pushedItems['item_id'] = this.intItemId
            }
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

    // this.getData()
    this.getList(0)
  }
  source: LocalDataSource;
  data;
  blnShowData=true;
  datTo;
  intPhone=null;
  datFrom;
  selectedFrom;
  selectedTo;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: this.lstCustom,
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
  filterClick(){
    this.blnFilterOn = true;
  }
  filterClickOff(){
    this.blnFilterOn = false;   
    if (this.strSelectedProduct || this.strSelectedBrand ||this.strSelectedItem ||this.strSelectedStaff) {

      this.intProductId= null;
      this.strProduct = '';
      this.strSelectedProduct = '';

      this.intBrandId= null;
      this.strBrand = '';
      this.strSelectedBrand = '';

      this.intItemId= null;
      this.strItem = '';
      this.strSelectedItem = '';

      this.intStaffId= null;
      this.strStaff = '';
      this.strSelectedStaff = '';

      this.getData();
    }
    // console.log("filterClickOff aftr",this.blnFilterOn);
    
  }

  productNgModelChanged(event){
    if(this.currentProduct!=this.strSelectedProduct){
      this.intProductId = null;
        this.strProduct = '';
    }
  }

  productChanged(item)
   {
    this.currentProduct= item.name
    this.intProductId = item.id;
    this.strProduct = item.name;
    this.strSelectedProduct = item.name;


  }
   brandNgModelChanged(event){
    if(this.currentBrand!=this.strSelectedBrand){
      this.intBrandId = null;
      this.strBrand = '';
    }
  }
  brandChanged(item)
   {
      this.currentBrand = item.name;
      this.intBrandId = item.id;
      this.strBrand = item.name;
      this.strSelectedBrand = item.name;
      
  }
  itemNgModelChanged(event){
    if(this.currentItem!=this.strSelectedItem){
      this.intItemId = null;
      this.strItem = '';
    }
  }
  itemChanged(item)
   {
      this.currentItem= item.code_name;
      this.intItemId = item.id;
      this.strItem = item.code_name;
      this.strSelectedItem = item.code_name;
   
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

  getData()
  {
    let dctData = {}
    let error=false
  
      if(this.strSelectedProduct){
          if (this.strSelectedProduct != this.strProduct)
            {
              
            this.intProductId = null
            this.strProduct = ''
            this.strSelectedProduct=''
            this.toastr.error('Valid Product Name is required', 'Error!');
            error=true;
            }
      }
      if(this.strSelectedBrand){
        if (this.strSelectedBrand != this.strBrand)
          {
          this.intBrandId = null
          this.strBrand = ''
          this.strSelectedBrand=''
          this.toastr.error('Valid Brand Name is required', 'Error!');
          error=true;
          }
      }
      if(this.strSelectedItem){
        if (this.strSelectedItem != this.strItem)
          {
          this.intItemId = null
          this.strItem = ''
          this.strSelectedItem=''
          this.toastr.error('Valid Item Name is required', 'Error!');
          error=true;
          }
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
    
   
      this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
      this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
      
      if (this.datFrom > this.datTo) {
  
        swal.fire({
          position: "center",
          type: "error",
          text: "Please select correct date period",
          showConfirmButton: true,
        });
        error=true;
      }
      if(this.intPhone){
        if(this.intPhone.toString().length < 10 || (this.intPhone.toString().length > 12)){
          // validationSuccess = false ;
          this.toastr.error(' Mobile No  length between 10 and 12 digit ','Error!');
          // this.contactId.nativeElement.focus();
          error=true;
        }
      }
      // if(this.strProduct)
      // {
      //   dctData['intProductId']=this.intProductId
      // }
      // if(this.strBrand)
      // {
      //   dctData['intBrandId']=this.intBrandId
      // }
      // if(this.strItem)
      // {
      //   dctData['intItemId']=this.intItemId
      // }
      // if(this.strStaff)
      // {
      //   dctData['intStaffId']=this.intStaffId
      // }

      // if(!error){
      // dctData['datFrom'] = this.selectedFrom
      // dctData['datTo'] = this.selectedTo
      // dctData['intPhone'] = this.intPhone

    if(!error){
      this.getList(1)
      }
  }
      

    getList(status){

    let d1 = this.datFrom;
    let d2 = this.datTo;
    let tempData;
    let data
    let product= this.strSelectedProduct
    let brand=this.strSelectedBrand
    let item=this.strSelectedItem
    let staff =this.strSelectedStaff
    let phone=this.intPhone

     if (status === 0)
     {
          const urls = ['invoice/invoicedetails']

        if (!(urls.find( x => x === this.previusUrl))) {
          
            localStorage.removeItem('invoiceCustomerNumberStatus')
            localStorage.removeItem('invoiceRequestData')
        }

        if (localStorage.getItem('invoiceCustomerNumberStatus')) {
            tempData = JSON.parse(localStorage.getItem('invoiceRequestData'))
            
        
            d1 = tempData['start_date']
            d2 = tempData['end_date']
            product = tempData['strProduct']
            brand = tempData['strBrand']
            item = tempData['strItem']
            staff  = tempData['strStaff']
            phone  = tempData['intPhone']
            status = 1
            this.datFrom=d1
            this.datTo=d2

            this.strSelectedBrand=brand
            this.currentBrand =brand
            this.strBrand =brand

            this.strSelectedItem=item
            this.strItem=item
            this.currentItem=item

            this.strSelectedProduct=product
            this.strProduct=product
            this.currentProduct=product

            this.strSelectedStaff=staff
            this.strStaff=staff
            this.currentStaff=staff

            this.intBrandId = tempData['intBrandId']
            this.intProductId = tempData['intProductId']
            this.intItemId = tempData['intItemId']
            this.intStaffId = tempData['intStaffId']

            this.intPhone=phone
            localStorage.removeItem('invoiceCustomerNumberStatus')
            // localStorage.removeItem('enquiryCustomerId')
            // localStorage.removeItem('enquiryCustomerNumber')
          }
     }
     else if (status === 1) {

      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();

     
      
      data = {
              start_date: d1,
              end_date: d2,
              intPhone:phone,
              strProduct:product,
              strBrand:brand,
              strItem:item,
              strStaff:staff,
              intProductId:this.intProductId,
              intBrandId:this.intBrandId,
              intItemId:this.intItemId,
              intStaffId:this.intStaffId
             }

      localStorage.setItem('invoiceRequestData', JSON.stringify(data))

    }

    
    d1 =  moment(d1).format('YYYY-MM-DD');
    d2 =  moment(d2).format('YYYY-MM-DD');
    let dctData={};
    if(this.strProduct)
    {
      dctData['intProductId']=this.intProductId
      
    }
    if(this.strBrand)
    {
      dctData['intBrandId']=this.intBrandId
      
    }
    if(this.strItem)
    {
      dctData['intItemId']=this.intItemId
      
    }
    if(this.strStaff)
    {
      dctData['intStaffId']=this.intStaffId
      
    }
    
    dctData['intPhone'] = this.intPhone
    dctData['datFrom'] =d1
    dctData['datTo']=d2
    this.datFrom=d1
    this.datTo=d2
    dctData['blnReturn']=true

    console.log("WWWWWWWWWWWWWWWWWWWW");
    this.spinnerService.show();

      this.serviceObject.postData('invoice/invoice_list/',dctData).subscribe(
        (response) => {
          this.spinnerService.hide();

            if (response.status == 1)
            {
              this.data=response['lst_invoice'];
  
              if(this.data.length>0){
                this.data.forEach(element => {
                 
                  element.fk_master__dat_invoice= moment(element.fk_master__dat_invoice).format('DD-MM-YYYY')
                  element.fk_master__fk_branch__vchr_name=element.fk_master__fk_branch__vchr_name.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))
                  element.fk_master__fk_staff__first_name= element.fk_master__fk_staff__first_name+' '+element.fk_master__fk_staff__last_name
                  element.fk_master__fk_staff__first_name=element.fk_master__fk_staff__first_name.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))
                  element.fk_item__fk_product__vchr_name=element.fk_item__fk_product__vchr_name.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))
                  element.fk_master__fk_customer__vchr_name=element.fk_master__fk_customer__vchr_name.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))
  
                });
  
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
          this.spinnerService.hide();

         swal.fire('Error!','Something went wrong!!', 'error');
        });
    }

  onCustomAction(event)
  {
    // console.log(event,"eve");
    switch ( event.action) {
      case 'viewrecord':
        this.viewRecord(event);
        break;
     case 'downloadrecord':
        this.downloadRecord(event);
    }
    
  }
  viewRecord(event){
    localStorage.setItem('intId',event.data.intId);
    localStorage.setItem('blnJioInvoice',event.data.blnJioInvoice);
    localStorage.setItem('blnReturn','1');
    localStorage.setItem('previousUrl','invoice/invoicedetails');
    this.router.navigate(['invoice/invoicedetails']);
  }
  downloadRecord(event){
    this.serviceObject
    .postData('invoice/invoice_print/',{invoiceId:event.data.intId,blnDuplicate:true})
    .subscribe(
      (response) => {
        if (response.status === 1) {
          let fileURL = response['file_url'];
            window.open(fileURL, '_blank');
          } else {

            swal.fire({
              title: 'Download Failure',
              type: 'error',
              text: response['reason'],
              showConfirmButton: false,
              timer: 2000
            });

          }
        }
      );
  }

}

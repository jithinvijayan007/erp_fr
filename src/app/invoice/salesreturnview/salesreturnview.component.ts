import {NgbModal,ModalDismissReasons,NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';
import * as tableData from './salesreturn-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit,ElementRef ,ViewChildren, HostListener, Input, TemplateRef} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router ,ActivatedRoute} from '@angular/router';
import { FullComponent } from 'src/app/layouts/full/full.component';

import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ChangeDetectionStrategy } from '@angular/core';
import { element } from 'protractor';
import Swal from 'sweetalert2';
import { json } from 'd3';
import { exists } from 'fs';

@Component({
  selector: 'app-salesreturnview',
  templateUrl: './salesreturnview.component.html',
  styleUrls: ['./salesreturnview.component.css']
})
export class SalesreturnviewComponent implements OnInit {




  @Input() OnlyNumber: boolean;
  @Input() date1:Date;
  // Menu items itemlist = [{name:'Delivery',status:false },{name:'Coupon code',status:false },{name:'Loyalty',status:false }]
  closeResult: string;

  constructor(private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,private route: ActivatedRoute,
    public router: Router,
    private fullObject: FullComponent,
    private spinner: NgxSpinnerService,
  ){}

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  saveDisable=false;

  @ViewChild('itemId') itemId : ElementRef;
  @ViewChildren('bbId') bbId: any;
  @ViewChildren('discId') discId: any;

  @ViewChildren('nameId') nameId: any;
  @ViewChildren('contactId') contactId: any;
  @ViewChildren('cityId') cityId: any;
  @ViewChildren('stateId') stateId: any;
  @ViewChildren('pincodeId') pincodeId: any;
  @ViewChildren('gstnoId') gstnoId: any;
  @ViewChildren('addressId') addressId: any;
  @ViewChildren('placeId') placeId: any;

  @ViewChildren('rateId') rateId: any;
  @ViewChild('customeredit', { static: true }) templateRef: TemplateRef<any>;


  // settings = tableData.settings;

  searchItemName: FormControl = new FormControl();
  searchEmi: FormControl = new FormControl();


  time = new Date();

  lstItemName = [];
  lstItems =[];
  lstCustomerNumber = [];
  intContactNo = localStorage.getItem('intContactNo');
  selecetedCustNumber='';
  strName = '';
  strEmail = '';
  intSalesCustId :Number;
  intCustId:Number;
  blnCustAdd = true;
  lstProductList = [];
  lstBrandList = [];
  lstItemsList = [];
  blnDisabled = false;
  blnIgst =true;
  strCustomerName='';
  
  

  
  strRemarks='';
  intBuyBack=0
  strGSTNo
  strAddress=''

  showModalSerDelivery;
  showModalPoints;
  showModalCoupon;
  showModalFilter;
  showModalPayment;
  showModalCustEdit;
  // =====================
  showModalConfirmation
  showModalOtp
  // =====================
  showModalDiscount;
  showModalOffer;
  showModalReturnDetails;
  showModalExchange;

  searchCity: FormControl = new FormControl();
  lstCity = []
  intCityId;
  strCity;
  selectedCity
  strPincode;

  // customer variables

  searchCustomer: FormControl = new FormControl();
  lstCustomer = []
  intCustomerId;
  strCustomer;
  strSelectedCustomer;
  currentCustomer='';

  invoiceId;

  // searchCustCity: FormControl = new FormControl();
  // lstCustCity = []
  intCustCityId;
  strCustCity;
  selectedCustCity
  strCustPinCode;

  searchState: FormControl = new FormControl();
  lstState = []
  intStateId;
  intStateIdPrevious
  strState:'';
  selectedState;
  strStateCode = '';

  // searchCustState: FormControl = new FormControl();
  // lstCustState = []
  intCustStateId;
  strCustState;
  selectedCustState;

  searchProduct: FormControl = new FormControl();
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


  searchItemCategory: FormControl = new FormControl();
  lstItemCategory = []
  intItemCategoryId;
  strItemCategory;
  selectedItemCategory;

  searchItemGroup: FormControl = new FormControl();
  lstItemGroup = []
  intItemGroupId;
  strItemGroup;
  selectedItemGroup;
  page
  searchCustomerNo: FormControl = new FormControl();
  strInvoiceNum = "";



  public imagePath1;
  imgURL1: any;
  public imagePath2;
  imgURL2: any;
  public imagePath3;
  imgURL3: any;

  @ViewChild('file1') file1: any;
  form: FormGroup;


  ngOnInit() {

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.page = params['page'];
        this.intContactNo = params['ph'];
      });
   
    
    if(localStorage.getItem('intContactNo')!=null){
      this.blnCustAdd = false;
      this.strName = localStorage.getItem('strCustName');
      this.intCustId = parseInt(localStorage.getItem('intCustId'));
      this.strEmail = localStorage.getItem('strCustEmail');
      this.selectedCity = localStorage.getItem('strLocation');
      this.selectedState = localStorage.getItem('strState');
      this.strGSTNo = localStorage.getItem('strGSTNo');
      this.strAddress = localStorage.getItem('txtAddress');
      if(this.selectedState=='KERALA'){
        this.blnIgst=false;
      }
    }
    if(this.strName ==''){
      this.showModalCustEdit= this.modalService.open(this.templateRef, { size: 'lg' ,backdrop  : 'static',});
    }
    
    const dctItem = {
      item_name: null,
      fk_item_id: null,
      product_name: null,
      fk_product_id: null,
      brand_name:null,
      fk_brand_id:null,
      int_qty: null,
      imei: null,
      lst_imei: null,
      flt_price: null,
      dblAmount: null,
      bln_state: null,
      lst_all_imei: null,
      fk_item__imei_status : null,
      itemKCESS : 0,
      dblSGSTPer : null,
      dblCGSTPer : null,
      dblIGSTPer :null,
      dblRate : null,
    };

    this.lstItems.push(dctItem);

    {}

    this.form = this.formBuilder.group({
          img1: [''],
          img2: [''],
          img3: [''],
    });

    setInterval(() => {
      this.time = new Date();
   }, 1000);


    this.searchItemName.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemName = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('itemcategory/item_typeahead_api/',{term:strData})
            .subscribe(
              (response) => {
                this.lstItemName = response['data'];

              }
            );
          }
        }
      }
    );

    this.searchCity.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCity = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('states/location_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCity = response['list_states'];
              }
            );
          }
        }
      }
    );

    this.searchState.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstState = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('states/states_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstState = response['list_states'];
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

    this.searchBrand.valueChanges
    .debounceTime(400)
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
            if (this.strItemCategory) {
              pushedItems['itemCategory_id'] = this.intItemCategoryId

           }
           if (this.strItemGroup) {
            pushedItems['itemGroup_id'] = this.intItemGroupId

            }
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

    this.searchItem.valueChanges
    .debounceTime(400)
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
            if (this.strBrand) {
              pushedItems['brand_id'] = this.intBrandId

              }
              if (this.strItemCategory) {
                pushedItems['itemCategory_id'] = this.intItemCategoryId

             }
             if (this.strItemGroup) {
              pushedItems['itemGroup_id'] = this.intItemGroupId

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
          }
          }
        }
      }
    );

    this.searchItemCategory.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemCategory = [];
      } else {
        if (strData.length >= 1) {
          if (!this.strProduct) {
          this.toastr.error('Product Name is required', 'Error!');
          }
          else{
            const pushedItems = {};
            if (this.strBrand) {
              pushedItems['brand_id'] = this.intBrandId

              }
              if (this.strItem) {
                pushedItems['item_id'] = this.intItemId

             }
             if (this.strItemGroup) {
              pushedItems['itemGroup_id'] = this.intItemGroupId

              }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
            this.serviceObject
            .postData('itemcategory/item_category_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstItemCategory = response['data'];
              }
            );
          }
          }
        }
      }
    );

    this.searchItemGroup.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemGroup = [];
      } else {
        if (strData.length >= 1) {
          if (!this.strProduct) {
          this.toastr.error('Product Name is required', 'Error!');
          }
          else{
            const pushedItems = {};
            if (this.strBrand) {
              pushedItems['brand_id'] = this.intBrandId

              }
              if (this.strItem) {
                pushedItems['item_id'] = this.intItemId

             }
             if (this.strItemCategory) {
              pushedItems['itemCategory_id'] = this.intItemCategoryId

              }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
            this.serviceObject
            .postData('itemgroup/item_group_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstItemGroup = response['data'];
              }
            );
          }
          }
        }
      }
    );
    


    this.searchCustomer.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      // if (strData === undefined || strData === null) {
      //   this.lstStaff = [];
      // } else {
        if (strData.length >= 1) {
          
          this.serviceObject
            .postData('reports/customer_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCustomer = response['data'];
             
              


                
              }
            );
          }
        // }
      }
    )


    this.searchCustomerNo.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCustomerNumber = [];
      } else {
        if (strData.length >= 1) {
          const dctData = {}
          dctData['term'] = strData;
          dctData['blnCustAdd'] =true;
          this.serviceObject
            .postData('customer/add_customer_pos/',dctData)
            .subscribe(
              (response) => {
                this.lstCustomerNumber = response['data'];
                 
              }
            );
          }
        }
      }
    );

  }

  customerNumberModelChange(event){
    // if(this.intContactNo!=this.selecetedCustNumber){
    //   this.intContactNo = null;
    //   // this.strCustomer = '';
    // }  
  }
  customerNumberChanged(item){
    // this.selecetedCustNumber = item.
    this.selecetedCustNumber = item.intContactNo;
    this.strName = item.strCustName;
    this.strEmail =item.strCustEmail;
    this.selectedCity =item.strLocation;
    this.strCity = item.strLocation;
    this.intCityId = item.intCityId;
    this.selectedState =item.strState;
    this.strState =item.strState;
    this.intStateId = item.intStateId;
    this.strAddress =item.txtAddress;
    this.strGSTNo = item.strGSTNo;
    this.intSalesCustId = item.intSalesCustId;
    this.intCustId =item.intCustId;
  }
  opencustomeredit(customeredit) {
    // console.log(customeredit,'edit');
    
      this.showModalCustEdit= this.modalService.open(customeredit, { size: 'lg',backdrop  : 'static', });
    }
  cancelCustEdit(){
    this.showModalCustEdit.close();
    this.router.navigate([this.page]);
  }
  saveCustEdit()
  {    

  
    let checkError=false
    
    if(this.strName=='' || this.strName==null || this.strName==undefined){
      
      this.toastr.error('Customer Name is required', 'Error!');
      checkError=true
      return false;
    
      }

  if(this.intContactNo == null || !this.intContactNo){
    this.toastr.error('Customer Contact Number is required', 'Error!');
    checkError=true
    return false;
  }
  else if(this.intContactNo.toString().length < 10 ){
    this.toastr.error('Customer number length atleast 10', 'Error!');
    checkError=true
    return false;
  }
  else if(this.intContactNo.toString().length >12){
    this.toastr.error('Customer number length maximum 12', 'Error!');
    checkError=true
    return false;
  }

  if (this.strEmail){
    let errorPlace;
    const eatpos = this.strEmail.indexOf('@');
    const edotpos = this.strEmail.lastIndexOf('.');
    if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.strEmail.length) {
      // validationSuccess = false ;
      errorPlace = 'Email format is not correct ';
      checkError=true
      // this.strEmail=null;
      // this.emailId.first.nativeElement.focus();
      this.toastr.error(errorPlace,'Error!');
      return;
    }
   }
  //  else{
  //   checkError=true
  //   this.toastr.error('Email is required','Error!');
  //   return;
  //  }
 
   if(this.selectedCity){
      if (this.selectedCity != this.strCity)
      {
       this.toastr.error('Valid City Name is required', 'Error!');
       checkError=true
       this.intCityId = null
       this.strCity = ''
       this.selectedCity=''
       return false;
     }
  }
  else{
      this.toastr.error('City Name is required', 'Error!');
       checkError=true
       this.intCityId = null
       this.strCity = ''
       this.selectedCity=''
       return false;
  }
  if(this.selectedState){
      if (this.selectedState != this.strState)
      {
        this.toastr.error('Valid State Name is required', 'Error!');
        checkError=true
        this.intStateId = null
        this.strState = ''
        this.selectedState=''
        return false;
      }
   }
   else{
    this.toastr.error('Valid State Name is required', 'Error!');
    checkError=true
    this.intStateId = null
    this.strState = ''
    this.selectedState=''
    return false;
   }

   if (this.strGSTNo && (this.strGSTNo).toString().length!=15) {
    this.toastr.error('Enter Valid GST No.', 'Error!');
   checkError=true;
    return false
  }
  if (this.strGSTNo && !(/^[0-9]{2}/).test(this.strGSTNo)) {
    this.toastr.error('First two digits of GST No. should be number', 'Error!');
   checkError=true;
    return false
  }
   
   

   if(!checkError){
    let dctCustomerData={}
  
    
    
    dctCustomerData['strName']=this.strName
    dctCustomerData['strEmail']=this.strEmail
    dctCustomerData['strAddress']=this.strAddress
    dctCustomerData['strCity']=this.strCity
    dctCustomerData['strState']=this.strState
    dctCustomerData['intCityId']=this.intCityId
    dctCustomerData['intStateId']=this.intStateId
    dctCustomerData['strGSTNo']=this.strGSTNo
    if(dctCustomerData['strState']=='KERALA'){
      this.blnIgst=false;
    }
    

     
    //  add customer start

    //  if(this.blnExchangeInvoice && this.blnCustomerAdd){

      // let checkError1=false
    
    //   if(this.strName == ''){
    //     this.toastr.error('Customer name is required', 'Error!');
    //     checkError1=true
    //     return false;
    //   }
    //   if(this.intContactNo == null || this.intContactNo == ''){

    //     this.toastr.error('Valid customer number is required', 'Error!');
    //     checkError1=true
    //     return false;
    //   }
     
      
    //   else if(this.intContactNo.toString().length < 10 ){
    //     this.toastr.error('Customer number length atleast 10', 'Error!');
    //     checkError1=true
    //     return false;
    //   }
    //   else if(this.intContactNo.toString().length >12){
    //     this.toastr.error('Customer number length maximum 12', 'Error!');
    //     checkError1=true
    //     return false;
    //   }

    //   if(this.strCity == ''){
    //     this.toastr.error('Valid City Name is required', 'Error!');
    //     checkError1=true
    //     this.intCityId = null
    //     this.strCity = ''
    //     this.selectedCity=''
    //     return false;
    //   }
    //     if(this.strCity== ''){
    //       this.toastr.error('Valid City Name is required', 'Error!');
    //       checkError1=true
    //       this.intCityId = null
    //       this.strCity = ''
    //       this.selectedCity=''
    //       return false;
    //     }
    //     if (this.selectedCity != this.strCity)
    //     {
    //      this.toastr.error('Valid City Name is required', 'Error!');
    //      checkError1=true
    //      this.intCityId = null
    //      this.strCity = ''
    //      this.selectedCity=''
    //      return false;
    //    }
    // // }
    // if(this.strState == ''){
    //   this.toastr.error('Valid State Name is required', 'Error!');
    //   checkError1=true
    //   this.intStateId = null
    //   this.strState = ''
    //   this.selectedState=''
    //   return false;
    //      }
    //     if (this.selectedState != this.strState)
    //     {
    //       this.toastr.error('Valid State Name is required', 'Error!');
    //       checkError1=true
    //       this.intStateId = null
    //       this.strState = ''
    //       this.selectedState=''
    //       return false;
    //     }
    // //  }
  
    // //  if (this.strEmail){
    //   let errorPlace;
    //   const eatpos = this.strEmail.indexOf('@');
    //   const edotpos = this.strEmail.lastIndexOf('.');
    //   if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.strEmail.length) {
    //     // validationSuccess = false ;
    //     errorPlace = 'Email format is not correct ';
    //     checkError1=true
    //     // this.strEmail=null;
    //     // this.emailId.first.nativeElement.focus();
    //     this.toastr.error(errorPlace,'Error!');
    //     return;
    //   }
    // //  }
    //  if(!checkError1){

      dctCustomerData['intMob'] = this.intContactNo;
      dctCustomerData['strStateCode'] = this.strStateCode;
      dctCustomerData['strPinCode'] = this.strPincode;

       
      this.serviceObject.postData('customer/add_customer_sales_return/',dctCustomerData).subscribe(res => {
        if (res.status == 1)
        {
          // this.intCustId = res['sales_cust_id'];
          swal.fire({
            position: "center",
            type: "success",
            text: "Data saved successfully",
            showConfirmButton: true,
          });
          this.blnDisabled = true;
          this.showModalCustEdit.close();
          this.intCustId = res['sales_cust_id']
          if (this.page){
            this.router.navigate([this.page]);
          }
        }
        else if (res.status == 0) {
          swal.fire('Error!','Something went wrong!!', 'error');
        }
    },
    (error) => {
      swal.fire('Error!','Server Error!!', 'error');

    });

      }
     

     }
     changeNameToUppercase(){
      // this.strGSTNo = this.strGSTNo.toUpperCase();
      if(this.strName!=''){
        this.strName = this.strName.toUpperCase();
      }
    }
    cityChanged(item)
   {
    this.intCityId = item.pk_bint_id;
    this.strCity = item.vchr_name;
    this.strPincode= item.vchr_pin_code;

  }
  stateChanged(item)
   {
    this.intStateId = item.pk_bint_id;
    this.strState = item.vchr_name;
    this.strStateCode = item.vchr_code;
  }
  changeToUppercase(){
    this.strGSTNo = this.strGSTNo.toUpperCase();
    // this.strName = this.strName.toUpperCase();
  }

  productSearched(data){
   

    
    this.lstProductList = [];
    if (data === null || data === '') {
      this.lstProductList = [];
      // this.lstItems[index]['intId'] = null;
      }
    if (data !== null && data.length >= 2) {
    this.serviceObject.postData('products/product_typeahead/', {term: data}).subscribe(
      (response) => {
        this.lstProductList = response['data'];
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
      );
    }
  }

  brandSearched(data){
    this.lstBrandList = [];
    if (data === null || data === '') {
      this.lstBrandList = [];
      // this.lstItems[index]['intId'] = null;
      }
    if (data !== null && data.length >= 2) {
    this.serviceObject.postData('brands/brands_typeahead/', {term: data}).subscribe(
      (response) => {
        this.lstBrandList = response['data'];
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
      );
    }
  }

  productSelected(item,index){
    this.selectedProduct = item.name;
    this.lstItems[index]['fk_product_id'] = item.id;
 
  }

  brandSelected(item,index){
    this.selectedBrand = item.name;
    this.lstItems[index]['fk_brand_id'] = item.id;
  }

  itemSearched(data, index) {
    this.lstItemsList = [];
    if (data === null || data === '') {
      this.lstItemsList = [];
      this.lstItems[index]['intId'] = null;
      }
    // if(this.selectedProduct == ''){
    //   this.toastr.error('Select valid product');
    //   return false;
    // }
    if(this.lstItems[index]['product_name']){
     if(this.lstItems[index]['product_name'] != this.selectedProduct){
      this.toastr.error('Select valid product');
      return false;
    }
    }
    // else if(!this.lstItems[index]['product_name']){
    //   this.toastr.error('Select valid product');
    //   return false;

    // }

    // else if(this.selectedBrand == ''){
    //   this.toastr.error('Select valid brand')
    //   return false;
    // }

    if(this.lstItems[index]['brand_name']){
      if(this.lstItems[index]['brand_name'] != this.selectedBrand){
        this.toastr.error('Select valid brand');
        return false;
      }    
    }
    // else if(!this.lstItems[index]['brand_name']){
    //   this.toastr.error('Select valid brand');
    //   return false;

    // }


    if (data !== null && data.length >= 2) {
      const postData = {}
      if(this.lstItems[index]['product_name'] && this.lstItems[index]['brand_name']){
        postData['term'] = data;
        postData['intProduct'] = this.lstItems[index]['fk_product_id'];
        postData['intBrand'] = this.lstItems[index]['fk_brand_id'];
      }
      else if(this.lstItems[index]['brand_name']){
        postData['term'] = data;
        postData['intBrand'] = this.lstItems[index]['fk_brand_id'];
      }
      else if(this.lstItems[index]['product_name']){
        postData['term'] = data;
        postData['intProduct'] = this.lstItems[index]['fk_product_id'];
      }
      else{
        postData['term'] = data;
      }
    this.serviceObject.postData('itemcategory/item_typeahead_api/', postData).subscribe(
      (response) => {
        this.lstItemsList = response['data'];
        this.lstItems[index]['dblAmount']=0
        
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
      );
    }
  }

  itemSelected(item, index) {
    this.lstItems[index]['fk_item_id'] = item.strItemId;
    this.lstItems[index]['fk_item__imei_status'] = item.imei_status;
    this.lstItemsList = [];
    this.lstItems[index]['flt_price'] = item.rate;
    this.lstItems[index]['dblSGSTPer'] = item.jsnTax.SGST;
    this.lstItems[index]['dblCGSTPer'] = item.jsnTax.CGST;
    this.lstItems[index]['dblIGSTPer'] = this.lstItems[index]['dblSGSTPer'] + this.lstItems[index]['dblCGSTPer'];
  }

  deleteItem(index) {
    this.lstItemsList = [];
    this.lstItems.splice(index, 1);
    // console.log(this.lstItems);
    
    if (this.lstItems.length === 0) {
  
    // } else {
      this.lstItems = [];
      const dctItem = {
        item_name: null,
        fk_item_id: null,
        product_name: null,
        fk_product_id: null,
        brand_name:null,
        fk_brand_id:null,
        int_qty: null,
        imei: null,
        lst_imei: null,
        flt_price: null,
        dblAmount: null,
        bln_state: null,
        lst_all_imei: null,
        fk_item__imei_status : null,
        itemKCESS : 0,
        dblSGSTPer : null,
        dblCGSTPer : null,
        dblIGSTPer : null,
        dblRate : null,
      };
      const dctImei ={
        lst_entered_imei :[]
      }
      this.lstItems.push(dctItem);
    }
  }

  addItem() {
    this.lstItemsList = [];
    //newly added 
    // if (!(this.lstItems.length === 1 && this.lstItems[0]['item_name'] === null)) {
      const dctItem = {
        item_name: null,
        fk_item_id: null,
        product_name: null,
        fk_product_id: null,
        brand_name:null,
        fk_brand_id:null,
        int_qty: null,
        imei: null,
        lst_imei: null,
        flt_price: null,
        dblAmount: null,
        bln_state: null,
        lst_all_imei: null,
        fk_item__imei_status : null,
        itemKCESS : 0,
        dblSGSTPer : null,
        dblCGSTPer : null,
        dblIGSTPer :null,
        dblRate : null,
      };
      const dctImei ={
        lst_entered_imei :[]
      }
      const length = this.lstItems.length
      if(this.lstItems[length-1].fk_item_id == null){
        this.toastr.error('Select Current Item')
        return false;
      }
      else{
      
        this.lstItems.push(dctItem);
      }
      
    // }
    // console.log(this.lstItems,length,'item');
    
  }

  save(){

    
    let intTotCGST = 0;
    let intTotSGST = 0;
    let intTotDblRate = 0;
    let intTotDblAmount = 0;
    let intKCESS = 0;
    let intTotKCESS = 0;

    if(!this.intCustId){
      this.toastr.error('Enter Customer Details');
        return;
    }
    for (let index = 0; index < this.lstItems.length; index++) {
      const element = this.lstItems[index];

      // console.log("#####element.imei",element.imei);
      

      if (element.item_name == null || element.fk_item_id == null) {
        this.toastr.error('Enter Item name of row ' + (index + 1) );
        return;
      } else if (element.dblAmount == null || element.dblAmount == 0 || element.dblAmount == undefined) {
        this.toastr.error('Enter Item total of row ' + (index + 1) );
        return;
      } else if (element.imei == null || element.imei ==undefined || element.imei =="") {
        this.toastr.error('Enter Item IMEI or Batch No. of row ' + (index + 1) );
        return;
      }
      else if(element.imei.length<5){
        this.toastr.error('Enter atleast 5 characters for IMEI or Batch No. of row ' + (index + 1) );
        return;
      }
      if (this.strInvoiceNum.length == 0){
        this.toastr.error('Enter Invoice Number');
        return;

      }
      if (this.strRemarks.length == 0){
        this.toastr.error('Enter Remarks');
        return;

      }
      
      
      intTotCGST = intTotCGST + ((this.lstItems[index]['dblRate']*this.lstItems[index]['dblCGSTPer'])/100);
      intTotSGST = intTotSGST + ((this.lstItems[index]['dblRate']*this.lstItems[index]['dblSGSTPer'])/100);
      intKCESS = this.lstItems[index]['dblRate']/100 ;
      if(!this.strGSTNo){
        intTotKCESS = intTotKCESS + intKCESS
      }
      if(!this.blnIgst){
        this.lstItems[index]['itemKCESS'] = intKCESS;
      }
      intTotDblRate = intTotDblRate + this.lstItems[index]['dblRate'];
      intTotDblAmount = intTotDblAmount + this.lstItems[index]['dblAmount'];
    }

    // Validation for tax = 0

    if((intTotCGST==0 || intTotSGST==0 )&&intTotDblRate!=0){
      this.toastr.error("Invalid Tax value" );
      return;
    }
   

    let dctData = {};
    
    if(this.blnIgst){
      dctData['intTotIGST'] = intTotCGST + intTotSGST;
       // Validation for tax = 0

      if(dctData['intTotIGST']==0 &&intTotDblRate!=0){
        this.toastr.error("Invalid Tax value" );
        return;
      }
    }
    else if(!this.strGSTNo) {
      dctData['intKCESS'] = intTotKCESS;
      dctData['intTotCGST'] = intTotCGST;
      dctData['intTotSGST'] = intTotSGST;
    }
    else{
      dctData['intTotCGST'] = intTotCGST;
      dctData['intTotSGST'] = intTotSGST;

    }
    
    dctData['blnIGST'] = this.blnIgst;
    dctData['intCustId'] = this.intCustId;
    dctData['lstItemDetails'] = this.lstItems;
    dctData['strOldInvoiceNum'] = this.strInvoiceNum;
    dctData['strRemarks'] = this.strRemarks
    this.saveDisable=true;
    
    this.serviceObject.postData('invoice/save_returned_sales/', dctData).subscribe(
      (response) => {
        if(response.status==1){
          swal.fire({
            position: "center",
            type: "success",
            text: "Data saved successfully",
            showConfirmButton: true,
          });
          this.clearAll();
          this.saveDisable=true;

          this.router.navigate(['invoice/salesreturnlist']);
        }
        else{
          if(response.hasOwnProperty('blnStock')){
            swal.fire('Error!',response['message'], 'error');
            this.saveDisable=false;

          }
          else{
            swal.fire('Error!','Something went wrong!!', 'error');
            this.saveDisable=false;
          }
        }
        
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
        this.saveDisable=false;
        
      }
      );
  }

  clearAll(){
  this.lstItemName = [];
  this.lstItems =[];
  this.lstCustomerNumber = [];
  this.intContactNo = null;
  this.selecetedCustNumber='';
  this.strName = '';
  this.strEmail = '';
  this.intSalesCustId =null;
  this.intCustId = null;
  this.blnCustAdd = true;
  this.lstProductList = [];
  this.lstBrandList = [];
  this.lstItemsList = [];
  this.blnDisabled = false;
  }

  cancelAll(){
    this.clearAll();
    this.router.navigate([this.page]);
  }
  customerChanged(){}
  
  changeAmount(i,event){
    // console.log(event,"event");
    
    if(!this.lstItems[i]['item_name']){
      this.toastr.error('Enter Item name of row ' + (i + 1) );
      this.lstItems[i]['dblAmount']=null
      // event=null
      return false
    }
    else{
      if(!this.blnIgst){
        this.lstItems[i]['dblRate'] = Number(((this.lstItems[i]['dblAmount']*100)/(this.lstItems[i]['dblSGSTPer'] + this.lstItems[i]['dblCGSTPer'] + 1 + 100)).toFixed(2))
      }
      else if(this.blnIgst){
        this.lstItems[i]['dblRate'] = Number((( this.lstItems[i]['dblAmount']*100)/( this.lstItems[i]['dblSGSTPer'] +  this.lstItems[i]['dblCGSTPer'] + 100)).toFixed(2))
      }
    }

  }

  OnKeyPress(item, event: any) {
  
    let e = <KeyboardEvent>event;
    // console.log("eve",event);
    if(event.code=="Space"){
      e.preventDefault();
    }
    
    if (item){
      if ( item.length > 14) {
        e.preventDefault();
      }
    }
  }

  imeiCheck(item){

    
    
    let dctData = {'intImi':item.imei};
     dctData['intNum'] = this.intContactNo;
     dctData['intItemId'] = item.fk_item_id;

     

    if(item.imei.length>4){

      if(item.fk_item_id == null || item.fk_item_id == ''){
        this.toastr.error('Select item');
        item.imei = '';
        return false;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      }

      this.serviceObject.postData('salesreturn/check_imei/', dctData).subscribe(
        (response) => {
          if(response.status==1){
            
            if(response['blnSale']){
              swal.fire({
                position: "center",
                type: "warning",
                text: "Take normal sales return",
                showConfirmButton: true,
              });
              
              item.imei = '';
              item.item_name = '';
              item.dblRate = null;
              item.dblSGSTPer = null;
              item.dblCGSTPer = null;
              item.dblIGSTPer = null;
              item.dblAmount = null;
            }
            else if(response['blnStock']){
              swal.fire({
                position: "center",
                type: "warning",
                text: "Imei exists in stock",
                showConfirmButton: true,
              });
              item.imei = '';

            }

           
           
          }
          
        },
        (error) => {
          Swal.fire('Error!', 'error', 'error');
        }
        );

    }
 
   


  }


}
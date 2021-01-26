
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { timeHours } from 'd3';
import swal from 'sweetalert2';
import * as moment from 'moment' ;


@Component({
  selector: 'app-editcoupon',
  templateUrl: './editcoupon.component.html',
  styleUrls: ['./editcoupon.component.css']
})
export class EditcouponComponent implements OnInit {

  couponId= localStorage.getItem('couponRowId');

  @ViewChild('idCode', { static: true }) idCode: any;
  @ViewChild('idExpiryDate', { static: true }) idExpiryDate: any;
  @ViewChild('idPackage', { static: true }) idPackage: any;
  @ViewChild('idProduct') idProduct: any;
  @ViewChild('idBrand') idBrand: any;
  @ViewChild('idItemCategory') idItemCategory: any;
  @ViewChild('idItemGroup') idItemGroup: any;
  @ViewChild('idItem') idItem: any;
  @ViewChild('idDisAmnt') idDisAmnt: any;
  @ViewChild('idDisPer', { static: true }) idDisPer: any;
  @ViewChild('idUsageCount', { static: true }) idUsageCount: any;
  @ViewChild('idMinPurAmnt', { static: true }) idMinPurAmnt: any;
  public form: FormGroup;
  
  strCouponCode='';
  strPackage='';
  datExpiryDate='';

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

  blnItemCategory=false;
  lst_item_category = [];
  strItemCategory='';
  intItemCategoryId;
  selectedItemCategory='';

  blnItemGroup=false;
  lst_item_group = [];
  strItemgroup='';
  intItemGroupId;
  selectedItemGroup='';

  blnItem=false;
  lst_item = [];
  strItem='';
  intItemId;
  selectedItem='';

  blnAll=false;

  intMaxDiscAmnt:number=null;
  intDiscPer:number =null;
  intUsageCount:number =null;
  intMinPurchaseAmnt:number = null;

  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  searchItemCategory: FormControl = new FormControl();
  searchItemGroup: FormControl = new FormControl();
  searchItem: FormControl = new FormControl();
  dataLoaded = false;
  couponDetails=[];

  constructor(
    private serverService: ServerService,
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.form = this.fb.group(
      {
        code:[null, Validators.compose([Validators.required])],
        expirydate:[null, Validators.compose([Validators.required])],
        package:[null, Validators.compose([Validators.required])],
        product:[null, Validators.compose([Validators.required])],
        brand:[null, Validators.compose([Validators.required])],
        itemcategory:[null, Validators.compose([Validators.required])],
        itemgroup:[null, Validators.compose([Validators.required])],
        item :[null, Validators.compose([Validators.required])],
        maxdisamnt: [null, Validators.compose([Validators.required])],
        disper:[null, Validators.compose([Validators.required])],
        usagecount:[null, Validators.compose([Validators.required])],
        minpurchaseamnt:[null, Validators.compose([Validators.required])],
      }

    );

    

  
  this.searchProduct.valueChanges.pipe(
  debounceTime(400))
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lst_product = [];
    } else {
      if (strData.length >= 3) {
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

this.searchBrand.valueChanges.pipe(
debounceTime(400))
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lst_brand = [];
  } else {
    if (strData.length >= 3) {
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

this.searchItemCategory.valueChanges.pipe(
debounceTime(400))
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lst_item_category = [];
  } else {
    if (strData.length >= 3) {
      this.serverService
        .postData('itemcategory/item_category_typeahead/', { term: strData })
        .subscribe(
          (response) => {
            this.lst_item_category = response['data'];

          }
        );
    }
  }
}
);

this.searchItemGroup.valueChanges.pipe(
debounceTime(400))
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lst_item_group = [];
  } else {
    if (strData.length >= 3) {
      this.serverService
        .postData('itemgroup/item_group_typeahead/', { term: strData })
        .subscribe(
          (response) => {
            this.lst_item_group = response['data'];

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
    this.lst_item = [];
  } else {
    if (strData.length >= 3) {
      this.serverService
        .postData('itemcategory/item_typeahead/', { term: strData })
        .subscribe(
          (response) => {
            this.lst_item = response['data'];

          }
        );
    }
  }
}
);

this.getCouponData(this.couponId);
   
  

  }
  
  getCouponData(id){
   
    this.couponDetails = [];
    this.serverService.getData('coupon/get_coupon_by_id/?id='+id).subscribe(
      result => {
        if (result['status']== 1){
          this.couponDetails = result['list'][0]
          this.dataLoaded = true;

          this.strCouponCode = this.couponDetails['vchr_coupon_code'];
          this.datExpiryDate = this.couponDetails['dat_expiry'];
          this.strPackage    = this.couponDetails['int_which'];
          console.log("all",this.strPackage )
          this.intDiscPer    = this.couponDetails['int_discount_percentage'];
          this.intMaxDiscAmnt= this.couponDetails['bint_max_discount_amt'];
          this.intUsageCount = this.couponDetails['int_max_usage_no'];
          this.intMinPurchaseAmnt= this.couponDetails['bint_min_purchase_amt'];
          
          
          
          if(this.strPackage.toString()== '1'){
     
            
            this.selectedProduct=this.couponDetails['fk_product__vchr_name'];
            this.intProductId = this.couponDetails['fk_product_id'];
            this.strProduct = this.couponDetails['fk_product__vchr_name'];
        
            
          }
          else if(this.strPackage.toString()== '2'){
            // this.strBrand =this.couponDetails['fk_brand__vchr_name'];
            this.selectedBrand=this.couponDetails['fk_brand__vchr_name'];
            this.intBrandId = this.couponDetails['fk_brand_id'];
            this.strBrand = this.couponDetails['fk_brand__vchr_name'];
          }
          else if(this.strPackage.toString()== '3'){
            // this.strItemCategory=this.couponDetails['fk_item_category__vchr_item_category'];
            this.selectedItemCategory=this.couponDetails['fk_item_category__vchr_item_category'];
            this.intItemCategoryId =this.couponDetails['fk_item_category_id'];
            this.strItemCategory = this.couponDetails['fk_item_category__vchr_item_category'];
          }
          else if(this.strPackage.toString()== '4'){
            // this.strItemgroup=this.couponDetails['fk_item_group__vchr_item_group'];
            this.selectedBrand = this.couponDetails['fk_item_group__vchr_item_group'];
            this.intBrandId = this.couponDetails['fk_brand_id'];
            this.strBrand = this.couponDetails['fk_item_group__vchr_item_group'];
          }
          else if(this.strPackage.toString()== '5'){
            // this.strItem=this.couponDetails['fk_item__vchr_name'];
            this.selectedItem = this.couponDetails['fk_item__vchr_name'];
            this.intItemId = this.couponDetails['fk_item_id'];
            this.strItem = this.couponDetails['fk_item__vchr_name'];
          }

        }
        
        
        
    
      
      }, (error ) => { if(error.status == 401){
      localStorage.setItem('previousUrl','/user/sign-in');
        
        this.router.navigate(['/user/sign-in']);} }  );
    }

  changePackage(packages){
    this.blnProduct = false;
    this.blnBrand = false;
    this.blnItemCategory = false;
    this.blnItemGroup = false;
    this.blnItem = false;
    this.blnAll = false;
    // this.strProduct='';
    // this.selectedProduct='';
    // this.strBrand='';
    // this.strItemCategory='';
    // this.strItemgroup='';
    // this.strItem='';
    if(packages == 0){

      this.blnAll=true;
      this.strBrand='';
      this.selectedBrand = '';
      this.selectedItemCategory='';
      this.selectedItemGroup = '';
      this.selectedItem = '';
      this.strItemCategory='';
      this.strItemgroup='';
      this.strItem='';
      
    }
    else if(packages == 1){

      this.blnProduct = true;
      this.strBrand='';
      this.selectedBrand = '';
      this.selectedItemCategory='';
      this.selectedItemGroup = '';
      this.selectedItem = '';
      this.strItemCategory='';
      this.strItemgroup='';
      this.strItem='';
    }
    else if(packages == 2){
    this.blnBrand =  true;
    this.selectedProduct='';
    this.strItemCategory='';
    this.strItemgroup='';
    this.strItem='';
    this.selectedItemCategory='';
    this.selectedItemGroup = '';
    this.selectedItem = '';
 
    } 
    else if(packages == 3){
      this.blnItemCategory = true;
      this.selectedProduct='';
      this.strBrand='';
      this.strItemgroup='';
      this.strItem='';
      this.selectedBrand = '';
      this.selectedItemGroup = '';
      this.selectedItem = '';
    } 
    else if(packages ==  4){
      this.blnItemGroup = true;
      this.selectedProduct='';
      this.strBrand='';
      this.strItemCategory='';
      this.strItem='';
      this.selectedBrand = '';
      this.selectedItemCategory='';
      this.selectedItem = '';

    }
    else if(packages ==5){
      this.blnItem = true;
      this.selectedProduct='';
      this.strBrand='';
      this.strItemgroup='';
      this.strItemCategory='';
      this.selectedBrand = '';
      this.selectedItemCategory='';
      this.selectedItemGroup = '';
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
  itemcategoryChanged(item){
    this.intItemCategoryId = item.id;
    this.strItemCategory = item.name;

  }
  itemgroupChanged(item){
  
    
    this.intItemGroupId = item.id;
    this.strItemgroup = item.name;
    
  }
  itemChanged(item){
    this.intItemId = item.id;
    this.strItem = item.code_name;

  }
  saveCoupon(){
  let pushed_data ={}
  let validationSuccess = true;

  // console.log('product',this.strProduct,this.selectedProduct);
  // console.log("pack",this.strPackage.toString())
  this.datExpiryDate = moment(this.datExpiryDate).format('YYYY-MM-DD')
  if(this.strCouponCode == ''){

    validationSuccess =false
    this.toastr.error('Please enter Coupon Code','Error!');
    // this.idCode.nativeElement.focus();
    return false;

  }
  else if(this.datExpiryDate == 'Invalid date'){
    validationSuccess =false
    this.toastr.error('Please enter Expiry Date','Error!');
    // this.idExpiryDate.nativeElement.focus();
    return false;
  }
  
  else if(this.strPackage.toString()== '' || this.strPackage== null){
    validationSuccess =false
  
    this.toastr.error('Please enter Type','Error!');
    // this.idPackage.nativeElement.focus();
    return false;
  }
  
  else if(this.strPackage.toString()== '1' && this.strProduct== ''  || this.strProduct != this.selectedProduct){
    validationSuccess =false
    this.toastr.error('Please enter Product','Error!');
    // this.idProduct.nativeElement.focus();
    return false;
  }
  else if(this.strPackage.toString()== '2'&&  this.strBrand== '' || this.strBrand != this.selectedBrand){
    validationSuccess =false
    this.toastr.error('Please enter Brand','Error!');
    // this.idBrand.nativeElement.focus();
    return false;
  }
  else if(this.strPackage.toString()== '3'  && this.strItemCategory== '' || this.strItemCategory != this.selectedItemCategory){
    validationSuccess =false
    this.toastr.error('Please enter Item Category','Error!');
    // this.idItemCategory.nativeElement.focus();
    return false;
  }
  else if(this.strPackage.toString()== '4'  && this.strItemgroup== '' || this.strItemgroup != this.selectedItemGroup){
    validationSuccess =false
    this.toastr.error('Please enter Item Group','Error!');
    // this.idItemGroup.nativeElement.focus();
    return false;
  }
  else if(this.strPackage.toString()== '5'  && this.strItem== '' || this.strItem != this.selectedItem){
    validationSuccess =false
    this.toastr.error('Please enter Item','Error!');
    // this.idItem.nativeElement.focus();
    return false;
  }
  else if(this.intMaxDiscAmnt == null){
    validationSuccess =false
    this.toastr.error('Please enter Maximum Discount Amount','Error!');
    // this.idDisAmnt.nativeElement.focus();
    return false;
  }
  else if(this.intMinPurchaseAmnt == null){
    validationSuccess =false
    this.toastr.error('Please enter Minimum Purchase Amount','Error!');
    // this.idMinPurAmnt.nativeElement.focus();
    return false;
  }
  else if(this.intDiscPer == null){
    validationSuccess =false
    this.toastr.error('Please enter Discount Percentage','Error!');
    // this.idDisPer.nativeElement.focus();
    return false;
  }
  else if(this.intUsageCount == null){
    validationSuccess =false
    this.toastr.error('Please enter Usage Count','Error!');
    // this.idUsageCount.nativeElement.focus();
    return false;
  }
  else if(validationSuccess){

    pushed_data['strCouponCode'] =this.strCouponCode;
    pushed_data['datExpiry'] =this.datExpiryDate;
    pushed_data['intWhich'] =this.strPackage;
    pushed_data['intDiscountPercentage'] =this.intDiscPer;
    pushed_data['bintMaxDiscountAmt'] =this.intMaxDiscAmnt;
    pushed_data['intMaxUsageNo'] =this.intUsageCount;
    pushed_data['bintMinPurchaseAmt'] =this.intMinPurchaseAmnt;
    pushed_data['pk_bint_id'] = this.couponDetails['pk_bint_id'];
    
    if(this.strPackage.toString()== '1'){
      pushed_data['fkPackage'] = this.intProductId;
    }
    else if(this.strPackage.toString()== '2'){
      pushed_data['fkPackage'] = this.intBrandId;
    }
    else if(this.strPackage.toString()== '3'){
      pushed_data['fkPackage'] = this.intItemCategoryId;
    }
    else if(this.strPackage.toString()== '4'){
      pushed_data['fkPackage'] = this.intItemGroupId;
    }
    else if(this.strPackage.toString()== '5'){
      pushed_data['fkPackage'] = this.intItemId;
    }
    console.log(pushed_data);
    this.serverService.postData('coupon/coupon_edit/',pushed_data).subscribe(
      (response) => {
      const result = response;
      if (result['status'] === 1) {
      swal.fire( 'Success', 'Successfully added', 'success');
      // this.clearSupplierFields();
      localStorage.setItem('previousUrl','coupon/listcoupon');
      
      this.router.navigate(['coupon/listcoupon']);
    } else {
      this.toastr.error(result['reason'],'Error!');
    }
      },
      (error) => { if(error.status == 401){
      localStorage.setItem('previousUrl','/user/sign-in');
        
        this.router.navigate(['/user/sign-in']);} }
    );


  }

  }

  clearData(){
    this.form.reset();
    this.strCouponCode ='';
    this.datExpiryDate = '';
    this.strPackage = '';
    this.strItemCategory = '';
    this.intItemCategoryId = null;
    this.intMaxDiscAmnt =null;
    this.intDiscPer = null;
    this.intUsageCount = null; 
  }
  
}
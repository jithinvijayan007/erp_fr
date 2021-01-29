
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit,ViewChild ,ElementRef} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { timeHours } from 'd3';
import swal from 'sweetalert2';
import * as moment from 'moment' ;
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-addcoupon',
  templateUrl: './addcoupon.component.html',
  styleUrls: ['./addcoupon.component.css']
})
export class AddcouponComponent implements OnInit {

  @ViewChild('idCode', { static: true }) idCode:  ElementRef;
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
  intProductId;
  blnProduct=false;
  lst_product = [];
  strSelectedProduct = '';

  blnBrand=false;
  lst_brand = [];
  strBrand='';
  intBrandId;
  strSelectedBrand='';

  blnItemCategory=false;
  lst_item_category = [];
  strItemCategory='';
  intItemCategoryId;
  strSelectedItemCategory = '';

  blnItemGroup=false;
  lst_item_group = [];
  strItemgroup='';
  intItemGroupId;
  strSelectedItemgroup='';

  blnItem=false;
  lst_item = [];
  strItem='';
  intItemId;
  strSelectedItem = '';

  intMaxDiscAmnt:number=null;
  intDiscPer:number =null;
  intUsageCount:number =null;
  intMinPurchaseAmnt:number = null;
  blnAll=false
  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  searchItemCategory: FormControl = new FormControl();
  searchItemGroup: FormControl = new FormControl();
  searchItem: FormControl = new FormControl();

  files;

  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinnerService: NgxSpinnerService,
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


   
  

  }


  changePackage(packages){
    this.blnProduct = false;
    this.blnBrand = false;
    this.blnItemCategory = false;
    this.blnItemGroup = false;
    this.blnItem = false;
    this.strProduct='';
    this.strSelectedProduct='';
    this.strBrand='';
    this.strSelectedBrand='';
    this.strItemCategory='';
    this.strSelectedItemCategory = '';
    this.strItemgroup='';
    this.strSelectedItemgroup='';
    this.strItem='';
    this.strSelectedItem = '';
    if(packages == 0){
    this.blnAll=true;}
    if(packages == 1){
      this.blnProduct = true;
    }
    else if(packages == 2){
    this.blnBrand =  true;
    } 
    else if(packages == 3){
      this.blnItemCategory = true;
    } 
    else if(packages ==  4){
      this.blnItemGroup = true;

    }
    else if(packages ==5){
      this.blnItem = true;
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
  else if(this.strPackage.toString()== '1' && this.strProduct== ''  || this.strProduct != this.strSelectedProduct){
    validationSuccess =false
    this.toastr.error('Please enter Product','Error!');
    // this.idProduct.nativeElement.focus();
    return false;
  }
  else if(this.strPackage.toString()== '2' && this.strBrand== '' || this.strBrand != this.strSelectedBrand){
    validationSuccess =false
    this.toastr.error('Please enter Brand','Error!');
    // this.idBrand.nativeElement.focus();
    return false;
  }
  else if(this.strPackage.toString()== '3' && this.strItemCategory== '' || this.strItemCategory != this.strSelectedItemCategory){
    validationSuccess =false
    this.toastr.error('Please enter Item Category','Error!');
    // this.idItemCategory.nativeElement.focus();
    return false;
  }
  else if(this.strPackage.toString()== '4' && this.strItemgroup== '' || this.strItemgroup != this.strSelectedItemgroup){
    validationSuccess =false
    this.toastr.error('Please enter Item Group','Error!');
    // this.idItemGroup.nativeElement.focus();
    return false;
  }
  else if(this.strPackage.toString()== '5' && this.strItem== '' || this.strItem != this.strSelectedItem){
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

    this.serverService.postData('coupon/coupon_add/',pushed_data).subscribe(
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
  
  fileManager(fileInput) {
    fileInput.click();
  }

  addFiles2(inputFile) {
    // console.log("file",this.files)
    if (inputFile.files[0] !== undefined) {
      this.files=inputFile.files[0]
      // console.log("inputfile",inputFile.files[0])
    }
  }

  saveFile() {
    // console.log("file",this.files.name)
    
    let filename = this.files.name.toLowerCase()
    // console.log(filename.endsWith('.xlsx'))
    if(this.files == '' || this.files == undefined){

      this.toastr.error('Please Upload File','Error!');
      // this.idCode.nativeElement.focus();
      return false;
  
    }
    
    else if(!(filename.endsWith('.xlsx'))){

      this.toastr.error('Only  Allow .xlsx File Format','Error!');
      // this.idCode.nativeElement.focus();
      return false;
  
    }
    let pushed_data ={}
    const formdata=new FormData;
    formdata.append('files',this.files,this.files.name)
    this.spinnerService.show();

    this.serverService.postData('coupon/coupon_import/',formdata).subscribe(
      (response) => {
        this.spinnerService.hide();

        if (response.status == 1) {
          
          swal.fire({
            position: "center", 
            type: "success",
            text: "Data Uploaded successfully",
            showConfirmButton: true,  
          }); 
          this.files=''  
        }  
        else if (response.status == 0) {
         swal.fire('Error!',response['reason'],'error');          
        }
    },
    (error) => {   
      this.spinnerService.hide();

     swal.fire('Error!','Something went wrong!!', 'error');
    }
      );
  }
}

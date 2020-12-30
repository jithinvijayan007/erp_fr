import { Component, OnInit,ViewChild , ViewChildren } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment';
@Component({
  selector: 'app-adddealer',
  templateUrl: './adddealer.component.html',
  styleUrls: ['./adddealer.component.css']
})
export class AdddealerComponent implements OnInit {

  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,  public router: Router,
    private toastr: ToastrService,) { }

  @ViewChild('dealerCodeId', { static: true }) dealerCodeId: any;
  @ViewChild('dealerNameId', { static: true }) dealerNameId: any;
  @ViewChild('dealerFromId', { static: true }) dealerFromId: any;
  @ViewChild('creditDays', { static: true }) creditDays: any;
  @ViewChild('idpoExpiryDays', { static: true }) idpoExpiryDays: any;
  @ViewChild('creditLimit', { static: true }) creditLimit: any;

  @ViewChildren('addressId') addressId: any;
  @ViewChildren('contactId') contactId: any;
  @ViewChildren('emailId') emailId: any;
  @ViewChildren('pinCodeId') pinCodeId: any;

  @ViewChild('tinNo', { static: true }) tinNo: any;
  @ViewChild('cstNo', { static: true }) cstNo: any;
  @ViewChild('gstinNo', { static: true }) gstinNo: any;
  @ViewChild('gstinStatus', { static: true }) gstinStatus: any;
  @ViewChild('categoryId') categoryId: any;
  @ViewChild('taxId') taxId: any;
  @ViewChild('groupId', { static: true }) groupId: any;
  @ViewChild('accId', { static: true }) accId: any;
  @ViewChild('panNoId', { static: true }) panNoId: any;
  @ViewChild('panStatusId', { static: true }) panStatusId: any;



  strDealerName:'';
  datDealerFrom=new Date();
  strDealerCode:'';
  intActive="0";
  intCreditDays:null;
  intCreditLimit:null;
  poExpiryDays;
  dctData={}
  strPanStatus:'';
  strPanNo:'';
  strAccount:'';
  strGroup:'';
  strTax:'';
  strCategory:'';
  strGSTStatus:'';
  strGSTIN:'';
  strCSTNo:'';
  strTINNo:''
  lstTax=[]
  lstCategory=[]
  registerForm: FormGroup;
  searchCategory: FormControl = new FormControl();
  IntCategoryId;
  strCategorys;
  selectedCategory;
  IntTaxId;
  strTaxs;
  selectedTax;
  previusUrl = localStorage.getItem('previousUrl');
  
  ngOnInit() {
console.log(this.previusUrl,"perf");
console.log(localStorage,"local");

    this.datDealerFrom=new Date();
    this.registerForm = this.formBuilder.group({
      dealerCode:[null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
      dealerName:  [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      dealerFrom: [null, Validators.compose([Validators.required])],
      days: [null, Validators.compose([Validators.required])],
      poExpiryDays:  [null, Validators.compose([Validators.required])],
      limit:  [null, Validators.compose([Validators.required])],
      TIN:  [null, Validators.compose([Validators.required])],
      CST:  [null, Validators.compose([Validators.required])],
      GSTIN:  [null, Validators.compose([Validators.required])],
      GSTstatus:  [null, Validators.compose([Validators.required])],
      category:  [null, Validators.compose([Validators.required])],
      tax:  [null, Validators.compose([Validators.required])],
      accGroup:  [null, Validators.compose([Validators.required])],
      account:  [null, Validators.compose([Validators.required])],
      panNo:  [null, Validators.compose([Validators.required])],
      panStatus:  [null, Validators.compose([Validators.required])],

      });


    this.dctData['lstaddress']=[
      {
        strAddress:'',
        strEmail:'',
        intContact:null,
        intPinCode:''
      }
    ] 
    this.dctData['lstcontact']=[
      {
        strName:'',
        strDesig:'',
        strDept:'',
        strOffice:'',
        intPhone1:null,
        intPhone2:null
      }
    ]
      this.getData();

      // this.searchCategory.valueChanges
      // .debounceTime(400)
      // .subscribe((strData: string) => {
      //   if (strData === undefined || strData === null) {
      //     this.lstCategory= [];
      //   } else {
      //     if (strData.length >= 1) {
      //       this.serviceObject
      //         .postData('category/other_categoryTypeahead/',{term:strData})
      //         .subscribe(
      //           (response) => {
      //             this.lstCategory = response['data'];
      //           }
      //         );

      //     }
      //   }
      // }
      // ); 
  }
  categoryChanged(item) {
    this.IntCategoryId = item.pk_bint_id;
    this.strCategory = item.vchr_name;
  }
  taxChanged(item) {
    this.IntTaxId = item[0];
    this.strTax = item[1];
  }
  getData()
  {
    this.serviceObject.getData('dealer/add_dealer/').subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.lstTax=response['tax_list'];
            this.lstCategory = response['dealer_category'];
            
          }  
      
      },
      (error) => {   
      });
    
  }
  addAddress(){
    // console.log(this.dctData['lstaddress'],"bfr")

    this.dctData['lstaddress'].push(
      {
        strAddress:'',
        strEmail:'',
        intContact:null,
        intPinCode:''
      }
    )
    // console.log(this.dctData['lstaddress'],"aftr")
    
  }

  closeAddress(index){
    this.dctData['lstaddress'].splice(index,1);
  
  }

  addContact(){
    this.dctData['lstcontact'].push(
      {
        strName:'',
        strDesig:'',
        strDept:'',
        strOffice:'',
        intPhone1:null,
        intPhone2:null
      }
    )
  }
  closeContact(index){
    this.dctData['lstcontact'].splice(index,1);
   
  }

  saveDealer(){
    if (!this.strDealerName) {
      this.dealerNameId.nativeElement.focus();
      this.toastr.error('Dealer Name is required', 'Error!');
      return false;
    } 
    if (!this.datDealerFrom){
      this.dealerFromId.nativeElement.focus();
      this.toastr.error('Dealer From is required', 'Error!');
      return false;
    } 
    if (!this.strDealerCode){
      this.dealerCodeId.nativeElement.focus();
      this.toastr.error('Code is required', 'Error!');
      return false;
    } 
  
    if (!this.intCreditDays){
      this.creditDays.nativeElement.focus();
      this.toastr.error('Credit Days is required', 'Error!');
      return false;
    } 
    if (!this.intCreditLimit){
      this.creditLimit.nativeElement.focus();
      this.toastr.error('Credit Limit is required', 'Error!');
      return false;
    } 
    if (!this.poExpiryDays){
      this.idpoExpiryDays.nativeElement.focus();
      this.toastr.error('PO Expiry Days is required', 'Error!');
      return false;
    } 
    if (!this.strTINNo){
      this.tinNo.nativeElement.focus();
      this.toastr.error('TIN No is required', 'Error!');
      return false;
    } 
    if (!this.strCSTNo){
      this.cstNo.nativeElement.focus();
      this.toastr.error('CST No is required', 'Error!');
      return false;
    }  
    if (!this.strGSTIN){
      this.gstinNo.nativeElement.focus();
      this.toastr.error('GSTIN No is required', 'Error!');
      return false;
    } 
    if (!this.strGSTStatus){
      this.gstinStatus.nativeElement.focus();
      this.toastr.error('GSTIN Status is required', 'Error!');
      return false;
    } 
    if (!this.selectedCategory){
      // this.categoryId.nativeElement.focus();
      this.toastr.error('Dealer Category is required', 'Error!');
      return false;
    } 
    if (!this.selectedTax){
      // this.taxId.nativeElement.focus();
      this.toastr.error('Dealer Tax Class is required', 'Error!');
      return false;
    } 
    if (!this.strGroup){
      this.groupId.nativeElement.focus();
      this.toastr.error('Account Group is required', 'Error!');
      return false;
    } 
    if (!this.strAccount){
      this.accId.nativeElement.focus();
      this.toastr.error('Bank Account is required', 'Error!');
      return false;
    } 
    if (!this.strPanNo){
      this.panNoId.nativeElement.focus();
      this.toastr.error('Pan NO is required', 'Error!');
      return false;
    } 
    if (!this.strPanStatus){
      this.panStatusId.nativeElement.focus();
      this.toastr.error('Pan Status is required', 'Error!');
      return false;
    } 
  
    // address 

    for(let item=0;item <this.dctData['lstaddress'].length;item++)
    {
      if (!this.dctData['lstaddress'][item].strAddress){
        // this.addressId.nativeElement.focus();
        this.toastr.error('Address is required of'+' #'+(item+1), 'Error!');
        return false;
      } 
      // if (!this.dctData['lstaddress'][item].strEmail){
      //   // this.emailId.nativeElement.focus();
      //   this.toastr.error('Email is required of'+' #'+(item+1), 'Error!');
      //   return false;
      // } 
      if ( this.dctData['lstaddress'][item]['strEmail'] != null || this.dctData['lstaddress'][item]['strEmail'] != ''){
        let errorPlace;
        const eatpos = this.dctData['lstaddress'][item]['strEmail'].indexOf('@');
        const edotpos = this.dctData['lstaddress'][item]['strEmail'].lastIndexOf('.');
        if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.dctData['lstaddress'][item]['strEmail'].length) {
          // validationSuccess = false ;
          errorPlace = 'Email format not correct for Address'+' #'+(item+1);
          // this.dctData['lstaddress'][item]['strEmail']=null;
          // this.emailId.first.nativeElement.focus();
          this.toastr.error(errorPlace,'Error!');
          return;
        }
      }

      if(!this.dctData['lstaddress'][item]['intContact'] ){
        // validationSuccess = false ;
        this.toastr.error('Please enter valid phone number for Address'+' #'+(item+1),'Error!');
        // this.contactId.nativeElement.focus();
        this.toastr.error('Phone No is required of'+' #'+(item+1), 'Error!');
        return false;
      }else if(this.dctData['lstaddress'][item]['intContact'].toString().length < 10 || (this.dctData['lstaddress'][item]['intContact'].toString().length > 12)){
        // validationSuccess = false ;
        this.toastr.error('Contact number length between 10 and 12 digit for Address'+' #'+(item+1),'Error!');
        // this.contactId.nativeElement.focus();
        return false;
      }



       if (!this.dctData['lstaddress'][item].intPinCode){
        // this.pinCodeId.nativeElement.focus();
        this.toastr.error('Pin Code is required for Address'+' #'+(item+1), 'Error!');
        return false;
      } 

    }
   
    // contact person

    for(let item=0;item <this.dctData['lstcontact'].length;item++)
    {
      if (!this.dctData['lstcontact'][item].strName){
        // this.addressId.nativeElement.focus();
        this.toastr.error('Contact Person Name is required of'+' #'+(item+1), 'Error!');
        return false;
      } 
      if (!this.dctData['lstcontact'][item].strDesig){
        // this.emailId.nativeElement.focus();
        this.toastr.error('Contact Person Designation is required of'+' #'+(item+1), 'Error!');
        return false;
      } 
      if (!this.dctData['lstcontact'][item].strDept){
        // this.contactId.nativeElement.focus();
        this.toastr.error('Contact Person Department required of'+' #'+(item+1), 'Error!');
        return false;
      } 
       if (!this.dctData['lstcontact'][item].strOffice){
        // this.pinCodeId.nativeElement.focus();
        this.toastr.error('Contact Person Office is required of'+' #'+(item+1), 'Error!');
        return false;
      } 
      // if (!this.dctData['lstcontact'][item].intPhone1){
      //   // this.pinCodeId.nativeElement.focus();
      //   this.toastr.error('Contact Person Mobile No 1 is required of'+' #'+(item+1), 'Error!');
      //   return false;
      // } 
      // if (!this.dctData['lstcontact'][item].intPhone2){
      //   // this.pinCodeId.nativeElement.focus();
      //   this.toastr.error('Contact Person  Mobile No 2 is required of'+' #'+(item+1), 'Error!');
      //   return false;
      // } 
      if(!this.dctData['lstcontact'][item]['intPhone1'] ){
        // validationSuccess = false ;
        this.toastr.error('Please enter valid Mobile No 1 for Contact Person'+' #'+(item+1),'Error!');
        // this.contactId.nativeElement.focus();
        return false;
      }else if(this.dctData['lstcontact'][item]['intPhone1'].toString().length < 10 || (this.dctData['lstcontact'][item]['intPhone1'].toString().length > 12)){
        // validationSuccess = false ;
        this.toastr.error(' Mobile No 1 length between 10 and 12 digit for Contact Person'+' #'+(item+1),'Error!');
        // this.contactId.nativeElement.focus();
        return false;
      }
      if(!this.dctData['lstcontact'][item]['intPhone2'] ){
        // validationSuccess = false ;
        this.toastr.error('Please enter valid Mobile No 2 for Contact Person'+' #'+(item+1),'Error!');
        // this.contactId.nativeElement.focus();
        return false;
      }else if(this.dctData['lstcontact'][item]['intPhone2'].toString().length < 10 || (this.dctData['lstcontact'][item]['intPhone2'].toString().length > 12)){
        // validationSuccess = false ;
        this.toastr.error('Mobile No 2 length between 10 and 12 digit for Contact Person'+' #'+(item+1),'Error!');
        // this.contactId.nativeElement.focus();
        return false;
      }

    }
    let orderDat=moment(this.datDealerFrom).format('YYYY-MM-DD');

      this.dctData['dctPushData']={

        strDealerName : this.strDealerName,
        datDealerFrom : orderDat,
        strDealerCode: this.strDealerCode,
        intActive : parseInt(this.intActive),
        intCreditDays :  this.intCreditDays,
        intCreditLimit :  this. intCreditLimit,
        poExpiryDays: this.poExpiryDays,
        strPanStatus: this.strPanStatus,
        strPanNo : this.strPanNo,
        strAccount : this.strAccount,
        strGroup: this.strGroup,
        fk_tax_class: this.IntTaxId,
        fk_category: this.IntCategoryId,
        strGSTStatus : this.strGSTStatus,
        strGSTIN : this.strGSTIN,
        strCSTNo: this.strCSTNo,
        strTINNo : this.strTINNo,
        lstaddress:[],
        lstcontact:[]
      }
      // this.dctData['dctPushData']['fk_tax_class']=this.IntTaxId
      // this.dctData['dctPushData']['fk_category']=this.IntCategoryId
      
      this.dctData['dctPushData']['lstaddress']= this.dctData['lstaddress'];
      this.dctData['dctPushData']['lstcontact']= this.dctData['lstcontact'];
      
  
      // console.log( this.dctData['dctPushData'],"dctPushData");
  
      this.serviceObject.postData('dealer/add_dealer/', this.dctData['dctPushData']).subscribe(
        (response) => {
            if (response.status == 1) {
  
              swal.fire({
                position: "center",
                type: "success",
                text: "Data Updated successfully",
                showConfirmButton: true,
              });
          localStorage.setItem('previousUrl','dealer/dealerlist');
             this.router.navigate(['dealer/dealerlist']);
              
            }
            else if (response.status == 0) {
              swal.fire('Error!',response['data'], 'error');
            }
        },
        (error) => {
          swal.fire('Error!','Something went wrong!!', 'error');
        });
  
      
    } 
    cancel(){
     this.strDealerName=''
     this.datDealerFrom=new Date()
     this.strDealerCode=''
     this.intActive=="1"
     this.intCreditDays=null
     this. intCreditLimit=null
     this.poExpiryDays=''
     this.strPanStatus=''
     this.strPanNo=''
     this.strAccount=''
     this.strGroup=''
     this.strTax=''
     this.strCategory=''
     this.strGSTStatus=''
     this.strGSTIN=''
     this.strCSTNo=null
     this.strTINNo=null
     this.dctData['lstaddress']=[
      {
        strAddress:'',
        strEmail:'',
        intContact:null,
        intPinCode:''
      }
    ] 
    this.dctData['lstcontact']=[
      {
        strName:'',
        strDesig:'',
        strDept:'',
        strOffice:'',
        intPhone1:null,
        intPhone2:null
      }
    ]
      
    }
}

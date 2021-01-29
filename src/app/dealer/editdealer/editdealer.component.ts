import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';


import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import { SnotifyService } from 'ng-snotify';
import * as moment from 'moment';
import deepDiff from 'return-deep-diff';

@Component({
  selector: 'app-editdealer',
  templateUrl: './editdealer.component.html',
  styleUrls: ['./editdealer.component.css']
})
export class EditdealerComponent implements OnInit {

 
  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,  public router: Router,
    private toastr: ToastrService,) { }
    // private Service: SnotifyService,
  @ViewChild('dealerCodeId', { static: true }) dealerCodeId: any;
  @ViewChild('dealerNameId', { static: true }) dealerNameId: any;
  @ViewChild('dealerFromId', { static: true }) dealerFromId: any;
  @ViewChild('creditDays', { static: true }) creditDays: any;
  @ViewChild('idpoExpiryDays', { static: true }) idpoExpiryDays: any;
  @ViewChild('creditLimit', { static: true }) creditLimit: any;
  @ViewChild('addressId') addressId: any;
  @ViewChild('contactId') contactId: any;
  @ViewChild('emailId') emailId: any;
  @ViewChild('pinCodeId') pinCodeId: any;
  @ViewChild('tinNo', { static: true }) tinNo: any;
  @ViewChild('cstNo', { static: true }) cstNo: any;
  @ViewChild('gstinNo', { static: true }) gstinNo: any;
  @ViewChild('gstinStatus', { static: true }) gstinStatus: any;
  @ViewChild('categoryId', { static: true }) categoryId: any;
  @ViewChild('taxId', { static: true }) taxId: any;
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
  strTINNo:'';
  blnStatus=false;
  dealerRowId= localStorage.getItem('dealerRowId');
  lstCategory=[]
  searchCategory: FormControl = new FormControl();
  IntCategoryId=1;
  strCategorys;
  selectedCategory;
  IntTaxId;
  strTaxs;
  selectedTax;
  registerForm: FormGroup;
  lstTax=[];
  strRemarks;
  dctDealerData ={}
  dctComparData = {}
  dctEditedData = {};
  
  ngOnInit() {
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
        intPinCode:'',
        bln_status:true

      }
    ] 
    this.dctData['lstcontact']=[
      {
        strName:'',
        strDesig:'',
        strDept:'',
        strOffice:'',
        intPhone1:null,
        intPhone2:null,
        bln_status:true
      }
    ]
    
      this.getData();
      
  }
  categoryChanged(item) {
    
    this.IntCategoryId = item.pk_bint_id;
    // this.strCategory = item.vchr_name;
    
  }
  taxChanged(item) {
    this.IntTaxId = item[0];
    this.strTax = item[1];
  }
 
  getData(){
    let dctdealer={}
    dctdealer['dealerId']=this.dealerRowId
    this.serviceObject.getData('dealer/view_dealer/?id='+ this.dealerRowId).subscribe(
      (response) => {
          if (response.status == 1)
          {
            dctdealer['data']=JSON.parse(JSON.stringify(response['lst_userdetailsview'][ this.dealerRowId]))
            this.dctDealerData['data'] = JSON.parse(JSON.stringify(response['lst_userdetailsview'][ this.dealerRowId]))
            this.strDealerName= dctdealer['data']['dealer_name']
            this.datDealerFrom= dctdealer['data']['dat_from']
            this.strDealerCode= dctdealer['data']['vchr_code']
            this.intActive=( dctdealer['data']['int_is_act_del']).toString();
            this.intCreditDays= dctdealer['data']['int_credit_days']
            this. intCreditLimit= dctdealer['data']['bint_credit_limit']
            this.poExpiryDays= dctdealer['data']['int_po_expiry_days']
            this.strPanStatus= dctdealer['data']['vchr_pan_status']
            this.strPanNo= dctdealer['data']['vchr_pan_no']
            this.strAccount= dctdealer['data']['vchr_bank_account']
            this.strGroup= dctdealer['data']['vchr_account_group']
            this.selectedTax= dctdealer['data']['vchr_taxmaster_name']
            this.IntTaxId= dctdealer['data']['int_id_taxmaster']
            this.strCategory = dctdealer['data']['vchr_category_name']
            this.selectedCategory= dctdealer['data']['vchr_category_name']
            this.IntCategoryId=dctdealer['data']['fk_category_id']

            
            this.strGSTStatus= dctdealer['data']['vchr_gstin_status']
            this.strGSTIN= dctdealer['data']['vchr_gstin']
            this.strCSTNo= dctdealer['data']['vchr_cst_no']
            this.strTINNo= dctdealer['data']['vchr_tin_no']
            this.dctData['lstaddress']=dctdealer['data']['lst_address']
            this.dctData['lstcontact']=dctdealer['data']['lst_contact']
            // this.dctData['lstaddressDelete']=[]
            // this.dctData['lstcontactDelete']=[]
            // this.dctData['lstaddressCopy']=JSON.parse(JSON.stringify(this.dctData['lstaddress']))
            // this.dctData['lstcontactCopy']=JSON.parse(JSON.stringify(this.dctData['lstcontact']))
            


            this.lstCategory=response['dealer_category']
            this.lstTax=response['tax_list']
            
            //  {
            //    strAddress:'',
            //    strEmail:'',
            //    intContact:,
            //    intPinCode:''
            //  }
          //  ] 
          this.dctData['lstaddressId']=[]
          this.dctData['lstcontactId']=[]
            //  {
              //  strName:'',
              //  strDesig:'',
              //  strDept:'',
              //  strOffice:'',
              //  intPhone1:null,
              //  intPhone2:null
            //  }
          //  ]
          }
        });
        
  }

  addAddress(){

    this.dctData['lstaddress'].push(
      {
        strAddress:'',
        strEmail:'',
        intContact:null,
        intPinCode:'',
        bln_status:true
      }
    )
    
  }

  closeAddress(index){
    // this.dctData['lstaddressCopy'][index]['bln_status']=false
    this.dctData['lstaddressId'].push(this.dctData['lstaddress'][index]['Address_id'])
    // this.dctData['lstaddressDelete'].push(this.dctData['lstaddress'][index])/
    this.dctData['lstaddress'].splice(index,1);
  }

  changeStatus(){
  this.blnStatus=true
  }

  addContact(){
    this.dctData['lstcontact'].push(
      {
        strName:'',
        strDesig:'',
        strDept:'',
        strOffice:'',
        intPhone1:null,
        intPhone2:null,
        bln_status:true
      }
    )
  }
  closeContact(index){
    // this.dctData['lstcontactCopy'][index]['bln_status']=false
    this.dctData['lstcontactId'].push(this.dctData['lstcontact'][index]['contact_id'])
    // this.dctData['lstcontactDelete'].push(this.dctData['lstcontact'][index])
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
      this.toastr.error('PO Expiry Date is required', 'Error!');
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
      if (!this.dctData['lstaddress'][item].strEmail){
        // this.emailId.nativeElement.focus();
        this.toastr.error('Email is required of'+' #'+(item+1), 'Error!');
        return false;
      } 

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

      // if (!this.dctData['lstaddress'][item].intContact){
      //   // this.contactId.nativeElement.focus();
      //   this.toastr.error('Phone No is required of'+' #'+(item+1), 'Error!');
      //   return false;
      // } 
      if(!this.dctData['lstaddress'][item]['intContact'] ){
        // validationSuccess = false ;
        this.toastr.error('Please enter valid phone number for Address'+' #'+(item+1),'Error!');
        // this.contactId.nativeElement.focus();
        return false;
      }else if(this.dctData['lstaddress'][item]['intContact'].toString().length < 10 || (this.dctData['lstaddress'][item]['intContact'].toString().length > 12)){
        // validationSuccess = false ;
        this.toastr.error('Contact number length between 10 and 12 digit for Address'+' #'+(item+1),'Error!');
        // this.contactId.nativeElement.focus();
        return false;
      }
       if (!this.dctData['lstaddress'][item].intPinCode){
        // this.pinCodeId.nativeElement.focus();
        this.toastr.error('Pin Code is required of'+' #'+(item+1), 'Error!');
        return false;
      } 

    }
   
    // contact

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
      }
      else if(this.dctData['lstcontact'][item]['intPhone2'].toString().length < 10 || (this.dctData['lstcontact'][item]['intPhone2'].toString().length > 12)){
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
        strCSTNo: this. strCSTNo,
        strTINNo : this. strTINNo,
        lstaddress:[],
        lstcontact:[],
        lstaddressId:[],
        lstcontactId:[],

        pk_bint_id:parseInt(this.dealerRowId)
      }

//     this.dctData['lstaddressDelete'].forEach(element => {
// // console.log(element,"elemnt adr");

//       this.dctData['lstaddressCopy'].push(element)
//     });
//     this.dctData['lstaddressDelete'].forEach(element => {
// // console.log(element,"elemnt cnt");
      
//       this.dctData['lstaddressCopy'].push(element)
//     });
      this.dctData['dctPushData']['lstaddress']= this.dctData['lstaddress'];
      this.dctData['dctPushData']['lstcontact']= this.dctData['lstcontact'];
      this.dctData['dctPushData']['lstaddressId']= this.dctData['lstaddressId']
      this.dctData['dctPushData']['lstcontactId']= this.dctData['lstcontactId']

      // for comparision of edited field

      this.dctComparData['bint_credit_limit']= this.dctData['dctPushData']['intCreditLimit'];
      this.dctComparData['dat_from'] = this.datDealerFrom;
      this.dctComparData['dealer_name'] = this.dctData['dctPushData']['strDealerName'];
      this.dctComparData['fk_category_id'] = this.dctData['dctPushData']['fk_category'];
      this.dctComparData['int_credit_days'] = this.dctData['dctPushData']['intCreditDays'];
      this.dctComparData['int_id_taxmaster'] = this.dctData['dctPushData']['fk_tax_class'];
      this.dctComparData['int_is_act_del'] = this.dctData['dctPushData']['intActive'];
      this.dctComparData['int_po_expiry_days'] = this.dctData['dctPushData']['poExpiryDays'];
      this.dctComparData['vchr_account_group'] = this.dctData['dctPushData']['strGroup'];
      this.dctComparData['vchr_bank_account'] = this.dctData['dctPushData']['strAccount'];
      this.dctComparData['vchr_category_name'] = this.selectedCategory;
      this.dctComparData['vchr_code'] = this.dctData['dctPushData']['strDealerCode'];
      this.dctComparData['vchr_cst_no'] = this.dctData['dctPushData']['strCSTNo'];
      this.dctComparData['vchr_gstin'] = this.dctData['dctPushData']['strGSTIN'];
      this.dctComparData['vchr_gstin_status'] = this.dctData['dctPushData']['strGSTStatus'];
      this.dctComparData['vchr_pan_no'] = this.dctData['dctPushData']['strPanNo'];
      this.dctComparData['vchr_pan_status'] = this.dctData['dctPushData']['strPanStatus'];
      this.dctComparData['vchr_taxmaster_name'] = this.selectedTax;
      this.dctComparData['vchr_tin_no'] = this.dctData['dctPushData']['strTINNo'];
      this.dctComparData['lst_address'] = this.dctData['dctPushData']['lstaddress'];
      this.dctComparData['lst_contact'] = this.dctData['dctPushData']['lstcontact'];

      this.dctData['dctPushData']['edited']=deepDiff(this.dctDealerData['data'], this.dctComparData, true);
      
     
   if(this.blnStatus){

    swal.fire({
      title: 'Update',
      input: 'text',
      text: "Are you sure want to update ?" ,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Update it!",
      inputPlaceholder: 'Enter Reason!',
      inputValidator: (text) => {
        this.strRemarks = text;
    return !text && 'You need to write something!'
   },
    }).then(result => {
      if (result.value) {

      this.dctData['dctPushData']['strRemarks'] =  this.strRemarks;
     
      
      this.serviceObject.postData('dealer/update_dealer/', this.dctData['dctPushData']).subscribe(
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
  
      
      };
    });
   }
   else{

  

  
   
    
    this.serviceObject.postData('dealer/update_dealer/', this.dctData['dctPushData']).subscribe(
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
        // this.snotifyService.error('something went wrong');

      });

   }
  
    
    } 
    cancel(){
    localStorage.setItem('previousUrl','dealer/dealerlist');
      
      this.router.navigate(['dealer/dealerlist']);  
      
    }

}

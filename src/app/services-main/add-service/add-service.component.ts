import { Component, ViewChild, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { dctProductComplaints } from './complaints';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {

  public form: FormGroup;
  @ViewChildren('nameId') nameId: any;
  @ViewChildren('contactId') contactId: any;
  @ViewChildren('addressId') addressId: any;
  @ViewChild('idItem', { static: true }) idItem: any;
  @ViewChildren('imeiId') imeiId: any;
  @ViewChild('idProduct', { static: true }) idProduct: any;

  lstEnqStatus = ['ENQUIRY','JOB','COLLECTED'];
  strEnqStatus = 'ENQUIRY';

  lstProductAllComplaints = [];
  lstComplaint = [];

  lst_assignuser = [];
  lst_assignuser_all = [];
  strassignuser='';
  intAssignuserId;
  strSelectedAssignuser = '';

  datPickup='';
  strPickupTime = '';
  strProduct='';
  intProductId;
  lst_product = [];
  lst_product_all = [];
  strSelectedProduct = '';
  
  blnItem=false;
  lst_item = [];
  strItem='';
  intItemId;
  strSelectedItem = '';

  intContactNo = null;
  vchrPinCode = '';
  strLocation = '';
  lstLocation = [];
  strAddress;
  strName;
  strEmail='';
  strLandmark = '';
  blnAddress=false;
  blnEmail=false;
  blnName=false;
  blnPinCode=false;
  dblEstimated = 0

  datpickup;

  searchLocation: FormControl = new FormControl();
  searchProduct: FormControl = new FormControl();
  searchItem: FormControl = new FormControl();
  searchAssignUser: FormControl = new FormControl();

  vchrRemarks = '';
  strServiceStatus = '';
  lstServiceStatus = [];

  complaintConfig = {
    displayKey:"name",search:true , height: '200px',customComparator: ()=>{} ,
    placeholder:'Complaints',searchOnKey: 'name',clearOnSelection: true  
  }

  constructor( private serverService: ServerService, public router: Router, private fb: FormBuilder, 
              public toastr: ToastrService, private spinner: NgxSpinnerService ) { }

  ngOnInit(): void {

    this.serverService.getData('service/update_remarks/').subscribe((response) => {
      this.lstServiceStatus = response['data'];
    })

    // location typeahead -------------------------------------------------------------
    this.searchLocation.valueChanges.subscribe((strData: string) => {
      if (strData == undefined || strData == null) {
        this.lstLocation = [];
      } else {
        let intTextLength;
        if(!(Number(strData))){
          intTextLength = 3;
        } 
        else {
          intTextLength = 6;
        }
        if (strData.length >= intTextLength) {
          this.serverService.postData('states/location_typeahead/', { term: strData }).subscribe((response) => {
            this.lstLocation = response['list_states'];
          });
        }
      }
    });

    // product typeahead ----------------------------------------------------------------
    

    // this.searchProduct.valueChanges.subscribe((strData.value: any) => {
    //   console.log("str data",strData);
      
    //   if(strData == undefined){
    //     this.lst_product = this.lst_product_all;
    //   } else {
    //     this.lst_product = this.lst_product_all.filter((res)=>{
    //       if(res['name'].toUpperCase().indexOf(strData.toUpperCase()) > -1){
    //         return true
    //       }
    //     })
    //   }
    // }); 

    // assign user typeahead ------------------------------------------------------------
    this.serverService.postData('service/assign_user_typeahead/', { term: 'EMPTY' }).subscribe((response) => {
      this.lst_assignuser_all = response['data'];
      this.lst_assignuser = response['data'];
    });

    this.searchAssignUser.valueChanges.subscribe((strData: string) => {
      if(strData == undefined){
        this.lst_assignuser = this.lst_assignuser_all
      }else{
        this.lst_assignuser = this.lst_assignuser_all.filter((res)=>{
          if(res['name'].toUpperCase().indexOf(strData.toUpperCase()) > -1){
            return true
          }
        })
      }
    })

    // item typeahead -----------------------------------------------------------------------
    this.searchItem.valueChanges.subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lst_item = [];
      } else {
        if (strData.length >= 3) {
          if( this.strProduct== ''  || this.strProduct != this.strSelectedProduct){
            this.toastr.error('Please enter Product','Error!');
            return false;
          }
          else{
            this.serverService.postData('service/item_typeahead/', { term: strData ,intProductId:this.intProductId})
            .subscribe((response) => {
              this.lst_item = response['data'];
            });
          }
        }
      }
    });

  }

  locationChanged(item){
    this.vchrPinCode = item.vchr_pin_code;
  }

  ProductNgModelChange(){
    // console.log("ngmodel",this.strSelectedProduct);
    let data = this.strSelectedProduct
    if (this.strSelectedProduct.length >2){

      this.serverService.postData('service/product_typeahead/', { term: data }).subscribe((response) => {
        this.lst_product_all = response['data'];
        this.lst_product = response['data'];
      });
      
    }
  }
    
  productChanged(item){

    console.log("before product",item);
    // console.log("before ng model",this.strSelectedProduct);
    // console.log("item.name",typeof item.name);
    
    
    this.intProductId = item.id;
    this.strProduct = item.name;
    
    console.log("after product",this.strProduct.toUpperCase( ));
    // console.log("after ng model",this.strSelectedProduct);
    
    let temData = this.strProduct.toUpperCase( )
    
    if(dctProductComplaints[temData]){

      this.lstProductAllComplaints = dctProductComplaints[temData]
    }else{
      this.lstProductAllComplaints = dctProductComplaints['OTHER'];
    }
    this.lstComplaint = [];
  }

  assignUserChanged(item){
    this.intAssignuserId = item.id;
    this.strassignuser= item.name;
  }

  itemChanged(item){
    this.intItemId = item.id;
    this.strItem = item.name;
  }

  saveService(){
    
    let pushed_data ={}
    let validationSuccess = true;
    this.datPickup = moment(this.datPickup).format('YYYY-MM-DD')

    let regExpMail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(this.dblEstimated == 0 || this.dblEstimated == null || this.dblEstimated == undefined){
      validationSuccess =false
      this.toastr.error('Please enter estimated amount','Error!');
    }
    if(this.intContactNo == '' || this.intContactNo == null || this.intContactNo.toString().length!=10){
      validationSuccess =false
      this.toastr.error('Please enter Valid Customer Number','Error!');
      return false;
    }
    if(this.strName == '' || this.strName == null){
      validationSuccess =false
      this.toastr.error('Please enter Customer Name','Error!');
      return false;
    }
    if( this.strEmail != '' && this.strEmail != null && !regExpMail.test(this.strEmail) ){
      validationSuccess = false
      this.toastr.error('Please enter Valid EmailId','Error!');
      return false;
    }
    if(this.vchrPinCode == ''){
      validationSuccess =false
      this.toastr.error('Please enter Pin Code','Error!');
      return false;
    }
    if(this.strAddress == '' || this.strAddress == null){
      validationSuccess = false
      this.toastr.error('Please enter Address','Error!');
      return false;
    }
    if( this.strProduct== ''  || this.strProduct != this.strSelectedProduct){
      validationSuccess =false
      this.toastr.error('Please enter Product','Error!');
      return false;
    }
    if(this.strItem== '' || this.strItem != this.strSelectedItem){
      validationSuccess =false
      this.toastr.error('Please enter Item','Error!');
      return false;
    }

    if(this.strEnqStatus == 'JOB'){
      if( this.strassignuser == ''  || this.strassignuser != this.strSelectedAssignuser){
        validationSuccess =false
        this.toastr.error('Please enter Assign To','Error!');
        return false;
      }
      if(this.datPickup == 'Invalid date'){
        validationSuccess =false
        this.toastr.error('Please enter Date Of Pickup','Error!');
        return false;
      }
      if(this.strPickupTime == '' || this.strPickupTime == null){
        validationSuccess =false
        this.toastr.error('Please enter Pickup Time','Error!');
        return false;
      }
    }
    
    if(this.lstComplaint.length<1){
      validationSuccess =false
      this.toastr.error('Please enter Complaints','Error!');
      return false;
    }

    if(this.strServiceStatus == ''){
      validationSuccess =false
      this.toastr.error('Please select service status','Error!');
      return false;
    }

    if(this.strLandmark == '' || this.strLandmark == null){
      validationSuccess =false
      this.toastr.error('Please enter landmark','Error!');
      return false;
    }

    if(validationSuccess){

      pushed_data['intContactNo'] = this.intContactNo;
      pushed_data['strName'] = this.strName;
      pushed_data['strAddress'] = this.strAddress;
      pushed_data['strEmail'] = this.strEmail;
      pushed_data['intPinCode'] = this.vchrPinCode;
      pushed_data['intProductId'] = this.intProductId;
      pushed_data['intItemId'] = this.intItemId;
      pushed_data['strEnqStatus'] = this.strEnqStatus;
      pushed_data['intAssignuserId'] = this.intAssignuserId;
      pushed_data['datPickup'] = this.datPickup;
      pushed_data['strPickupTime'] = this.strPickupTime;
      pushed_data['lstComplaint'] = this.lstComplaint;
      pushed_data['strLandmark'] = this.strLandmark;
      pushed_data['vchrRemarks'] = this.vchrRemarks;
      pushed_data['dblEstimatedAmount'] = this.dblEstimated;
      pushed_data['strServiceStatus'] = this.strServiceStatus;

      
      // saving data
      this.proceedSaveService(pushed_data);

    }

  }

  proceedSaveService(pushed_data){

    let message = "Are you sure want to continue ?"
    Swal.fire({  //Confirmation before save
      title: 'Save',
      text: message,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Save it!",
    }).then(result => {
      if (result.value) {
        this.serverService.postData('service/add_service/',pushed_data).subscribe(res => {
          if (res.status == 1) {
            Swal.fire({
              position: "center",
              type: "success",
              text: "Request Submitted Successfully",
              showConfirmButton: true,
            });
            // this.intApprove = res['int_approve'];
            this.router.navigate(['/service-main/list-service']);
          }
          else if (res.status == 0) {
            Swal.fire('Error!', res['reason'], 'error');
          }
        },
          (error) => {
            Swal.fire('Error!', 'Server Error!!', 'error');
          });
      };
    });
  }


  focusOutcustomerno(){
    
    let pushed_data ={}
    pushed_data['intContactNo']=this.intContactNo 
    if (this.intContactNo != null){
      if (this.intContactNo.toString().length >= 10){
        this.spinner.show()
        this.serverService.putData('service/add_service/',pushed_data).subscribe((response) => {
          this.spinner.hide()
          const result = response;
          if (result['status'] == 1) {
            this.strName = result['data']['name']
            this.strAddress = result['data']['txt_address']
            this.strLandmark = result['data']['cust_landmark']
            this.strEmail = result['data']['vchr_email']
            this.vchrPinCode = result['data']['fk_location__vchr_pin_code']
            this.strLocation = result['data']['fk_location__vchr_name']+' - '+result['data']['fk_location__vchr_pin_code']
            this.blnAddress=true
            this.blnEmail=true
            this.blnName=true
            this.blnPinCode=true
          } else{
            this.strName = '';
            this.strAddress = '';
            this.strLandmark = '';
            this.strEmail = '';
            this.vchrPinCode = '';

            this.blnAddress=false
            this.blnEmail=false
            this.blnName=false
            this.blnPinCode=false
          }
        },(error) => { 
          this.spinner.hide()
          if(error.status == 401){
            this.toastr.error('Error','Error!'); 
          } 
        });
      }else{
        this.blnAddress=false
        this.blnEmail=false
        this.blnName=false
        this.blnPinCode=false
      }
    }
  }

  clearData(){
    this.strName = '';
    this.intContactNo = null;
    this.strAddress = '';
    this.datPickup = '';
    this.strPickupTime = '';
    this.strProduct = '';
    this.vchrPinCode = '';
    this.strEmail = '';
    this.lstComplaint = [];
    this.lst_assignuser = [];
    this.strassignuser = '';
    this.intAssignuserId = null;
    this.strSelectedAssignuser = '';
    this.strProduct = '';
    this.intProductId;
    this.lst_product = [];
    this.strSelectedProduct = '';
    this.lst_item = [];
    this.strItem = '';
    this.intItemId = null;
    this.strSelectedItem = '';
    this.blnAddress = false;
    this.blnEmail = false;
    this.blnName = false;
    this.blnPinCode = false;
    this.vchrRemarks = '';
  }
}

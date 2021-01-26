
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';

const mail = new FormControl('');
const dupmail = new FormControl('', CustomValidators.equalTo(mail));
const mob = new FormControl('');
const dupmobile = new FormControl('', CustomValidators.equalTo(mob));


@Component({
  selector: 'app-editcustomer',
  templateUrl: './editcustomer.component.html',
  styleUrls: ['./editcustomer.component.css']
})
export class EditcustomerComponent implements OnInit {

  searchMobile: FormControl = new FormControl(null, [Validators.required]);
  searchLocation: FormControl = new FormControl();
  searchState: FormControl = new FormControl();

  @ViewChild('firstName') firstName: any;
  @ViewChild('lastName') lastName: any;
  @ViewChild('mobNo') mobNo: any;
  @ViewChild('emailId') emailId: any;
  @ViewChild('location') location: any;
  @ViewChild('state') state: any;
  @ViewChild('gstno') gstno: any;
  @ViewChild('address') address: any;


  mobileNumber;
  lstMobileNumbers=[];

  lstLocation=[];
  lstState=[];

  occasionArray=[];

  showData=false;

  validationStatus=true;

  dctCustomer={};
 
  public form: FormGroup;

  constructor(
    private serviceObject:ServerService,
    private fb: FormBuilder,
    private toastr: ToastrService,

    ) { }

  ngOnInit() {

    this.searchMobile.valueChanges.pipe(debounceTime(100)).subscribe(
      data=>{
      if (data === undefined || data === null) {
      } else {
    
        if (data.length >=7) {
          this.lstMobileNumbers = [];
          this.typeaheadMobile(data);       
        } else{
          this.lstMobileNumbers = [];
        }
      }
    });



    this.searchLocation.valueChanges.pipe(
    debounceTime(400))
    .subscribe((data: string) => {
      
      if (!data) {
      } else {
        if (data.length > 2) {
          this.lstLocation = [];
          this.typeaheadLocation(data);
            
        } else{
          this.lstLocation = [];
        }
      }
    });


    this.searchState.valueChanges.pipe(
    debounceTime(400))
    .subscribe((data: string) => {
      
      if (!data) {
      } else {
        if (data.length > 2) {
          this.lstState = [];
          this.typeaheadState(data);
            
        } else{
          this.lstState = [];
        }
      }
    });
  }

  typeaheadMobile(data){
    
    this.serviceObject.postData('customer/customerTypeahead/',{term:data}).subscribe(
      (response) => {
        this.lstMobileNumbers.push(...response['data']);
      },
      (error) => {   
        Swal.fire('Error!',error, 'error');
        
      });
  }

  typeaheadLocation(data){

    this.serviceObject.postData('states/location_typeahead/',{term:data}).subscribe(
      (response) => {
        this.lstLocation.push(...response['list_states']);
      },
      (error) => {   
        Swal.fire('Error!',error, 'error');
        
      });
  }

  typeaheadState(data){

    this.serviceObject.postData('states/states_typeahead/',{term:data}).subscribe(
      (response) => {
        this.lstState.push(...response['list_states']);
      },
      (error) => {   
        Swal.fire('Error!',error, 'error');
        
      });
  }

  locationChanged(item){
    this.dctCustomer['location_id']=item.pk_bint_id;
  }

  stateChanged(item){
    this.dctCustomer['state_id']=item.pk_bint_id;
  }

  clearData(){

    if(this.mobileNumber==null){
      this.showData=false;
      return;
    }
  }

  searchCustomer(item){

    let dctMobile={};
    dctMobile['customerId']=item.id;
    this.serviceObject.postData('customer/customer_view/',dctMobile).subscribe(
      (response) => {

        if(response['status']==1){

          this.dctCustomer=response['dct_customer'];
          this.showData=true;
        }
        else{
          this.showData=false;
          Swal.fire('Error!',response['message']);
        }
      },
      (error) => {   
        this.showData=false;
        Swal.fire('Error!',error, 'error');
      }
    );

  }

  clearCustomerdata(){
    this.showData=false;
    this.mobileNumber=null;
  }

  validateCustomer(){

    if (!this.dctCustomer['first_name']) {
      this.firstName.nativeElement.focus();
      this.toastr.error('First Name is required', 'Error!');
      this.validationStatus=false;
      return false;
    } 
    // if (!this.dctCustomer['last_name']) {
    //   this.lastName.nativeElement.focus();
    //   this.toastr.error('Last Name is required', 'Error!');
    //   this.validationStatus=false;
    //   return false;
    // } 
    if (!this.dctCustomer['mob_no']) {
      this.mobNo.nativeElement.focus();
      this.toastr.error('Mobile number is required', 'Error!');
      this.validationStatus=false;
      return false;
    } 
    if ((this.dctCustomer['mob_no']).toString().length!=10) {
      this.mobNo.nativeElement.focus();
      this.toastr.error('Enter valid mobile number', 'Error!');
      this.validationStatus=false;
      return false;
    } 
    // if (!this.dctCustomer['str_email']) {
    //   this.emailId.nativeElement.focus();
    //   this.toastr.error('Email Id is required', 'Error!');
    //   this.validationStatus=false;
    //   return false;
    // } 
    if (this.dctCustomer['str_email']) {
      if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(this.dctCustomer['str_email']))){
        this.validationStatus = false;
        this.toastr.error('Enter valid email id', 'Error!');
        return false;
      }
    }
    if (!this.dctCustomer['location']) {
      this.location.nativeElement.focus();
      this.toastr.error('City is required', 'Error!');
      this.validationStatus=false;
      return false;
    } 
    if (!this.dctCustomer['state']) {
      this.state.nativeElement.focus();
      this.toastr.error('State is required', 'Error!');
      this.validationStatus=false;
      return false;
    } 
    if (this.dctCustomer['gst_no'] && (this.dctCustomer['gst_no']).toString().length!=15) {
      this.toastr.error('Enter Valid GST No.', 'Error!');
      this.validationStatus=false;
      return false
    }
    if (this.dctCustomer['gst_no'] && !(/^[0-9]{2}/).test(this.dctCustomer['gst_no'])) {
      this.toastr.error('First two digits of GST No. should be number', 'Error!');
      this.validationStatus=false;
      return false
    }
   
    // if (!this.dctCustomer['gst_no']) {
    //   this.gstno.nativeElement.focus();
    //   this.toastr.error('GST No. is required', 'Error!');
    //   this.validationStatus=false;
    //   return false;
    // } 
    // if (!this.dctCustomer['txt_address']) {
    //   this.address.nativeElement.focus();
    //   this.toastr.error('Address is required', 'Error!');
    //   this.validationStatus=false;
    //   return false;
    // } 
  

  }

  updateCustomerData(){

    this.validationStatus=true;
    this.validateCustomer();
    if(!this.validationStatus){
      return;
    }
    
    this.dctCustomer['old_mobno']=this.mobileNumber;

    this.serviceObject.postData('customer/customer_update/',this.dctCustomer).subscribe(
      (response) => {

        if(response['status']==1){

          Swal.fire({
            position: "center",
            type: "success",
            text: "Data updated successfully",
            showConfirmButton: true,
          });
          this.clearCustomerdata();
        }
        else{
          Swal.fire('Error!',response['message']);
        }
      },
      (error) => {   
        Swal.fire('Error!',error, 'error');
      }
    );

    
  }


}

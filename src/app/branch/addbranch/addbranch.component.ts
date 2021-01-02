import { Component, ViewChild,OnInit,ElementRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
// import { viewAttached } from '@angular/core/src/render3/instructions';
// import { DeprecatedDatePipe } from '@angular/common';




@Component({
  selector: 'app-addbranch',
  templateUrl: './addbranch.component.html',
  styleUrls: ['./addbranch.component.css']
})
export class AddbranchComponent implements OnInit {


  type='1';
  strCode : '';
  strBranch : '';
  strAddress : '';
  strEmail : '';
  intContact;
  intPincode;
  intMygCareNo;
  strState : '';
  strBranchCategory: '';
  strHierarchy: '';
  strBranchCloseDate: '';
  intStockLimit;
  intStaticIp;
  fltSize;
  intlocationLattitude;
  intlocationLongitude;
  datIngtn;
  intIngtnTime;
  strIngtedBy;
  lstBranches;
  IntCategoryId;
  intHierarchyId;
  strCategory = '';
  lstCategory=[];
  lstStates=[];
  lstHierarchy=[];
  intStateId;
  intStockRqstQty;
  intStockRqstAmt;
  intPriceTemplate:number =null;



  searchState:FormControl= new FormControl();

  form: FormGroup;
  registerForm: FormGroup;


  @ViewChild('branchCode', { static: true }) branchCode: any;
  @ViewChild('contactId', { static: true }) contactId: any;
  @ViewChild('pincode') pincode: any;
  @ViewChild('mygcarenoId', { static: true }) mygcarenoId: any;
  @ViewChild('emailId', { static: true }) emailId: any;
  @ViewChild('branchName', { static: true }) branchName: any;
  @ViewChild('address', { static: true }) address: any;
  @ViewChild('branchState', { static: true }) branchState: any;
  @ViewChild('branchCategory', { static: true }) branchCategory: any;
  @ViewChild('branchStockLimit', { static: true }) branchStockLimit: any;
  @ViewChild('branchStaticIp', { static: true }) branchStaticIp:any;
  @ViewChild('branchSize', { static: true }) branchSize:any;
  @ViewChild('locationLattitude', { static: true }) locationLattitude:any;
  @ViewChild('locationLongitude', { static: true }) locationLongitude:any;
  @ViewChild('inaugurationDate', { static: true }) inaugurationDate:any;
  @ViewChild('idPriceTemplate', { static: true }) idPriceTemplate:any;
  @ViewChild('stockRqstQuantity', { static: true }) stockRqstQuantity:any;
  @ViewChild('stockRqstAmount', { static: true }) stockRqstAmount:any;
  @ViewChild('hierarchyCategory', { static: true }) hierarchyCategory: any;

  constructor(
    private serviceObject: ServerService,
    private formBuilder: FormBuilder,
    public router: Router,
    private toastr: ToastrService,) { }

  ngOnInit() {


    this.registerForm = this.formBuilder.group({
      branchCode: ['', Validators.required],
      branch: ['', Validators.required],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      mygcareno: [''],
      branchState: ['',Validators.required],
      branchCategory: ['', Validators.required],
      // hierarchyCategory: ['', Validators.required],
      branchStockLimit: ['',Validators.required],
      BranchCloseDate: ['',Validators.required],
      branchStaticIp: ['', Validators.required],
      branchSize: ['', Validators.required],
      locationLattitude: ['', Validators.required],
      locationLongitude: ['',Validators.required],
      inaugurationDate: ['',Validators.required],
      inaugurationTime: [''],
      inauguratedBy: [''],
      pricetemplate:['',Validators.required],
      stockRqstQuantity:['',Validators.required],
      stockRqstAmount:['',Validators.required],
      pincode :['',[Validators.required,Validators.minLength(6)]],



      
      });
      //--------------------branch category list dropdown ----------------//
      this.serviceObject
      .getData('branch/branch_category_list/')
      .subscribe(
        (response) => {
          this.lstCategory = response['data'];

        }
      );
      //--------------------branch category list dropdown ends ----------------//

      //--------------------states list dropdown ----------------//
      this.serviceObject
      .getData('states/states_typeahead/')
      .subscribe(
        (response) => {
          this.lstStates = response['list_states'];

        }
      );
      //--------------------states list dropdown ends----------------//
      //--------------------hierarchy list dropdown ----------------//
      this.serviceObject
      .getData('hierarchy/hierarchy?hierarchy_name=BRANCH')
      .subscribe(
        (response) => {
          this.lstHierarchy = response['data'];

        }
      );
      //--------------------hierarchy list dropdown ends----------------//


    }

  BranchCategoryChanged(category) {
    this.IntCategoryId = category.id;
    this.strCategory = category.name;
  }
  HierarchyChanged(hierarchy) {
    
    this.intHierarchyId = hierarchy.pk_bint_id;
    this.strCategory = hierarchy.name;
  }

  AddBranch(){
    
    // this.intHierarchyId;
    
    if(!this.strCode){
      this.branchCode.nativeElement.focus();
      this.toastr.error('Branch Code is required', 'Error!');

    }
    else if(!this.strBranch){
      this.branchName.nativeElement.focus();
      this.toastr.error('Branch Name is required', 'Error!');

    }
    else if (!this.strBranchCategory){
      // this.branchCategory.nativeElement.focus();
      this.toastr.error('Branch Category Required', 'Error!');
      return false;
    }
    else if (!this.intHierarchyId){
      // this.branchCategory.nativeElement.focus();
      this.toastr.error('Hierarchy Required', 'Error!');
      return false;
    }
    else if(this.intPriceTemplate == null){
      // this.idPriceTemplate.nativeElement.focus();
      this.toastr.error('Price Template is required', 'Error!');
      return false;
    }

    else if(!this.strState){
      // this.branchState.nativeElement.focus();
      this.toastr.error('State is required', 'Error!');
      return false;

    }
    else if (!this.strEmail){
      this.emailId.nativeElement.focus();
      this.toastr.error('Email is required', 'Error!');
      return false;
    }
    else if (!this.intContact){
      this.contactId.nativeElement.focus();
      this.toastr.error('Contact No required', 'Error!');
      return false;
    }
    else if (+(this.intContact) < 1000000000 || +(this.intContact) > 1000000000000) {
      this.toastr.error(' Invalid Contact number ', 'Error!');
      return false;
    }
    else if (!this.intPincode){
      this.intPincode.nativeElement.focus();
      this.toastr.error('Pincode required', 'Error!');
      return false;
    }
    else if (+(this.intPincode) >= 1000000 || +(this.intPincode) <=99999 ) {
      this.toastr.error(' Invalid Pincode', 'Error!');
      return false;
    }
    else if (!this.intStockLimit){
      this.branchStockLimit.nativeElement.focus();
      this.toastr.error('Branch Stock Limit is required', 'Error!');
      return false;
    }
    else if(!this.datIngtn){
      this.inaugurationDate.nativeElement.focus();
      this.toastr.error('Branch Inauguration is required', 'Error!');
      return false;
    }
    else if(!this.intlocationLattitude){
      this.locationLattitude.nativeElement.focus();
      this.toastr.error('Location Latitude is required', 'Error!');
      return false;
    }
    else if(!this.intlocationLongitude){
      this.locationLongitude.nativeElement.focus();
      this.toastr.error('Location Longitude is required', 'Error!');
      return false;
    }
     else if(!this.fltSize){
      this.branchSize.nativeElement.focus();
      this.toastr.error('Branch size is required', 'Error!');
      return false;
    }
    else if(!this.intStaticIp){
      this.branchStaticIp.nativeElement.focus();
      this.toastr.error('Static IP is required', 'Error!');
      return false;
    }


    else if(!this.intStockRqstQty){
      this.stockRqstQuantity.nativeElement.focus();
      this.toastr.error('Stock Request Quantity is required','Error!');
      return false;
    }
    else if(!this.intStockRqstAmt){
      this.stockRqstAmount.nativeElement.focus();
      this.toastr.error('Stock Request Amount is required','Error!');
      return false;
    }
    // else if (!this.strAddress){
    //   this.address.nativeElement.focus();
    //   this.toastr.error('Address is required', 'Error!');
    //   return false;
    // }


    else{

      const form_data = new FormData;

      if (this.intContact) {
        if (+(this.intContact) > 1000000000 && +(this.intContact) < 1000000000000) {
          form_data.append('vchr_phone', String(this.intContact).trim());
        }
        else {
          this.contactId.nativeElement.focus();
          this.toastr.error('Contact No is invalid', 'Error!');
          return false;
        }
      }
      if (this.strEmail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(this.strEmail)) {
          form_data.append('vchr_mail', String(this.strEmail).trim());
          } else {
            this.emailId.nativeElement.focus();
            this.toastr.error('Email is invalid', 'Error!');
            return false;
          }
      }

      let dctData={}
      dctData['intType']=this.type;
      dctData['strName']= this.strBranch
      dctData['strCode']= this.strCode
      dctData['strAddress']= this.strAddress
      dctData['intContact']= this.intContact
      dctData['intPincode']= this.intPincode
      dctData['intMygCareNo']= this.intMygCareNo
      dctData['strEmail']= this.strEmail;
      dctData['intCategory'] = this.IntCategoryId;
      dctData['intHierarchy'] = this.intHierarchyId;

      dctData['stateId']=this.intStateId
      // dctData['strCloseDate'] =this.strBranchCloseDate;
      dctData['strStockLimit']= this.intStockLimit;
      dctData['intStaticIp']=this.intStaticIp;
      dctData['fltSize']=this.fltSize;
      dctData['intLatitude']=this.intlocationLattitude;
      dctData['intLongitude']=this.intlocationLongitude;
      dctData['datInagtnDate']= moment(this.datIngtn).format('YYYY-MM-DD')
      dctData['intInagtnTime']=this.intIngtnTime;
      dctData['strIngtnBy']=this.strIngtedBy;
      dctData['intPriceTemplate']=this.intPriceTemplate;
      dctData['intStockRqstQty']=this.intStockRqstQty;
      dctData['intStockRqstAmt']=this.intStockRqstAmt;
      dctData['intHierarchy']=this.intHierarchyId;

      this.serviceObject.postData('branch/branchapi/', dctData).subscribe(
        (response) => {
            if (response.status == 1) {
              swal.fire({
                position: "center",
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,
              });
              localStorage.setItem('previousUrl','branch/branchlist');
              this.router.navigate(['branch/branchlist']);


            }
            else if (response.status == 0) {
              swal.fire('Error!', response['message'], 'error');

              // this.toastr.error(response['message']);
            }
        },
        (error) => {
          swal.fire('Error!','Something went wrong!!', 'error');


        });
    }
  }
  stateChanged(item){
    this.intStateId=item.pk_bint_id;
    this.strState=item.vchr_name;
  }
  cancel(){
    // this.form.reset();
    this.strCode = '';
    this.strBranch = '';
    this.strAddress = '';
    this.intMygCareNo = null;
    this.strEmail = '';
    this.intContact=null;
    this.intPincode=null;
    this.strState='';
    this.intPriceTemplate = null;
    this.intStockLimit=null;
    this.datIngtn=null;
    this.intIngtnTime=null;
    this.strIngtedBy='';
    this.intlocationLattitude=null;
    this.intlocationLongitude=null;
    this.fltSize=null;
    this.intStaticIp=null;
    




  }
}

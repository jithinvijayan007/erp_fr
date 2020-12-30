// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-editbranch',
  templateUrl: './editbranch.component.html',
  styleUrls: ['./editbranch.component.css']
})
export class EditbranchComponent implements OnInit {

  constructor(
    private serviceObject: ServerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    ) {
     }
  branchId;


  type='1';
  strCode : '';
  strBranch : '';
  strAddress : '';
  strEmail : '';
  intContact;
  intMygCareNo;
  strBranchCategory: '';
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
  strCategory = '';
  lstCategory=[];
  dctcategory={};
  activeStatus='0';
  pk_bint_id ;
  activestatuscheck;
  strState='';
  intStateId;
  lstStates;
  intStockRqstQty;
  intStockRqstAmt;
  intPriceTemplate:number =null;



  form: FormGroup;
  registerForm: FormGroup;


  @ViewChild('branchCode', { static: true }) branchCode: any;
  @ViewChild('contactId', { static: true }) contactId: any;
  @ViewChild('mygcarenoId', { static: true }) mygcarenoId: any;
  @ViewChild('emailId', { static: true }) emailId: any;
  @ViewChild('branchName', { static: true }) branchName: any;
  @ViewChild('address', { static: true }) address: any;
  @ViewChild('branchState', { static: true }) branchState: any;
  @ViewChild('branchStockLimit', { static: true }) branchStockLimit: any;
  @ViewChild('branchStaticIp', { static: true }) branchStaticIp: any;
  @ViewChild('branchSize', { static: true }) branchSize:any;
  @ViewChild('locationLattitude', { static: true }) locationLattitude: any;
  @ViewChild('locationLongitude', { static: true }) locationLongitude: any;
  @ViewChild('branchCategory', { static: true }) branchCategory: any;
  @ViewChild('inaugurationDate', { static: true }) inaugurationDate: any;
  @ViewChild('idPriceTemplate', { static: true }) idPriceTemplate:any;
  @ViewChild('stockRqstQuantity', { static: true }) stockRqstQuantity:any;
  @ViewChild('stockRqstAmount', { static: true }) stockRqstAmount:any;

  ngOnInit() {
    this.branchId = localStorage.getItem('branchId')
    this.getData();


    this.registerForm = this.formBuilder.group({
      branchCode: ['', Validators.required],
      branch: ['', Validators.required],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      mygcareno: [''],
      branchState: ['',Validators.required],
      branchCategory: ['', Validators.required],
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
      stockRqstAmount:['',Validators.required]
      });

      this.serviceObject
      .getData('branch/branch_category_list/')
      .subscribe(
        (response) => {
          this.lstCategory = response['data'];

        }
      );
      //states
      this.serviceObject
      .getData('states/states_typehead/')
      .subscribe(
        (response) => {
          this.lstStates = response['list_states'];

        }
      );

  }
  BranchCategoryChanged(category) {
    this.IntCategoryId = category.id;
    this.strCategory = category.name;
  }

  getData(){

    this.serviceObject.getData('branch/branchapi/?branchId='+this.branchId).subscribe(
      (response) => {
          if (response.status == 1) {

            this.dctcategory = response['lst_branch'];
                this.type= this.dctcategory['int_type'].toString();
                this.strCode = this.dctcategory['vchr_code'];
                this.strBranch = this.dctcategory['vchr_name'];
                this.intMygCareNo = this.dctcategory['vchr_mygcare_no'];
                   
                this.strEmail = this.dctcategory['vchr_email'];
                this.intContact= this.dctcategory['vchr_phone'];
                this.strBranchCategory= this.dctcategory['fk_category__vchr_name'];
                this.intStockLimit= this.dctcategory['bint_stock_limit'];
                this.intStaticIp= this.dctcategory['vchr_ip'];
                this.fltSize= this.dctcategory['flt_size'];
                this.intlocationLattitude= this.dctcategory['flt_latitude'];
                this.intlocationLongitude= this.dctcategory['flt_longitude'];
                this.datIngtn= this.dctcategory['dat_inauguration'];
                this.intIngtnTime= this.dctcategory['tim_inauguration'];
                this.strIngtedBy= this.dctcategory['vchr_inaugurated_by'];
                this.IntCategoryId= this.dctcategory['fk_category_id'];
                this.activeStatus = this.dctcategory['int_status'].toString();
                this.activestatuscheck=this.dctcategory['int_status'].toString();
                this.pk_bint_id = this.dctcategory['pk_bint_id'];
                this.strState=this.dctcategory['fk_states_id__vchr_name'];
                this.intStateId = this.dctcategory['fk_states_id'];
                this.intPriceTemplate = this.dctcategory['int_price_template'];
                this.intStockRqstQty = this.dctcategory['int_stock_request_qty'];
                this.intStockRqstAmt = this.dctcategory['dbl_stock_request_amount'];
                this.strAddress= this.dctcategory['vchr_address'];
          }
          else if (response.status == 0) {

          }
      },
      (error) => {
        swal.fire('Error!','error', 'error');

      });
  }
  cancel(){
    localStorage.setItem('previousUrl','branch/branchlist');
    this.router.navigate(['branch/branchlist']);

  }


  AddBranch(){
    
    if(!this.strBranch){
      this.branchName.nativeElement.focus();
      this.toastr.error('Branch Name is required', 'Error!');
      return false;
    }
    else if(!this.strCode){
      this.branchCode.nativeElement.focus();
      this.toastr.error('Branch Code is required', 'Error!');
      return false;
    }
    else if(!this.strState){
      this.branchState.nativeElement.focus();
      this.toastr.error('State is required', 'Error!');
      return false;

    }
    else if(this.intPriceTemplate==null){
      // this.idPriceTemplate.nativeElement.focused =true;
      this.toastr.error('Price Template is required', 'Error!');
      return false;
    }
    else if (!this.strEmail){
      this.emailId.nativeElement.focus();
      this.toastr.error('Email is required', 'Error!');
      return false;
    }
    else if (this.strEmail) {
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(this.strEmail))) {
        this.emailId.nativeElement.focus();
        this.toastr.error('Email is invalid', 'Error!');
        return false;
        }
    }
    if (!this.intContact){
      this.contactId.nativeElement.focus();
      this.toastr.error('Contact No required', 'Error!');
      return false;
    }
    else if (this.intContact) {
      
      if (!(+(this.intContact) > 1000000000 && +(this.intContact) < 1000000000000)) {

        this.contactId.nativeElement.focus();
        this.toastr.error('Contact No is invalid', 'Error!');
        return false;
      }
    }
    
   if (!this.strBranchCategory){
      // this.branchCategory.nativeElement.focus();
      this.toastr.error('Branch Category Required', 'Error!');
      return false;
    }
    else if (this.intStockLimit=="" || this.intStockLimit==null){
      this.branchStockLimit.nativeElement.focus();
      this.toastr.error('Branch Stock Limit is required', 'Error!');
      return false;
    } else if(!this.fltSize){
      this.branchSize.nativeElement.focus();
      this.toastr.error('Branch size is required', 'Error!');
      return false;
    }
    else if(!this.intStaticIp){
      this.branchStaticIp.nativeElement.focus();
      this.toastr.error('Static IP is required', 'Error!');
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
        if (+(this.intContact) > 1000000000 && +(this.intContact) < 10000000000) {
          form_data.append('vchr_phone', String(this.intContact).trim());
        }
        else {
          this.contactId.nativeElement.focus();
          this.toastr.error('Conatct No is invalid', 'Error!');
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
      dctData['intMygCareNo']= this.intMygCareNo
      dctData['strEmail']= this.strEmail;
      dctData['intCategory'] = this.IntCategoryId;
      // dctData['strCloseDate'] =this.strBranchCloseDate;
      dctData['strStockLimit']= this.intStockLimit;
      dctData['intStaticIp']=this.intStaticIp;
      dctData['fltSize']=this.fltSize;
      dctData['intLatitude']=this.intlocationLattitude;
      dctData['intLongitude']=this.intlocationLongitude;
      dctData['datInagtnDate']= moment(this.datIngtn).format('YYYY-MM-DD')
      dctData['intInagtnTime']=this.intIngtnTime;
      dctData['strIngtnBy']=this.strIngtedBy;
      dctData['branchId']=this.pk_bint_id;
      dctData['stateId']=this.intStateId;
      dctData['intPriceTemplate']=this.intPriceTemplate;
      dctData['intStockRqstQty']=this.intStockRqstQty;
      dctData['intStockRqstAmt']=this.intStockRqstAmt;
      if(this.activeStatus != this.activestatuscheck){
        dctData['int_status'] = this.activeStatus
      }



      this.serviceObject.putData('branch/branchapi/', dctData).subscribe(
        (response) => {
            if (response.status == 1) {
              swal.fire({
                position: "center",
                type: "success",
                text: "Data Updated successfully",
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
          swal.fire('Error!','error', 'error');

        });

    }






  }
  stateChanged(item){
    this.intStateId=item.pk_bint_id;
    this.strState=item.vchr_name;
  }
}

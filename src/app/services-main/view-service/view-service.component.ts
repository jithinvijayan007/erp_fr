import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {

  public form: FormGroup;
  @ViewChild('commentDiv', { static: true }) public commentDiv : ElementRef;

  strJobId = '';
  strAction = '';
  blnShowCustFullDetails = false;

  dctCustomerData = {};
  dctServiceData = {};

  strHostAddress = '';
  strNodeAddress = '';

  strUserGroup = '';

  // followup variables
  lst_assignuser = [];
  lst_assignuser_all = [];
  strassignuser='';
  intAssignuserId;
  strSelectedAssignuser = '';
  datPickup='';
  strPickupTime = '';
  searchAssignUser: FormControl = new FormControl();

  // servicing variables
  blnServiced = false;
  blnNotServiced = false;
  blnSparePart = false;
  lstSpare = [];
  strSelectedItem = '';
  dblSpareAmt = 0;

  intTotalAmount = 0;
  intServiceAmt = 0;
  intServiceCharge = 0;
  intSpareTotal = 0;
  intGrandTotal = 0;
  strImei = '';
  strRemarks = '';
  qcRemarks = '';
  strColourRequired = "";
  objectKeys;
  
  // Assign variables
  blnSpareRequest = false;
  blnShowAssign = false
  selectedSerEngineer = '';
  serviceEngineerId = '';
  lstSerEngineerAll = [];
  lstSerEngineer = [];
  showModalJobAssign: any;
  searchServiceEngineer: FormControl = new FormControl();

  // invoice variables
  strPaymentMethod = 'CASH'
  dblTaxPercent = 0.0
  dblDiscount = 0;
  blnInvoiceReadOnly = false;
  dblBalanceAmount = 0;

  // acknowledge
  blnAcknowledge = false;
  blnJobAccept = false;
  textAccept = 'Accept Job'
  // service details edit variables
  blnEdit = false;

  blnObsEdit = false;
  lstObservations = [];

  blnCompEdit = false;
  lstOldComplaints : any;
  lstComplaints = [];
  lstComplaintsAll = [];

  blnAccEdit = false;
  lstOldAccessories : any;
  lstAccessories = [];
  lstAccessoriesAll = [];

  searchComplaints : FormControl = new FormControl();
  strComplaint = '';
  searchAccessories : FormControl = new FormControl();
  strAccessory = '';
  //Spare Request
  strItemTyped = '';
  lstItem = [];
  intQuantity = 0;
  intSpareQtyNeeded = 0;
  blnQty = false;
  intSpareItemId = null;
  intSpareItemName = '';
  lstSpareList = [];
  blnSpareTable = false;
  blnQcRemarks = false;
  blnQc = false;
  //end
  // image data
  urlImage = '';
  modalRef : any;

  // comment box
  blnCommentsAccess = false;
  blnCommentsOpened = false;
  lstComments = [];
  strComment = '';
  blnCommentsShowMore = false;
  intCommentCount = 5;
  //Status to know RECEPTION VERIFIED OR NOT
  blnJobVerify = false;
  blnVerifyDisable = false;
  buttonText = ""
  blnAssignTo = false;
  blnAcceptDisable = false;
  blnVerifyTick = false;
  dctVerifyForm = {data:true};
  blnSE = false;
  strSeRemarks = '';
  dblServiceCharge = 0;
  selectedRadio = 0;
  intSpareAknowledgedStatus = 0;
  searchItem: FormControl = new FormControl();
  constructor(private serverService: ServerService, private spinner: NgxSpinnerService , public toastr: ToastrService,private fb: FormBuilder,
              private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.strJobId = history.state['jobId'];
    this.strAction = history.state['action'];
    // if (this.strAction == 'undefined'||this.strAction == null){
    //   console.log("hiiiiiiiiii");
    //   this.strAction='ALL'
    // }
    
    this.strUserGroup = localStorage.getItem('group_name').toUpperCase();

    this.strHostAddress = this.serverService.hostAddress;
    this.strNodeAddress = this.serverService.hostAddress;

    this.objectKeys = Object.keys;
    this.getServiceData();
    this.serviceEngTypeaHead();
    if(this.strUserGroup == 'QUALITY CHECK'){
      this.blnQc = true; 
    }
    if(this.strUserGroup == 'SERVICE ENGINEER'){
      this.blnSE = true; 
    }
    // accessories serach
    this.searchAccessories.valueChanges.subscribe((strData: string) => {
      if(strData == undefined || strData == ''){
        this.lstAccessories = this.lstAccessoriesAll
      }else{
        this.lstAccessories = this.lstAccessoriesAll.filter((data)=>{
          if(data.toUpperCase().indexOf(strData.toUpperCase()) > -1){
            return true
          }
        })
      }
    })

    // complaints search
    this.searchComplaints.valueChanges.subscribe((strData: string) => {
      if(strData == undefined || strData == ''){
        this.lstComplaints = this.lstComplaintsAll
      }else{
        this.lstComplaints = this.lstComplaintsAll.filter((data)=>{
          if(data.toUpperCase().indexOf(strData.toUpperCase()) > -1){
            return true
          }
        })
      }
    })

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

  }

  goBack(){
    this.router.navigateByUrl('/service-main/list-service',{ state : {strListAction: this.strAction} });
  }

  // comment box--------------------------------------------------------------------------------------------------

  toggleCommentBox(){
    this.blnCommentsOpened = !this.blnCommentsOpened
    if(this.blnCommentsOpened){
      this.getComments()
    }
  }

  getComments(){
    let dctData = {intJobId:this.strJobId}
    this.serverService.putData('service/comment_job/',dctData).subscribe((res)=>{
      this.lstComments = res['data'];
    },(err)=>{
      this.lstComments = [];
    })
  }

  onCommentScroll() {
    let max = this.commentDiv.nativeElement.scrollHeight
    let pos = this.commentDiv.nativeElement.offsetHeight
    if(pos == max ){
      this.blnCommentsShowMore = false
    }else{
      this.blnCommentsShowMore = true
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 13){
      if(this.blnCommentsAccess && this.blnCommentsOpened){
        if(this.strComment != ''){
          let dctData = {intJobId:this.strJobId,strMsg:this.strComment}
          this.serverService.postData('service/comment_job/',dctData).subscribe((res)=>{
            this.strComment = '';
            this.getComments();
          })
        }
      }
    }
  }

  // service data--------------------------------------------------------------------------------------------------

  getServiceData() {
    this.spinner.show()
    this.serverService.postData("service/service_detail_view/", { job_id: this.strJobId }).subscribe( response => {
      this.spinner.hide()
      if (response['status'] === 1) {     
        this.dctCustomerData = response['dct_customer_data'];
        this.dctServiceData = response['dct_service_data'];
        this.lstSpareList = response['lst_spare']
        if (this.lstSpareList.length >0){
          this.blnSpareTable = true;
        }
        if(response['dct_service_data']['json_problem_category']){
          this.lstOldComplaints = JSON.stringify(response['dct_service_data']['json_problem_category']['problem_category']);
        }else{
          this.lstOldComplaints = [];
        }

        if(response['dct_service_data']['json_acc_received']){
          this.lstOldAccessories = JSON.stringify(response['dct_service_data']['json_acc_received']['acc_received']);
        }else{
          this.lstOldAccessories = [];
        }

        // getting all service product details
        this.serverService.getData('service/product_details/').subscribe((res)=>{
          if(res['status'] == 1){
            // console.log("product name on view",this.dctServiceData['vchr_product_name'].toUpperCase());
            // console.log('observations',res['data'][this.dctServiceData['vchr_product_name'].toUpperCase()]);
            
            if(res['data'][this.dctServiceData['vchr_product_name'].toUpperCase()]){
              // console.log("enter valid");
              
              this.lstObservations = res['data'][this.dctServiceData['vchr_product_name'].toUpperCase()]['OBSERVATIONS'];
              this.lstComplaintsAll = res['data'][this.dctServiceData['vchr_product_name'].toUpperCase()]['COMPLAINTS'];
              this.lstAccessoriesAll = res['data'][this.dctServiceData['vchr_product_name'].toUpperCase()]['ACCESSORIES'];
              // console.log("this.lstObservations",this.lstObservations);
              
            }else{
              this.lstObservations = res['data']['OTHER']['OBSERVATIONS'];
              this.lstComplaintsAll = res['data']['OTHER']['COMPLAINTS'];
              this.lstAccessoriesAll = res['data']['OTHER']['ACCESSORIES'];
            }
          }else{
            this.lstObservations = ['CONDITION','NONE'];
            this.lstComplaintsAll = ['DEAD','NONE'];
            this.lstAccessoriesAll = ['NONE'];
          }
          this.lstComplaints = this.lstComplaintsAll;
          this.lstAccessories = this.lstAccessoriesAll;
        })

        //assign status settingup
        
        // console.log("ACTION",this.strAction);
        
          
        // service acknowledge
        if(this.strUserGroup.toUpperCase() == 'RECEPTION'){
          if((this.dctServiceData['vchr_job_status'] == 'COLLECTED' || this.dctServiceData['vchr_job_status'] == 'FOC VERIFIED') && this.strAction == 'FOLLOWUP'){
            this.blnJobVerify = true;
          }

          if(this.dctServiceData['vchr_job_status'] == 'FOC VERIFIED' && this.strAction == 'FOLLOWUP' || this.blnVerifyDisable){
            this.blnVerifyDisable = true;
            this.buttonText = "VERIFIED";
          }else{
            this.buttonText = "VERIFY JOB";
          }

        }
        // console.log('strAction',this.strAction);
        
        if(this.strUserGroup.toUpperCase() == 'SERVICE ENGINEER'){
          if(this.dctServiceData['vchr_job_status'] == 'ASSIGNED' && this.strAction == 'ASSIGN'){
            this.blnAcknowledge = true;
          }else{
            this.blnAcknowledge = false;
          }
        }else{
          this.blnAcknowledge = false;
        }
        console.log("diable",this.strUserGroup.toUpperCase());
        
        if(this.strUserGroup.toUpperCase() == 'RECEPTION' && (this.dctServiceData['vchr_job_status'] == 'COLLECTED' || this.dctServiceData['vchr_job_status'] == 'FOC VERIFIED') && this.strAction == 'FOLLOWUP' && this.blnVerifyDisable ){
          this.blnAssignTo = true;
        }
        else if (this.strUserGroup.toUpperCase() == 'CENTRAL MANAGER' && (this.dctServiceData['vchr_job_status'] ==  'ASSIGNED' || this.dctServiceData['vchr_job_status'] ==  'SE-AKNWOLEDGED' || this.dctServiceData['vchr_job_status'] ==  'JOB PENDING' ) ){
          this.blnAssignTo = true;
        }
        // console.log(this.blnAssignTo);

        // checking for enabling job accpet button

        if(this.strUserGroup.toUpperCase() == 'SERVICE ENGINEER' && this.dctServiceData['vchr_job_status'] == 'SE ACKNOWLEDGED' && this.strAction == 'ASSIGN' ){
          this.blnJobAccept = true;
        }else if (this.strUserGroup.toUpperCase() == 'SERVICE ENGINEER' && this.dctServiceData['vchr_job_status'] == 'JOB PENDING' && this.strAction == 'ASSIGN'){
          this.blnJobAccept = true;
          this.textAccept = 'Job Accepted'
          this.blnAcceptDisable = true;
        }
        
        // product complaint details edit  access
        // console.log("group view",this.strUserGroup);
        
        if(['SERVICE ENGINEER'].indexOf(this.strUserGroup) > -1){
          // console.log("polisaanam");
          
          if(this.dctServiceData['vchr_job_status'] == 'JOB PENDING' && this.strAction == 'ASSIGN'){ 
            this.blnEdit = true;
            this.blnSpareRequest = true;
          }
        }
        //enabling spare parts assigning
        
        // product complaint details edit  access
        if(['SERVICE MANAGER','SERVICE ENGINEER','ADMIN'].indexOf(this.strUserGroup) > -1){
            this.blnCommentsAccess = true;
        }
        
        this.intServiceAmt = JSON.parse(JSON.stringify (this.dctServiceData['dbl_est_amt']))
        this.intGrandTotal = 0
        this.intTotalAmount = 0
        if (this.dctServiceData['vchr_job_status'] == "SERVICED" || this.dctServiceData['vchr_job_status'] == 'INVOICED') {
          this.intGrandTotal = ( this.intServiceAmt + this.intSpareTotal ) - 
                                ( this.dctServiceData['dbl_discount'] + this.dctServiceData['dbl_advc_paid'] )
          this.intTotalAmount = this.intServiceAmt;
          this.dblBalanceAmount = JSON.parse(JSON.stringify (this.dctServiceData['dbl_total_amount']))
        }
        if (this.intGrandTotal < 0) {
          this.intGrandTotal = 0
        }

        this.strImei= this.dctServiceData['vchr_imei'];

        if(this.dctServiceData['vchr_job_status'] == 'INVOICED'){
          this.strPaymentMethod = this.dctServiceData['vchr_payment_methode']
          this.dblTaxPercent = this.dctServiceData['dbl_tax_perc']
          this.dblDiscount = this.dctServiceData['dbl_discount']
          this.blnInvoiceReadOnly = true;
        }
        
      } else {
        this.dctCustomerData = {};
        this.dctServiceData = {};
      }
    },error => { 
      this.spinner.hide()
    });

  }

  // accessories change
  assignUserChanged(item){
    this.intAssignuserId = item.id;
    this.strassignuser= item.name;
  }

  // creating job
  createJob(){
    if(this.datPickup == '' || this.datPickup == null){
      this.toastr.error('Please enter Date Of Pickup','Error!');
      return false;
    }else if(this.strPickupTime == '' || this.strPickupTime == null){
      this.toastr.error('Please enter Pickup Time','Error!');
      return false;
    }else if( this.strassignuser == ''  || this.strassignuser != this.strSelectedAssignuser){
      this.toastr.error('Please enter Assign To','Error!');
      return false;
    }else if(this.dctServiceData['vchr_landmark'] == '' || this.dctServiceData['vchr_landmark'] == null){
      this.toastr.error('Please enter Landmark','Error!');
      return false;
    }else{
      this.datPickup = moment(this.datPickup).format('YYYY-MM-DD')
      let dctData = {
        jobId: this.strJobId,
        datPickup: this.datPickup,
        strPickupTime: this.strPickupTime,
        intAssignuserId: this.intAssignuserId,
        strLandmark: this.dctServiceData['vchr_landmark']
      }
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show()
          this.serverService.patchData('service/add_service/',dctData).subscribe((res)=>{
            this.spinner.hide()
            if(res['status'] == 1){
              Swal.fire( 'Success', 'Successfully added', 'success');
              this.router.navigateByUrl('/service-main/list-service',{ state : {strListAction: 'VIEW'} });
            }
          },(err)=>{
            this.spinner.hide()
          })
        }
      })
    }
  }

  // accessories edit ---------------------------------------

  selectedAccessories(accessory){
    let index = this.dctServiceData['json_acc_received']['acc_received'].indexOf(accessory)
    if(index == -1){
      this.dctServiceData['json_acc_received']['acc_received'].push(accessory);
    }else{
      this.toastr.error('already selected','Error!');
    }
    this.strAccessory = '';
  }

  removeAccesories(complaint){
    let index = this.dctServiceData['json_acc_received']['acc_received'].indexOf(complaint)
    if(index > -1){
      if(this.dctServiceData['json_acc_received']['acc_received'].length > 1){
        this.dctServiceData['json_acc_received']['acc_received'].splice(index,1);
      }else{
        this.toastr.error('atleast one data required','Error!');
      }
    }
  }

  updateAccesories(){
    let dctData = {jobId:this.strJobId,lstAccessories: this.dctServiceData['json_acc_received']['acc_received']}
    this.spinner.show();
    this.serverService.putData('service/edit_service_details/',dctData).subscribe((res)=>{
      this.spinner.hide()
      if(res['status'] == 1){
        this.lstOldAccessories = JSON.stringify(this.dctServiceData['json_acc_received']['acc_received']);
        this.blnAccEdit = false;
        this.strAccessory = '';
      }else{
        this.toastr.error('error occured!..','Error!');
      }
    },(err)=>{
      this.spinner.hide()
      this.toastr.error('error occured!..','Error!');
    })
  }

  cancelEditAccessories(){
    this.dctServiceData['json_acc_received']['acc_received'] = JSON.parse(this.lstOldAccessories);
    this.blnAccEdit = false;
    this.strAccessory = '';
  }

  // complaints edit -----------------------------------------

  selectedCompaints(complaint){
    let index = this.dctServiceData['json_problem_category']['problem_category'].indexOf(complaint)
    if(index == -1){
      this.dctServiceData['json_problem_category']['problem_category'].push(complaint);
    }else{
      this.toastr.error('already selected','Error!');
    }
    this.strComplaint = '';
  }

  removeComplaints(complaint){
    let index = this.dctServiceData['json_problem_category']['problem_category'].indexOf(complaint)
    if(index > -1){
      if(this.dctServiceData['json_problem_category']['problem_category'].length > 1){
        this.dctServiceData['json_problem_category']['problem_category'].splice(index,1);
      }else{
        this.toastr.error('atleast one data required','Error!');
      }
    }
  }

  updateComplaints(){
    let dctData = {jobId:this.strJobId,lstComplaints: this.dctServiceData['json_problem_category']['problem_category']}
    this.spinner.show();
    this.serverService.patchData('service/edit_service_details/',dctData).subscribe((res)=>{
      this.spinner.hide()
      if(res['status'] == 1){
        this.lstOldComplaints = JSON.stringify(this.dctServiceData['json_problem_category']['problem_category']);
        this.blnCompEdit = false;
        this.strComplaint = '';
      }else{
        this.toastr.error('error occured!..','Error!');
      }
    },(err)=>{
      this.spinner.hide()
      this.toastr.error('error occured!..','Error!');
    })
  }

  cancelEditComplaints(){
    this.dctServiceData['json_problem_category']['problem_category'] = JSON.parse(this.lstOldComplaints);
    this.blnCompEdit = false;
    this.strComplaint = '';
  }

  // observation functions -----------------------------------------------

  isWorking(item){
    // console.log('item llllll',item);
    
    if(item == 'W' || item == true){
      return true;
    }else{
      return false;
    }
  }

  isNotWorking(item){
    if(item == 'NW' || item == false){
      return true;
    }else{
      return false;
    }
  }

  QcVerification(item){
    if(item == 'NW'){
      return true;
    }else{
      return false;
    }
  }

  editObservation(status,key,blnChecked){
    if(blnChecked){
      this.dctServiceData['json_observation'][key] = true;
    }else{
      this.dctServiceData['json_observation'][key] = false;
    }    
  }

  editQcObservation(status,key,blnChecked){
    if(blnChecked){
      this.dctVerifyForm[key] = true;
    }else{
      this.dctVerifyForm[key] = false;
    }    
  }

  updateObservations(){
    if(Object.keys(this.dctServiceData['json_observation']).length > 0){
      let dctData = {jobId:this.strJobId,dctObservations: this.dctServiceData['json_observation']}
      this.spinner.show();
      this.serverService.postData('service/edit_service_details/',dctData).subscribe((res)=>{
        this.spinner.hide()
        if(res['status'] == 1){
          this.blnObsEdit = false;
          window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
          });
        }else{
          this.toastr.error('error occured!..','Error!');
        }
      },(err)=>{
        this.spinner.hide()
        this.toastr.error('error occured!..','Error!');
      })
    }else{
      this.toastr.error('atleast one data required','Error!');
    }
  }

  updateQcVerification(blnStatus){

    if (blnStatus){
    let blnTemp = false
    // console.log("polisaanam",this.dctVerifyForm);
    // console.log("polisaanam2",this.lstObservations);
    
    for (let index in this.lstObservations) {
        if(this.dctVerifyForm[this.lstObservations[index]] == true || this.lstObservations[index] in this.dctVerifyForm){
        }
        else{
          blnTemp = true
          // console.log("key" , this.lstObservations[index] );
        }
    }
    if(blnTemp){
      this.toastr.error('Please click on all the checkboxes to Complete the verifications','Error!');
    }else{

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show()


      let dctData = {intJobId:this.strJobId,blnStatus:true}
      this.spinner.show();
      this.serverService.putData('service/job_completed_update/',dctData).subscribe((res)=>{
        this.spinner.hide()
        if(res['status'] == 1){
          this.blnObsEdit = false;
          
          Swal.fire({
            position: 'center',
            type: 'success',
            title: 'Verfication Process Successfully Completed!..',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigateByUrl('/service-main/list-service')
        }else{
          this.toastr.error('error occured!..','Error!');
        }
      },(err)=>{
        this.spinner.hide()
        this.toastr.error('error occured!..','Error!');
      })
       } })
   
  }
    }
    if(!blnStatus){
      if(!this.blnQcRemarks){
        this.blnQcRemarks = true;
      }else{
      
        if(this.qcRemarks.length > 0){
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed!'
          }).then((result) => {
            if (result.value) {
              this.spinner.show()

          let dctData = {intJobId:this.strJobId, strRemarks: this.qcRemarks,blnStatus:false}
          this.serverService.putData('service/job_completed_update/',dctData).subscribe((res)=>{
            this.spinner.hide()
            if(res['status'] == 2){
              this.blnObsEdit = false;
              Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Verfication Process Successfully Completed!..',
                showConfirmButton: false,
                timer: 1500
              });
            }else{
              this.toastr.error('error occured!..','Error!');
            }
          },(err)=>{
            this.spinner.hide()
            this.toastr.error('error occured!..','Error!');
          })
        }})
        }else{
          this.toastr.error('Please fillup the remarks column','Error!');
        }
      }
    }
  }
  

  // service follow up ------------------------------------------------------
  Serviced(){
    this.blnNotServiced = false;
    this.strRemarks = '';
  }

  NotServiced(){
    this.lstSpare = [];
    this.blnServiced = false;
    this.blnSparePart = false;
    this.intServiceCharge = 0;
    this.intServiceAmt = JSON.parse(JSON.stringify (this.dctServiceData['dbl_est_amt']))
    this.intGrandTotal = ( this.intServiceAmt + this.intSpareTotal ) - 
                          ( this.dctServiceData['dbl_discount'] + this.dctServiceData['dbl_advc_paid'] )
    this.intTotalAmount = 0;
  }

  serviceChargeAdd(){
    this.intServiceAmt = this.intServiceCharge
    this.intGrandTotal = ( this.intServiceAmt + this.intSpareTotal ) - 
                          ( this.dctServiceData['dbl_discount'] + this.dctServiceData['dbl_advc_paid'] )
    if (this.intGrandTotal < 0) {
      this.intGrandTotal = 0
    }
    this.intTotalAmount = this.intServiceAmt+this.intSpareTotal
  }

  addSpareItems(){
    let tempData = true

    if ( this.intSpareItemId == null || this.intSpareItemId == undefined || this.intSpareItemName != this.strItemTyped){
      Swal.fire('Spare Missing','Please select valid spare','error');
      return false;
    }else if (this.strColourRequired == "" || this.strColourRequired == null || this.strColourRequired == undefined) {
      Swal.fire('Colour Missing !','enter colour','error');
    }else if (this.intSpareQtyNeeded == 0 || this.intSpareQtyNeeded == null) {
      Swal.fire('Quantity Missing','enter a valid quantity','error');
    }
    else{
      this.lstSpare.forEach(element => {
        if(element.intItemId == this.intSpareItemId){
          tempData = false;
        }
      });
      
      if (tempData){
      this.intSpareTotal = this.intSpareTotal + this.dblSpareAmt;
      
      let dctData={}
      dctData['intItemId'] = this.intSpareItemId;
      dctData['intName'] = this.intSpareItemName;
      // console.log("intSpareQtyNeeded",this.intSpareQtyNeeded);
      // console.log("this.intQuantity",this.intQuantity);
      
      if (Number(this.intSpareQtyNeeded) <= this.intQuantity){
        dctData['blnStatus'] = true;
      }else{
        dctData['blnStatus'] = false;
      }
      // console.log(dctData['blnstatus']);
      
      dctData['intQuantity'] = Number(this.intSpareQtyNeeded);
      dctData['strColour'] = this.strColourRequired;
      dctData['intJobId'] = this.strJobId
      this.lstSpare.push(dctData);

      this.intSpareItemId = null;
      this.intSpareQtyNeeded = 0;
    
    }else{
      Swal.fire('Spare already exists','enter new spare','error'); 
    }
  }
   
  }

  deleteSparePart(index,item){
    this.lstSpare.splice(index, 1);
    this.intSpareTotal = this.intSpareTotal - item.amt;
    this.intTotalAmount = this.intTotalAmount - item.amt;
    this.intGrandTotal = this.intGrandTotal - item.amt
    if (this.intGrandTotal < 0) {
      this.intGrandTotal = 0
    }
  }

  verifyJob() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed!'
    }).then((result) => {
      if (result.value) {
        let dctData = {'jobId':this.strJobId}
        this.spinner.show()
        this.serverService.patchData("service/service_detail_view/",dctData).subscribe((res)=>{
          this.spinner.hide()
          if(res['status'] == 1){
            this.blnVerifyDisable = false;
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Service Verified!..',
              showConfirmButton: false,
              timer: 1500
            });
            // this.printServiceDetails(this.strJobId,true)
            this.getServiceData();
          }
        },(err)=>{
          this.spinner.hide()
        })
      }
    })
  }

  saveDetails() {
    let  dctdata={}
    if(this.lstSpare.length == 0 || !this.lstSpare == null || this.lstSpare == undefined){
      Swal.fire('Error','Enter valid details for saving request','error');
      return false;
    }
    // else if(this.blnEdit && (this.blnObsEdit || this.blnAccEdit || this.blnCompEdit)){
    //   Swal.fire('Error','Complete editing process before service..','error');
    //   return false;
    // }
    else{
      dctdata['lstSpareData'] = this.lstSpare;
      this.serverService.postData('service/spare_request/', dctdata).subscribe((res) => {
        this.spinner.hide();
        if(res['status'] == 1){
          this.lstSpare = [];
          this.blnNotServiced = false;
          this.blnServiced = false;
          Swal.fire('Success',res['message'],'success');
          // this.router.navigateByUrl('/service-main/list-service',{ state : {strListAction: 'COMPLETED'} });
        }
        else if(res['status'] == 0){
          Swal.fire('Error','Error ','error');
        }
      },(error) => {
        this.spinner.hide()
        Swal.fire('Error','something went wrong in server','error');
      })
      // if(this.blnNotServiced){
      //   if(!this.strRemarks){
      //     Swal.fire('Value Missing','Enter Remarks','error');
      //     return false;
      //   }
      //   else{
      //     dctdata['remarks'] = this.strRemarks;
      //     dctdata['status'] = 'NOT SERVICED';
      //   }
      // } else{
      //     dctdata['status'] = 'SERVICED';
      //     dctdata['lstSpareParts'] = this.lstSpare;

      //     dctdata['intServiceAmt'] = this.intServiceAmt;

      //     // Imei validation
      //     if(['MOBILE','TABLET','LAPTOP','TV'].indexOf(this.dctServiceData['vchr_product_name'].toUpperCase()) > -1){
      //       if(this.strImei==null || this.strImei==undefined || this.strImei==''){
      //         Swal.fire('Value Missing','Enter IMEI','error');
      //         return false;
      //       }
      //       else if(this.strImei.length > 20){
      //         Swal.fire('Value Missing','Length must be less than 20','error');
      //         return false;
      //       }
      //       else if(!/^[a-zA-Z0-9\s]*$/g.test(this.strImei)){
      //         Swal.fire('Value Missing','Allow only alphabets and digits','error');
      //         return false;
      //       }
      //       else{
      //         dctdata['vchr_imei'] = this.strImei;
      //       }
      //     }else{
      //       dctdata['vchr_imei'] = '';
      //     }
      //     // Imei validation

      // }
      
      // saving service details
      // this.followupService(dctdata);

    }
  }

  followupService(dctdata) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        // saving service
        this.serverService.putData('service/service_detail_view/', dctdata).subscribe((res) => {
          this.spinner.hide();
          if(res['status'] == 1){
            this.lstSpare = [];
            this.blnNotServiced = false;
            this.blnServiced = false;
            Swal.fire('Success',res['message'],'success');
            this.router.navigateByUrl('/service-main/list-service',{ state : {strListAction: 'COMPLETED'} });
          }
          else if(res['status'] == 0){
            Swal.fire('Error',res['data'],'error');
          }
        },(error) => {
          this.spinner.hide()
          Swal.fire('Error','something went wrong in server','error');
        })
      }
    })
  }

  // assign modal ----------------------------------------------------------------
  openAssignModal(content) {
    this.selectedSerEngineer = '';
    this.lstSerEngineer = [];
    this.showModalJobAssign= this.modalService.open(content, { centered: true, size: 'sm' });
  }

  // typeahead ------------------------------------------------------------------
  serviceEngTypeaHead(){

    this.serverService.putData('service/service_assign/',{ term: 'EMPTY' }).subscribe((response) => {
      this.lstSerEngineerAll = response['data'];
      this.lstSerEngineer = response['data'];
    });

    this.searchServiceEngineer.valueChanges.subscribe((strData: string) => {
      if(strData == undefined){
        this.lstSerEngineer = this.lstSerEngineerAll
      }else{
        this.lstSerEngineer = this.lstSerEngineerAll.filter((res)=>{
          if(res['name'].toUpperCase().indexOf(strData.toUpperCase()) > -1){
            return true
          }
        })
      }
    });

  }

  serEngineerChanged(item){
    this.serviceEngineerId = item.id;
  }

  // assign service save -----------------------------------------------------------
  saveServiceAssign(){
    let dctData = {}
  
    dctData['serviceEngId'] = this.serviceEngineerId;
    dctData['jobId'] = this.strJobId;
  
    if(this.selectedSerEngineer == null || this.selectedSerEngineer == undefined || this.selectedSerEngineer == ''){
      Swal.fire('Error','Service engineer not selected','error');
      return false;
    }
    if (this.serviceEngineerId == null) {
      Swal.fire('Error','Service engineer not selected','error');
      return false;
    }
    else{
      this.spinner.show()
      this.serverService.postData("service/service_assign/", dctData).subscribe( response => {
        this.spinner.hide()
        if (response['status'] === 1) {
            Swal.fire('Success', 'Service succesfully assigned', 'success');
            this.router.navigateByUrl('/service-main/list-service',{ state : {strListAction: 'FOLLOWUP'} });
          }else{
            Swal.fire({
              position: 'center',
              type: 'error',
              title: 'Error !..',
              showConfirmButton: false,
              timer: 1500
            })
          }
        },error => { 
          this.spinner.hide()
        }
      );
      
    }
  }

  // invoice service ----------------------------------------------------------

  calculateInvoiceAmount(){
    this.dctServiceData['dbl_total_amount'] = this.dblBalanceAmount - Number(this.dblDiscount)
  }

  invoiceService() {
    let dctData = {strJobId: this.strJobId,dblTaxPercent:this.dblTaxPercent,dblDiscount:this.dblDiscount,strPaymentMethod:this.strPaymentMethod}
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this.serverService.postData("service/save_invoice/",dctData).subscribe((res)=>{
          this.spinner.hide()
          if(res['status'] == 0){
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Payment Successfully added!..',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigateByUrl('/service-main/list-service',{ state : {strListAction: 'INVOICE'} });
            // let intInvoiceId = res['intInvoiceId']
            // this.invoicePrint(intInvoiceId,false);
          }
        },(err)=>{
          this.spinner.hide()
        })
      }
    })
  }

  // print service details -------------------------------------------------------------------
  printServiceDetails(jobId,blnEmail) {
    const data = { jobId: jobId, blnEmail: blnEmail};
    this.spinner.show()
    this.serverService.postData("service/service_job_slip/", data).subscribe( (response) => {
      this.spinner.hide()
      if(!blnEmail){
        if (response['status'] == 1) {
          window.open(response['file_cust_link'],'_blank')
          window.open(response['file_link'],'_blank')
        } else {
          Swal.fire({
            position: 'center',
            type: 'error',
            title: 'pdf generation failed!..',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        if (response['status'] == 1) {
          Swal.fire({
            position: 'center',
            type: 'success',
            title: response['data'],
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          Swal.fire({
            position: 'center',
            type: 'error',
            title: response['data'],
            showConfirmButton: false,
            timer: 1500
          })
        }
      }

    },(err)=>{
      this.spinner.hide()
    });
  }

  // print invoice details ----------------------------------------------------------------
  invoicePrint(intInvoiceId,blnEmail){
    let dctData={ intId:intInvoiceId,blnEmail :blnEmail }
    this.spinner.show()
    this.serverService.postData("service/service_invoice_slip/",dctData).subscribe((res)=>{
      this.spinner.hide()
      if(!blnEmail){
        if(res['status'] == 0){
          window.open(res['data'],'_blank');
        }else{
          Swal.fire({
            position: 'center',
            type: 'error',
            title: 'pdf generation failed!..',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        if (res.status == 1) {
          Swal.fire({
            position: 'center',
            type: 'success',
            title: res['data'],
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          Swal.fire({
            position: 'center',
            type: 'error',
            title: res['data'],
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    },(err)=>{
      this.spinner.hide()
    })
  }

  // pop up image
  popUpImage(imageShowTem,imageSrc) {
    this.urlImage = imageSrc;
    this.modalRef = this.modalService.open(imageShowTem, { size: 'sm' });
  }

  acknowledgeService(){

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed!'
    }).then((result) => {
      if (result.value) {
        let dctData = {'intJobId':this.strJobId}
        this.spinner.show()
        this.serverService.putData("service/service_followup/",dctData).subscribe((res)=>{
          this.spinner.hide()
          if(res['status'] == 1){
            this.blnAcknowledge = false;
            this.blnJobAccept = true;
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Service Aknowledged!..',
              showConfirmButton: false,
              timer: 1500
            });
            // this.printServiceDetails(this.strJobId,true)
            this.getServiceData();
          }else{
            Swal.fire({
              position: 'center',
              type: 'error',
              title: 'Error !..',
              showConfirmButton: false,
              timer: 1500
            })
          }
        },(err)=>{
          this.spinner.hide()
        })
      }
    })
  }

  acceptJob(){

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed!'
    }).then((result) => {
      if (result.value) {
        let dctData = {'intJobId':this.strJobId,'blnAccept':true}
        this.spinner.show()
        this.serverService.putData("service/service_followup/",dctData).subscribe((res)=>{
          this.spinner.hide()
          if(res['status'] == 1){
            this.blnAcceptDisable = true;
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Job Accepted!..',
              showConfirmButton: false,
              timer: 1500
            });
            // this.printServiceDetails(this.strJobId,true)
            this.getServiceData();
          }else{
            Swal.fire({
              position: 'center',
              type: 'error',
              title: 'Error !..',
              showConfirmButton: false,
              timer: 1500
            })
          }
        },(err)=>{
          this.spinner.hide()
        })
      }
    })
  }

  itemChanged(){
    // console.log("came in");
    
    if ( this.strItemTyped === undefined || this.strItemTyped === null) {
      this.lstItem = [];}
    else {
      if (this.strItemTyped.length >= 3) {
        this.serverService.postData('service/item_typeahead/', { term: this.strItemTyped ,blnSpare :true}).subscribe((response) => {
            this.lstItem = response['data'];
        });
      }
    }
  }
  itemSelectionChanged(item){
    // console.log("polisaanam",this.intSpareQtyNeeded);
    this.intSpareItemId = item.id 
    this.intSpareItemName = item.name
    let id = item.id
    this.serverService.putData('service/item_typeahead/', { intItemId: id}).subscribe((response) => {
      if(response['status'] == 1){
      this.intQuantity = response['data']['sum_qty'];
      this.blnQty = true;
      this.intSpareQtyNeeded = 1
      // console.log("qty item",this.intQuantity);
      }else{
        if(response['status']==0){
          this.intQuantity = 0;
          this.blnQty = true;
          this.intSpareQtyNeeded = 1
        }else{
          Swal.fire({
            position: 'center',
            type: 'error',
            title: 'Error !..',
            showConfirmButton: false,
            timer: 1500
          })
        }

      }
    });

  }

  completeService(){
    // [selectedRadio,dblServiceCharge,strSeRemarks]
    if(this.selectedRadio == 0 || this.selectedRadio == null || this.selectedRadio == undefined){
      this.toastr.error('Please select from the choice','Error!');
    }else if(this.selectedRadio == 1 && (this.dblServiceCharge == null || this.dblServiceCharge == undefined ||this.dblServiceCharge == 0 )){
      this.toastr.error('Please Enter Service Charge','Error!');
    }else if((this.selectedRadio == 1 || this.selectedRadio == 2) && this.strSeRemarks.length ==0){
      this.toastr.error('Please Enter Remarks before saving','Error!');
    }else{
      let bln_serviced = false;
      if(this.selectedRadio == 1){
        bln_serviced = true
      }else if (this.selectedRadio == 2){
        bln_serviced = false
      }
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed!'
      }).then((result) => {
        if (result.value) {
          let dctData = {'intJobId':this.strJobId,'blnAccept':true}
          this.spinner.show()
      let dct_data = {intJobId: this.strJobId,blnServiced : bln_serviced, strRemarks: this.strSeRemarks, dblServiceAmount : this.dblServiceCharge}
      this.serverService.postData('service/job_completed_update/',dct_data).subscribe((response)=>{
          if(response['status'] == 1){
            this.spinner.hide()
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Succesfully Updated..!',
              showConfirmButton: true,
              timer: 4000
            })
            this.router.navigateByUrl('/service-main/list-service')
          }else if(response['status'] == 0){
            Swal.fire({
              position: 'center',
              type: 'error',
              title: 'Something Went Wrong..!',
              showConfirmButton: false,
              timer: 4000
            })
          }
      },(err)=>{
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'Something Went Wrong..!',
          showConfirmButton: false,
          timer: 4000
        })
        this.spinner.hide()
      }
      )
    }
    })

    }
    
  }

  AknowledgeSpare(item){
    let dct_data = {intRequestId : item.pk_bint_id}
    this.spinner.show()
    this.serverService.patchData('service/job_completed_update/',dct_data).subscribe((response)=>{
      if(response['status'] == 1){
        this.spinner.hide()
        this.toastr.success('Now you got the spare', 'Aknowledged !')
        this.intSpareAknowledgedStatus = item.pk_bint_id;
      }else{
        this.spinner.hide()
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'Something Went Wrong..!',
          showConfirmButton: false,
          timer: 4000
        })
      }
    },(err)=>{
      Swal.fire({
        position: 'center',
        type: 'error',
        title: 'Something Went Wrong..!',
        showConfirmButton: false,
        timer: 4000
      })
      this.spinner.hide()
    })
    
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from '../../server.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-invoicecustomer',
  templateUrl: './invoicecustomer.component.html',
  styleUrls: ['./invoicecustomer.component.css']
})
export class InvoicecustomerComponent implements OnInit {

  strInvoiceNo;
  lstPayment = []
  objectKeys;
  dct_finance={}

  dctMaster={}
  dctDetails=[]
  blnGetData = false;

  hostname = '';
  url='';
  imageUrl=''
  showModalZoom;
  showModalCustEdit;

  intContactNo=null
  strName
  strEmail;

  searchCity: FormControl = new FormControl();
  lstCity = []
  intCityId;
  strCity;
  selectedCity
  strPincode;
  currentCity='';
  currentState='';

  searchState: FormControl = new FormControl();
  lstState = []
  intStateId;
  intStateIdPrevious
  strState:'';
  selectedState;

  strGSTNo;
  strAddress:''
  intCustId:null

  blnCheckIGST =false;
  dctData={}
  intSalesCustId :Number
  blnFinance=false

  constructor(
    private toastr: ToastrService,
    public router: Router,
    private serviceObject: ServerService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.objectKeys = Object.keys;


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
  }


  getInvoice() {

    let dctData={};
    dctData['InvoiceNum']=this.strInvoiceNo;
   
    if (this.strInvoiceNo === '') {
      this.toastr.error('Enter invoice No ');
      return ;
    }
  
 
    this.serviceObject
          .putData('invoice/invoice_list/', dctData)
          .subscribe(
            (response) => {
              if(response.status==1){
                this.dctDetails=response['details'];
                this.lstPayment = response['lst_payment'];
                this.dctMaster=response['master']['0'];
                this.dct_finance=response['dct_finance'];
                if(this.objectKeys(this.dct_finance).length>0){
                  this.blnFinance=true
                }
                this.dctMaster['staff_name']=this.dctMaster['fk_staff__first_name'] +' '+this.dctMaster['fk_staff__last_name']
                this.blnGetData = true;

         
                this.intCustId=response['master'][0]['fk_customer_id'];
                this.intContactNo= response['master'][0]['fk_customer__int_mobile'];
                this.strEmail = response['master'][0]['fk_customer__vchr_email'];
                this.strName = response['master'][0]['fk_customer__vchr_name'].toUpperCase()

                this.selectedCity=response['master'][0]['fk_customer__fk_location__vchr_name'];
                this.currentCity=response['master'][0]['fk_customer__fk_location__vchr_name'];
                this.strCity=response['master'][0]['fk_customer__fk_location__vchr_name'];
                this.intCityId=response['master'][0]['fk_customer__fk_location_id'];

                this.selectedState=response['master'][0]['fk_customer__fk_state__vchr_name'];
                this.currentState=response['master'][0]['fk_customer__fk_state__vchr_name'];
                this.strState=response['master'][0]['fk_customer__fk_state__vchr_name'];
                this.intStateId=response['master'][0]['fk_customer__fk_state_id'];

                this.strGSTNo=response['master'][0]['fk_customer__vchr_gst_no'];
                this.strAddress=response['master'][0]['fk_customer__txt_address'];
              
              }
              else{
                
              }
            }
          );
    }


  cityNgModelChanged(event){
  
    if(this.currentCity!=this.selectedCity){
      this.intCityId = null;
        this.strCity = '';
    }
  }
  cityChanged(item)
  {
   this.currentCity = item.vchr_name;
   this.intCityId = item.pk_bint_id;
   this.strCity = item.vchr_name;
   this.strPincode= item.vchr_pin_code;
  }

  stateNgModelChanged(event){
  
    if(this.currentState!=this.selectedState){
      this.intStateId = null;
        this.strState = '';
    }
  }
  stateChanged(item)
  {
    this.currentState = item.vchr_name;
    this.intStateId = item.pk_bint_id;
    this.strState = item.vchr_name;
  }


     // Zoom image modal

openzoomimage(zoomimage,image) {
  this.imageUrl=image
  this.showModalZoom= this.modalService.open(zoomimage, { size: 'lg' })
}

opencustomeredit(customeredit) {
  this.showModalCustEdit= this.modalService.open(customeredit, { size: 'lg' });
}

  // Customer Edit
  changeToUppercase(){
    this.strGSTNo = this.strGSTNo.toUpperCase();
    // this.strName = this.strName.toUpperCase();
  }

  changeNameToUppercase(){
    // this.strGSTNo = this.strGSTNo.toUpperCase();
    this.strName = this.strName.toUpperCase();
  }
  

  saveCustEdit()
  {    
    let checkError=false
    if(this.strName=='' || this.strName==null || this.strName==undefined){
      
       this.toastr.error('Customer Name is required', 'Error!');
       checkError=true
       return false;
    
  }
   //  if(this.selectedCity){
      if (this.selectedCity != this.strCity || !this.selectedCity)
      {
       this.toastr.error('Valid City Name is required', 'Error!');
       checkError=true
       this.intCityId = null
       this.strCity = ''
       this.selectedCity=''
       return false;
     }
   // }
   // if(this.selectedState){
      if (this.selectedState != this.strState  || !this.selectedState)
      {
        this.toastr.error('Valid State Name is required', 'Error!');
        checkError=true
        this.intStateId = null
        this.strState = ''
        this.selectedState=''
        return false;
      }
   //  }

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
   if (this.strGSTNo && (this.strGSTNo).toString().length!=15) {
    this.toastr.error('Enter Valid GST No.', 'Error!');
    checkError=false;
    return false
  }
  if (this.strGSTNo && !(/^[0-9]{2}/).test(this.strGSTNo)) {
    this.toastr.error('First two digits of GST No. should be number', 'Error!');
    checkError=false;
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
    dctCustomerData['intCustId']=this.intCustId
    
    // partialInvoice Id 

    // dctCustomerData['intPartialId'] = this.salesRowId




       this.serviceObject.postData('customer/edit_customer_sales/',dctCustomerData).subscribe(res => {
         if (res.status == 1)
         {
           swal.fire({
             position: "center",
             type: "success",
             text: "Data saved successfully",
             showConfirmButton: true,
           });
           this.blnCheckIGST=res['data']['blnIGST']
           this.showModalCustEdit.close();

           this.dctMaster['fk_customer__vchr_name'] = res['data']['strName'];
           this.dctMaster['fk_customer__int_mobile'] = res['data']['intContactNo'];
           this.dctMaster['fk_customer__vchr_email'] = res['data']['strEmail'];


          //  this.dctData['custEditData']['strEmail']=res['data']['strCustEmail']
          //  this.dctData['custEditData']['strAddress']=res['data']['txtAddress']
          //  this.dctData['custEditData']['strState']=res['data']['strState']
          //  this.dctData['custEditData']['intStateId']=res['data']['intStateId']
          //  this.dctData['custEditData']['intCityId']=res['data']['intCityId']
          //  this.dctData['custEditData']['strCity']=res['data']['strLocation']
          //  this.dctData['custEditData']['strGSTNo']=res['data']['strGSTNo']
          //  this.dctData['custEditData']['intCustId']=res['data']['intCustId']
           this.intSalesCustId=res['data']['intSalesCustId']
// -----------------------------------------------------------------------------------------------------------------
          //  Only if state is changed
          if (this.intStateId != this.intStateIdPrevious){
            this.intStateIdPrevious = this.intStateId
            
            // this.lstItemDetails.forEach(element => {
            //   element.dblBuyBack =0
            //   element.dblDiscount=0
            //   if(this.blnCheckIGST){
            //     element.dblAmount = Number((element.dblRate + element.dblIGST).toFixed(2))
            //   }
            //   else{
            //     element.dblAmount = Number(( element.dblRate + element.dblCGST + element.dblSGST).toFixed(2))
            //   }
            // });
          }

// -----------------------------------------------------------------------------------------------------------------
           
   

          //  this.billingDatails("other",0);

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

  cancelCustEdit(){
    this.showModalCustEdit.close();
    if(this.dctData['custEditData']){
    this.strEmail = this.dctData['custEditData']['strEmail']
    this.strAddress = this.dctData['custEditData']['strAddress']
    this.selectedState = this.dctData['custEditData']['strState']
    this.intStateId= this.dctData['custEditData']['intStateId']
    this.intCityId= this.dctData['custEditData']['intCityId']
    this.selectedCity = this.dctData['custEditData']['strCity']
    this.strGSTNo = this.dctData['custEditData']['strGSTNo']
     }
  }

}

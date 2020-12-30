import { Component, OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';


@Component({
  selector: 'app-viewpayment',
  templateUrl: './viewpayment.component.html',
  styleUrls: ['./viewpayment.component.css']
})
export class ViewpaymentComponent implements OnInit {

  datPayment = '';
  strPayeeType = '';
  intPayeeType=null
  strCustomerName = '';
  strStaff = '';
  strExpenses = '';
  intAmount=null
  strRemarks = '';
  strFop = '';
  intFop = null;
  strBranch= '';
  viewId=localStorage.getItem('paymentId');
  strBank = '';
  lstDenominations=[]
  strReceipt = '';
  strVentorName = '';
  constructor(
    private serviceObject: ServerService,
    private toastr: ToastrService,
    public router: Router,
  ) { }
  strExpenseName=''
  ngOnInit() {
    if (localStorage.getItem('paymentRequestData')) {
      localStorage.setItem('paymentCustomerNumberStatus', '1');
    }
    this.getData(this.viewId)

  }
    getData(paymentId){
    this.serviceObject.postData('payment/view_payment/',{'strDocNo':paymentId}).subscribe(
      (response) => {
          if (response.status == 1) 
          {
            this.intPayeeType= response['data'][0]['int_payee_type'];
            this.intFop= response['data'][0]['int_fop'];
            
            if(this.intFop==1){
              this.strFop="Cash"
            }
            else{
              this.strFop="Bank"
            }
          
            if(this.intPayeeType==1){
              this.strCustomerName= response['data'][0]['str_payee_name'];
              this.strPayeeType =response['data'][0]['str_payee_type'];
              this.strReceipt = response['data'][0]['str_receipt'];
            }
            else if(this.intPayeeType==5){
              this.strCustomerName= response['data'][0]['str_payee_name'];
              this.strPayeeType =response['data'][0]['str_payee_type'];
              // this.strPayeeType = "CUSTOMER";
            }
            else if(this.intPayeeType==6){
              this.strVentorName= response['data'][0]['str_payee_name'];
              this.strPayeeType =response['data'][0]['str_payee_type'];
              // this.strPayeeType = "CUSTOMER";
            }
            else if(this.intPayeeType==2){
              this.strStaff= response['data'][0]['str_payee_name'];
              this.strPayeeType =response['data'][0]['str_payee_type'];
              // this.strPayeeType = "STAFF";
            }
            else if (this.intPayeeType == 3) {
              this.strExpenses= response['data'][0]['str_payee_name'];
              this.strPayeeType =response['data'][0]['str_payee_type'];
              // this.strPayeeType = "EXPENSES";
            }
            else if (this.intPayeeType == 4){
              this.strBank= response['data'][0]['str_payee_name'];
              this.strPayeeType =response['data'][0]['str_payee_type'];
              this.lstDenominations=response['data'][0]['dct_denomination']
              // this.strPayeeType = "EXPENSES";
            }
            this.strBranch= response['data'][0]['fk_branch__vchr_name'];
            this.intAmount= response['data'][0]['dbl_amount'];
            this.strRemarks= response['data'][0]['vchr_remarks'];
            this.datPayment= response['data'][0]['date'];
            this.strExpenseName= response['data'][0]['fk_accounts_map__vchr_category'];

          }  
          else if (response.status == 0) {
           swal.fire('Error!',response['data'], 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
        
      });

  }


  backButton(){
    // console.log("fdsdsd");
    // localStorage.setItem('previousUrl','payment/viewpayment');
    
    this.router.navigate(['payment/viewpayment']);
  }

}

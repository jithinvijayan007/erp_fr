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
  selector: 'app-viewdealer',
  templateUrl: './viewdealer.component.html',
  styleUrls: ['./viewdealer.component.css']
})
export class ViewdealerComponent implements OnInit {
  dealerDetails={}

  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,) {
      
  }
  dealerRowId= localStorage.getItem('dealerRowId');
  strDealerName:'';
  strDealerFrom;
  strDealerCode:'';
  intActive;
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
  status;
  ngOnInit(){
    this.getData()
  }
  getData(){
    let dctdealer={}
    this.serviceObject.getData('dealer/view_dealer/?id='+ this.dealerRowId).subscribe(
      (response) => {
          if (response.status == 1)
          {
            dctdealer['data']=response['lst_userdetailsview'][this.dealerRowId]

            this.strDealerName= dctdealer['data']['dealer_name']
            this.strDealerFrom= moment(dctdealer['data']['vchr_from']).format('DD/MM/YYYY');
            this.strDealerCode= dctdealer['data']['vchr_code']
            this.intActive= dctdealer['data']['int_is_act_del'];
            if(this.intActive==1){
              this.status="Active"
            }
            else if(this.intActive==2){
              this.status="Deactive"
            }
            this.intCreditDays= dctdealer['data']['int_credit_days']
            this. intCreditLimit= dctdealer['data']['bint_credit_limit']
            this.poExpiryDays= dctdealer['data']['int_po_expiry_days']
            this.strPanStatus= dctdealer['data']['vchr_pan_status']
            this.strPanNo= dctdealer['data']['vchr_pan_no']
            this.strAccount= dctdealer['data']['vchr_bank_account']
            this.strGroup= dctdealer['data']['vchr_account_group']
            this.strTax= dctdealer['data']['vchr_taxmaster_name']
            this.strCategory= dctdealer['data']['vchr_category_name']
            this.strGSTStatus= dctdealer['data']['vchr_gstin_status']
            this.strGSTIN= dctdealer['data']['vchr_gstin']
            this.strCSTNo= dctdealer['data']['vchr_cst_no']
            this.strTINNo= dctdealer['data']['vchr_tin_no']
            this.dctData['lstaddress']=dctdealer['data']['lst_address']
            //  {
            //    strAddress:'',
            //    strEmail:'',
            //    intContact:,
            //    intPinCode:''
            //  }
          //  ] 
           this.dctData['lstcontact']=dctdealer['data']['lst_contact']
            //  {
            //    strName:'',
            //    strDesig:'',
            //    strDept:'',
            //    strOffice:'',
            //    intPhone1:null,
            //    intPhone2:null
            //  }
          //  ]
             
          }
        });
  }


}

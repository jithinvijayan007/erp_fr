import {NgbModal,ModalDismissReasons,NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';
import { Component, ViewChild,OnInit,ElementRef ,ViewChildren, HostListener, Input} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FullComponent } from 'src/app/layouts/full/full.component';

import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-viewloyalitypoint',
  templateUrl: './viewloyalitypoint.component.html',
  styleUrls: ['./viewloyalitypoint.component.css']
})
export class ViewloyalitypointComponent implements OnInit {

  constructor(private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private fullObject: FullComponent,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ){}

  selectedCustomer;
  lstCustomer = [];
  selectedCustomerPhno = '';
  strCustomerName=''
  selectedCustomerId = '';
  strType="1"
  dctData={}
  blnShowData=false
  ngOnInit() {
    this.blnShowData=false

  }

  CustomerClicked(item) {
    this.selectedCustomerId = item.pk_bint_id;
    this.selectedCustomerPhno = item.int_mobile;
    this.strCustomerName = item.vchr_name;
  
    }
  customerChanged(event) {
      if (event === undefined || event === null) {
      this.lstCustomer = [];
      } else {
      if (event.length >= 7) {
        this.serviceObject
          .postData('salesreturn/get_details_customer/', {str_search: event})
          .subscribe(
            (response) => {
              this.lstCustomer = response['customer_list'];
            }
          );
      }
      }
  }

  getPoint(){
    if ((this.selectedCustomerId === '' || this.selectedCustomer!= this.strCustomerName)) {
      this.toastr.error('Valid customer number is required ');
      this.selectedCustomerId = null
      this.selectedCustomer = ''
      this.strCustomerName=''
      this.blnShowData=false
      
      return;
    }
    else{
      this.serviceObject
      .postData('loyaltycard/footer_loyalty_point/', {intCustomer:this.selectedCustomerId})
      .subscribe(
        (response) => {
          if(response.status==1){
            this.dctData=response['data'][0]
            if(Object.keys(this.dctData).length>0){
              this.blnShowData=true
            }
          }
          else{
            this.dctData={}
            this.blnShowData=false
          }
        }
      );
    }

  }
}

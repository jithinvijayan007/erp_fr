import { Component, OnInit } from '@angular/core';
import {ServerService} from 'src/app/server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewcustomer',
  templateUrl: './viewcustomer.component.html',
  styleUrls: ['./viewcustomer.component.scss']
})
export class ViewcustomerComponent implements OnInit {
  test=false;
  rating = 0;
  dctOccassions = [];
  dctRating = [];
data: any = {
  cust_address: '',
  cust_addtag  :  [],
  cust_alternatemail  :  '',
  cust_alternatemobile  :  null,
  cust_city  : '',
  cust_contactsrc  :  '',
  cust_customertype  :  '',
  cust_email  :  '',
  cust_fname  :  '',
  cust_lname  : '',
  cust_mobile: null,
  cust_salutation  :  '',
  cust_smsaccess:  false,
  id: null,
  cust_id : null,
  cust_name: '',
  name:''
};
  constructor(private serverService: ServerService,
    public router: Router) { }

  ngOnInit() {
    if(!localStorage.getItem('Tokeniser') && !localStorage.getItem('custid')) {
      // this.router.navigate(['/user/sign-in']);
    }
    if(!localStorage.getItem('custid')) {
      // this.router.navigate(['/crm']);
    }
    this.getCustomerData();


  }
  getCustomerData() {
    let id = {id: localStorage.getItem('custid')};
    // this.serverService.getSelectedCustomer(JSON.stringify(id))
    // .subscribe(
    //   (response) => {
    //     const dctResponse = response;
    //     this.data = dctResponse['cust_list'];
    //     this.dctOccassions = dctResponse['cust_occasions'];
    //     this.dctRating = dctResponse['cust_rating'];
    //     this.test = true;
    //   },
    //   (error) => {
    //   });

    //edited

    this.serverService.postData('customer/getselectedcustomer/',id).subscribe(
      (response) => { 
        const dctResponse = response;
        console.log(dctResponse);
        
            this.data = dctResponse['cust_list'];
            this.dctOccassions = dctResponse['cust_occasions'];
            // console.log(this.dctOccassions);
            // console.log(this.data);
            
            
            this.dctRating = dctResponse['cust_rating'];
            this.test = true;
          },
          (error) => {
          });

  }
  editCustomer() {
    // alert(this.data[0].id);
    localStorage.setItem('custid', this.data[0].id);
    // this.router.navigate(['/crm/editcustomer']);
  }

}

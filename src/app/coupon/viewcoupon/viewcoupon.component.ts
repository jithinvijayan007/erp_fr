import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
@Component({
  selector: 'app-viewcoupon',
  templateUrl: './viewcoupon.component.html',
  styleUrls: ['./viewcoupon.component.css']
})
export class ViewcouponComponent implements OnInit {
  
  dataLoaded=false;
  couponId= localStorage.getItem('couponRowId');
  couponDetails= [];
  dctPerms = {add:false, edit:false, view:false, delete:false};

  pageTitle: string = 'Coupon';

  constructor(
    private serviceObject: ServerService,
    public router: Router
  ) { }

  ngOnInit() {
    this.getCouponData(this.couponId);
  }

  getCouponData(id){
    console.log('kk',id);
    
    this.serviceObject.getData('coupon/get_coupon_by_id/?id='+id).subscribe(
      result => {
        if (result['status']== 1){
          this.couponDetails = result['list'][0]
          this.dataLoaded = true;
          this.couponDetails['dat_expiry'] =moment(this.couponDetails['dat_expiry']).format('DD-MM-YYYY')
        }
        console.log('data',this.couponDetails);
        
        

      }, (error ) => { if(error.status == 401){
      localStorage.setItem('previousUrl','/user/sign-in');
        
        this.router.navigate(['/user/sign-in']);} }  );
    }

}

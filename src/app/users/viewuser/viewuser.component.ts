import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit {

  ImageSrc = ''
  userid = localStorage.getItem('edituserid');
  userdetails= [];
  dataLoaded = false;
  hostname;
  blnPromoter =false;
  lstPrice=[]
  constructor(
    private serviceObject: ServerService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.hostname = this.serviceObject.hostAddress
    this.hostname = this.hostname.slice(0, this.hostname.length - 1)

    // if (!localStorage.getItem('Tokeniser')) {
    //   this.router.navigate(['/user/sign-in']);
    // }

    // localStorage.removeItem('edituserid');
    this.funcGetUserData(this.userid);

  }

  funcGetUserData(id) {

    // this.serviceObject.getUserDetailsToView(id).subscribe(
    //   result => {
    //       this.userdetails = result.json();
    //       this.ImageSrc = this.serviceObject.hostAddress + 'static/' + this.userdetails['userlist'][0].vchr_profile_pic;
    //       this.dataLoaded = true;
    //   }, (error ) => { alert(error) }  );
  
    //edited
  
    this.serviceObject.getData("user/get_user_list/?id=" +id).subscribe(
      data => {
          this.userdetails = data['lst_userdetailsview'];
          this.lstPrice= data['lst_price_per']

          if(this.userdetails[0]['fk_brand_id']==null){
            this.blnPromoter = false;
          }
          else{
            this.blnPromoter = true;
          }
          this.ImageSrc =  this.userdetails[0].vchr_profpic;
          // this.ImageSrc = this.serviceObject.hostAddress + 'media/' + this.userdetails[0].vchr_profpic;
          this.dataLoaded = true;
          
      }, (error ) => { alert(error) }  );
    }

}

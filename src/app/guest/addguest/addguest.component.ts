import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import * as moment from 'moment' ;
import { ToastrService } from 'ngx-toastr';
import { SalesListComponent } from 'src/app/sales-return/sales-list/sales-list.component';

@Component({
  selector: 'app-addguest',
  templateUrl: './addguest.component.html',
  styleUrls: ['./addguest.component.css']
})
export class AddguestComponent implements OnInit {
  strGroup='';
  strGroupSelected = '';
  intGroupId = null;
  lstGroup = [];
  datExpiry = '';
  timExpected:null;

  constructor(
    private serviceObject: ServerService,
    private router : Router,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.serviceObject.getData('user/group_list/').subscribe(
      (data) => {
        
   
      if (data['status'] == 1) {

        this.lstGroup = data['lst_group']
      
        
     
    } 

      },
     
    );

  }

  createGuest(){
   let dctData = {}
   let blnValidation = false;
   if(this.strGroup == '' || this.strGroup != this.strGroupSelected){
    this.toastr.error('Select valid group', 'Error!');
    blnValidation = true;
    return false;
   }
   if(this.datExpiry == ''){
    this.toastr.error('Expiry Date is required', 'Error!');
    blnValidation = true;
    return false;
   }
   if(this.timExpected == null){
    this.toastr.error('Session time is required', 'Error!');
    blnValidation = true;
    return false;
   }
   if(!blnValidation){
   dctData['intGroup'] = this.intGroupId;
   dctData['datExpiry'] = moment(this.datExpiry).format('YYYY-MM-DD')
   dctData['expiryTime'] = this.timExpected;

   
   
    this.serviceObject.postData('user/generate_guest/', dctData).subscribe(
      (response) => {
          if (response.status == 1) {
            swal.fire({
              type: 'success',
              title: 'Guest User created successfully',
              // text: 'User Name:'+ response['data']['username']+'gfvjhgfjhf',
              html:
              
              '<p id="increase" class="guestcolor">' +
                'User Name  :' +'</p>'+
                '<p class="guestcolorright">'
                +response['data']['username']+
              '</p>' +
              
              '<p id="stop" class="guestcolor">' +
                'Password   : ' + '</p>'+
                '<p class="guestcolorright">'+
                response['data']['password']+
              '</p>',
            })
            
          }
          else if (response.status == 0) {
            swal.fire('Error!',response['message'], 'error');
          }
      },
      (error) => {
        swal.fire('Error!','Something went wrong!!', 'error');
      });
    
    }


  }
  onChangeGroup(obj){ 
   
     
    this.intGroupId = obj.pk_bint_id;
    this.strGroupSelected = obj.vchr_name;

   
  
    
    if(this.strGroup == '' ){
      swal.fire('Error', 'Add group', 'error');
    }
  }

}

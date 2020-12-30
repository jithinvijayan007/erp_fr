
import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent implements OnInit {

  strItemName = ''; 
  dblAmount = 0;
  strRemarks = '';
  lstSpare = []
  intRequestId = null;
  strUserGroup = '';
  intUserStatus = 0;

  dctData = {};

  public form: FormGroup;
  constructor(private serverService: ServerService, private spinner: NgxSpinnerService , public toastr: ToastrService,private fb: FormBuilder,
    private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.intRequestId = parseInt(localStorage.getItem('spareRequestId'));
    this.strUserGroup = localStorage.getItem('group_name').toUpperCase();
    if (this.strUserGroup == 'PROCUREMENT TEAM'){
      this.intUserStatus =2
    }else{
      if (this.strUserGroup == 'CENTRAL MANAGER'){
        this.intUserStatus =1
      }
    }
    this.serverService.getData('service/spare_request_followup/?intRequestId='+this.intRequestId).subscribe(res=>{
      if(res['status']==1){
        this.dctData = res['data'][0];
      }
      else{
        Swal.fire('Error',res['data'],'error')
      }
    },(error=>{
      Swal.fire('Error','Server Error','error')
    }))
  }

  addSpareItems(){
    let tempData = true
    if ( this.strItemName.length == 0 || this.strItemName == undefined || this.strItemName == null){
      Swal.fire('Item name missing','Please enter the item name','error');
      return false;
    }else if (this.dblAmount == 0 || this.dblAmount == null || this.dblAmount == undefined) {
      Swal.fire('Quantity Missing','enter a valid quantity','error');
    }
    else{

      if (this.strRemarks == null || this.strRemarks == undefined){
        this.strRemarks = ''
      }
      
      let dctData={}
      dctData['strItemName'] = this.strItemName;
      dctData['intAmount'] = this.dblAmount;
      dctData['strRemarks'] = this.strRemarks;
    
      console.log(dctData['blnstatus']);
      
      dctData['intRequestId'] = this.intRequestId
      this.lstSpare.push(dctData);

      this.strItemName = '';
      this.dblAmount = 0;
      this.strRemarks = '';
    }
  }
  
   
  deleteSparePart(index,item){
    this.lstSpare.splice(index, 1);
  }

  saveSpare(){
    if(this.lstSpare.length == 0){
      this.toastr.error('Enter atleast one item', 'Error!');
      return ;
    }

    let dctData = {};
    dctData['intRequestId']=this.intRequestId;
    dctData['lstSpareData']=this.lstSpare;

    this.serverService.postData('service/spare_request_followup/',dctData).subscribe(res=>{
      if(res['status']==1){
        Swal.fire('Success !','Saved data successfully','success')
        this.router.navigateByUrl('/spare-request/request-list')
      }
      else{
        Swal.fire('Error',res['data'],'error')
      }
    },(error=>{
      Swal.fire('Error','Server Error','error')
    }))
  }

}

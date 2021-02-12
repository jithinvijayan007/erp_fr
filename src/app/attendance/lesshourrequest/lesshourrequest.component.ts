import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import * as moment from "moment";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-lesshourrequest',
  templateUrl: './lesshourrequest.component.html',
  styleUrls: ['./lesshourrequest.component.css']
})
export class LesshourrequestComponent implements OnInit {
  lstPolicyData=[];
  datApply;
  intType;
  constructor(
    public serverService:ServerService,
    public router: Router,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    this.getPolicyData();
  }
  getPolicyData(){
    this.spinner.show();
    this.serverService.getData('less_hour_deduction/late_hour/').subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstPolicyData = response['data'];
          }  
        },
        (error) => {  
          this.spinner.hide(); 
          Swal.fire('Error!','Something went wrong!!', 'error');
          
        });
  }
  saveData(){
    let dctData = {};
    if(this.datApply == null || !this.datApply){
      Swal.fire('Error!','Choose Date', 'error');
    } else if(this.intType ==0 || this.intType== null){
      Swal.fire('Error!','Select type', 'error');
    } else{
    dctData['datApply'] = moment(this.datApply).format('YYYY-MM-DD');
    dctData['intType'] = this.intType;
    this.spinner.show();
    this.serverService.postData('less_hour_deduction/late_hour/',dctData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status == 1) {
          Swal.fire('Success','Successfull', 'success');
          this.router.navigate(["/attendance/late_hour_requested_list"]);
        } 
        else{
          Swal.fire('Error!',response['reason'], 'error');
        }

      },
    (error) => {
      this.spinner.hide();

    });
  }
  }
  clearFields(){
    this.datApply = '';
    this.intType = 0;
  }
}

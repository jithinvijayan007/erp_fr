import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent implements OnInit {
  blnPaswrdShow=false;
  constructor(private serviceObject: ServerService,private spinner: NgxSpinnerService,
    private router: Router) { }

  loginform = true;
  recoverform = false;
  loginData;
  
  lstGroup=["CENTRAL MANAGER","QUALITY CHECK","PROCUREMENT TEAM","CUSTOMER CARE EXCUTIVE","RECEPTION","SERVICE ENGINEER","ADMIN"]
  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }
  ngOnInit() {
  }
  onSubmit(openMail, lockKey) {
    if (openMail.value !== '' && lockKey.value !== '') {
      this.loginData = {
        _UserId: openMail.value,
        _Password: lockKey.value,
      };
      this.spinner.show();
      this.serviceObject
        .getloginCheck('user/login/', this.loginData)
        .subscribe(
          (response: any) => {
            const logCheck = response;
            this.spinner.hide();
            if (logCheck['status'] === 1) {
              
              localStorage.setItem('Tokeniser', logCheck['token']);
              localStorage.setItem('Name', logCheck['userdetails']['Name']);
              localStorage.setItem('username',openMail.value );
              localStorage.setItem('Email', logCheck['userdetails']['email']);
              localStorage.setItem('BranchId', logCheck['userdetails']['branch_id']);
              localStorage.setItem('BranchName', logCheck['userdetails']['branch_name']);
              localStorage.setItem('BranchCode', logCheck['userdetails']['branch_code']);
              // localStorage.setItem('BranchCode', logCheck['userdetails']['branch_code']);
              localStorage.setItem('group_permissions', JSON.stringify(logCheck['lst_menu_data']));
              localStorage.setItem('companyId', logCheck['userdetails']['company_id']);
              localStorage.setItem('int_user_id', logCheck['userdetails']['int_user_id']);
              localStorage.setItem('group_name', logCheck['userdetails']['group_name']);
              localStorage.setItem('BranchType', logCheck['userdetails']['branch_type']);

              localStorage.setItem('bln_indirect_discount', 'false');
              // localStorage.setItem('bln_indirect_discount', JSON.stringify(logCheck['userdetails']['bln_indirect_discount']));
              localStorage.setItem('blnDirectDiscount', 'true');
              // localStorage.setItem('blnDirectDiscount', logCheck['userdetails']['bln_direct_discount']);

              // this.router.navigateByUrl('company/addcompany');
              // this.router.navigateByUrl('dayclosure/dayclosure');
              // console.log(logCheck['userdetails']['group_name'],"grp");
              
              if(this.lstGroup.includes(logCheck['userdetails']['group_name'])){
                localStorage.setItem('previousUrl','/saleslist');
                localStorage.setItem('menuName','Master');

                this.router.navigateByUrl('service-main/list-service');

              }
              else{
                localStorage.setItem('previousUrl','salesreport/dailysalesreport');
                localStorage.setItem('menuName','Reports');

                this.router.navigateByUrl('salesreport/dailysalesreport');
              }
              

            } else {
              swal.fire({
                position: 'center',
                type: 'error',
                text: 'Invalid username or password',
                // showConfirmButton: true,
              });
            }
          },
          error => {
            this.spinner.hide();
          }
        );
    } else {
      swal.fire({
        title: 'Error',
        text: 'E-mail and password mandatory',
        type: 'error',
        showConfirmButton: false,
        timer: 2000
      });
    }
    }
}

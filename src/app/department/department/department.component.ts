import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import Swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  strDepartment;
  strDepartmentCode='';
  lstDepartmentData=[];
  intDepartmentId=null;
  departmentAction='save';
  lstPermission=[];
  blnAdd=true;
  blnView=true;
  blnEdit=true;
  blnDelete=true;
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {

          //_______________________setting up permissions___________________________
          // this.lstPermission = JSON.parse(localStorage.getItem("permission"));    
          // this.lstPermission.forEach((item, index, array) => {
          // if (item["NAME"] == "Department") {
          //   this.blnAdd = item["ADD"];
          //   this.blnView = item["VIEW"];
          //   this.blnEdit = item["EDIT"];
          //   this.blnDelete = item["DELETE"];
          //   }
          // });
      //_______________________setting up permissions___________________________
    this.getDepartmentList();
  }

  saveDepartment(){           //saves a new deparment 

    if(!this.strDepartment){
      Swal.fire("Error!","Enter Department Name","error");
      return false;
    }
    else if(!this.strDepartmentCode){
      Swal.fire("Error!","Enter Department Code","error");
      return false;
    }
    else if(this.strDepartmentCode.length>15){
      Swal.fire("Error!","Maximum Code Length 15","error");
      return false;
    }

    let dctTempData={}
    dctTempData['strDepartment']=this.strDepartment;
    dctTempData['strDepartmentCode']=this.strDepartmentCode;
    this.spinner.show();
    this.serverService.postData('department/add_department/', dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
        if (response['status'] == 1){
          Swal.fire('Success!', 'Department Added  ', 'success');
          this.clearFields();
          this.getDepartmentList();

        }
        else{
          Swal.fire('Error!',response['reason'], 'error');
          return false;
        }
      },
      (error) => {
        this.spinner.hide();
        Swal.fire('Error!', 'error', 'error'); 

      });
  }
  clearFields(){
    this.strDepartment='';
    this.strDepartmentCode='';
    this.intDepartmentId=null;
    this.departmentAction='save'
  }

  getDepartmentList(){                //lists current departments
    this.lstDepartmentData=[];

    this.serverService.getData('department/list_departments/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDepartmentData=response['lst_department'];
          }  
      },
      (error) => {   
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  deleteDepartment(item){         //deletes a particular department
    let dctTempData={}

    dctTempData['strDepartment']=item.vchr_name;
    dctTempData['strDepartmentCode']=item.vchr_code;
    dctTempData['intDepartmentId']=item.pk_bint_id;
    this.spinner.show();
    this.serverService.patchData('department/add_department/',dctTempData)
      .subscribe(
          (response) => {
            this.spinner.hide();
             if (response.status === 1) {
              Swal.fire('Department deleted successfully');
              this.getDepartmentList();
            }
           else if (response.status === 0) {
              Swal.fire('Department deletion failed');
      }
  },
  (error) => {
    this.spinner.hide();
    // console.log('response');

  });
  }


  editDepartment(item){                 // gets the datas of a particular department that is to be  modified
    
    this.departmentAction='edit';
    this.strDepartment=item['vchr_name'];
    this.strDepartmentCode=item['vchr_code'];
    this.intDepartmentId=item['pk_bint_id'];
  }
  saveDepartmentChanges(){  // edit department
    let dctTempData={}
    
    if(!this.strDepartment){
      Swal.fire("Error!","Enter Department Name","error");
      return false;
    }
    else if(!this.intDepartmentId){
      Swal.fire("Error!","Enter Department","error");
      return false;
    }
    else if(!this.strDepartmentCode){
      Swal.fire("Error!","Enter Department Code","error");
      return false;
    }
    else if(this.strDepartmentCode.length>15){
      Swal.fire("Error!","Maximum Code Length 15","error");
      return false;
    }

    dctTempData['strDepartment']=this.strDepartment;
    dctTempData['strDepartmentCode']=this.strDepartmentCode;
    dctTempData['intDepartmentId']=this.intDepartmentId;
    this.spinner.show();
    this.serverService.putData('department/add_department/', dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
        if (response['status'] == 1){
          Swal.fire('Success!', 'Department Edited  ', 'success');
          this.clearFields();
          this.departmentAction='save'
          this.getDepartmentList();
        }
      },
      (error) => {
        this.spinner.hide();
        Swal.fire('Error!', 'error', 'error'); 

      });
  }
}

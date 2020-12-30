import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  companyId = Number(localStorage.getItem("companyId"));
  blnDataResponse = true;
 
  constructor(
    private serviceObject: ServerService,
    private fb: FormBuilder,
    public router: Router,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }
  lstPermission=JSON.parse(localStorage.group_permissions)
  blnView=false
  blnEdit=false
  blnDelete=false
  blnAdd=false
  userListJsonData = [];
  displayedColumns = [
    'username',
    "fullname",
    "bint_phone",
    'fk_group__vchr_name',
    "action"
  ];
  dataSource = new MatTableDataSource();
  


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  selectedOption = "";
  // models for edit user
  firstname;
  lastname;
  email;
  contactno;
  role;
  assignto = [];
  area;
  targetCompleteDuration;
  enquiryTarget;
  bookingTarget;
  password;
  confirmPassword;

  reportingToList;
  public form: FormGroup;
  userdetails = [];
  showEditData = false;

  editingUserId;

  
  blnAssign;


  ngOnInit() {

    this.funcGetUserList();
    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "User List") {
        this.blnAdd = item["ADD"];
        this.blnEdit= item["EDIT"];
        this.blnDelete = item["DELETE"];
        this.blnView = item["VIEW"]
      }
    });
  }
  
  funcGetUserList() {
    let dctData = {};
    dctData['id'] = this.companyId;

    // dctData['assign'] = this.blnAssign;
    this.serviceObject.getData('user/get_user_list/').subscribe(
      result => {
        if(result['status'] == 1) {
          this.userListJsonData = result['lst_userdetails'];
          this.dataSource = new MatTableDataSource(this.userListJsonData);

          this.dataSource.paginator = this.paginator;

          this.dataSource.paginator.firstPage();

          this.dataSource.sort = this.sort;
        }
      },
      error => {
        this.blnDataResponse = false;
        swal.fire("Error", error, "error");
      }
    );
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  viewUserData(id) {
    localStorage.setItem('edituserid', id);
    localStorage.setItem('previousUrl','user/viewuser');

    this.router.navigate(['user/viewuser']);
  }
  editUserData(id) {

    localStorage.setItem('edituserid', id);
    localStorage.setItem('previousUrl','user/edituser');
    
    this.router.navigate(["user/edituser"]);
  }

  deleteUserData(id) {
    swal.fire({
      title: "delete",
      text: "Do you want to delete the user?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(result1 => {
      if (result1.value) {
        const pusheditems = {};
        pusheditems["id"] = id;
      

        this.serviceObject.postData("user/changeuseractivestatus/",pusheditems).subscribe(
          response => {
            // const result = res.json();
            if (response["status"] != 1) {
              // swal.fire("", response["status"], "error");
            } else {
              swal.fire("Deleted!", "User deleted successfully", "success");
              this.funcGetUserList();
            }
          },
          error => {
            swal.fire("Error", error, "error");
          }
        );
      }
    });
  }

    exportData(){
      this.spinnerService.show();
      
      this.serviceObject.postData('user/get_user_list/',{}).subscribe(
        (response) => {
            if (response.status == 1)
            { 
              this.spinnerService.hide();
              var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = response['file'];
              a.download = 'report.xlsx';
              a.click();
              // window.URL.revokeObjectURL(this.dctReportData);
              a.remove();
                  
              // this.snotifyService.success('Successfully Exported');  
              this.toastr.success('Successfully Exported', 'Success!');
               
             
            }  
            
            else if (response.status == 0) 
            {
              this.spinnerService.hide();
            //  this.blnShowData=false;
             swal.fire('Error!',response['message'], 'error');
            }
        },
        (error) => { 
          this.spinnerService.hide();  
         swal.fire('Error!','Something went wrong!!', 'error');
        });
     
    }
}

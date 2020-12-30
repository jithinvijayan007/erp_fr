// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-branchlist',
  templateUrl: './branchlist.component.html',
  styleUrls: ['./branchlist.component.css']
})
export class BranchlistComponent implements OnInit {

  source: LocalDataSource;
  data ;
  activeStatus ="";
  strBranchCategory;
  strBranch;
  lstBranches;
  lstBranchCategories;
  blnShowData=false;
  lstActiveData=[];
  lstDeactiveData=[]
  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]
  dctDelete={}
  constructor(
    private serviceObject: ServerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,
    ) {
    this.source = new LocalDataSource(this.data); // create the source
     }
     ngOnInit(){
      //branch
      // this.serviceObject.getData('branch/branchapi/').subscribe(
      //   (data) => {
      //   // const result = data.json();
      //   if (data['status'] == 1) {
      //     this.blnShowData=true;
      //     this.lstBranches = data['lst_branch']
      // }
      // else{
      //   this.blnShowData=false;
      // }
      //   },
      // );
      // //branch category
      // this.serviceObject.getData('branch/branch_category_list/').subscribe(
      //   (data) => {
      //   // const result = data.json();
      //   if (data['status'] == 1) {

      //     this.lstBranchCategories = data['data']

      // }

      //   },
      // );

      this.getData();
      let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Branch List") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    if(dct_perms.EDIT==true ){
      this.lstCustom=  [{ name: 'ourCustomAction', title: '<i class="ti-pencil text-info m-r-10"></i>' }]
         
    }
    if(dct_perms.DELETE==true){
      this.dctDelete=  {
        confirmDelete: true,
        deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
        saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
        cancelButtonContent: '<i class="ti-close text-danger"></i>',
        position: 'right'
      }
      
      this.settings.delete=this.dctDelete
    }
    else{
      this.settings.actions['delete']=false
    }
    
    this.settings.actions.custom = this.lstCustom

    }

    settings = {
      delete:this.dctDelete, 
      actions: {
        add: false,
        edit: false,
        custom:this.lstCustom, 
        position: 'right'

        },
      // edit: {
      //   confirmSave: true,
      //   editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
      //   saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      //   cancelButtonContent: '<i class="ti-close text-danger"></i>',
      //   position: 'right'
      // },
      columns: {
        vchr_code: {
          title: 'Code',


        },
        vchr_name: {
          title: 'Branch Name',

        },
        vchr_address: {
          title: 'Address',

        },
        vchr_email: {
          title: 'Email',

        },
        vchr_phone: {
          title: 'Phone No',

        },
        fk_category__vchr_name: {
          title: 'Category',

        },
      },
    };


    getData(){
      this.spinnerService.show();

      this.serviceObject.getData('branch/branchapi/').subscribe(
        (response) => {
          this.spinnerService.hide();

            if (response.status == 1) {
             this.data=response['lst_branch'];
             this.blnShowData=true;
             this.source = new LocalDataSource(this.data); // create the source

               for(let item in this.data){
                 if(this.data[item].int_status ===0){
                   this.lstActiveData.push(this.data[item])
                 }
                 else if(this.data[item].int_status ===2) {
                   this.lstDeactiveData.push(this.data[item])
                 }


               }

            }
            else if (response.status == 0) {

            }
        },
        (error) => {
          this.spinnerService.hide();

          swal.fire('Error!','Something went wrong!!', 'error');


        });
    }
  onDeleteConfirm(event) {
    
    swal.fire({
      title: 'Delete',
      text: "Are you sure want to delete ?" ,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Delete it!",
    }).then(result => {
      if (result.value) {
        event.confirm.resolve();
        
        let dctData={}
        dctData['intId']=event.data['pk_bint_id']
        
        this.serviceObject.patchData('branch/branchapi/',dctData).subscribe(
          (response) => {
            if (response.status == 1) {
              
              swal.fire({
                position: "center",
                type: "success",
                text: "Data Deleted successfully",
                showConfirmButton: true,
              });
            }
            else if (response.status == 0) {
              swal.fire('Error!','Something went wrong!!', 'error');
            }
          },
          (error) => {
            swal.fire('Error!','Something went wrong!!', 'error');
          });
        };
        
      });
    }

    onChangeCategory() {
      if (this.strBranchCategory==null){
        swal.fire('Error!','error', 'error');
        
      }
    }

    onChangeBranch() {
      if(this.strBranch== null){
        swal.fire('Error!','error', 'error');
      }
    }
    
    onEdit(event) {
      
      localStorage.setItem('branchId',event.data.pk_bint_id);
      localStorage.setItem('previousUrl','branch/editbranch');
      this.router.navigate(['branch/editbranch']);
    }

    statusChanged(){
      if(this.activeStatus==='0'){
        
        this.source = new LocalDataSource(this.lstActiveData);
      }
      else if(this.activeStatus==='2'){
        
        this.source = new LocalDataSource(this.lstDeactiveData);
      }
      else{
        this.source =new LocalDataSource(this.data)
      }
    }
  }
  

// onSaveConfirm(event) {
//   // console.log("Edit Event In Console")
//   // console.log(event);
//   let dctData={}
//   dctData['strName']=event.newData['vchr_name']
//   dctData['strAddress']=event.newData['vchr_address']
//   dctData['strEmail']=event.newData['vchr_email']
//   dctData['intContact']=event.newData['vchr_phone']
//   dctData['strCode']=event.newData['vchr_code']
//   dctData['intId']=event.newData['pk_bint_id']


//   this.serviceObject.patchData('branch/branchapi/',dctData).subscribe(
//     (response) => {
//         if (response.status == 1) {

//           swal.fire({
//             position: "center",
//             type: "success",
//             text: "Data Updated successfully",
//             showConfirmButton: true,
//           });
//           event.confirm.resolve();
//         }
//         else if (response.status == 0) {
//           swal.fire('Error!','error', 'error');
//         }
//     },
//     (error) => {
//       swal.fire('Error!','error', 'error');
//     });

// }

  // getBranchData() {
  //   let dctData= {}
  //   // dctData['strBranchName']=this.strBranch;
  //   // dctData['strBranchCategory']=this.strBranchCategory;
  //   dctData['activestatus'] = this.activeStatus;
  //   this.serviceObject.postData('branch/branchapi/', dctData).subscribe(
  //     (response) => {
  //         if (response.status == 1) {
  //           this.data=response['lst_branch'];
  //           this.source = new LocalDataSource(this.data);
  //           this.router.navigate(['branch/branchlist']);


  //         }
  //         else if (response.status == 0) {
  //           swal.fire('Error!', response['message'], 'error');

  //           // this.toastr.error(response['message']);
  //         }
  //     },
  //     (error) => {
  //       swal.fire('Error!','error', 'error');

  //     });


  // }
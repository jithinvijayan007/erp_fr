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
  selector: 'app-brandlist',
  templateUrl: './brandlist.component.html',
  styleUrls: ['./brandlist.component.css']
})
export class BrandlistComponent implements OnInit {
  lstPermission=JSON.parse(localStorage.permission)
  blnAdd=false
  ngOnInit(){
    this.getData()
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Add Brand") {
        this.blnAdd = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    if(dct_perms.EDIT==true && dct_perms.DELETE==true ){
      this.settings.actions['edit']=true
      this.settings.actions['delete']=true
    }
    else if(dct_perms.EDIT==true && dct_perms.DELETE==false ){
      this.settings.actions['edit']=true
      this.settings.actions['delete']=false
    }
    else if(dct_perms.EDIT==false && dct_perms.DELETE==true ){
      this.settings.actions['edit']=false
      this.settings.actions['delete']=true
    }
    else{
      this.settings.actions['edit']=false
      this.settings.actions['delete']=false
    }
  }
  source: LocalDataSource;
  data ;
  strBrand:'';

  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source

     }



  settings = {
    hideSubHeader: true,
    delete: {
      confirmDelete: true,
      deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>'
    },
    actions: {
      add: false,
      position: 'right'
      },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>'
    },
    columns: {
      // vchr_code: {
      //   title: 'Code',
      // },
      vchr_name: {
        title: 'Brand Name',
        filter: false
      }
    },
  };

  onDeleteConfirm(event) {
    // console.log("Delete Event In Console")
    // console.log(event);

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
      this.spinnerService.show();

      this.serviceObject.patchData('brands/add_brands/',dctData).subscribe(
        (response) => {
          this.spinnerService.hide();

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
          this.spinnerService.hide();

        swal.fire('Error!','Something went wrong!!', 'error');
        });
      };

    });
  }

  onCreateConfirm(event) {
    // console.log("Create Event In Console")
    // console.log(event);


    if(!event.newData['vchr_name']){
      swal.fire('Error!', 'Enter Brand Name', 'error');

    }
    else{
      let dct_data = {}
      dct_data['strName']=event.newData['vchr_name']
      this.serviceObject.postData('brands/add_brands/', dct_data)   .subscribe(
        (response) => {
            if (response.status == 1) {
              swal.fire({
                position: "center",
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,
              });
              // this.router.navigate(['brand/brandlist']);
             event.confirm.resolve();
             this.strBrand=''
             this.getData()
            }
            else if (response.status == 0) {
              swal.fire('Error!', response['reason'], 'error');

              // this.toastr.error(response['message']);
            }
        },
        (error) => {
          swal.fire('Error!','Something went wrong!!', 'error');

        });
    }
  }

  onSaveConfirm(event) {
    // console.log("Edit Event In Console")
    // console.log(event);
    let dctData={}
    dctData['strName']=event.newData['vchr_name']
    dctData['intId']=event.newData['pk_bint_id']


    this.serviceObject.putData('brands/add_brands/',dctData).subscribe(
      (response) => {
          if (response.status == 1) {

            swal.fire({
              position: "center",
              type: "success",
              text: "Data Updated successfully",
              showConfirmButton: true,
            });
            event.confirm.resolve();
          }
          else if (response.status == 0) {
            swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {
        swal.fire('Error!','Something went wrong!!', 'error');
      });

  }


  getData(){

    this.serviceObject.getData('brands/add_brands/').subscribe(
      (response) => {
          if (response.status == 1) {
           this.data=response['data'];
           this.source = new LocalDataSource(this.data); // create the source


          }
          else if (response.status == 0) {

          }
      },
      (error) => {
        swal.fire('Error!','Something went wrong!!', 'error');

      });
  }

  addBrand()
  {
    if(!this.strBrand){
      swal.fire('Error!', 'Enter Brand Name', 'error');

    }
    else{
      let dct_data = {}
      dct_data['strName']=this.strBrand
      this.serviceObject.postData('brands/add_brands/', dct_data)   .subscribe(
        (response) => {
            if (response.status == 1) {
              swal.fire({
                position: "center",
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,
              });
              // this.router.navigate(['brand/brandlist']);
             this.strBrand=''
             this.getData()
            }
            else if (response.status == 0) {
              swal.fire('Error!', response['reason'], 'error');

              // this.toastr.error(response['message']);
            }
        },
        (error) => {
          swal.fire('Error!','Something went wrong!!', 'error');

        });
    }

  }
  cancel(){
    this.strBrand=''
  }
}

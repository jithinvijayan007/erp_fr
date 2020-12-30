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
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.css']
})
export class ListproductComponent implements OnInit {

  source;
  data = [];
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
    this.source = new LocalDataSource(this.data);
   }

  ngOnInit() {
    this.getListData();
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Product List") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    if(dct_perms.EDIT==true ){
      this.lstCustom= [{ name: 'ourCustomAction', title: '<i class="ti-pencil text-info m-r-10"></i>' }]
         
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
    delete: this.dctDelete,
    actions: {
      add: false,
      edit: false,
      // delete: false,
      custom: this.lstCustom,
      position: 'right'
    },
    // edit: {
    //   confirmSave: true,
    //   editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
    //   saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
    //   cancelButtonContent: '<i class="ti-close text-danger"></i>'
    // },
    columns: {
      vchr_name: {
        title: 'Product',
      },
      fk_category__vchr_name: {
        title: 'Category',
      },
      json_sales:{
        title: 'Sales',
      }
    },
  };

  getListData(){
    this.spinnerService.show();
    this.serviceObject.getData('products/add_product/').subscribe(
      (response) => {
        this.spinnerService.hide();
          if (response.status == 1) {
           this.data=response['data'];
           this.source = new LocalDataSource(this.data); // create the source
           

          }  
          else if (response.status == 0) {
            swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => { 
        this.spinnerService.hide();
        swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  onDeleteConfirm(event) {
    let dctData={}
      dctData['pk_bint_id']=event.data['pk_bint_id']

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
        this.serviceObject.patchData('products/add_product/',dctData).subscribe(
          (response) => {
              if (response.status == 1) {
                
                swal.fire({
                  position: "center", 
                  type: "success",
                  text: "Data Deleted successfully",
                  showConfirmButton: true,  
                });
                this.getListData();     
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

  onEdit(event) {
    
    localStorage.setItem('productId',event.data.pk_bint_id);
    localStorage.setItem('previousUrl','product/addproduct');
    
    this.router.navigate(['product/addproduct']);
  }

}

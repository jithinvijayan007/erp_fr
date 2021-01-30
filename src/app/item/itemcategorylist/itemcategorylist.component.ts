// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-itemcategorylist',
  templateUrl: './itemcategorylist.component.html',
  styleUrls: ['./itemcategorylist.component.css']
})
export class ItemcategorylistComponent implements OnInit {

  data ;
  source: LocalDataSource;
  objectKeys = Object.keys;


  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,) {
    // this.source = new LocalDataSource(this.data); // create the source
      
  }
 dctData={}
 lstPermission=JSON.parse(localStorage.group_permissions)
 lstCustom=[]
 dctDelete={}
  settings = {
    delete: this.dctDelete,
    actions: {
      add: false,
      edit: false,
      custom: this.lstCustom,
      position: 'right'
    },
   
    columns: {
      category: {
        title: 'Category Name',
      },
      vchr_hsn_code: {
        title: 'HSN Code',
      },
      vchr_sac_code: {
        title: 'SAC Code',
      },
      spec: {
        title: 'Specification',
      },
      tax: {
        title: 'Tax',
      },
    },
  };

  ngOnInit(){

    this.getData()

  //  this.dctData['lstAllTax']=['qwe','rty','uio']
  //  this.dctData['lstAllTax'].forEach(element => {
  //   this.settings.columns[element]={}
  //   this.settings.columns[element]['title']=element
  // });
  let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Item Category List") {
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
      this.dctDelete= {
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
  getData()
  {
   this.dctData['item']={}
   this.dctData['data']=[]
   this.dctData['tax_master']={}
   
   this.serviceObject.getData('itemcategory/add_category/?strUpdate='+0).subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.data = response['data'];
           
            for(let item of Object.keys(this.data))
            {
              
              if(this.data[item]['specification'].length>0){
                this.dctData['item']['spec']=(this.data[item]['specification'].toString())
              }
              else{
                
                this.dctData['item']['spec']= '---'
              }
              this.dctData['item']['category']=(this.data[item]['vchr_item_category'].replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}))

              if (this.data[item]['vchr_hsn_code']){
                this.dctData['item']['vchr_hsn_code'] = this.data[item]['vchr_hsn_code']
              }else {
                this.dctData['item']['vchr_hsn_code'] = '---'
              }
              if (this.data[item]['vchr_sac_code']){
                this.dctData['item']['vchr_sac_code'] = this.data[item]['vchr_sac_code']
              }else {
                this.dctData['item']['vchr_sac_code'] = '---'
              }
              
              this.dctData['tax_master']=this.data[item]['tax_master']
              
              if(Object.keys(this.dctData['tax_master']).length>0)
              {
                for(let i of Object.keys(this.dctData['tax_master']))
                {
                  if(this.dctData['item']['tax'])
                  {
                    this.dctData['item']['tax']=this.dctData['item']['tax']+ i+" : "+this.dctData['tax_master'][i]+" , ";
                  }
                  else
                  {
                    this.dctData['item']['tax']=i+" : "+this.dctData['tax_master'][i]+" , ";
                  }
                }
                
                if(this.dctData['item']['tax']){
                  this.dctData['item']['tax']= this.dctData['item']['tax'].slice(0,-2)
                }
              }
              else{
                this.dctData['item']['tax']= '---'
              }
              this.dctData['item']['id']=item
              this.dctData['data'].push(this.dctData['item'])
              this.dctData['item']={}
            }  
            
            this.source = new LocalDataSource(this.dctData['data']); // create the source
          }  
          else if (response.status == 0) {
           swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
        
      });
      
  }
  onEdit(event)
  {
    localStorage.setItem('rowId',event.data.id);
    localStorage.setItem('previousUrl','item/edititemcategory');
    
    this.router.navigate(['item/edititemcategory']);
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
      dctData['pk_bint_id']=parseInt(event.data['id'])
      
      this.serviceObject.patchData('itemcategory/add_category/',dctData).subscribe(
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

}

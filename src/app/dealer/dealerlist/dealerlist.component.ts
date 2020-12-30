// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dealerlist',
  templateUrl: './dealerlist.component.html',
  styleUrls: ['./dealerlist.component.css']
})
export class DealerlistComponent implements OnInit {


  data = [];
  source: LocalDataSource;
  objectKeys = Object.keys;
  intCreditDays:null;
  intCreditLimit:null;
  strCategory:'';
  intActive="0";
  strRemarks;
  lstCategory=[]
  registerForm: FormGroup;
  IntCategoryId;
  selectedCategory;
  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source

  }
  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]
  dctDelete={}
 dctData={}
 blnShowData=true;
  settings = {
    hideSubHeader: true,
    delete:this.dctDelete,
    // delete: {
    //   confirmDelete: true,
    //   deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
    //   saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
    //   cancelButtonContent: '<i class="ti-close text-danger"></i>',
    //   position: 'right'
    // },
    actions: {
      add: false,
      edit: false,
      custom:this.lstCustom,
      // custom: [
      //   { name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},
      //   { name: 'editrecord', title: '<i class="ti-pencil text-info m-r-10"></i>' },
      //   { name: 'history', title: '<i class="fas fa-history"></i>' }
      // ],
      position: 'right'
    },

    columns: {
      vchr_name: {
        title: 'Dealer Name',
      },
      vchr_code: {
        title: 'Dealer Code',
      },
      // vchr_from: {
      //   title: 'Dealer From',
      // },
      int_po_expiry_days: {
        title: 'PO Expiry Days',
      },

    },
  };
  categoryChanged(item) {
    this.IntCategoryId = item.pk_bint_id;
    this.strCategory = item.vchr_name;
  }
  ngOnInit(){
    console.log(localStorage,"local");
    
    this.getData(null,null,'',"1")
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false,'HISTORY':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Dealer List") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    
    if(dct_perms.VIEW==true && dct_perms.EDIT==true ){
      this.lstCustom= [
        { name: 'viewrecord', title: '<i class="fa fa-eye" title="View Details"></i>'},
        { name: 'editrecord', title: '<i class="ti-pencil text-info m-r-10" title="Edit"></i>' },
        { name: 'listhistory', title: '<i class="fa fa-history" title="History"></i>'},
      ]
    }
    else if(dct_perms.VIEW==false && dct_perms.EDIT==true ){
      this.lstCustom= [
        // { name: 'viewrecord', title: '<i class="fa fa-eye" title="View Details"></i>'},
        { name: 'editrecord', title: '<i class="ti-pencil text-info m-r-10" title="Edit"></i>' },
        { name: 'listhistory', title: '<i class="fa fa-history" title="History"></i>'},
      ]
    }
    else if(dct_perms.VIEW==true && dct_perms.EDIT==false ){
      this.lstCustom= [
        { name: 'viewrecord', title: '<i class="fa fa-eye" title="View Details"></i>'},
        // { name: 'editrecord', title: '<i class="ti-pencil text-info m-r-10" title="Edit"></i>' },
        { name: 'listhistory', title: '<i class="fa fa-history" title="History"></i>'},
      ]
    }
    else{
      this.lstCustom= [
        // { name: 'viewrecord', title: '<i class="fa fa-eye" title="View Details"></i>'},
        // { name: 'editrecord', title: '<i class="ti-pencil text-info m-r-10" title="Edit"></i>' },
        { name: 'listhistory', title: '<i class="fa fa-history" title="History"></i>'},
      ]
    }

    if(dct_perms.DELETE==true){
      this.dctDelete= {
        confirmDelete: true,
        deleteButtonContent: '<i class="ti-trash text-danger m-r-10" title="Delete"></i>',
        saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
        cancelButtonContent: '<i class="ti-close text-danger"></i>',
        position:'right',
  
      }
      this.settings.delete=this.dctDelete
    }
    else{
      this.settings.actions['delete']=false
    }
    
    this.settings.actions.custom = this.lstCustom
  }
  getData(days,limit,category,active)
  {
   this.dctData['data']={}
   if(days){
    this.dctData['data']['intCreditDays']= days
   }
   if(limit){
   this.dctData['data']['intCreditLimit']= limit
  }
  if(category){
    this.dctData['data']['strCategory']=category
   this.dctData['data']['fk_category']=this.IntCategoryId

  }
   this.dctData['data']['intActive']=active


  //  console.log("data", this.dctData['data']);

    this.serviceObject.postData('dealer/list_dealer/', this.dctData['data']).subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.data=response['list_dealer'];
            this.lstCategory=response['dealer_category'];

            if(this.data.length>0){
              this.blnShowData=true;
             this.source = new LocalDataSource(this.data); 
             }
             else{
              this.blnShowData=false;
             }
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
    // console.log(event,"evnt");

    localStorage.setItem('dealerRowId',event.pk_bint_id);
    localStorage.setItem('previousUrl','dealer/editdealer');
    this.router.navigate(['dealer/editdealer']);
  }
  onView(event){


    localStorage.setItem('dealerRowId',event.pk_bint_id);
    localStorage.setItem('previousUrl','dealer/viewdealer');
    
    this.router.navigate(['dealer/viewdealer']);
  }
  onCustomAction(event) {
    switch ( event.action) {
      case 'viewrecord':
        this.onView(event.data);
        break;
      case 'editrecord':
        this.onEdit(event.data);
        break;
      case 'listhistory':
        this.onHistory(event.data);
        break;
    }
  }
  onHistory(event)
  {
    // console.log(event,"evnt");
    localStorage.setItem('dealerRowId',event.pk_bint_id);
    localStorage.setItem('previousUrl','dealer/dealerhistory');
    
    this.router.navigate(['dealer/dealerhistory']);
  }
  search(){

    this.getData(this.intCreditDays,this.intCreditLimit,this.strCategory,this.intActive)
  }

  onDeleteConfirm(event) {
// console.log(event,"event");


    swal.fire({
      title: 'Delete',
      input: 'text',
      text: "Are you sure want to delete ?" ,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Delete it!",
      inputPlaceholder: 'Enter Reason!',
      inputValidator: (text) => {
        this.strRemarks = text;
    return !text && 'You need to write something!'
   },
    }).then(result => {
      if (result.value) {
      event.confirm.resolve();

      let dctData={}
      dctData['remarks'] =  this.strRemarks;
      dctData['pk_bint_id']=parseInt(event.data['pk_bint_id'])
      // console.log( this.strRemarks," this.strRemarks");
      this.serviceObject.postData('dealer/delete_dealer/',dctData).subscribe(
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

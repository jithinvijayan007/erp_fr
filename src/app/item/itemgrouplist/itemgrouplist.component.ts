import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ServerService } from '../../server.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itemgrouplist',
  templateUrl: './itemgrouplist.component.html',
  styleUrls: ['./itemgrouplist.component.css']
})
export class ItemgrouplistComponent implements OnInit {

  source;
  data;
  strGroup;
  selectedFrom;
  selectedTo;
  datFrom;
  datTo;
  blnShowData=false;
  lstPermission=JSON.parse(localStorage.group_permissions)
  blnAdd=false
  constructor(
    private serviceObject:ServerService,
  ) { 
    this.source=new LocalDataSource();
  }

  ngOnInit() {
    let ToDate = new Date()
    let FromDate = new Date()
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    this.datTo = ToDate
    this.datFrom = firstDay
    this.getListData();
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Item Group List") {
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

  settings = {
    delete: {
      confirmDelete: true,
      deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      position: 'right'

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
      vchr_item_group: {
        title: 'Item Group Name',
        filter: false
      }
    },
  };

  onDeleteConfirm(event) {

    let dctData = {}
    dctData['intId'] = event.data['pk_bint_id']

    Swal.fire({
      title: 'Delete',
      text: "Are you sure want to delete ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Delete it!",
    }).then(result => {
      if (result.value) {
        this.serviceObject.patchData('itemgroup/additemgroup/', dctData).subscribe(
        (response) => {
          if (response.status == 1) {

            Swal.fire({
              position: "center",
              type: "success",
              text: "Data Deleted successfully",
              showConfirmButton: true,
            });
            this.getListData();

          }
          else if (response.status == 0) {
            Swal.fire('Error!', 'error', 'error');
          }
        },
        (error) => {
          Swal.fire('Error!', 'error', 'error');
        });
      };

    });
  }

  onCreateConfirm(event) {

    if (!event.newData['vchr_name']) {
      Swal.fire('Error!', 'Enter Group Name', 'error');

    }
    else {
      let dct_data = {}
      dct_data['strName'] = event.newData['vchr_name']
      this.serviceObject.postData('itemgroup/additemgroup/', dct_data).subscribe(
        (response) => {
          if (response.status == 1) {
            Swal.fire({
              position: "center",
              type: "success",
              text: "Data saved successfully",
              showConfirmButton: true,
            });
            // this.router.navigate(['brand/brandlist']);
            event.confirm.resolve();
            this.strGroup = '';
            this.getListData();
          }
          else if (response.status == 0) {
            Swal.fire('Error!', response['reason'], 'error');

            // this.toastr.error(response['message']);
          }
        },
        (error) => {
          Swal.fire('Error!', 'error', 'error');

        });
    }
  }

  onSaveConfirm(event) {

    let dctData = {}
    dctData['item_group'] = event.newData['vchr_item_group']
    dctData['pk_bint_id'] = event.newData['pk_bint_id']


    this.serviceObject.putData('itemgroup/additemgroup/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {

          Swal.fire({
            position: "center",
            type: "success",
            text: "Data Updated successfully",
            showConfirmButton: true,
          });
          event.confirm.resolve();
        }
        else if (response.status == 0) {
          Swal.fire('Error!', response['reason'], 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      });

  }
  getData() {

    this.serviceObject.getData('itemgroup/additemgroup/').subscribe(
      (response) => {
        if (response.status == 1) {
          this.data = response['lst_item_group'];
          this.source = new LocalDataSource(this.data); // create the source


        }
        else if (response.status == 0) {

        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
  }


  getListData(){
    
    let dctData = {}
    this.selectedFrom = moment(this.datFrom).format('DD-MM-YYYY')
    this.selectedTo = moment(this.datTo).format('DD-MM-YYYY')

    if (this.datFrom > this.datTo) {

      Swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return false;
    }

    dctData['datFrom'] = this.selectedFrom
    dctData['datTo'] = this.selectedTo;
    this.serviceObject.postData('itemgroup/listitemgroup/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {
          this.blnShowData=true;
          this.data = response['lst_item_group'];
          this.source = new LocalDataSource(this.data); // create the source;          
          if(this.data.length==0){
            this.blnShowData=false;
          }


        }
        else if (response.status == 0) {
          this.blnShowData=false;
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        this.blnShowData=false;
        Swal.fire('Error!', 'error', 'error');

      });
  }

}

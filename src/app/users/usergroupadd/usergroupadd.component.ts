import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
// import { data } from '../../table/smart-table/smart-data-table';
import { ServerService } from '../../server.service';
import { stringify } from '@angular/compiler/src/util';
import { ToastrService } from 'ngx-toastr';
import { log } from 'util';

@Component({
  selector: 'app-usergroupadd',
  templateUrl: './usergroupadd.component.html',
  styleUrls: ['./usergroupadd.component.css']
})
export class UsergroupaddComponent implements OnInit {

  constructor(private serviceObject: ServerService,
    public toastr: ToastrService,
   ) { }
  source: LocalDataSource;
  source2: LocalDataSource;
  vchr_name = '';
  vchr_code = '';
  data = [];
 lstPermission=JSON.parse(localStorage.group_permissions)
 blnAdd=false
// settings defines the data structure of smart table
 settings = {
  hideSubHeader: true,
    columns: {
      slno: {
        title: 'Sl No.',
        filter: false
      },
      vchr_code: {
        title: 'Code',
        filter: false
      },
      vchr_name: {
        title: 'Name',
        filter: false
      }
    },
    actions: {
      add: false,
      position: 'right'
      },
    edit: {
      editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      confirmSave: true,
      position: 'right'
    },
    delete: {
      deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      confirmDelete: true,
      position: 'right'

    }
  };
  ngOnInit() {
    this.listData();
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Add User Group") {
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
  // function lisData lists all user groups
listData () {
  this.serviceObject.getData('user_groups/add/').subscribe(res => {
    // console.log(res);
    res['lst_groups'].forEach((element, index) => {
      element['slno'] = index + 1;
    });
    this.data = res['lst_groups'];
    // console.log(this.data)
    this.source = new LocalDataSource(this.data); // create the source
  });
}
// function saveData save the group details
saveData() {
const dct_data = {};
if (this.vchr_code === '') {
  this.toastr.error('Enter user group code');
  return;
} else if (this.vchr_name === '') {
  this.toastr.error('Enter user group name');
  return;
}
dct_data['vchrName'] = this.vchr_name;
dct_data['vchrCode'] = this.vchr_code;

this.serviceObject.postData('user_groups/add/', dct_data)   .subscribe(
  (response) => {
      if (response.status === 1) {
        this.toastr.success('user group added successfully');
        this.listData();
        this.vchr_code="";
        this.vchr_name="";
      } else if (response.status === 0) {
        this.toastr.error(response['message']);
      }
  },
  (error) => {
    console.log('response');

  });
}


// function updateRecord updates any change in group details
updateRecord(event) {
  // console.log(event,"ee")
    this.serviceObject.putData('user_groups/add/', event.newData).subscribe(
      (response) => {
          if (response.status === 1) {
          this.toastr.success('user group updated successfully');
          this.listData();
            // event.confirm.resolve();
          } else if (response.status === 0) {
            this.toastr.error(response['message']);
          }
      },
      (error) => {
        this.toastr.error('Error');
      });
      this.listData();
  }
  // function deleteRecord delete selected category
  deleteRecord(event) {
    this.serviceObject.patchData('user_groups/add/', event.data ).subscribe(
      (response) => {
        if (response.status === 1) {
          this.toastr.success('user group deleted successfully');
          this.listData();
            event.confirm.resolve();
          } else if (response.status === 0) {
            this.toastr.error('user group deletion failed');
          }
      },
      (error) => {
        this.toastr.error('Error');
      });
      this.listData();
 }
}

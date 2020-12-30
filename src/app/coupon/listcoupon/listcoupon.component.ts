import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import swal from 'sweetalert2';
// import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-listcoupon',
  templateUrl: './listcoupon.component.html',
  styleUrls: ['./listcoupon.component.css']
})
export class ListcouponComponent implements OnInit {


  source: LocalDataSource;
  data ;
  pageTitle: string = 'Coupon';
  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]
  dataLoaded=false
  strRemarks = '';

  constructor(
    private serverService: ServerService,
    private spinnerService: NgxSpinnerService,

    public router: Router,
  ) {
    this.source = new LocalDataSource(this.data); // create the source
   }


   settings = {
    // hideSubHeader: true,    
    delete:
    {
      confirmDelete: true,
      deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      position:'right',

    },
   
    actions: {
      add: false,
      edit:false,
      delete:false,
      custom: this.lstCustom,
      position:'right',
      
      },
   
    columns: {
      vchr_coupon_code: {
        title: ' Coupon Code',
        // filter:false
      },
      coupon_type: {
        title: 'Coupon Type',
        // filter:false
      },
      dat_expiry: {
        title: 'Expiry Date',
        // filter: false
      },
      bint_min_purchase_amt: {
        title: 'Minimum Purchase Amount',
        // filter: false
      },
      bint_max_discount_amt: {
        title: 'Maximum Discount Amount',
        // filter: false
      },
     
    },
 
  };

  ngOnInit() {

    this.listCouponData();
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false,'HISTORY':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Coupon List") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    
    if(dct_perms.VIEW==true && dct_perms.EDIT==true ){
      this.lstCustom=  [
        { name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},
        { name: 'editrecord', title: '&nbsp;&nbsp;<i class="ti-pencil text-info m-r-10"></i>' },
        
      ]
    }
    else if(dct_perms.VIEW==false && dct_perms.EDIT==true ){
      this.lstCustom= [
        { name: 'editrecord', title: '&nbsp;&nbsp;<i class="ti-pencil text-info m-r-10"></i>' },

      ]
    }
    else if(dct_perms.VIEW==true && dct_perms.EDIT==false ){
      this.lstCustom= [
        { name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},
  ]
    }

    this.settings.actions.custom = this.lstCustom

  }

  listCouponData(){
    this.spinnerService.show();

    this.serverService.getData('coupon/coupon_list/').subscribe(
      result => {
        this.spinnerService.hide();

        if(result.status == 1){
        this.source = result['list'];
       
          this.dataLoaded = true;
        }
      },
      (error) => { if(error.status == 401){
        this.spinnerService.hide();

    localStorage.setItem('previousUrl','/user/sign-in');
    this.router.navigate(['/user/sign-in']);} } );
  }

  onEdit(event)
  {
  
    
    localStorage.setItem('couponRowId',event.pk_bint_id);
    localStorage.setItem('previousUrl','coupon/editcoupon');
    
    this.router.navigate(['coupon/editcoupon']);
  }
  onView(event){
    console.log('view');
    
    
    localStorage.setItem('couponRowId',event.pk_bint_id);
    localStorage.setItem('previousUrl','coupon/viewcoupon');
    this.router.navigate(['coupon/viewcoupon']);
  }

  onCustomAction(event) {
    console.log('ddd');
    
    
    switch ( event.action) {
      case 'viewrecord':
        this.onView(event.data);
        break;
     case 'editrecord':
        this.onEdit(event.data);
        break;
    
    }
  }


  onDeleteConfirm(event) {

    console.log('a',event);
    
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
        // inputPlaceholder: 'Enter Reason!',
    //     inputValidator: (text) => {
    //       this.strRemarks = text;
    //   return !text && 'You need to write something!'
    //  },
      }).then(result => {
        if (result.value) {
        event.confirm.resolve();
  
        let dctData={}
        // dctData['remarks'] =  this.strRemarks;
        // dctData['pk_bint_id']=parseInt(event.data['pk_bint_id'])
       
        
        this.serverService.patchData('coupon/delete_coupon/',dctData).subscribe(
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

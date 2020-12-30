import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {

  source: LocalDataSource;
  data ;
  pageTitle: string = 'Price';

  blnShowData=true;
  strRemarks = '';
  lstPermission=JSON.parse(localStorage.group_permissions)
  previusUrl = localStorage.getItem('previousUrl');
  datTo;
  datFrom;
  lstCustom=[]
  dctDelete={}
  constructor(
    private serverService: ServerService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,
  ) {
    this.source = new LocalDataSource(this.data); // create the source
   }

   settings = {
    hideSubHeader: true,    
    delete:this.dctDelete, 
    // edit: {
    //   confirmSave: false,
    //   editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
    //   saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
    //   cancelButtonContent: '<i class="ti-close text-danger"></i>'
    // },
   
    actions: {
      add: false,
      edit:false,
      delete:true,
      custom: this.lstCustom,
      position:'right',
      
      },
   
    columns: {
      fk_item__vchr_item_code: {
        title: 'Item',
        filter:false,
        editable: false,
       
      },
      // dbl_supp_amnt: {
      //   title: 'Supplier Amount',
      //   filter:false
      // },
      dbl_cost_amnt: {
        title: 'Cost Price',
        filter:false
      },
      dbl_dealer_amt: {
        title: 'Dealer Amount',
        filter:false
      },
      dbl_mop: {
        title: 'MOP',
        filter:false
      },
      dbl_my_amt: {
        title: 'myG Price',
        filter:false
      },
      dbl_mrp: {
        title: 'MRP',
        filter:false
      },
      dat_efct_from: {
        title: 'Date effective from',
        filter:false
      },
     
     
     
     
    },
 
  };


  ngOnInit() {

    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Price List") {
        dct_perms.ADD= item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    if(dct_perms.EDIT==true ){
      this.lstCustom= [
        { name: 'editrecord', title: '&nbsp;&nbsp;<i class="ti-pencil text-info m-r-10"></i>' },
     
      ]
    }
    
    else{
      this.lstCustom= [
        
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
    // this.getData();
    this.getList(this.datFrom, this.datTo, 0,);
  }
  getData()
  {
    let status =0
    let dctData={};
    let tempData
    if ((!this.datFrom && this.datTo) || (this.datFrom && !this.datTo)) {
        this.toastr.error('Please select From and To date', 'Error!');
      return false;
    }
    else if ((this.datFrom &&  this.datTo) && ( this.datTo < this.datFrom )) {
      this.toastr.error('Please select correct date period', 'Error!');
      return false;
    }
    this.getList( 
      new Date(this.datFrom).toLocaleString('en-GB'),
      new Date(this.datTo).toLocaleString('en-GB'),
      1,
    );
  }
  getList(startDate, endDate, status){
    let d1 = this.datFrom;
    let d2 = this.datTo;
    let tempData;
    let data;
    if (status === 0) {
      const urls = ['price/editprice']

    //  if (this.previusUrl != '/crm/viewlead'  ) {
      if (!(urls.find( x => x === this.previusUrl))) {
          localStorage.removeItem('priceItemNumberStatus')
          localStorage.removeItem('priceRequestData')
     }
     if (localStorage.getItem('priceItemNumberStatus')) {
       
        tempData = JSON.parse(localStorage.getItem('priceRequestData'))
        

        d1 = tempData['start_date']
        d2 = tempData['end_date']
        status = 1
        localStorage.removeItem('priceItemNumberStatus')
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
      }
    }
     else if (status === 1) {
      
      
      
      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
      data = {start_date: d1, end_date: d2 }

      localStorage.setItem('priceRequestData', JSON.stringify(data))

    }
    d1 =  moment(d1).format('YYYY-MM-DD');
    d2 =  moment(d2).format('YYYY-MM-DD');
    this.datFrom=d1
    this.datTo=d2
    let dctData={}
    dctData['datFrom'] =d1
    dctData['datTo']=d2
    this.spinnerService.show();

    this.serverService.postData('pricelist/listpricelist/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1) {
           this.data=response['list'];
           for(let data of this.data){
           data['dat_efct_from']=moment(data['dat_efct_from']).format('DD-MM-YYYY')
           }
        
           if(this.data.length>0){
            this.blnShowData=true;
           this.source = new LocalDataSource(this.data); 
           }
           else{
            this.blnShowData=false;
           }
          }  
          else {
            this.blnShowData=false;
            swal.fire('Error!','error', 'error');
          }
      },
      (error) => {   
        this.spinnerService.hide();

        swal.fire('Error!','error', 'error');
        
      });
  }

 
  onDeleteConfirm(event) {

    console.log('a',event);
    
      swal.fire({
        title: 'Delete',
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
        dctData['pk_bint_id']=parseInt(event.data['pk_bint_id'])
       
        
        this.serverService.patchData('pricelist/deletepricelist/',dctData).subscribe(
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

    // onSaveConfirm(event) {
    //   // console.log("Edit Event In Console")
    //   console.log('sas',event);
    //   let dctData={}
    //   dctData['fk_item']=event.newData['fk_item_id']
    //   dctData['int_MOP']=event.newData['bint_mop']
    //   dctData['int_MRP']=event.newData['bint_mrp']
    //   dctData['int_cost_price']=event.newData['bint_cost_amnt']
    //   dctData['int_supplier_amount']=event.newData['bint_supp_amnt']
    //   dctData['date_effective_from']=event.newData['dat_efct_from']
    //   dctData['pk_bint_id']=event.newData['pk_bint_id']

    //   this.serverService.postData('pricelist/editpricelist/',dctData).subscribe(
    //     (response) => {
    //         if (response.status == 1) {
  
    //           swal.fire({
    //             position: "center",
    //             type: "success",
    //             text: "Data Updated successfully",
    //             showConfirmButton: true,
    //           });
    //           event.confirm.resolve();
    //           this.router.navigate(['price/listprice']);
    //         }
    //         else if (response.status == 0) {
    //           swal.fire('Error!','Something went wrong!!', 'error');
    //         }
    //     },
    //     (error) => {
    //       swal.fire('Error!','Something went wrong!!', 'error');
    //     });
  
    // }
    onEdit(event)
  {
   console.log('data',event);
   
    
    localStorage.setItem('priceRowId',event.pk_bint_id);
    localStorage.setItem('previousUrl','price/editprice');
    
    this.router.navigate(['price/editprice']);
  }

    onCustomAction(event) {
    
    
      switch ( event.action) {
       case 'editrecord':
          this.onEdit(event.data);
          break;
    }
   }
}

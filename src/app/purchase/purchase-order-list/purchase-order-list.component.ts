import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {
  data;
  pur_order_source: LocalDataSource;
  blnShowData=false;
  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]
  dctDelete={}
  settings = {
    delete: this.dctDelete,
    actions: {
      add: false,
      edit:false,
      delete:false,
      custom: this.lstCustom,
      position: 'right'
      
      },
    columns: {
      vchr_po_num: {
        title: 'Purchase Order No.', 
      },
      date_po: {
        title: 'Purchse Order Date',
       
      },
      fk_branch_id__vchr_name: {
        title: 'Branch',
       
      },
      date_po_expiry: {
        title: 'Expiry Date',
       
      },
      fk_supplier_id__vchr_name: {
        title: 'Supplier',     
      },
    },
  };

  constructor(
    private serviceObject:ServerService,
    public router: Router
    ) {
      this.pur_order_source=new LocalDataSource(this.data);
     }

  ngOnInit() {
    this.getData();
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Purchase Order List") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    if(dct_perms.VIEW==true ){
      this.lstCustom= [{ name: 'ourCustomAction', title: '<i class="ti-eye text-info m-r-10"></i>' }]
         
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

  onEdit(event)
  {
    localStorage.setItem('rowId',event.data.id);
    localStorage.setItem('action','edit');
    localStorage.setItem('previousUrl','purchase/purchaseorder');
    
    this.router.navigate(['purchase/purchaseorder']);
  }

  getData(){
    this.serviceObject.getData('purchase/list_purchase_order/').subscribe(
      (response) => {
          if (response.status == 1) {
           this.data=response['lst_po_details'];
           if(this.data.length>0){
           this.blnShowData=true;
           this.pur_order_source = new LocalDataSource(this.data); 
           }
           else{
            this.blnShowData=false;
           }
          }  
          else {
            this.blnShowData=false;
            Swal.fire('Error!','error', 'error');
          }
      },
      (error) => {   
        Swal.fire('Error!','error', 'error');
        
      });
  }
  onCustomAction(event) {    
    localStorage.setItem('intMasterId', event.data.pk_bint_id);
    localStorage.setItem('previousUrl','purchase/purchaseorderview');
    
    this.router.navigate(['purchase/purchaseorderview']);
  }

}

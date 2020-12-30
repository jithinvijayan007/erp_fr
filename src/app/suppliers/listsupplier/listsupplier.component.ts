import { Component, OnInit,ViewChild} from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-listsupplier',
  templateUrl: './listsupplier.component.html',
  styleUrls: ['./listsupplier.component.css']
})
export class ListsupplierComponent implements OnInit {


  intCreditDays :number = null;
  intCreditLimit : number = null;
  strSupplierCategory='';
  supplierCategoryId;
  bln_active ='0';
  lst_category =[];
  strRemarks = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('idCreditDays', { static: true })
  idCreditDays: any;
  @ViewChild('idCreditLimit', { static: true })
  idCreditLimit: any;
  @ViewChild('idSupCat')
  idSupCat: any;
  
  source: LocalDataSource;
  data ;
  pageTitle: string = 'Supplier';

  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]
  dctDelete={}

  // dataSource = new MatTableDataSource(this.supplierListJsonData)
  public form: FormGroup;
  dataLoaded = false;
  // dctPerms = {add:false, edit:false, view:false, delete:false};
  constructor(
   
    public dialog: MatDialog, public router: Router,
    private serverService: ServerService, private fb: FormBuilder,
    public toastr: ToastrService,

  ) {
    this.source = new LocalDataSource(this.data); // create the source
      
   }

   settings = {
    hideSubHeader: true,
    delete:this.dctDelete,
   
    actions: {
      add: false,
      edit:false,
      custom:this.lstCustom,
      position:'right',
      
      },
   
    columns: {
      vchr_name: {
        title: ' Supplier Name',
        filter:false
      },
      vchr_code: {
        title: 'Supplier Code',
        filter:false
      },
      bint_credit_limit: {
        title: 'Credit Limit',
        filter: false
      },
      int_po_expiry_days: {
        title: 'PO Expiry Days',
        filter: false
      },
     
    },
 
  };

  ngOnInit() 
  {
   let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false,'HISTORY':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Supplier List") {
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
        { name: 'listhistory', title: '<i class="fa fa-history" title="History"></i> '},
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

    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required ])],
      code: [null, Validators.compose([Validators.required])],
      // email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      mobile: [null, Validators.compose([Validators.required,
      CustomValidators.min(1000000000), CustomValidators.max(1000000000000), CustomValidators.number])],
    });
   this.listSupplierCategory()
   this.listSupplierData()

   
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
  }

  listSupplierData(){
    let pusheditems ={}
    pusheditems['intCreditDays'] = this.intCreditDays;
    pusheditems['intCreditLimit'] = this.intCreditLimit;
    pusheditems['strSupplierCategory'] = this.strSupplierCategory;
    pusheditems['bln_active'] =this.bln_active;
  
    
    this.serverService.postData('supplier/list_supplier/',pusheditems).subscribe(
      result => {
        if(result.status == 1){
        this.source = result['list_supplier'];
       
          this.dataLoaded = true;
        }
      },
      (error) => { if(error.status == 401){
  localStorage.setItem('previousUrl','/user/sign-in');
        
        this.router.navigate(['/user/sign-in']);} } );
  }
  listSupplierCategory(){
    this.serverService.getData('supplier/get_category_list/').subscribe(
      (data) => {
      // const result = data.json();
      if (data['status'] == 1) {

        this.lst_category = data['data']
      
    } 

      },
     
    );
  }
  // editSupplierData(id){
  //   sessionStorage.setItem('editsupplierid',id)
  // this.router.navigate(['user/editsupplier']);
  // }


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
     
      
      this.serverService.patchData('supplier/delete_supplier/',dctData).subscribe(
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

  // viewSupplierData(pk_bint_id) {
  //   console.log('id',pk_bint_id);
    
  //   sessionStorage.setItem('editsupplierid', pk_bint_id)
  //   this.router.navigate(['supplier/viewsupplier']);
  // }

  supplierCategoryChanged(item){
      this.supplierCategoryId = item.id;
      this.strSupplierCategory = item.name;
    

  }

  onEdit(event)
  {
  
    
    localStorage.setItem('supplierRowId',event.pk_bint_id);
  localStorage.setItem('previousUrl','supplier/editsupplier');
    
    this.router.navigate(['supplier/editsupplier']);
  }
  onView(event){
    
    
    localStorage.setItem('supplierRowId',event.pk_bint_id);
  localStorage.setItem('previousUrl','supplier/viewsupplier');
    
    this.router.navigate(['supplier/viewsupplier']);
  }

  onHistory(event){
    
    
    localStorage.setItem('supplierRowId',event.pk_bint_id);
  localStorage.setItem('previousUrl','supplier/historylog');
    
    this.router.navigate(['supplier/historylog']);
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
    }
  }
  
}

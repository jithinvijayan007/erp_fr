import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-transferlist',
  templateUrl: './transferlist.component.html',
  styleUrls: ['./transferlist.component.css']
})
export class TransferlistComponent implements OnInit {

  dataSource = new MatTableDataSource();
  blnShowData='none';
  selectedFrom
  selectedTo
  data = []
  datTo;
  datFrom;
  searchBranch: FormControl = new FormControl();
  selectedBranch;
  lstBranch = []
  IntBranchId;
  strBranch;
  currentBranch='';
  previusUrl = localStorage.getItem('previousUrl'); 

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnView=false

  displayedColumns = ['stock_no','transfer_date','branch','status', 'action'];

  lstCustom=[];

  source: LocalDataSource;
  
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
     
      custom: this.lstCustom,
      position: 'right'
   
    },
   
    columns: {
      vchr_stktransfer_num: {
        title: 'Stock Transfer No.',
      },
      dat_transfer: {
        title: 'Transfer Date',
      },
      fk_from__vchr_name: {
        title: 'Branch',
      },
      str_user: {
        title: 'User',
      },
      list_products: {
        title: 'Products',
      },
      status: {
        title: 'Status',
      },
     
    },
    pager:{
      display:true,
      perPage:500
      }
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private serviceObject: ServerService,
    public toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,
   ) { }
  // source: LocalDataSource;
  // source2: LocalDataSource;
// settings defines the data structure of smart table
//  settings = {
//   hideSubHeader: true,
//     columns: {
//       vchr_stktransfer_num: {
//         title: 'Stock Transfer No.',
//         filter: false
//       },
//       dat_transfer: {
//         title: 'Transfer Date',
//         filter: false
//       },
//       fk_from__vchr_name: {
//         title: 'Branch',
//         filter: false
//       },
//       status: {
//         title: 'Status',
//         filter: false
//       }
//     },
//     actions: {
//       add: false,
//       edit: false,
//       delete: false,
//       custom: [{ name: 'ourCustomAction', title: '<i class="ti-eye text-info m-r-10"></i>' }],
//       position: 'right'
//       },
//   };

  ngOnInit() {


    

    this.lstCustom=[
      { 
        name: 'viewrecord', title: '<i *ngIf="blnView" (click)="onCustomAction(i)" title="View" class="ti-eye text-info m-r-10"></i>'
      },
      { name: 'printrecord', title: '<i *ngIf="row.status!="BILLED"" title="Print" class="ti-printer text-info m-r-10"></i>'},
    ]

    this.settings.actions.custom = this.lstCustom


    this.searchBranch.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstBranch = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('branch/branch_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstBranch = response['data'];
                 
                  

                }
              );
          }
        }
      }
      );
    this.getList(this.datFrom, this.datTo, 0,);
    // this.listData();
    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "List Transfer") {
        // this.dct_perms.ADD = item["ADD"];
        // this.blnEdit= item["EDIT"];
        // this.dct_perms.DELETE = item["DELETE"];
        this.blnView = item["VIEW"]
      }
    });
  }
  BranchChanged(item) {
    this.currentBranch = item.name;
    this.IntBranchId = item.id;
    this.strBranch = item.name;
    this.selectedBranch = item.name;
  }
  listData()
  {
    let status =0
    let dctData={};
    let tempData
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')

     if (this.selectedFrom > this.selectedTo || (!this.selectedFrom) || (!this.selectedTo) )  {
      this.toastr.error('Please select correct date period', 'Error!');
        return false
      }
   
    this.getList( 
      new Date(this.datFrom).toLocaleString('en-GB'),
      new Date(this.datTo).toLocaleString('en-GB'),
      1,
    );
  }
  branchNgModelChanged(event){
    if(this.currentBranch!=this.selectedBranch){
      this.strBranch = '';
      this.IntBranchId = null;
    }
  }
getList (startDate, endDate, status) {
  let d1 = this.datFrom;
    let d2 = this.datTo;
    let tempData;
    let data;
    if (status === 0) {
      const urls = ['stocktransfer/transferview']

    //  if (this.previusUrl != '/crm/viewlead'  ) {
      if (!(urls.find( x => x === this.previusUrl))) {
       

          localStorage.removeItem('stockTransferStatus')
          localStorage.removeItem('stockTransferData')
     }
     if (localStorage.getItem('stockTransferStatus')) {
       
        tempData = JSON.parse(localStorage.getItem('stockTransferData'))
        // console.log(tempData,"tempData");
        

        d1 = tempData['start_date']
        d2 = tempData['end_date']
        this.IntBranchId = tempData['branchId']
        this.strBranch= tempData['branchname']
        this.selectedBranch= tempData['branchname']
        this.currentBranch=tempData['branchname']
        status = 1
        localStorage.removeItem('stockTransferStatus')
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
      }
    }
     else if (status === 1) {
      
      
      
      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
      data = {start_date: d1, end_date: d2,branchId:this.IntBranchId,branchname:this.strBranch }

      localStorage.setItem('stockTransferData', JSON.stringify(data))

    }
    d1 =  moment(d1).format('YYYY-MM-DD');
    d2 =  moment(d2).format('YYYY-MM-DD');
    this.datFrom=d1
    this.datTo=d2
    let dctData={}
    dctData['datFrom'] =d1
    dctData['datTo']=d2
    dctData['intBranchId']=this.IntBranchId
    dctData['type']='to'
    this.spinnerService.show();

  this.serviceObject.postData('internalstock/gettransferlist/',dctData).subscribe(res => {
    this.spinnerService.hide();

    if (res.status === 1) {

      // let templist=[
      //   {'str_user':"shamseer",'dat_transfer':"2020-08-05T00:00:00",'fk_from__vchr_name':'WAREHOUSE1','fk_to__vchr_name':'HEAD OFFICE','list_products':['MOBILE','ACCESORIES'],'pk_bint_id':17085,'status':'TRANSFERRED','vchr_stktransfer_num':'STN-WHO1-5318'}
      // ]

      this.data =  res['request_list'];
      // this.data =  templist;

      this.data.forEach(element => {
        element['dat_transfer'] = moment(element['dat_transfer']).format('DD-MM-YYYY');
      });
      // this.dataSource = new MatTableDataSource(this.data); 
      this.source = new LocalDataSource(this.data); 

      // this.dataSource.paginator = this.paginator;
      // this.dataSource.paginator.firstPage();
      // this.dataSource.sort = this.sort;
    } else {
      this.toastr.error('Error occured ' );
    }
  });
}
onCustomAction(event) {
  if(event.action=="viewrecord"){

    localStorage.setItem('stockTransferId', event['data'].pk_bint_id);
    localStorage.setItem('stockTransferType', 'to');
    localStorage.setItem('blnTrasfered','false');
    localStorage.setItem('previousUrl','stocktransfer/transferview');
    
    this.router.navigate(['stocktransfer/transferview']);
  }

  if(event.action=="printrecord"){
  
    let dct_data = { 'id': event['data'].pk_bint_id}
      if (event['data']['fk_to__vchr_name'] == 'ANGAMALY'){
        dct_data['bln_challan'] = false
      }
      else{
        dct_data['bln_challan'] = true
      }
  
      this.serviceObject.postData('invoice/deliverychallan/', dct_data).subscribe(res => {
        if (res.status === 1) {
          let fileURL = res['file_url'];
          window.open(fileURL, '_blank');
        } else {
  
        }
      });

  }

}
// print(event){
  
//   let dct_data = { 'id': event['data'].pk_bint_id}
//     if (event['data']['fk_to__vchr_name'] == 'ANGAMALY'){
//       dct_data['bln_challan'] = false
//     }
//     else{
//       dct_data['bln_challan'] = true
//     }

//     this.serviceObject.postData('invoice/deliverychallan/', dct_data).subscribe(res => {
//       if (res.status === 1) {
//         let fileURL = res['file_url'];
//         window.open(fileURL, '_blank');
//       } else {

//       }
//     });

// }
// applyFilter(filterValue: string) {
//   filterValue = filterValue.trim(); // Remove whitespace
//   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
//   this.dataSource.filter = filterValue;
// }
}

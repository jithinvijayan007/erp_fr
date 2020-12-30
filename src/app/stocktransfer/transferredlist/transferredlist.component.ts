import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-transferredlist',
  templateUrl: './transferredlist.component.html',
  styleUrls: ['./transferredlist.component.css']
})
export class TransferredlistComponent implements OnInit {
  lstPermission=JSON.parse(localStorage.group_permissions)
  previusUrl = localStorage.getItem('previousUrl');
  lstCustom=[]
  constructor(private serviceObject: ServerService,
    public toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,
   ) { }
  source: LocalDataSource;
  source2: LocalDataSource;
  selectedFrom
  selectedTo
  data = [];
  datTo;
  datFrom;
  searchBranch: FormControl = new FormControl();
  selectedBranch;
  lstBranch = []
  IntBranchId;
  strBranch;
  currentBranch='';
  // for ewatbill icon
  strBranchCode=localStorage.getItem('BranchCode');
  strGroupName=localStorage.getItem('group_name');

// settings defines the data structure of smart table
 settings = {
  hideSubHeader: true,
    columns: {
      vchr_stktransfer_num: {
        title: 'Stock Transfer No.',
        filter: false
      },
      dat_transfer: {
        title: 'Transfer Date',
        filter: false
      },
      fk_to__vchr_name: {
        title: 'Branch',
        filter: false
      },
      status: {
        title: 'Status',
        filter: false
      }
    },
    pager:{
      display:true,
      perPage:500
      },
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: this.lstCustom,
      position: 'right'
      },
      rowClassFunction: (row) => {
        console.log('raw',row);

        if(row.data.status == 'TRANSFERRED' && (this.strBranchCode=='WHO1' || this.strBranchCode=='ROC' ||  this.strBranchCode=='ECO' || this.strGroupName=='ADMIN' || this.strBranchCode=='ITC')){
            return '';
        } else {
            return 'hide-action';
        }
    },

  };

  ngOnInit() {
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
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "List Transfered") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });

    if(dct_perms.VIEW==true  ){
      if(this.strBranchCode=='WHO1' || this.strBranchCode=='ROC'  || this.strBranchCode=='ECO' || this.strGroupName=='ADMIN' || this.strBranchCode=='ITC'){
        this.lstCustom= [{ name: 'eWayGeneration', title: '<i class="ti-truck text-info m-r-10"></i>' },{ name: 'viewData', title: '<i class="ti-eye text-info m-r-10"></i>' }, { name: 'printData', title: '<i class="ti-printer text-info m-r-10"></i>' }]

      }
      else{
        this.lstCustom= [{ name: 'viewData', title: '<i class="ti-eye text-info m-r-10"></i>' }, { name: 'printData', title: '<i class="ti-printer text-info m-r-10"></i>' }]

      }


    }
    else{
      this.lstCustom =[{ name: 'printData', title: '<i class="ti-printer text-info m-r-10"></i>' }]
    }
    this.settings.actions.custom = this.lstCustom
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


          localStorage.removeItem('stockTransferredStatus')
          localStorage.removeItem('stockTransferredData')
     }
     if (localStorage.getItem('stockTransferredStatus')) {

        tempData = JSON.parse(localStorage.getItem('stockTransferredData'))
        // console.log(tempData,"tempData");


        d1 = tempData['start_date']
        d2 = tempData['end_date']
        this.IntBranchId = tempData['branchId']
        this.strBranch= tempData['branchname']
        this.selectedBranch= tempData['branchname']
        this.currentBranch=tempData['branchname']
        status = 1
        localStorage.removeItem('stockTransferredStatus')
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
      }
    }
     else if (status === 1) {



      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
      data = {start_date: d1, end_date: d2,branchId:this.IntBranchId,branchname:this.strBranch }

      localStorage.setItem('stockTransferredData', JSON.stringify(data))

    }
    d1 =  moment(d1).format('YYYY-MM-DD');
    d2 =  moment(d2).format('YYYY-MM-DD');
    this.datFrom=d1
    this.datTo=d2
    let dctData={}
    dctData['datFrom'] =d1
    dctData['datTo']=d2
    dctData['intBranchId']=this.IntBranchId
    dctData['type']='from'
    this.spinnerService.show();

  this.serviceObject.postData('internalstock/gettransferlist/',dctData).subscribe(res => {
    this.spinnerService.hide();

    if (res.status === 1) {
      this.data =  res['request_list'];
      this.data.forEach(element => {
        element['dat_transfer'] = moment(element['dat_transfer']).format('DD-MM-YYYY');
      });
      this.source = new LocalDataSource(this.data); // create the source
    } else {
      this.toastr.error('Error occured ' );
    }
  });
}
onCustomAction(event) {

  if (event.action == 'viewData') {
    localStorage.setItem('stockTransferId', event.data.pk_bint_id);
    localStorage.setItem('stockTransferType', 'from');
    localStorage.setItem('blnTrasfered', 'true');
  localStorage.setItem('previousUrl','stocktransfer/transferview');

    this.router.navigate(['stocktransfer/transferview']);
  }
  else if (event.action == 'eWayGeneration') {
    let dct_data = { 'int_id': event.data.pk_bint_id}
    this.spinnerService.show();

    this.serviceObject.postData('internalstock/eway_bill/', dct_data).subscribe(res => {
      this.spinnerService.hide();

      if (res.status === 1) {
        this.toastr.success('Succesfully Generated', 'Success!');

      }
      else if (res.status === 0 && res['bln_permitted']==false) {
        this.toastr.error(res['reason'], 'Error!');

      }
      else if (res.status === 0) {
        this.toastr.error('Error Occurred', 'Error!');

      }
    });

  }
  else if (event.action == 'printData') {
    let dct_data = { 'id': event.data['pk_bint_id']}
    if (event.data['fk_to__vchr_name'] == 'ANGAMALY'){
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
}

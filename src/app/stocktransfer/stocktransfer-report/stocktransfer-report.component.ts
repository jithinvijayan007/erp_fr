import { Component, OnInit } from '@angular/core';
import {  FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import * as moment from 'moment' ;


@Component({
  selector: 'app-stocktransfer-report',
  templateUrl: './stocktransfer-report.component.html',
  styleUrls: ['./stocktransfer-report.component.css']
})
export class StocktransferReportComponent implements OnInit {
  datTo: Date;
  datFrom: Date;
  datAsOn : Date;
  blnTransfered:Boolean;
  blnReceived:Boolean;
  searchBranchFrom: FormControl = new FormControl();
  searchBranchTo: FormControl = new FormControl();
  lstBranch: any[];
  intBranchIdFrom: any;
  strBranchFrom: any;
  currentBranchFrom: any;
  selectedBranchFrom: any;
  strBranchTo: any;
  selectedBranchTo: any;
  currentBranchTo: any;
  intBranchIdTo: any;
  lstBranchTo =  [];
  lstBranchFrom = [];
  blnBranchOption: Boolean;
  blnAsOn = false;

  lstTransferStatus=[]
  transferOptions= [{"name":'Billed' ,'id':0 },{"name": 'Transferred','id': 1},{"name":'Recieved' ,'id':2 },{"name":'Acknowledged' ,'id':3 }]
  transferConfig = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description
    search:true ,//true/false for the search functionlity defaults to false,
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select Transfer Status',// text to be displayed when no item is selected defaults to Select,
    selectAll: 'true', // Should enable select all feature for multiple select items
    searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: true // clears search criteria when an option is selected if set to true, default is false
  }




  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) { }

  ngOnInit() {

    let ToDate = new Date()
    let FromDate = new Date();
    let AsOnDate = new Date();
    this.datTo = ToDate
    this.datFrom = FromDate
    this.datAsOn = AsOnDate



    this.serviceObject.getData('reports/stock_transfer_history/').subscribe(
      (response) => {
          if (response.status == 1)
          {
          this.blnBranchOption =  response['bln_branch_show'];
          }
          else if (response.status == 0)
          {
          //  this.blnShowData=false;
          swal.fire('Error!',response['reason'], 'error');
          }
      },
      (error) => {
        swal.fire('Error!','Something went wrong!!', 'error');
      });



    this.searchBranchFrom.valueChanges
  .debounceTime(400)
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lstBranchFrom = [];
    } else {
      if (strData.length >= 1) {
        this.serviceObject
          .postData('exchange_sales/exchange_branch_typeahead/',{term:strData})
          .subscribe(
            (response) => {
              this.lstBranchFrom = response['data'];
            }
          );

      }
    }
  }
  );

  this.searchBranchTo.valueChanges
  .debounceTime(400)
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lstBranchTo = [];
    } else {
      if (strData.length >= 1) {
        this.serviceObject
          .postData('exchange_sales/exchange_branch_typeahead/',{term:strData})
          .subscribe(
            (response) => {
              this.lstBranchTo = response['data'];
            }
          );

      }
    }
  }
  );

}


fromBranchChanged=(item)=>{
  this.intBranchIdFrom = item.id;
  this.strBranchFrom = item.branchname;
  this.selectedBranchFrom=item.branchname;
  this.currentBranchFrom=item.branchname;
}
branchFromNgModelChanged(event){
  if(this.currentBranchFrom!=this.selectedBranchFrom){
    this.intBranchIdFrom = null;
      this.strBranchFrom = '';
 }
}


toBranchChanged(item){
  console.log('workedddddd')
  this.intBranchIdTo = item.id;
  this.strBranchTo = item.branchname;
  this.selectedBranchTo=item.branchname;
  this.currentBranchTo=item.branchname;
}
branchToNgModelChanged(event){
  if(this.currentBranchTo!=this.selectedBranchTo){
    this.intBranchIdTo = null;
      this.strBranchTo = '';
 }
}


exportData(){
  let dctData={}

  if(this.blnAsOn){
    dctData['datFrom'] =  null
    dctData['datTo'] = null
    dctData['datAsOn'] = moment(this.datAsOn).format('YYYY-MM-DD')
  }
  else {
    dctData['datFrom'] =  moment(this.datFrom).format('YYYY-MM-DD')
    dctData['datTo'] = moment(this.datTo).format('YYYY-MM-DD')
    dctData['datAsOn'] = null
  }
  
  dctData["blnAsOn"] = this.blnAsOn
  dctData['intFromBranchId'] = this.intBranchIdFrom
  dctData['intToBranchId'] = this.intBranchIdTo
  dctData['blnTransfer'] = this.blnTransfered
  dctData['blnReceived'] = this.blnReceived
  dctData['blnBranchOption'] = this.blnBranchOption
  dctData['transferStatus'] = []
  this.lstTransferStatus.forEach(element => {
    dctData['transferStatus'].push(element["id"])
  });
 
  console.log('status',dctData['transferStatus']);
  

  this.spinnerService.show()

  this.serviceObject.postData('reports/stock_transfer_history/',dctData).subscribe(
    (response) => {
      if (response.status == 1)
      {
        this.spinnerService.hide()

          var a = document.createElement('a');
          document.body.appendChild(a);
          a.href = response['export'];
          a.download = response['str_file_name']
          a.click();
          a.remove();

          this.toastr.success('Successfully Exported', 'Success!');
        }
        else{
          this.spinnerService.hide()
          this.toastr.error('No Data Found', 'Error!');

          }

    }
  ,
  (error) => {
  this.spinnerService.hide() 
   swal.fire('Error!','Something went wrong!!', 'error');
  });}


}

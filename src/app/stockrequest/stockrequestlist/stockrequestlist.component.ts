import { log } from 'util';
import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";





@Component({
  selector: 'app-stockrequestlist',
  templateUrl: './stockrequestlist.component.html',
  styleUrls: ['./stockrequestlist.component.css']
})
export class StockrequestlistComponent implements OnInit {
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
  previusUrl = localStorage.getItem('previousUrl'); 
  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]

  intPageIndex= 1;

// settings defines the data structure of smart table
 settings = {
  hideSubHeader: true,
    columns: {
      vchr_stkrqst_num: {
        title: 'Stock Order No.',
        filter: false
      },
      dat_request: {
        title: 'Order Date',
        filter: false
      },
      fk_from__vchr_name: {
        title: 'Branch',
        filter: false
      },
      dat_expected: {
        title: 'Expected Date',
        filter: false
      },
      status: {
        title: 'Status',
        filter: false
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: this.lstCustom,
      position: 'right'
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
      if (item["NAME"] == "List Request") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    
    if(dct_perms.VIEW==true  ){
      this.lstCustom= [{ name: 'ourCustomAction', title: '<i class="ti-eye text-info m-r-10"></i>' }]

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
      const urls = ['stockrequest/stockrequestlist']
    
    //  if (this.previusUrl != '/crm/viewlead'  ) {
      if (!(urls.find( x => x === this.previusUrl))) {
        
        
          localStorage.removeItem('stockRequestStatus')
          localStorage.removeItem('stockRequestData');
          localStorage.removeItem('stockRequestedData');
     }
    
    
     
     if (localStorage.getItem('stockRequestStatus')) {
       
        tempData = JSON.parse(localStorage.getItem('stockRequestData'))
        // console.log(tempData,"tempData");
        
        // this.intPageIndex = Number(localStorage.getItem('stockRequestListPageIndex'));

        d1 = tempData['start_date']
        d2 = tempData['end_date']
        this.IntBranchId = tempData['branchId']
        this.strBranch= tempData['branchname']
        this.selectedBranch= tempData['branchname']
        this.currentBranch=tempData['branchname']
        status = 1
        localStorage.removeItem('stockRequestStatus');
        // localStorage.removeItem('stockRequestListPageIndex');
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
      }
    }
     else if (status === 1) {
      
      
      
      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
   
      data = {start_date: d1, end_date: d2,branchId:this.IntBranchId,branchname:this.strBranch }
      
     

      localStorage.setItem('stockRequestData', JSON.stringify(data));

      localStorage.removeItem('stockRequestedData');
     
      
      

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

  this.serviceObject.postData('internalstock/getrequestlist/',dctData).subscribe(res => {
    // res['request_list'].forEach((element, index) => {
    //   // element['slno'] = index + 1;
    // });
    this.spinnerService.hide();

    if (res.status === 1) {
      this.data =  res['request_list'];
      this.data.forEach(element => {
        element['dat_request'] = moment(element['dat_request']).format('DD-MM-YYYY');
        element['dat_expected'] = moment(element['dat_expected']).format('DD-MM-YYYY HH:MM');
      });


      this.source = new LocalDataSource(this.data); // create the source

    
   
       
      

    } else {
      this.toastr.error('Error occured ' );
    }
  });
}
onCustomAction(event) {
  if (event.data.status === 'PENDING') {
    localStorage.setItem('stockRequestNo', event.data.vchr_stkrqst_num);
  localStorage.setItem('previousUrl','stockrequest/stockrequestlist');
    
    this.router.navigate(['stocktransfer/requesttransfer']);
  } else {
    localStorage.setItem('stockRequestId', event.data.pk_bint_id);
  localStorage.setItem('stockRequestType', 'from');
  localStorage.setItem('previousUrl','stockrequest/stockrequestlist');
  
    this.router.navigate(['stockrequest/stockrequestview']);
  }

  
  // localStorage.setItem('stockRequestListPageIndex',this.source.getPaging().page);
}



}

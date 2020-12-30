import { Component, OnInit,ViewChild} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import * as moment from 'moment' ;
import { CustomValidators } from 'ng2-validation';
import Swal from 'sweetalert2';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelServicesService } from 'src/app/services/excel-services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.css']
})
export class CashBookComponent implements OnInit {

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnDownload=false;

  searchBranch: FormControl = new FormControl();
  lstBranch=[];
  selectedBranch ='';
  intBranchId;
  strBranch= '' ;
  dctExportData={}
  source: LocalDataSource;
  data;
  blnShowData=false;
  datTo;
  intPhone=null;
  datFrom;
  selectedFrom;
  selectedTo;
  lstItems=[]
  datStartDate;
  datEndDate;
  currentBranch='';
  lstData;
  dataSource;
  displayedColumns = ['account_name','opening_balance','current_balance','closing_balance'];
  intOpenTotal=0
  intCurrentTotal=0
  intCloseTotal=0
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      // custom: this.lstCustom,
      // custom: [{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},{ name: 'downloadrecord', title: '&nbsp;&nbsp;<i class="fas fa-print"></i>'},],
      position: 'right'
    },
    rowClassFunction: (row) =>{
      if(row.data.datDate == 'Closing Balance' || row.data.datDate == 'Opening Balance'){
        return 'total';
      }else{
        return 'other';
      }
      
    },
    // valuePrepareFunction : (cell, row) => {
    //   return '<span class="align">${cell}</span>';
    //   },
    columns: {
      account_name: {
        title: 'Account Name',
      },
      opening_balance: {
        title: 'Opening Balance',
      },
      current_balance: {
        title: 'Current Balance',
      },
      closing_balance: {
        title: 'Closing Balance',
      },
     
    },
    pager:{
      display:true,
      perPage:1000
      }
  };
  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private excelService: ExcelServicesService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source
      
  }


  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.datStartDate=new Date();
    this.datEndDate=new Date();

    this.lstPermission.forEach(item=> {

      if (item["NAME"] == "Cash Book") {
        this.blnDownload = item["DOWNLOAD"]
      }
    });

    this.searchBranch.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstBranch = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('branch/branch_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstBranch = response['data'];
              }
            );

        }
      }
    }
    );
    this.getData()
  }

  BranchChanged(item){
    this.intBranchId = item.id;
    this.strBranch = item.name;
    this.selectedBranch=item.name;
    this.currentBranch=item.name;
  }  
  branchNgModelChanged(event){
    if(this.currentBranch!=this.selectedBranch){
      this.intBranchId = null;
        this.strBranch = '';
   }
  } 
  getData()
  {
    this.dctExportData={datFrom:'',datTo:'',staff:'',customer:''}

    let dctData={};
    dctData['datFrom'] = moment(this.datStartDate).format('YYYY-MM-DD');
    dctData['datTo'] = moment(this.datEndDate).format('YYYY-MM-DD');

    if ((!this.datStartDate && this.datEndDate) || (this.datStartDate && !this.datEndDate)) {
      this.toastr.error('Please select From and To date', 'Error!');
      return false;
    }
    else if ((dctData['datFrom'] &&  dctData['datTo']) && ( dctData['datTo'] <  dctData['datFrom'])) {
      this.toastr.error('Please select correct date period', 'Error!');
      return false;
    }
    // else if(this.selectedBranch == ''){
    //   this.toastr.error('Select Valid branch', 'Error!');
    //   return ;
    // }
    if(this.selectedBranch){
      if (this.selectedBranch != this.strBranch)
        {
        this.intBranchId = null
        this.strBranch = ''
        this.selectedBranch=''
        this.toastr.error('Valid Branch Name is required', 'Error!');
        return false;
        }
    }

    if(this.intBranchId){
      dctData['intBranchId'] =this.intBranchId;
    this.dctExportData['strBranch']= this.strBranch

    }
    this.dctExportData['datFrom']= moment(this.datStartDate).format('DD-MM-YYYY');
    this.dctExportData['datTo']=  moment(this.datEndDate).format('DD-MM-YYYY');
    this.lstItems=[]
    this.spinnerService.show();

    this.serviceObject.postData('ledger/branch_wise_ledger/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1)
          {

            this.data=response['data'];

            if(this.data.length>0){
              this.dataSource=this.data
              this.dataSource = new MatTableDataSource(this.data);
              this.source = new LocalDataSource(this.data);  
              this.lstItems=response['data'];
              this.blnShowData=true;

              this.intOpenTotal=0
              this.intCloseTotal=0
               this.intCurrentTotal=0

              this.data.forEach(element => {
                this.intOpenTotal=this.intOpenTotal+element.opening_balance
                this.intCloseTotal=this.intCloseTotal+element.closing_balance
                this.intCurrentTotal=this.intCurrentTotal+element.current_balance

              });
              
             }
             else{
              this.blnShowData=false;
             }
             
          }  
          else if (response.status == 0) 
          {
           swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {   
        this.spinnerService.hide();
       swal.fire('Error','Something went wrong!!', 'error');
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

exportData(){
  // console.log(this.lstItems,"lstItems");
   let lstTempData=[]
    let count=1
    if(this.lstItems.length==0){
      swal.fire("Error!","No Data to Export","error");
      return false;
    }
    else{
      this.lstItems.forEach(element => {
        let dict={}
        // dict['Sno']=count;
        dict['Account Name']=element.account_name
        dict['Opening Balance']=element.opening_balance
        dict['Current Balance']=element.current_balance
        dict['Closing Balance']=element.closing_balance

        lstTempData.push(dict)
        count=count+1

      });
      // let dct={}
      // dct['Account Name']='Total'
      // dct['Opening Balance']=this.intOpenTotal
      // dct['Current Balance']=this.intCurrentTotal
      // dct['Closing Balance']=this.intCloseTotal

  
      // lstTempData.push(JSON.parse(JSON.stringify(dct)));
  //  console.log(lstTempData,"temp dat");
   

      let header=[];
      let lstTemp=[];

      lstTempData.forEach(d => {    
        let lstData=[];
        header=[];
          for(let key in d){     

              header.push(key);

            lstData.push(d[key]);
          }

          count++;
          lstTemp.push(lstData);
      }
      );

      let filters=[];

      if(this.dctExportData['strBranch']){
      filters.push(["Branch:",this.dctExportData['strBranch'],"","",""]);
      }

      let lstFooter=[];

      lstFooter=['Total',this.intOpenTotal,this.intCurrentTotal,this.intCloseTotal];

      let dctTemp={
        title:'Cash Book',
        fromDat:this.dctExportData['datFrom'],
        toDat:this.dctExportData['datTo'],
        filters:filters,
        header:header,
        data:lstTemp,
        footer:lstFooter
      }
  
      this.excelService.generateExcelJs(dctTemp);
  
    
      
        // this.excelService.exportAsCahBookExcel(lstTempData,this.dctExportData);
  }
}
}

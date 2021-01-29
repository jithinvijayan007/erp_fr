
import {debounceTime} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
import { ExcelServicesService } from 'src/app/services/excel-services.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import * as moment from 'moment' ;
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dayclosurereport',
  templateUrl: './dayclosurereport.component.html',
  styleUrls: ['./dayclosurereport.component.css']
})
export class DayclosurereportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  searchBranch: FormControl = new FormControl();
  selectedBranch ='';
  intBranchId;
  strBranch= '' ;
  currentBranch='';

  lstData=[];
  dataSource;
  lstDisplayedColumns = ['date','time','branch','closedBy','timeFirst','timeLast','total'];

  datFrom;
  datTo;
  dctData={}

  blnShowData=false;
  validationStatus=false;

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnDownload=false;

  lstBranch=[]
  branchOptions=[]
  branchConfig = {displayKey:"vchr_name", height: '200px',search:true ,customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'vchr_name',clearOnSelection: true }
  dctBranch={};

  constructor(
    private serverService: ServerService,
    private excelService: ExcelServicesService,
    private toastr: ToastrService,

  ) { }

  ngOnInit() {

    this.searchBranch.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstBranch = [];
      } else {
        if (strData.length >= 1) {
          this.serverService
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

    this.lstPermission.forEach(item=> {

      if (item["NAME"] == "Day Closure Report") {
        this.blnDownload = item["DOWNLOAD"]
      }
    });

    this.datFrom=new Date();
    this.datTo=new Date();

    this.blnShowData=false;

    this.dataSource = new MatTableDataSource(
      this.lstData
      // this.lstTemp
    );

    this.dataSource.paginator = this.paginator;
    // this.dataSource.paginator.firstPage();
    this.dataSource.sort = this.sort;
    
    // this.getBranches();
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

  getBranches(){

    this.serverService.getData('stock_prediction/branchlist/').subscribe(
      (response) => {
          if (response.status == 1)
          { 
            this.branchOptions=response['lst_branch'];
          }              
          else if (response.status == 0) 
          {
           swal.fire('Error!',"ERROR", 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  setValues(){

    // this.dctData['lstBanchId'] = undefined;

    // if(this.lstBranch.length>0){
    //   let lstData=[];

    //   this.dctBranch['Branch']=this.lstBranch[0]['vchr_name'];

    //   if(this.lstBranch.length>1){
    //     for (let i = 1; i < this.lstBranch.length; i++) {
    //       this.dctBranch['Branch']=this.dctBranch['Branch']+","+this.lstBranch[i]['vchr_name'];
    //     }
    //   } 

    //   this.lstBranch.forEach(element => {
    //     lstData.push(element.pk_bint_id)
    //   });
    //   this.dctData['lstBanchId'] = lstData;
    // }

    if(this.selectedBranch){
      if (this.selectedBranch != this.strBranch)
        {
        this.intBranchId = null
        this.strBranch = ''
        this.selectedBranch=''
        this.toastr.error('Valid Branch Name is required', 'Error!');
        this.validationStatus= false;
        }
    }

    if(this.intBranchId){
        this.validationStatus= true;
        this.dctData['intBranchId'] =this.intBranchId;
        this.dctBranch['Branch']= this.strBranch

    }
    else{
      this.validationStatus= false;
      this.toastr.error('Branch Name is required', 'Error!');

    }

    let datFrom = moment(this.datFrom).format('YYYY-MM-DD');
    let datTo = moment(this.datTo).format('YYYY-MM-DD');

    this.dctData['datFrom']=datFrom;
    this.dctData['datTo']=datTo;

  }


  getData(){
    this.validationStatus=false;

    this.blnShowData=false;
   
    this.setValues();
    if (this.datFrom > this.datTo)  {
      swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      
    }
    if(this.validationStatus==false){
      return false;
    }
  
    else{
      this.serverService.postData('dayclosure/day_closure_report/',this.dctData).subscribe(
        (response) => {
            if (response.status == 1)
            { 
              this.lstData=response['data'];
              this.dataSource = new MatTableDataSource(
                this.lstData
              );              
              this.dataSource.paginator = this.paginator;
              // this.dataSource.paginator.firstPage();
              // this.dataSource.sort = this.sort;
  
              if(this.lstData.length>0){
                this.blnShowData=true;
              }
              
  
            }  
            
            else if (response.status == 0) 
            {
             this.blnShowData=false;
             swal.fire('Error!',response['message'], 'error');
            }
        },
        (error) => {   
         swal.fire('Error!','Something went wrong!!', 'error');
        });


    }

  }

  exportData(){

    if(this.lstData.length>0){
    
    let header=['Date','Time','Branch','Closed By','First Invoice Time','Last Invoice Time','Amount'];
    let lstTemp=[];
    let colKeys=['date','time','strBranch','strClosedEmp','timeFirst','timeLast','intTotal'];
    this.lstData.forEach(d => {    
      let lstValues=[];
      // header=[];
        for(let key of colKeys){     
          // console.log("######key",key);
          
            // header.push(key);

          lstValues.push(d[key]);
        }

        lstTemp.push(lstValues);
    }
    );

    // console.log("######lstTemp",lstTemp);
    
    let filters=[];

    if(this.dctBranch['Branch']){
      filters=[];
      filters.push(["Branch:",this.dctBranch['Branch']]);
    }
  

    //footer

    let lstFooter=[];

    let datFrom = moment(this.datFrom).format('DD-MM-YYYY');
    let datTo = moment(this.datTo).format('DD-MM-YYYY');


    let dctTemp={
        title:'Day Closure Report',
        fromDat:datFrom,
        toDat:datTo,
        filters:filters,
        header:header,
        data:lstTemp,
        footer:lstFooter
      }
    
    this.excelService.generateExcelJs(dctTemp);

  }
  else{
    swal.fire("Error!","No Data to Export","error");
    this.blnShowData=false;
    return false;
  }

  }

}

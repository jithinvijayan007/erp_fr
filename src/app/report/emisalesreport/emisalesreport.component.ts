import { ExcelServicesService } from 'src/app/services/excel-services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ServerService } from 'src/app/server.service';
import * as moment from 'moment' ;

@Component({
  selector: 'app-emisalesreport',
  templateUrl: './emisalesreport.component.html',
  styleUrls: ['./emisalesreport.component.css']
})
export class EmisalesreportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  lstData=[];
  dataSource;
  lstDisplayedColumns = ['date','invoiceNo','branch','customerNa','customerMob','type','bankNa','amt','emi','refNum'];

  datFrom;
  datTo;
  dctData={}

  blnShowData=false;

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnDownload=false;

  lstBranch=[]
  branchOptions=[]
  branchConfig = {displayKey:"vchr_name", height: '200px',search:true ,customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'vchr_name',clearOnSelection: true }

  strType="credit";
  dctBranch={};

  constructor(
    private serverService: ServerService,
    private excelService: ExcelServicesService,

  ) { }

  ngOnInit() {

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

    this.lstPermission.forEach(item=> {

      if (item["NAME"] == "EMI SALES REPORT") {
        this.blnDownload = item["DOWNLOAD"]
      }
    });
    
    this.getBranches();

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

    this.dctData['lstBanchId'] = undefined;

    if(this.lstBranch.length>0){
      let lstData=[];

      this.dctBranch={};

      this.dctBranch['Branch']=this.lstBranch[0]['vchr_name'];

      if(this.lstBranch.length>1){
        for (let i = 1; i < this.lstBranch.length; i++) {
          this.dctBranch['Branch']=this.dctBranch['Branch']+","+this.lstBranch[i]['vchr_name'];
        }
      } 

      this.lstBranch.forEach(element => {
        lstData.push(element.pk_bint_id)
      });
      this.dctData['lstBanchId'] = lstData;
    }

    let datFrom = moment(this.datFrom).format('YYYY-MM-DD');
    let datTo = moment(this.datTo).format('YYYY-MM-DD');

    this.dctData['datFrom']=datFrom;
    this.dctData['datTo']=datTo;
    this.dctData['strType']=this.strType;

  }


  getData(){

    this.lstData=[];

    this.blnShowData=false;
   
    this.setValues();

    this.dctData['blnExport']=false;

    if (this.datFrom > this.datTo)  {
      swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      
    }
    else{
      this.serverService.postData('emi_report/lst_credit_debit/',this.dctData).subscribe(
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
                // console.log("######this.lstData['strEmi']",this.lstData[6]['strEmi']);
                
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
      let header=['Date','Invoice No','Branch','Customer','Customer Mobile','Type','Bank','Amount','EMI','Reference Number'];
      let lstTemp=[];
      let colKeys=['dateInvoice','strInvoiceNo','strBranch','strCusName','strCusMob','strType','strBank','intAmt','strEmi','intRefNo'];
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
        filters.push(["Branch:",this.dctBranch['Branch'],"","Type:",this.strType]);
      }
      else{ 
        filters=[];
        filters.push(["Type:",this.strType,"","",""]);
      }
    
  
      let datFrom = moment(this.datFrom).format('DD-MM-YYYY');
      let datTo = moment(this.datTo).format('DD-MM-YYYY');
  
      //footer
  
      let lstFooter=[];
  
  
      let dctTemp={
          title:'Credit/Debit EMI Sales Report',
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

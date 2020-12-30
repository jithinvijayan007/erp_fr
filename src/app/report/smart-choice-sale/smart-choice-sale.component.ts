import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment' ;

@Component({
  selector: 'app-smart-choice-sale',
  templateUrl: './smart-choice-sale.component.html',
  styleUrls: ['./smart-choice-sale.component.css']
})
export class SmartChoiceSaleComponent implements OnInit {
  datTo
  datFrom;
  blnShowData=false;
  lstBranch=[]
  branchOptions=[]
  dataSource;

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnDownload=false;

  branchConfig = {displayKey:"Name",search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'Name',clearOnSelection: true  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns=['dat_invoice','invoice_num','branch','cust_name','brand','item','quantity','imei','sold_value'];
  
  constructor( private serviceObject: ServerService,
    private spinnerService: NgxSpinnerService, ) { }

  ngOnInit() {

    this.lstPermission.forEach(item=> {

      if (item["NAME"] == "Smart Choice Report" && item["PARENT"] == "SALES") {
        this.blnDownload = item["DOWNLOAD"]
      }
    });

    this.datFrom= new Date();
    this.datTo= new Date();
    this.serviceObject.getData('reports/detailed_sales_report/').subscribe(
      (response) => {
          if (response.status == 1)
          { 
          this.branchOptions =  response['data'];
          }  
          else if (response.status == 0) 
          {
          //  this.blnShowData=false;
           Swal.fire('Error!',response['reason'], 'error');
          }
      },
      (error) => {   
       Swal.fire('Error!','Something went wrong!!', 'error');
      });
  }
  getData()
  {
    this.blnShowData=false;
    this.dataSource=[];
    let dctData = {}
    let error=false
   
    if(this.lstBranch.length>0){
      let lstData=[]
      this.lstBranch.forEach(element => {
        lstData.push(element.Id)
      });
      dctData['lstBranch'] = lstData;
    }
     
      
   
      this.datFrom = moment(this.datFrom).format('YYYY-MM-DD')
      this.datTo = moment(this.datTo).format('YYYY-MM-DD')
      
      if (this.datFrom > this.datTo || (!this.datFrom) || (!this.datTo) )  {
  
        Swal.fire({
          position: "center",
          type: "error",
          text: "Please select correct date period",
          showConfirmButton: true,
        });
        return;
      }
     
      

      dctData['datFrom'] = this.datFrom
      dctData['datTo'] = this.datTo

        
      this.spinnerService.show();

      this.serviceObject.postData('reports/smart_choice_sale_report/',dctData).subscribe(
        (response) => {
          this.spinnerService.hide();

            if (response.status == 1)
            {
                  
                 
              
                if(response['data'].length!=0){
                  this.blnShowData=true;
                  this.dataSource = new MatTableDataSource(
                    response['data']
                  );

                  this.dataSource.paginator = this.paginator;
                  this.dataSource.paginator.firstPage();
                  this.dataSource.sort = this.sort;
                }
                  
             
                  
              
            }  

            
            else if (response.status == 0) 
            {
             this.blnShowData=false;
             Swal.fire('Error!',response['reason'], 'error');
            }
        },
        (error) => {  
          this.spinnerService.hide();

         Swal.fire('Error!','Something went wrong!!', 'error');
        });

  }
  exportData()
  {
    
    let dctData = {}
    let error=false
   
    if(this.lstBranch.length>0){
      let lstData=[]
      this.lstBranch.forEach(element => {
        lstData.push(element.Id)
      });
      dctData['lstBranch'] = lstData;
    }
     
      
   
      this.datFrom = moment(this.datFrom).format('YYYY-MM-DD')
      this.datTo = moment(this.datTo).format('YYYY-MM-DD')
      
      if (this.datFrom > this.datTo || (!this.datFrom) || (!this.datTo) )  {
  
        Swal.fire({
          position: "center",
          type: "error",
          text: "Please select correct date period",
          showConfirmButton: true,
        });
        return;
      }
   
        dctData['bln_download'] = true;
      
      

      dctData['datFrom'] = this.datFrom
      dctData['datTo'] = this.datTo

        
      this.spinnerService.show();

      this.serviceObject.postData('reports/smart_choice_sale_report/',dctData).subscribe(
        (response) => {
          this.spinnerService.hide();

            if (response.status == 1)
            {
                  
                 
              
                
                if(!response.hasOwnProperty('file')){
                  this.blnShowData=false;
                  this.dataSource=[];
                  Swal.fire('Warning!','No data', 'warning');
                  return;
                }else{
                  const file_data = response['file'];
                  const dlnk = document.createElement('a');
                  dlnk.href = file_data;
                  dlnk.download = file_data;
                  document.body.appendChild(dlnk);
                  dlnk.click();
                  dlnk.remove();
                }
               
              
                  
              
            }  

            
            else if (response.status == 0) 
            {
             Swal.fire('Error!',response['reason'], 'error');
            }
        },
        (error) => {  
          this.spinnerService.hide();

         Swal.fire('Error!','Something went wrong!!', 'error');
        });

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

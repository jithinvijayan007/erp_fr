import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment' ;
@Component({
  selector: 'app-product-profit-report',
  templateUrl: './product-profit-report.component.html',
  styleUrls: ['./product-profit-report.component.css']
})
export class ProductProfitReportComponent implements OnInit {

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnDownload=false;

  datTo
  datFrom;
  blnShowData=false;
  lstBranch=[]
  branchOptions=[]
  dataSource;
  branchConfig = {displayKey:"name",search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'name',clearOnSelection: true  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns=['product','NetValue','TaxableValue','DP-Tax','Profit','DirectDiscount','IndirectDiscount','NetProfit'];
  
  constructor( private serviceObject: ServerService,
    private spinnerService: NgxSpinnerService, ) { }

  ngOnInit() {
    this.datFrom= new Date();
    this.datTo= new Date();

    this.lstPermission.forEach(item=> {

      if (item["NAME"] == "Product Report") {
        this.blnDownload = item["DOWNLOAD"]
      }
    });

    this.serviceObject.getData('reports/gdot_report/').subscribe(
      (response) => {
          if (response.status == 1)
          { 
          this.branchOptions =  response['branch'];
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
    
    this.dataSource =[];
    this.blnShowData=false;
    let dctData = {}
   
    if(this.lstBranch.length>0){
      let lstData=[]
      this.lstBranch.forEach(element => {
        lstData.push(element.id)
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

      this.serviceObject.postData('reports/product_profit_report/',dctData).subscribe(
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
             Swal.fire('Error!',response['data'], 'error');
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
   
    if(this.lstBranch.length>0){
      let lstData=[]
      this.lstBranch.forEach(element => {
        lstData.push(element.id)
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
      dctData['bln_download'] = true;
      
      this.spinnerService.show();

      this.serviceObject.postData('reports/product_profit_report/',dctData).subscribe(
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
             Swal.fire('Error!',response['data'], 'error');
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

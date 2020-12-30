import swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment' ;

@Component({
  selector: 'app-creditsalereport',
  templateUrl: './creditsalereport.component.html',
  styleUrls: ['./creditsalereport.component.css']
})
export class CreditsalereportComponent implements OnInit {

  constructor( 
    private serverService: ServerService,
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
    // private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService    ) { }

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
  
    lstData=[];
    dataSource;
    lstDisplayedColumns = ['invoiceNo','branch','date','customerNa','customerMob','billAmt','creditedAmt'];

    datFrom;
    datTo;
    dctData={}

    blnShowData=false;

    lstPermission=JSON.parse(localStorage.group_permissions)
    blnDownload=false;


    lstBranch=[]
    branchOptions=[]
    branchConfig = {displayKey:"vchr_name", height: '200px',search:true ,customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'vchr_name',clearOnSelection: true }
  

    lstTemp=[
      {fk_invoice__vchr_invoice_num:1,fk_invoice__fk_branch__vchr_name:'chalakudy',fk_invoice__dat_invoice:'6/8/2020',fk_invoice__fk_customer__vchr_name:'temp1 customer',fk_invoice__fk_customer__int_mobile:'9988776655',dbl_bill_amt:10000,dbl_credit_amt:3000},
      {fk_invoice__vchr_invoice_num:2,fk_invoice__fk_branch__vchr_name:'irinjalakuda',fk_invoice__dat_invoice:'1/2/2020',fk_invoice__fk_customer__vchr_name:'temp2 customer',fk_invoice__fk_customer__int_mobile:'9188776655',dbl_bill_amt:12000,dbl_credit_amt:1000},
      {fk_invoice__vchr_invoice_num:3,fk_invoice__fk_branch__vchr_name:'angamaly',fk_invoice__dat_invoice:'3/8/2020',fk_invoice__fk_customer__vchr_name:'temp3 customer',fk_invoice__fk_customer__int_mobile:'9288776655',dbl_bill_amt:13000,dbl_credit_amt:2000},
      {fk_invoice__vchr_invoice_num:4,fk_invoice__fk_branch__vchr_name:'chavakad',fk_invoice__dat_invoice:'6/3/2020',fk_invoice__fk_customer__vchr_name:'temp4 customer',fk_invoice__fk_customer__int_mobile:'9388776655',dbl_bill_amt:14000,dbl_credit_amt:4000},
      {fk_invoice__vchr_invoice_num:5,fk_invoice__fk_branch__vchr_name:'aluva',fk_invoice__dat_invoice:'5/2/2020',fk_invoice__fk_customer__vchr_name:'temp5 customer',fk_invoice__fk_customer__int_mobile:'9448776655',dbl_bill_amt:15000,dbl_credit_amt:5000}

    ]

    ngOnInit() {

      this.datFrom=new Date();
      this.datTo=new Date();

      this.blnShowData=false;

      this.lstPermission.forEach(item=> {

        if (item["NAME"] == "Credit Sales Report") {
          this.blnDownload = item["DOWNLOAD"]
        }
      });

      this.dataSource = new MatTableDataSource(
        this.lstData
        // this.lstTemp
      );

      this.dataSource.paginator = this.paginator;
      // this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;

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

      this.dctData['lstBranch'] = undefined;

      if(this.lstBranch.length>0){
        let lstData=[];
        this.lstBranch.forEach(element => {
          lstData.push(element.pk_bint_id)
        });
        this.dctData['lstBranch'] = lstData;
      }

      let datFrom = moment(this.datFrom).format('YYYY-MM-DD');
      let datTo = moment(this.datTo).format('YYYY-MM-DD');

      this.dctData['datFrom']=datFrom;
      this.dctData['datTo']=datTo;
    }

    getData(){
      this.blnShowData=false;
     
      this.setValues();

      this.dctData['blnExport']=false;

      this.serverService.postData('reports/credit_sale_report/',this.dctData).subscribe(
        (response) => {
            if (response.status == 1)
            { 
              this.lstData=response['lst_credit'];
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

    exportData(){
      if(this.lstData.length>0){
        this.setValues();
        this.dctData['blnExport']=true;
        this.serverService.postData('reports/credit_sale_report/',this.dctData).subscribe(
          (response) => {
              if (response.status == 1)
              { 
                // console.log("IF");
                
                this.lstData=response['lst_credit'];
                this.dataSource = new MatTableDataSource(
                  this.lstData
                );

                this.dataSource.paginator = this.paginator;
                // this.dataSource.paginator.firstPage();
                // this.dataSource.sort = this.sort;

                if(this.lstData.length>0){

                  this.blnShowData=true;

                  var a = document.createElement('a');
                  document.body.appendChild(a);
                  a.href = response['export'];
                  a.download = 'report.xlsx';
                  a.click();
                  a.remove();
                      
                  this.toastr.success('Successfully Exported', 'Success!');
                }
                else{
                  this.toastr.error('No Data Found', 'Error!');

                }
             
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
      }
      else{
        this.toastr.error('No Data Found', 'Error!');
        
      }
    }
    
}

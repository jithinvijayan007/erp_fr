import { Component,ViewChild, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { ServerService } from '../../server.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {

  selected= {startDate: new Date(), endDate: new Date()};
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  locale = {
    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'MM/DD/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom range',
    // daysOfWeek: moment.weekdaysMin(),
    // monthNames: moment.monthsShort(),
    firstDay: 1 // first day is monday
  }
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  data = [];
  blnShowData = false
  displayedColumns = ['vchr_job_num','servicer_full_name','action']
  displayedColumns2 = ['no','item_name','item_code','branch_name','quantity','action']
  strUserGroup = '';
  intTableStatus = 0;
  
  constructor(private datePipe: DatePipe, private spinner: NgxSpinnerService, private serverService: ServerService, public router: Router) { }
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.strUserGroup = localStorage.getItem('group_name').toUpperCase();
    if (this.strUserGroup == 'PROCUREMENT TEAM'){
      this.intTableStatus =2
    }else{
      if (this.strUserGroup == 'CENTRAL MANAGER'){
        this.intTableStatus =1
      }
    }
  }

  getEnquiry(event) {
    

    let dctData = {
      start_date: this.datePipe.transform(this.selected['startDate'],'yyyy-MM-dd'),
      end_date: this.datePipe.transform(this.selected['endDate'],'yyyy-MM-dd'),
    }
 
    // console.log(" data o backend",dctData);
    if(this.intTableStatus == 1){
      this.spinner.show()
      this.serverService.putData('service/spare_request/',dctData).subscribe(
        (response) => {
          this.spinner.hide();

            if (response.status == 1)
            {
              this.data=response['data'];
              
              if(this.data.length>0){
                // this.blnShowData=true;
                this.blnShowData=true;

              //  this.dataSource=this.data
                this.dataSource = new MatTableDataSource(this.data);
              }
              else{
                // this.blnShowData=false;
                this.blnShowData= false;
                
              }
            }  
            else if (response.status == 0) 
            {
            swal.fire('Error!','Something went wrong!!', 'error');
            }
        },
        (error) => {  
          this.spinner.hide();

        swal.fire('Error!','Something went wrong!!', 'error');
      });
    }
  if(this.intTableStatus == 2){
    
    this.spinner.show()
      this.serverService.putData('service/spare_request/',dctData).subscribe(
        (response) => {
          this.spinner.hide();

            if (response.status == 1)
            {
              this.data=response['data'];
              
              if(this.data.length>0){
                // this.blnShowData=true;
                this.blnShowData=true;

              //  this.dataSource=this.data
                this.dataSource2 = new MatTableDataSource(this.data);
              }
              else{
                // this.blnShowData=false;
                this.blnShowData= false;
                
              }
            }  
            else if (response.status == 0) 
            {
            swal.fire('Error!','Something went wrong!!', 'error');
            }
        },
        (error) => {  
          this.spinner.hide();

        swal.fire('Error!','Something went wrong!!', 'error');
      });
  }
      
   
      
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if(this.intTableStatus == 1){
      this.dataSource.filter = filterValue;
    }else{
      if(this.intTableStatus == 2){
        this.dataSource2.filter = filterValue;
      }
    }

  }

  onView(item){
    localStorage.setItem('jobId',item.pk_bint_id.toString());    
    this.router.navigate(['/spare-request/cm-request-view']);
  }

  viewSpareRequestDetails(jobId){

    localStorage.setItem('spareRequestId', jobId.toString())
    this.router.navigateByUrl('/spare-request/request-view')
       
  }
}

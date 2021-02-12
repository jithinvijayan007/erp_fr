import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import Swal from 'sweetalert2'
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import * as moment from "moment"
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shift-exemption-list',
  templateUrl: './shift-exemption-list.component.html',
  styleUrls: ['./shift-exemption-list.component.css']
})
export class ShiftExemptionListComponent implements OnInit {

  datSelected=null;
  lstShiftExmpData=[];
  displayedColumns = ["startdate","enddate","group","type","action"];
  strFilterType='date';
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort
  @ViewChild('empId',{'static':false}) empId: ElementRef;
  
  searchEmployee : FormControl= new FormControl();
  lstEmployeeData=[];
  selectedEmployee='';
  selectedEmployeeId=null;
  lstEmpSelected=[];
  lstSelectedEmpId=[];
  strEmployee='';

  dataSource = new MatTableDataSource(this.lstShiftExmpData);

  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService


  ) { 
    
  }

  ngOnInit() {

    //--------------------employee list dropdown ends ----------------// 
  
    this.searchEmployee.valueChanges
    // .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstEmployeeData = [];
      } else {
        let dctTemp={};
        if (strData.length >= 1) {
          dctTemp['strTerm']=strData;
          this.serverService
            .postData('attendance_fix/user_typeahead/', dctTemp)
            .subscribe(
              (response) => {
                this.lstEmployeeData = response['data'];
              }
            );
        }
      }
    }
    );

    // this.getEmployeeList()
  }

  getEmployeeList(){ //load Employee list list data

    this.lstShiftExmpData=[];
    let dctTempData={}
    if(this.strFilterType=='date' && !this.datSelected){
      Swal.fire("Error!","Select Date","error");
      return false;
    }
    else if(this.strFilterType=='date' && this.datSelected){
      dctTempData['datSelected']=moment(this.datSelected).format('YYYY-MM-DD')
    }
    if(this.strFilterType=='emp' && this.lstSelectedEmpId.length ==0) {
      Swal.fire("Error!","Select atleast one employee","error");
      return false;
    
    }
    else if(this.strFilterType=='emp' && this.lstSelectedEmpId.length >0){
      dctTempData['lstEmpId']=this.lstSelectedEmpId
    }

    this.spinner.show();
    this.serverService.postData('shift_schedule/shift_exemption_list/',dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstShiftExmpData=response['data'];
            this.dataSource= new MatTableDataSource(this.lstShiftExmpData);
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort;
            // this.dataSource.paginator.firstPage();

          }  
      },
      (error) => { 
        this.spinner.hide();  
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ViewDetails(intId){
    this.router.navigateByUrl('/attendance/shift-exemption-view',{ state : {intId: intId, action: 'VIEW', previousUrl: this.router.url} });

  }
  addEmployee (event) {
    if (this.lstEmpSelected.filter(x => x.intId === event.intId).length === 0) {
      this.lstEmpSelected.push(event);
      this.lstSelectedEmpId.push(event.intId.toString());
    }
    this.strEmployee = '';
    this.empId.nativeElement.value = '';
    this.lstEmployeeData=[];
    
  }
  removeEmployee(value) {
    
    const index = this.lstEmpSelected.indexOf(value);
    const index2 = this.lstSelectedEmpId.indexOf(value.intId.toString());
  if (index > -1) {
    this.lstEmpSelected.splice(index, 1);
  }
  if (index2 > -1) {
    this.lstSelectedEmpId.splice(index2, 1);
  }
  this.lstEmployeeData=[];

  }
  
  typeChanged(){
    this.datSelected=null;
    this.lstSelectedEmpId=[];
    this.lstEmpSelected=[];
    this.strEmployee=''
  }
  deleteDetails(item) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        let dct_data={}
        dct_data['intId']=item.intId;


        this.spinner.show();
        this.serverService.patchData('shift_schedule/shift_exemption_list/',dct_data).subscribe(
          (response) => {
            this.spinner.hide();
              if (response.status == 1) {
                Swal.fire('Success','Deleted! ','success');
                this.getEmployeeList();
              }
              else{
                Swal.fire('Error!',response['message'],'error');
              }  
            },
            (error) => {   
              this.spinner.hide();
              Swal.fire('Error!','Something went wrong!!', 'error');
              
            });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        
      }  
    })
  }


}

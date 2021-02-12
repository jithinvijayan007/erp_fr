import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-combo-off-report',
  templateUrl: './combo-off-report.component.html',
  styleUrls: ['./combo-off-report.component.css']
})
export class ComboOffReportComponent implements OnInit {

  lstComoData=[];
  dataSource= new MatTableDataSource(this.lstComoData);
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  displayedColumns=['code','strEMPName','intApplied','intApproved','intProcced'];
  lstAvailabeDate=[];
  modalRef;
  strType='compo';

  lstBranches=[];
  searchBranch: FormControl = new FormControl();
  selectedBranch='';
  lstselectedBranchId=[];
  strBranchName='';

  lstDepartment=[];
  lstSelectedDepartmentId=[];

  strDesig=[];
  lstSelectedDesigId=[];
  lstDesignationData=[];
  intDesignationId=null;

  searchEmployee: FormControl = new FormControl();
  lstEmployeeData=[];
  selectedEmployee='';
  selectedEmployeeId=null;
  lstEmpSelected=[];
  lstSelectedEmpId=[];
  strEmployee='';
  strStatusType='';

  @ViewChild('empId',{'static':false}) empId: ElementRef;

  constructor(
    private serverService: ServerService,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

    //--------------------department list dropdown ----------------//
    this.serverService.getData('department/list_departments/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDepartment=response['lst_department'];
          }  
      },
      (error) => {   
        
      });
    //--------------------department list dropdown ends ----------------//
      //--------------------branch list dropdown -------------------//
      this.serverService.getData('branch/add_branch/').subscribe(
        (response) => {
            if (response.status == 1) {
              this.lstBranches =response['lst_branch'];
            }  
          },
          (error) => {   
        });
    //--------------------branch list dropdown ends -------------------//



    // filtered employee typeahead using lists
    this.searchEmployee.valueChanges
    // .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstEmployeeData = [];
      } else {
        let dctTemp={};
          if(this.lstSelectedDepartmentId.length>0){
            dctTemp['lstDeptId'] = this.lstSelectedDepartmentId;
          }
          if(this.lstSelectedDesigId.length>0){
            dctTemp['lstDesigId']=this.lstSelectedDesigId;
          }
          if(this.lstselectedBranchId){
            dctTemp['lstBranchId']=this.lstselectedBranchId;
          }
        if (strData.length >= 1) {
          dctTemp['strTerm']=strData;
          this.serverService
            .patchData('combo_off/combo_view/', dctTemp)
            .subscribe(
              (response) => {
                this.lstEmployeeData = response['data'];
              }
            );
        }
      }
    }
    );
  this.getDesigData();
  
this.getComboOffList()
  }

  getComboOffList() { //load combo-off details data

    let dctTempData={};
    dctTempData['strType']=this.strType;
    dctTempData['lstBranch']=this.lstselectedBranchId;
    if(this.lstSelectedDepartmentId.length>0){
      dctTempData['lstDepartment'] = this.lstSelectedDepartmentId;
    }
    if(this.lstSelectedDesigId.length>0){
      dctTempData['lstDesignation']=this.lstSelectedDesigId;
    }
    if(this.lstSelectedEmpId){
      dctTempData['lstEmp']=this.lstSelectedEmpId;
    }
    this.lstComoData=[];
    this.spinner.show();
    this.serverService.putData('combo_off/combo_view/',dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstComoData=response['data'];
            this.dataSource= new MatTableDataSource(this.lstComoData);
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort;
            // this.dataSource.paginator.firstPage();

          }
          else{
            Swal.fire("Error!",response['reason'],"error");
          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  openModal(modalTimeDetails,intEmpId,strStatusType){
    this.lstAvailabeDate = [];
    this.strStatusType=strStatusType;
    this.spinner.show();
    let dctData={'intEmpId':intEmpId ,'strStatusType':strStatusType,'strType':this.strType}
    this.serverService.postData('combo_off/combo_view/',dctData).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstAvailabeDate = response['data'];

          }  
      },
      (error) => {  
        this.spinner.hide(); 
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
   this.modalRef = this.modalService.open(modalTimeDetails, { size: 'lg', windowClass: 'classname' });
  }
  closeModal() {
    this.modalRef.close();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  // branchChanged(item){

  //   // this.lstAllocatedData[index]['intBranchId']=item.id;
    
    
  //   this.selectedBranch=item.name;
  //   this.selectedBranchId=item.id;
  // }
  // branchChange(){
    
  //   if(this.selectedBranch!=this.strBranchName){
  //     this.selectedBranch='';
  //     this.selectedBranchId=null;
  //     // this.lstAllocatedData[index]['intBranchId']=null;

  //   }
  // }
  getDesigData() {

    this.lstDesignationData=[];
    this.strDesig=[];
    this.lstSelectedDesigId=[];
    this.serverService.putData('job_position/list/',{'lstDepartmentId':this.lstSelectedDepartmentId}).subscribe(
      (response) => {
          if (response.status == 1) {
            // this.lstDesignationData[0]={fk_department__vchr_name: null,fk_department_id: null,int_area_type: null,pk_bint_id: 0,vchr_name: "ALL"}
            // this.lstDesignationData=this.lstDesignationData.concat(response['lst_job_position']);
            this.lstDesignationData=response['lst_job_position'];


              // this.strDesig=this.lstDesignationData[0];
              // this.intDesignationId = this.strDesig['pk_bint_id'];
          }  
        },
        (error) => {   
      });
  }

  addEmployee (event) {
    if (this.lstEmpSelected.filter(x => x.intId === event.intId).length === 0) {
      this.lstEmpSelected.push(event);
      this.lstSelectedEmpId.push((event.intId).toString());
    }
    this.strEmployee = '';
    this.empId.nativeElement.value = '';
    this.lstEmployeeData=[];
    
  }
  removeEmployee(value) {
    
    const index = this.lstEmpSelected.indexOf(value);
    const index2 = this.lstSelectedEmpId.indexOf((value.intId).toString());
  if (index > -1) {
    this.lstEmpSelected.splice(index, 1);
  }
  if (index2 > -1) {
    this.lstSelectedEmpId.splice(index2, 1);
  }
  this.lstEmployeeData=[];
  }

}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/server.service';
import Swal from "sweetalert2";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { templateJitUrl } from '@angular/compiler';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shift-exemption-view',
  templateUrl: './shift-exemption-view.component.html',
  styleUrls: ['./shift-exemption-view.component.css']
})
export class ShiftExemptionViewComponent implements OnInit {

  intExmptId=null;
  previousUrl;
  dctExmptDetails={};
  lstExmptEmpData=[];
  lstEmployeeData=[];
  dataSource = new MatTableDataSource(this.lstExmptEmpData);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns=["code","name","branch","department","action"];

  strPopupName="";
  intPopupId=null;
  datPoupupFrom=null;
  datPopupTo=null;
  modalEdit;
  minDate=new Date();
  constructor(
    public router: Router,
    private serverService: ServerService,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.intExmptId=history.state['intId'];
    if(!history.state['previousUrl']){
      this.router.navigate(['/attendance/shift-exemption-list'])      
    }
    this.previousUrl=history.state['previousUrl'];

    this.getViewDetails(this.intExmptId);
  }
  getViewDetails(intExmpId){
    let dctTempData={};
    dctTempData['intId']=intExmpId;
    this.spinner.show();
    this.serverService.putData('shift_schedule/shift_exemption_list/',dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.dctExmptDetails=response['data'];
            this.lstExmptEmpData=response['data']['lstEmpData'];
            this.dataSource=new MatTableDataSource(this.lstExmptEmpData);
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort;
          // }  
      }
    },
    (error) => {   
      this.spinner.hide();
      Swal.fire('Error!','Something went wrong!!', 'error');
      
    });
  }
  BackClicked() {
    this.router.navigate([this.previousUrl]);
  }
  deleteDetails(item) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete "+item.strName+" from the list?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        let dct_data={}
        dct_data['intId']=this.dctExmptDetails['intId'];
        dct_data['intEmpId']=item.intEmpId;


        this.spinner.show();
        this.serverService.patchData('shift_schedule/shift_exemption/',dct_data).subscribe(
          (response) => {
            this.spinner.hide();
              if (response.status == 1) {
                Swal.fire('Success','Deleted! ','success');
                
                this.getViewDetails(response['intId']);
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
  opnEditModal(item,modalEditDate) {
    this.strPopupName=item.strName;
    this.intPopupId=item.intEmpId;
    this.datPopupTo=this.dctExmptDetails['datEnd'];
    this.datPoupupFrom=this.dctExmptDetails['datStart'];
    this.modalEdit=this.modalService.open(modalEditDate, { size: 'lg', windowClass: 'filteritemclass' });
  }
  closeEditModal () {
    this.modalEdit.close();
  }

}


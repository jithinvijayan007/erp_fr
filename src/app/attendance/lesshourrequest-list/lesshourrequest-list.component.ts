import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
// import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-lesshourrequest-list',
  templateUrl: './lesshourrequest-list.component.html',
  styleUrls: ['./lesshourrequest-list.component.css']
})
export class LesshourrequestListComponent implements OnInit {
  intRequestId;
  strRemarks;
  lstData = []
  popUp;
  dataSource=new MatTableDataSource(this.lstData);
  displayedColumns=["emp_code","emp_name","vchr_name","dat_requested","action"]

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator
  constructor(
    public serverService:ServerService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    ) { }
  ngOnInit() {
    this.getData();
  }
  getData(){
    let strListType = 'REQUEST';

    this.spinner.show();
    this.serverService.getData("less_hour_deduction/late_hour/?listType="+strListType).subscribe(
      (response) => {
        this.spinner.hide();
        if(response['status']==1){
        this.lstData = response['data']
        this.dataSource=new MatTableDataSource(this.lstData);
        this.dataSource.paginator=this.paginator
        }
      },
      (error) => {
        this.spinner.hide();
  
      });
  }
  approveRequest(intRequestId){
    let dctTempData={'intStatus':1,
    'intRequestId':intRequestId}
    this.spinner.show();
    this.serverService.patchData('less_hour_deduction/late_hour/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire("Success",'Successful',"success");
          this.getData();
        } else if (response.status === 0) {
          Swal.fire("Error!",response['reason'],"error");
      }

    },
  (error) => {
    this.spinner.hide();

  });
  }
  rejectRequest(){
    if(!this.strRemarks && this.strRemarks==null){
      Swal.fire("Error!",'Enter Remarks',"error");
      return;
    }
           let dctTempData={'intStatus':-1,
                            'intRequestId':this.intRequestId,
                            'strRemarks':this.strRemarks}
          this.spinner.show();
          this.serverService.patchData('less_hour_deduction/late_hour/',dctTempData)
          .subscribe(
            (response) => {
              this.spinner.hide();
              if (response.status === 1) {
                this.hideModal();
                this.getData();
              } else if (response.status === 0) {
                Swal.fire("Error!",response['reason'],"error");
            }

          },
        (error) => {
          this.spinner.hide();

        });
      
  }
  deletePopupModal(deletePopup,intRequestId){
    this.intRequestId = intRequestId;
    this.popUp = this.modalService.open(deletePopup, { size: 'sm', windowClass: 'filteritemclass' });
  }
  hideModal (){
    this.intRequestId=null;
    this.popUp.close();
  }
}

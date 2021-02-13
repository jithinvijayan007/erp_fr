import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import * as moment from 'moment'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manual-attendance-list',
  templateUrl: './manual-attendance-list.component.html',
  styleUrls: ['./manual-attendance-list.component.css']
})
export class ManualAttendanceListComponent implements OnInit {

  lstAttendanceData=[];
  datOfAttendance;
  lstPermission=[];
  blnAdd=true;
  blnView=true;
  blnEdit=true;
  blnDelete=true;
  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {
  // //_______________________setting up permissions___________________________
  //     this.lstPermission = JSON.parse(localStorage.getItem("permission"));    
  //     this.lstPermission.forEach((item, index, array) => {
  //     if (item["NAME"] == "") {
  //       this.blnAdd = item["ADD"];
  //       this.blnView = item["VIEW"];
  //       this.blnEdit = item["EDIT"];
  //       this.blnDelete = item["DELETE"];
  //       }
  //     });
  // //_______________________setting up permissions___________________________
  }

  getManualAttendanceData(){ //load manual attendance data

    this.lstAttendanceData=[];
    let dctTempData={};
    dctTempData['datAttendance']=moment(this.datOfAttendance).format('YYYY-MM-DD')

    this.spinner.show();
    this.serverService.postData('attendance_fix/list/',dctTempData).subscribe(
      (response) => {
        this.spinner.hide()
          if (response.status == 1) {
            this.lstAttendanceData=response['lst_data'];
            this.datOfAttendance=moment(this.datOfAttendance).format('YYYY-MM-DD')

          }  
      },
      (error) => {  
        this.spinner.hide(); 
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  editAttendance(item){
    let intManAttendaceId
    intManAttendaceId = item.pk_bint_id;
    localStorage.setItem("professionTaxAction","edit")
    localStorage.setItem("intManAttendaceId", intManAttendaceId);
    this.router.navigate(["/attendance/manualattendance"]);
  }
  deleteAttendance(item) {
    let dctTempData={}
    dctTempData['intId']=item.pk_bint_id;
    this.spinner.show();
    this.serverService.patchData('attendance_fix/fix/',dctTempData)
      .subscribe(
          (response) => {
            this.spinner.hide();
             if (response.status === 1) {
              Swal.fire('Data deleted successfully');
              this.getManualAttendanceData();
            }
           else if (response.status === 0) {
              Swal.fire('Data deletion failed');
      }
  },
  (error) => {
    this.spinner.hide();
  });
  }


}

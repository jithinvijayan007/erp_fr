import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-viewshift',
  templateUrl: './viewshift.component.html',
  styleUrls: ['./viewshift.component.css']
})
export class ViewshiftComponent implements OnInit {

  lstShiftDetails=[];
  intShiftId=localStorage.getItem('intShiftId');
  blnAllowance=false;
  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit(
  ) {
    this.viewShiftDetails();
  }

  viewShiftDetails(){
    this.lstShiftDetails=[];
    this.spinner.show();
    this.serverService.getData('shift_schedule/add_shift/?id='+this.intShiftId).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstShiftDetails=response['lst_shift_shedule'];

            
            this.blnAllowance=this.lstShiftDetails[0].bln_allowance;


          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  clearFields(){
    this.router.navigate(["/attendance/listshift"]);
  
  }

}

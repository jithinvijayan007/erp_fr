import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-stockrequestview',
  templateUrl: './stockrequestview.component.html',
  styleUrls: ['./stockrequestview.component.css']
})
export class StockrequestviewComponent implements OnInit {

  constructor(private serviceObject: ServerService,
    public toastr: ToastrService,
    public router: Router,
   ) { }

  dctMasterData = {};
  data = [];
  transferType;
  blnReject=false;
  intId;
displayedColumns = ['slno', 'fk_item__vchr_name', 'int_qty'];
dataSource;
  ngOnInit() {
  

    
    if (localStorage.getItem('stockRequestedData')) {
      if(localStorage.getItem('previousUrl')=='stockrequest/requestedlist'){
        localStorage.setItem('stockRequestedStatus', '1');    
      } 
    }
   
    else if(localStorage.getItem('stockRequestData')){
      
      
      if(localStorage.getItem('previousUrl')=='stockrequest/stockrequestlist'){
        localStorage.setItem('stockRequestStatus', '1');
      }
    }
  
    this.listData();
    this.transferType = localStorage.getItem('stockRequestType');
  }
listData () {
  this.intId = localStorage.getItem('stockRequestId');
  this.serviceObject.postData('internalstock/requestview/', {'int_id': this.intId}).subscribe(res => {
    if (res.status === 1) {
      res['details_data'].forEach((element, index) => {
        element['slno'] = index + 1;
      });
      this.dataSource = res['details_data'];
      // this.data =  res['details_data'];
      // this.source = new LocalDataSource(this.data); // create the source
      this.dctMasterData = res['request_data'][0];
        this.dctMasterData['dat_request'] = moment(this.dctMasterData['dat_request']).format('DD-MM-YYYY');
        this.dctMasterData['dat_expected'] = moment(this.dctMasterData['dat_expected']).format('DD-MM-YYYY HH:MM');
        if (this.dctMasterData['status'] == 'REJECTED')
        {
          this.blnReject=true
        }
    } else {
      this.toastr.error('Error occured ' );
    }
  });
}
goBack() {
  if (this.dctMasterData['status'] === 'APPROVED' && this.transferType === 'from') {
  localStorage.setItem('previousUrl','stockrequest/stockrequestlist');
    
    this.router.navigate(['stockrequest/stockrequestlist']);
  } else {
    localStorage.removeItem('stockRequestId');
    localStorage.setItem('previousUrl','stockrequest/requestedlist');
    this.router.navigate(['stockrequest/requestedlist']);
  }

}
cancelData() {
  const dctData = {
    'int_id': this.intId,
    'type': 'from'
  };
  swal.fire({
    title: 'Do you want to cancel request?',
    // text: 'You wont be able to revert this!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.value) {
      this.serviceObject.postData('internalstock/cancelrequest/', dctData).subscribe(res => {
        if (res.status === 1) {
          this.toastr.success(this.dctMasterData['vchr_stkrqst_num'] + ' Cancelled ');
          localStorage.removeItem('stockRequestId');
  localStorage.setItem('previousUrl','stockrequest/requestedlist');
          
          this.router.navigate(['stockrequest/requestedlist']);
          this.goBack();
        } else {
          this.toastr.error('Error occured ' );
        }
      });
    }
  });



}
}

import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-view-journal',
  templateUrl: './view-journal.component.html',
  styleUrls: ['./view-journal.component.css']
})
export class ViewJournalComponent implements OnInit {

  intJournalId = localStorage.getItem('journalId');
  intDebitType = localStorage.getItem('intDebitType');
  intCreditType = localStorage.getItem('intCreditType');

  dctJournalData = {};

  constructor(private serviceObject : ServerService,
    private toastr: ToastrService,
    public router: Router,
     ) { }

  ngOnInit() {
    this.getData()
  }


  getData(){

    let dctData = {};
    dctData['intJournalId'] = this.intJournalId;
    dctData['intDebitType'] = this.intDebitType;
    dctData['intCreditType'] = this.intCreditType;
    

    this.serviceObject.patchData('transaction/journal/',dctData).subscribe(res => {

      if (res.status == 1)
      {
        this.dctJournalData = res['dct_data'];
    
      }
       
      else if (res.status == 0) {
        swal.fire('Error!','Something went wrong!!', 'error');
       
   
      }
  },
  (error) => {
    swal.fire('Error!','Server Error!!', 'error');
  });
  }

}

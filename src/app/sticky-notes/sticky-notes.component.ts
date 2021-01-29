import swal from 'sweetalert2';
import { TypeaheadService } from '../typeahead.service';
import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';

// calender
import {startOfDay, endOfDay, subDays, addDays, isSameDay, isSameMonth} from 'date-fns';
// import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';



import { MatDialogConfig } from '@angular/material/dialog';
import {  MatFormField } from '@angular/material/form-field';

// calender
import { NgxSpinnerService } from 'ngx-spinner';

// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import {
//   Validators,
//   FormControl
// } from '@angular/forms';
import { Router } from '@angular/router';
// import 'rxjs/add/operator/startWith';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
import { ServerService } from '../server.service';
import { DatePipe } from '@angular/common';
// calender
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
@Component({
  selector: 'app-sticky-notes',
  templateUrl: './sticky-notes.component.html',
  styleUrls: ['./sticky-notes.component.scss'],
})
export class StickyNotesComponent implements OnInit {
  stickyTitle = '';
  stickyDesc = '';
  dctStickyData = {};
  lstStickyData = [];
  // tempStickeyTitle = ''
  // tempStickeyNote = ''
  flag = { 1: true, 2: true, 0: true };
  color = '';
  intlength = null;
  // stickyTitleEdit = '';
  // stickyDescEdit = '';
  currentUserId = localStorage.getItem('userId');
  dctStatus = {
    MOBILESTATUS: false,
    SMS: false,
    FLIGHTS: false,
    HOTEL: false,
    VISA: false,
    TRAINS: false,
    TRAVELINSURANCE: false,
    FOREX: false,
    TRANSPORT: false,
    PACKAGE: false,
    KCT: false,
    OTHER: false,
    ASSIGNSTATUS: true,
    PACKAGEHOTEL: [],
    PACKAGETRANSPORT: [],
    SUBMITTED: false
  };
  constructor(
    private spinnerService: NgxSpinnerService,
    private typeServ: TypeaheadService,
    public router: Router,
    private servServ: ServerService,
    private datePipe: DatePipe,
    // calender
    private modal: NgbModal,
    private cdRef: ChangeDetectorRef // calender
  ) {}

  ngOnInit() {
    this.listSticky();
  }
  addSticky() {
    // if(this.intlength >= 2){
    if (this.intlength >= 1) {
      swal.fire({
        title: 'Atmost 1 notes',
        type: 'error',
        text: 'Cannot add more than 1 notes ',
        confirmButtonText: 'OK'
      });
      this.stickyTitle = '';
      this.stickyDesc = '';
      this.color = '';

      this.dctStatus.SUBMITTED = false;
      return false;
    } else {
      this.dctStickyData = {};
      this.dctStickyData['title'] = this.stickyTitle;
      this.dctStickyData['description'] = this.stickyDesc;
      this.dctStickyData['userId'] = this.currentUserId;
      this.dctStickyData['color'] = this.color;

      // this.servServ.addSticky(this.dctStickyData).subscribe(
      //   res => {
      //     const result = res;
      //     if (result['status'] === 'success') {
      //       this.listSticky();
      //       this.stickyTitle = '';
      //       this.stickyDesc = '';
      //       this.color = '';
      //     } else {
      //       swal('Error', result['result'], 'error');
      //     }
      //   },
      //   error => {
      //     swal('Error', error, 'error');
      //   }
      // );

      //edited

      this.servServ.postData('sticky_notes/stickynotes/',this.dctStickyData).subscribe(
        res => {
          const result = res;
          if (result['status'] === 1) {
            this.listSticky();
            this.stickyTitle = '';
            this.stickyDesc = '';
            this.color = '';
          } else {
            swal.fire('Error', result['result'], 'error');
          }
        },
        error => {
          swal.fire('Error', error, 'error');
        }
      );
    }
  }
  editData(data, id) {
    const stickyTitleEdit = data.vchr_head;
    const stickyDescEdit = data.vchr_description;
    if (stickyTitleEdit.trim() === '') {
      swal.fire({
        title: 'Title empty',
        type: 'error',
        text: 'Please enter Title ',
        confirmButtonText: 'OK'
      });

      this.dctStatus.SUBMITTED = false;
      return false;
    } else {
      this.dctStickyData = {};
      // this.dctStickyData['title'] = this.stickyTitle;
      this.dctStickyData['description'] = stickyDescEdit;
      this.dctStickyData['userId'] = this.currentUserId;
      this.dctStickyData['title'] = stickyTitleEdit;
      this.dctStickyData['colour'] = data.vchr_colour;
      this.dctStickyData['id'] = id;

      // this.servServ.editSticky(this.dctStickyData).subscribe(
      //   res => {
      //     const result = res;
      //     if (result['status'] === 'success') {
      //       swal('Success', 'Sticky notes saved', 'success');
      //       this.listSticky();
      //     } else {
      //       swal('Error', result['result'], 'error');
      //     }
      //   },
      //   error => {
      //     swal('Error', error, 'error');
      //   }
      // );

      //edited


      this.servServ.putData("sticky_notes/stickynotes/",this.dctStickyData).subscribe(
        res => {
          const result = res;
          if (result['status'] === 1) {
            swal.fire('Success', 'Sticky notes saved', 'success');
            this.listSticky();
          } else {
            swal.fire('Error', result['result'], 'error');
          }
        },
        error => {
          swal.fire('Error', error, 'error');
        }
      );
    }
  }

  listSticky() {
    this.dctStickyData = {};
    this.dctStickyData['userId'] = this.currentUserId;

    // this.servServ.getSticky(this.currentUserId).subscribe(
    //   result => {
    //     this.lstStickyData = result.json().data;
    //     if (result.json().data) {
    //       this.intlength = result.json().data.length;
    //     }
    //     if (this.lstStickyData.length === 0) {
    //       this.addSticky();
    //     }
    //   },
    //   error => {}
    // );

    //edited


    this.servServ.getData("sticky_notes/stickynotes/?id=" +this.currentUserId).subscribe(
      result => {
        this.lstStickyData = result['data'];
        if (result['data']) {
          this.intlength = result['data'].length;
        }
        if (this.lstStickyData.length === 0) {
          this.addSticky();
        }
      },
      error => {}
    );
  }
  deleteData(pk_bint_id) {
    swal.fire({
      // title: '',
      text: 'Do you want to clear the stiky notes?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'clear',
      cancelButtonText: 'Cancel'
    }).then(result1 => {
      if (result1.value) {
        this.dctStickyData = {};
        this.dctStickyData['id'] = pk_bint_id;

        // this.servServ.deleteSticky(this.dctStickyData).subscribe(
        //   res => {
        //     const result = res;
        //     if (result['status'] === 'success') {
        //       // swal('Success', 'Sticky note deleted', 'success');
        //       this.listSticky();
        //     } else {
        //       swal('Error', result['result'], 'error');
        //     }
        //   },
        //   error => {
        //     swal('Error', error, 'error');
        //   }
        // );

        //edited
        this.servServ.postData("sticky_notes/stickydelete/",this.dctStickyData).subscribe(
          res => {
            const result = res;
            if (result['status'] === 1) {
              // swal('Success', 'Sticky note deleted', 'success');
              this.listSticky();
            } else {
              swal.fire('Error', result['result'], 'error');
            }
          },
          error => {
            swal.fire('Error', error, 'error');
          }
        );
      }
    });
  }
}

import swal from 'sweetalert2';
import { TypeaheadService } from '../typeahead.service';
import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';

// calender
import {startOfDay, endOfDay, subDays, addDays, isSameDay, isSameMonth} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';



import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';

// calender
import { NgxSpinnerService } from 'ngx-spinner';
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
// import { DatePipe } from '@angular/common';
import { CustomDateFormatter } from './custom-date-formatter.provider';
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
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class CalenderComponent implements OnInit {

  currentUserId = localStorage.getItem('userId');
  // calender

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('mobile') mobileRef: any;
  blnModalActive = true;
  view = 'month';
  eventDate = null;
  lstCalendarNote = [];
  strCalendarNote = '';
  blnCalendarNote = true;
  dctCalendarNotes = [];
  lstCalendarNoteMarked = [];
  dctCalendarNoteChange = {};
  dctSelectedCalendarData = {};
  viewDate: Date = new Date();
  lstAllReminder = [];
  lstReminderData = [];
  lstSelectedReminder = [];
  modalData: {
    action: string;
    event: CalendarEvent;
    // event:this.lstreminderData;
  };
  refresh: Subject<any> = new Subject();

  config: MatDialogConfig = {
    disableClose: false,
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
    data: {
      action: '',
      event: []
    }
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  events: CalendarEvent[];
  activeDayIsOpen = false;

  // calender
  calendarnoteError = '';

  constructor(
    private spinnerService: NgxSpinnerService,
    private typeServ: TypeaheadService,
    public router: Router,
    private servServ: ServerService,
   
    // calender
    private modal: NgbModal,
    private cdRef: ChangeDetectorRef // calender
  ) {}
  ngOnInit() {
    this.getReminder();
    this.getcalendarReminder();
  }
  ngAfterViewInit() {
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.dctCalendarNotes = [];
    this.strCalendarNote = '';
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        // this.viewDate = date;
      }
    }
    // if(this.eventDate) {
    //   // this.modal.open(this.modalContent, {size: 'lg' });
    // }
    this.eventDate = date;
    this.lstSelectedReminder = this.lstAllReminder.filter(
      x =>
        new Date(x.dat_reminder).toDateString() ===
        new Date(this.eventDate).toDateString()
    );
    this.dctCalendarNotes = this.lstCalendarNote.find(
      x =>
        new Date(x.dat_note).toDateString() ===
        new Date(this.eventDate).toDateString()
    );
    if (this.dctCalendarNotes) {
      this.strCalendarNote = this.dctCalendarNotes['vchr_note'];
    }
    if (!(new Date(this.eventDate) < new Date())) {
      this.blnCalendarNote = false;
      if (this.lstSelectedReminder[0] != null) {
        this.modal.open(this.modalContent, { size: 'lg' });
      }
      this.blnCalendarNote =
        new Date(this.eventDate) < new Date() ? true : false;
    } else {
      const date1 = new Date();
      const date2 = new Date(this.eventDate);
      if (
        Math.floor(
          (Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) -
            Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())) /
            (1000 * 60 * 60 * 24)
        ) <= 90
      ) {
        this.modal.open(this.modalContent, { size: 'lg' });
        this.blnCalendarNote = true;
      } else {
        this.blnCalendarNote = false;
      }
    }

  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    alert('tst');
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }
  handleEvent(action: string, event: CalendarEvent): void {

    this.config.data = { event, action };
    this.modalData = { event, action };
    // alert(this.viewDate)
    this.strCalendarNote = '';
    this.modal.open(this.modalContent, { size: 'lg' });
    this.lstSelectedReminder = this.lstAllReminder.filter(
      x =>
        new Date(x.dat_reminder).toDateString() ===
        new Date(event.start).toDateString()
    );
    this.eventDate = event.start;

    this.dctCalendarNotes = this.lstCalendarNote.find(
      x =>
        new Date(x.dat_note).toDateString() ===
        new Date(this.eventDate).toDateString()
    );
    if (this.dctCalendarNotes) {
      this.strCalendarNote = this.dctCalendarNotes['vchr_note'];
    }
    const date1 = new Date();
    const date2 = new Date(this.eventDate);
    const previusDateCount = Math.floor(
      (Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) -
        Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())) /
        (1000 * 60 * 60 * 24)
    );
    this.blnCalendarNote = previusDateCount <= 90 ? true : false;
    this.blnCalendarNote = date2 < date1 ? true : false;
  }
  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    // this.refresh.next();
  }
  getcalendarReminder() {
    // this.servServ
    //   .calendarListReminder(
    //     JSON.stringify({ user_id: localStorage.getItem('userId') })
    //   )
    //   .subscribe(
    //     response => {
    //       // {start:'01/03/2018',title:1}

    //       const tempLength = response['data'].length;
    //       for (let tempId = 0; tempId < tempLength; tempId++) {
    //         this.lstReminderData.push({
    //           start: subDays(
    //             startOfDay(new Date(response['data'][tempId].start)),
    //             0
    //           ),
    //           end: addDays(
    //             startOfDay(new Date(response['data'][tempId].start)),
    //             0
    //           ),
    //           title: 'Reminder ' + response['data'][tempId].title,
    //           color: colors.red,
    //           actions: this.actions
    //         });
    //       }
    //       this.getCalendarNote();
    //     },
    //     error => {}
    //   );

    //edited

    this.servServ
      .postData(
        "reminder/calendar_list_reminder/",{ user_id: localStorage.getItem('userId') })
      .subscribe(
        response => {
          // {start:'01/03/2018',title:1}

          const tempLength = response['data'].length;
          for (let tempId = 0; tempId < tempLength; tempId++) {
            this.lstReminderData.push({
              start: subDays(
                startOfDay(new Date(response['data'][tempId].start)),
                0
              ),
              end: addDays(
                startOfDay(new Date(response['data'][tempId].start)),
                0
              ),
              title: 'Reminder ',
              // title: 'Reminder ' + response['data'][tempId].title,
              color: colors.red,
              actions: this.actions
            });
          }
          this.getCalendarNote();
        },
        error => {}
      );
  }
  noteSection(errormodal) {

    // Math.floor((Date.UTC(new Date().getFullYear(),
    // new Date().getMonth(), new Date().getDate()) -
    // Date.UTC(new Date(this.eventDate).getFullYear(), new Date(this.eventDate).getMonth(),
    // new Date(this.eventDate).getDate()) ) /(1000 * 60 * 60 * 24)))
    // this.modal.close;
    this.lstSelectedReminder = [];

    this.dctCalendarNotes = this.lstCalendarNote.find(
      x =>
        new Date(x.dat_note).toDateString() ===
        new Date(this.eventDate).toDateString()
    );
    this.dctCalendarNoteChange = {
      dat_note: new Date(this.eventDate).toDateString(),
      vchr_note: this.strCalendarNote,
      user_id: this.currentUserId
    };

    this.dctCalendarNotes = this.lstCalendarNote.find(
      x =>
        new Date(x.dat_note).toDateString() ===
        new Date(this.eventDate).toDateString()
    );
    if (this.dctCalendarNotes) {
      this.dctCalendarNoteChange['pk_bint_id'] = this.dctCalendarNotes[
        'pk_bint_id'
      ];
      if (this.strCalendarNote) {
        this.updateCalendarNote();
      } else {
        this.removeCalendarNote();
      }
    } else {
      const date1 = new Date();
      const date2 = new Date(this.eventDate);
      if (date2 <= date1) {
        // validateSentence(str2) {
        // return ((/[^A-Za-z0-9 .'?!,@$#-_]/).test(str2));
        //  }
        // if (!(/[^A-Za-z0-9 .'?!,@$#-_]/).test(this.dctCalendarNoteChange['vchr_note'].trim())) {
        //   this.dctCalendarNotes = []
        //   this.calendarnoteError = 'Invalid input';
        //   return false;
        // }
        this.dctCalendarNoteChange['vchr_note'] = this.dctCalendarNoteChange[
          'vchr_note'
        ].trim();
        // this.strCalendarNote = this.strCalendarNote.trim()
        if (this.dctCalendarNoteChange['vchr_note']) {
          if (
            Math.floor(
              (Date.UTC(
                date1.getFullYear(),
                date1.getMonth(),
                date1.getDate()
              ) -
                Date.UTC(
                  date2.getFullYear(),
                  date2.getMonth(),
                  date2.getDate()
                )) /
                (1000 * 60 * 60 * 24)
            ) > 90
          ) {
            swal.fire({
              type: 'error',
              showConfirmButton: false,
              timer: 2000,
              title: 'error',
              text: 'Cannot add note 90 days before '
            });
          } else {

            this.addCalendarNote();
          }
        } else {
          // swal.fire({
          //   type: 'error',
          //   showConfirmButton: false,
          //   timer: 2000,
          //   title: 'error',
          //   text: 'Cannot add empty note'
          // });
        }
      } else {
        this.dctCalendarNoteChange = {};
        swal.fire({
          type: 'error',
          showConfirmButton: false,
          timer: 2000,
          title: 'error',
          text: 'Notes cannot add to future'
        });
      }
    }
    this.strCalendarNote = '';

    // this.addCalendarNote();
  }
  calendarnoteTrim() {
    // this.strCalendarNote = this.strCalendarNote.trim()
    if (this.strCalendarNote.trim().length === 0) {
      this.calendarnoteError = '*Cannot add empty in note';
    }
  }
  getCalendarNote() {
    // this.servServ
    //   .getCalendarNote(
    //     JSON.stringify({ user_id: localStorage.getItem('userId') })
    //   )
    //   .subscribe(
    //     response => {
    //       this.lstCalendarNote = response['data'];
    //       this.getCalendarNoteCalendarList();
    //     },
    //     error => {}
    //   );

    //edited

    this.servServ
    .postData(
      "calendar_notes/list_note/",{ user_id: localStorage.getItem('userId') }
    )
    .subscribe(
      response => {
        this.lstCalendarNote = response['data'];
        this.getCalendarNoteCalendarList();
      },
      error => {}
    );

    // this.servServ
  }

  getCalendarNoteCalendarList() {
    this.lstCalendarNoteMarked = [];
    const intCalendarNoteLength = this.lstCalendarNote.length;
    for (let iter = 0; iter < intCalendarNoteLength; iter++) {
      this.lstCalendarNoteMarked.push({
        start: startOfDay(new Date(this.lstCalendarNote[iter]['dat_note'])),
        end: startOfDay(new Date(this.lstCalendarNote[iter]['dat_note'])),
        title: 'Note',
        color: colors.yellow,
        actions: this.actions
      });
    }
    this.lstCalendarNoteMarked = this.lstCalendarNoteMarked.concat(
      this.lstReminderData
    );
    this.events = this.lstCalendarNoteMarked;
  }

  addCalendarNote() {
    // this.servServ
    //   .addCalendarNote(JSON.stringify(this.dctCalendarNoteChange))
    //   .subscribe(
    //     response => {
    //       if (response['status'] === 'success') {
    //         swal({
    //           title: 'Success',
    //           type: 'success',
    //           text: 'Note added successfully',
    //           timer: 2000,
    //           showConfirmButton: false
    //         });
    //         this.getCalendarNote();
    //       } else {
    //         swal({
    //           title: 'Error',
    //           type: 'error',
    //           text: 'Note added failed due to some unauthorised issues',
    //           timer: 2000,
    //           showConfirmButton: false
    //         });
    //       }
    //     },
    //     error => {}
    //   );

    //edited

    this.servServ
    .postData("calendar_notes/add_note/",this.dctCalendarNoteChange)
    .subscribe(
      response => {
        if (response['status'] === 1) {
          swal.fire({
            title: 'Success',
            type: 'success',
            text: 'Note added successfully',
            timer: 2000,
            showConfirmButton: false
          });
          this.getCalendarNote();
        } else {
          swal.fire({
            title: 'Error',
            type: 'error',
            text: 'Note added failed due to some unauthorised issues',
            timer: 2000,
            showConfirmButton: false
          });
        }
      },
      error => {}
    );
  }
  updateCalendarNote() {
    // const data = {user_id: localStorage.getItem('userId'),vchr_note: this.strCalendarNote}
    // this.servServ
    //   .updateCalendarNote(JSON.stringify(this.dctCalendarNoteChange))
    //   .subscribe(
    //     response => {
    //       if (response['status'] === 'success') {
    //         swal({
    //           title: 'Success',
    //           type: 'success',
    //           text: 'Note updated successfully',
    //           timer: 2000,
    //           showConfirmButton: false
    //         });
    //         this.getCalendarNote();
    //       } else {
    //         swal({
    //           title: 'Error',
    //           type: 'error',
    //           text: 'Note added failed due to some unauthorised issues',
    //           timer: 2000,
    //           showConfirmButton: false
    //         });
    //       }
    //     },
    //     error => {}
    //   );

    //edited

    this.servServ
    .postData("calendar_notes/update_note/", this.dctCalendarNoteChange)
    .subscribe(
      response => {
        if (response['status'] === 1) {
          swal.fire({
            title: 'Success',
            type: 'success',
            text: 'Note updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
          this.getCalendarNote();
        } else {
          swal.fire({
            title: 'Error',
            type: 'error',
            text: 'Note added failed due to some unauthorised issues',
            timer: 2000,
            showConfirmButton: false
          });
        }
      },
      error => {}
    );
  }

  removeCalendarNote() {
    const data = {
      user_id: localStorage.getItem('userId'),
      vchr_note: this.strCalendarNote
    };
    // this.servServ
    //   .removeCalendarNote(JSON.stringify(this.dctCalendarNoteChange))
    //   .subscribe(
    //     response => {
    //       if (response['status'] === 'success') {
    //         swal({
    //           title: 'Success',
    //           type: 'success',
    //           text: 'Note removed successfully',
    //           timer: 2000,
    //           showConfirmButton: false
    //         });
    //         this.getCalendarNote();
    //       } else {
    //         swal({
    //           title: 'Error',
    //           type: 'error',
    //           text: 'Note added failed due to some unauthorised issues',
    //           timer: 2000,
    //           showConfirmButton: false
    //         });
    //       }
    //     },
    //     error => {}
    //   );

    //edited

    this.servServ
      .postData("calendar_notes/remove_note/",this.dctCalendarNoteChange)
      .subscribe(
        response => {
          if (response['status'] === 1) {
            swal.fire({
              title: 'Success',
              type: 'success',
              text: 'Note removed successfully',
              timer: 2000,
              showConfirmButton: false
            });
            this.getCalendarNote();
          } else {
            swal.fire({
              title: 'Error',
              type: 'error',
              text: 'Note added failed due to some unauthorised issues',
              timer: 2000,
              showConfirmButton: false
            });
          }
        },
        error => {}
      );
  }


  getReminder() {

    this.servServ
      .postData("reminder/list_reminder/",{ user_id: localStorage.getItem('userId') })
      .subscribe(
        response => {
          this.lstAllReminder = response['data'];
        },
        error => {}
      );
  }

}

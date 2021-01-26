
import {debounceTime} from 'rxjs/operators';
import swal from 'sweetalert2';
import { TypeaheadService } from '../../typeahead.service';
import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { DataService } from '../../global.service';

// calender
import { startOfDay, endOfDay, subDays, addDays, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { SnotifyService } from 'ng-snotify';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';


// import { MatDialogConfig } from '@angular/material';

// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSpinnerService } from "ngx-spinner";

import {
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';


import { ServerService } from '../..//server.service';
import { DatePipe } from '@angular/common';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { MatFormField } from '@angular/material/form-field';
import { MatDialogConfig } from '@angular/material/dialog';
// import { Observable } from 'rxjs';
// import { CustomValidators } from 'ng2-validation';

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
  selector: 'app-add-enquiry',
  templateUrl: './add-enquiry.component.html',
  styleUrls: ['./add-enquiry.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class AddEnquiryComponent implements OnInit, AfterViewInit {

  blnEnqStatus = {
    'enquiry': false,
    'naEnquiry': false
  }

  naDetails;
  lstProductDetails = [];
  dctProductDetails = {};
  lstViewProductData = [];
  lstProductsNoImei = ['SIM', 'SERVICE', 'RECHARGES'];
  dctProductSpecData;
  lstProductSpecOrder;
  strProductImage;
  lstNaStockProduct;
  // service models
  lstMobileData = [];
  lstTabletData = [];
  lstComputerData = [];
  lstAccessoriesData = [];
  dctSpecification = {};
  disableStatus: boolean = false;

  stockDetails = [];
  searchBranch = '';
  filteredItems = [];
  branchName;

  dctProductDetailsNA = {}

  here = "MOBILES"

  closeResult: string;

  remarks: '';
  showRemark = false;

  @ViewChild('enqSourceSel') enqSourceSel: any;
  // @ViewChild('enqPrioritySel') enqPrioritySel: any;
  @ViewChild('service') service: any;
  @ViewChild('enquiryTrack') enquiryTrack: any;
  @ViewChild('accounting') accounting: any;
  @ViewChild('hrsolutions') hrsolutions: any;
  @ViewChild('officemanagement') officemanagement: any;
  @ViewChild('eventImg') eventImg: any;
  @ViewChildren(MatFormField) panes: QueryList<MatFormField>;
  lstFiles = [];
  blnSaveLeadFlag = true;

  blnCustomerAdd = false;
  blnAdd = true;
  lstPermission = JSON.parse(localStorage.getItem('group_permissions'));

  stickyTitle = '';
  stickyDesc = '';
  dctStickyData = {};
  lstStickyData = [];


  dbl_amount = 0.0;
  // branch
  currentGroupName = localStorage.getItem('group_name');
  lstBranches = [];
  searchBranchType: FormControl = new FormControl();
  branchCode = '';
  branchNameType = '';
  selectedBranch = '';
  branchId = '';

  flag = { 1: true, 2: true, 0: true };
  color = '';
  intlength = null;

  starRating = 1;
  feedback = '';
  logo;
  file;
  companyId = Number(localStorage.getItem('companyId'));
  userId = localStorage.getItem('int_user_id');
  currentUserName = localStorage.getItem('username');
  lstAvailable = []

  currentUserId = localStorage.getItem('userId');
  searchMobile: FormControl = new FormControl(null, [Validators.required]);
  // enquiryPriority: FormControl = new FormControl(null, [Validators.required]);
  enquirySource: FormControl = new FormControl(null, [Validators.required]);
  intCustomerId: number;
  lstUserAssign = [
    {
      id: '',
      full_name: 'None'
    }
  ];

  lstMobileNumbers = [];
  strSelectedMobileNumber = '';
  strEnquiryNumber = '';
  strFirstName = '';
  strLastName = '';
  strCustomerType = '';
  strEmailAddress = '';
  dctStatus = {
    // MOBILE: false,
    // TABLET: false,
    // COMPUTER: false,
    // ACCESSORIES: false,

    MOBILESTATUS: false,
    SMS: false,
    ASSIGNSTATUS: true,
    SUBMITTED: false,
    mobileNa: false,
    tabletNa: false,
    computerNa: false,
    accessoriesNa: false
  };

  dctSelectBox = {
    lstSalutations: [],
    lstEnquirySource: {},
    lstCustomerType: [],
    // lstEnquiryPriority: [],
    lstEnquiryStatus: [],
    lstMobileColors: [],
    lstMobileSpec: []
  };
  minPrice: any = 'N/A';
  maxPrice: any = 'N/A';
  dctMobileProductData = {
    'Product': 'Mobile',
    'Screen Size': 'N/A',
    'Colour': 'N/A',
    'Display Resolution': 'N/A',
    'Internal Memory': 'N/A',
    'Operating System': 'N/A',
    'Chip Set': 'N/A',
    'Processor Cores': 'N/A',
    'Rear Camera': 'N/A',
    'Front Camera': 'N/A',
    'Battery Capacity': 'N/A'
  };
  dctTabletProductData = {
    'Product': 'Tablet',
    'Screen Size': 'N/A',
    'Colour': 'N/A',
    'Display Resolution': 'N/A',
    'Internal Memory': 'N/A',
    'Operating System': 'N/A',
    'Chip Set': 'N/A',
    'Processor Cores': 'N/A',
    'Rear Camera': 'N/A',
    'Front Camera': 'N/A',
    'Battery Capacity': 'N/A'
  };
  dctComputerProductData = {
    'Product': 'Computer',
    'Processor name': 'N/A',
    'Processor brand': 'N/A',
    'RAM': 'N/A',
    'RAM Type': 'N/A',
    'Hard Disk capacity': 'N/A',
    'HDD RPM': 'N/A',
    'operating system': 'N/A',
    'Display Type': 'N/A',
    'Display Size': 'N/A',
    'Display Resolution': 'N/A',
    'Graphics capacity': 'N/A',
    'Graphics Processor': 'N/A',
    'Battery Backup': 'N/A'
  };
  dctAccessoriesProductData = {
    'Product': 'Accessories',
    'Processor name': 'N/A',
    'Processor brand': 'N/A',
    'RAM': 'N/A',
    'RAM Type': 'N/A',
    'Hard Disk capacity': 'N/A',
    'HDD RPM': 'N/A',
    'operating system': 'N/A',
    'Display Type': 'N/A',
    'Display Size': 'N/A',
    'Display Resolution': 'N/A',
    'Graphics capacity': 'N/A',
    'Graphics Processor': 'N/A',
    'Battery Backup': 'N/A'
  };
  salutation = '';
  strSalutation = '';
  strEnquirySource = '';
  // strEnquiryPriority = '';
  strEnquiryStatus = '';
  strAssignTo = '';

  blnPrint = false;
  lstEnquiryHistory: any = [];
  blnClicked = false;
  enqNo = '';
  lstEnquiryHistoryMaster: any = [];
  intSelectedIndex = 0;
  lstPages: any = [];
  intStart = 0;
  intEnd = 4;

  objectKeys;
  blnOther = false;
  lstProductsOthers = [];
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('mobile') mobileRef: any;
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
  lstGdpRange = [];
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
  strItemId = '';
  fltItemAmount = 0;
  calendarnoteError = '*Cannot add empty note';
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
    // alert('tst');
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
  // calender

  constructor(
    private spinnerService: NgxSpinnerService,
    private typeServ: TypeaheadService,
    public router: Router,
    private serverService: ServerService,
    private datePipe: DatePipe,
    // private snotifyService: SnotifyService,
    // calender
    private modal: NgbModal,
    private cdRef: ChangeDetectorRef,
    private dataService: DataService



  ) { }
  getcalendarReminder() {
    // this.serverService
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

    this.serverService.postData("reminder/calendar_list_reminder/", { user_id: localStorage.getItem('int_user_id') })
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
              title: 'Reminder ' + response['data'][tempId].title,
              color: colors.red,
              actions: this.actions
            });
          }
          // this.getCalendarNote();
        },
        error => { }
      );
  }
  getReminder() {
    // this.serverService
    //   .listReminder(JSON.stringify({ user_id: localStorage.getItem('userId') }))
    //   .subscribe(
    //     response => {
    //       this.lstAllReminder = response['data'];
    //     },
    //     error => {}
    //   );

    //edited

    this.serverService
      .postData("reminder/list_reminder/", { user_id: localStorage.getItem('int_user_id') })
      .subscribe(
        response => {
          this.lstAllReminder = response['data'];
        },
        error => { }
      );
  }
  noteSection() {
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
            // this.addCalendarNote();
          }
        } else {
          swal.fire({
            type: 'error',
            showConfirmButton: false,
            timer: 2000,
            title: 'error',
            text: 'Cannot add empty note '
          });
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
      this.calendarnoteError = '*Cannot add empty note';
    }
  }
  getCalendarNote() {
    // this.serverService
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

    // this.serverService
    //   .postData(
    //     "calendar_notes/list_note/", { user_id: localStorage.getItem('int_user_id') }
    //   )
    //   .subscribe(
    //     response => {
    //       this.lstCalendarNote = response['data'];
    //       this.getCalendarNoteCalendarList();
    //     },
    //     error => { }
    //   );

    // this.servServ
  }

  getCalendarNoteCalendarList() {
    this.lstCalendarNoteMarked = [];
    const intCalendarNoteLength = this.lstCalendarNote.length;
    for (let iter = 0; iter < intCalendarNoteLength; iter++) {
      this.lstCalendarNoteMarked.push({
        start: startOfDay(new Date(this.lstCalendarNote[iter]['dat_note'])),
        end: startOfDay(new Date(this.lstCalendarNote[iter]['dat_note'])),
        title: 'Note 1',
        color: colors.yellow,
        actions: this.actions
      });
    }
    this.lstCalendarNoteMarked = this.lstCalendarNoteMarked.concat(
      this.lstReminderData
    );
    this.events = this.lstCalendarNoteMarked;
  }

  // addCalendarNote() {
  //   // this.serverService
  //   //   .addCalendarNote(JSON.stringify(this.dctCalendarNoteChange))
  //   //   .subscribe(
  //   //     response => {
  //   //       if (response['status'] === 'success') {
  //   //         swal.fire({
  //   //           title: 'Success',
  //   //           type: 'success',
  //   //           text: 'Note added successfully',
  //   //           timer: 2000,
  //   //           showConfirmButton: false
  //   //         });
  //   //         this.getCalendarNote();
  //   //       } else {
  //   //         swal.fire({
  //   //           title: 'Error',
  //   //           type: 'error',
  //   //           text: 'Note added failed due to some unauthorised issues',
  //   //           timer: 2000,
  //   //           showConfirmButton: false
  //   //         });
  //   //       }
  //   //     },
  //   //     error => {}
  //   //   );

  //   //edited

  //   this.serverService
  //     .postData("calendar_notes/add_note/", this.dctCalendarNoteChange)
  //     .subscribe(
  //       response => {
  //         if (response['status'] == 1) {
  //           swal.fire({
  //             title: 'Success',
  //             type: 'success',
  //             text: 'Note added successfully',
  //             timer: 2000,
  //             showConfirmButton: false
  //           });
  //           this.getCalendarNote();
  //         } else {
  //           swal.fire({
  //             title: 'Error',
  //             type: 'error',
  //             text: 'Note added failed due to some unauthorised issues',
  //             timer: 2000,
  //             showConfirmButton: false
  //           });
  //         }
  //       },
  //       error => { }
  //     );
  // }
  updateCalendarNote() {
    // const data = {user_id: localStorage.getItem('userId'),vchr_note: this.strCalendarNote}
    // this.serverService
    //   .updateCalendarNote(JSON.stringify(this.dctCalendarNoteChange))
    //   .subscribe(
    //     response => {
    //       if (response['status'] === 'success') {
    //         swal.fire({
    //           title: 'Success',
    //           type: 'success',
    //           text: 'Note updated successfully',
    //           timer: 2000,
    //           showConfirmButton: false
    //         });
    //         this.getCalendarNote();
    //       } else {
    //         swal.fire({
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

    this.serverService
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
            // this.getCalendarNote();
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
        error => { }
      );
  }

  removeCalendarNote() {
    const data = {
      user_id: localStorage.getItem('int_user_id'),
      vchr_note: this.strCalendarNote
    };
    // this.serverService
    //   .removeCalendarNote(JSON.stringify(this.dctCalendarNoteChange))
    //   .subscribe(
    //     response => {
    //       if (response['status'] === 'success') {
    //         swal.fire({
    //           title: 'Success',
    //           type: 'success',
    //           text: 'Note removed successfully',
    //           timer: 2000,
    //           showConfirmButton: false
    //         });
    //         this.getCalendarNote();
    //       } else {
    //         swal.fire({
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

    this.serverService
      .postData("calendar_notes/remove_note/", this.dctCalendarNoteChange)
      .subscribe(
        response => {
          if (response['status'] == 1) {
            swal.fire({
              title: 'Success',
              type: 'success',
              text: 'Note removed successfully',
              timer: 2000,
              showConfirmButton: false
            });
            // this.getCalendarNote();
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
        error => { }
      );
  }

  ngOnInit() {
    this.showRemark = false;
    this.dataService.customerlst.subscribe(customerlst => {
      if (customerlst) {
        this.lstMobileNumbers = customerlst;

      }
    });


    this.getList();
    // this.getSourceList();
    // this.getPriorityList();
    // this.getProductList();
    // this.pageTitle = 'Add Software Enquiry';


    if (this.blnCustomerAdd === true) {
      localStorage.removeItem('customer-enquiry');
      localStorage.setItem('customer-enquiry', 'true');
    } else {
      localStorage.removeItem('customer-enquiry');
      localStorage.setItem('customer-enquiry', 'false');
    }
    this.lstPermission.forEach((item, index, array) => {
      if (item['NAME'] === 'CUSTOMER') {
        this.blnAdd = item['ADD'];
      }
    });
    // this.getReminder();
    // this.getcalendarReminder();
    localStorage.removeItem('customerCallSource');
    // this.listSticky();

    this.searchMobile.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData == null || strData === '') {
          this.lstMobileNumbers = [];
        } else {
          if (strData.length > 6) {
            this.lstMobileNumbers = [];
            this.typeServ
              .search_customer(strData)
              .subscribe(
                (response: {
                  status: string;
                  data: Array<{
                    mobile: number;
                    fname: string;
                    lname: string;
                    id: number;
                    email: string;
                    salutation: string;
                    customertype: string;
                    sms: boolean;
                  }>;
                }) => {
                  this.lstMobileNumbers.push(...response.data);
                }
              );
          }
        }
      });
    this.strEnquiryNumber = '';
    this.intCustomerId = 0;

    // this.addMobileData();
    // this.addTablet();
    // this.addComputer();
    // this.addAccessories();


    this.dctSelectBox.lstSalutations = ['Mr', 'Ms', 'Mrs'];
    this.dctSelectBox.lstCustomerType = [
      'B2B',
      'B2C',
      'Corporate',
      'Priority customer',
      'Others'
    ];
    this.dctSelectBox.lstEnquiryStatus = [
      'New',
      // 'Working',
      // 'Proposal send',
      // 'Negotiating',
      // 'Unqualified',
      'Pending',
      'Booked',
      'Lost',
      'Out Of Stock'
    ];

    this.dctSelectBox.lstMobileColors = [
      'Black',
      'White',
      'Silver',
      'Space Grey',
      'Rose Gold',
      'Midnight Black',
      'Coral Blue'
    ];
    this.dctSelectBox.lstMobileSpec = [
      '2GB/64GB',
      '3GB/64GB',
      '4GB/128GB',
      '6GB/256GB'
    ];
    this.strEnquirySource = null;
    // this.strEnquiryPriority = null;

    // Branch
    this.searchBranchType.valueChanges.pipe(
      debounceTime(400))
      .subscribe((data: string) => {
        if (data === undefined) {
        } else {
          if (data.length > 2) {
            this.lstBranches = [];
            this.typeServ
              .searchBranch(data)
              .subscribe(
                (response: {
                  status: string;
                  data: Array<{
                    account: string;
                    accountId: number;
                    accountCode: string;
                  }>;
                }) => {
                  this.lstBranches.push(...response.data);

                }
              );
          }
        }
      });
    // this.form = this.fb.group({
    //   brand: [ Validators.compose([Validators.required ])],
    // });
  }
  ngAfterViewInit() {
    // if (this.dctStatus.ASSIGNSTATUS === true) {
    // this.serverService.getUserList(this.companyId).subscribe(res => {
    //   const users = res.json();
    //   this.lstUserAssign = users.data;
    // });

    //edited
    // this.serverService.getData("user/getuserlistdata/?id=" +this.companyId).subscribe(res => {
    //   const users = res;
    //   this.lstUserAssign = users.data;
    // });
    // }
  }
  getList() {
    this.serverService
      .postData("mobile/get_for_add_mobile_enquiry/", { user_id: localStorage.getItem('int_user_id'), company_id: this.companyId })
      .subscribe(
        response => {
          this.dctSelectBox.lstEnquirySource = response['lst_source'];
          // this.dctSelectBox.lstEnquiryPriority = response['lst_priority'];
          this.lstUserAssign = response['userListData']
          this.lstProductDetails = response['lst_product_visible']
          this.lstProductsOthers = response['lst_other_prodcuts']
          this.lstNaStockProduct = response['dct_na_stock'];
          this.lstGdpRange = response['gdp_range'];
          for (let index = 0; index < this.lstProductDetails.length; index++) {
            this.dctStatus[this.lstProductDetails['name']] = false;
          }
          for (let index = 0; index < this.lstProductsOthers.length; index++) {
            this.dctStatus[this.lstProductsOthers[index]] = false;
          }
          this.lstAllReminder = response['lst_reminder'];
          const tempLength = response['lst_calender_reminder'].length;
          for (let tempId = 0; tempId < tempLength; tempId++) {
            this.lstReminderData.push({
              start: subDays(
                startOfDay(new Date(response['lst_calender_reminder'][tempId].start)),
                0
              ),
              end: addDays(
                startOfDay(new Date(response['lst_calender_reminder'][tempId].start)),
                0
              ),
              title: 'Reminder ' + response['lst_calender_reminder'][tempId].title,
              color: colors.red,
              actions: this.actions
            });
          }
          // this.getCalendarNote();
          // this.lstStickyData = response['notes_list'];
          // if (response['notes_list']) {
          //   this.intlength = response['notes_list'].length;
          // }
          // if (this.lstStickyData.length === 0) {
          //   this.addSticky();
          // }
        },
        error => { }
      );
  }
  getSourceList() {
    this.serverService.getData('source/source/').subscribe(res => {
      this.dctSelectBox['lstEnquirySource'] = res;
    });
  }

  // getPriorityList() {
  //   this.serverService.getData('priority/priority/').subscribe(res => {
  //     this.dctSelectBox.lstEnquiryPriority = res;
  //   });
  // }

  getProductList() {
    this.serverService.getData('mobile/v0.1/products/').subscribe(res => {
      this.lstProductDetails = res['data'];
      this.lstProductsOthers = res['others'];
      for (let index = 0; index < this.lstProductDetails.length; index++) {
        this.dctStatus[this.lstProductDetails['name']] = false;
      }
      for (let index = 0; index < this.lstProductsOthers.length; index++) {
        this.dctStatus[this.lstProductsOthers[index]] = false;
      }
    });

  }
  productDetails(item) {

    for (let keys in this.lstProductDetails) {
      this.showRemark = false;

      if (this.lstProductDetails[keys]['checked'] && this.showRemark == false) {
        this.showRemark = true;
        break;
      }


    }

    // if(!item['checked'] && this.showRemark==true){
    //   this.showRemark=false;     
    // }


    this.objectKeys = Object.keys;
    // item.checked = !item.checked;
    if (item.checked === true) {
      this.dctStatus[item.name] = true;
      if (!this.dctProductDetails.hasOwnProperty(item.name)) {
        this.dctProductDetails[item.name] = [
          {
            strBrand: '',
            strItem: '',
            blnBrand: false,
            blnItem: false,
            fk_brand_id: 0,
            fk_item_id: 0,
            intQty: 1,
            vchr_color: '',
            vchr_spec: '',
            vchr_enquiry_status: 'NEW',
            dbl_estimated_amount: '',
            dbl_actual_amount: '',
            dbl_actual_gdew: '',
            dbl_actual_gdp: '',
            dbl_buyback_amount: '',
            dbl_discount_amount: '',
            dbl_gdp: '',
            dbl_gdew: '',
            int_type: 0,
            // vchr_remarks: '',
            strStockBrand: '',
            strStockItem: '',
            lst_brands: [],
            lst_items: [], min: '', max: '', spec: false, info: false,
            lst_imei: {},
            outofstock: false,
            mobileNa: false,
            str_product: item.name,
            fk_product_id: item.id,
            fltItemAmount: 0,
            // fk_brand: null,
            // fk_item: null,
            // int_quantity: 1,
            // dbl_min_amount: 0,
            // dbl_max_amount: 0,
          }
        ]
        // this.dctProductDetails['name'] = item.name;
        // this.dctProductDetails['checked'] = item.checked;
        // this.lstViewProductData.push(this.dctProductDetails)

      }
    } else {
      this.dctStatus[item.name] = false;
      if (this.dctProductDetails.hasOwnProperty(item.name)) {
        delete this.dctProductDetails[item.name];
      }
    }
    // let arr = [];
    //     for (let key in this.dctProductDetails) {
    //     arr.push({key: key, value: this.dctProductDetails[key]});
    //     }
    //     this.lstViewProductData = arr;

  }
  addProductData(item, product) {

    if (this.dctProductDetails.hasOwnProperty(item)) {
      if (item !== 'OTHERS') {
        this.dctProductDetails[item].push(
          {
            strBrand: '',
            strItem: '',
            blnBrand: false,
            blnItem: false,
            fk_brand_id: 0,
            fk_item_id: 0,
            intQty: 1,
            vchr_color: '',
            vchr_spec: '',
            vchr_enquiry_status: 'NEW',
            dbl_estimated_amount: '',
            dbl_actual_amount: '',
            dbl_actual_gdew: '',
            dbl_actual_gdp: '',
            dbl_buyback_amount: '',
            dbl_discount_amount: '',
            dbl_gdp: '',
            dbl_gdew: '',
            int_type: 0,
            // vchr_remarks: '',
            strStockBrand: '',
            strStockItem: '',
            lst_brands: [],
            lst_items: [], min: '', max: '', spec: false, info: false,
            lst_imei: {},
            outofstock: false,
            mobileNa: false,

            str_product: item,
            fk_product_id: item.id,
            fltItemAmount: 0,
            // fk_brand: null,
            // fk_item: null,
            // int_quantity: 1,
            // dbl_min_amount: 0,
            // dbl_max_amount: 0,
          }
        )
      }
      else {
        this.dctProductDetails[item].push(
          {
            strBrand: '',
            strItem: '',
            blnBrand: false,
            blnItem: false,
            fk_brand_id: 0,
            fk_item_id: 0,
            intQty: 1,
            vchr_color: '',
            vchr_spec: '',
            vchr_enquiry_status: 'NEW',
            dbl_estimated_amount: '',
            dbl_actual_amount: '',
            dbl_actual_gdew: '',
            dbl_actual_gdp: '',
            dbl_buyback_amount: '',
            dbl_discount_amount: '',
            dbl_gdp: '',
            dbl_gdew: '',
            int_type: 0,
            // vchr_remarks: '',
            strStockBrand: '',
            strStockItem: '',
            lst_brands: [],
            lst_items: [], min: '', max: '', spec: false, info: false,
            lst_imei: {},
            outofstock: false,
            mobileNa: false,

            str_product: product,
            fk_product_id: '',
            fltItemAmount: 0,
            // fk_brand: null,
            // fk_item: null,
            // int_quantity: 1,
            // dbl_min_amount: 0,
            // dbl_max_amount: 0,
          }
        )
      }

    }
  }
  removeProductData(item, index) {
    this.dctProductDetails[item].splice(index, 1);
  }
  setImeiData(item, index) {
    this.dctProductDetails[item][index].lst_imei = {};
    for (let i = 0; i < this.dctProductDetails[item][index].intQty; i++) {
      this.dctProductDetails[item][index].lst_imei[i] = '';
    }

    if (this.dctProductDetails[item][index].fltItemAmount > 0) {
      this.dctProductDetails[item][index].dbl_estimated_amount = this.dctProductDetails[item][index].intQty * this.dctProductDetails[item][index].fltItemAmount;
    }

  }
  // others
  otherClicked() {



    if (this.blnOther && this.showRemark == false) {
      this.showRemark = true;

    }

    this.objectKeys = Object.keys;
    // this.blnOther = !this.blnOther;
    if (this.blnOther) {
      if (!this.dctProductDetails.hasOwnProperty('OTHERS')) {
        this.dctProductDetails['OTHERS'] = [
          {
            strBrand: '',
            strItem: '',
            blnBrand: false,
            blnItem: false,
            fk_brand_id: 0,
            fk_item_id: 0,
            intQty: 1,
            vchr_color: '',
            vchr_spec: '',
            vchr_enquiry_status: 'NEW',
            dbl_estimated_amount: '',
            dbl_actual_amount: '',
            dbl_actual_gdew: '',
            dbl_actual_gdp: '',
            dbl_buyback_amount: '',
            dbl_discount_amount: '',
            dbl_gdp: '',
            dbl_gdew: '',
            int_type: 0,
            // vchr_remarks: '',
            strStockBrand: '',
            strStockItem: '',
            lst_brands: [],
            lst_items: [], min: '', max: '', spec: false, info: false,
            lst_imei: {},
            outofstock: false,
            mobileNa: false,

            str_product: this.lstProductsOthers[0].toUpperCase(),
            fk_product_id: '',
            fltItemAmount: 0,
          }
        ]
      }
      // this.dctTypeaheadItems[this.lstProductsOthers[0].toUpperCase()] = {
      //   'item':[],'brand':[]
      // }

    }
    else {
      if (this.dctProductDetails.hasOwnProperty('OTHERS')) {
        delete this.dctProductDetails['OTHERS'];
      }

    }
    // this.objectKeys = Object.keys(this.dctDataItems);
  }

  triggerProduct(product, index) {
    this.dctProductDetails['OTHERS'][index].lst_brands = [];
    this.dctProductDetails['OTHERS'][index].strBrand = '';
    this.dctProductDetails['OTHERS'][index].lst_items = [];
    this.dctProductDetails['OTHERS'][index].strItem = '';
    this.dctProductDetails['OTHERS'][index]['str_product'] = product.toUpperCase();
    // if (!this.dctTypeaheadItems.hasOwnProperty(product.toUpperCase())) {
    //   this.dctTypeaheadItems[product.toUpperCase()] = {
    //     'item': [], 'brand': []
    //   }
    // }

  }
  //
  populateProductBrand(i, item, product) {

    this.stockDetails = [];
    this.dctProductDetails[item][i].lst_items = [];
    this.dctProductDetails[item][i].strItem = '';
    if (this.dctProductDetails[item][i].strBrand === '') {
      this.dctProductDetails[item][i].lst_brands = [];
      this.dctProductDetails[item][i].lst_items = [];
      this.dctProductDetails[item][i].lst_stockDetails = [];
    } else if (this.dctProductDetails[item][i].strBrand.length > 1) {
      const pushedItems = {};
      pushedItems['term'] = this.dctProductDetails[item][i].strBrand;
      pushedItems['product'] = product;
      this.typeServ
        .searchSubcategoryByCat(pushedItems)
        .subscribe(
          (response: {
            status: string;
            data: Array<{
              account: string;
              accountId: number;
              accountCode: string;
            }>;
          }) => {
            this.dctProductDetails[item][i].lst_brands = response.data;
            const tempData = this.dctProductDetails[item][i].lst_brands.filter(x => x.name === this.dctProductDetails[item][i].strBrand);
            console.log("temmmmm",tempData);
            
            if (tempData.length === 1) {
              this.dctProductDetails[item][i].blnBrand = true;
              this.dctProductDetails[item][i].fk_brand_id = tempData[0]['id'];
              
            }
            else {
              this.dctProductDetails[item][i].blnBrand = false;
            }
          }
        );
    }
  }
  populateProductItem(i, item, product) {

    this.dctProductDetails[item][i].spec = false;
    this.stockDetails = [];
    this.filteredItems = [];
    if (this.dctProductDetails[item][i].strItem === '') {
      this.dctProductDetails[item][i].lst_items = [];
      this.dctProductDetails[item][i].lst_stockDetails = [];
      this.minPrice = 'N/A';
      this.maxPrice = 'N/A';
    } else if (this.dctProductDetails[item][i].strItem.length > 3) {
      const selectedBrandRow = this.dctProductDetails[item][i].lst_brands.filter(
        x => x.name === this.dctProductDetails[item][i].strBrand.toString()
      );
      if (selectedBrandRow.length > 0) {
        const pushedItems = {};
        pushedItems['term'] = this.dctProductDetails[item][i].strItem;
        pushedItems['brandId'] = selectedBrandRow[0].id;
        pushedItems['product'] = product;

        this.typeServ.searchItemBySub(pushedItems).subscribe(
          (response: {
            status: string;
            data: Array<{
              account: string;
              accountId: number;
              accountCode: string;
            }>;
          }) => {
            this.dctProductDetails[item][i].lst_items = response.data;
            this.dctProductDetails[item][i].lst_items = this.dctProductDetails[item][i].lst_items.slice(0, 10);

            this.branchName = this.dctProductDetails[item][i].strItem;
            const tempData = this.dctProductDetails[item][i].lst_items.filter(x => x.name === this.dctProductDetails[item][i].strItem);
            this.dctProductDetails[item][i].outofstock = false;
            if (tempData.length === 1) {
              this.dctProductDetails[item][i].blnItem = true;

              this.dctProductDetails[item][i].lst_items = tempData;
              this.dctProductDetails[item][i].fk_item_id = tempData[0]['id'];


              this.strItemId = tempData[0]['id'];
              // getting item amount 
              this.serverService.postData('mobile/get_price_for_product/', { 'itemId': this.strItemId }).subscribe(
                (res) => {
                  const result = res;

                  // if (result['_body'].split(']')[0].length > 1) {
                  //   this.dctProductDetails[item][i].dbl_estimated_amount = parseFloat(result['_body'].split(']')[0].split(',')[1].split(':')[1].split('}')[0]) * Number(this.dctProductDetails[item][i].intQty) ;
                  // this.dctProductDetails[item][i].fltItemAmount = parseFloat(result['_body'].split(']')[0].split(',')[1].split(':')[1].split('}')[0]);
                  // }


                  if (result['status'] == 1) {
                    this.dctProductDetails[item][i].dbl_estimated_amount = result['item_amount_per_qty'] * this.dctProductDetails[item][i]['intQty'];
                    this.dctProductDetails[item][i].dbl_actual_amount = result['item_amount_per_qty'] * this.dctProductDetails[item][i]['intQty'];
                    this.dctProductDetails[item][i].fltItemAmount = result['item_amount_per_qty'];
                    this.dctProductDetails[item][i].dbl_buyback_amount = result['int_buyback_amount'];

                    for (let index = 0; index < this.lstGdpRange.length; index++) {
                      if (this.lstGdpRange[index].dbl_from <= this.dctProductDetails[item][i].dbl_estimated_amount && this.lstGdpRange[index].dbl_to >= this.dctProductDetails[item][i].dbl_estimated_amount) {
                        if (this.lstGdpRange[index].int_type == 1) {
                          this.dctProductDetails[item][i].dbl_actual_gdp = this.lstGdpRange[index].dbl_amt;
                          if (this.dctProductDetails[item][i].str_product.toUpperCase() === 'MOBILES' || this.dctProductDetails[item][i].str_product.toUpperCase() === 'TABLETS' || this.dctProductDetails[item][i].str_product.toUpperCase() === 'LAPTOPS' || this.dctProductDetails[item][i].str_product.toUpperCase() === 'SLR CAM' || this.dctProductDetails[item][i].str_product.toUpperCase() === 'DIGITAL CAMERA') {
                            this.dctProductDetails[item][i].dbl_gdp = this.lstGdpRange[index].dbl_amt;
                          }
                        }
                        if (this.lstGdpRange[index].int_type == 2) {
                          this.dctProductDetails[item][i].dbl_actual_gdew = this.lstGdpRange[index].dbl_amt;
                          if (this.dctProductDetails[item][i].str_product.toUpperCase() === 'MOBILES' || this.dctProductDetails[item][i].str_product.toUpperCase() === 'TABLETS' || this.dctProductDetails[item][i].str_product.toUpperCase() === 'LAPTOPS' || this.dctProductDetails[item][i].str_product.toUpperCase() === 'SLR CAM' || this.dctProductDetails[item][i].str_product.toUpperCase() === 'DIGITAL CAMERA') {
                            this.dctProductDetails[item][i].dbl_gdew = this.lstGdpRange[index].dbl_amt;
                          }
                        }
                      }

                    }

                  } else {
                    // this.dctProductDetails[item][i].dbl_estimated_amount = 0.00;
                    // swal.fire('Error', result['reason'], 'error')
                  }

                },
                (error) => {
                  // swal.fire('Error', 'Item amount is not found', 'error');
                }
              );
              // checking stock availability of an item
              this.serverService.postData('mobile/get_stock_for_item/', { 'itemId': this.strItemId }).subscribe(
                (res) => {
                  const result = res;
                  if (result['status'] == 1) {
                    if (result['data'] == 'unavailable') {
                      this.dctProductDetails[item][i].vchr_enquiry_status = 'OUT OF STOCK'
                      if (result['item_stock'].length > 0) {
                        this.lstAvailable = result['item_stock']
                      }
                    } else {
                      this.dctProductDetails[item][i].vchr_enquiry_status = 'NEW'
                    }
                  } else {

                  }

                },
                (error) => {
                  // swal.fire('Error', 'Item amount is not found', 'error');
                }
              );

              // this.dctProductDetails[item][i].min = tempData[0]['stock']['dbl_min_selling_price'];
              // this.dctProductDetails[item][i].max = tempData[0]['stock']['dbl_max_selling_price'];
              // this.dctProductDetails[item][i].dbl_estimated_amount = tempData[0]['stock']['dbl_max_selling_price'];
              this.dctProductDetails[item][i].info = true;
              this.dctProductDetails[item][i].outofstock = false;
              if ('spec' in tempData[0]) {
                this.dctProductSpecData = tempData[0]['spec'];
                this.lstProductSpecOrder = tempData[0]['order'];
                this.strProductImage = tempData[0]['img'];
                this.dctProductDetails[item][i].spec = true;

              }
              else {
                this.dctProductDetails[item][i].blnItem = false;

              }
              // if (!('stock' in tempData[0])) {
              //   this.dctProductDetails[item][i].lst_stockDetails = tempData[0]['stockInOthrBranch'];
              //   this.stockDetails = tempData[0]['stockInOthrBranch'];
              //   this.filteredItems = Object.assign([], this.stockDetails);
              //   this.snotifyService.error('Item out of stock');

              //   this.dctProductDetails[item][i].lst_items = tempData;
              //   this.dctProductDetails[item][i].fk_item_id = tempData[0]['id'];
              //   // this.lstMobileData[i].strItem = '';
              //   this.dctProductDetails[item][i].dbl_estimated_amount = '';
              //   this.dctProductDetails[item][i].min = 'N/A';
              //   this.dctProductDetails[item][i].max = 'N/A';
              //   this.dctProductDetails[item][i].info = false;
              //   this.dctProductDetails[item][i].spec = false;
              //   this.dctProductDetails[item][i].outofstock = true;
              // } else if (tempData[0]['stock']['int_available'] < 1) {
              //   this.snotifyService.error('Item out of stock');
              //   this.dctProductDetails[item][i].lst_stockDetails = tempData[0]['stockInOthrBranch'];
              //   this.stockDetails = this.dctProductDetails[item][i].lst_stockDetails;
              //   this.filteredItems = Object.assign([], this.stockDetails);
              //   this.dctProductDetails[item][i].lst_items = tempData;
              //   this.dctProductDetails[item][i].fk_item_id = tempData[0]['id'];
              //   this.dctProductDetails[item][i].strItem = '';
              //   this.dctProductDetails[item][i].info = false;
              //   this.dctProductDetails[item][i].outofstock = true;
              // } else {
              //   this.dctProductDetails[item][i].lst_items = tempData;
              //   this.dctProductDetails[item][i].fk_item_id = tempData[0]['id'];
              //   this.dctProductDetails[item][i].min =
              //     tempData[0]['stock']['dbl_min_selling_price'];
              //   this.dctProductDetails[item][i].max =
              //     tempData[0]['stock']['dbl_max_selling_price'];
              //   this.dctProductDetails[item][i].dbl_estimated_amount = tempData[0]['stock']['dbl_max_selling_price'];
              //   this.dctProductDetails[item][i].info = true;
              //   this.dctProductDetails[item][i].outofstock = false;
              // }
              // if ('spec' in tempData[0]) {
              // this.dctMobileProductData = tempData[0]['spec'];
              // this.dctProductDetails[item][i].spec = true;
              // }
            }
          },
          error => {
            this.dctProductDetails[item][i].min = 'N/A';
            this.dctProductDetails[item][i].max = 'N/A';
            this.dctProductDetails[item][i].info = false;
            this.dctProductDetails[item][i].outofstock = false;
          }
        );
      }
    }
  }

  checkProductAmount(index, item) {
    const min_str = 'Amount not in range';
    const max_str = 'Amount not in range';
    if ((Number(this.dctProductDetails[item][index].dbl_estimated_amount)) > (Number(this.dctProductDetails[item][index].max)
      * Number(this.dctProductDetails[item][index].intQty))) {
      // this.snotifyService.error(max_str);
    } else if ((Number(this.dctProductDetails[item][index].dbl_estimated_amount)) < (Number(this.dctProductDetails[item][index].min
      * Number(this.dctProductDetails[item][index].intQty)))) {
      // this.snotifyService.error(min_str);
    } else {
      this.dctProductDetails[item][index].dbl_estimated_amount = this.dctProductDetails[item][index].dbl_estimated_amount;
    }
  }

  clearData() {
    for (let index = 0; index < this.lstProductDetails.length; index++) {
      this.lstProductDetails[index]['checked'] = false;
      this.dctStatus[this.lstProductDetails['name']] = false;
    }
    this.dctStatus = {
      // MOBILE: false,
      // TABLET: false,
      // COMPUTER: false,
      // ACCESSORIES: false,
      MOBILESTATUS: false,
      SMS: false,
      ASSIGNSTATUS: true,
      SUBMITTED: false,
      mobileNa: false,
      tabletNa: false,
      computerNa: false,
      accessoriesNa: false
    };
    this.lstMobileNumbers = [];
    this.strSelectedMobileNumber = null;
    this.strFirstName = null;
    this.strLastName = null;
    this.strEmailAddress = null;
    this.strSalutation = null;
    this.strAssignTo = "";
    this.branchId = '';

    this.remarks = '';

    this.strEnquiryNumber = null;
    this.intCustomerId = null;
    this.strCustomerType = null;
    this.strEnquirySource = '';
    // this.strEnquiryPriority = '';

    this.searchMobile.reset();
    // this.enquiryPriority.reset();
    this.enquirySource.reset();
    this.lstFiles = [];
    // this.eventImg.nativeElement.value = '';
    this.feedback = null;
    this.dctProductDetails = {};
    // this.lstComputerData = [{
    //   strBrand: '',
    //   strItem: '',
    //   fk_brand_id: 0,
    //   fk_item_id: 0,
    //   intQty: 1,
    //   vchr_enquiry_status: 'NEW',
    //   dbl_estimated_amount: '',
    //   vchr_remarks: '',
    //   strStockBrand: '',
    //   strStockItem: '',
    //   lst_brands: [],
    //   lst_items: [], min: '', max: '', spec: false, info: false,
    //   lst_imei:[],
    //   outofstock:false,
    // }];
    // this.lstAccessoriesData = [{
    //   strBrand: '',
    //   strItem: '',
    //   fk_brand_id: 0,
    //   fk_item_id: 0,
    //   intQty: 1,
    //   vchr_enquiry_status: 'NEW',
    //   dbl_estimated_amount: '',
    //   vchr_remarks: '',
    //   strStockBrand: '',
    //   strStockItem: '',
    //   lst_brands: [],
    //   lst_items: [], min: '', max: '', spec: false, info: false,
    //   lst_imei:[],
    //   outofstock:false,
    // }];
    // this.lstTabletData = [{
    //   strBrand: '',
    //   strItem: '',
    //   fk_brand_id: 0,
    //   fk_item_id: 0,
    //   intQty: 1,
    //   vchr_enquiry_status: 'NEW',
    //   dbl_estimated_amount: '',
    //   vchr_remarks: '',
    //   strStockBrand: '',
    //   strStockItem: '',
    //   lst_brands: [],
    //   lst_items: [], min: '', max: '', spec: false, info: false,
    //   lst_imei:[],
    //   outofstock:false,
    // }];
  }

  validate(event) {

    if (event.key === 'Enter') {
      this.checkCustomer();
    } else if (
      event.target.value.length >= 20
    ) {
      return false;
    }
  }

  checkError() {
    const matArray = this.panes.toArray();
    for (const data of matArray) {
      let flag = 0;
      for (const elem of data._inputContainerRef.nativeElement.children) {
        if (elem.classList.contains('ng-invalid')) {
          elem.focus();
          flag = 1;
          break;
        }
      }
      if (flag === 1) {
        return false;
      }
    }
    return true;
  }
  addFiles(inputFile) {
    this.lstFiles = Array.from(inputFile.files);
  }
  deleteFiles(index) {
    this.lstFiles.splice(index, 1);
  }
  checkArr(arr) {
    let status = true
    arr.forEach(element => {
      if (element === '' || element == null) {
        status = false
      }
    });
    return status
  }
  checkCustomer() {
    this.dctProductDetailsNA = {}
    this.blnEnqStatus = {
      'enquiry': false,
      'naEnquiry': false
    }
    const formdata = new FormData();
    for (let i = 0; i < this.lstFiles.length; i++) {
      formdata.append('files', this.lstFiles[i], this.lstFiles[i].name);
    }
    formdata.append('companyid', this.companyId.toString());
    // formdata.append('enquiryid','ENQ-0001')

    this.dctStatus.SUBMITTED = true;
    if (this.dctStatus.MOBILESTATUS === false) {
      swal.fire({
        title: 'Invalid mobile number',
        type: 'error',
        text:
          'The mobile number entered does not belong to an existing customer',
        confirmButtonText: 'OK'
      });
      // this.mobileRef.nativeElement.focus();

      this.dctStatus.SUBMITTED = false;
      return false;
    } else {
      if (this.strEnquirySource === '' || this.strEnquirySource == null) {
        swal.fire({
          title: 'No enquiry source selected',
          type: 'error',
          text: 'Select at least one source',
          confirmButtonText: 'OK'
        });
        // this.enqSourceSel.nativeElement.focus();

        this.dctStatus.SUBMITTED = false;
        return false;
      }
      // if (this.strEnquiryPriority === '' || this.strEnquiryPriority == null) {
      //   swal.fire({
      //     title: 'No enquiry priority selected',
      //     type: 'error',
      //     text: 'Select at least one priority',
      //     confirmButtonText: 'OK'
      //   });
      //   // this.enqPrioritySel.nativeElement.focus();

      //   this.dctStatus.SUBMITTED = false;
      //   return false;
      // }
      if ((this.currentGroupName.toUpperCase() === 'CALL CENTER' && this.branchNameType && this.branchNameType !== this.selectedBranch)
        || (this.currentGroupName.toUpperCase() === 'CALL CENTER' && !this.branchNameType)) {
        swal.fire({
          title: 'No Branch selected',
          type: 'error',
          text: 'Select valid branch',
          confirmButtonText: 'OK'
        });

        this.dctStatus.SUBMITTED = false;
        return false;
      }
      let service = 0;
      // tslint:disable-next-line:forin
      for (const i in this.dctStatus) {
        if (i !== 'MOBILESTATUS' && i !== 'SMS' && i !== 'ASSIGNSTATUS' && i !== 'SUBMITTED') {
          if (this.dctStatus[i] === true) {
            service += 1;
          }
        }
      }
      // if (service === 0) {
      if (Object.keys(this.dctProductDetails).length === 0) {
        swal.fire({
          title: 'No products selected',
          type: 'error',
          text: 'Select at least one product',
          confirmButtonText: 'OK'
        });
        this.service.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        this.dctStatus.SUBMITTED = false;
        return false;
      }
      let data = {};
      data = {
        fk_customer_id: this.intCustomerId,
        fk_enquiry_source: this.strEnquirySource,
        vchr_customer_type: this.strCustomerType,
        // fk_enquiry_priority: this.strEnquiryPriority,
        fk_assigned_id: this.strAssignTo,
        fk_created_id: this.currentUserId,
        bln_sms: this.dctStatus.SMS,
        fk_branch: this.branchId
      };

      let rating = {};
      rating = {
        fk_customer_id: this.intCustomerId,
        vchr_feedback: this.feedback,
        dbl_rating: this.starRating,
        fk_user_id: this.userId
      };
      console.log(this.dctProductDetails);
      
      for (let key in this.dctProductDetails) {
        if (this.dctProductDetails[key]) {


          for (let i = 0; i < this.dctProductDetails[key].length; i++) {
            if (!this.dctProductDetails[key][i].mobileNa) {

              if (
                this.dctProductDetails[key][i].strBrand == null ||
                // this.dctProductDetails[key][i].strBrand.trim() === '' || this.dctProductDetails[key][i].blnBrand
                this.dctProductDetails[key][i].strBrand.trim() === '' || !this.dctProductDetails[key][i].blnBrand
              ) {
                
                swal.fire('Error', 'Invalid Brand ' + (key.toLowerCase()) + ' tab ' + (i + 1), 'error');
                return false;
              }
              if (
                this.dctProductDetails[key][i].strItem == null ||
                this.dctProductDetails[key][i].strItem.trim() === '' || !this.dctProductDetails[key][i].blnItem
              ) {
                swal.fire('Error', 'Invalid Item ' + (key.toLowerCase()) + ' tab ' + (i + 1), 'error');
                return false;
              }

              if (
                this.dctProductDetails[key][i].intQty == null ||
                this.dctProductDetails[key][i].intQty === ''
              ) {
                swal.fire('Error', 'Invalid Quantity', 'error');
                return false;
              }


              // if (
              //   this.dctProductDetails[key][i].vchr_colour == null ||
              //   this.dctProductDetails[key][i].vchr_colour === ''
              // ) {
              //   swal.fire('Error', 'Invalid Color', 'error');
              //   return false;
              // }
              // if (
              //   this.dctProductDetails[key][i].vchr_spec == null ||
              //   this.dctProductDetails[key][i].vchr_spec === ''
              // ) {
              //   swal.fire('Error', 'Invalid Specification', 'error');
              //   return false;
              // }

              if (
                this.dctProductDetails[key][i].vchr_enquiry_status == null ||
                this.dctProductDetails[key][i].vchr_enquiry_status === ''
              ) {
                swal.fire('Enquiry Status Error', 'Invalid Enquiry Status' + key + (i + 1), 'error');
                return false;
              }
              if (
                this.dctProductDetails[key][i].dbl_estimated_amount == null ||
                this.dctProductDetails[key][i].dbl_estimated_amount === '' ||
                !Number(this.dctProductDetails[key][i].dbl_estimated_amount)
              ) {
                swal.fire('Estimated Amount Error', 'Invalid Estimated Amount', 'error');
                return false;
              }
              if ((this.dctProductDetails[key][i].dbl_gdp == '' && this.dctProductDetails[key][i].dbl_gdew == '') || (this.dctProductDetails[key][i].dbl_gdp == 0 && this.dctProductDetails[key][i].dbl_gdew == 0)) {
                this.dctProductDetails[key][i].int_type = 0;
              } else if ((this.dctProductDetails[key][i].dbl_gdp != '' && this.dctProductDetails[key][i].dbl_gdew == '') || (this.dctProductDetails[key][i].dbl_gdp != 0 && this.dctProductDetails[key][i].dbl_gdew == 0)) {
                this.dctProductDetails[key][i].int_type = 1;
              } else if ((this.dctProductDetails[key][i].dbl_gdp == '' && this.dctProductDetails[key][i].dbl_gdew != '') || (this.dctProductDetails[key][i].dbl_gdp == 0 && this.dctProductDetails[key][i].dbl_gdew != 0)) {
                this.dctProductDetails[key][i].int_type = 2;
              } else if ((this.dctProductDetails[key][i].dbl_gdp != '' && this.dctProductDetails[key][i].dbl_gdew != '') || (this.dctProductDetails[key][i].dbl_gdp != 0 && this.dctProductDetails[key][i].dbl_gdew != 0)) {
                this.dctProductDetails[key][i].int_type = 3;
              }
              // if (
              //   this.dctProductDetails[key][i].dbl_estimated_amount > (Number(this.dctProductDetails[key][i].max) *
              //   Number(this.dctProductDetails[key][i].intQty) )) {
              //     let tot = Number(this.dctProductDetails[key][i].max) * Number(this.dctProductDetails[key][i].intQty)
              //   swal.fire('Amount Error','In Mobile Tab'+(i+1)+ ', Amount not in range', 'error');
              //   return false;
              // }

              // if (
              //   this.dctProductDetails[key][i].dbl_estimated_amount < (Number(this.dctProductDetails[key][i].min) *
              //   Number(this.dctProductDetails[key][i].intQty) )) {
              //     let tot = Number(this.dctProductDetails[key][i].min) * Number(this.dctProductDetails[key][i].intQty)
              //   swal.fire('Amount Error','In Mobile Tab'+(i+1)+ ', Amount not in range', 'error');
              //   return false;
              // }


              // if (this.dctProductDetails[key][i].vchr_enquiry_status === 'BOOKED' && this.dctProductDetails[key][i].str_product.toUpperCase() !== 'SIM'
              // && this.dctProductDetails[key][i].str_product.toUpperCase() !== 'SERVICE' && this.dctProductDetails[key][i].str_product.toUpperCase() !== 'RECHARGES') 
              if (this.dctProductDetails[key][i].vchr_enquiry_status === 'BOOKED' && (this.dctProductDetails[key][i].str_product.toUpperCase() === 'MOBILES'
                || this.dctProductDetails[key][i].str_product.toUpperCase() === 'TABLETS')) {
                if (Object.keys(this.dctProductDetails[key][i].lst_imei).length >= this.dctProductDetails[key][i].intQty) {
                  let flg_value = false;
                  for (const dct_key in this.dctProductDetails[key][i].lst_imei) {
                    if (this.dctProductDetails[key][i].lst_imei[dct_key] === '') {
                      flg_value = true;
                      break;
                    }

                  }


                  if (flg_value === true) {
                    swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
                    return false;
                  } else {
                    let lstvalueimei = [];
                    for (let key2 in this.dctProductDetails[key][i].lst_imei) {
                      if (this.dctProductDetails[key][i].lst_imei.hasOwnProperty(key2)) {
                        lstvalueimei.push(this.dctProductDetails[key][i].lst_imei[key2]);
                      }
                    }
                    this.dctProductDetails[key][i].lst_imei = lstvalueimei
                  }
                  // if (this.checkArr(this.dctProductDetails[key][i].lst_imei)) {
                  //   this.dctProductDetails[key][i].lst_imei = this.dctProductDetails[key][i].lst_imei.filter((x,k) => {
                  //               if (k<this.dctProductDetails[key][i].intQty) {
                  //                 return x
                  //               }
                  //     } )
                  // } else{
                  // swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
                  //   return false;
                  // }
                } else {
                  swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
                  return false;
                }
              } else {
                this.dctProductDetails[key][i].lst_imei = {}
              }
              if (this.dctProductDetails[key][i].vchr_enquiry_status === 'BOOKED' && this.dctProductDetails[key][i].outofstock) {
                swal.fire('Item OutofStock', 'booking item ' + this.dctProductDetails[key][i].strItem + ' is outofstock', 'error');
                return false;
              }
              this.blnEnqStatus['enquiry'] = true;
            } else if (this.dctProductDetails[key][i].mobileNa) {

              // for (let i = 0; i < this.dctProductDetails[key].length; i++) {
              if (
                !this.dctProductDetails[key][i].strStockBrand ||
                this.dctProductDetails[key][i].strStockBrand.trim() === ''
              ) {
                swal.fire('Error', 'Invalid Brand', 'error');
                return false;
              }
              if (
                !this.dctProductDetails[key][i].strStockItem ||
                this.dctProductDetails[key][i].strStockItem.trim() === ''
              ) {
                swal.fire('Error', 'Invalid Item', 'error');
                return false;
              }
              // this.dctProductDetails[key][i].push(this.dctSpecification[key][i]);

              // if (
              //   this.dctProductDetails[key][i].vchr_colour == null ||
              //   this.dctProductDetails[key][i].vchr_colour === ''
              // ) {
              //   swal.fire('Error', 'Invalid Color', 'error');
              //   return false;
              // }
              if (
                this.dctProductDetails[key][i].intQty == null ||
                this.dctProductDetails[key][i].intQty === ''
              ) {
                swal.fire('Error', 'Invalid Quantity', 'error');
                return false;
              }
              // }

              // shafeet - adding na details to dctProductDetailsNA
              if (key in this.dctProductDetailsNA) {
                this.dctProductDetailsNA[key].push(this.dctProductDetails[key][i])
              } else {
                this.dctProductDetailsNA[key] = []
                this.dctProductDetailsNA[key].push(this.dctProductDetails[key][i])
              }
              this.blnEnqStatus['naEnquiry'] = true;
            }
          }
          // else if (this.dctStatus.mobileNa && this.dctStatus[key] === true) {

        }
      }

      // // tablets data validation
      // if (this.dctStatus.TABLET === true && !this.dctStatus.tabletNa) {
      //   for (let i = 0; i < this.lstTabletData.length; i++) {
      //     if (
      //       this.lstTabletData[i].strBrand == null ||
      //       this.lstTabletData[i].strBrand.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Brand', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstTabletData[i].strItem == null ||
      //       this.lstTabletData[i].strItem.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Item', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstTabletData[i].intQty == null ||
      //       this.lstTabletData[i].intQty === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Quantity', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstTabletData[i].vchr_enquiry_status == null ||
      //       this.lstTabletData[i].vchr_enquiry_status === ''
      //     ) {
      //       swal.fire('Enquiry Status Error', 'Invalid Enquiry Status', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstTabletData[i].dbl_estimated_amount == null ||
      //       this.lstTabletData[i].dbl_estimated_amount === '' ||
      //       !Number(this.lstTabletData[i].dbl_estimated_amount)
      //     ) {
      //       swal.fire('Esimated Amount Error', 'Invalid Esimated Amount', 'error');
      //       return false;
      //     }


      //     if (
      //       this.lstTabletData[i].dbl_estimated_amount > (Number(this.lstTabletData[i].max) * Number(this.lstTabletData[i].intQty) )) {
      //         let tot = Number(this.lstTabletData[i].max) * Number(this.lstTabletData[i].intQty)
      //       swal.fire('Amount Error','In Tablet Tab'+(i+1)+ ', Amount not in range', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstTabletData[i].dbl_estimated_amount < (Number(this.lstTabletData[i].min) * Number(this.lstTabletData[i].intQty) )) {
      //         let tot = Number(this.lstTabletData[i].min) * Number(this.lstTabletData[i].intQty)
      //       swal.fire('Amount Error','In Tablet Tab'+(i+1)+ ', Amount not in range', 'error');
      //       return false;
      //     }



      //     if (this.lstTabletData[i].vchr_enquiry_status === 'BOOKED') {
      //       if (this.lstTabletData[i].lst_imei.length >= this.lstTabletData[i].intQty) {
      //         if (this.checkArr(this.lstTabletData[i].lst_imei)) {
      //           this.lstTabletData[i].lst_imei = this.lstTabletData[i].lst_imei.filter((x,k) => {
      //                       if (k<this.lstTabletData[i].intQty) {
      //                         return x
      //                       }
      //             } )
      //         } else{
      //         swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
      //           return false;
      //         }
      //       } else{
      //         swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
      //           return false;
      //         }
      //     } else {
      //       this.lstTabletData[i].lst_imei = []
      //     }
      //     if (this.lstTabletData[i].vchr_enquiry_status === 'BOOKED' && this.lstTabletData[i].outofstock) {
      //       swal.fire('Item OutofStock', 'booking item '+ this.lstTabletData[i].strItem +' is outofstock', 'error');
      //           return false;
      //     }
      //   }
      // } else if (this.dctStatus.tabletNa && this.dctStatus.TABLET === true) {
      //   for (let i = 0; i < this.lstTabletData.length; i++) {
      //     if (
      //       !this.lstTabletData[i].strStockBrand ||
      //       this.lstTabletData[i].strStockBrand.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Brand', 'error');
      //       return false;
      //     }
      //     if (
      //       !this.lstTabletData[i].strStockItem ||
      //       this.lstTabletData[i].strStockItem.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Item', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstTabletData[i].intQty == null ||
      //       this.lstTabletData[i].intQty === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Quantity', 'error');
      //       return false;
      //     }
      //   }
      // }

      // // Computers data validation
      // if (this.dctStatus.COMPUTER === true && !this.dctStatus.computerNa) {
      //   for (let i = 0; i < this.lstComputerData.length; i++) {
      //     if (
      //       this.lstComputerData[i].strBrand == null ||
      //       this.lstComputerData[i].strBrand.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Brand', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstComputerData[i].strItem == null ||
      //       this.lstComputerData[i].strItem.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Item', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstComputerData[i].intQty == null ||
      //       this.lstComputerData[i].intQty === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Quantity', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstComputerData[i].vchr_enquiry_status == null ||
      //       this.lstComputerData[i].vchr_enquiry_status === ''
      //     ) {
      //       swal.fire('Enquiry Status Error', 'Invalid Enquiry Status', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstComputerData[i].dbl_estimated_amount == null ||
      //       this.lstComputerData[i].dbl_estimated_amount === '' ||
      //       !Number(this.lstComputerData[i].dbl_estimated_amount)
      //     ) {
      //       swal.fire('Esimated Amount Error', 'Invalid Esimated Amount', 'error');
      //       return false;
      //     }


      //     if (
      //       this.lstComputerData[i].dbl_estimated_amount > (Number(this.lstComputerData[i].max) * Number(this.lstComputerData[i].intQty) )) {
      //         let tot = Number(this.lstComputerData[i].max) * Number(this.lstComputerData[i].intQty)
      //       swal.fire('Amount Error','In Computer Tab'+(i+1)+ ', Amount not in range', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstComputerData[i].dbl_estimated_amount < (Number(this.lstComputerData[i].min) * Number(this.lstComputerData[i].intQty) )) {
      //         let tot = Number(this.lstComputerData[i].min) * Number(this.lstComputerData[i].intQty)
      //       swal.fire('Amount Error','In Computer Tab'+(i+1)+ ', Amount not in range', 'error');
      //       return false;
      //     }



      //     if (this.lstComputerData[i].vchr_enquiry_status === 'BOOKED') {
      //       if (this.lstComputerData[i].lst_imei.length >= this.lstComputerData[i].intQty) {
      //         if (this.checkArr(this.lstComputerData[i].lst_imei)) {
      //           this.lstComputerData[i].lst_imei = this.lstComputerData[i].lst_imei.filter((x,k) => {
      //                       if (k<this.lstComputerData[i].intQty) {
      //                         return x
      //                       }
      //             } )
      //         } else{
      //         swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
      //           return false;
      //         }
      //       } else{
      //         swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
      //           return false;
      //         }
      //     } else {
      //       this.lstComputerData[i].lst_imei = []
      //     }
      //     if (this.lstComputerData[i].vchr_enquiry_status === 'BOOKED' && this.lstComputerData[i].outofstock) {
      //       swal.fire('Item OutofStock', 'booking item '+ this.lstComputerData[i].strItem +' is outofstock', 'error');
      //           return false;
      //     }
      //   }
      // } else if (this.dctStatus.computerNa && this.dctStatus.COMPUTER === true) {
      //   for (let i = 0; i < this.lstComputerData.length; i++) {
      //     if (
      //       !this.lstComputerData[i].strStockBrand ||
      //       this.lstComputerData[i].strStockBrand.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Brand', 'error');
      //       return false;
      //     }
      //     if (
      //       !this.lstComputerData[i].strStockItem ||
      //       this.lstComputerData[i].strStockItem.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Item', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstComputerData[i].intQty == null ||
      //       this.lstComputerData[i].intQty === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Quantity', 'error');
      //       return false;
      //     }
      //   }
      // }

      // // ACCESSORIES data validation
      // if (this.dctStatus.ACCESSORIES === true && !this.dctStatus.accessoriesNa) {
      //   for (let i = 0; i < this.lstAccessoriesData.length; i++) {
      //     if (
      //       this.lstAccessoriesData[i].strBrand == null ||
      //       this.lstAccessoriesData[i].strBrand.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Brand', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstAccessoriesData[i].strItem == null ||
      //       this.lstAccessoriesData[i].strItem.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Item', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstAccessoriesData[i].intQty == null ||
      //       this.lstAccessoriesData[i].intQty === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Quantity', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstAccessoriesData[i].vchr_enquiry_status == null ||
      //       this.lstAccessoriesData[i].vchr_enquiry_status === ''
      //     ) {
      //       swal.fire('Enquiry Status Error', 'Invalid Enquiry Status', 'error');
      //       return false;
      //     }
      //     if (
      //       this.lstAccessoriesData[i].dbl_estimated_amount == null ||
      //       this.lstAccessoriesData[i].dbl_estimated_amount === '' ||
      //       !Number(this.lstAccessoriesData[i].dbl_estimated_amount)
      //     ) {
      //       swal.fire('Esimated Amount Error', 'Invalid Esimated Amount', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstAccessoriesData[i].dbl_estimated_amount > (Number(this.lstAccessoriesData[i].max) * Number(this.lstAccessoriesData[i].intQty) )) {
      //         let tot = Number(this.lstAccessoriesData[i].max) * Number(this.lstAccessoriesData[i].intQty)
      //       swal.fire('Amount Error','In Accessories Tab'+(i+1)+ ', Amount not in range '+tot, 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstAccessoriesData[i].dbl_estimated_amount < (Number(this.lstAccessoriesData[i].min) * Number(this.lstAccessoriesData[i].intQty) )) {
      //         let tot = Number(this.lstAccessoriesData[i].min) * Number(this.lstAccessoriesData[i].intQty)
      //       swal.fire('Amount Error','In Accessories Tab'+(i+1)+ ', Amount not in range' , 'error');
      //       return false;
      //     }


      //     if (this.lstAccessoriesData[i].vchr_enquiry_status === 'BOOKED') {
      //       if (this.lstAccessoriesData[i].lst_imei.length >= this.lstAccessoriesData[i].intQty) {
      //         if (this.checkArr(this.lstAccessoriesData[i].lst_imei)) {
      //           this.lstAccessoriesData[i].lst_imei = this.lstAccessoriesData[i].lst_imei.filter((x,k) => {
      //                       if (k<this.lstAccessoriesData[i].intQty) {
      //                         return x
      //                       }
      //             } )
      //         } else{
      //         swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
      //           return false;
      //         }
      //       } else{
      //         swal.fire('Imei Number error', 'Invalid Imei Numbers', 'error');
      //           return false;
      //         }
      //     } else {
      //       this.lstAccessoriesData[i].lst_imei = []
      //     }
      //     if (this.lstAccessoriesData[i].vchr_enquiry_status === 'BOOKED' && this.lstAccessoriesData[i].outofstock) {
      //       swal.fire('Item OutofStock', 'booking item '+ this.lstAccessoriesData[i].strItem +' is outofstock', 'error');
      //           return false;
      //     }
      //   }
      // } else if (this.dctStatus.accessoriesNa && this.dctStatus.ACCESSORIES === true) {
      //   for (let i = 0; i < this.lstAccessoriesData.length; i++) {
      //     if (
      //       !this.lstAccessoriesData[i].strStockBrand ||
      //       this.lstAccessoriesData[i].strStockBrand.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Brand', 'error');
      //       return false;
      //     }
      //     if (
      //       !this.lstAccessoriesData[i].strStockItem ||
      //       this.lstAccessoriesData[i].strStockItem.trim() === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Item', 'error');
      //       return false;
      //     }

      //     if (
      //       this.lstAccessoriesData[i].intQty == null ||
      //       this.lstAccessoriesData[i].intQty === ''
      //     ) {
      //       swal.fire('Error', 'Invalid Quantity', 'error');
      //       return false;
      //     }
      //   }
      // }
      let product = {};
      product = this.dctProductDetails;
      const requestData = {
        customer_data: data,
        product: this.dctProductDetails,
        remarks: this.remarks,
        customer_rating: rating,
        status: this.dctStatus,
        attachment: formdata,
        naproduct: this.dctProductDetailsNA,
        enquirystatus: this.blnEnqStatus
      };
      this.blnPrint = false;
      if (this.dctStatus.SUBMITTED) {
        this.blnSaveLeadFlag = false;
        const flag = this.checkEnquiryStatus(data);
        if (flag) {
          swal.fire({
            title: 'Enquiry Print',
            type: 'question',
            text: 'Do you want to print the enquiry?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then(result => {
            if (result.value) {
              this.blnPrint = true;
            }
            this.createEnquiry(requestData, formdata);
          });
        } else {
          this.createEnquiry(requestData, formdata);
        }
      }
    }
  }
  //   createEnquiry(requestData, formdata) {
  //     this.spinnerService.show();
  //     // if (!this.dctStatus.mobileNa && !this.dctStatus.tabletNa && !this.dctStatus.computerNa && !this.dctStatus.accessoriesNa) {
  //       // this.serverService.addMobileEnquiry(requestData, formdata).subscribe(
  //       this.serverService.postData('mobile/add_mobile_enquiry/',requestData).subscribe(

  //         response => {
  //           this.blnSaveLeadFlag = true;
  //           this.spinnerService.hide();
  //           const res = response;
  //           formdata.append('enquiryid', response['data']);
  //           // this.serverService.addSoftwareAttachment(formdata);
  //           //edited
  //           this.serverService.postData( "software/add_attachments/",formdata);

  //           if (res.status === 'Success') {
  //             this.spinnerService.hide();
  //             this.strEnquiryNumber = res.data;
  //             swal.fire({
  //               title: 'Enquiry Creation Success',
  //               type: 'success',
  //               text:
  //                 'An enquiry with number ' +
  //                 this.strEnquiryNumber +
  //                 '  was successfully created ',
  //               confirmButtonText: 'OK',
  //               showConfirmButton: false,
  //               timer: 2000
  //             }).then(result => {
  //               if (this.blnPrint) {
  //                 this.downloadEnquiry(res.enqId);
  //               } else {
  //                 this.router.navigate(['/crm/enquirylist']);
  //               }
  //             });
  //           } else {
  //             this.spinnerService.hide();
  //             swal.fire({
  //               title: 'Enquiry Creation Failed',
  //               type: 'error',
  //               text:
  //                 res.data,
  //               confirmButtonText: 'OK'
  //             });
  //           }
  //         },
  //         error => {
  //           this.blnSaveLeadFlag = true;
  //           this.spinnerService.hide();
  //         }
  //       );
  //       }




  //      else {

  //       this.serverService.addMobileNaEnquiry(requestData, formdata).subscribe(
  //         response => {
  //           this.blnSaveLeadFlag = true;
  //           this.spinnerService.hide();
  //           const res = response;
  //           formdata.append('enquiryid', response['data']);
  //           this.serverService.addSoftwareAttachment(formdata);

  //           if (res.status === '0') {
  //             this.spinnerService.hide();
  //             this.strEnquiryNumber = res.result;
  //             swal.fire({
  //               title: 'Enquiry Creation Success',
  //               type: 'success',
  //               text:
  //                 'An enquiry with number ' +
  //                 this.strEnquiryNumber +
  //                 '  was successfully created ',
  //               confirmButtonText: 'OK',
  //               showConfirmButton: false,
  //               timer: 2000
  //             }).then(result => {
  //               if (this.blnPrint) {
  //                 this.downloadEnquiry(res.enqId);
  //               } else {
  //                 // localStorage.setItem('stock','Out of stock');
  //                 this.router.navigate(['/crm/enquirylist']);
  //               }
  //             });
  //           } else {
  //             this.spinnerService.hide();
  //             swal.fire({
  //               title: 'Enquiry Creation Failed',
  //               type: 'error',
  //               text:
  //                 'Enquiry creation failed beacause of ' +
  //                 res.data +
  //                 ' Please check form before continuing',
  //               confirmButtonText: 'OK'
  //             });
  //           }
  //         },
  //         error => {
  //           this.blnSaveLeadFlag = true;
  //           this.spinnerService.hide();
  //         }
  //       );
  //     }
  //   }
  // }
  //     }
  createEnquiry(requestData, formdata) {
    this.spinnerService.show();
    // if (!this.dctStatus.mobileNa && !this.dctStatus.tabletNa && !this.dctStatus.computerNa && !this.dctStatus.accessoriesNa) {
    // this.serverService.addMobileEnquiry(requestData, formdata).subscribe(

    this.serverService.postData('mobile/add_mobile_enquiry/', requestData).subscribe(

      response => {
        this.blnSaveLeadFlag = true;
        this.spinnerService.hide();
        const res = response;
        formdata.append('enquiryid', response['data']);
        // this.serverService.addSoftwareAttachment(formdata);
        //edited
        this.serverService.postData("software/add_attachments/", formdata);

        if (res.status == 1) {
          this.spinnerService.hide();
          this.strEnquiryNumber = res['data'];
          swal.fire({
            title: 'Enquiry Creation Success',
            type: 'success',
            text:
              'An enquiry with number ' +
              this.strEnquiryNumber +
              '  was successfully created ',
            confirmButtonText: 'OK',
            showConfirmButton: false,
            timer: 2000
          }).then(result => {
            if (this.blnPrint) {
              this.downloadEnquiry(res['enqId']);
            } else {
              this.router.navigate(['/crm/enquirylist']);
            }
          });
        } else {
          this.spinnerService.hide();
          swal.fire({
            title: 'Enquiry Creation Failed',
            type: 'error',
            text:
              res['data'],
            confirmButtonText: 'OK'
          });
        }
      },
      error => {
        this.blnSaveLeadFlag = true;
        this.spinnerService.hide();
      }
    );
    // } else {
    //   this.serverService.addMobileEnquiry(requestData, formdata).subscribe(
    //     response => {
    //       this.blnSaveLeadFlag = true;
    //       this.spinnerService.hide();
    //       const res = response;
    //       formdata.append('enquiryid', response['data']);
    //       this.serverService.addSoftwareAttachment(formdata);
    //       if (res.status === '0') {
    //         this.spinnerService.hide();
    //         this.strEnquiryNumber = res.result;
    //         swal.fire({
    //           title: 'Enquiry Creation Success',
    //           type: 'success',
    //           text:
    //             'An enquiry with number ' +
    //             this.strEnquiryNumber +
    //             '  was successfully created ',
    //           confirmButtonText: 'OK',
    //           showConfirmButton: false,
    //           timer: 2000
    //         }).then(result => {
    //           if (this.blnPrint) {
    //             this.downloadEnquiry(res.enqId);
    //           } else {
    //             // localStorage.setItem('stock','Out of stock');
    //             this.router.navigate(['/crm/enquirylist']);
    //           }
    //         });
    //       } else {
    //         this.spinnerService.hide();
    //         swal.fire({
    //           title: 'Enquiry Creation Failed',
    //           type: 'error',
    //           text:
    //             'Enquiry creation failed beacause of ' +
    //             res.data +
    //             ' Please check form before continuing',
    //           confirmButtonText: 'OK'
    //         });
    //       }
    //     },
    //     error => {
    //       this.blnSaveLeadFlag = true;
    //       this.spinnerService.hide();
    //     }
    //   );
    // }

  }


  checkEnquiryStatus(data: any) {

    for (const i of Object.keys(data)) {

      console.log("checkkkkkkk",data);
      

      if (
        ['customerData', 'username', 'rating', 'print', 'otherData'].indexOf(
          i
        ) === -1
      ) {

        // for (let j = 0; j < data[i].length; j++) {
        //   if (
        //     ['BOOKED'].indexOf(
        //       data[i][j].vchr_enquiry_status
        //     ) > -1
        //   ) {
        //     return true;
        //   }
        // }
      } else if (i === 'otherData') {
        if (
          ['BOOKED'].indexOf(data[i].vchr_enquiry_status) > -1
        ) {
          return true;
        }
      }
    }
    return false;
  }
  downloadEnquiry(enqId) {
    const data = { userId: this.userId, enquiryId: enqId };
    // this.serverService.downloadEnquiryPDF(data).subscribe(response => {
    //   if (response.status === 'success') {
    //     const file_data = response.file;
    //     localStorage.setItem(
    //       'print',
    //       file_data.substring(2, file_data.length - 1)
    //     );
    //     localStorage.setItem('previousUrl', '/crm/enquirylist');
    //     this.router.navigate(['/print']);
    //   }
    // });

    //edited

    this.serverService.postData("enquiry_print/download/", data).subscribe(response => {
      if (response.status == 1) {
        const file_data = response['file'];
        localStorage.setItem(
          'print',
          file_data.substring(2, file_data.length - 1)
        );
        localStorage.setItem('previousUrl', '/crm/enquirylist');
        this.router.navigate(['/print']);
      }
    });
  }

  onRatingChange(event) {
    this.starRating = event['rating'];
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

      // this.serverService.addSticky(this.dctStickyData).subscribe(
      //   res => {
      //     const result = res;
      //     if (result['status'] === 'success') {
      //       this.listSticky();
      //       this.stickyTitle = '';
      //       this.stickyDesc = '';
      //       this.color = '';
      //     } else {
      //       swal.fire('Error', result['result'], 'error');
      //     }
      //   },
      //   error => {
      //     swal.fire('Error', error, 'error');
      //   }
      // );

      //edited

      this.serverService.postData('sticky_notes/stickynotes/', this.dctStickyData).subscribe(
        res => {
          const result = res;
          if (result['status'] == 1) {
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

      // this.serverService.editSticky(this.dctStickyData).subscribe(
      //   res => {
      //     const result = res;
      //     if (result['status'] === 'success') {
      //       swal.fire('Success', 'Sticky notes saved', 'success');
      //       this.listSticky();
      //     } else {
      //       swal.fire('Error', result['result'], 'error');
      //     }
      //   },
      //   error => {
      //     swal.fire('Error', error, 'error');
      //   }
      // );

      //edited


      this.serverService.putData("sticky_notes/stickynotes/", this.dctStickyData).subscribe(
        res => {
          const result = res;
          if (result['status'] == 1) {
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

    // this.serverService.getSticky(this.currentUserId).subscribe(
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


    this.serverService.getData("sticky_notes/stickynotes/?id=" + this.currentUserId).subscribe(
      result => {
        this.lstStickyData = result['data'];
        if (result['data']) {
          this.intlength = result['data'].length;
        }
        if (this.lstStickyData.length === 0) {
          this.addSticky();
        }
      },
      error => { }
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

        // this.serverService.deleteSticky(this.dctStickyData).subscribe(
        //   res => {
        //     const result = res;
        //     if (result['status'] === 'success') {
        //       // swal.fire('Success', 'Sticky note deleted', 'success');
        //       this.listSticky();
        //     } else {
        //       swal.fire('Error', result['result'], 'error');
        //     }
        //   },
        //   error => {
        //     swal.fire('Error', error, 'error');
        //   }
        // );

        //edited


        this.serverService.postData("sticky_notes/stickydelete/", this.dctStickyData).subscribe(
          res => {
            const result = res;
            if (result['status'] == 1) {
              // swal.fire('Success', 'Sticky note deleted', 'success');
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

  checkChange() {
    if (this.blnCustomerAdd === true) {
      localStorage.removeItem('customer-enquiry');
      localStorage.setItem('customer-enquiry', 'true');
    } else {
      localStorage.removeItem('customer-enquiry');
      localStorage.setItem('customer-enquiry', 'false');
    }
    this.cdRef.detectChanges();
  }
  modelChange(event, model) {
  }
  // for type head of user
  populateFields() {
    this.lstEnquiryHistory = [];
    this.lstEnquiryHistoryMaster = [];

    let intSelectedIndex = this.lstMobileNumbers.findIndex(
      elem => elem.mobile === this.strSelectedMobileNumber
    );

    if (this.lstMobileNumbers.length > 0) {

      intSelectedIndex = 0;
      this.strSelectedMobileNumber = this.lstMobileNumbers[intSelectedIndex].mobile;
    }

    if (intSelectedIndex > -1) {
      this.strFirstName = this.lstMobileNumbers[intSelectedIndex].fname;
      this.strLastName = this.lstMobileNumbers[intSelectedIndex].lname;
      this.strCustomerType = this.lstMobileNumbers[
        intSelectedIndex
      ].customertype;

      this.strEmailAddress = this.lstMobileNumbers[intSelectedIndex].email;
      this.intCustomerId = this.lstMobileNumbers[intSelectedIndex].id;
      this.dctStatus.SMS = this.lstMobileNumbers[intSelectedIndex].sms;
      if (this.lstMobileNumbers[intSelectedIndex].salutation){
        this.strSalutation = this.lstMobileNumbers[intSelectedIndex].salutation.toUpperCase();
      }
      else{
        this.strSalutation = this.lstMobileNumbers[intSelectedIndex].salutation
      }
      
      this.dctStatus.MOBILESTATUS = true;
      this.getEnquiryHistory(this.intCustomerId);
      this.blnClicked = false;
      this.intSelectedIndex = 0;
      this.intStart = 0;
      this.intEnd = 4;
    } else {
      this.dctStatus.MOBILESTATUS = false;
      this.lstMobileNumbers = [];
    }
    // if(this.disableStatus){
    //   this.dctStatus.MOBILESTATUS = true;
    // }
    // else {
    //   this.dctStatus.MOBILESTATUS = false;
    // }
  }

  // addMobileData() {
  //   this.stockDetails = [];
  //   if (this.lstMobileData.length < 5) {
  //     this.lstMobileData.push({
  //       strBrand: '',
  //       strItem: '',
  //       fk_brand_id: 0,
  //       fk_item_id: 0,
  //       intQty: 1,
  //       vchr_color: '',
  //       vchr_spec: '',
  //       vchr_enquiry_status: 'NEW',
  //       dbl_estimated_amount: '',
  //       vchr_remarks: '',
  //       strStockBrand: '',
  //       strStockItem: '',
  //       lst_brands: [],
  //       lst_items: [], min: '', max: '', spec: false, info: false,
  //       lst_imei:[],
  //     outofstock:false,

  //     });
  //   }
  // }

  // addTablet() {
  //   this.stockDetails = [];
  //   if (this.lstTabletData.length < 5) {
  //     this.lstTabletData.push({
  //       strBrand: '',
  //       strItem: '',
  //       fk_brand_id: 0,
  //       fk_item_id: 0,
  //       intQty: 1,
  //       vchr_enquiry_status: 'NEW',
  //       dbl_estimated_amount: '',
  //       vchr_remarks: '',
  //       strStockBrand: '',
  //       strStockItem: '',
  //       lst_brands: [],
  //       lst_items: [], min: '', max: '', spec: false, info: false,
  //       lst_imei:[],
  //     outofstock:false,
  //     });
  //   }
  // }

  // addComputer() {
  //   this.stockDetails = [];
  //   if (this.lstComputerData.length < 5) {
  //     this.lstComputerData.push({
  //       strBrand: '',
  //       strItem: '',
  //       fk_brand_id: 0,
  //       fk_item_id: 0,
  //       intQty: 1,
  //       vchr_enquiry_status: 'NEW',
  //       dbl_estimated_amount: '',
  //       vchr_remarks: '',
  //       strStockBrand: '',
  //       strStockItem: '',
  //       lst_brands: [],
  //       lst_items: [], min: '', max: '', spec: false, info: false,
  //       lst_imei:[],
  //       outofstock:false,
  //     });
  //   }
  // }

  // addAccessories() {
  //   this.stockDetails = [];
  //   if (this.lstAccessoriesData.length < 5) {
  //     this.lstAccessoriesData.push({
  //       strBrand: '',
  //       strItem: '',
  //       fk_brand_id: 0,
  //       fk_item_id: 0,
  //       intQty: 1,
  //       vchr_enquiry_status: 'NEW',
  //       dbl_estimated_amount: '',
  //       vchr_remarks: '',
  //       strStockBrand: '',
  //       strStockItem: '',
  //       lst_brands: [],
  //       lst_items: [], min: '', max: '', spec: false, info: false,
  //       lst_imei:[],
  //       outofstock:false,
  //     });
  //   }
  // }

  checkMobileAmount(index) {
    const min_str = 'Amount not in range';
    const max_str = 'Amount not in range';
    if ((Number(this.lstMobileData[index].dbl_estimated_amount)) > (Number(this.lstMobileData[index].max) * Number(this.lstMobileData[index].intQty))) {
      // this.snotifyService.error(max_str);
    } else if ((Number(this.lstMobileData[index].dbl_estimated_amount)) < (Number(this.lstMobileData[index].min * Number(this.lstMobileData[index].intQty)))) {
      // this.snotifyService.error(min_str);
    } else {
      this.lstMobileData[index].dbl_estimated_amount = this.lstMobileData[index].dbl_estimated_amount;
    }
  }
  checkTabletAmount(index) {
    const min_str = 'Amount not in range';
    const max_str = 'Amount not in range';

    if ((Number(this.lstTabletData[index].dbl_estimated_amount)) > (Number(this.lstTabletData[index].max) * Number(this.lstTabletData[index].intQty))) {
      // this.snotifyService.error(max_str);
    } else if ((Number(this.lstTabletData[index].dbl_estimated_amount)) < (Number(this.lstTabletData[index].min) * Number(this.lstTabletData[index].intQty))) {
      // this.snotifyService.error(min_str);
    } else {
      this.lstTabletData[index].dbl_estimated_amount = this.lstTabletData[index].dbl_estimated_amount;
    }
  }
  checkComputerAmount(index) {
    const min_str = 'Amount not in range';
    const max_str = 'Amount not in range';

    if ((Number(this.lstComputerData[index].dbl_estimated_amount)) > (Number(this.lstComputerData[index].max) * Number(this.lstComputerData[index].intQty))) {
      // this.snotifyService.error(max_str);
    } else if ((Number(this.lstComputerData[index].dbl_estimated_amount)) < (Number(this.lstComputerData[index].min * Number(this.lstComputerData[index].intQty)))) {
      // this.snotifyService.error(min_str);

    } else {
      this.lstComputerData[index].dbl_estimated_amount = this.lstComputerData[index].dbl_estimated_amount;
    }
  }
  checkAccessoriesAmount(index) {
    const min_str = 'Amount not in range';
    const max_str = 'Amount not in range';

    if ((Number(this.lstAccessoriesData[index].dbl_estimated_amount)) > (Number(this.lstAccessoriesData[index].max) * Number(this.lstAccessoriesData[index].intQty))) {
      // this.snotifyService.error(max_str);
    } else if ((Number(this.lstAccessoriesData[index].dbl_estimated_amount)) < (Number(this.lstAccessoriesData[index].min) * Number(this.lstAccessoriesData[index].intQty))) {
      // this.snotifyService.error(min_str);
    } else {
      this.lstAccessoriesData[index].dbl_estimated_amount = this.lstAccessoriesData[index].dbl_estimated_amount;
    }
  }

  checkMobileQty(index) {
    if (this.lstMobileData[index].lst_items.length === 0 || this.lstMobileData[index].lst_items.length > 1) {
      swal.fire({
        title: 'Error',
        text: 'Select Item before adding quantity',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      this.lstMobileData[index].intQty = '1';
    } else if ((Number(this.lstMobileData[index].intQty)) >= (Number(this.lstMobileData[index].lst_items[0]['stock']['int_available']))) {
      swal.fire({
        title: 'Error',
        text: 'Only Item quantity of ' + this.lstMobileData[index].lst_items[0]['stock']['int_available'] + ' is left.',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      this.lstMobileData[index].intQty = this.lstMobileData[index].lst_items[0]['stock']['int_available'];
    }
    if ((this.lstMobileData[index].dbl_estimated_amount >= (this.lstMobileData[index].min * this.lstMobileData[index].intQty)) &&
      (this.lstMobileData[index].dbl_estimated_amount <= (this.lstMobileData[index].max * this.lstMobileData[index].intQty))) {
      this.dbl_amount = this.lstMobileData[index].dbl_estimated_amount;
    } else {
      this.dbl_amount = this.lstMobileData[index].max;
    }
    this.lstMobileData[index].dbl_estimated_amount = this.dbl_amount * this.lstMobileData[index].intQty;
  }
  checkTabletQty(index) {
    if (this.lstTabletData[index].lst_items.length === 0 || this.lstTabletData[index].lst_items.length > 1) {
      swal.fire({
        title: 'Error',
        text: 'Select Item before adding quantity',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      this.lstTabletData[index].intQty = '1';
    } else if ((Number(this.lstTabletData[index].intQty)) >= (Number(this.lstTabletData[index].lst_items[0]['stock']['int_available']))) {
      swal.fire({
        title: 'Error',
        text: 'Only Item quantity of ' + this.lstTabletData[index].lst_items[0]['stock']['int_available'] + ' is left.',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      this.lstTabletData[index].intQty = this.lstTabletData[index].lst_items[0]['stock']['int_available'];
    }
    if ((this.lstTabletData[index].dbl_estimated_amount >= (this.lstTabletData[index].min * this.lstTabletData[index].intQty)) &&
      (this.lstTabletData[index].dbl_estimated_amount <= (this.lstTabletData[index].max * this.lstTabletData[index].intQty))) {
      this.dbl_amount = this.lstTabletData[index].dbl_estimated_amount;
    } else {
      this.dbl_amount = this.lstTabletData[index].max;
    }
    this.lstTabletData[index].dbl_estimated_amount = this.dbl_amount * this.lstTabletData[index].intQty;
  }
  checkComputerQty(index) {
    if (this.lstComputerData[index].lst_items.length === 0 || this.lstComputerData[index].lst_items.length > 1) {
      swal.fire({
        title: 'Error',
        text: 'Select Item before adding quantity',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      this.lstComputerData[index].intQty = '1';
    } else if ((Number(this.lstComputerData[index].intQty))
      >= (Number(this.lstComputerData[index].lst_items[0]['stock']['int_available']))) {
      swal.fire({
        title: 'Error',
        text: 'Only Item quantity of ' + this.lstComputerData[index].lst_items[0]['stock']['int_available'] + ' is left.',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      this.lstComputerData[index].intQty = this.lstComputerData[index].lst_items[0]['stock']['int_available'];
    }
    if ((this.lstComputerData[index].dbl_estimated_amount >= (this.lstComputerData[index].min * this.lstComputerData[index].intQty)) &&
      (this.lstComputerData[index].dbl_estimated_amount <= (this.lstComputerData[index].max * this.lstComputerData[index].intQty))) {
      this.dbl_amount = this.lstComputerData[index].dbl_estimated_amount;
    } else {
      this.dbl_amount = this.lstComputerData[index].max;
    }
    this.lstComputerData[index].dbl_estimated_amount = this.dbl_amount * this.lstComputerData[index].intQty;
  }
  checkAccessoriesQty(index) {
    if (this.lstAccessoriesData[index].lst_items.length === 0 || this.lstAccessoriesData[index].lst_items.length > 1) {
      swal.fire({
        title: 'Error',
        text: 'Select Item before adding quantity',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      this.lstAccessoriesData[index].intQty = '1';
    } else if ((Number(this.lstAccessoriesData[index].intQty))
      >= (Number(this.lstAccessoriesData[index].lst_items[0]['stock']['int_available']))) {
      swal.fire({
        title: 'Error',
        text: 'Only Item quantity of ' + this.lstAccessoriesData[index].lst_items[0]['stock']['int_available'] + ' is left.',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      this.lstAccessoriesData[index].intQty = this.lstAccessoriesData[index].lst_items[0]['stock']['int_available'];
    }
    if ((this.lstAccessoriesData[index].dbl_estimated_amount >= this.lstAccessoriesData[index].min * this.lstAccessoriesData[index].intQty) &&
      (this.lstAccessoriesData[index].dbl_estimated_amount <= this.lstAccessoriesData[index].max * this.lstAccessoriesData[index].intQty)) {
      this.dbl_amount = this.lstAccessoriesData[index].dbl_estimated_amount;
    } else {
      this.dbl_amount = this.lstAccessoriesData[index].max;
    }
    this.lstAccessoriesData[index].dbl_estimated_amount = this.dbl_amount * this.lstAccessoriesData[index].intQty;
  }
  // removeMobile(index) {
  //   this.stockDetails = [];
  //   this.filteredItems = [];
  //   this.lstMobileData.splice(index, 1);
  // }

  // removeTablet(index) {
  //   this.stockDetails = [];
  //   this.filteredItems = [];
  //   this.lstTabletData.splice(index, 1);
  // }

  // removeComputer(index) {
  //   this.stockDetails = [];
  //   this.filteredItems = [];
  //   this.lstComputerData.splice(index, 1);
  // }

  // removeAccessories(index) {
  //   this.stockDetails = [];
  //   this.filteredItems = [];
  //   this.lstAccessoriesData.splice(index, 1);
  // }

  // populateMobileBrand(i) {
  //   this.stockDetails = [];
  //   this.lstMobileData[i].lst_items = [];
  //   this.lstMobileData[i].strItem = '';
  //   if (this.lstMobileData[i].strBrand === '') {
  //     this.lstMobileData[i].lst_brands = [];
  //     this.lstMobileData[i].lst_items = [];
  //     this.lstMobileData[i].lst_stockDetails = [];
  //   } else if (this.lstMobileData[i].strBrand.length > 1) {
  //     const pushedItems = {};
  //     pushedItems['term'] = this.lstMobileData[i].strBrand;
  //     pushedItems['product'] = 'MOBILE';
  //     this.typeServ
  //       .searchSubcategoryByCat(pushedItems)
  //       .subscribe(
  //         (response: {
  //           status: string;
  //           data: Array<{
  //             account: string;
  //             accountId: number;
  //             accountCode: string;
  //           }>;
  //         }) => {
  //           this.lstMobileData[i].lst_brands = response.data;
  //           const tempData = this.lstMobileData[i].lst_brands.filter(x => x.name === this.lstMobileData[i].strBrand);
  //           if (tempData.length === 1) {
  //             this.lstMobileData[i].fk_brand_id = tempData[0]['id'];
  //           }
  //         }
  //       );
  //   }
  // }
  // populateMobileItem(i) {
  //   this.stockDetails = [];
  //   this.filteredItems = [];
  //   if (this.lstMobileData[i].strItem === '') {
  //     this.lstMobileData[i].lst_items = [];
  //     this.lstMobileData[i].lst_stockDetails = [];
  //     this.minPrice = 'N/A';
  //     this.maxPrice = 'N/A';
  //   } else if (this.lstMobileData[i].strItem.length > 3) {
  //     const selectedBrandRow = this.lstMobileData[i].lst_brands.filter(
  //       x => x.name === this.lstMobileData[i].strBrand.toString()
  //     );
  //     if (selectedBrandRow.length > 0) {
  //       const pushedItems = {};
  //       pushedItems['term'] = this.lstMobileData[i].strItem;
  //       pushedItems['brandId'] = selectedBrandRow[0].id;
  //       pushedItems['product'] = 'MOBILE';

  //       this.typeServ.searchItemBySub(pushedItems).subscribe(
  //         (response: {
  //           status: string;
  //           data: Array<{
  //             account: string;
  //             accountId: number;
  //             accountCode: string;
  //           }>;
  //         }) => {
  //           this.lstMobileData[i].lst_items = response.data;
  //           this.branchName = this.lstMobileData[i].strItem;
  //           const tempData = this.lstMobileData[i].lst_items.filter(x => x.name === this.lstMobileData[i].strItem);
  //           this.lstMobileData[i].outofstock = false;
  //           if (tempData.length === 1) {
  //             if (!('stock' in tempData[0])) {
  //               this.lstMobileData[i].lst_stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.filteredItems = Object.assign([], this.stockDetails);
  //               this.snotifyService.error('Item out of stock');

  //               this.lstMobileData[i].lst_items = tempData;
  //               this.lstMobileData[i].fk_item_id = tempData[0]['id'];
  //               // this.lstMobileData[i].strItem = '';
  //               this.lstMobileData[i].dbl_estimated_amount = '';
  //               this.lstMobileData[i].min = 'N/A';
  //               this.lstMobileData[i].max = 'N/A';
  //               this.lstMobileData[i].info = false;
  //               this.lstMobileData[i].spec = false;
  //               this.lstMobileData[i].outofstock = true;
  //             } else if (tempData[0]['stock']['int_available'] < 1) {
  //               this.snotifyService.error('Item out of stock');
  //               this.lstMobileData[i].lst_stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.stockDetails = this.lstMobileData[i].lst_stockDetails;
  //               this.filteredItems = Object.assign([], this.stockDetails);
  //               this.lstMobileData[i].lst_items = tempData;
  //               this.lstMobileData[i].fk_item_id = tempData[0]['id'];
  //               this.lstMobileData[i].strItem = '';
  //               this.lstMobileData[i].info = false;
  //               this.lstMobileData[i].outofstock = true;
  //             } else {
  //               this.lstMobileData[i].lst_items = tempData;
  //               this.lstMobileData[i].fk_item_id = tempData[0]['id'];
  //               this.lstMobileData[i].min =
  //                 tempData[0]['stock']['dbl_min_selling_price'];
  //               this.lstMobileData[i].max =
  //                 tempData[0]['stock']['dbl_max_selling_price'];
  //               this.lstMobileData[i].dbl_estimated_amount = tempData[0]['stock']['dbl_max_selling_price'];
  //               this.lstMobileData[i].info = true;
  //               this.lstMobileData[i].outofstock = false;
  //             }
  //             if ('spec' in tempData[0]) {
  //             this.dctMobileProductData = tempData[0]['spec'];
  //             this.lstMobileData[i].spec = true;
  //             }
  //           }
  //         },
  //         error => {
  //           this.lstMobileData[i].min = 'N/A';
  //           this.lstMobileData[i].max = 'N/A';
  //           this.lstMobileData[i].info = false;
  //           this.lstMobileData[i].outofstock = false;
  //         }
  //       );
  //     }
  //   }
  // }

  // populateTabletBrand(i) {
  //   this.lstTabletData[i].lst_items = [];
  //   this.lstTabletData[i].strItem = '';
  //   if (this.lstTabletData[i].strBrand === '') {
  //     this.lstTabletData[i].lst_brands = [];
  //     this.lstTabletData[i].lst_items =   [];
  //   } else if (this.lstTabletData[i].strBrand.length > 1) {
  //     const pushedItems = {};
  //     pushedItems['term'] = this.lstTabletData[i].strBrand;
  //     pushedItems['product'] = 'TABLET';
  //     this.typeServ
  //       .searchSubcategoryByCat(pushedItems)
  //       .subscribe(
  //         (response: {
  //           status: string;
  //           data: Array<{
  //             account: string;
  //             accountId: number;
  //             accountCode: string;
  //           }>;
  //         }) => {
  //           this.lstTabletData[i].lst_brands = response.data;
  //           const tempData = this.lstTabletData[i].lst_brands.filter(x => x.name === this.lstTabletData[i].strBrand);
  //           if (tempData.length === 1) {
  //             this.lstTabletData[i].fk_brand_id = tempData[0]['id'];
  //           }
  //         }
  //       );
  //   }
  // }

  // populateTabletItem(i) {
  //   this.stockDetails = [];
  //   this.filteredItems = [];
  //   if (this.lstTabletData[i].strItem === '') {
  //     this.lstTabletData[i].lst_items = [];
  //   } else if (this.lstTabletData[i].strItem.length > 3) {
  //     const selectedBrandRow = this.lstTabletData[i].lst_brands.filter(
  //       x => x.name === this.lstTabletData[i].strBrand.toString()
  //     );
  //     if (selectedBrandRow.length > 0) {
  //       const pushedItems = {};
  //       pushedItems['term'] = this.lstTabletData[i].strItem;
  //       pushedItems['brandId'] = selectedBrandRow[0].id;
  //       pushedItems['product'] = 'TABLET';
  //       this.typeServ
  //         .searchItemBySub(pushedItems)
  //         .subscribe(
  //           (response: {
  //             status: string;
  //             data: Array<{
  //               account: string;
  //               accountId: number;
  //               accountCode: string;
  //             }>;
  //           }) => {
  //             this.lstTabletData[i].lst_items = response.data;
  //             const tempData = this.lstTabletData[i].lst_items.filter(x => x.name === this.lstTabletData[i].strItem);
  //             this.branchName = this.lstTabletData[i].strItem;
  //           this.lstTabletData[i].outofstock = false;

  //           if (tempData.length === 1) {
  //             if (!('stock' in tempData[0])) {
  //               this.stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.filteredItems = Object.assign([], this.stockDetails);
  //               this.snotifyService.error('Item out of stock');

  //               this.lstTabletData[i].lst_items = [];
  //               // this.lstTabletData[i].strItem = '';
  //               this.lstTabletData[i].dbl_estimated_amount = '';
  //               this.lstTabletData[i].min = 'N/A';
  //               this.lstTabletData[i].max = 'N/A';
  //               this.lstTabletData[i].info = false;
  //               this.lstTabletData[i].spec = false;
  //           this.lstTabletData[i].outofstock = true;

  //             } else if (tempData[0]['stock']['int_available'] < 1) {
  //               this.stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.filteredItems = Object.assign([], this.stockDetails);
  //               this.snotifyService.error('Item out of stock');
  //               this.lstTabletData[i].lst_items = [];
  //               // this.lstTabletData[i].strItem = '';
  //               this.lstTabletData[i].info = false;
  //           this.lstTabletData[i].outofstock = true;

  //             } else {
  //               this.lstTabletData[i].lst_items = tempData;
  //               this.lstTabletData[i].fk_item_id = tempData[0]['id'];
  //               this.lstTabletData[i].min =
  //                 tempData[0]['stock']['dbl_min_selling_price'];
  //               this.lstTabletData[i].max =
  //                 tempData[0]['stock']['dbl_max_selling_price'];
  //               this.lstTabletData[i].dbl_estimated_amount = tempData[0]['stock']['dbl_max_selling_price'];
  //               this.lstTabletData[i].info = true;
  //           this.lstTabletData[i].outofstock = false;

  //             }
  //             if ('spec' in tempData[0]) {
  //               this.dctTabletProductData = tempData[0]['spec'];
  //               this.lstTabletData[i].spec = true;
  //             }
  //           }
  //         },
  //         error => {
  //           this.lstTabletData[i].min = 'N/A';
  //           this.lstTabletData[i].max = 'N/A';
  //           this.lstTabletData[i].info = false;
  //           this.lstTabletData[i].outofstock = false;

  //         }
  //         );
  //     }
  //   }
  // }

  // populateComputerBrand(i) {
  //   this.lstComputerData[i].lst_items = [];
  //   this.lstComputerData[i].strItem = '';
  //   if (this.lstComputerData[i].strBrand === '') {
  //     this.lstComputerData[i].lst_brands = [];
  //     this.lstComputerData[i].lst_items =  [];
  //   } else if (this.lstComputerData[i].strBrand.length > 1) {
  //     const pushedItems = {};
  //     pushedItems['term'] = this.lstComputerData[i].strBrand;
  //     pushedItems['product'] = 'COMPUTER';
  //     this.typeServ
  //       .searchSubcategoryByCat(pushedItems)
  //       .subscribe(
  //         (response: {
  //           status: string;
  //           data: Array<{
  //             account: string;
  //             accountId: number;
  //             accountCode: string;
  //           }>;
  //         }) => {
  //           this.lstComputerData[i].lst_brands = response.data;
  //           const tempData = this.lstComputerData[i].lst_brands.filter(x => x.name === this.lstComputerData[i].strBrand);
  //           if (tempData.length === 1) {
  //             this.lstComputerData[i].fk_brand_id = tempData[0]['id'];
  //           }
  //         }
  //       );
  //   }
  // }
  // populateComputerItem(i) {
  //   this.stockDetails = [];
  //   this.filteredItems = [];
  //   if (this.lstComputerData[i].strItem === '') {
  //     this.lstComputerData[i].lst_items = [];
  //   } else if (this.lstComputerData[i].strItem.length > 3) {
  //     const selectedBrandRow = this.lstComputerData[i].lst_brands.filter(
  //       x => x.name === this.lstComputerData[i].strBrand.toString()
  //     );
  //     if (selectedBrandRow.length > 0) {
  //       const pushedItems = {};
  //       pushedItems['term'] = this.lstComputerData[i].strItem;
  //       pushedItems['brandId'] = selectedBrandRow[0].id;
  //       pushedItems['product'] = 'COMPUTER';
  //       this.typeServ
  //         .searchItemBySub(pushedItems)
  //         .subscribe(
  //           (response: {
  //             status: string;
  //             data: Array<{
  //               account: string;
  //               accountId: number;
  //               accountCode: string;
  //             }>;
  //           }) => {
  //             this.lstComputerData[i].lst_items = response.data;
  //             const tempData = this.lstComputerData[i].lst_items.filter(x => x.name === this.lstComputerData[i].strItem);
  //             this.branchName = this.lstComputerData[i].strItem;
  //             this.lstComputerData[i].outofstock = false;
  //           if (tempData.length === 1) {
  //             if (!('stock' in tempData[0])) {
  //               this.stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.filteredItems = Object.assign([], this.stockDetails);
  //               this.snotifyService.error('Item out of stock');

  //               this.lstComputerData[i].lst_items = [];
  //               // this.lstComputerData[i].strItem = '';
  //               this.lstComputerData[i].dbl_estimated_amount = '';
  //               this.lstComputerData[i].min = 'N/A';
  //               this.lstComputerData[i].max = 'N/A';
  //               this.lstComputerData[i].info = false;
  //               this.lstComputerData[i].spec = false;
  //             this.lstComputerData[i].outofstock = true;

  //             } else if (tempData[0]['stock']['int_available'] < 1) {
  //               this.stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.filteredItems = Object.assign([], this.stockDetails);
  //               this.snotifyService.error('Item out of stock');

  //               this.lstComputerData[i].lst_items = [];
  //               // this.lstComputerData[i].strItem = '';
  //               this.lstComputerData[i].info = false;
  //             this.lstComputerData[i].outofstock = true;

  //             } else {
  //               this.lstComputerData[i].lst_items = tempData;
  //               this.lstComputerData[i].fk_item_id = tempData[0]['id'];
  //               this.lstComputerData[i].min =
  //                 tempData[0]['stock']['dbl_min_selling_price'];
  //               this.lstComputerData[i].max =
  //                 tempData[0]['stock']['dbl_max_selling_price'];
  //               this.lstComputerData[i].dbl_estimated_amount = tempData[0]['stock']['dbl_max_selling_price'];
  //               this.lstComputerData[i].info = true;
  //             this.lstComputerData[i].outofstock = false;

  //             }
  //             if ('spec' in tempData[0]) {
  //               this.dctComputerProductData = tempData[0]['spec'];
  //               this.lstComputerData[i].spec = true;
  //             }
  //           }
  //         },
  //         error => {
  //           this.lstComputerData[i].min = 'N/A';
  //           this.lstComputerData[i].max = 'N/A';
  //           this.lstComputerData[i].info = false;
  //           this.lstComputerData[i].outofstock = false;

  //         }
  //         );
  //     }
  //   }
  // }

  // populateAccessoriesBrand(i) {
  //   this.lstAccessoriesData[i].lst_items = [];
  //   this.lstAccessoriesData[i].strItem = '';
  //   if (this.lstAccessoriesData[i].strBrand === '') {
  //     this.lstAccessoriesData[i].lst_brands = [];
  //     this.lstAccessoriesData[i].lst_items = [];
  //   } else if (this.lstAccessoriesData[i].strBrand.length > 1) {
  //     const pushedItems = {};
  //     pushedItems['term'] = this.lstAccessoriesData[i].strBrand;
  //     pushedItems['product'] = 'ACCESSORIES';
  //     this.typeServ
  //       .searchSubcategoryByCat(pushedItems)
  //       .subscribe(
  //         (response: {
  //           status: string;
  //           data: Array<{
  //             account: string;
  //             accountId: number;
  //             accountCode: string;
  //           }>;
  //         }) => {
  //           this.lstAccessoriesData[i].lst_brands = response.data;
  //           const tempData = this.lstAccessoriesData[i].lst_brands.filter(x => x.name === this.lstAccessoriesData[i].strBrand);
  //           if (tempData.length === 1) {
  //             this.lstAccessoriesData[i].fk_brand_id = tempData[0]['id'];
  //           }
  //         }
  //       );
  //   }
  // }

  // populateAccessoriesItem(i) {
  //   this.stockDetails = [];
  //   this.filteredItems = [];
  //   if (this.lstAccessoriesData[i].strItem === '') {
  //     this.lstAccessoriesData[i].lst_items = [];
  //   } else if (this.lstAccessoriesData[i].strItem.length > 3) {
  //     const selectedBrandRow = this.lstAccessoriesData[i].lst_brands.filter(
  //       x => x.name === this.lstAccessoriesData[i].strBrand.toString()
  //     );
  //     if (selectedBrandRow.length > 0) {
  //       const pushedItems = {};
  //       pushedItems['term'] = this.lstAccessoriesData[i].strItem;
  //       pushedItems['brandId'] = selectedBrandRow[0].id;
  //       pushedItems['product'] = 'ACCESSORIES';
  //       this.typeServ
  //         .searchItemBySub(pushedItems)
  //         .subscribe(
  //           (response: {
  //             status: string;
  //             data: Array<{
  //               account: string;
  //               accountId: number;
  //               accountCode: string;
  //             }>;
  //           }) => {
  //             this.lstAccessoriesData[i].lst_items = response.data;
  //             this.branchName = this.lstAccessoriesData[i].strItem;
  //             const tempData = this.lstAccessoriesData[i].lst_items.filter(x => x.name === this.lstAccessoriesData[i].strItem);
  //             this.lstAccessoriesData[i].outofstock = false;
  //           if (tempData.length === 1) {
  //             if (!('stock' in tempData[0])) {
  //               this.stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.filteredItems = Object.assign([], this.stockDetails);
  //               this.snotifyService.error('Item out of stock');

  //               this.lstAccessoriesData[i].lst_items = [];
  //               // this.lstAccessoriesData[i].strItem = '';
  //               this.lstAccessoriesData[i].dbl_estimated_amount = '';
  //               this.lstAccessoriesData[i].min = 'N/A';
  //               this.lstAccessoriesData[i].max = 'N/A';
  //               this.lstAccessoriesData[i].info = false;
  //               this.lstAccessoriesData[i].spec = false;
  //             this.lstAccessoriesData[i].outofstock = true;

  //             } else if (tempData[0]['stock']['int_available'] < 1) {
  //               this.stockDetails = tempData[0]['stockInOthrBranch'];
  //               this.filteredItems = Object.assign([], this.stockDetails);
  //               this.snotifyService.error('Item out of stock');

  //               this.lstAccessoriesData[i].lst_items = [];
  //               // this.lstAccessoriesData[i].strItem = '';
  //               this.lstAccessoriesData[i].info = false;
  //             this.lstAccessoriesData[i].outofstock = true;

  //             } else {
  //               this.lstAccessoriesData[i].lst_items = tempData;
  //               this.lstAccessoriesData[i].fk_item_id = tempData[0]['id'];
  //               this.lstAccessoriesData[i].min =
  //                 tempData[0]['stock']['dbl_min_selling_price'];
  //               this.lstAccessoriesData[i].max =
  //                 tempData[0]['stock']['dbl_max_selling_price'];
  //               this.lstAccessoriesData[i].dbl_estimated_amount = tempData[0]['stock']['dbl_max_selling_price'];
  //               this.lstAccessoriesData[i].info = true;
  //             this.lstAccessoriesData[i].outofstock = false;

  //             }
  //             if ('spec' in tempData[0]) {
  //               this.dctAccessoriesProductData = tempData[0]['spec'];
  //               this.lstAccessoriesData[i].spec = true;
  //             }
  //           }
  //         },
  //         error => {
  //           this.lstAccessoriesData[i].min = 'N/A';
  //           this.lstAccessoriesData[i].max = 'N/A';
  //           this.lstAccessoriesData[i].info = false;
  //           this.lstAccessoriesData[i].outofstock = false;

  //         }
  //         );
  //     }
  //   }
  // }
  // MOBILE ITEM POPUP
  open(content, blnSpec) {
    if (blnSpec) {
      this.modal.open(content, { windowClass: 'mob-item' }).result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // MOBILE ITEM POPUP
  // SEARCH FOR BRANCH IN STOCK DETAILS
  filterItem() {
    this.stockDetails = Object.assign([], this.filteredItems);
    if (this.searchBranch === '') {
      this.stockDetails = Object.assign([], this.filteredItems);
    }
    this.stockDetails = Object.assign([], this.stockDetails).filter(
      item => item.branch.toLowerCase().indexOf(this.searchBranch.toLowerCase()) > -1
    )
    if (this.stockDetails === []) {
      this.stockDetails = Object.assign([], this.filteredItems);
    }
  }

  // ENQUIRY HISTORY
  getEnquiryHistory(intCustomerId) {
    const dctHistory = {};
    dctHistory['intCustomerId'] = intCustomerId;
    dctHistory['intCompanyId'] = this.companyId;
    this.serverService.postData('mobile/pending_enquiry_list_side/', dctHistory)
      .subscribe(
        (response) => {
          if (response['status'] == 1) {
            this.lstEnquiryHistory = response['data'][0];
            this.lstEnquiryHistoryMaster = response['data'];
            this.lstPages = Object.keys(this.lstEnquiryHistoryMaster).map(x => Number(x));
          }
        },
        (error) => {
        });
  }

  paginate(index) {
    this.lstEnquiryHistory = this.lstEnquiryHistoryMaster[index];
    this.intSelectedIndex = index;
  }

  // Branch
  BranchChanged(item) {

    this.branchId = item.id;
    this.selectedBranch = item.name;
  }


  // naProductSpec(name){

  //   this.serverService.postData("reminder/calendar_list_reminder/",{ str_product:name })
  //   .subscribe(
  //     response => {

  //       if (response['status'] === 'success') {

  //       }
  //     },
  //     (error) => {
  //     });

  // }
  naStockProduct(name, index, product) {


    this.dctProductDetails[name][index]['specification'] = {}

    for (let item of this.lstNaStockProduct[product]) {

      this.dctProductDetails[name][index]['specification'][item] = '';


      // this.dctSpecification[name]={};
      // this.dctSpecification[name][item]='';
    }

  }
}

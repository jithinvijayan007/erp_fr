
import {debounceTime,  filter } from 'rxjs/operators';
import { Component,AfterViewInit, OnInit, Input,
  Output, EventEmitter, HostListener, ViewChild , ElementRef, OnChanges  } from '@angular/core';
import { ServerService } from 'src/app/server.service';
// import { interval } from 'rxjs/observable/interval';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/global.service';
import swal from 'sweetalert2';
import { TypeaheadService } from 'src/app/typeahead.service';
import { FormControl, Validators} from '@angular/forms';
// import {  } from '@angular/forms';
// import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';


import { ChatService } from '../../chat.service';
@Component({
  moduleId: module.id,
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
  })
export class NavbarComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('calculatordisplay') firstNameElement: ElementRef;

  target = '_blank';
  @Input() title: string;
  @Input() openedSidebar = false;
  @Input() type: String = '*';
  @Input() color: String = '';
  @Output() sidebarState = new EventEmitter();
  blnManual = true;
  userName = localStorage.getItem('username');
  userCode = (localStorage.getItem('usercode')) ? localStorage.getItem('usercode') : '----';
  userFullName = localStorage.getItem('userFullName');
  companyId = localStorage.getItem('companyId')
  previousUrl = localStorage.getItem('previousUrl');
  companyType = localStorage.getItem('company_type');
  user_permission = JSON.parse(localStorage.getItem('permission'));
  blnViewCustomerSearch = true;
  blnViewEnquirySearch = true;
  intReminderCount = 0;
  lstReminderNotification = [];
  intPendingEnquiryCount = 0;
  lstUniversalTime = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], []];
  selectedTimeZone = null;
  refreshId;
  ImageLocation = '';
  message;
  lstNotifications = [];
  // private chart1: AmChart;
  // private chart2: AmChart;

  dctEents: any;
  pereviosuUrl: string;
  operation = '';
  result = '';
  blnResult = false;

  enquiryNumber = null;
  customerNumber = '';


  lstMobileNumbers = [];
  searchMobile: FormControl = new FormControl( []);
  strCustomerId;

  constructor(
    public router: Router,
    private serverService: ServerService,
    private dataService: DataService,
    private typeServ: TypeaheadService,
    public chatService: ChatService,
  ) {
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => {
        this.dctEents = e;
        this.pereviosuUrl = this.dctEents.url;
        localStorage.setItem('previousUrl', this.pereviosuUrl);
      });
  }

  ngOnInit() {
    if (this.router.url === '/crm/manual') {
      this.blnManual = false;
    } else {
      this.blnManual = true;
    }
    this.checkPermission();
    this.getMobileTypehead();
    this.notifyPendingEnquiry();
    this.notifyReminder();
    this.dataService.UserName.subscribe(name => {
      if (name) {
        this.userFullName = name;
      }
    });
    this.dataService.UserImage.subscribe(url => {
      if (url) {
        this.ImageLocation = url;
      }
    });
    this.dataService.currentEnquiryNotification.subscribe(flag => {
      if (flag) {

        this.notifyPendingEnquiry();
        this.dataService.pendingEnquiryNotification('')
      }
    })

    if (this.userFullName !== 'Admin') {
      this.getImage();
      this.refreshId = setInterval(() => {
        if (localStorage.getItem('reminderStatus')) {
          this.notifyReminder();
          localStorage.removeItem('reminderStatus');
        }
      }, 1000);
    }
  }
  ngOnChanges() {
    if (this.router.url === '/crm/manual') {
      this.blnManual = false;
    } else {
      this.blnManual = true;
    }
  }
  checkPermission() {
    const customer_search = this.user_permission.filter(x => x.NAME === 'PENDING ENQUIRIES');
    const enquiry_search = this.user_permission.filter(x => x.NAME === 'ENQUIRY');
    this.blnViewCustomerSearch = customer_search[0]['VIEW'];
    this.blnViewEnquirySearch = enquiry_search[0]['VIEW'];
  }
  // calculator strat here

  append(element: string) {
    if (this.blnResult) {
      if (
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(element) > 0
      ) {
        this.clear();
      }
      this.blnResult = !this.blnResult;
    }
    this.operation += element;
    this.firstNameElement.nativeElement.focus();
  }

  undo() {
    if (this.operation !== '') {
      this.operation = this.operation.slice(0, -1);
    }
    this.firstNameElement.nativeElement.focus();
  }

  clear() {
    this.operation = '';
    this.firstNameElement.nativeElement.focus();
  }

  evaluate() {
    try {
      // tslint:disable-next-line:no-eval
      this.operation = eval(this.operation);
      this.blnResult = true;
    } catch (e) {
    }
    this.firstNameElement.nativeElement.focus();
  }
  // calculator end here

  notifyReminder() {
    const userId = localStorage.getItem('userId');
    let data = {};
    if (userId !== '0') {
      data = { user_id: localStorage.getItem('userId') };
    }
    // this.serverService.notifyReminder(JSON.stringify(data)).subscribe(
    //   response => {
    //     this.lstReminderNotification = response['data'];
    //     this.intReminderCount = this.lstReminderNotification.length;

    //     for (const item of this.lstReminderNotification) {
    //       const remind: any = new Date(item.dat_reminder);
    //       const now: any  = new Date();
    //       if (remind > now) {
    //         // let ms:any = remind - now;
    //         setTimeout(function () {
    //           swal({
    //             title: item.vchr_title,
    //             text: item.vchr_description,
    //             type: 'warning',
    //             confirmButtonText: 'Ok',
    //           });
    //         }, (remind - now))
    //       }
    //     }
    //   },
    //   error => {}
    // );

    //edited

    this.serverService.postData("reminder/notify_reminder/",data).subscribe(
      response => {
        this.lstReminderNotification = response['data'];
        this.intReminderCount = this.lstReminderNotification.length;

        for (const item of this.lstReminderNotification) {
          const remind: any = new Date(item.dat_reminder);
          const now: any  = new Date();
          if (remind > now) {
            // let ms:any = remind - now;
            setTimeout(function () {
              swal.fire({
                title: item.vchr_title,
                text: item.vchr_description,
                type: 'warning',
                confirmButtonText: 'Ok',
              });
            }, (remind - now))
          }
        }
      },
      error => {}
    );
  }

  notifyPendingEnquiry() {
    const userId = localStorage.getItem('userId');
    let data = {};
    if (userId !== '0') {
      data = { user_id: localStorage.getItem('userId') };
    }
    // this.serverService.notifyPendingEnquiry(JSON.stringify(data)).subscribe(
    //   response => {
    //     this.intPendingEnquiryCount = response['data'];
    //     // this.intReminderCount = this.lstReminderNotification.length;
    //   },
    //   error => {}
    // );

    //edited

    this.serverService.postData("notifications/notify_pending_enquiry/",data).subscribe(
      response => {
        this.intPendingEnquiryCount = response['data'];
        if (response['status'] != 0) {
          let lstnotify = response['notification_data']
          if (localStorage.getItem('group_name') != 'superuser') {
            lstnotify.map((x) => {
              this.lstNotifications.push(x)
            })
            this.intReminderCount += lstnotify.length;
          }
          
          // this.intReminderCount = this.lstReminderNotification.length;
        }
      },
      error => {}
    );
  }
  getImage() {
    const userId = localStorage.getItem('userId');
    // this.serverService
    //   .getUserImage(JSON.stringify({ user_id: userId }))
    //   .subscribe(
    //     response => {
    //       const data = response;
    //       this.ImageLocation = 'assets/content/avatar.png';
    //       if (data['status'] === 'success') {
    //         this.ImageLocation =  this.serverService.hostAddress +  'static/' + data['data'][0]['vchr_profile_pic'];

    //         // this.intReminderCount = this.lstReminderNotification.length;
    //       }
    //     },
    //     error => {}
    //   );

      //edited

      this.serverService
      .postData("user/get_image/",{ user_id: userId })
      .subscribe(
        response => {
          const data = response;
          this.ImageLocation = 'assets/content/avatar.png';
          if (data['status'] === 1) {
            this.ImageLocation =  this.serverService.hostAddress +  'static/' + data['data'][0]['vchr_profile_pic'];

            // this.intReminderCount = this.lstReminderNotification.length;
          }
        },
        error => {}
      );
  }
  open(event) {
    const clickedComponent = event.target.closest('.nav-item');
    const items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    clickedComponent.classList.add('opened');

    this.firstNameElement.nativeElement.focus();
  }

  close(event) {
    const clickedComponent = event.target;
    const items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  openSidebar() {
    this.openedSidebar = !this.openedSidebar;
    this.sidebarState.emit();
  }
  onLoggedout() {
    const username = localStorage.getItem('username')
    this.chatService.signout();
    clearInterval(this.refreshId);
    localStorage.getItem('isLoggedin');
    sessionStorage.removeItem('isLoggedin');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('Tokeniser');
    localStorage.removeItem('username');
    localStorage.removeItem('permission');
    localStorage.removeItem('staff');
    localStorage.removeItem('userId');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('group_name');
    localStorage.removeItem('companyId');
    localStorage.removeItem('usercode');
    sessionStorage.clear();
    localStorage.clear();
  }

  validate(event) {
    if (event.key === 'Enter') {
      this.evaluate();
    } else if (
      /^[a-z A-Z @ ! # $ ^ ~  & % _ ; ' "  > < , \ ]/g.test(event.key)
    ) {
      return false;
    }
  }
  reminderRedirect(event) {
    // this.open(event);
    this.router.navigate(['/crm/listreminder']);
  }

  enquirySearch(enquiryNumber) {
    if (enquiryNumber) {
      enquiryNumber = String(enquiryNumber).trim()
    }
    if (!enquiryNumber) {
      swal.fire('Warning', 'Please provide enquiry number ', 'warning')
    }
    if (!this.companyId) {
      swal.fire('Warning', 'Company details not match.Please log in again. ', 'warning')
      return false
    }
    if (enquiryNumber && this.companyId) {

      // swal('','','')
      const data = {
        enquiry_number: enquiryNumber.trim(),
        company_id: this.companyId
      }
      // this.serverService.getEnquiryId(data).subscribe(
      //   (response) => {
      //     if (response['status'] === 'success' ) {

      //       localStorage.setItem('enqid', response['data'])
      //       this.enquiryNumber = null
      //       // document.getElementById('searchEnquiry').innerHTML = ''
      //       if (['/crm/viewlead', '/crm/viewmobilelead']
      //         .indexOf(localStorage.getItem('previousUrl')) > -1 ) {
      //         localStorage.setItem('enquirySearch', '1')
      //         this.router.navigate(['/crm/blank']);
      //       } else {
      //         if (this.companyType === 'MOBILE') {
      //           this.router.navigate(['/crm/viewmobilelead']);
      //         } else {
      //           this.router.navigate(['/crm/viewlead']);
      //         }
      //       }
      //     } else {
      //       swal('Sorry', 'No record found with enquiry number ' + enquiryNumber, 'error')
      //     }
      //   },
      //   (error) => {

      //   }
      // )

      //edited
      if (enquiryNumber.toUpperCase().substring(0, 2) === 'NA') {
        const pusheditems = {
          enquiry_number: enquiryNumber.trim(),
          company_id: this.companyId,
          naenq: true
        }
        this.serverService.postData("enquiry/get_enquiry_id/", pusheditems).subscribe(
          (response) => {
            if (response['status'] === 1) {

              localStorage.setItem('naenquiryviewid', response['data'])
              this.enquiryNumber = null
              // document.getElementById('searchEnquiry').innerHTML = ''
              if (['/crm/viewnaenquiry']
                .indexOf(localStorage.getItem('previousUrl')) > -1) {
                localStorage.setItem('naEnquirySearch', '1')
                this.router.navigate(['/crm/blank']);
              } else {
                if (this.companyType === 'MOBILE') {
                  this.router.navigate(['/crm/viewnaenquiry']);
                } 
              }
            } else {
              swal.fire('Sorry', 'No record found with enquiry number ' + enquiryNumber, 'error')
            }
          },
          (error) => {

          }
        )
      }
      else {
      this.serverService.postData("enquiry/get_enquiry_id/",data).subscribe(
        (response) => {
          if (response['status'] === 1 ) {

            localStorage.setItem('enqid', response['data'])
            this.enquiryNumber = null
            // document.getElementById('searchEnquiry').innerHTML = ''
            if (['/crm/viewlead', '/crm/viewmobilelead']
              .indexOf(localStorage.getItem('previousUrl')) > -1 ) {
              localStorage.setItem('enquirySearch', '1')
              this.router.navigate(['/crm/blank']);
            } else {
              if (this.companyType === 'MOBILE') {
                this.router.navigate(['/crm/viewmobilelead']);
              } else {
                this.router.navigate(['/crm/viewlead']);
              }
            }
          } else {
            swal.fire('Sorry', 'No record found with enquiry number ' + enquiryNumber, 'error')
          }
        },
        (error) => {

        }
      )
    }
    }



  }

  pendingEnquirySearch(customerNumber) {

    if (!this.strCustomerId) {
      swal.fire('Warning', 'Please provide customer mobile number ', 'warning')
    }
    if (!this.companyId) {
      swal.fire('Warning', 'Company details not match.Please log in again. ', 'warning')
      return false
    }

    if (customerNumber && this.companyId) {

      // swal('','','')
      const data = {
        enquiry_number: String(customerNumber).trim(),
        company_id: this.companyId
      }
      localStorage.setItem('customerSearchId', this.strCustomerId)
      this.customerNumber = null
      if (localStorage.getItem('previousUrl') === '/crm/pendingenquiry') {
        localStorage.setItem('enquirySearch', '1')
        // this.cleardata()
        this.router.navigate(['/crm/blank']);
      } else {

        this.router.navigate(['/crm/pendingenquiry'])
      }
      // this.serverService.getEnquiryId(data)
      // .subscribe(
      //   (response) => {
      //     if(response['status'] == 'success' ) {
      //       // (response['data']);

      //       localStorage.setItem('enqid',response['data'])
      //       this.enquiryNumber = ''
      //       // document.getElementById('searchEnquiry').innerHTML = ''
      //       if(localStorage.getItem('previousUrl') == '/crm/viewlead') {
      //         localStorage.setItem('enquirySearch', '1')
      //         this.router.navigate(['/crm/blank']);
      //       } else {

      //         this.router.navigate(['/crm/viewlead']);
      //       }
      //     } else {
      //       swal('Sorry','No record found with enquiry number '+ enquiryNumber, 'error')
      //     }
      //   },
      //   (error) => {

      //   }
      // )
    }
  }

  // populateFields() {
  //   const intSelectedIndex = this.lstMobileNumbers.findIndex(
  //     elem => elem.mobile === this.customerNumber
  //   );
  //   if (intSelectedIndex > -1) {
  //     // this.strFirstName = this.lstMobileNumbers[intSelectedIndex].fname;
  //     // this.strLastName = this.lstMobileNumbers[intSelectedIndex].lname;
  //     // this.strCustomerType = this.lstMobileNumbers[
  //     //   intSelectedIndex
  //     // ].customertype;
  //     // this.strEmailAddress = this.lstMobileNumbers[intSelectedIndex].email;
  //     // this.intCustomerId = this.lstMobileNumbers[intSelectedIndex].id;
  //     // this.dctStatus.SMS = this.lstMobileNumbers[intSelectedIndex].sms;
  //     // this.strSalutation = this.lstMobileNumbers[
  //       // intSelectedIndex
  //     // ].salutation.toUpperCase();
  //     // this.dctStatus.MOBILESTATUS = true;
  //   } else {
  //     // this.dctStatus.MOBILESTATUS = false;
  //     this.lstMobileNumbers = [];
  //   }
  // }

  populateFields() {
    const intSelectedIndex = this.lstMobileNumbers.findIndex(
      elem => elem.mobile === this.customerNumber
    );
    if (intSelectedIndex > -1) {
      this.strCustomerId = this.lstMobileNumbers[intSelectedIndex].id;

    } else {
      this.lstMobileNumbers = [];
    }
  }
  getMobileTypehead() {
    this.searchMobile.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {

        if (strData === undefined) {
        } else {
          if (strData && (strData.length > 3)) {
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
                  }>;
                }) => {
                  this.lstMobileNumbers.push(...response.data);
                }
              );
          }
        }
      });
  }
  cleardata() {
    this.searchMobile.reset();

  }

  removeOverlay(elem) {
    elem.classList.remove('opened');
    }
    get nativeWindow(): Window | Object {
      return window;
    }

    ngAfterViewInit() {
      // function called to recieve push notifictions
      this.chatService
      .recievePushNofitication()
      .subscribe((data: string) => {
          const datarecieved = data;
          this.lstNotifications.push(data);
          this.intReminderCount = this.intReminderCount + 1;
          });
    }

    navEnqList(notification,index) {
      this.lstNotifications.splice(index, 1)
      this.intReminderCount = this.intReminderCount - 1;
// updating the seen status of the notification
      this.serverService
      .postData("notifications/update_seen_status/", { pk_bint_id: notification['notification_id'] })
      .subscribe(
        response => {

        },
        error => {}
      );


      if (notification['str_notification_type'] == 'ENQUIRY') {

        localStorage.setItem('enqid', notification['str_doc_id']);
        // this.router.navigate([notification['url']]);
        if(localStorage.getItem('previousUrl') === '/crm/viewmobilelead'){
            localStorage.setItem('enquiryViewSearch', '1')
            this.router.navigate(['/crm/blank']);
        } else {
          this.router.navigate([notification['url']]);
        }
      } else {
        this.router.navigate([notification['url']]);
      }

      // this.intReminderCount = this.intReminderCount - this.lstNotifications.length
      // this.lstNotifications = [];
      // localStorage.setItem("blnShowOnlyBooked", 'true');
      // if(localStorage.getItem('previousUrl') === '/crm/enquirylist'){
      //   localStorage.setItem('enquirylistSearch', '1')
      //   this.router.navigate(['/crm/blank']);
      // }else{
      //   this.router.navigate([url]);
      // }
    }
}


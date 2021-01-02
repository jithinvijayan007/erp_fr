import { log } from 'util';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ServerService } from '../../server.service';
import { DataService } from '../../global.service';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit, OnInit {

  public config: PerfectScrollbarConfigInterface = {};
  userName = '';
  userEmail = '';
  public showSearch = false;


  blnClicked=false
  sidebarnavItems={};
  lstMainTitles =['white','white','white'];
  lstColor=[];

  constructor(private modalService: NgbModal,  public router: Router, private data: DataService,
    private serverService: ServerService,) {}

  // This is for Notifications
  notifications: Object[] = [
    {
      btn: 'btn-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      btn: 'btn-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      btn: 'btn-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      btn: 'btn-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
  onLoggedout() {
    localStorage.removeItem('Tokeniser');
    localStorage.removeItem('Name');
    localStorage.removeItem('Email');
  localStorage.setItem('previousUrl','/login/userlogin');
    
    this.router.navigate(['/login/userlogin']);
  }
  accountSettings(){
    this.router.navigate(['/user/changeuserpass'])
  }

  ngAfterViewInit() {
  }
  ngOnInit() {    
    this.userName = localStorage.getItem('Name');
    this.userEmail = localStorage.getItem('Email');

    if (!localStorage.getItem('Tokeniser')) {
      this.router.navigate(['/landing/landing1']);
    } else {
      this.serverService.getData('group_permissions/sidebar/').subscribe(
        result => {
         
          
          this.sidebarnavItems = result['data'];
          if (this.sidebarnavItems){
            this.lstMainTitles = Object.keys(this.sidebarnavItems)
            // console.log("%%%%this.lstMainTitles",this.lstMainTitles);
            // console.log("###localStorage.getItem('menuName')",localStorage.getItem('menuName'));
            
            this.menuClicked(localStorage.getItem('menuName'));
            // this.menuClicked("Transactions");

          }
         
        },
        (error) => {
          if (error.status === 401) {
            this.router.navigate(['/landing/landing1']);
          }
        });
    }
  }

  menuClicked(item){ 
    // console.log("@menuClicked item",item);
    // item='Transactions';
    // console.log("AFTER item",item);
    
    this.lstColor = Array<string>(this.lstMainTitles.length).fill('white')
    this.lstColor[this.lstMainTitles.indexOf(item)] ='#fe2419'
    this.data.changeSidebar(item)
    
  }
}

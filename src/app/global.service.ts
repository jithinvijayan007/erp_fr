import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private sidebarDataChange = new BehaviorSubject<any>(null);

  private messageSource = new BehaviorSubject<any[]>(null);
  private UsernameChange = new BehaviorSubject<string>(null);
  private UserImageChange = new BehaviorSubject<string>(null);
  private notificationEnquiry = new BehaviorSubject<string>(null);
  private changesCustomer = new BehaviorSubject<any[]>(null);
  private enquiryIdChange = new BehaviorSubject<string>(null);
  private menuGroupIdChange = new BehaviorSubject<string>(null);
  // private sidebarDataChange = new BehaviorSubject<string>(null);


  currentReminder = this.messageSource.asObservable();
  UserName = this.UsernameChange.asObservable();
  UserImage = this.UserImageChange.asObservable();
  currentEnquiryNotification = this.notificationEnquiry.asObservable();
  customerlst = this.changesCustomer.asObservable();
  enquiryId = this.enquiryIdChange.asObservable();
  menuGroupId = this.menuGroupIdChange.asObservable();
  sidebarData = this.sidebarDataChange.asObservable();

  // sidebarData = this.sidebarDataChange.asObservable();
  

  
  constructor() { }

  // Sidebar
  changeSidebar(sidebarData: string) {
    // console.log("###sidebarData",sidebarData);
    // console.log("$$$$$this.sidebarDataChange",this.sidebarDataChange);
    

    this.sidebarDataChange.next(sidebarData)

    // console.log("$$$$$$$$$$this.sidebarDataChange.value",this.sidebarDataChange.value);
    
  } 
  changeCustomer(customerlst: any[]) {
    this.changesCustomer.next(customerlst)
  }


  changeData(message: any[]) {
    this.messageSource.next(message)
  }
  changeUserName(name: string) {
    this.UsernameChange.next(name)
  }
  changeUserImage(path: string) {
    this.UserImageChange.next(path)
  }
  pendingEnquiryNotification(flag: string) {
    this.notificationEnquiry.next(flag)
  }
  changeEnquiryId(enquiryid) {
    this.enquiryIdChange.next(enquiryid);
  }
  // Menu group
  changeMenuGroupId(id) {
    this.menuGroupIdChange.next(id)
  }
  // Sidebar
  // changeSidebar(sidebarData) {
  //   this.sidebarDataChange.next(sidebarData)
  // } 

}
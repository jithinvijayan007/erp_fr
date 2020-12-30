import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private sidebarDataChange = new BehaviorSubject<any>(null);


  sidebarData = this.sidebarDataChange.asObservable();
  

  
  constructor() { }

  // Sidebar
  changeSidebar(sidebarData: string) {
    // console.log("###sidebarData",sidebarData);
    // console.log("$$$$$this.sidebarDataChange",this.sidebarDataChange);
    

    this.sidebarDataChange.next(sidebarData)

    // console.log("$$$$$$$$$$this.sidebarDataChange.value",this.sidebarDataChange.value);
    
  } 

}
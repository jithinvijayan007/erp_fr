import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { MainMenuItem } from './main-menu-item';
import { MainMenuService } from './main-menu.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'main-menu',
  templateUrl: 'main-menu.component.html',
  styleUrls: ['main-menu.component.scss'],
  providers: [MainMenuService]
})
export class MainMenuComponent implements OnInit {
  mainMenuItems: MainMenuItem[];
  staff = localStorage.getItem('staff');
  group_name = localStorage.getItem('group_name').toLowerCase();
  company_type = localStorage.getItem('company_type');
  constructor(private mainMenuService: MainMenuService, private serverService: ServerService, public router: Router) {}
  getMainMenuItems(): void {
    this.mainMenuService.getMainMenuItems().then(mainMenuItems => {
      this.mainMenuItems = mainMenuItems;
    }
  );
}

  ngOnInit(): void {
    if (!localStorage.getItem('Tokeniser')) {
      this.router.navigate(['/user/landing']);
    } else {

      this.serverService.getData('user_groups/api_sidebar/').subscribe(
        result => {
          this.mainMenuItems = result['data'];
          // console.log("xcv",this.mainMenuItems);
          
        },
        (error) => {
          if (error.status === 401) {
            this.router.navigate(['/user/landing']);
          }
        });
    }

    // this.getMainMenuItems();
    if (this.staff) {
      this.staff = this.staff.toLowerCase();
    }
  }
  toggle(event: Event, item: any, el: any) {
    event.preventDefault();
    const items: any[] = el.mainMenuItems;
    if (item.active) {
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;
      }
      item.active = false;
    } else {
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;
      }
      item.active = true;
    }
  }
}

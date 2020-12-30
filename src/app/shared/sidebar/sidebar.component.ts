import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullComponent } from 'src/app/layouts/full/full.component';
import { ServerService } from '../../server.service';
import { DataService } from '../../global.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];
  // this is for the open close
  mainMenuItems

  mainCategoryClicked;
  dctData = {}


  addExpandClass(element: any) {

    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {

    // navigation toggle customization (remove())
    this.fullObject.isNav = 1

    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  constructor(

    private serverService: ServerService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private fullObject: FullComponent,
    private data:DataService,
  ) {}

  // End open close
  ngOnInit() {
    // console.log("##########@sidebar");
    
    this.data.sidebarData.subscribe(message => {
      if (message && this.dctData.hasOwnProperty(this.mainCategoryClicked)) {
        this.mainCategoryClicked = message;
        this.sidebarnavItems = this.dctData[this.mainCategoryClicked];
      }
    })
    
    // this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);

    // if (!localStorage.getItem('Tokeniser')) {
    //   this.router.navigate(['/user/landing']);
    // } else {

      this.serverService.getData('group_permissions/sidebar/').subscribe(
        result => {
          this.dctData = result['data']
          this.mainCategoryClicked = [localStorage.getItem('menuName')]
          // console.log("##this.mainCategoryClicked",this.mainCategoryClicked);
          
          this.sidebarnavItems = result['data'][this.mainCategoryClicked];
        },
        (error) => {
          if (error.status === 401) {
  localStorage.setItem('previousUrl','/login/userlogin');
            
            this.router.navigate(['/login/userlogin']);
          }
        });
    // }

    
  }
}

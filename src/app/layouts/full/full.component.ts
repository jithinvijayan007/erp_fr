
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { log } from 'util';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';

import swal from 'sweetalert2';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

  // Footer nav 
    blnOpen = false;
    blnShow = false
  // Footer nav end

  public config: PerfectScrollbarConfigInterface = {};

  modelopen;;


  lstItemName = []
  IntItemNameId=0;
  strItemName = '';
  lstFilterData=[]
  selectedItemName;
  searchItemName: FormControl = new FormControl();

  dctData = {};

  intItemMopPrice = 0;
  intItemMrpPrice = 0;
  blnItemShow = false;

  constructor(public router: Router,
    public modalService: NgbModal,
    public serviceObject :ServerService,
    private toastr: ToastrService) { }

  // Footer nav 
    handler() {
      this.blnOpen = !this.blnOpen;
    }
    
    handler1(){
      this.blnOpen = false;
    }

  // Footer nav end
  
  branchName = localStorage.getItem('BranchName');
  time = new Date();

  tabStatus = 'justified';

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;
  blnfooter=false
  public blnInvoice = 0
  public isNav = 0
  lstGroup=["BRANCH MANAGER","ASSISTANT BRANCH MANAGER","ASM2","ASM3","ASM4","PURCHASE MANAGER","ADMIN"]
  strGroupname = localStorage.getItem("group_name")

  options = {
    theme: 'light', // two possible values: light, dark
    dir: 'ltr', // two possible values: ltr, rtl
    layout: 'vertical', // fixed value. shouldn't be changed.
    sidebartype: 'full', // four possible values: full, iconbar, overlay, mini-sidebar
    sidebarpos: 'fixed', // two possible values: fixed, absolute
    headerpos: 'fixed', // two possible values: fixed, absolute
    boxed: 'full', // two possible values: full, boxed
    navbarbg: 'skin5', // six possible values: skin(1/2/3/4/5/6)
    sidebarbg: 'skin4', // six possible values: skin(1/2/3/4/5/6)
    logobg: 'skin5' // six possible values: skin(1/2/3/4/5/6)
  };

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    // update time 
    setInterval(() => {
      this.time = new Date();
   }, 1000);

   
    this.blnInvoice = 0
    this.isNav = 0

    if (this.router.url === '/') {
    localStorage.setItem('previousUrl','/dashboard/classic');
      
      this.router.navigate(['/dashboard/classic']);
    }
    this.defaultSidebar = this.options.sidebartype;
    
    if (String(this.router.url) == '/invoice/invoiceview'){
      this.defaultSidebar = 'mini-sidebar';
      this.options.sidebartype = 'mini-sidebar';
    }
    this.handleSidebar();
    
    this.searchItemName.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemName = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('itemcategory/item_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstItemName = response['data'];

              }
            );
          }
        }
      }
    );

        
    if(this.lstGroup.includes(this.strGroupname)){
      this.blnfooter=true
    }
    else{
       this.blnfooter=false
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    
    if (String(this.router.url) == '/invoice/invoiceview'){
      this.defaultSidebar = 'mini-sidebar';
      this.options.sidebartype = 'mini-sidebar';
    }
    this.handleSidebar();
    
  }

  @HostListener('click', ['$event.target']) onClick(btn) {

    if (this.isNav == 1){
      if (this.blnInvoice == 1){
        this.blnInvoice = 0
        this.isNav = 0
        this.options.sidebartype = 'mini-sidebar';
        this.toggleSidebarType()
      }
    }    
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case 'full':
      case 'iconbar':
        if (this.innerWidth < 1170) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      case 'overlay':
        if (this.innerWidth < 767) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  toggleSidebarType() {
    if(this.blnInvoice == 1){
      this.options.sidebartype = 'full';
      this.isNav == 0
    }

    switch (this.options.sidebartype) {

      case 'full':
      case 'iconbar':
        this.options.sidebartype = 'mini-sidebar';
        break;

      case 'overlay':
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case 'mini-sidebar':
        if (this.defaultSidebar === 'mini-sidebar') {
          this.options.sidebartype = 'full';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  setInvoice(){
    this.blnInvoice = 1
    this.isNav = 0
    this.toggleSidebarType()
  }

  navigate(value){
    if(value=="lookup"){
    localStorage.setItem('previousUrl','/purchase/imeilookup');
      
      this.router.navigate(['/purchase/imeilookup']);
    }
    else if(value=="dsr"){
      // this.router.navigate(['/purchase/imeilookup']);
    }
    else if(value=="stock"){
    localStorage.setItem('previousUrl','/stock/list_branch_stock');
      
      this.router.navigate(['/stock/list_branch_stock']);
    }
    else if(value=="invoice"){
    localStorage.setItem('previousUrl','/invoice/invoiceprint');
      
      this.router.navigate(['/invoice/invoiceprint']);
    }
    else if(value=="loyalty"){
    localStorage.setItem('previousUrl','/loyaltycard/viewloyaltypoint');
      
      this.router.navigate(['/loyaltycard/viewloyaltypoint']);
    }
    this.blnOpen = false
  }

  openimeipopup(imeipopup) {
  
  this.blnOpen = !this.blnOpen;    

  this.intItemMopPrice = 0;
  this.intItemMrpPrice = 0;
  this.blnItemShow = false;
  this.IntItemNameId = null;;
  this.strItemName = '';
  this.selectedItemName = '';

   
    
    this.modelopen = this.modalService.open(imeipopup, { centered: true, size: 'lg' ,keyboard : false});
  } 

  closePricePopUp() {

    this.modelopen.close();
   
  }


  itemNameChanged(item)
   {
    this.IntItemNameId = item.id;
    this.strItemName = item.code_name;
    this.selectedItemName = item.code_name;
  }

  searchItem(){

    if(this.strItemName == ''){
      this.toastr.error('Valid Item Name is required', 'Error!');
      return false;
    }
    else if(this.strItemName && (this.strItemName != this.selectedItemName)){
      this.toastr.error('Valid Item Name is required', 'Error!');
      return false;
    }

    
    let dctData = {};

    dctData['itemid'] = this.IntItemNameId;
   
    this.serviceObject.postData('itemcategory/itemmopmrp/',dctData).subscribe(
      (response) => {
          if (response.status == 1) {

           this.intItemMopPrice = response['data']['dbl_mop'];
           this.intItemMrpPrice = response['data']['dbl_mrp'];

           this.blnItemShow = true;
           
          
          }
          else if (response.status == 0) {
            swal.fire('Error!',response['data'], 'error');
          }
      },
      (error) => {
        swal.fire('Error!','Something went wrong!!', 'error');
      });

  }

  ngOnDestroy() {
   
    if(this.modelopen){
      this.modelopen.close();
      }
    }

}

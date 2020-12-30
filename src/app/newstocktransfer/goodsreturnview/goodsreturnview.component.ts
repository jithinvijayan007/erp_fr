import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, HostListener } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-goodsreturnview',
  templateUrl: './goodsreturnview.component.html',
  styleUrls: ['./goodsreturnview.component.css']
})
export class GoodsreturnviewComponent implements OnInit {

  lstCustom=[];

  heading;
  data=[
    {
      "Name": "HAVELLS RUBY GLACE DRY IRON 750 W:HAVELLS:ACC BGN",
      "Header": "Batch",
      "ItemCode": "ABGN02995",
      "Qty": 2,
      "Imei/Batch": [
          {
              "imei": ['ABGN0299510001'],
              "qty": 2
          }
      ]
  },
  {
      "Name": "IMPEX CLASSIC 5.1 MULTIMEDIA SPEAKER IMPEX ACC BGN",
      "Header": "Batch",
      "ItemCode": "ABGN00583",
      "Qty": 2,
      "Imei/Batch": [
          {
              "imei": ['ABGN0058310001'],
              "qty": 2
          }
      ]
  },
  {
    "Name": "NEW CLASSIC 5.1 MULTIMEDIA SPEAKER IMPEX ACC BGN",
    "Header": "IMEI",
    "ItemCode": "DDDD00583",
    "Qty": 1,
    "Imei/Batch": [
        {
            "imei": ['ABGN0058310001'],
            "qty": 1
        }
    ]
  }
  ];

  lstImei=[];
  
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
     
      custom: this.lstCustom,
      position: 'right'
   
    },
   
    columns: {
      ItemCode: {
        title: 'Item Code',
      },
      Name: {
        title: 'Item Name.',
      },
      Qty: {
        title: 'Qty',
      },
    },
    pager:{
      display:true,
      perPage:500
      }
  };

  lstPermission=JSON.parse(localStorage.group_permissions)
  
  source;

  datFrom;
  datTo;
  lstBranch=[];

  blnView = false;

  lstItems=[];
  showModal;

  blnShowData=false;

  groupName=localStorage.group_name

  branchType=localStorage.BranchType;

  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router,
    ) {
    this.source = new LocalDataSource(this.data)  }

  ngOnInit() {
    this.lstCustom=[{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},]
   
    this.settings.actions.custom = this.lstCustom;  

    if(history.state.data){ //passing filters data from goods return list
      this.datFrom=history.state.data['datFrom'];
      this.datTo=history.state.data['datTo'];
      this.lstBranch=history.state.data['branch'];
    }
    
    this.getData();
  }

  getData(){
    let dctData={
      'Id':localStorage.getItem('goodsReturnId')
    };


    this.spinnerService.show();

    this.serviceObject.putData('goods_return/goods_list/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();
        // this.blnShowData=true;
          if (response.status == 1)
          {
            this.data=response['data'];

            if(this.data.length>0){
              this.blnShowData=true;
             this.source = new LocalDataSource(this.data); 
             }
             else{
              this.blnShowData=false;
             }
          }  
          else if (response.status == 0) 
          {
           swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => { 
        this.spinnerService.hide();
       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }

  onCustomAction(event,imeipopup)
  {
    this.showModal = this.modalService.open(imeipopup, { centered: true, size: 'sm' ,keyboard : false});
    this.heading=event.data['Header']
    this.lstImei=[];
    this.lstImei=event.data['Imei/Batch'];
  }

  ngOnDestroy() {
   
    if(this.showModal){
      this.showModal.close();
      }
  }

  @HostListener('window:popstate', ['$event']) //when click on back button
    onPopState(event) {      
      // localStorage.setItem('onlineDatFrom',this.datFrom);
      // localStorage.setItem('onlineDatTo',this.datTo);
      // Return filters to goods retun view
      this.router.navigateByUrl('transfer/goodsreturnlist',{state: {data: {datFrom:this.datFrom,datTo:this.datTo,branch:this.lstBranch}}});
    }
}

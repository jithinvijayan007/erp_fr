import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-goodsretunlist',
  templateUrl: './goodsretunlist.component.html',
  styleUrls: ['./goodsretunlist.component.css']
})
export class GoodsretunlistComponent implements OnInit {

  datStartDate;
  datEndDate;

 
  lstBranch=[]
  branchOptions=[]
  branchConfig = {displayKey:"vchr_name",search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'vchr_name',clearOnSelection: true  }


  data=[
    {
      "Date": "06-10-2020",
      "PurchaseNum": "GRNR-ACCE-3280081",
      "Branch": "DOA ACCESSORIES",
      "Qty": 1,
      "Id": 1
  },
  {
      "Date": "06-10-2020",
      "PurchaseNum": "GRNR-ACCE-3280082",
      "Branch": "DOA ACCESSORIES",
      "Qty": 1,
      "Id": 8
  },
  {
      "Date": "06-10-2020",
      "PurchaseNum": "GRNR-DHO-3780134",
      "Branch": "DOA HEAD OFFICE",
      "Qty": 8,
      "Id": 6
  }

  ];
  source;
  lstCustom=[];

  blnShowData=false;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
     
      custom: this.lstCustom,
      position: 'right'
   
    },
   
    columns: {
      Date: {
        title: 'Date',
      },
      PurchaseNum: {
        title: 'Goods Return No.',
      },
      Branch: {
        title: 'Branch',
      },
      Qty: {
        title: 'Total Qty',
      },
    },
    pager:{
      display:true,
      perPage:500
      }
  };

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnView=false;

  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    public router: Router,) {
    this.source = new LocalDataSource(this.data)  }

  ngOnInit() {

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "List Goods Return") {   
        this.blnView = item["VIEW"];
      }
    });

    // console.log("history.state.data",history.state.data);
    
    if(history.state.data){ //passing filters data from goods return view
      this.datStartDate=history.state.data['datFrom'];
      this.datEndDate=history.state.data['datTo'];
      this.lstBranch=history.state.data['branch'];
      history.state.data['datFrom']='';
      history.state.data['datTo']='';
      history.state.data['branch']='';
    }

    // if(localStorage.getItem('onlineDatFrom')){
    //   this.datStartDate=new Date(localStorage.getItem('onlineDatFrom'));
    //   this.datEndDate=new Date(localStorage.getItem('onlineDatTo'));
    //   // this.lstBranch=localStorage.getItem('branch');
    //   localStorage.setItem('onlineDatFrom','');
    //   localStorage.setItem('onlineDatTo','');
    // }
    else{
      this.datStartDate=new Date();
      this.datEndDate=new Date();
    }
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstCustom=[{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},]
   
    this.settings.actions.custom = this.lstCustom    
    this.getBranches();
    this.getData();
  }

  getBranches(){

    this.serviceObject.getData('stock_prediction/branchlist/').subscribe(
      (response) => {
          if (response.status == 1)
          { 
            this.branchOptions=response['lst_branch'];
          }              
          else if (response.status == 0) 
          {
           swal.fire('Error!',"ERROR", 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }

  getData(){
    let dctData={};

    dctData['datFrom'] =moment(this.datStartDate).format('YYYY-MM-DD');
    dctData['datTo']=moment(this.datEndDate).format('YYYY-MM-DD');
    dctData['branch']=this.lstBranch;

    this.spinnerService.show();

    this.serviceObject.postData('goods_return/goods_list/',dctData).subscribe(
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
           swal.fire('Error!',response['message'], 'error');
          }
      },
      (error) => { 
        this.spinnerService.hide();
       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }

  onCustomAction(event)
  {
    localStorage.setItem('goodsReturnId',event.data.Id);
    this.router.navigate(['transfer/goodsreturnview'], {state: {data: {datFrom:this.datStartDate,datTo:this.datEndDate,branch:this.lstBranch}}});
  }

}

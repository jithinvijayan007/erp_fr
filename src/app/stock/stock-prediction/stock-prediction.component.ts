import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2'
import { ServerService } from 'src/app/server.service';
import { Router } from '@angular/router';
import * as moment from 'moment'
import { LocalDataSource } from 'ng2-smart-table'
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
 @Component({
  selector: 'app-stock-prediction',
  templateUrl: './stock-prediction.component.html',
  styleUrls: ['./stock-prediction.component.css']
})
export class StockPredictionComponent implements OnInit {


  datTo;
  datFrom;

  selectedFrom;
  selectedTo;
  data = [];
  source;

  searchBranch: FormControl = new FormControl();
  searchItem: FormControl = new FormControl();

  @ViewChild('idBranch') idBranch: ElementRef;
  @ViewChild('itemId', { static: true }) itemId: ElementRef;




  lstBranch = []
  IntBranchId;
  strBranch='';
  selectedBranch=[];
  branchSelected=[]

  lstItem = []
  IntItemId;
  strItem='';
  selectedItem=[];
  itemSelected=[];

  intStockDays;

  settings = {


    rowClassFunction: (row) =>{
      if(row.data.bln_stock){
        return 'solved';
      }else {
        return 'aborted'
      }
    },
    hideSubHeader: true,

    actions: {
      add: false,
      edit: false,
      delete:false,
      // custom: [{ name: 'ourCustomAction', title: '<i class="ti-eye text-info m-r-10"></i>' }],
      position: 'right',

    },
    columns: {
      branch: {
        title: 'Branch',
        filter: false
      },
      item: {
        title: 'Item ',
        filter: false
      },
      avg_sale: {
        title: 'Average Sale',
        filter: false
      },
      current_stock:{
        title:'Current Stock',
        filter:false,
        position:'right'
      },
      stock_in_demand: {
        title: 'Stock In Demand',
        filter: false
      },
      stock_needed: {
        title: 'Stock Needed',
        filter: false
      }
    },
    attr: {
      class: 'table table-bordered'
    },

    
 
  };
  // settings['rowClassFunction'] = (row) => {
  //   if (row.data.bln_stock) {
  //             return 'score negative'; // Color from row with negative in score
  //           } else {
  //             return 'score positive';
  //           }
  //           return '';
  //         };
    
  constructor(
    private serviceObject: ServerService,
    public router: Router
    ) { }

  ngOnInit() {
    let ToDate = new Date()
    let FromDate = new Date()
    this.datTo = ToDate
    this.datFrom = FromDate


    this.searchBranch.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstBranch = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('branch/branch_typeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.lstBranch = response['data'];

              }
            );
        }
      }
    }
    ); 

    this.searchItem.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItem = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('stock_prediction/itemTypeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.lstItem = response['data'];

              }
            );

        }
      }
    }
    );  
    this.getWarehouses();


    // this.getListData()
  }

  getWarehouses(){
    this.serviceObject.getData('stock_prediction/branchlist/').subscribe(
      (response) => {
        this.lstBranch=[];
        if(response['status']==1){
       this.lstBranch=response['lst_branch'];
      }
      else{
        // Swal.fire('Error!',response['data']);
      }
      },
      (error) => {   
        Swal.fire('Error!','error', 'error');
        
      });
  }

  addBranch(event) {
    if (this.branchSelected.filter(x => x.id === event.id).length === 0) {
      this.branchSelected.push(event);
      this.selectedBranch.push(event.id);
    }
    this.strBranch = '';
    this.idBranch.nativeElement.value = '';
  }
  removeBranch(value) {
    const index = this.branchSelected.indexOf(value);
    const index2 = this.selectedBranch.indexOf(value.id);
    if (index > -1) {
      this.branchSelected.splice(index, 1);
      // this.selectedBranch.splice(index,1);
    }
    if (index2 > -1) {
      // this.branchSelected.splice(index2, 1);
      this.selectedBranch.splice(index2,1);
    }
  }

  addItem(event) {
    if (this.itemSelected.filter(x => x.id === event.id).length === 0) {
      this.itemSelected.push(event);
      this.selectedItem.push(event.id);
    }
    this.strItem = '';
    this.itemId.nativeElement.value = '';
  }
  removeItem(value) {
    const index = this.itemSelected.indexOf(value);
    const index2 = this.selectedItem.indexOf(value.id);
    if (index > -1) {
      this.itemSelected.splice(index, 1);
    }
    if (index2 > -1) {
      this.selectedItem.splice(index2,1);
    }
  }

  ItemChanged(item) {
    this.IntItemId = item.id;
    this.strItem = item.code_name;
  }

  specChange(event)
  {
    console.log("event",event);
    this. branchSelected=[]
     for(let item of event)
     {
       this.lstBranch.forEach(element => {
         if((element.vchr_name==item) ) {
           if(this.branchSelected.includes(item)){
           }
           else{
            this.branchSelected.push(element.pk_bint_id)
           }
         }
       });
       console.log("branch selected",this.branchSelected);
     }
     
  
  }

  getListData(){
    
    
    let dctData = {}
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    
    if (this.datFrom > this.datTo) {

      Swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return false;
    }if(this.branchSelected.length < 1){
      Swal.fire({
        position: "center",
        type: "error",
        text: "Please Enter Branch",
        showConfirmButton: true,
      });
    }
    // if(((this.strBranch!='') && (this.branchSelected.length<1)) || (this.idBranch.nativeElement.value!='') ){
    //   Swal.fire('Error!','Enter a valid Branch', 'error');
    //   return false;
    // }
    if(((this.strItem!='') && (this.itemSelected.length<1)) || (this.itemId.nativeElement.value!='')){
      Swal.fire('Error!','Enter a valid Item', 'error');
      return false;
    }

    if (this.branchSelected.length > 0) {
      this.selectedBranch = this.branchSelected.map(x => x.id);
      dctData['lstBranch'] = this.branchSelected
    }
    if (this.itemSelected.length > 0) {
      this.selectedBranch = this.itemSelected.map(x => x.id);
      dctData['lstItem'] = this.itemSelected.map(x => x.id);
    }

    dctData['datFrom'] = this.selectedFrom;
    dctData['datTo'] = this.selectedTo;
    dctData['intMsid']=this.intStockDays;
    console.log('asd',dctData);
    
    this.serviceObject.postData('stock_prediction/stock_prediction/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {
          // localStorage.remove('transfer_from')
          // localStorage.remove('transfer_to')
          this.data = response['data'];
          this.source = new LocalDataSource(this.data); // create the source
        }
        else if (response.status == 0) {
          Swal.fire('Error!', response['message'], 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
  }


}

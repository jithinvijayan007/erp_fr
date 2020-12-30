import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-stock-ack',
  templateUrl: './list-stock-ack.component.html',
  styleUrls: ['./list-stock-ack.component.css']
})
export class ListStockAckComponent implements OnInit {

  datTo;
  datFrom;

  selectedFrom;
  selectedTo;
  data = [];
  source;
  constructor(private serviceObject: ServerService, 
              public router: Router) { }

  ngOnInit() {
    let ToDate = new Date()
    let FromDate = new Date()
    this.datTo = ToDate
    this.datFrom = FromDate
    this.getListData()
  }

  getListData(){
    
    // if (localStorage.getItem('transfer_from') && localStorage.getItem('transfer_to')){
    //   this.datFrom = localStorage.getItem('transfer_from')
    //   this.datTo = localStorage.getItem('transfer_to')
    // }
    
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
    }

    dctData['datFrom'] = this.selectedFrom
    dctData['datTo'] = this.selectedTo
    console.log('asd',dctData);
    
    this.serviceObject.postData('branch_stock/list_stock_transfer/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {
          // localStorage.remove('transfer_from')
          // localStorage.remove('transfer_to')
          this.data = response['data'];
          this.source = new LocalDataSource(this.data); // create the source


        }
        else if (response.status == 0) {
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
  }

  settings = {
    hideSubHeader: true,
    // delete: {
    //   confirmDelete: false,
    //   deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
    //   saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
    //   cancelButtonContent: '<i class="ti-close text-danger"></i>',
    //   position: 'right'
    // },
    actions: {
      add: false,
      edit: false,
      delete:false,
      custom: [{ name: 'ourCustomAction', title: '<i class="ti-eye text-info m-r-10"></i>' }],
      position: 'right'
    },
    columns: {
      dat_transfer: {
        title: 'Date Transfer ',
        filter: false
      },
      int_count: {
        title: 'Item Count ',
        filter: false
      },
      vchr_from: {
        title: 'From Location',
        filter: false
      },
      status: {
        title: 'Status',
        filter: false
      }
    },
  };

  onEdit(event) {
    localStorage.setItem('int_transfer_id', event.data.int_transfer_id);
    localStorage.setItem('transfer_from', this.datFrom)
    localStorage.setItem('transfer_to', this.datTo)
  localStorage.setItem('previousUrl','stock/view_stock_ack/');
    
    this.router.navigate(['stock/view_stock_ack/']);
  }

}

// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-dealerhistory',
  templateUrl: './dealerhistory.component.html',
  styleUrls: ['./dealerhistory.component.css']
})
export class DealerhistoryComponent implements OnInit {

  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source
      
  }
  dealerRowId= localStorage.getItem('dealerRowId');
  source: LocalDataSource;
  data;
  ngOnInit(){
    this.getData()
  }
  dctData={}

  settings = {
    actions: {
      add: false,
      edit: false,
      delete:false,
      position: 'right'
    },
   
    columns: {
      dat_created: {
        title: 'Date',
      },
      status: {
        title: 'Status',
      },
      vchr_remarks: {
        title: 'Remarks',
      },
     
    },
  };
  getData(){
    this.serviceObject.getData('dealer/dealer_history/?id='+ this.dealerRowId).subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.data=response['history_list'];
            
            for(let item of this.data ){
              if( item['vchr_status']=="1"){
               item['status']="Active"
              }
              else if( item['vchr_status']=="2"){
                item['status']="Deactive"
              }
              item['dat_created']=moment(item['dat_created']).format('DD/MM/YYYY');
            }
            this.source= this.data
            // console.log(this.data,"data");
            
          }
      });
    }

}

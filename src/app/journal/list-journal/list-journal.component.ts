import { Component, OnInit,ViewChild } from '@angular/core';
import * as moment from 'moment' ;
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { local } from 'd3';

@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: ['./list-journal.component.css']
})
export class ListJournalComponent implements OnInit {

  datFrom ;
  datTo ;

  lstTableData= [];
  dataSource;
  blnShowData = false;

  lstDisplayedColumns =['date','journalId','debitBranch','debitType','creditBranch','creditType','amount','action'];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private serviceObject : ServerService,
    private toastr: ToastrService,
    public router: Router,
     ) { }

  ngOnInit() {
    this.datFrom = new Date();
    this.datTo = new Date();

    this.searchData();
  }


  searchData(){
    
    let dctData = {}

    let fromDate = moment(this.datFrom).format('YYYY-MM-DD');
    let toDate = moment(this.datTo).format('YYYY-MM-DD');

    dctData['datFrom'] = fromDate;
    dctData['datTo'] = toDate;

    this.serviceObject.putData('transaction/journal/',dctData).subscribe(res => {

      if (res.status == 1)
      {
        
        this.lstTableData = res['lst_data'];
        if(res['lst_data'] == null){
          this.blnShowData = false;
        }
       
        else if(this.lstTableData.length > 0){
          this.blnShowData = true;
        }

        this.dataSource = new MatTableDataSource(
          this.lstTableData
        );
        this.dataSource.paginator = this.paginator;
        // this.dataSource.paginator.firstPage();
        this.dataSource.sort = this.sort;


      }
      else if (res.status == 0) {
        swal.fire('Error!','Something went wrong!!', 'error');
        this.blnShowData = true;
   
      }
  },
  (error) => {
    swal.fire('Error!','Server Error!!', 'error');
  });



  }

  viewJournal(item){

    localStorage.setItem('journalId',item.pk_bint_id);
    localStorage.setItem('intDebitType',item.int_debit_type);
    localStorage.setItem('intCreditType',item.int_credit_type);

    this.router.navigate(['journal/viewjournal/']);
  

  }

}

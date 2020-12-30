import { Component, OnInit,ViewChild } from '@angular/core';
import * as moment from 'moment' ;
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-schema',
  templateUrl: './list-schema.component.html',
  styleUrls: ['./list-schema.component.css']
})
export class ListSchemaComponent implements OnInit {


  datFrom ;
  datTo ;

  lstTableData= [];
  dataSource;
  blnShowData = false;

  lstDisplayedColumns =['fromdate','todate','schema'];
  

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

    this.serviceObject.getData('scheme/addscheme/').subscribe(res => {

      if (res.status == 1)
      {
        
        this.lstTableData = res['data'];
        if(res['data'] == null){
          this.blnShowData = false;
        }
       
        else if(this.lstTableData.length > 0){
          this.blnShowData = true;
        }

        this.dataSource = new MatTableDataSource(
          this.lstTableData
        );
        this.dataSource.paginator = this.paginator;
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

  viewSchema(item){

    localStorage.setItem('schemaId',item.pk_bint_id);
    localStorage.setItem('previousUrl','schema/listschema');
    this.router.navigate(['schema/addschema/']);
  

  }

}

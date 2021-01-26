import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { url } from 'inspector';
import { ServerService } from 'src/app/server.service';
import { DatePipe, formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxSpinnerService } from "ngx-spinner";
import { DataSource } from '@angular/cdk/collections';
import { debounceTime } from 'rxjs/operators';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  animations:
    [
      trigger('detailExpand', [
        state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
        state('expanded', style({ height: '*', visibility: 'visible' })),
        transition('expanded <=> collapsed', animate('25ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],


})
export class UserListComponent implements OnInit {

  constructor(private serviceObject: ServerService, private datePipe: DatePipe) { }

  datFrom;
  datTo;
  lstData=[];


  searchStaff: FormControl = new FormControl();
  strSelectedStaff;
  currentStaff = '';
  intStaffId;
  strStaff;
  lstStaff = [];
  branchOptions = [];
  branchConfig = { displayKey: "vchr_name", search: true, height: '200px', customComparator: () => { }, placeholder: 'Branch', searchOnKey: 'vchr_name', clearOnSelection: true }
  lstBranch = [];
  blnBranch;
  bln_table = false;
  dataSource;
  displayedColumns = [
    'fullname',
    "branch",
    'group',
  ];
  expandedElement;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  ngOnInit() {

    this.datFrom=new Date();
    this.datTo=new Date();

    
    this.searchStaff.valueChanges
      .pipe(debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstStaff = [];
        } else {
          if (strData.length >= 1) {

            this.serviceObject
              .postData('user/user_typeahead/', { terms: strData })
              .subscribe(
                (response) => {
                  this.lstStaff = response['data'];
                }
              );
          }
        }
      }
      );

    this.serviceObject.getData('branch/branchapi/').subscribe(
      (response) => {


        if (response.status == 1) {
          this.branchOptions = response['lst_branch']
          this.blnBranch = true;
        }
      },
      (error) => {
      });

  }
  staffNgModelChanged(event) {
    if (this.currentStaff != this.strSelectedStaff) {
      this.intStaffId = null;
      this.strStaff = '';
    }
  }

  staffChanged(item) {
    this.currentStaff = item.strUserName;
    this.intStaffId = item.intId;
    this.strStaff = item.strUserName;
    this.strSelectedStaff = item.strUserName;

  }
  normalSearch() {

    let dct_data = {}
    dct_data['datFrom'] = this.datePipe.transform(this.datFrom, 'yyyy-MM-dd');
    dct_data['datTo'] = this.datePipe.transform(this.datTo, 'yyyy-MM-dd');
    if (this.lstBranch) {
      dct_data['lstBranch'] = this.lstBranch.map(branch => branch.pk_bint_id)

    }
    dct_data['intUser'] = this.intStaffId;

    this.serviceObject.postData('staff_tracking/list/', dct_data).subscribe(
      (response) => {


        if (response.status == 1) {
          this.lstData = response['data']

          this.dataSource = new ExampleDataSource(this.lstData);

          
          // this.dataSource.paginator = this.paginator;

          // this.dataSource.paginator.firstPage();

          // this.dataSource.sort = this.sort;
        }
     
      },
      (error) => {
        // this.bln_table = false;
      });
    // console.log(this.datFrom);
    // console.log(this.datTo);
    // console.log(this.datTo);
    // console.log(this.intStaffId);



  }

  applyFilter(filterValue: string) {

    // let filterData=[];
    let tmpDataSource=new MatTableDataSource(this.lstData);

    // console.log("##filterValue",filterValue);
    // console.log("$$ this.lstData", this.lstData);
    
    tmpDataSource.filter = filterValue.trim().toLocaleLowerCase();

    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    // filterData = this.lstData.filter(x => 
    //   x.name.trim().toLowerCase().includes(filterValue)

    // );

    // console.log("########tmpDataSource",tmpDataSource);
    // console.log("#######tmpDataSource.data",tmpDataSource.filteredData);
    
    this.dataSource = new ExampleDataSource(tmpDataSource.filteredData);

   
    // this.dataSource.filter = filterValue;
  }


}



export class ExampleDataSource extends DataSource<any> {

  dataStructure;
  constructor(dataSource:any)
  {
   
    super();
    this.dataStructure=dataSource;
	}
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const rows = [];
    this.dataStructure.forEach(      
      element => rows.push(element, { detailRow: true, element })
      );
    // console.log("rows",rows);
    return of(rows);
  }

  disconnect() { }
}


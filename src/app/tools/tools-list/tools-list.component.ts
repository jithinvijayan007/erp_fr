import { Component, OnInit,ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment'

@Component({
  selector: 'app-tools-list',
  templateUrl: './tools-list.component.html',
  styleUrls: ['./tools-list.component.css']
})
export class ToolsListComponent implements OnInit {

  lstDisplayedColumns=['tool','branches','content','date','action'];
  lstData=[];
  dataSource;

  blnShowData = false;
  data;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private serviceObject: ServerService,  
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
  ) { 
  
  }


  ngOnInit() {
    localStorage.setItem('blnAddAddition','');
    this.getTools()
  }

  getTools(){
    const dctData = {}

    this.serviceObject.getData('tool_settings/tool_api/').subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.data=response['data'];
            
           
            this.data.forEach(element => {
            
              // console.log("hkjhjjh",element);
            
              if(element.content){
                 
              if(element['content'].length > 4){
                 element['branch'] =  element['content'];
                 element['branch'] =  element['branch'].slice(0, 4);
                 element['branch'] =  element['branch'].toString() + "...";
                
              }
              else{
                element['branch'] =  element['content'];
              }

              if(element['additions']){
                if(element['additions'].length > 4){
                  element['additions'] =  element['additions'];
                  element['additions'] =  element['additions'].slice(0, 4);
                  element['additions'] =  element['additions'].toString() + "...";
                  }
                  else{
                    element['additions'] =  element['additions'];
                  }
    
              }

            
              
              }
              if(element['vchr_tool_code']=='MYG_CARE_NUMBER'){
                // console.log("in fn");
                
                 element['additions'] =  element['jsn_data'];
               }
              
            });
         
            
         
              this.blnShowData=true;
            
              this.dataSource = new MatTableDataSource(
                this.data
              );
              this.dataSource.paginator = this.paginator;
              // this.dataSource.paginator.firstPage();
              this.dataSource.sort = this.sort;
             
             
             
            
          }  
          
          else if (response.status == 0) 
          {
           this.blnShowData=false;
           swal.fire('Error!',response['reason'], 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAction(action,row){
    if(action == 'view'){
      if(row.vchr_tool_code=='ADDITION' || row.vchr_tool_code=='DEDUCTION'){
        localStorage.setItem('addDectId',row.pk_bint_id);
        localStorage.setItem('action','view');
        localStorage.setItem('previousUrl','tools/set-add-deduct');

        this.router.navigate(['tools/set-add-deduct'])
      }
      else{
      localStorage.setItem('toolsViewId',row.pk_bint_id);
      localStorage.setItem('previousUrl','tools/view-tools');
      
      this.router.navigate(['tools/view-tools'])
      }
    }

    else{
      if(row.vchr_tool_code=='ADDITION' || row.vchr_tool_code=='DEDUCTION'){
        localStorage.setItem('addDectId',row.pk_bint_id);
        localStorage.setItem('action','edit');
        localStorage.setItem('previousUrl','tools/set-add-deduct');
        localStorage.setItem('toolsEditCode',row.vchr_tool_code);

        this.router.navigate(['tools/set-add-deduct'])
      }
      else{
      localStorage.setItem('toolsEditId',row.pk_bint_id);
      localStorage.setItem('previousUrl','tools/set-tools');
      localStorage.setItem('toolsEditCode',row.vchr_tool_code);

      this.router.navigate(['tools/set-tools'])
      }
    }
  
  }
  addAddition(){
    localStorage.setItem('blnAddAddition','true');
    localStorage.setItem('previousUrl','tools/set-add-deduct');
    
    this.router.navigate(['/tools/set-add-deduct'])
  }
  

}

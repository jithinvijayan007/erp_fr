import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent implements OnInit {

  intDepartmentId=null;
  lstDepartment=[];
  ELEMENT_DATA = [];
  dataSource;
  lstLevelsData = [];
  displayedColumns: string[] = ['Level', 'Name'];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  levelNames = {}
  // mat-MAT_PAGINATOR_DEFAULT_OPTIONS
 
  

  constructor(private serverService: ServerService) { }

  ngOnInit(): void {


    //--------------------department list dropdown ----------------//
    this.serverService.getData('department/list_departments/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDepartment=response['lst_department'];
          }  
      },
      (err) => {   
        
      });
    //--------------------department list dropdown ends ----------------//
  }
  departmentSelected(department){
    this.serverService.getData("hierarchy/levels/").subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstLevelsData=response['data'];
            // this.source = new LocalDataSource(this.data);
            this.dataSource = new MatTableDataSource(
              this.lstLevelsData
            );
            this.lstLevelsData.forEach(element => {
              this.levelNames[element.vchr_name] = []
            })
          
          }  
      },
      (error) => {   
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
    
    

  }

  add(event,vchr_name){
    const input = event.input;
    const value = event.value;

    // Add our group
    if ((value || '').trim()) {
      
      this.levelNames[vchr_name].push( value.trim() )
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    
  }

  remove(data, vchr_name): void {
   
    
    const index = this.levelNames[vchr_name].indexOf(data);
    
    if (index >= 0) {
      this.levelNames[vchr_name].splice(index, 1);
    }
  }
  levelSave(){    

    
      this.serverService.postData("hierarchy/groups/",this.levelNames)
      .subscribe(
        response => {
          if(response['status'] == 1){
            Swal.fire('success','Created successfully', 'success')
          }
        });
        err =>{
          Swal.fire('Error',err['reason'], 'error')
        }
    }

  }



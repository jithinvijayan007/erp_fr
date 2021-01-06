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
  levelInserted = {}
  levelREmoved = {}
  lstGroupData = [];

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
    this.intDepartmentId = department
    this.serverService.postData("hierarchy/get_groups/",{dept_id:department}).subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstLevelsData=response['level_data'];
            this.lstGroupData = response['data'];
            // this.source = new LocalDataSource(this.data);
            this.dataSource = new MatTableDataSource( 
              this.lstLevelsData
            );
            this.lstLevelsData.forEach(element => {
              this.levelNames[element.vchr_name] = [];
              if (this.lstGroupData[element.vchr_name]){

                this.levelNames[element.vchr_name].push(... this.lstGroupData[element.vchr_name]);
              }
              this.levelREmoved[element.vchr_name] = [];
              this.levelInserted[element.vchr_name] = [];
            })
          console.log(this.levelNames);
          
          }  
      },
      (error) => {   
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
    
    
    
    

  }

  add(event,vchr_name){
    // console.log(this.levelNames);
    // console.log(vchr_name);
    
    const input = event.input;
    const value = event.value;
    console.log(this.levelInserted);
    // Add our group
    if ((value || '').trim()) {
      
      this.levelNames[vchr_name].push( value.trim() );
      this.levelInserted[vchr_name].push( value.trim());
      console.log(this.levelInserted);
      
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
      this.levelREmoved[vchr_name].push( data.trim())
    }
  }
  levelSave(){    
console.log(this.levelInserted);
console.log(this.levelREmoved);

    let dctData = {
      inserted : this.levelInserted, 
      removed : this.levelREmoved, 
      dept_id:this.intDepartmentId
    }
      this.serverService.postData("hierarchy/groups/",dctData)
      .subscribe(
        response => {
          if(response['status'] == 1){
            Swal.fire('success','Created successfully', 'success')
            // this.levelNames
          //   this.levelREmoved = []
          //   this.levelInserted = []
          }
        });
        err =>{
          Swal.fire('Error',err['reason'], 'error')
        }
    }

  }



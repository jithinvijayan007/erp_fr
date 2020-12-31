import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/server.service'
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  
  hierarchyName
  lst_hierarchy
  strName = ""
  strCode = ""
  master_id

  constructor(private serverService: ServerService, public router: Router) { }

  ngOnInit(): void {
    this.hierarchyName = localStorage.getItem('SubMenu').split(" ")[1]; 
    this.serverService.getData('hierarchy/hierarchy?hierarchy_name=' + this.hierarchyName).subscribe(res => {
      if (res.status == 1) {
        this.lst_hierarchy = res['data']

      }
      
    }, err => {
        console.log(err);
        
    })
    this.router.navigate(['hierarchy/add-location']);

  };
  onChangeGroup(item) {
    this.master_id = item.pk_bint_id
  }
  Submit_data() {
    let dct_data = {}
    dct_data['hierarchy_name'] = this.hierarchyName
    dct_data['vchr_name'] = this.strName
    dct_data['vchr_code'] = this.strCode
    dct_data['master_id'] = this.master_id
    this.serverService.postData('hierarchy/hierarchy', dct_data).subscribe(res => {
      
    },
      err => {
      
    })
    
    console.log(this.strName);
    console.log(this.strCode);
    console.log(this.master_id);
    
  }


  }
  
// }

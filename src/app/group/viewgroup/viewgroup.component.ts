import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-viewgroup',
  templateUrl: './viewgroup.component.html',
  styleUrls: ['./viewgroup.component.css']
})
export class ViewgroupComponent implements OnInit {


  strName= '';
  companyId = Number(localStorage.getItem("companyId"));
  userType = localStorage.getItem("staff");
  data={}
  dctPerms={};
  lstKeys=[];
  groupId: any;
  groupName='';
  companyName=''

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit() {
    this.groupId = localStorage.getItem("groupId");
    this.data = { operation: "view", group_id: this.groupId };
    if (this.userType === "superuser") {
      this.data["role"] = this.userType;
    } else {
      this.data['company_id'] = this.companyId;
    }
    this.getViewData()
  }

  getViewData(){
    this.dctPerms={};
    this.lstKeys=[];

    this.serverService.postData("user_groups/groupedit/",this.data).subscribe(res => {
      const result = res;
      if (result['status'] == 0) {
        this.strName = result['group'];
        // this.department = result.int_department;
        // this.strSelectedCompany =
        //   result.company.code + " - " + result.company.name;
        // this.intCompanyId = result[company.id;
        // this.lstPerms = result['perms'];
        this.groupName=result['group'];
        this.companyName=result['company'].name
        this.dctPerms=result['perms'];
        this.lstKeys=Object.keys(this.dctPerms)
        // this.dctPermsCopy=result['perms'];
        // this.lstPermKeys = Object.keys(this.dctPerms)
  
        
      } else {
        swal.fire("Error", result['data'], "error");
      }
    });

  }
}

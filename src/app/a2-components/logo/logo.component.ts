import { Component , OnInit } from '@angular/core';
import { ServerService } from '../../server.service';

@Component({
  moduleId: module.id,
  selector: 'logo',
  templateUrl: 'logo.component.html',
  styleUrls: ['logo.component.scss']
})
export class LogoComponent implements OnInit {
  host;
  companydetails = {};
  companyid= localStorage.getItem('companyId');
  companytype = localStorage.getItem('company_type');
  path = '';
logopath = 'assets/img/logosm.png';
constructor(private serviceObject: ServerService) { }
  ngOnInit() {
    this.host = this.serviceObject.hostAddress ;
    if (this.companytype === 'TRAVEL AND TOURISM') {
      this.path = '/crm/addtravellead';
    } else if (this.companytype === 'SOFTWARE') {
      this.path = '/crm/viewvideo';
    } else if (this.companytype === 'AUTOMOBILE') {
      this.path = '/crm/addautomobilelead';
    } else if (this.companytype === 'MOBILE') {
      this.path = '/crm/addmobilelead';
    } else if (this.companytype === 'MAINTENANCE') {
      this.path = '/crm/addmaintenancelead';
    }
    else if(this.companytype === 'SOLAR'){
      this.path = '/crm/adduser';
    }
    if(Number(this.companyid) > 0)  {
    // this.serviceObject.getCompanysList(this.companyid).subscribe(
    //   result => {
    //     this.companydetails = result.json();
    //     this.logopath = this.host + "static/" + this.companydetails[0].vchr_logo;
    //   });

    //edited
    this.serviceObject.getData("company/company/?pk_bint_id=" +this.companyid).subscribe(
      result => {
        this.companydetails = result;
        this.logopath = this.host + "static/" + this.companydetails[0].vchr_logo;
      });
    }
  }

  }

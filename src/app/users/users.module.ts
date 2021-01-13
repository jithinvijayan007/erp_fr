import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { UsersRoutes } from './users.routing';

// import { AdduserComponent } from './adduser/adduser.component';
import { ListemployeeComponent } from './listemployee/listemployee.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// import { ListCompanyComponent } from './list-company/list-company.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
// import { EdituserComponent } from './edituser/edituser.component';
import { UsergroupaddComponent } from './usergroupadd/usergroupadd.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { NgxSpinnerModule } from "ngx-spinner";

// import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { EditemployeeComponent } from './editemployee/editemployee.component';
import {MatRadioModule} from '@angular/material/radio';
// import { MatChipsModule } from '@angular/material/chips';




@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild(UsersRoutes),     
    NgMultiSelectDropDownModule.forRoot(),
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    Ng2SmartTableModule,
    SelectDropDownModule,   
    NgxSpinnerModule,
    // NgxSpinner
    // SelectDropDownModule, 
    MatRadioModule,  
  
  ],
  declarations: [
    ListemployeeComponent,
    ViewuserComponent,
    ChangepasswordComponent,
    // EdituserComponent,
    UsergroupaddComponent,
    AddemployeeComponent,
    EditemployeeComponent
  ]
})
export class UsersModule {}

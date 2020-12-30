import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRoutes } from './company.routing';

import { AddCompanyComponent } from './add-company/addcompany.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild(CompanyRoutes),     
    NgMultiSelectDropDownModule.forRoot(),
    ReactiveFormsModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    AddCompanyComponent,
  ]
})
export class CompanyModule {}

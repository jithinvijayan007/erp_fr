import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdditemcategoryRoutingModule } from './additemcategory-routing.module';
import { AdditemcategoryComponent } from './additemcategory.component'
@NgModule({
  declarations: [AdditemcategoryComponent],
  imports: [
    CommonModule,
    AdditemcategoryRoutingModule,
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class AdditemcategoryModule { }

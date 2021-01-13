import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrouppermissionRoutingModule } from './group-permission.routing.module';
import { AddpermissionComponent } from './add-permissions/addpermission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ListgroupComponent } from './listgroup/listgroup.component';
import { ViewgroupComponent } from './viewgroup/viewgroup.component';
import { EditgroupComponent } from './editgroup/editgroup.component';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [AddpermissionComponent, ListgroupComponent, ViewgroupComponent, EditgroupComponent],
  imports: [
    CommonModule,
    GrouppermissionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    NgxSpinnerModule,
    MatRadioModule,
  ]
})
export class GroupModule { }

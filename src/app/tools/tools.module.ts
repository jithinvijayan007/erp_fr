import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { SetToolsComponent } from './set-tools/set-tools.component';
import { ToolsListComponent } from './tools-list/tools-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ViewToolsComponent } from './view-tools/view-tools.component';
import { SetAddDeductComponent } from './set-add-deduct/set-add-deduct.component';
// import { FormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from '../card.module';


@NgModule({
  declarations: [SetToolsComponent, ToolsListComponent, ViewToolsComponent, SetAddDeductComponent, SetAddDeductComponent],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    MatButtonModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatTableModule,
    MatPaginatorModule,
    MatAutocompleteModule, 
    MatIconModule,
    MatDatepickerModule, 
    MatSortModule, 
    MatChipsModule, 
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule
  ]
})
export class ToolsModule { }

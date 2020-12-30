import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BranchRoutingModule } from './branch-routing.module';
import {BranchRoutes} from './branch-routing.module'
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {AddbranchComponent} from '././addbranch/addbranch.component';
import { BranchlistComponent } from './branchlist/branchlist.component';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { EditbranchComponent } from './editbranch/editbranch.component';
// import {MatNativeDateModule} from '@angular/material';
// Time picker clock
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [AddbranchComponent,BranchlistComponent,EditbranchComponent],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild(BranchRoutes),  
    Ng2SmartTableModule,   
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    // MatNativeDateModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgxSpinnerModule,
    AmazingTimePickerModule // Time picker clock    
  ]
})
export class BranchModule { 

}

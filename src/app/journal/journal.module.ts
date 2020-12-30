import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalRoutingModule } from './journal-routing.module';
import { AddJournalComponent } from './add-journal/add-journal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { ListJournalComponent } from './list-journal/list-journal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ViewJournalComponent } from './view-journal/view-journal.component';   

@NgModule({
  declarations: [AddJournalComponent, ListJournalComponent, ViewJournalComponent],
  imports: [
    CommonModule,
    JournalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule, MatButtonModule,
    MatSelectModule,MatIconModule, MatRadioModule, MatAutocompleteModule, MatCheckboxModule,
    MatDatepickerModule,
    MatTableModule, MatFormFieldModule, MatPaginatorModule, MatSortModule 
   
  ]
})
export class JournalModule { }

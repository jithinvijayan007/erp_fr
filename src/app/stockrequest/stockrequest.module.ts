import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockrequestRoutingModule } from './stockrequest-routing.module';
import { StockrequestComponent } from './stockrequest/stockrequest.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StockrequestlistComponent } from './stockrequestlist/stockrequestlist.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { StockrequestviewComponent } from './stockrequestview/stockrequestview.component';
import { RequestedlistComponent } from './requestedlist/requestedlist.component';
import { NgxSpinnerModule } from "ngx-spinner";
// Time picker clock
import { AmazingTimePickerModule } from 'amazing-time-picker';
// Time picker clock
@NgModule({
  declarations: [StockrequestComponent, StockrequestlistComponent, StockrequestviewComponent, RequestedlistComponent],
  imports: [
    CommonModule,
    StockrequestRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    Ng2SmartTableModule,
    MatTableModule,
    NgxSpinnerModule,
    AmazingTimePickerModule // Time picker clock
  ]
})
export class StockrequestModule { }

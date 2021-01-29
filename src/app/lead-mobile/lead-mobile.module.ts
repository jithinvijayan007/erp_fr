import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadMobileRoutingModule } from './lead-mobile-routing.module';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from '../card.module';
import { CalendarModule } from 'angular-calendar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { StarRatingModule } from 'angular-star-rating';
import { StickyModule } from 'ng2-sticky-kit';
import { ViewmobileleadComponent } from './viewmobilelead/viewmobilelead.component';
import { SnotifyService } from 'ng-snotify';



@NgModule({
  declarations: [AddEnquiryComponent, ViewmobileleadComponent],
  imports: [
    CommonModule,
    LeadMobileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    StarRatingModule,
    CalendarModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    StickyModule,
    NgbPopoverModule,
    NgbModule,
    // CommoncomponentsModule,
    // CalenderModule,
    // StickyNotesModule,
    // AddcustomerModule,
    // CalendarStickyModule
  ]
})
export class LeadMobileModule { }

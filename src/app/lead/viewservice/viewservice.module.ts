import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewserviceRoutingModule } from './viewservice-routing.module';
// import { CommoncomponentsModule } from '../../commoncomponents.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalenderModule } from '../../calender/calender.module';
import { StickyNotesModule } from '../../sticky-notes/sticky-notes.module';
import { ViewserviceComponent } from './viewservice.component';
import { DateAdapter } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
// import { DateAdapter } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ViewserviceRoutingModule,
    // CommoncomponentsModule,
    MatListModule,
    NgbModule,
    CalenderModule,
    StickyNotesModule
  ],
  declarations: [
    ViewserviceComponent
  ]
})
export class ViewserviceModule { 
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}

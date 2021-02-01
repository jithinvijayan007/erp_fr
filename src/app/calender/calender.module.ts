import { CalenderComponent } from './calender.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { CardModule } from '../card.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { CommoncomponentsModule } from '../commoncomponents.module';
import { CalenderRoutingModule } from './calender-routing.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    CalenderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    CalendarModule,
    MatIconModule
    // CommoncomponentsModule
  ],
  exports: [CalenderComponent],
  declarations: [CalenderComponent]
})
export class CalenderModule { }

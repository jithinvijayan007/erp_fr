import { StickyNotesComponent } from './sticky-notes.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '../card.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { CommoncomponentsModule } from '../commoncomponents.module';
import { StickyNotesRoutingModule } from './sticky-notes-routing.module';
import { StickyModule } from 'ng2-sticky-kit';

@NgModule({
  imports: [
    CommonModule,
    StickyNotesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    // CommoncomponentsModule,
    StickyModule,
  ],
  exports: [StickyNotesComponent],
  declarations: [StickyNotesComponent]
})
export class StickyNotesModule { }

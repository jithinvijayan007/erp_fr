import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Daterangepicker } from 'ng2-daterangepicker';

// import { ViewServiceComponent } from './view-service/view-service.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { MatNativeDateModule } from '@angular/material/core';

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/format-datepicker';

// import { AddServiceComponent } from './add-service/add-service.component';
import { DateRangePickerComponent } from '../date-range-picker/date-range-picker.component';

import { ServicesMainRoutingModule } from './services-main-routing.module';
import { AddServiceComponent } from './add-service/add-service.component';
import { ListServiceComponent } from './list-service/list-service.component';
import { ViewServiceComponent } from './view-service/view-service.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [AddServiceComponent, ListServiceComponent, ViewServiceComponent,DateRangePickerComponent],
  imports: [
    CommonModule,
    ServicesMainRoutingModule,
    SelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    // mat modules starts
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    // mat modules ends,
    NgxSpinnerModule,
    NgxMaterialTimepickerModule,
    Daterangepicker,
    NgxDaterangepickerMd.forRoot(),
    
  ],
  exports:[
    DateRangePickerComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
  ]
})
export class ServicesMainModule { }

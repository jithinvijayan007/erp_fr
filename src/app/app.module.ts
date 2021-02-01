import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DatePipe } from '@angular/common';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

// Edited by AMR
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { ServerService } from './server.service';
import { HttpModule } from '@angular/http';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './auth.guard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddreceiptComponent } from './receipt/addreceipt/addreceipt.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { PrintcomponentComponent } from './printcomponent/printcomponent.component';
import { TitleCasePipe } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { DataService } from './global.service';
import { TypeaheadService } from './typeahead.service';
import {SharedService} from './layouts/shared-service';
import { SnotifyService } from 'ng-snotify';

import { from } from 'rxjs';
import { ChatComponent } from './a2-components/chat/chat/chat.component';
import { AdditionNavbarComponent } from './a2-components/addition-navbar/addition-navbar.component';
import { AlertComponent } from './a2-components/alert/alert.component';
import { BadgeComponent } from './a2-components/badge/badge.component';
import { A2CardComponent } from './a2-components/card/card.component';
import { FileComponent } from './a2-components/file/file.component';
import { FooterComponent } from './a2-components/footer/footer.component';
// import { LogoComponent } from './a2-components/logo/logo.component';
import { MainMenuComponent } from './a2-components/main-menu/main-menu.component';
import { NavbarComponent } from './a2-components/navbar/navbar.component';
import { NIHTimelineComponent } from './a2-components/ni-h-timeline/ni-h-timeline.component';
import { CardModule } from './card.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    PrintcomponentComponent,
    ChatComponent,
    AdditionNavbarComponent,
    AlertComponent,
    BadgeComponent,
    BreadcrumbComponent,
    A2CardComponent,
    FileComponent,
    FooterComponent,
    MainMenuComponent,
    NavbarComponent,
    NIHTimelineComponent,
    SidebarComponent
    // AddreceiptComponent
    
  
  ],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot(Approutes, { useHash: false, relativeLinkResolution: 'legacy' }),
    PerfectScrollbarModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBUb3jDWJQ28vDJhuQZxkC0NXr_zycm8D0' }),
    HttpModule,
    ToastrModule.forRoot(),
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    PdfJsViewerModule,
    SelectDropDownModule,
    MatButtonToggleModule ,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    // CommonModule
    
  ],
  providers: [
    ServerService,
    SnotifyService,
    FormBuilder,
    DatePipe,
    TitleCasePipe,
    DataService,
    AuthGuard,
    SharedService,
    TypeaheadService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    // { provide: OWL_DATE_TIME_LOCALE, useValue: "gb" },

  ],
  exports: [
    MainMenuComponent,
    // LogoComponent,
    A2CardComponent
  ],
  bootstrap: [AppComponent]
})



// export class AppModule { }
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DealerRoutes } from './dealer-routing.module'
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {AdddealerComponent} from '././adddealer/adddealer.component';
import { DealerRoutingModule } from './dealer-routing.module';
import { DealerlistComponent } from './dealerlist/dealerlist.component';
import { EditdealerComponent } from './editdealer/editdealer.component';
import { ViewdealerComponent } from './viewdealer/viewdealer.component';
import { DealerhistoryComponent } from './dealerhistory/dealerhistory.component';
import {MatDatepickerModule } from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material';
@NgModule({
  declarations: [AdddealerComponent,EditdealerComponent,DealerhistoryComponent,ViewdealerComponent,DealerlistComponent],
  imports: [
    CommonModule,
    DealerRoutingModule,
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild(DealerRoutes),  
    Ng2SmartTableModule,   
    ReactiveFormsModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatRadioModule
   

  ]
})
export class DealerModule { }

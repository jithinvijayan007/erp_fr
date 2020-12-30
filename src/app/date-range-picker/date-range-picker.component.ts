import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit {

  public chosenDateRange: any = {};
  @Output() onSelectDate = new EventEmitter<moment.Moment[]>();

  constructor(private daterangepickerOptions: DaterangepickerConfig) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'DD/MM/YYYY' },
      alwaysShowCalendars: false,
      open: "right",
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'),moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(7, 'days'),moment()],
        'Last Month': [moment().subtract(1, 'month'), moment()],
        'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      }
    };
  }

  ngOnInit(): void {
    this.chosenDateRange = {
      start: moment(),
      end: moment(),
    };
    this.applyDate(null);
  }

  applyDate(event){
    if(event != null){
      this.chosenDateRange['start'] = event['start'];
      this.chosenDateRange['end'] = event['end'];
    }
    this.onSelectDate.emit(this.chosenDateRange);
  }
}

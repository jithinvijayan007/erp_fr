import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range-picker-3',
  templateUrl: './date-range-picker-3.component.html',
  styleUrls: ['./date-range-picker-3.component.scss']
})
export class DateRangePicker3Component implements OnInit, AfterViewInit {
  format = 'DD-MM-YYYY';

  public mainInput = {
    start : moment(new Date()),
    // .subtract(30, 'days'),
  end : moment(new Date())
  };
  @Output() onSelectDate = new EventEmitter<moment.Moment[]>();
  @ViewChild('dateRange') dateRange: ElementRef;
  @Input() date1:Date;
  @Input() date2:Date;
  constructor(private daterangepickerOptions: DaterangepickerConfig) {}


  // https://www.daterangepicker.com/ --- for further reference
  
  ngOnInit() {
    if (this.date1 != undefined && this.date2 != undefined) {
      this.mainInput.start = moment(new Date(this.date1))
      this.mainInput.end = moment(new Date(this.date2))
    }

    this.daterangepickerOptions.settings = {
      locale: { format: 'DD-MM-YYYY' },
      alwaysShowCalendars: false,
      opens: 'right',
      showDropdowns: true,
      minDate: moment().subtract(20, 'years'),
      maxDate: moment().add(10, 'years'),
      ranges: {
        Today: [moment().format(this.format), moment().format(this.format)],
        Yesterday: [
          moment()
            .subtract(1, 'days')
            .format(this.format),
          moment()
            .subtract(1, 'days')
            .format(this.format)
        ],
        'Last 7 Days': [
          moment()
            .subtract(6, 'days')
            .format(this.format),
          moment().format(this.format)
        ],
        'Last 30 Days': [
          moment()
            .subtract(29, 'days')
            .format(this.format),
          moment().format(this.format)
        ],
        'This Month': [
          moment()
            .startOf('month')
            .format(this.format),
          moment()
            .endOf('month')
            .format(this.format)
        ],
        'Last Month': [
          moment()
            .subtract(1, 'month')
            .startOf('month')
            .format(this.format),
          moment()
            .subtract(1, 'month')
            .endOf('month')
            .format(this.format)
        ],
        'Year To Date': [
          moment()
            .startOf('year')
            .format(this.format),
          moment()
            .format(this.format)
        ]
      }
    };
  }
  ngAfterViewInit() {    
    this.triggerFalseClick();
  }
  triggerFalseClick() {    
    const el: HTMLElement = this.dateRange.nativeElement as HTMLElement;
    el.click();
    el.click();
  }
  public applyDate(value: any, dateInput: any) {    
    dateInput.start = moment(value.startDate);
    dateInput.end = moment(value.endDate);
    const datFrom = moment(value.startDate);
    const datTo = moment(value.endDate);
    const date = [datFrom, datTo];
    this.onSelectDate.emit(date);
  }

  public calendarEventsHandler(e: any) {
  }
}

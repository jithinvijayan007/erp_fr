import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-select-drop-down',
  templateUrl: './single-select-drop-down.component.html',
  styleUrls: ['./single-select-drop-down.component.css']
})
export class SingleSelectDropDownComponent implements OnInit {
  // @Input() public name :any
  constructor() { }

  ngOnInit(): void {
    
  }
  ngOnChanges() {
    // console.log(this.name);

    // this.ngOnInit();
  }

}

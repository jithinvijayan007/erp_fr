import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  ngOnInit(){
    console.log(environment.production);
  }
}
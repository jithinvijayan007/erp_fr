import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-form-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})


export class FormBasicComponent {

  displayedColumns =
  ['name', 'position', 'weight', 'symbol', 'position', 'weight', 'symbol', 'total'];
dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  total: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', total:100},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', total:150},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', total:130},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', total:155},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', total:300},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', total:100},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', total:115},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', total:652},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', total:700},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', total:1025},
];
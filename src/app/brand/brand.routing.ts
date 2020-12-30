import { Routes } from '@angular/router';
import { AddbrandComponent} from './addbrand/addbrand.component'
import { BrandlistComponent } from './brandlist/brandlist.component';

export const BrandRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addbrand',
        component: AddbrandComponent,
        data: {
          title: 'Add Brand',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add Brand' }
          ]
        }
      },
      {
        path: 'brandlist',
        component: BrandlistComponent,
        data: {
          title: 'Brand List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Brand List' }
          ]
        }
      },
    ]
  }
];

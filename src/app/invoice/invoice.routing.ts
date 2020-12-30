import { Routes } from '@angular/router';

import { InvoiceviewComponent } from './invoiceview/invoiceview.component';
import { SaleslistComponent } from './saleslist/saleslist.component';
import { AuthGuard } from '../auth.guard';
import { ListinvoiceComponent } from './listinvoice/listinvoice.component';
import { InvoicedetailsComponent } from './invoicedetails/invoicedetails.component';
import { JioinvoiceviewComponent } from './jioinvoiceview/jioinvoiceview.component';
import { InvoiceprintComponent } from './invoiceprint/invoiceprint.component';
import { BallgameinvoiceComponent } from './ballgameinvoice/ballgameinvoice.component';
import { OffersaleslistComponent } from './offersaleslist/offersaleslist.component';
import { ServiceviewComponent } from './serviceview/serviceview.component';
import { ServicelistComponent } from './servicelist/servicelist.component';
import { GdpServiceviewComponent } from './gdp-serviceview/gdp-serviceview.component';
import { SalesreturnComponent } from './salesreturn/salesreturn.component';
import { ReturninvoiceComponent } from './returninvoice/returninvoice.component';
import { InvoicecustomerComponent } from './invoicecustomer/invoicecustomer.component';
import { BajajListComponent } from './bajaj-list/bajaj-list.component';
import { BajajViewComponent } from './bajaj-view/bajaj-view.component';
import { ExchangeListComponent } from './exchange-list/exchange-list.component';
import { ExchangeViewComponent } from './exchange-view/exchange-view.component';
import { SalesReturnListComponent } from './sales-return-list/sales-return-list.component';
import { SalesreturnviewComponent } from './salesreturnview/salesreturnview.component';
import { ApproveListComponent } from './approve-list/approve-list.component';
import { QuotationPrintComponent } from './quotation-print/quotation-print.component';
// import { QuotationViewComponent } from './quotation-view/quotation-view.component';
import { QuotationViewComponent } from './quotation-view/quotation-view.component';

import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { ServiceinvoicelistComponent } from './serviceinvoicelist/serviceinvoicelist.component';
import { CreditapprovalslistComponent } from './creditapprovalslist/creditapprovalslist.component';
import { SezInvoiceComponent } from './sez-invoice/sez-invoice.component';
import { SpecialsaleslistComponent } from './specialsaleslist/specialsaleslist.component';
import { SpecialinvoiceviewComponent } from './specialinvoiceview/specialinvoiceview.component';
import { OnlinesalesorderlistComponent } from './onlinesalesorderlist/onlinesalesorderlist.component';
import { OnlinesalesviewComponent } from './onlinesalesview/onlinesalesview.component';

export const InvoiceRoutes: Routes = [
  
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'invoiceview',
        component: InvoiceviewComponent,
        data: {
          title: 'invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'invoice' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'serviceinvoiceview',
        component: JioinvoiceviewComponent,
        data: {
          title: 'Service invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Service invoice' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'saleslist',
        component: SaleslistComponent,
        data: {
          title: 'sales list ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'sales list' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'listinvoice',
        component: ListinvoiceComponent,
        data: {
          title: 'list invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'list invoice' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'invoicedetails',
        component: InvoicedetailsComponent,
        data: {
          title: 'invoice details ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'invoice details' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'invoiceprint',
        component: InvoiceprintComponent,
        data: {
          title: 'invoice print ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'invoice print' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'ballgameinvoice',
        component: BallgameinvoiceComponent,
        data: {
          title: 'invoice ballgame ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'invoice ballgame' }
          ]
        }
      }
    ]
  },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'ballgameview',
  //       component: BallgameviewComponent,
  //       data: {
  //         title: 'invoice ballgame view',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'invoice ballgame view' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  {
    path: '',
    children: [
      {
        path: 'offerlist',
        component: OffersaleslistComponent,
        data: {
          title: 'invoice ballgame view',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'invoice ballgame view' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'serviceview',
        component: ServiceviewComponent,
        data: {
          title: 'service',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'service' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'servicelist',
        component: ServicelistComponent,
        data: {
          title: 'service list ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'service list' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'gdpserviceview',
        component: GdpServiceviewComponent,
        data: {
          title: 'Gdp Service  view ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Gdp Service  view ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'salesreturn',
        component: SalesreturnComponent,
        data: {
          title: 'Sales Return',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Sales Return' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'returninvoice',
        component: ReturninvoiceComponent,
        data: {
          title: 'Return Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Return Invoice' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'invoicecustomer',
        component: InvoicecustomerComponent,
        data: {
          title: 'invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'invoice' }
          ]
        }
      }
    ]
  },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'bajaj_list',
        component: BajajListComponent,
        data: {
          title: 'List Bajaj Enquiry',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'List Bajaj Enquiry' }
          ]
        }
      },
      {
        path: 'bajaj_view',
        component: BajajViewComponent,
        data: {
          title: 'View Bajaj Enquiry',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'View Bajaj Enquiry' }
          ]
        }
      },
    ]
  },
  
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'exchangelist',
        component: ExchangeListComponent,
        data: {
          title: 'exchange',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'exchange' }
          ]
        }
      }
    ]
  },

  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'exchangeview',
        component: ExchangeViewComponent,
        data: {
          title: 'exchange view',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'exchange view' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'salesreturnlist',
        component: SalesReturnListComponent,
        data: {
          title: 'Sales Return List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Sales Return List' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'salesreturnview',
        component: SalesreturnviewComponent,
        data: {
          title: 'Sales Return View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Sales Return View' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'approvelist',
        component: ApproveListComponent,
        data: {
          title: 'Approve List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Approve List' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'quotationprint',
        component: QuotationPrintComponent,
        data: {
          title: 'Quotation Print',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Quotation Print' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'quotationlist',
        component: QuotationListComponent,
        data: {
          title: 'Quotation List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Quotation List' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'quotationview',
        component: QuotationViewComponent,
        data: {
          title: 'Quotation View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Quotation View' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'serviceinvoicelist',
        component: ServiceinvoicelistComponent,
        data: {
          title: 'Service Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Service Invoice' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'creditapprovallist',
        component: CreditapprovalslistComponent,
        data: {
          title: 'Credit Sale',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Credit Sale' }
          ]
        }
      }
    ]
  } ,
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'sezinvoice',
        component: SezInvoiceComponent,
        data: {
          title: 'Sez Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Sez Invoice' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'specialsaleslist',
        component: SpecialsaleslistComponent,
        data: {
          title: 'Special Sales List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Special Sales List' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'specialinvoice',
        component: SpecialinvoiceviewComponent,
        data: {
          title: 'Special Invoice View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Special Invoice View' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'onlinesaleslist',
        component: OnlinesalesorderlistComponent,
        data: {
          title: 'Online Sales Order List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Online Sales Order List' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'onlineinvoice',
        component: OnlinesalesviewComponent,
        data: {
          title: 'Online Invoice View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Online Invoice View' }
          ]
        }
      }
    ]
  }

];
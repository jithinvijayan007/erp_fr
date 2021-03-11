import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockReportComponent } from './stock-report/stock-report.component';
import { ClientStatementComponent } from './client-statement/client-statement.component';
import { DetailsSalesreportComponent } from './details-salesreport/details-salesreport.component';
import { SmartChoiceReportComponent } from './smart-choice-report/smart-choice-report.component';
import { GdpGdewReportComponent } from './gdp-gdew-report/gdp-gdew-report.component';
import { RechargeProfitReportComponent } from './recharge-profit-report/recharge-profit-report.component';
import { ProductProfitReportComponent } from './product-profit-report/product-profit-report.component';
import { SmartChoiceSaleComponent } from './smart-choice-sale/smart-choice-sale.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { DetailedModelWiseSalesReportComponent } from './detailed-model-wise-sales-report/detailed-model-wise-sales-report.component';
import { CreditsalereportComponent } from './creditsalereport/creditsalereport.component';
import { EmisalesreportComponent } from './emisalesreport/emisalesreport.component';
import { DayclosurereportComponent } from './dayclosurereport/dayclosurereport.component';
import { BranchReportComponent } from './branch-report/branch-report.component'
import { MobilebranchsalesreportComponent } from './mobilebranchsalesreport/mobilebranchsalesreport.component';
import { ReportComponent } from './report.component';
import { SalesproductivityreportComponent } from './salesproductivityreport/salesproductivityreport.component';
import { ProductReportSalesMobileComponent } from './product-report-sales-mobile/product-report-sales-mobile.component';
import { GeneralizeReportComponent } from './generalize-report/generalize-report.component';

// import { ReportComponent } from './report2/report.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'stockreport',
        component: StockReportComponent,
        data: {
          title: 'stock report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'stock report ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'clientoutstanding',
        component: ClientStatementComponent,
        data: {
          title: 'client outstanding report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'client outstanding report ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'details-salesreport',
        component: DetailsSalesreportComponent,
        data: {
          title: 'details sales report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'details sales report ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'purchasereport',
        component: PurchaseReportComponent,
        data: {
          title: 'purchase report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'purchase report ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'smart-choice-report',
        component: SmartChoiceReportComponent,
        data: {
          title: 'smart choice report',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'smart choice report' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'gdp-gdew-report',
        component: GdpGdewReportComponent,
        data: {
          title: 'gdp gdew report',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'gdp gdew report' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'recharge-profit-report',
        component: RechargeProfitReportComponent,
        data: {
          title: 'recharge profit report',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'recharge profit report' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'product-profit-report',
        component: ProductProfitReportComponent,
        data: {
          title: 'product profit report',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'product profit report' }

          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'smart-choice-sale',
        component: SmartChoiceSaleComponent,
        data: {
          title: 'smart choice sale',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'smart choice sale' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'stock-history',
        component: StockHistoryComponent,
        data: {
          title: 'stock history ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'stock history ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'detailed_model_wise_sales_report',
        component: DetailedModelWiseSalesReportComponent,
        data: {
          title: 'Detailed Model Wise Sales Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Detailed Model Wise Sales Report ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'creditsalesreport',
        component: CreditsalereportComponent,
        data: {
          title: 'Credit Sales Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Credit Sales report ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'emisalesreport',
        component: EmisalesreportComponent,
        data: {
          title: 'Credit/Debit EMI Sales Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Credit/Debit EMI Sales report ' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'dayclosurereport',
        component: DayclosurereportComponent,
        data: {
          title: 'Dayclosure Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Dayclosure report ' }
          ]
        }
      }
    ]
  },
  {
    path: 'branchreport',
    children: [
      {
        path: '',
        component: BranchReportComponent,
        data: {
          title: 'Branch Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Branch report ' }
          ]
        }
      }
    ]
  },
  {
    path: 'mobilebranchreport',
    children: [
      {
        path: '',
        component: MobilebranchsalesreportComponent,
        data: {
          title: 'Mobile Branch Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Mobile Branch Report ' }
          ]
        }
      }
    ]
  },
  // {
  //   path: 'report2',
  //   children: [
  //     {
  //       path: '',
  //       component: ReportComponent,
  //       data: {
  //         title: 'Mobile Branch Report ',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'Mobile Branch Report ' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  {
    path: 'productivityreport',
    children: [
      {
        path: '',
        component: SalesproductivityreportComponent,
        data: {
          title: 'Sales Productivity Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Sales Productivity Report ' }
          ]
        }
      }
    ]
  },
  {
    path: 'mobilesalesreport',
    children: [
      {
        path: '',
        component: ProductReportSalesMobileComponent,
        data: {
          title: 'Product Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Product Report' }
          ]
        }
      }
    ]
  },
  {
    path: 'generalizereport',
    children: [
      {
        path: '',
        component: GeneralizeReportComponent,
        data: {
          title: 'Generailize Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Generailize Report ' }
          ]
        }
      }
    ]
  },
  {
    path: 'territoryenquiryreport',
    children: [
      {
        path: '',
        component: GeneralizeReportComponent,
        data: {
          title: 'Territory Enquiry Report ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Generailize Report ' }
          ]
        }
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }

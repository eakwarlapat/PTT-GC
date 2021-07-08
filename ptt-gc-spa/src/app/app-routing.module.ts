import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Templates
import { MainComponent } from '@templates/main/main.component';

// Layouts
import { HeaderComponent } from '@layouts/header/header.component';
import { FooterComponent } from '@layouts/footer/footer.component';

// Components
import { FormTabsComponent } from '@components/form-tabs/form-tabs.component';
import { InformationTabsComponent  } from '@components/information-tabs/information-tabs.component';
import { InvestmentModalComponent  } from '@components/investment-modal/investment-modal.component';
import { InitiativeFormsComponent  } from '@components/initiative-forms/initiative-forms.component';
import { InitiativeHeaderComponent } from '@components/initiative-header/initiative-header.component';
import { AdvanceSearchComponent    } from '@components/advance-search/advance-search.component';
import { InitiativeSearchComponent } from '@components/initiative-search/initiative-search.component';
import { InitiativeLoadComponent   } from '@components/initiative-load/initiative-load.component';
import { InitiativeListComponent   } from '@components/initiative-list/initiative-list.component';
import { InitiativeNoDataComponent } from '@components/initiative-no-data/initiative-no-data.component';
import { InitiativeBoxComponent    } from '@components/initiative-box/initiative-box.component';
import { InitiativeButtonComponent } from '@components/initiative-button/initiative-button.component';
import { InitiativeDetailComponent } from '@components/initiative-detail/initiative-detail.component';
import { InitiativeAttachmentComponent } from './shared/components/initiative-attachment/initiative-attachment.component';
import { InitiativeInformationComponent } from '@components/initiative-information/initiative-information.component';
import { InformationSubmitComponent     } from '@components/information-submit/information-submit.component';
import { InitiativeFileComponent        } from '@components/initiative-file/initiative-file.component';
import { ImpactExcelComponent           } from '@components/impact-excel/impact-excel.component';
import { ViewLogHistoryComponent        } from '@components/view-log-history/view-log-history.component';
import { InitiativeValidateComponent    } from '@components/initiative-validate/initiative-validate.component';
import { LogCommentComponent            } from '@components/log-comment/log-comment.component';
import { AddmoreDirectCapexComponent    } from './shared/addmore/addmore-direct-capex/addmore-direct-capex.component';
import { HistoryStatusComponent         } from '@components/history-status/history-status.component';
import { ContactIoComponent             } from '@components/contact-io/contact-io.component';

// Views
import { ViewGeneralComponent } from '@views/view-general/view-general.component';
import { ViewCimStrategyComponent } from '@views/view-cim-strategy/view-cim-strategy.component';
import { ViewMaxCapexComponent } from '@views/view-max-capex/view-max-capex.component';
import { ViewImpactComponent } from '@views/view-impact/view-impact.component';
import { ViewProgressComponent } from './shared/views/view-progress/view-progress.component';
import { ViewStatusComponent } from './shared/views/view-status/view-status.component';
import { ViewsCapexComponent } from './shared/views/views-capex/views-capex.component';

// Page
import { HomeComponent } from '@pages/home/home.component';
import { MainInitiativeComponent } from '@pages/initiatives/main/main.component';
import { MytaskInitiativeComponent } from '@pages/initiatives/mytask/mytask.component';
import { MyownInitiativeComponent } from '@pages/initiatives/myown/myown.component';
import { OverviewInitiativeComponent } from '@pages/initiatives/overview/overview.component';
import { CreateInitiativeComponent } from '@pages/initiatives/create/create.component';
import { EditInitiativeComponent } from '@pages/initiatives/edit/edit.component';
import { DetailInitiativeComponent } from '@pages/initiatives/detail/detail.component';
import { DetailMaxComponent } from '@pages/initiatives/detail-max/detail-max.component';
import { CapexComponent } from '@pages/initiatives/capex/capex.component';
import { ApproveInitiativeComponent } from '@pages/initiatives/approve/approve.component';
import { InformationComponent } from '@pages/initiatives/information/information.component';
import { ImpactComponent   } from '@pages/initiatives/impact/impact.component';
import { ProgressComponent } from '@pages/initiatives/progress/progress.component';
import { DirectComponent   } from '@pages/initiatives/direct/direct.component';
import { StatusComponent   } from '@pages/initiatives/status/status.component';
import { DimComponent      } from '@pages/initiatives/dim/dim.component';
import { DetailDimComponent } from './pages/initiatives/detail-dim/detail-dim.component';
import { PoolComponent     } from '@pages/initiatives/pool/pool.component';

// NotFound
import { PageNotFoundComponent } from '@pages/page-not-found/page-not-found.component';

// Guard
import { MsalGuard } from '@azure/msal-angular';

import { MyTaskResolver   } from '@resolvers/mytask.resolver';
import { MyOwnResolver    } from '@resolvers/myown.resolver';
import { OverviewResolver } from '@resolvers/overview.resolver';

import { StackedChartComponent } from '@pages/chart/stacked-chart/stacked-chart.component';
import { WaterfallChartComponent } from './pages/chart/waterfall-chart/waterfall-chart.component';
import { PieChartComponent } from './pages/chart/pie-chart/pie-chart.component';
import { LineChartComponent } from './pages/chart/line-chart/line-chart.component';
import { DonutChartComponent } from './pages/chart/donut-chart/donut-chart.component';
import { ColumnrangeChartComponent } from './pages/chart/columnrange-chart/columnrange-chart.component';
import { BarChartComponent } from './pages/chart/bar-chart/bar-chart.component';
import { DashboardComponent } from '@pages/initiatives/dashboard/dashboard.component';
import { DashboardListComponent } from '@components/dashboard-list/dashboard-list.component';
import { DashboardSearchComponent } from '@components/dashboard-search/dashboard-search.component';
import { DashboardFormsComponent } from '@components/dashboard-forms/dashboard-forms.component';
import { BarChartjsComponent } from '@pages/chart/bar-chartjs/bar-chartjs.component';
import { StackedChartjsComponent } from '@pages/chart/stacked-chartjs/stacked-chartjs.component';
import { LineChartjsComponent } from '@pages/chart/line-chartjs/line-chartjs.component';
import { DonutChartjsComponent } from '@pages/chart/donut-chartjs/donut-chartjs.component';
import { PieChartjsComponent } from '@pages/chart/pie-chartjs/pie-chartjs.component';
import { TableChartComponent } from '@pages/chart/table-chart/table-chart.component';
import { ComboChartjsComponent } from '@pages/chart/combo-chartjs/combo-chartjs.component';
import { Reporttest01Component } from '@pages/reporting/reporttest01/reporttest01.component';
import { CustomTableComponent } from '@pages/chart/custom-table/custom-table.component';


// Add more
import { AddmoreComponent } from '../app/pages/initiatives/addmore/addmore.component';
import { AddmoreGeneralComponent } from '../app/shared/addmore/addmore-general/addmore-general.component';
import { AddmoreCapexComponent } from './shared/addmore/addmore-capex/addmore-capex.component';
import { InitiativeredirectorComponent } from '@pages/initiatives/initiativeredirector/initiativeredirector.component';

// Return
import { ReturnComponent } from '../app/pages/initiatives/return/return.component';
import { ReturnGeneralComponent } from '../app/shared/return/return-general/return-general.component';
import { ReturnCapexComponent } from '../app/shared/return/return-capex/return-capex.component';
import { DashboardSystemComponent } from '@pages/initiatives/dashboard-system/dashboard-system.component';

// ViewRevistion
import { ViewRevistionComponent } from '../app/shared/components/view-revistion/view-revistion.component';
import { ViewRevistionAddmoreComponent } from '../app/shared/components/view-revistion-addmore/view-revistion-addmore.component';
import { ViewRevistionReturnComponent } from '../app/shared/components/view-revistion-return/view-revistion-return.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'initiative', component: MainInitiativeComponent, canActivate: [MsalGuard],
        children: [
          { path: 'my-tasks',               component: MytaskInitiativeComponent     , resolve: { initiatives : MyTaskResolver   }},
          { path: 'my-own',                 component: MyownInitiativeComponent      , resolve: { initiatives : MyOwnResolver    }},
          { path: 'overview',               component: OverviewInitiativeComponent   , resolve: { initiatives : OverviewResolver }},
          { path: 'create',                 component: CreateInitiativeComponent     },
          { path: 'edit',                   component: EditInitiativeComponent       },
          { path: 'detail',                 component: DetailInitiativeComponent     },
          { path: 'progress',               component: ProgressComponent             },
          { path: 'detail-max',             component: DetailMaxComponent            },
          { path: 'impact',                 component: ImpactComponent               },
          { path: 'approve',                component: ApproveInitiativeComponent    },
          { path: 'information',            component: InformationComponent          },
          { path: 'direct',                 component: DirectComponent               },
          { path: 'capex/:id',              component: CapexComponent                },
          { path: 'status',                 component: StatusComponent               },
          { path: 'stacked-chart',          component: StackedChartComponent         },
          { path: 'waterfall-chart',        component: WaterfallChartComponent       },
          { path: 'pie-chart',              component: PieChartComponent             },
          { path: 'line-chart',             component: LineChartComponent            },
          { path: 'donut-chart',            component: DonutChartComponent           },
          { path: 'columnrange-chart',      component: ColumnrangeChartComponent     },
          { path: 'bar-chart',              component: BarChartComponent             },
          { path: 'dashboard',              component: DashboardComponent            },
          { path: 'bar-chartjs',            component: BarChartjsComponent           },
          { path: 'stacked-chartjs',        component: StackedChartjsComponent       },
          { path: 'line-chartjs',           component: LineChartjsComponent          },
          { path: 'donut-chartjs',          component: DonutChartjsComponent         },
          { path: 'pie-chartjs',            component: PieChartjsComponent           },
          { path: 'table-chart',            component: TableChartComponent           },
          { path: 'combo-chartjs',          component: ComboChartjsComponent         },
          { path: 'reporttest01',           component: Reporttest01Component         },
          { path: 'custom-table',           component: CustomTableComponent          },
          { path: 'reporttest01',           component: Reporttest01Component         },
          { path: 'addmore',                component: AddmoreComponent              },
          { path: 'addmore-general',        component: AddmoreGeneralComponent       },
          { path: 'addmore-capex',          component: AddmoreCapexComponent         },
          { path: 'initiativeredirector',   component: InitiativeredirectorComponent },
          { path: 'return',                 component: ReturnComponent               },
          { path: 'return-general',         component: ReturnGeneralComponent        },
          { path: 'return-capex',           component: ReturnCapexComponent          },
          { path: 'dashboard-builtin',      component: DashboardSystemComponent      },
          { path: 'view-revistion',         component: ViewRevistionComponent        },
          { path: 'view-revistion-addmore', component: ViewRevistionAddmoreComponent },
          { path: 'view-revistion-return',  component: ViewRevistionReturnComponent  },
          { path: 'dim',                    component: DimComponent                  },
          { path: 'detail-dim',             component: DetailDimComponent            },
          { path: 'pool',                   component: PoolComponent                 },
        ]
      },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const RouterComponents = [
  // Templates
  MainComponent,
  // Layouts
  HeaderComponent,
  FooterComponent,
  // Components
  FormTabsComponent,
  InformationTabsComponent,
  InvestmentModalComponent,
  InitiativeFormsComponent,
  InitiativeHeaderComponent,
  AdvanceSearchComponent,
  InitiativeSearchComponent,
  InitiativeLoadComponent,
  InitiativeListComponent,
  InitiativeNoDataComponent,
  InitiativeBoxComponent,
  InitiativeButtonComponent,
  InitiativeDetailComponent,
  InitiativeAttachmentComponent,
  InitiativeInformationComponent,
  InformationSubmitComponent,
  InitiativeFileComponent,
  ImpactExcelComponent,
  ViewLogHistoryComponent,
  InitiativeValidateComponent,
  LogCommentComponent,
  AddmoreDirectCapexComponent,
  HistoryStatusComponent,
  DimComponent,
  DetailDimComponent,
  ContactIoComponent,
  PoolComponent,
   // Views
   ViewGeneralComponent,
   ViewCimStrategyComponent,
   ViewMaxCapexComponent,
   ViewImpactComponent,
   ViewProgressComponent,
   ViewStatusComponent,
   ViewsCapexComponent,
  // Page
  HomeComponent,
  MainInitiativeComponent,
  MytaskInitiativeComponent,
  MyownInitiativeComponent,
  OverviewInitiativeComponent,
  CreateInitiativeComponent,
  EditInitiativeComponent,
  DetailInitiativeComponent,
  DetailMaxComponent,
  CapexComponent,
  ApproveInitiativeComponent,
  InformationComponent,
  ImpactComponent,
  ProgressComponent,
  DirectComponent,
  StatusComponent,
  // Chart
  StackedChartComponent,
  WaterfallChartComponent,
  PieChartComponent,
  LineChartComponent,
  DonutChartComponent,
  ColumnrangeChartComponent,
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  BarChartComponent,
  DonutChartComponent,
  ColumnrangeChartComponent,
  WaterfallChartComponent,
  InitiativeAttachmentComponent,
  BarChartjsComponent,
  LineChartjsComponent,
  PieChartjsComponent,
  StackedChartjsComponent,
  DonutChartjsComponent,
  ViewsCapexComponent,
  TableChartComponent,
  ComboChartjsComponent,
  AddmoreCapexComponent,
  AddmoreGeneralComponent,
  AddmoreComponent,
  CustomTableComponent,
  // NotFound
  PageNotFoundComponent,
  DashboardComponent,
  DashboardListComponent,
  DashboardSearchComponent,
  DashboardFormsComponent,
  Reporttest01Component,
  InitiativeredirectorComponent,
  DashboardSystemComponent,
];

export const Resolver = [
  MyTaskResolver,
  MyOwnResolver,
  OverviewResolver
];

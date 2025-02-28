import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { routes } from './app.routes';
// import { CalendarModule, DateAdapter, CalendarNativeDateFormatter } from 'angular-calendar';
// import { adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FinancesComponent } from './components/finances/finances.component';
import { NgbModule, NgbDatepickerModule, NgbToastModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { WriteNewTicketComponent } from './components/write-new-ticket/write-new-ticket.component';
import { ScanTextNewTicketComponent } from './components/scan-text-new-ticket/scan-text-new-ticket.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// import { ChartData, ChartEvent, ChartType } from 'chart.js';
// import { ChartsModule } from 'ng2-charts';
// import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
// import 'chartjs-plugin-labels';

import { GoogleChartsModule } from 'angular-google-charts';
import { CategoriesComponent } from './components/categories/categories.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DetailGoodComponent } from './components/detail-good/detail-good.component';
import { GoodStatisticComponent } from './components/good-statistic/good-statistic.component';
import { TopStoreComponent } from './components/top-store/top-store.component';
import { StoreComponent } from './components/store/store.component';
import { EarningsComponent } from './components/earnings/earnings.component';
import { EarningStComponent } from './components/earning-st/earning-st.component';
import { EarningDetailsComponent } from './components/earning-details/earning-details.component';
import { ReportComponent } from './components/report/report.component';
import { HomeComponent } from './components/home/home.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { CheckSignInComponent } from './components/check-sign-in/check-sign-in.component';
// import { environments } from '../environments/environments';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FinancesComponent,
    CalendarComponent,
    AddTicketComponent,
    AddCategoryComponent,
    WriteNewTicketComponent,
    ScanTextNewTicketComponent,
    CategoriesComponent,
    DetailGoodComponent,
    GoodStatisticComponent,
    TopStoreComponent,
    StoreComponent,
    EarningsComponent,
    EarningStComponent,
    EarningDetailsComponent,
    ReportComponent,
    HomeComponent,
    LoaderComponent,
    AddClientComponent,
    CheckSignInComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterOutlet,
    RouterModule.forRoot(routes),
    NgbModule,
    NgbDatepickerModule,
    JsonPipe,
    NgbToastModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    // BaseChartDirective,
    GoogleChartsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,

  
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    //   useClass: CalendarNativeDateFormatter
    // }),

  ],
  providers: [
    // [ provideCharts ( withDefaultRegisterables ( ) ) ]
  
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
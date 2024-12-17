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
    NgbTypeaheadModule
  
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    //   useClass: CalendarNativeDateFormatter
    // }),

  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
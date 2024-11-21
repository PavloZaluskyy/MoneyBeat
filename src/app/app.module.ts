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
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FinancesComponent,
    CalendarComponent
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
    JsonPipe
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    //   useClass: CalendarNativeDateFormatter
    // }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
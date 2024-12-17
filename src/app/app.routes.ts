import { Routes } from '@angular/router';
import { FinancesComponent } from './components/finances/finances.component';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { WriteNewTicketComponent } from './components/write-new-ticket/write-new-ticket.component';

export const routes: Routes = [
    // {path: "finances", component: FinancesComponent}
    {path: "", component: FinancesComponent},
    {path: "new-ticket", component: AddTicketComponent},
    {path: "add-category", component: AddCategoryComponent},
    {path: "new-ticket/write-ticket", component: WriteNewTicketComponent},
];

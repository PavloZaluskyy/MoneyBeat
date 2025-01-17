import { Routes } from '@angular/router';
import { FinancesComponent } from './components/finances/finances.component';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { WriteNewTicketComponent } from './components/write-new-ticket/write-new-ticket.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DetailGoodComponent } from './components/detail-good/detail-good.component';

export const routes: Routes = [
    // {path: "finances", component: FinancesComponent}
    {path: "", component: FinancesComponent},
    {path: "new-ticket", component: AddTicketComponent},
    {path: "add-category", component: AddCategoryComponent},
    {path: "category/:name", component: CategoriesComponent},
    {path: "detail/:id", component: DetailGoodComponent},
    {path: "new-ticket/write-ticket", component: WriteNewTicketComponent},
];

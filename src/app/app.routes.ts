import { Routes } from '@angular/router';
import { FinancesComponent } from './components/finances/finances.component';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { WriteNewTicketComponent } from './components/write-new-ticket/write-new-ticket.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DetailGoodComponent } from './components/detail-good/detail-good.component';
import { GoodStatisticComponent } from './components/good-statistic/good-statistic.component';
import { TopStoreComponent } from './components/top-store/top-store.component';
import { StoreComponent } from './components/store/store.component';
import { EarningsComponent } from './components/earnings/earnings.component';
import { EarningStComponent } from './components/earning-st/earning-st.component';
import { EarningDetailsComponent } from './components/earning-details/earning-details.component';
import { ReportComponent } from './components/report/report.component';
import { HomeComponent } from './components/home/home.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { SettingClientComponent } from './components/setting-client/setting-client.component';
import { SettingCostComponent } from './components/setting-cost/setting-cost.component';
import { EditReceiptComponent } from './components/edit-receipt/edit-receipt.component';
import { SettingEarningComponent } from './components/setting-earning/setting-earning.component';
import { EditEarningComponent } from './components/edit-earning/edit-earning.component';
import { ManualComponent } from './components/manual/manual.component';

export const routes: Routes = [
    {path: "finances", component: FinancesComponent},
    {path: "", component: HomeComponent},
    {path: "new-ticket", component: AddTicketComponent},
    {path: "add-category", component: AddCategoryComponent},
    {path: "category/:name", component: CategoriesComponent},
    {path: "detail/:id", component: DetailGoodComponent},
    {path: "new-ticket/write-ticket", component: WriteNewTicketComponent},
    {path: "good/:name", component: GoodStatisticComponent},
    {path: "top-store", component: TopStoreComponent},
    {path: "store/:name", component: StoreComponent},
    {path: "earnings", component: EarningsComponent},
    {path: "earnings-statistic", component: EarningStComponent},
    {path: "earning-details/:id", component: EarningDetailsComponent},
    {path: "report", component: ReportComponent},
    {path: "add-client", component: AddClientComponent},
    {path: "settings-client", component: SettingClientComponent},
    {path: "settings-cost", component: SettingCostComponent},
    {path: "edit-receipt/:id", component: EditReceiptComponent},
    {path: "settings-earning", component: SettingEarningComponent},
    {path: "edit-earning/:id", component: EditEarningComponent},
    {path: "manual", component: ManualComponent},

];

import { Routes } from '@angular/router';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

export const routes: Routes = [
    { path: 'admin', component: AdminPageComponent, pathMatch: 'full' }
];

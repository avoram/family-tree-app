import { Routes } from '@angular/router';

import { MainViewComponent } from './features/main/main-view.component';

export const routes: Routes = [
  { path: '', component: MainViewComponent },
  { path: '**', redirectTo: '' },
];
